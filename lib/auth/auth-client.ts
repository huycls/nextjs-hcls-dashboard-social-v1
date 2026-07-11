import { parseApiError } from "@/lib/automations/automations-api";
import { BACKEND_BASE_URL } from "@/lib/api/backend-config";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import {
  clearUserProfile,
  mergeUserProfile,
  readUserProfile,
} from "@/lib/auth/user-profile";

const ONE_DAY_SECONDS = 60 * 60 * 24;
const THIRTY_DAYS_SECONDS = ONE_DAY_SECONDS * 30;

type LoginResponsePayload = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
};

export type LoginResult = {
  ok: boolean;
  message?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  } | null;
};

function getAuthLoginUrl() {
  return `${BACKEND_BASE_URL}/api/auth/login`;
}

function extractAccessToken(payload: LoginResponsePayload) {
  return payload.access_token ?? payload.accessToken ?? payload.token ?? null;
}

function setAuthCookie(token: string, rememberMe: boolean) {
  const maxAge = rememberMe ? THIRTY_DAYS_SECONDS : ONE_DAY_SECONDS;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

export function getClientAuthToken(): string | null {
  if (typeof document === "undefined") return null;

  for (const cookie of document.cookie.split("; ")) {
    const separatorIndex = cookie.indexOf("=");
    if (separatorIndex === -1) continue;

    const name = cookie.slice(0, separatorIndex);
    if (name !== AUTH_COOKIE_NAME) continue;

    return decodeURIComponent(cookie.slice(separatorIndex + 1));
  }

  return null;
}

export function getClientAuthHeaders(): Record<string, string> {
  const token = getClientAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginWithCredentials(
  email: string,
  password: string,
  rememberMe: boolean,
): Promise<LoginResult> {
  try {
    const response = await fetch(getAuthLoginUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return {
        ok: false,
        message: await parseApiError(response),
      };
    }

    const data = (await response.json()) as LoginResponsePayload;
    const token = extractAccessToken(data);

    if (!token) {
      return {
        ok: false,
        message: "Login succeeded but no access token returned.",
      };
    }

    setAuthCookie(token, rememberMe);

    const current = readUserProfile();
    mergeUserProfile({
      id: data.user?.id ?? current.id,
      name: data.user?.name?.trim() || current.name,
      email: data.user?.email?.trim() || email.trim() || current.email,
    });

    return {
      ok: true,
      user: data.user ?? null,
    };
  } catch (error) {
    const hint =
      error instanceof Error ? error.message : "Unknown connection error";

    return {
      ok: false,
      message: `Could not reach backend at ${getAuthLoginUrl()}. ${hint}`,
    };
  }
}

export async function logout() {
  clearAuthCookie();
  clearUserProfile();
}
