export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "Avispark-theme";

export const DEFAULT_THEME: Theme = "dark";

export function isTheme(value: string | null): value is Theme {
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
  } catch {
    // Ignore storage errors in private browsing.
  }
}

export function getResolvedTheme(): Theme {
  if (typeof document === "undefined") {
    return DEFAULT_THEME;
  }

  const datasetTheme = document.documentElement.dataset.theme;
  if (isTheme(datasetTheme ?? null)) {
    return datasetTheme as Theme;
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
