/* eslint-env node */
import crypto from "crypto";

const GALLERY_PASSWORD = process.env.GALLERY_PASSWORD || "";
const GALLERY_TOKEN_SECRET = process.env.GALLERY_TOKEN_SECRET || "";
const TOKEN_TTL_MS = Number(process.env.GALLERY_TOKEN_TTL_MS || 1000 * 60 * 60 * 24 * 7);

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({}),
    };
  }

  const body = JSON.parse(event.body || "{}");
  const { password, token } = body;

  if (password) {
    return handleUnlock(password);
  }

  if (token) {
    return handleVerify(token);
  }

  return {
    statusCode: 400,
    headers: corsHeaders(),
    body: JSON.stringify({ error: "Missing password or token" }),
  };
};

function handleUnlock(password) {
  if (!GALLERY_PASSWORD || !GALLERY_TOKEN_SECRET) {
    return {
      statusCode: 503,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Unlock service not configured" }),
    };
  }

  const matches = safeCompare(password, GALLERY_PASSWORD);
  if (!matches) {
    return {
      statusCode: 401,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Invalid password" }),
    };
  }

  const now = Date.now();
  const exp = now + TOKEN_TTL_MS;
  const token = signToken({ exp, iat: now, jti: crypto.randomBytes(16).toString("hex") });

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({ token, expiresAt: exp }),
  };
}

function handleVerify(token) {
  if (!GALLERY_TOKEN_SECRET) {
    return {
      statusCode: 503,
      headers: corsHeaders(),
      body: JSON.stringify({ valid: false, error: "Verification not configured" }),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      statusCode: 401,
      headers: corsHeaders(),
      body: JSON.stringify({ valid: false }),
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({ valid: true, exp: payload.exp }),
  };
}

function base64UrlEncode(input) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input) {
  return Buffer.from(input, "base64url").toString();
}

function signToken(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", GALLERY_TOKEN_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");

  return `${headerB64}.${payloadB64}.${signature}`;
}

function verifyToken(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signature] = parts;
  const expected = crypto
    .createHmac("sha256", GALLERY_TOKEN_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");

  if (!safeCompare(signature, expected)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch (error) {
    return null;
  }
}

function safeCompare(a, b) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}
