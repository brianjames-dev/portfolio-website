/* eslint-env node */
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import https from "https";

const ses = new SESClient({ region: "us-west-1" });

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const TO_EMAIL = process.env.SES_TO_EMAIL;
const FROM_EMAIL = process.env.SES_FROM_EMAIL || "no-reply@brianjames.dev";
const APPROVAL_BASE_URL = process.env.GALLERY_APPROVAL_BASE_URL || "";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({}),
    };
  }

  const body = JSON.parse(event.body || "{}");
  const { name, email, message, captchaToken } = body;

  if (!captchaToken) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Missing reCAPTCHA token" }),
    };
  }

  const isHuman = await verifyCaptcha(captchaToken);
  if (!isHuman) {
    return {
      statusCode: 403,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Failed reCAPTCHA verification" }),
    };
  }

  const approveUrl = APPROVAL_BASE_URL
    ? `${APPROVAL_BASE_URL}?email=${encodeURIComponent(email)}`
    : "";
  const approveHint = approveUrl
    ? `Approve request: ${approveUrl}`
    : "Approve request by replying with the password when you're ready.";

  const emailParams = {
    Destination: { ToAddresses: [TO_EMAIL] },
    Message: {
      Subject: { Data: `Gallery Access Request from ${name}` },
      Body: {
        Text: {
          Data: `Gallery access request from ${name} <${email}>:\n\n${message}\n\n${approveHint}`,
        },
      },
    },
    Source: FROM_EMAIL,
    ReplyToAddresses: [email],
  };

  try {
    await ses.send(new SendEmailCommand(emailParams));

    const confirmationParams = {
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "Access request received" },
        Body: {
          Text: {
            Data: `Hey ${name},\n\nThanks for the request. I review these manually and will follow up soon.\n\nHere’s a copy of what you sent:\n\n"${message}"\n\n— Brian James`,
          },
        },
      },
      Source: FROM_EMAIL,
      ReplyToAddresses: [TO_EMAIL],
    };

    await ses.send(new SendEmailCommand(confirmationParams));

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Request sent successfully" }),
    };
  } catch (err) {
    console.error("SES error:", JSON.stringify(err, null, 2));
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};

function verifyCaptcha(token) {
  const postData = `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`;
  const options = {
    hostname: "www.google.com",
    path: "/recaptcha/api/siteverify",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          resolve(result.success);
        } catch (e) {
          resolve(false);
        }
      });
    });

    req.on("error", () => resolve(false));
    req.write(postData);
    req.end();
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
