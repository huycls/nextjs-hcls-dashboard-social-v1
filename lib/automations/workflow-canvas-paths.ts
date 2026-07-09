import type { CanvasNode, CanvasConnection } from "@/lib/automations/workflow-templates";
import { CANVAS_ICON_SIZE } from "@/lib/automations/workflow-templates";

export type AnchorSide = "top" | "bottom" | "left" | "right";

export type Point = { x: number; y: number };

const CANVAS_WIDTH = 520;

export function getNodeAnchor(node: CanvasNode, side: AnchorSide): Point {
  const size = CANVAS_ICON_SIZE;
  const cx = node.x + size / 2;
  const cy = node.y + size / 2;

  switch (side) {
    case "top":
      return { x: cx, y: node.y };
    case "bottom":
      return { x: cx, y: node.y + size };
    case "left":
      return { x: node.x, y: cy };
    case "right":
      return { x: node.x + size, y: cy };
    default:
      return { x: cx, y: cy };
  }
}

/** Orthogonal elbow connector */
export function buildElbowPath(
  from: Point,
  to: Point,
  fromSide: AnchorSide = "bottom",
  toSide: AnchorSide = "top",
): string {
  const elbowY =
    fromSide === "bottom" && toSide === "top"
      ? from.y + (to.y - from.y) / 2
      : fromSide === "top" && toSide === "bottom"
        ? from.y - (from.y - to.y) / 2
        : (from.y + to.y) / 2;

  if (fromSide === "bottom" && toSide === "top") {
    return `M ${from.x} ${from.y} L ${from.x} ${elbowY} L ${to.x} ${elbowY} L ${to.x} ${to.y}`;
  }

  if (fromSide === "bottom" && toSide === "bottom") {
    const midY = Math.max(from.y, to.y) + 20;
    return `M ${from.x} ${from.y} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y}`;
  }

  const midX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
}

export function buildConnectionPath(
  nodes: CanvasNode[],
  connection: CanvasConnection,
): string {
  const fromNode = nodes.find((node) => node.id === connection.from);
  const toNode = nodes.find((node) => node.id === connection.to);

  if (!fromNode || !toNode) return "";

  const from = getNodeAnchor(fromNode, "bottom");
  const to = getNodeAnchor(toNode, "top");

  return buildElbowPath(from, to);
}

export function getStatusPillPosition(nodes: CanvasNode[]) {
  const branchNodes = nodes.filter((node) => node.labelPosition === "below");
  const footerNodes = nodes.filter((node) =>
    ["complete", "review"].includes(node.id),
  );

  if (branchNodes.length === 0 || footerNodes.length === 0) {
    return { x: 120, y: 340, width: 280 };
  }

  const branchBottom = Math.max(...branchNodes.map((node) => node.y)) + 72;
  const footerTop = Math.min(...footerNodes.map((node) => node.y));
  const y = branchBottom + (footerTop - branchBottom) / 2 - 16;

  return {
    x: CANVAS_WIDTH / 2 - 140,
    y,
    width: 280,
  };
}
