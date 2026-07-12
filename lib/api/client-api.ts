/**
 * Same-origin BFF paths — mirror Nest (`/api/automations`, `/api/jobs`, …).
 * Browser never talks to Nest directly; Route Handler attaches Bearer from HttpOnly cookie.
 */
export function getProxyApiUrl(backendApiPath: string) {
  const normalized = backendApiPath.startsWith("/")
    ? backendApiPath
    : `/${backendApiPath}`;
  return normalized;
}
