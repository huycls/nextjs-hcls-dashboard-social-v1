"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { BrandLogo } from "@/components/atoms/BrandLogo";

const LOTTIE_SRC = "/assets/lotties/error-404-animate.json";

export function NotFoundView() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(LOTTIE_SRC)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load animation");
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        if (!cancelled) setAnimationData(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-center">
      <Link
        href="/"
        className="absolute left-6 top-6 inline-flex items-center gap-2.5 text-heading transition hover:opacity-80 sm:left-8 sm:top-8">
        <BrandLogo className="h-5 w-5 shrink-0" />
        <span className="text-sm font-semibold">Avispark</span>
      </Link>

      <div className="flex w-full max-w-lg flex-col items-center justify-center">
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop
            className="mx-auto h-auto w-full max-w-[420px]"
            aria-hidden
          />
        ) : (
          <div
            className="mx-auto aspect-square w-full max-w-[320px] animate-pulse rounded-2xl bg-surface"
            aria-hidden
          />
        )}
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Trang bạn tìm kiếm không tồn tại
          <br /> hoặc đã được di chuyển.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-medium text-background transition hover:bg-primary-hover">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
