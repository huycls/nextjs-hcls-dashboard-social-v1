import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/molecules/LoginParts/login-form";
import { LoginPreview } from "@/components/molecules/LoginParts/login-preview";

export const metadata: Metadata = {
  title: "Avispark — Đăng nhập",
  description: "Đăng nhập vào tài khoản Avispark",
};

function LoginFormFallback() {
  return (
    <div className="flex h-[420px] w-full max-w-[420px] items-center justify-center text-sm text-muted">
      Đang tải...
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1280px] items-center gap-8 px-6 py-10 lg:px-10">
        <section className="flex flex-1 items-center justify-center lg:justify-start">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </section>

        <section className="hidden flex-1 lg:block">
          <LoginPreview />
        </section>
      </div>
    </div>
  );
}
