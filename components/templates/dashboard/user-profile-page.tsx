"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import {
  getUserInitials,
  readUserProfile,
  writeUserProfile,
  type UserProfile,
} from "@/lib/auth/user-profile";

type FormState = Pick<UserProfile, "name" | "email" | "title" | "phone">;

export function UserProfilePage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    title: "",
    phone: "",
  });
  const [profileId, setProfileId] = useState<string | undefined>();
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const profile = readUserProfile();
    setProfileId(profile.id);
    setForm({
      name: profile.name,
      email: profile.email,
      title: profile.title,
      phone: profile.phone,
    });
    setReady(true);
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setSaved(false);
    setError(null);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const name = form.name.trim();
    if (!name) {
      setError("Name is required.");
      return;
    }

    const email = form.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setSaving(true);
    writeUserProfile({
      id: profileId,
      name,
      email,
      title: form.title.trim(),
      phone: form.phone.trim(),
    });
    setSaving(false);
    setSaved(true);
  }

  const initials = getUserInitials(form.name, form.email);

  return (
    <div className="min-h-screen overflow-y-auto bg-background">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-6 sm:px-8 lg:py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-heading">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-heading">
              Profile
            </h1>
            <p className="mt-1 text-sm text-muted">
              Update your basic account information.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-[var(--primary-foreground,#fff)]">
            {ready ? initials : "…"}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="surface-card rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="space-y-4">
            <Field
              id="profile-name"
              label="Full name"
              value={form.name}
              onChange={(value) => updateField("name", value)}
              placeholder="Your name"
              required
              disabled={!ready || saving}
            />
            <Field
              id="profile-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => updateField("email", value)}
              placeholder="you@company.com"
              disabled={!ready || saving}
            />
            <Field
              id="profile-title"
              label="Job title"
              value={form.title}
              onChange={(value) => updateField("title", value)}
              placeholder="Product Designer"
              disabled={!ready || saving}
            />
            <Field
              id="profile-phone"
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(value) => updateField("phone", value)}
              placeholder="+84 900 000 000"
              disabled={!ready || saving}
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-rose-500" role="alert">
              {error}
            </p>
          )}

          {saved && !error && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--node-green)]">
              <Check className="h-4 w-4" />
              Profile saved.
            </p>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-elevated">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!ready || saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-[var(--primary-foreground,#fff)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-heading">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
      />
    </div>
  );
}
