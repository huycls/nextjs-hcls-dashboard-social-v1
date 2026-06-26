export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "Avispark-theme";

export const DEFAULT_THEME: Theme = "dark";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.cookie = `${THEME_STORAGE_KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Ignore storage errors in private browsing.
  }
}

export function getResolvedTheme(): Theme {
  if (typeof document === "undefined") {
    return DEFAULT_THEME;
  }

  const datasetTheme = document.documentElement.dataset.theme;
  if (isTheme(datasetTheme)) {
    return datasetTheme;
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function getThemeFromCookie(
  cookieValue: string | null | undefined,
): Theme {
  return isTheme(cookieValue) ? cookieValue : DEFAULT_THEME;
}

/** Runs synchronously in <head> before first paint to prevent theme flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var r=document.documentElement;var s=localStorage.getItem(k);var t=s==="light"||s==="dark"?s:null;if(!t){t=r.dataset.theme==="light"||r.dataset.theme==="dark"?r.dataset.theme:"dark";}r.dataset.theme=t;r.style.colorScheme=t;r.classList.remove("light","dark");r.classList.add(t);localStorage.setItem(k,t);document.cookie=k+"="+t+";path=/;max-age=31536000;SameSite=Lax";}catch(e){}})();`;
