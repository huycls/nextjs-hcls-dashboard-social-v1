export type BillingCycle = "monthly" | "yearly";

export type CheckoutPayload = {
  email: string;
  planId: string;
  planName: string;
  billing: BillingCycle;
  price: number;
};

/**
 * Redirects the user to Stripe Checkout.
 * Replace this with a server call that creates a Checkout Session
 * and returns `session.url` once Stripe is configured.
 */
export async function redirectToCheckout(
  payload: CheckoutPayload,
): Promise<void> {
  const checkoutBaseUrl = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL;

  if (!checkoutBaseUrl) {
    // Temporary fallback until Stripe Checkout is wired up.
    console.info("[checkout] Stripe not configured yet. Payload:", payload);
    throw new Error(
      "Stripe chưa được cấu hình. Thêm NEXT_PUBLIC_STRIPE_CHECKOUT_URL hoặc thay redirectToCheckout bằng Checkout Session API.",
    );
  }

  const url = new URL(checkoutBaseUrl);
  url.searchParams.set("email", payload.email);
  url.searchParams.set("planId", payload.planId);
  url.searchParams.set("billing", payload.billing);
  url.searchParams.set("price", String(payload.price));

  window.location.assign(url.toString());
}
