export class AuthorizationError extends Error {
  constructor(message = "This operation is not authorized.", status = 403) {
    super(message);
    this.name = "AuthorizationError";
    this.status = status;
  }
}

export function isAllowListedAdmin(identity, adminRecord) {
  return Boolean(
    identity?.uid &&
    identity.admin === true &&
    identity.email_verified === true &&
    adminRecord?.active === true &&
    adminRecord.uid === identity.uid,
  );
}

export function requireAdmin(identity, adminRecord) {
  if (!identity) throw new AuthorizationError("Authentication is required.", 401);
  if (!isAllowListedAdmin(identity, adminRecord)) throw new AuthorizationError();
  return { uid: identity.uid, email: identity.email ?? "" };
}

export function requireRecentAuthentication(identity, maximumAgeSeconds = 300, nowSeconds = Date.now() / 1000) {
  if (!Number.isFinite(identity?.auth_time) || nowSeconds - identity.auth_time > maximumAgeSeconds) {
    throw new AuthorizationError("Recent authentication is required.", 401);
  }
}
