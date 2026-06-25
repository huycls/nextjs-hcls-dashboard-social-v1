import Script from "next/script";

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("Avispark-theme");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return (
    <Script id="Avispark-theme-script" strategy="beforeInteractive">
      {themeScript}
    </Script>
  );
}
