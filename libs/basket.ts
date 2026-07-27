import { basketVar } from "@/apollo/store";
import { BasketItem } from "./types/basket/basket";
import { Product } from "./types/product/product";

const STORAGE_KEY = "petora-basket";

/** Won, matching the product prices coming back from the API. */
export const DELIVERY_FEE = 4000;
export const FREE_DELIVERY_THRESHOLD = 50000;

export const formatPrice = (value: number) =>
  `₩${Math.round(value).toLocaleString("ko-KR")}`;

const persist = (items: BasketItem[]) => {
  basketVar(items);
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota / private-mode failures shouldn't take the basket down with them.
  }
};

// Runs once, from an effect after mount, so the first client render still
// matches the empty basket the server rendered.
let hydrated = false;

export const hydrateBasket = () => {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) basketVar(parsed as BasketItem[]);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

/** The price the shop actually charges — discounted when a discount applies. */
export const currentProductPrice = (product: Product) =>
  product.productDiscount > 0 && product.productPriceAfterDiscount != null
    ? product.productPriceAfterDiscount
    : product.productPrice;

export const addToBasket = (product: Product, quantity = 1) => {
  const items = basketVar();
  const price = currentProductPrice(product);
  const existing = items.find((item) => item.productId === product._id);

  if (existing) {
    // Re-price the line on every add so a discount that changed since the
    // product was first added doesn't stay stale in the basket.
    persist(
      items.map((item) =>
        item.productId === product._id
          ? { ...item, price, quantity: item.quantity + quantity }
          : item,
      ),
    );
    return;
  }

  persist([
    ...items,
    {
      productId: product._id,
      name: product.productName,
      description: product.productShortDesc ?? "",
      price,
      quantity,
      image: product.productImages?.[0] ?? "",
    },
  ]);
};

export const removeFromBasket = (productId: string) =>
  persist(basketVar().filter((item) => item.productId !== productId));

export const increaseBasketQuantity = (productId: string) =>
  persist(
    basketVar().map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    ),
  );

// Stepping the last unit down removes the line entirely.
export const decreaseBasketQuantity = (productId: string) =>
  persist(
    basketVar().flatMap((item) => {
      if (item.productId !== productId) return item;
      return item.quantity === 1
        ? []
        : [{ ...item, quantity: item.quantity - 1 }];
    }),
  );

export const clearBasket = () => persist([]);

export const basketItemCount = (items: BasketItem[]) =>
  items.reduce((acc, item) => acc + item.quantity, 0);

export const basketSubtotal = (items: BasketItem[]) =>
  items.reduce((acc, item) => acc + item.price * item.quantity, 0);
