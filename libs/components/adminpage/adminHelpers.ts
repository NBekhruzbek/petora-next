import { useEffect, useState } from "react";
import { ApolloError } from "@apollo/client";
import { REACT_APP_API_URL } from "@/libs/config";
import { Message } from "@/libs/enums/common.enum";

/**
 * Shared plumbing for the admin panel.
 *
 * The screens all speak the API's SCREAMING_CASE enums, while `admin.scss` was
 * written against lowercase chip classes. Rather than repeat that translation
 * in eight components, it lives here once.
 */

/** A 1x1 transparent gif, so a broken <img> collapses instead of showing a glyph. */
export const BLANK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

const CHIP_CLASS: Record<string, string> = {
  // Member / product / service / article / qna statuses
  ACTIVE: "active",
  PAUSE: "paused",
  BLOCK: "blocked",
  DELETE: "deleted",
  HIDE: "hidden",
  // Order statuses, in delivery-tracker order
  PROCESSED: "processed",
  SHIPPED: "shipped",
  EN_ROUTE: "en-route",
  ARRIVED: "arrived",
  CANCELLED: "cancelled",
  // Booking statuses. PENDING and CANCELLED are shared with the sets above.
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  REJECTED: "rejected",
  // Booking payment
  PAID: "paid",
  UNPAID: "unpaid",
  REFUNDED: "refunded",
};

/** `PAUSE` → `status-chip status-paused`, matching the classes in admin.scss. */
export const statusChipClass = (status?: string) =>
  `status-chip status-${CHIP_CLASS[status ?? ""] ?? "deleted"}`;

/** `DAY_CARE` → `Day care`. Used for every enum rendered as a label. */
export const prettyEnum = (value?: string) =>
  (value ?? "")
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

/** `Jan 12, 2026` in English, `2026. 1. 12.` in Korean. */
export const formatDate = (
  value: Date | string | number | undefined,
  locale = "en-US",
) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const won = (amount?: number) => `₩${(amount ?? 0).toLocaleString()}`;

/** Uploaded files are stored as relative paths; absolute URLs pass through. */
export const imageUrl = (path?: string, fallback: string = BLANK_IMAGE) => {
  if (!path) return fallback;
  if (
    path.startsWith("http") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  return `${REACT_APP_API_URL}/${path}`;
};

export const avatarUrl = (path?: string, name?: string) =>
  path
    ? imageUrl(path)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=6366f1&color=fff`;

/**
 * Some list resolvers (`getAllUsersByAdmin`, `getAllAgentsByAdmin`,
 * `getAllServices`) throw "No data found!" instead of returning an empty list,
 * so an empty table arrives as a query error. Callers use this to tell that
 * apart from a real failure and render their empty state instead.
 */
export const isNoDataError = (error?: ApolloError) =>
  Boolean(
    error?.graphQLErrors?.some((e) => e.message === Message.NO_DATA_FOUND),
  );

/** Keeps a search box from firing a query on every keystroke. */
export const useDebouncedValue = <T>(value: T, delay = 400): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

/** Total rows behind a paged query, from the `$facet` counter every list returns. */
export const metaTotal = (metaCounter?: { total: number }[]) =>
  metaCounter?.[0]?.total ?? 0;

export const useAdminTableLabels = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;
    const root = document.getElementById("admin-content");
    if (!root) return;

    const stamp = () => {
      root.querySelectorAll("table.admin-table").forEach((table) => {
        const labels = Array.from(table.querySelectorAll("thead th")).map(
          (th) => th.textContent?.trim() ?? "",
        );
        if (!labels.length) return;

        table.querySelectorAll("tbody tr").forEach((row) => {
          const cells = (row as HTMLTableRowElement).cells;
          // A short row is the colSpan'd empty state, not a record — it gets no
          // labels, and the stylesheet renders it as a plain centred message.
          if (cells.length !== labels.length) return;
          Array.from(cells).forEach((cell, i) => {
            if (labels[i] && cell.dataset.label !== labels[i]) {
              cell.dataset.label = labels[i];
            }
          });
        });
      });
    };

    stamp();

    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(stamp);
    });
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [enabled]);
};
