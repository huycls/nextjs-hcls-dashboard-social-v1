"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Sun } from "lucide-react";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex w-full max-w-[420px] flex-col">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white">
        <Sun className="h-5 w-5" />
      </div>

      <h1 className="text-[32px] font-semibold tracking-tight text-gray-900">
        Hi, Welcome
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Please login to your account
      </p>

      <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              defaultValue="fajar@gmail.com"
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              defaultValue="password123"
              autoComplete="current-password"
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
            />
            <button
              type="button"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-300"
            />
            Remember me
          </label>
          <Link
            href="#"
            className="text-sm font-medium text-gray-900 underline underline-offset-2"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-gray-900 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
        >
          Login
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#F9FAFB] px-3 text-sm text-gray-500">
            Or login with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 transition hover:bg-gray-50"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 transition hover:bg-gray-50"
        >
          <AppleIcon />
          Sign in with Apple
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="#"
          className="font-medium text-gray-900 underline underline-offset-2"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
