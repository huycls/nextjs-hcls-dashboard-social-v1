import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import type { Article } from "@/lib/wp/articles";

type ArticleHeroProps = {
  article: Article;
};

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-12">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                {article.category}
              </span>
              <span>{article.date}</span>
              {article.relativeDate && (
                <>
                  <span aria-hidden>·</span>
                  <span>{article.relativeDate}</span>
                </>
              )}
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-heading sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground sm:text-lg">
                {article.excerpt}
              </p>
            )}
          </div>

          {article.featuredImageUrl && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-[var(--shadow-card)]">
              <Image
                src={article.featuredImageUrl}
                alt={article.featuredImageAlt ?? article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
