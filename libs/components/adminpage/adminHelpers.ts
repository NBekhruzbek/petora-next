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
  // Order statuses
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
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

/** `Jan 12, 2026` — the format the panel was designed around. */
export const formatDate = (value?: Date | string | number) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const won = (amount?: number) => `₩${(amount ?? 0).toLocaleString()}`;

/** Uploaded files are stored as relative paths; absolute URLs pass through. */
export const imageUrl = (path?: string, fallback: string = BLANK_IMAGE) => {
  if (!path) return fallback;
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) {
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
export const useDebouncedValue = <T,>(value: T, delay = 400): T => {
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
