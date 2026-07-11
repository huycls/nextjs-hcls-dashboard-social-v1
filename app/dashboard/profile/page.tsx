import type { Metadata } from "next";
import { UserProfilePage } from "@/components/templates/dashboard/user-profile-page";

export const metadata: Metadata = {
  title: "Avispark — Profile",
  description: "Edit your account information",
};

export default function ProfilePage() {
  return <UserProfilePage />;
}
