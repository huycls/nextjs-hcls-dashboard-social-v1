/**
 * WPGraphQL client for category posts (AviSpark / Hostinger demo).
 * Endpoint verified: https://deepskyblue-grouse-965524.hostingersite.com/graphql
 */

import {
  DEFAULT_WORDPRESS_GRAPHQL,
  wpEnvNumber,
  wpEnvString,
} from "./runtimeEnv";

function getGraphqlUrl(): string {
  return (
    wpEnvString("PUBLIC_WORDPRESS_GRAPHQL_URL") || DEFAULT_WORDPRESS_GRAPHQL
  ).replace(/\/$/, "");
}

/** Endpoint GraphQL dùng chung cho `fetchPosts` / `fetchPostDetail`. */
export function getWpGraphqlUrl(): string {
  return getGraphqlUrl();
}

/**
 * Origin site WordPress (permalink).
 * Ưu tiên `PUBLIC_WORDPRESS_SITE_URL` khi GraphQL dev/proxy khác domain public
 * (tránh link bài trỏ nhầm về localhost Astro → 404).
 */
export function getWordpressSiteUrl(): string {
  const fromEnv = wpEnvString("PUBLIC_WORDPRESS_SITE_URL");
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return getGraphqlUrl().replace(/\/graphql\/?$/i, "");
}

/** Lấy slug từ `uri` WP (đoạn path cuối) khi chưa có field `slug`. */
export function wpSlugFromUri(uri: string | null | undefined): string {
  const raw = uri?.trim() ?? "";
  if (!raw) return "";
  const parts = raw
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

/** URL đầy đủ tới bài trên WP từ field `uri` (path hoặc URL tuyệt đối). */
export function resolveWpPostUrl(uri: string | null | undefined): string {
  const raw = uri?.trim() ?? "";
  if (!raw) return "#";
  if (/^https?:\/\//i.test(raw)) return raw;
  const origin = getWordpressSiteUrl().replace(/\/$/, "");
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${origin}${path}`;
}

type GqlVariable = {
  name: string;
  type: string;
  value: string | number | boolean | null;
};

export type WpCategoryPostNode = {
  databaseId: number;
  slug: string;
  title: string;
  uri: string;
  excerpt: string;
  date: string;
  categories: {
    nodes: Array<{
      name: string;
      uri: string;
      parent: { node: { id: string } } | null;
    }>;
  };
  featuredImage?: {
    node: {
      sizes?: unknown;
      sourceUrl?: string;
      srcSet?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
        sizes?: Array<{
          name: string;
          sourceUrl: string;
          width?: number;
          height?: number;
        }>;
      };
      altText?: string;
    };
  };
};

function isEmptyUri(uri: string | null | undefined): boolean {
  return uri == null || uri === "";
}

function unionByName(a: GqlVariable[], b: GqlVariable[]): GqlVariable[] {
  const map = new Map<string, GqlVariable>();
  for (const item of a) map.set(item.name, item);
  for (const item of b) {
    if (!map.has(item.name)) map.set(item.name, item);
  }
  return [...map.values()];
}

function uniqByUri(posts: WpCategoryPostNode[]): WpCategoryPostNode[] {
  const seen = new Set<string>();
  return posts.filter((p) => {
    if (seen.has(p.uri)) return false;
    seen.add(p.uri);
    return true;
  });
}

export type FetchCategoryPostsArgs = {
  /** Category slug, e.g. tin-tuc-games */
  name: string;
  postPerPage?: number;
  variables?: GqlVariable[];
  size?: string;
  gqlNode?: string;
  prevPosts?: WpCategoryPostNode[];
  fetchAll?: boolean;
  /** Optional locale header or future i18n plugin — pass through headers if needed */
  locale?: string;
  fetchOptions?: RequestInit;
};

type CategoryPostsQueryResult = {
  data?: {
    category?: {
      posts?: {
        pageInfo?: WpPageInfo;
        nodes?: WpCategoryPostNode[];
      };
    };
  };
  errors?: Array<{ message: string }>;
};

export type WpPageInfo = {
  endCursor?: string;
  hasNextPage?: boolean;
};

export type CategoryPostsPageResult = {
  nodes: WpCategoryPostNode[];
  pageInfo: WpPageInfo;
};

export async function fetchCategoryPostsPage({
  name,
  postPerPage = 12,
  after,
  size = "MEDIUM",
  gqlNode = "",
  locale,
  fetchOptions,
}: {
  name: string;
  postPerPage?: number;
  after?: string | null;
  size?: string;
  gqlNode?: string;
  locale?: string;
  fetchOptions?: RequestInit;
}): Promise<CategoryPostsPageResult> {
  const variables: GqlVariable[] = [
    { name: "first", type: "Int", value: postPerPage },
  ];
  if (after) {
    variables.push({ name: "after", type: "String", value: after });
  }

  return fetchCategoryPostsConnection({
    name,
    postPerPage,
    variables,
    size,
    gqlNode,
    fetchAll: false,
    locale,
    fetchOptions,
  });
}

async function fetchCategoryPostsConnection({
  name,
  postPerPage = 12,
  variables = [],
  size = "LARGE",
  gqlNode = "",
  prevPosts = [],
  fetchAll = false,
  locale,
  fetchOptions,
}: FetchCategoryPostsArgs): Promise<CategoryPostsPageResult> {
  const posts: WpCategoryPostNode[] = prevPosts.length ? [...prevPosts] : [];

  const readingSettingsPostsPerPage =
    wpEnvNumber("PUBLIC_READING_POSTS_PER_PAGE") ?? NaN;

  const perPage = fetchAll
    ? !Number.isNaN(readingSettingsPostsPerPage) &&
      readingSettingsPostsPerPage > 0
      ? readingSettingsPostsPerPage
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

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(locale ? { "Accept-Language": locale } : {}),
    ...(fetchOptions?.headers as Record<string, string> | undefined),
  };

  const res = await fetch(getGraphqlUrl(), {
    method: "POST",
    ...fetchOptions,
    headers,
    body: JSON.stringify({
      query: `
      query theQuery(${variablesTheQuery.join(", ")}) {
        category(id: "${name}", idType: SLUG) {
          id
          posts(${variablesType.join(", ")}) {
            pageInfo {
              endCursor
              hasNextPage
            }
            nodes {
              databaseId
              slug
              title
              uri
              excerpt
              date
              categories {
                nodes {
                  name
                  uri
                  parent {
                    node {
                      id
                    }
                  }
                }
              }
              ${gqlNode}
              featuredImage {
                node {
                  sizes(size: ${size})
                  sourceUrl(size: ${size})
                  srcSet(size: ${size})
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
              }
            }
          }
        }
      }
    `,
      variables: variablesGql,
    }),
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL HTTP ${res.status}: ${res.statusText}`);
  }

  const json = (await res.json()) as CategoryPostsQueryResult;

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  const nodes = json.data?.category?.posts?.nodes ?? [];

  for (const node of nodes) {
    if (!isEmptyUri(node?.uri)) {
      const getParentCategory = node.categories.nodes.find(
        (item) => item.parent === null,
      );

      if (getParentCategory?.name.toLowerCase() === "articles") {
        posts.push(node);
      } else {
        const cloneNode = { ...node };
        if (getParentCategory) {
          cloneNode.categories = { nodes: [getParentCategory] };
        }
        posts.push(cloneNode);
      }
    }
  }

  const pageInfo = json.data?.category?.posts?.pageInfo ?? {};
  const uniquePosts = uniqByUri(posts);

  if (fetchAll && pageInfo.hasNextPage && pageInfo.endCursor) {
    const next = await fetchCategoryPostsConnection({
      name,
      variables: [
        {
          name: "after",
          type: "String",
          value: pageInfo.endCursor,
        },
      ],
      size,
      prevPosts: uniquePosts,
      fetchAll,
      locale,
      gqlNode,
      fetchOptions,
    });

    return {
      nodes: next.nodes,
      pageInfo: next.pageInfo,
    };
  }

  return {
    nodes: uniquePosts,
    pageInfo,
  };
}

export async function fetchCategoryPosts(
  args: FetchCategoryPostsArgs,
): Promise<WpCategoryPostNode[]> {
  const { nodes } = await fetchCategoryPostsConnection(args);
  return nodes;
}

export default fetchCategoryPosts;
