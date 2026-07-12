import { parseApiError } from "@/lib/automations/automations-api";
import {
  clearUserProfile,
  mergeUserProfile,
  readUserProfile,
} from "@/lib/auth/user-profile";

type LoginResponsePayload = {
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

const AUTH_LOGIN_URL = "/api/auth/login";
const AUTH_LOGOUT_URL = "/api/auth/logout";

/** Clear legacy JS-readable token leftovers from older auth versions */
function clearLegacyClientTokenStores() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("Avispark-access-token");
    localStorage.removeItem(
      "d2e035765c876e1de7d17f120479a7a4a548e53174e2e196ad543a80f49247fb",
    );
  } catch {
    // ignore
  }

  // Only clears a non-HttpOnly duplicate. Cannot remove HttpOnly cookies.
  if (
    document.cookie
      .split(";")
      .some((part) => part.trim().startsWith("avispark_token="))
  ) {
    document.cookie = "avispark_token=; path=/; max-age=0";
  }
}

export async function loginWithCredentials(
  email: string,
  password: string,
  rememberMe: boolean,
): Promise<LoginResult> {
  try {
    const response = await fetch(AUTH_LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) {
      return {
        ok: false,
        message: await parseApiError(response),
      };
    }

    const data = (await response.json()) as LoginResponsePayload;

    clearLegacyClientTokenStores();

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
      message: `Could not reach login API at ${AUTH_LOGIN_URL}. ${hint}`,
    };
  }
}

export async function logout() {
  try {
    await fetch(AUTH_LOGOUT_URL, { method: "POST" });
  } catch {
    // still clear client state
  }

  clearLegacyClientTokenStores();
  clearUserProfile();
}
