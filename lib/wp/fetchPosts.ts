/**
 * Danh sách bài (root connection: posts, pages, …) + chi tiết một post qua WPGraphQL.
 */

import { getWpGraphqlUrl } from "./fetchCategoryPosts";
import { wpEnvNumber } from "./runtimeEnv";

type GqlVariable = {
  name: string;
  type: string;
  value: string | number | boolean | null;
};

function unionByName(a: GqlVariable[], b: GqlVariable[]): GqlVariable[] {
  const map = new Map<string, GqlVariable>();
  for (const item of a) map.set(item.name, item);
  for (const item of b) {
    if (!map.has(item.name)) map.set(item.name, item);
  }
  return [...map.values()];
}

function uniqByUri<T extends { uri?: string | null }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const u = item.uri;
    if (u == null || u === "") return false;
    if (seen.has(u)) return false;
    seen.add(u);
    return true;
  });
}

/** Chỉ cho phép tên field GraphQL hợp lệ (tránh chèn query). */
function assertSafeRootField(name: string): string {
  if (!/^[a-z][a-z0-9_]*$/i.test(name)) {
    throw new Error(`Invalid postType / root field: ${name}`);
  }
  return name;
}

/** Kích thước ảnh WP (THUMBNAIL, LARGE, …) — chỉ cho token an toàn khi nhét vào query. */
function sanitizeMediaSize(size: string): string {
  if (!/^[A-Z0-9_]+$/i.test(size)) {
    throw new Error(`Invalid featured image size: ${size}`);
  }
  return size.toUpperCase();
}

async function wpGraphqlRequest(
  body: { query: string; variables?: Record<string, unknown> },
  locale: string | undefined,
  fetchOptions: RequestInit | undefined,
): Promise<unknown> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(locale ? { "Accept-Language": locale } : {}),
    ...(fetchOptions?.headers as Record<string, string> | undefined),
  };

  const res = await fetch(getWpGraphqlUrl(), {
    method: "POST",
    ...fetchOptions,
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL HTTP ${res.status}: ${res.statusText}`);
  }

  const json = (await res.json()) as {
    errors?: Array<{ message: string }>;
    data?: Record<string, unknown>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  return json;
}

export type WpPageInfo = {
  endCursor?: string;
  hasNextPage?: boolean;
};

export type FetchPostsArgs = {
  /** Root connection WPGraphQL, mặc định `posts` */
  postType?: string;
  hasExcerpt?: boolean;
  postPerPage?: number;
  variables?: GqlVariable[];
  gqlNode?: string;
  /** Kích thước ảnh (THUMBNAIL, …) hoặc `""` để bỏ `featuredImage` */
  featuredImage?: string;
  prev?: WpPostListNode[];
  fetchAll?: boolean;
  locale?: string;
  fetchOptions?: RequestInit;
};

/** Node danh sách — mở rộng thêm field qua `gqlNode`. */
export type WpPostListNode = {
  slug?: string;
  title?: string;
  uri?: string;
  date?: string;
  excerpt?: string;
  featuredImage?: WpPostDetail["featuredImage"];
  [key: string]: unknown;
};

export type FetchPostsResult = {
  nodes: WpPostListNode[];
  pageInfo?: WpPageInfo;
};

export async function fetchPosts({
  postType = "posts",
  postPerPage = 10,
  variables = [],
  gqlNode = "",
  featuredImage: featuredImageSize = "LARGE",
  prev = [],
  fetchAll = false,
  hasExcerpt = true,
  locale,
  fetchOptions,
}: FetchPostsArgs): Promise<FetchPostsResult> {
  const field = assertSafeRootField(postType);
  const posts: WpPostListNode[] = prev.length > 0 ? [...prev] : [];

  const readingN = wpEnvNumber("PUBLIC_READING_POSTS_PER_PAGE") ?? NaN;

  const perPage = fetchAll
    ? !Number.isNaN(readingN) && readingN > 0
      ? readingN
      : postPerPage
    : postPerPage;

  const newVariables = unionByName(variables, [
    { name: "first", type: "Int", value: perPage },
  ]);

  const variablesGql: Record<string, string | number | boolean | null> = {};
  const variablesTheQuery: string[] = [];
  const variablesType: string[] = [];

  for (const item of newVariables) {
    variablesGql[item.name] = item.value;
    variablesTheQuery.push(`$${item.name}: ${item.type}`);
    variablesType.push(`${item.name}: $${item.name}`);
  }

  const excerptSel = hasExcerpt ? "excerpt" : "";
  const sizeToken = featuredImageSize
    ? sanitizeMediaSize(featuredImageSize)
    : "";
  const imageSel = sizeToken
    ? `featuredImage {
                node {
                  sizes(size: ${sizeToken})
                  sourceUrl(size: ${sizeToken})
                  srcSet(size: ${sizeToken})
                  mediaDetails {
                    width
                    height
                    sizes {
                      name
                      sourceUrl
                      width
                      height
                    }
                  }
                  altText
                }
              }`
    : "";

  const json = (await wpGraphqlRequest(
    {
      query: `
        query theQuery(${variablesTheQuery.join(", ")}) {
          ${field}(${variablesType.join(", ")}) {
            pageInfo {
              endCursor
              hasNextPage
            }
            nodes {
              slug
              title
              uri
              date
              ${excerptSel}
              ${gqlNode}
              ${imageSel}
            }
          }
        }
    `,
      variables: variablesGql,
    },
    locale,
    fetchOptions,
  )) as {
    data?: Record<
      string,
      | {
          nodes?: WpPostListNode[];
          pageInfo?: WpPageInfo;
        }
      | undefined
    >;
  };

  const conn = json.data?.[field];
  const nodes = conn?.nodes ?? [];
  const pageInfo = conn?.pageInfo;

  for (const node of nodes) {
    if (node?.uri) posts.push(node);
  }

  if (fetchAll && pageInfo?.hasNextPage && pageInfo.endCursor) {
    return fetchPosts({
      postType: field,
      postPerPage: perPage,
      variables: [
        {
          name: "after",
          type: "String",
          value: pageInfo.endCursor,
        },
      ],
      hasExcerpt,
      gqlNode,
      featuredImage: featuredImageSize,
      prev: posts,
      fetchAll,
      locale,
      fetchOptions,
    });
  }

  return {
    nodes: uniqByUri(posts),
    pageInfo,
  };
}

export type WpPostIdType = "SLUG" | "URI" | "DATABASE_ID" | "ID";

export type WpPostDetail = {
  id?: string;
  databaseId?: number;
  title?: string;
  slug?: string;
  uri?: string;
  date?: string;
  excerpt?: string;
  content?: string;
  categories?: {
    nodes: Array<{ name?: string; slug?: string; uri?: string }>;
  };
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      srcSet?: string;
      altText?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  };
};

export type FetchPostDetailArgs = {
  /** Giá trị id theo `idType` (slug, uri dạng `/path/`, database id, …) */
  id: string;
  idType?: WpPostIdType;
  /** Field bổ sung trong selection `post { … }` */
  gqlNode?: string;
  /** `LARGE`, `FULL` … hoặc `""` để không lấy ảnh */
  featuredImageSize?: string;
  /** RENDERED = HTML đã qua filter WP */
  contentFormat?: "RENDERED" | "RAW";
  locale?: string;
  fetchOptions?: RequestInit;
};

/**
 * Một bài post: `post(id: $id, idType: $idType)`.
 * Ví dụ slug: `fetchPostDetail({ id: "my-post-slug", idType: "SLUG" })`.
 */
export async function fetchPostDetail({
  id,
  idType = "SLUG",
  gqlNode = "",
  featuredImageSize = "LARGE",
  contentFormat = "RENDERED",
  locale,
  fetchOptions,
}: FetchPostDetailArgs): Promise<WpPostDetail | null> {
  const format = contentFormat === "RAW" ? "RAW" : "RENDERED";
  const detailSize = featuredImageSize
    ? sanitizeMediaSize(featuredImageSize)
    : "";
  const imageBlock = detailSize
    ? `featuredImage {
      node {
        sourceUrl(size: ${detailSize})
        srcSet(size: ${detailSize})
        altText
        mediaDetails { width height }
      }
    }`
    : "";

  const json = (await wpGraphqlRequest(
    {
      query: `
      query PostDetail($id: ID!, $idType: PostIdType!) {
        post(id: $id, idType: $idType) {
          id
          databaseId
          title
          slug
          uri
          date
          excerpt
          content(format: ${format})
          categories {
            nodes {
              name
              slug
              uri
            }
          }
          ${gqlNode}
          ${imageBlock}
        }
      }
    `,
      variables: { id, idType },
    },
    locale,
    fetchOptions,
  )) as { data?: { post?: WpPostDetail | null } };

  return json.data?.post ?? null;
}

export default fetchPosts;
