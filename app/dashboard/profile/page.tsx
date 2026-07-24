import type { Metadata } from "next";
import { UserProfilePage } from "@/components/templates/dashboard/user-profile-page";

export const metadata: Metadata = {
  title: "Avispark — Hồ sơ",
  description: "Chỉnh sửa thông tin tài khoản",
};

export default function ProfilePage() {
  return <UserProfilePage />;
}
