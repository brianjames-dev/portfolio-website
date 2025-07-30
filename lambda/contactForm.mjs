import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import https from "https";

const ses = new SESClient({ region: "us-west-1" });

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const TO_EMAIL = process.env.SES_TO_EMAIL;
const FROM_EMAIL = process.env.SES_FROM_EMAIL || "no-reply@brianjames.dev";

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

  const emailParams = {
    Destination: { ToAddresses: [TO_EMAIL] },
    Message: {
      Subject: { Data: `Contact Form Submission from ${name}` },
      Body: {
        Text: {
          Data: `New message from ${name} <${email}>:\n\n${message}`
        },
      },
    },
    Source: FROM_EMAIL,
    ReplyToAddresses: [email],
  };

  try {
    await ses.send(new SendEmailCommand(emailParams));
  
    const confirmationParams = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Thanks for the message!",
        },
        Body: {
          Text: {
            Data: `Hey ${name},\n\nThanks for checking out out my portfolio, I really appreciate the time. If you're expecting an email back, I'll be replying as soon as I can.\n\nHere’s a copy of what you sent:\n\n"${message}"\n\n— Brian James`,
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
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (err) {
    console.error("SES error:", JSON.stringify(err, null, 2));
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Failed to send email", details: err.message || err }),
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
