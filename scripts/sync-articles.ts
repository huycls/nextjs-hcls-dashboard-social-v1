import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { buildArticlesFromWordPressForSnapshot } from "../lib/wp/articles";
import {
  readArticlesSnapshot,
  writeArticlesSnapshot,
} from "../lib/wp/articles-snapshot";

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvLocal();

  if (!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL) {
    console.warn(
      "[sync-articles] NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL is missing. Keeping existing articles.json.",
    );
    return;
  }

  try {
    const articles = await buildArticlesFromWordPressForSnapshot();

    if (articles.length === 0) {
      const existing = readArticlesSnapshot();
      console.warn(
        `[sync-articles] WordPress returned 0 articles. Keeping existing snapshot (${existing.length} articles).`,
      );
      return;
    }

    writeArticlesSnapshot(articles);
    console.log(
      `[sync-articles] Wrote ${articles.length} articles to common/data/articles.json`,
    );
  } catch (error) {
    const existing = readArticlesSnapshot();
    console.warn(
      `[sync-articles] Sync failed. Keeping existing snapshot (${existing.length} articles).`,
      error,
    );
  }
}

main();
