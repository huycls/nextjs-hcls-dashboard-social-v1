"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Minus, Plus } from "lucide-react";

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

type Point = { x: number; y: number };

type WorkflowCanvasViewportProps = {
  canvasWidth: number;
  canvasHeight: number;
  children: ReactNode;
  toolbar?: ReactNode;
};

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

export function WorkflowCanvasViewport({
  canvasWidth,
  canvasHeight,
  children,
  toolbar,
}: WorkflowCanvasViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<Point & { offsetX: number; offsetY: number }>({
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const fitToView = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const padding = 48;
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
    if (event.button !== 0 && event.button !== 1) return;

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

  return (
    <div
      ref={containerRef}
      className="relative min-w-0 flex-1 overflow-hidden">
      {toolbar}

      <div className="absolute right-6 top-6 z-10 flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-2 py-1 text-xs text-muted shadow-sm">
        <button
          type="button"
          aria-label="Zoom out"
          onClick={zoomOut}
          disabled={scale <= MIN_ZOOM}
          className="inline-flex h-6 w-6 items-center justify-center rounded transition hover:bg-surface disabled:opacity-40">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={fitToView}
          className="min-w-12 rounded px-1 py-0.5 font-medium text-foreground transition hover:bg-surface"
          aria-label="Reset zoom">
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={zoomIn}
          disabled={scale >= MAX_ZOOM}
          className="inline-flex h-6 w-6 items-center justify-center rounded transition hover:bg-surface disabled:opacity-40">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        data-canvas-surface="true"
        className={`h-full w-full touch-none ${
          isPanning ? "cursor-grabbing" : "cursor-grab"
        }`}
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
              backgroundColor: "var(--canvas)",
              backgroundImage:
                "radial-gradient(circle, var(--border) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
