const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ldquo: "\u201C",
  rdquo: "\u201D",
  lsquo: "\u2018",
  rsquo: "\u2019",
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => {
      const value = Number(code);
      return Number.isFinite(value) ? String.fromCodePoint(value) : _;
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => {
      const value = parseInt(code, 16);
      return Number.isFinite(value) ? String.fromCodePoint(value) : _;
    })
    .replace(/&([a-z]+);/gi, (_, name) => {
      const decoded = NAMED_HTML_ENTITIES[name.toLowerCase()];
      return decoded ?? `&${name};`;
    });
}

/** Bỏ tag HTML, decode entities, gom khoảng trắng — dùng cho excerpt / meta. */
export function stripHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

export const ARTICLE_EXCERPT_MAX_LENGTH = 300;

export function buildExcerpt(
  html: string,
  maxLength = ARTICLE_EXCERPT_MAX_LENGTH,
): string {
  const plain = stripHtml(html);
  if (!plain) return "";
  if (plain.length <= maxLength) return plain;

  const slice = plain.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = (
    lastSpace > Math.floor(maxLength * 0.55) ? slice.slice(0, lastSpace) : slice
  )
    .replace(/[.,;:!?…]+$/u, "")
    .trim();

  return `${trimmed}...`;
}

export function normalizeArticleExcerpt(
  excerptHtml: string,
  contentHtml = "",
  maxLength = ARTICLE_EXCERPT_MAX_LENGTH,
): string {
  const excerptPlain = stripHtml(excerptHtml);
  const contentPlain = stripHtml(contentHtml);

  if (excerptPlain.length >= maxLength) {
    return buildExcerpt(excerptHtml, maxLength);
  }
  if (contentPlain.length >= maxLength) {
    return buildExcerpt(contentHtml, maxLength);
  }

  const source =
    contentPlain.length > excerptPlain.length ? contentHtml : excerptHtml;

  return buildExcerpt(source, maxLength);
}

export function formatArticleDate(date: string | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getDateDistance(date: string): string {
  const then = new Date(date).getTime();
  const now = Date.now();
  const diffSec = Math.round((then - now) / 1000);
  const absSec = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSec < 60) return rtf.format(diffSec, "second");
  if (absSec < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (absSec < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (absSec < 2592000) return rtf.format(Math.round(diffSec / 86400), "day");
  if (absSec < 31536000)
    return rtf.format(Math.round(diffSec / 2592000), "month");
  return rtf.format(Math.round(diffSec / 31536000), "year");
}

export function estimateReadTime(text: string): string {
  const words = stripHtml(text).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
