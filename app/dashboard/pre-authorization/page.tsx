import type { Metadata } from "next";
import { PreAuthorizationPage } from "@/components/templates/dashboard/pre-authorization-page";

export const metadata: Metadata = {
  title: "Avispark — Pre-Authorization",
  description: "Manage workflow permissions for child users",
};

export default function PreAuthorizationRoute() {
  return <PreAuthorizationPage />;
}
