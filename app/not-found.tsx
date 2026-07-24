import type { Metadata } from "next";
import { NotFoundView } from "@/components/molecules/errors/not-found-view";

export const metadata: Metadata = {
  title: "404 — Không tìm thấy trang",
  description: "Trang bạn đang tìm kiếm không tồn tại.",
};

export default function NotFound() {
  return <NotFoundView />;
}
