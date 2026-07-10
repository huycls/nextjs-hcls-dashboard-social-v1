"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_USER_PROFILE,
  readUserProfile,
  type UserProfile,
} from "@/lib/auth/user-profile";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function sync() {
      setProfile(readUserProfile());
      setReady(true);
    }

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("avispark-user-profile-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("avispark-user-profile-updated", sync);
    };
  }, []);

  return { profile, ready };
}
