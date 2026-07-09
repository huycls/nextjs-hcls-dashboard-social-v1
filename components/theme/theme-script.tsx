import { THEME_INIT_SCRIPT } from "@/lib/theme";

export function ThemeHeadScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: THEME_INIT_SCRIPT,
      }}
    />
  );
}
