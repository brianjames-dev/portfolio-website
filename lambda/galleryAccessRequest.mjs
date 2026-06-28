/* eslint-env node */
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import https from "https";

const ses = new SESClient({ region: "us-west-1" });

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const TO_EMAIL = process.env.SES_TO_EMAIL;
const FROM_EMAIL = process.env.SES_FROM_EMAIL || "no-reply@brianjames.dev";
const APPROVAL_BASE_URL = process.env.GALLERY_APPROVAL_BASE_URL || "";
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 4000;

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

  const body = parseBody(event.body);
  if (!body.ok) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  if (!RECAPTCHA_SECRET_KEY || !TO_EMAIL || !FROM_EMAIL) {
    return {
      statusCode: 503,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Access request service is not configured" }),
    };
  }

  const validation = validateAccessRequestBody(body.value);
  if (!validation.ok) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: validation.error }),
    };
  }

  const { name, email, message, captchaToken } = validation.value;

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

function parseBody(rawBody) {
  try {
    return { ok: true, value: JSON.parse(rawBody || "{}") };
  } catch (error) {
    return { ok: false };
  }
}

function validateAccessRequestBody(body) {
  const name = normalizeField(body.name);
  const email = normalizeField(body.email).toLowerCase();
  const message = normalizeField(body.message);
  const captchaToken = normalizeField(body.captchaToken);

  if (!name || !email || !message) {
    return { ok: false, error: "Name, email, and message are required" };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, error: "Name is too long" };
  }
  if (email.length > MAX_EMAIL_LENGTH || !isValidEmail(email)) {
    return { ok: false, error: "Enter a valid email address" };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: "Message is too long" };
  }

  return { ok: true, value: { name, email, message, captchaToken } };
}

function normalizeField(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function verifyCaptcha(token) {
  const postData = new URLSearchParams({
    secret: RECAPTCHA_SECRET_KEY,
    response: token,
  }).toString();
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
