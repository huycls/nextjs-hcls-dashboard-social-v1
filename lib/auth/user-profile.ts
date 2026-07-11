import { USER_PROFILE_STORAGE_KEY } from "@/lib/auth/constants";

export type UserProfile = {
  id?: string;
  name: string;
  email: string;
  title: string;
  phone: string;
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Huy Nguyen",
  email: "",
  title: "",
  phone: "",
};

export function getUserInitials(name: string, email?: string) {
  const trimmed = name.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  }

  const mail = email?.trim() ?? "";
  if (mail) return mail.slice(0, 2).toUpperCase();
  return "U";
}

export function readUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_USER_PROFILE;

  try {
    const raw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return {
      id: parsed.id,
      name: parsed.name?.trim() || DEFAULT_USER_PROFILE.name,
      email: parsed.email?.trim() || "",
      title: parsed.title?.trim() || "",
      phone: parsed.phone?.trim() || "",
    };
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function writeUserProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;

  const next: UserProfile = {
    id: profile.id,
    name: profile.name.trim() || DEFAULT_USER_PROFILE.name,
    email: profile.email.trim(),
    title: profile.title.trim(),
    phone: profile.phone.trim(),
  };

  localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("avispark-user-profile-updated"));
}

export function clearUserProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
  window.dispatchEvent(new Event("avispark-user-profile-updated"));
}

export function mergeUserProfile(patch: Partial<UserProfile>) {
  const current = readUserProfile();
  const next: UserProfile = {
    ...current,
    ...patch,
    name: (patch.name ?? current.name).trim() || DEFAULT_USER_PROFILE.name,
    email: (patch.email ?? current.email).trim(),
    title: (patch.title ?? current.title).trim(),
    phone: (patch.phone ?? current.phone).trim(),
  };
  writeUserProfile(next);
  return next;
}
