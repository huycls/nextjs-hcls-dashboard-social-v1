/**
 * Danh mục hiển thị trên menu — khớp slug trong WP Admin (Posts → Categories).
 */
export const WP_CATEGORY_NAV = [
  { slug: "tin-tuc-ai", label: "AI" },
  { slug: "tin-tuc-cong-nghe", label: "Công nghệ" },
] as const;

export type WpCategorySlug = (typeof WP_CATEGORY_NAV)[number]["slug"];
