import DOMPurify from "isomorphic-dompurify";

/** HTML nội dung từ WordPress trước khi `set:html`. */
export function sanitizeWpHtml(html: string | null | undefined): string {
  return DOMPurify.sanitize(html ?? "", {
    USE_PROFILES: { html: true },
  });
}
