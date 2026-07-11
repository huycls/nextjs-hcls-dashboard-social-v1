import {
  getCanvasNodeSize,
  type CanvasConnection,
  type CanvasNode,
} from "@/lib/automations/workflow-templates";

export type AnchorSide = "top" | "bottom" | "left" | "right";

export type Point = { x: number; y: number };

export function getNodeAnchor(node: CanvasNode, side: AnchorSide): Point {
  const { width, height } = getCanvasNodeSize(node);
  const cx = node.x + width / 2;
  const cy = node.y + height / 2;

  switch (side) {
    case "top":
      return { x: cx, y: node.y };
    case "bottom":
      return { x: cx, y: node.y + height };
    case "left":
      return { x: node.x, y: cy };
    case "right":
      return { x: node.x + width, y: cy };
    default:
      return { x: cx, y: cy };
  }
}

function resolveSides(
  from: CanvasNode,
  to: CanvasNode,
): { fromSide: AnchorSide; toSide: AnchorSide } {
  const fromSize = getCanvasNodeSize(from);
  const toSize = getCanvasNodeSize(to);
  const fromCx = from.x + fromSize.width / 2;
  const fromCy = from.y + fromSize.height / 2;
  const toCx = to.x + toSize.width / 2;
  const toCy = to.y + toSize.height / 2;

  const dx = toCx - fromCx;
  const dy = toCy - fromCy;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return {
      fromSide: dx >= 0 ? "right" : "left",
      toSide: dx >= 0 ? "left" : "right",
    };
  }

  return {
    fromSide: dy >= 0 ? "bottom" : "top",
    toSide: dy >= 0 ? "top" : "bottom",
  };
}

/** Smooth cubic bezier connector */
export function buildBezierPath(
  from: Point,
  to: Point,
  fromSide: AnchorSide,
  toSide: AnchorSide,
): string {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  const offset = Math.max(40, Math.min(dx, dy, 120) * 0.55 + 24);

  const c1 = { ...from };
  const c2 = { ...to };

  if (fromSide === "right") c1.x += offset;
  if (fromSide === "left") c1.x -= offset;
  if (fromSide === "bottom") c1.y += offset;
  if (fromSide === "top") c1.y -= offset;

  if (toSide === "right") c2.x += offset;
  if (toSide === "left") c2.x -= offset;
  if (toSide === "bottom") c2.y += offset;
  if (toSide === "top") c2.y -= offset;

  return `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`;
}

export function buildConnectionPath(
  nodes: CanvasNode[],
  connection: CanvasConnection,
): string {
  const fromNode = nodes.find((node) => node.id === connection.from);
  const toNode = nodes.find((node) => node.id === connection.to);

  if (!fromNode || !toNode) return "";

  const { fromSide, toSide } = resolveSides(fromNode, toNode);
  const from = getNodeAnchor(fromNode, fromSide);
  const to = getNodeAnchor(toNode, toSide);

  return buildBezierPath(from, to, fromSide, toSide);
}

export function getConnectionLabelPoint(
  nodes: CanvasNode[],
  connection: CanvasConnection,
): Point | null {
  const fromNode = nodes.find((node) => node.id === connection.from);
  const toNode = nodes.find((node) => node.id === connection.to);
  if (!fromNode || !toNode || !connection.label) return null;

  const { fromSide, toSide } = resolveSides(fromNode, toNode);
  const from = getNodeAnchor(fromNode, fromSide);
  const to = getNodeAnchor(toNode, toSide);

  return {
    x: from.x + (to.x - from.x) * 0.35,
    y: from.y + (to.y - from.y) * 0.35,
  };
}

export function getStatusPillPosition(nodes: CanvasNode[]) {
  if (nodes.length === 0) {
    return { x: 360, y: 40, width: 220 };
  }

  const minX = Math.min(...nodes.map((node) => node.x));
  const maxX = Math.max(
    ...nodes.map((node) => node.x + getCanvasNodeSize(node).width),
  );

  return {
    x: minX + (maxX - minX) / 2 - 110,
    y: 48,
    width: 220,
  };
}
