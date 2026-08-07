import { BasketItem } from "../types/basket/basket";

/** Both are public values — the console shows them to anyone with the page. */
export const PORTONE_STORE_ID = `${process.env.NEXT_PUBLIC_PORTONE_STORE_ID ?? ""}`;
export const PORTONE_CHANNEL_KEY = `${process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY ?? ""}`;

export const portoneConfigured = Boolean(
  PORTONE_STORE_ID && PORTONE_CHANNEL_KEY,
);

/** The basket, flattened into what `createOrder` takes. */
export interface OrderItemInput {
  productId: string;
  itemQuantity: number;
  itemPrice: number;
}

export const toOrderItems = (items: BasketItem[]): OrderItemInput[] =>
  items.map((item) => ({
    productId: item.productId,
    itemQuantity: item.quantity,
    itemPrice: item.price,
  }));

export const generatePaymentId = () => {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `petora-${random}`;
};

/**
 * KakaoPay rejects an order name past 100 characters, and the basket can hold
 * far more than one product, so the rest becomes a count.
 */
export const buildOrderName = (items: BasketItem[], andMore: string) => {
  const first = items[0]?.name ?? "Petora";
  const name = items.length > 1 ? `${first} ${andMore}` : first;
  return name.length > 100 ? `${name.slice(0, 97)}...` : name;
};

/**
 * Google sign-ups get a `google-<sub>` placeholder rather than a real number
 * (see the member service), and PortOne rejects that outright — so anything
 * that isn't phone-shaped is left out of the payment request entirely.
 */
export const asPhoneNumber = (value?: string) => {
  const digits = (value ?? "").replace(/[^\d]/g, "");
  return digits.length >= 9 && digits.length <= 15 ? digits : undefined;
};

/**
 * A payment in flight, parked in localStorage.
 *
 * On mobile the PG takes over the whole tab, so the page that started the
 * payment is gone by the time it succeeds. What comes back is a paymentId in
 * the query string and nothing else — this is how the returning page knows
 * which basket that payment was for.
 */
export interface PendingPayment {
  paymentId: string;
  items: OrderItemInput[];
  basket: BasketItem[];
  total: number;
}

const PENDING_KEY = "petora-pending-payment";

export const savePendingPayment = (pending: PendingPayment) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    // Private mode / quota. The desktop flow never needs this back, and the
    // redirect flow surfaces the loss as a normal payment error.
  }
};

export const readPendingPayment = (): PendingPayment | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingPayment;
    return parsed?.paymentId ? parsed : null;
  } catch {
    return null;
  }
};

export const clearPendingPayment = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_KEY);
};

export interface PaymentRequestArgs {
  paymentId: string;
  orderName: string;
  totalAmount: number;
  /** Echoed back to us by PortOne — the server checks the buyer matches. */
  customData: Record<string, string>;
  customer?: { fullName?: string; phoneNumber?: string; email?: string };
  redirectUrl: string;
}

/**
 * Opens the KakaoPay window and resolves once the customer is done with it.
 *
 * On desktop the PG runs in an iframe and this resolves with the result. On
 * mobile it redirects to `redirectUrl` instead and never resolves — which is
 * why the caller must persist the pending payment before awaiting it.
 */
export const requestKakaoPayment = async (args: PaymentRequestArgs) => {
  // Loaded on demand: the SDK reaches for `window` and only matters once
  // somebody actually pays.
  const PortOne = await import("@portone/browser-sdk/v2");

  return PortOne.requestPayment({
    storeId: PORTONE_STORE_ID,
    channelKey: PORTONE_CHANNEL_KEY,
    paymentId: args.paymentId,
    orderName: args.orderName,
    totalAmount: args.totalAmount,
    currency: "KRW",
    payMethod: "EASY_PAY",
    customer: args.customer,
    customData: args.customData,
    redirectUrl: args.redirectUrl,
  });
};
