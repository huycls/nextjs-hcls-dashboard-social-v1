import { cookies } from "next/headers";

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ?? "http://localhost:5000";

export const AUTH_COOKIE_NAME = "avispark_token";

export const AUTH_API = {
  baseUrl: BACKEND_BASE_URL.replace(/\/$/, ""),
  loginPath: "/api/auth/login",
};

export function getAuthLoginUrl() {
  return `${AUTH_API.baseUrl}${AUTH_API.loginPath}`;
}

export type LoginResponsePayload = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
};

export function extractAccessToken(payload: LoginResponsePayload) {
  return payload.access_token ?? payload.accessToken ?? payload.token ?? null;
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();

  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
}
