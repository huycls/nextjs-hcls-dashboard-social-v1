import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { LoginPreview } from "@/components/auth/login-preview";

export const metadata: Metadata = {
  title: "Flowaxon — Login",
  description: "Login to your Flowaxon account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1280px] items-center gap-8 px-6 py-10 lg:px-10">
        <section className="flex flex-1 items-center justify-center lg:justify-start">
          <LoginForm />
        </section>

        <section className="hidden flex-1 lg:block">
          <LoginPreview />
        </section>
      </div>
    </div>
  );
}
