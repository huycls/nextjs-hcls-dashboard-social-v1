"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

import { cn } from "@/lib/utils/tailwind-merge";

const LOTTIE_SRC = "/assets/lotties/loading.json";

let cachedAnimation: object | null | undefined;
let animationPromise: Promise<object | null> | null = null;

function loadLoadingAnimation(): Promise<object | null> {
  if (cachedAnimation !== undefined) {
    return Promise.resolve(cachedAnimation);
  }

  if (!animationPromise) {
    animationPromise = fetch(LOTTIE_SRC)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load animation");
        return response.json();
      })
      .then((data) => {
        cachedAnimation = data;
        return data;
      })
      .catch(() => {
        cachedAnimation = null;
        return null;
      });
  }

  return animationPromise;
}

interface LoadingProps {
  /** Accessible label for screen readers */
  label?: string;
  /** Optional message below the animation */
  message?: string;
  className?: string;
}

export function Loading({
  label = "Đang tải",
  message,
  className,
}: LoadingProps) {
  const [animationData, setAnimationData] = useState<object | null>(
    cachedAnimation ?? null,
  );

  useEffect(() => {
    let cancelled = false;

    loadLoadingAnimation().then((data) => {
      if (!cancelled) setAnimationData(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const animation = animationData ? (
    <Lottie
      animationData={animationData}
      loop
      className={cn("h-24 w-24", className)}
      aria-hidden
    />
  ) : (
    <div
      className={cn(
        "h-24 w-24 animate-pulse rounded-full bg-surface",
        className,
      )}
      aria-hidden
    />
  );

  return (
    <div
      role="status"
      aria-label={label}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm">
      {animation}
      {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default Loading;
