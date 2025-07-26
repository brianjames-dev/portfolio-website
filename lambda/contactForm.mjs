import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import https from "https";

const ses = new SESClient({ region: "us-west-1" }); // or 'us-west-2' to match your region

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const TO_EMAIL = process.env.SES_TO_EMAIL;
const FROM_EMAIL = process.env.SES_FROM_EMAIL;

export const handler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  const { name, email, message, captchaToken } = body;

  if (!captchaToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing reCAPTCHA token" }),
    };
  }

  const isHuman = await verifyCaptcha(captchaToken);
  if (!isHuman) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Failed reCAPTCHA verification" }),
    };
  }

  const emailParams = {
    Destination: { ToAddresses: [TO_EMAIL] },
    Message: {
      Body: {
        Text: { Data: `New message from ${name} <${email}>:\n\n${message}` },
      },
      Subject: { Data: `Contact Form Submission from ${name}` },
    },
    Source: FROM_EMAIL,
  };

  try {
    await ses.send(new SendEmailCommand(emailParams));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (err) {
    console.error("SES error:", err);
    return {
      statusCode: 500,
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
