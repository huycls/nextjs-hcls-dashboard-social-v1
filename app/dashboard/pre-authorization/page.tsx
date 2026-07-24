import type { Metadata } from "next";
import { PreAuthorizationPage } from "@/components/templates/dashboard/pre-authorization-page";

export const metadata: Metadata = {
  title: "Avispark — Ủy quyền trước",
  description: "Quản lý quyền workflow cho người dùng con",
};

export default function PreAuthorizationRoute() {
  return <PreAuthorizationPage />;
}
