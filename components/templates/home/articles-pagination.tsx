import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildArticlesHref } from "@/lib/wp/article-routes";

type ArticlesPaginationProps = {
  categorySlug: string;
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const linkClassName =
  "inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-heading transition hover:bg-surface-elevated";

const disabledClassName =
  "inline-flex h-10 cursor-not-allowed items-center gap-1.5 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-muted opacity-40";

export function ArticlesPagination({
  categorySlug,
  page,
  hasNextPage,
  hasPreviousPage,
}: ArticlesPaginationProps) {
  const previousHref = buildArticlesHref({
    category: categorySlug,
    page: page - 1,
  });
  const nextHref = buildArticlesHref({
    category: categorySlug,
    page: page + 1,
  });

  return (
    <nav
      aria-label="Articles pagination"
      className="mt-10 flex items-center justify-center gap-3"
    >
      {hasPreviousPage ? (
        <Link href={previousHref} className={linkClassName} prefetch>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className={disabledClassName} aria-disabled="true">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      )}

      <span className="min-w-24 text-center text-sm font-medium text-muted">
        Page {page}
      </span>

      {hasNextPage ? (
        <Link href={nextHref} className={linkClassName} prefetch>
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={disabledClassName} aria-disabled="true">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
