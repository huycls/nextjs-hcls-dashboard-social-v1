"use client";

import { useEffect, useRef } from "react";

const TOC_LINK_SELECTOR =
  '#ez-toc-container a[href^="#"], .ez-toc-list a[href^="#"]';

type ArticleContentProps = {
  html: string;
};

export function ArticleContent({ html }: ArticleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container === null) return;

    function handleTocClick(event: MouseEvent) {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        TOC_LINK_SELECTOR,
      );

      if (!link || !container?.contains(link)) return;

      const id = decodeURIComponent(link.getAttribute("href")?.slice(1) ?? "");
      if (!id) return;

      const heading = document.getElementById(id);
      if (!heading) return;

      event.preventDefault();
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }

    container.addEventListener("click", handleTocClick);
    return () => container.removeEventListener("click", handleTocClick);
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="wp-content prose prose-neutral max-w-none text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
