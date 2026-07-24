"use client";

import { useEffect, useId, useState } from "react";
import { Trash2 } from "lucide-react";
import { BrandLogo } from "@/components/atoms/BrandLogo";
import {
  redirectToCheckout,
  type BillingCycle,
} from "@/lib/payments/checkout";

export type CheckoutPlan = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  billing: BillingCycle;
};

type CheckoutDialogProps = {
  open: boolean;
  plan: CheckoutPlan | null;
  onClose: () => void;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function CheckoutDialog({ open, plan, onClose }: CheckoutDialogProps) {
  const titleId = useId();
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setError(null);
      setSubmitting(false);
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !plan) return null;

  const billingLabel =
    plan.billing === "monthly" ? "theo tháng" : "theo năm";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting || !plan) return;

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setError("Vui lòng nhập email hợp lệ.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await redirectToCheckout({
        email: trimmed,
        planId: plan.id,
        planName: plan.name,
        billing: plan.billing,
        price: plan.price,
      });
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Không thể chuyển đến trang thanh toán.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl bg-surface-elevated p-6 shadow-[var(--shadow-card-hover)] sm:p-8"
        onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex flex-col items-center gap-1">
              <BrandLogo
                className="h-6 w-6"
                variant="primary"
              />
              <span className="text-[10px] font-semibold tracking-wide text-heading">
                Avispark
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="text-lg font-semibold text-heading">
              Gói {plan.name}
            </h2>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-heading">
                ${plan.price}
              </span>
              {plan.compareAtPrice != null &&
                plan.compareAtPrice > plan.price && (
                  <span className="text-sm text-foreground line-through">
                    ${plan.compareAtPrice}
                  </span>
                )}
              <span className="text-xs text-foreground">/ tháng</span>
            </p>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-foreground transition hover:bg-surface hover:text-heading">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-6 text-center text-sm leading-relaxed text-foreground">
          Thanh toán{" "}
          <span className="font-semibold text-heading">${plan.price}</span>{" "}
          {billingLabel} cho gói {plan.name}. Đây là gói đăng ký và sẽ được
          gia hạn theo chu kỳ đã chọn.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4">
          <div>
            <label
              htmlFor={emailId}
              className="sr-only">
              Email
            </label>
            <input
              id={emailId}
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              disabled={submitting}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Nhập email của bạn"
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-heading outline-none transition placeholder:text-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </div>

          <p className="text-center text-xs leading-relaxed text-foreground">
            Email trên sẽ được dùng để tạo tài khoản. Bạn sẽ được chuyển đến
            Stripe để hoàn tất thanh toán.
          </p>

          {error && (
            <p
              role="alert"
              className="text-center text-sm text-rose-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !email.trim()}
            className="mx-auto flex h-11 w-full max-w-[11rem] items-center justify-center rounded-xl bg-neutral-500 text-sm font-medium text-white transition hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-600 dark:hover:bg-neutral-500">
            {submitting ? "Đang chuyển..." : "Thanh toán"}
          </button>
        </form>
      </div>
    </div>
  );
}
