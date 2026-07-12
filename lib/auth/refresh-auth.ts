import { BACKEND_BASE_URL } from "@/lib/api/backend-config";
import { normalizeAccessToken } from "@/lib/auth/auth-cookie";

export type BackendAuthTokens = {
  accessToken: string;
  refreshToken?: string | null;
  user?: {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
  } | null;
};

type BackendAuthPayload = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
  user?: BackendAuthTokens["user"];
};

export function extractAuthTokens(
  payload: BackendAuthPayload,
): BackendAuthTokens | null {
  const accessRaw =
    payload.accessToken ?? payload.access_token ?? payload.token ?? null;
  if (!accessRaw) return null;

  const refreshRaw = payload.refreshToken ?? payload.refresh_token ?? null;

  return {
    accessToken: normalizeAccessToken(accessRaw),
    refreshToken: refreshRaw ? normalizeAccessToken(refreshRaw) : null,
    user: payload.user ?? null,
  };
}

/** Exchange refresh token for a new access (+ rotated refresh) pair. */
export async function refreshAuthTokens(
  refreshToken: string,
): Promise<BackendAuthTokens | null> {
  let response: Response;

  try {
    response = await fetch(`${BACKEND_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: normalizeAccessToken(refreshToken),
      }),
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (!response.ok) return null;

  try {
    const payload = (await response.json()) as BackendAuthPayload;
    return extractAuthTokens(payload);
  } catch {
    return null;
  }
}
