const encoder = new TextEncoder();
export const PHASE_ONE_COOKIE = "anughara_phase1_session";

const DEFAULT_SECRET = "anughara_phase1_super_secure_session_secret_key_2026_x89f_99z";

function toBase64Url(value) {
  const bytes = typeof value === "string" ? encoder.encode(value) : new Uint8Array(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("Invalid base64url value.");
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  if (toBase64Url(bytes) !== value) throw new Error("Non-canonical base64url value.");
  return bytes;
}

async function signingKey() {
  const secret = process.env.PHASE_ONE_SESSION_SECRET || DEFAULT_SECRET;
  if (!secret || secret.length < 16) return null;
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createPhaseOneSession(email) {
  const key = await signingKey();
  if (!key) throw new Error("Admin session authentication key is not configured.");
  const payload = toBase64Url(JSON.stringify({ email, exp: Date.now() + 4 * 60 * 60 * 1000 }));
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toBase64Url(signature)}`;
}

export async function verifyPhaseOneSession(token) {
  try {
    const key = await signingKey();
    if (!key || !token) return null;
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return null;
    const valid = await crypto.subtle.verify("HMAC", key, fromBase64Url(signature), encoder.encode(payload));
    if (!valid) return null;
    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function phaseOneCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 4 * 60 * 60 };
}
