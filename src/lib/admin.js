export function extractAdminKey(request) {
  const headerKey = request.headers.get("x-admin-key");
  if (headerKey) return headerKey;

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return "";

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return authHeader;
}

export function isAdminAuthorized(request) {
  const expectedKey = process.env.ADMIN_PANEL_KEY;
  if (!expectedKey) return false;

  const providedKey = extractAdminKey(request);
  return Boolean(providedKey) && providedKey === expectedKey;
}
