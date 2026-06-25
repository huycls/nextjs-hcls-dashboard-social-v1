import type { Metadata } from "next";
import { NotFoundView } from "@/components/molecules/errors/not-found-view";

export const metadata: Metadata = {
  title: "404 — Page not found",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return <NotFoundView />;
}
