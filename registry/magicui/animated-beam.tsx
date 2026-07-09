"use client";

import * as React from "react";
import { cn } from "@/lib/utils/tailwind-merge";

type AnimatedBeamProps = {
  pathD: string;
  viewBoxWidth: number;
  viewBoxHeight: number;
  className?: string;
  duration?: number;
  delay?: number;
  strokeWidth?: number;
  pathOpacity?: number;
  dashed?: boolean;
  gradientStartColor?: string;
  gradientStopColor?: string;
  pathColor?: string;
};

export function AnimatedBeam({
  pathD,
  viewBoxWidth,
  viewBoxHeight,
  className,
  duration = 3,
  delay = 0,
  strokeWidth = 1.5,
  pathOpacity = 1,
  dashed = false,
  gradientStartColor = "var(--primary)",
  gradientStopColor = "var(--node-blue-border)",
  pathColor = "var(--border)",
}: AnimatedBeamProps) {
  const gradientId = React.useId();

  if (!pathD) {
    return null;
  }

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
      aria-hidden="true">
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%">
          <stop
            offset="0%"
            stopColor={gradientStartColor}
            stopOpacity="0"
          />
          <stop
            offset="25%"
            stopColor={gradientStartColor}
            stopOpacity="1"
          />
          <stop
            offset="100%"
            stopColor={gradientStopColor}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      <path
        d={pathD}
        fill="none"
        stroke={pathColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? "5 4" : undefined}
        opacity={pathOpacity}
      />

      <path
        d={pathD}
        fill="none"
        pathLength={1}
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth + 0.75}
        strokeLinecap="round"
        strokeDasharray={dashed ? "0.12 0.88" : "0.18 0.82"}>
        <animate
          attributeName="stroke-dashoffset"
          from="1"
          to="0"
          dur={`${duration}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
