import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { WP_CATEGORY_NAV } from "./categoryNav";
import {
  fetchCategoryPosts,
  wpSlugFromUri,
  type WpCategoryPostNode,
} from "./fetchCategoryPosts";
import { fetchPostDetail, type WpPostDetail } from "./fetchPosts";

export const DATAPOST_VERSION = 1 as const;

export type DataPostPayload = {
  version: typeof DATAPOST_VERSION;
  generatedAt: string;
  /** Danh sách bài theo slug danh mục (giống `fetchCategoryPosts`). */
  categories: Record<string, WpCategoryPostNode[]>;
  /** Chi tiết bài đã fetch sẵn (slug → payload `fetchPostDetail`). */
  postsBySlug: Record<string, WpPostDetail>;
  /** Slug có trang `/posts/[slug]` (đã có chi tiết). */
  slugs: string[];
};

function isTrashSlug(slug: string): boolean {
  return slug.startsWith("__") || slug.includes("__trashed");
}

/**
 * Gom dữ liệu WP: mọi danh mục trong menu + chi tiết từng bài.
 * Dùng bởi `scripts/generate-datapost.ts` (prebuild).
 */
export async function buildDatapostPayload(): Promise<DataPostPayload> {
  const categories: Record<string, WpCategoryPostNode[]> = {};
  const slugSet = new Set<string>();

  for (const { slug: catSlug } of WP_CATEGORY_NAV) {
    const posts = await fetchCategoryPosts({ name: catSlug, fetchAll: true });
    categories[catSlug] = posts;
    for (const p of posts) {
      const s = p.slug?.trim() || wpSlugFromUri(p.uri);
      if (s && !isTrashSlug(s)) slugSet.add(s);
    }
  }

  const postsBySlug: Record<string, WpPostDetail> = {};
  const allSlugs = [...slugSet].sort();
  const chunkSize = 5;

  for (let i = 0; i < allSlugs.length; i += chunkSize) {
    const chunk = allSlugs.slice(i, i + chunkSize);
    const results = await Promise.all(
      chunk.map((slug) =>
        fetchPostDetail({
          id: slug,
          idType: "SLUG",
          featuredImageSize: "LARGE",
        })
      )
    );
    for (let j = 0; j < chunk.length; j++) {
      const detail = results[j];
      if (detail?.title) {
        postsBySlug[chunk[j]] = detail;
      }
    }
  }

  return {
    version: DATAPOST_VERSION,
    generatedAt: new Date().toISOString(),
    categories,
    postsBySlug,
    slugs: Object.keys(postsBySlug).sort(),
  };
}

const dataPath = () => join(process.cwd(), "src/data/datapost.json");

let cache: DataPostPayload | null | undefined;

/**
 * Đọc `src/data/datapost.json` (tạo bởi `npm run wp:data`).
 * `undefined` = chưa đọc; `null` = không có file / lỗi / version lạ.
 */
export function loadDatapost(): DataPostPayload | null {
  if (cache !== undefined) return cache;

  const path = dataPath();
  if (!existsSync(path)) {
    cache = null;
    return null;
  }

  try {
    const raw = JSON.parse(readFileSync(path, "utf-8")) as DataPostPayload;
    if (raw.version !== DATAPOST_VERSION) {
      cache = null;
      return null;
    }
    cache = raw;
    return raw;
  } catch {
    cache = null;
    return null;
  }
}

/** Cho test / regenerate trong cùng process. */
export function clearDatapostCache(): void {
  cache = undefined;
}
