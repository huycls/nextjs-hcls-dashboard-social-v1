"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Copy,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  Minus,
  MousePointer2,
  Play,
  Plus,
  Sparkles,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

type Point = { x: number; y: number };

type WorkflowCanvasViewportProps = {
  canvasWidth: number;
  canvasHeight: number;
  children: ReactNode;
  overlay?: ReactNode;
  onPlay?: () => void;
  playDisabled?: boolean;
  playLabel?: string;
  onBackgroundClick?: () => void;
};

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

export function WorkflowCanvasViewport({
  canvasWidth,
  canvasHeight,
  children,
  overlay,
  onPlay,
  playDisabled,
  playLabel = "Run workflow",
  onBackgroundClick,
}: WorkflowCanvasViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [activeTool, setActiveTool] = useState<"select" | "comment">("select");
  const panStart = useRef<Point & { offsetX: number; offsetY: number }>({
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const fitToView = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const padding = 64;
    const scaleX = (container.clientWidth - padding * 2) / canvasWidth;
    const scaleY = (container.clientHeight - padding * 2) / canvasHeight;
    const nextScale = clampZoom(Math.min(scaleX, scaleY, 1));
    const x = (container.clientWidth - canvasWidth * nextScale) / 2;
    const y = (container.clientHeight - canvasHeight * nextScale) / 2;

    setScale(nextScale);
    setOffset({ x, y });
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    fitToView();
  }, [fitToView]);

  const zoomAt = useCallback(
    (clientX: number, clientY: number, nextScale: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const pointerX = clientX - rect.left;
      const pointerY = clientY - rect.top;
      const clampedScale = clampZoom(nextScale);
      const ratio = clampedScale / scale;

      setOffset((current) => ({
        x: pointerX - (pointerX - current.x) * ratio,
        y: pointerY - (pointerY - current.y) * ratio,
      }));
      setScale(clampedScale);
    },
    [scale],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleWheel(event: WheelEvent) {
      event.preventDefault();

      if (event.ctrlKey || event.metaKey) {
        const delta = -event.deltaY * 0.01;
        zoomAt(event.clientX, event.clientY, scale * (1 + delta));
        return;
      }

      setOffset((current) => ({
        x: current.x - event.deltaX,
        y: current.y - event.deltaY,
      }));
    }

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [scale, zoomAt]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("[data-canvas-node]")) return;
    if (target.closest("[data-canvas-ui]")) return;
    if (event.button !== 0 && event.button !== 1) return;

    onBackgroundClick?.();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPanning(true);
    panStart.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isPanning) return;

    setOffset({
      x: panStart.current.offsetX + (event.clientX - panStart.current.x),
      y: panStart.current.offsetY + (event.clientY - panStart.current.y),
    });
  }

  function stopPanning(event: React.PointerEvent<HTMLDivElement>) {
    if (isPanning && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsPanning(false);
  }

  function zoomIn() {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    zoomAt(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      scale + ZOOM_STEP,
    );
  }

  function zoomOut() {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    zoomAt(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      scale - ZOOM_STEP,
    );
  }

  const tools = [
    {
      id: "play" as const,
      icon: Play,
      label: playLabel,
      onClick: onPlay,
      disabled: playDisabled,
    },
    { id: "layers" as const, icon: Layers, label: "Layers" },
    { id: "text" as const, icon: Type, label: "Text" },
    { id: "image" as const, icon: ImageIcon, label: "Image" },
    { id: "select" as const, icon: MousePointer2, label: "Select" },
    { id: "comment" as const, icon: MessageSquare, label: "Comment" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-w-0 flex-1 overflow-hidden bg-[var(--canvas)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--border) 80%, transparent) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {overlay}

      <div
        data-canvas-ui="true"
        className="absolute bottom-5 left-5 z-20 flex items-center gap-2">
        <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface-elevated/95 px-2 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
          <span className="px-2">Page 1</span>
          <button
            type="button"
            aria-label="Duplicate page"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-heading">
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Add page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-elevated/95 text-muted shadow-sm backdrop-blur-sm transition hover:text-heading">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div
        data-canvas-ui="true"
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-border bg-surface-elevated/95 p-1.5 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-sm">
        {tools.map(({ id, icon: Icon, label, onClick, disabled }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={() => {
              if (id === "play") {
                onClick?.();
                return;
              }
              if (id === "select" || id === "comment") {
                setActiveTool(id);
              }
            }}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted transition hover:bg-surface hover:text-heading disabled:opacity-40",
              (id === "select" || id === "comment") &&
                activeTool === id &&
                "bg-surface text-heading",
              id === "play" && "text-primary hover:text-primary",
            )}>
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <button
          type="button"
          className="ml-1 inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--node-blue)] px-3 text-sm font-medium text-white transition hover:opacity-90">
          <Sparkles className="h-3.5 w-3.5" />
          Ask AI
        </button>
      </div>

      <div
        data-canvas-ui="true"
        className="absolute bottom-5 right-5 z-20 flex items-center gap-1 rounded-xl border border-border bg-surface-elevated/95 px-1.5 py-1 text-xs text-muted shadow-sm backdrop-blur-sm">
        <button
          type="button"
          aria-label="Zoom out"
          onClick={zoomOut}
          disabled={scale <= MIN_ZOOM}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-surface disabled:opacity-40">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={fitToView}
          className="min-w-12 rounded-lg px-1 py-1 font-medium text-foreground transition hover:bg-surface"
          aria-label="Reset zoom">
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={zoomIn}
          disabled={scale >= MAX_ZOOM}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-surface disabled:opacity-40">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        data-canvas-surface="true"
        className={cn(
          "relative z-[1] h-full w-full touch-none",
          isPanning ? "cursor-grabbing" : "cursor-grab",
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopPanning}
        onPointerCancel={stopPanning}>
        <div
          className="absolute left-0 top-0 will-change-transform"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}>
          <div
            className="relative"
            style={{
              width: canvasWidth,
              minHeight: canvasHeight,
            }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
