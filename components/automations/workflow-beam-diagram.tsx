"use client";

import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { AnimatedBeam } from "@/components/atoms/AnimatedBeam";
import { APP_ICON_STYLES } from "@/components/automations/app-icons";
import type { AppId } from "@/lib/automations/data";
import { cn } from "@/lib/utils/tailwind-merge";

const MAX_NODES_PER_SIDE = 3;

const DEFAULT_INPUTS: AppId[] = ["notion", "google", "slack"];
const DEFAULT_OUTPUTS: AppId[] = ["discord", "trello", "stripe"];

type WorkflowBeamDiagramProps = {
  apps?: AppId[];
  size?: "sm" | "lg";
  className?: string;
};

function distributeApps(apps: AppId[]) {
  if (apps.length === 0) {
    return { inputs: DEFAULT_INPUTS, outputs: DEFAULT_OUTPUTS };
  }

  const mid = Math.ceil(apps.length / 2);

  return {
    inputs: apps.slice(0, mid).slice(0, MAX_NODES_PER_SIDE),
    outputs: apps.slice(mid).slice(0, MAX_NODES_PER_SIDE),
  };
}

function AppNode({
  app,
  nodeRef,
  size,
}: {
  app: AppId;
  nodeRef: React.RefObject<HTMLDivElement | null>;
  size: "sm" | "lg";
}) {
  const style = APP_ICON_STYLES[app];
  const isLarge = size === "lg";

  return (
    <div
      ref={nodeRef}
      title={app}
      className={cn(
        "z-10 flex shrink-0 items-center justify-center rounded-full shadow-[var(--shadow-card)] ring-2 ring-surface-elevated",
        isLarge ? "size-12 text-xs" : "size-7 text-[9px]",
        style.bg,
        app === "google" || app === "notion"
          ? "text-heading"
          : "font-semibold text-white",
      )}>
      <span className={app === "google" || app === "notion" ? "font-semibold" : ""}>
        {style.label}
      </span>
    </div>
  );
}

function CenterNode({
  nodeRef,
  size,
}: {
  nodeRef: React.RefObject<HTMLDivElement | null>;
  size: "sm" | "lg";
}) {
  const isLarge = size === "lg";

  return (
    <div
      ref={nodeRef}
      className={cn(
        "z-10 flex shrink-0 items-center justify-center rounded-full border border-primary/30 bg-surface shadow-[var(--shadow-card)]",
        isLarge ? "size-16" : "size-9",
      )}>
      <Sparkles
        className={cn("text-primary", isLarge ? "size-7" : "size-4")}
        strokeWidth={1.75}
      />
    </div>
  );
}

export function WorkflowBeamDiagram({
  apps = [],
  size = "lg",
  className,
}: WorkflowBeamDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const inputRef0 = useRef<HTMLDivElement>(null);
  const inputRef1 = useRef<HTMLDivElement>(null);
  const inputRef2 = useRef<HTMLDivElement>(null);
  const outputRef0 = useRef<HTMLDivElement>(null);
  const outputRef1 = useRef<HTMLDivElement>(null);
  const outputRef2 = useRef<HTMLDivElement>(null);

  const inputRefs = [inputRef0, inputRef1, inputRef2];
  const outputRefs = [outputRef0, outputRef1, outputRef2];

  const { inputs, outputs } = distributeApps(apps);
  const isLarge = size === "lg";

  const inputCurvatures = isLarge ? [40, 0, -40] : [20, 0, -20];
  const outputCurvatures = isLarge ? [-40, 0, 40] : [-20, 0, 20];

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full items-center justify-between",
        isLarge ? "h-[280px] max-w-2xl px-4" : "h-[72px] min-w-[200px] px-1",
        className,
      )}>
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          isLarge ? "gap-10" : "gap-2",
        )}>
        {inputs.map((app, index) => (
          <AppNode
            key={`input-${app}-${index}`}
            app={app}
            nodeRef={inputRefs[index]}
            size={size}
          />
        ))}
      </div>

      <CenterNode
        nodeRef={centerRef}
        size={size}
      />

      <div
        className={cn(
          "flex flex-col items-center justify-center",
          isLarge ? "gap-10" : "gap-2",
        )}>
        {outputs.map((app, index) => (
          <AppNode
            key={`output-${app}-${index}`}
            app={app}
            nodeRef={outputRefs[index]}
            size={size}
          />
        ))}
      </div>

      {inputs.map((_, index) => (
        <AnimatedBeam
          key={`beam-in-${index}`}
          containerRef={containerRef}
          fromRef={inputRefs[index]}
          toRef={centerRef}
          curvature={inputCurvatures[index] ?? 0}
          pathColor="var(--border)"
          pathWidth={isLarge ? 2 : 1.5}
          pathOpacity={0.35}
          gradientStartColor="var(--primary)"
          gradientStopColor="var(--primary-hover)"
          duration={3 + index * 0.4}
          delay={index * 0.15}
        />
      ))}

      {outputs.map((_, index) => (
        <AnimatedBeam
          key={`beam-out-${index}`}
          containerRef={containerRef}
          fromRef={centerRef}
          toRef={outputRefs[index]}
          curvature={outputCurvatures[index] ?? 0}
          reverse
          pathColor="var(--border)"
          pathWidth={isLarge ? 2 : 1.5}
          pathOpacity={0.35}
          gradientStartColor="var(--primary)"
          gradientStopColor="var(--primary-hover)"
          duration={3 + index * 0.4}
          delay={0.3 + index * 0.15}
        />
      ))}
    </div>
  );
}
