import { useTranslation } from "react-i18next";
import { useIntlLocale } from "@/libs/i18n/format";
import { Box, Pagination, Stack } from "@mui/material";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import { ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { useLazyQuery, useQuery, useReactiveVar } from "@apollo/client";
import {
  GET_FAQS,
  GET_FAQ_DETAIL,
  GET_NOTICES,
  GET_NOTICE_DETAIL,
} from "@/apollo/user/query";
import { userVar } from "@/apollo/store";
import { FaqDetail } from "@/libs/types/faq/faq";
import { NoticeDetail } from "@/libs/types/notice/notice";
import { FaqType } from "@/libs/enums/faq.enum";
import { Direction } from "@/libs/enums/common.enum";

/** The notices tab is not a FaqType — it swaps the panel to a different collection. */
const NOTICES_TAB = "NOTICES";
type CategoryId = FaqType | typeof NOTICES_TAB;

interface CategoryItem {
  id: CategoryId;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
}

const categories: CategoryItem[] = [
  {
    id: FaqType.ORDERS_PAYMENTS,
    labelKey: "cs.cat.ORDERS_PAYMENTS",
    icon: Inventory2OutlinedIcon,
  },
  {
    id: FaqType.DELIVERY_TRACKING,
    labelKey: "cs.cat.DELIVERY_TRACKING",
    icon: LocalShippingOutlinedIcon,
  },
  {
    id: FaqType.RETURNS_REFUNDS,
    labelKey: "cs.cat.RETURNS_REFUNDS",
    icon: ReplayOutlinedIcon,
  },
  {
    id: FaqType.ACCOUNT_SECURITY,
    labelKey: "cs.cat.ACCOUNT_SECURITY",
    icon: ShieldOutlinedIcon,
  },
  {
    id: FaqType.PET_SERVICES,
    labelKey: "cs.cat.PET_SERVICES",
    icon: PetsOutlinedIcon,
  },
  {
    id: NOTICES_TAB,
    labelKey: "cs.cat.NOTICES",
    icon: NotificationsOutlinedIcon,
  },
];

// The panel has no FAQ pager in the design, so one page holds every FAQ of a type.
const FAQ_LIMIT = 30;
const NOTICE_PAGE_LIMIT = 8;

const BULLET_PREFIX = /^[-•*]\s+/;

const toLines = (content?: string) =>
  (content ?? "")
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

const toSentences = (text: string) =>
  (text.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) ?? [])
    .map((sentence) => sentence.trim())
    .filter(Boolean);

interface FaqContent {
  preview: string;
  paragraphs: string[];
  bullets: string[];
}

/**
 * `faqContent` is a single free-text field, so the collapsed/expanded split has to
 * be derived. Admins who write multi-line content get line-for-line paragraphs plus
 * a real bullet list; a single unbroken blob falls back to sentence splitting so the
 * card still has a short preview instead of dumping everything above the fold.
 */
const parseFaqContent = (content?: string): FaqContent => {
  const lines = toLines(content);
  const bullets = lines
    .filter((line) => BULLET_PREFIX.test(line))
    .map((line) => line.replace(BULLET_PREFIX, ""));
  const prose = lines.filter((line) => !BULLET_PREFIX.test(line));

  if (prose.length <= 1 && !bullets.length) {
    const [first, ...rest] = toSentences(prose[0] ?? "");
    return {
      preview: first ?? "",
      paragraphs: rest.length ? [rest.join(" ")] : [],
      bullets,
    };
  }

  return { preview: prose[0] ?? "", paragraphs: prose.slice(1), bullets };
};

const noticeParagraphs = (notice?: NoticeDetail) => {
  const lines = toLines(notice?.noticeContent);
  return lines.length ? lines : [notice?.noticeContent ?? ""].filter(Boolean);
};

// Was `noticeType.charAt(0) + slice(1).toLowerCase()` — title-casing the raw
// enum value only ever produces English.
const noticeBadgeKey = (noticeType: string) => `cs.noticeType.${noticeType}`;

/**
 * Signed-in members get their read state from the server (`meViewed`, recorded by
 * `getNoticeDetail`). Guests have no identity to store it against, so the badge
 * would reset on every reload — localStorage keeps it stable per browser instead.
 */
const GUEST_VIEWED_KEY = "petora-viewed-notices";

const readGuestViewedIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(GUEST_VIEWED_KEY) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
};

const writeGuestViewedIds = (ids: string[]) => {
  try {
    window.localStorage.setItem(GUEST_VIEWED_KEY, JSON.stringify(ids));
  } catch {
    // Private mode or a full quota — the badge falls back to session-only memory.
  }
};

const formatNoticeDate = (value: Date | string | undefined, locale: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SupportHub = () => {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const [activeCategory, setActiveCategory] = useState<CategoryId>(
    FaqType.ORDERS_PAYMENTS,
  );
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(
    null,
  );
  // Guest read state, hydrated from localStorage after mount so SSR markup matches.
  const [guestViewedIds, setGuestViewedIds] = useState<string[]>([]);
  // Covers the gap between opening a notice and the server confirming the view.
  const [sessionViewedIds, setSessionViewedIds] = useState<string[]>([]);
  const [noticePage, setNoticePage] = useState(1);
  const noticeTopRef = useRef<HTMLDivElement | null>(null);

  const user = useReactiveVar(userVar);
  const memberId = user?._id ?? "";
  const isNoticeView = activeCategory === NOTICES_TAB;

  /** APOLLO REQUESTS **/

  const {
    data: faqsData,
    previousData: faqsPreviousData,
    loading: faqsLoading,
    error: faqsError,
  } = useQuery(GET_FAQS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    skip: isNoticeView,
    variables: {
      input: {
        page: 1,
        limit: FAQ_LIMIT,
        sort: "createdAt",
        direction: Direction.DESC,
        search: { faqType: isNoticeView ? undefined : activeCategory },
      },
    },
  });

  // Drives the banner above the panel — always the newest notice, regardless of
  // which page the notice list is parked on. `unviewedCounter` is scoped to the
  // whole collection, so the badge does not depend on the visible page either.
  const { data: latestNoticeData, refetch: refetchNoticeSummary } = useQuery(
    GET_NOTICES,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        input: {
          page: 1,
          limit: 1,
          sort: "createdAt",
          direction: Direction.DESC,
          search: {},
        },
      },
    },
  );

  const {
    data: noticesData,
    previousData: noticesPreviousData,
    loading: noticesLoading,
    error: noticesError,
  } = useQuery(GET_NOTICES, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    skip: !isNoticeView,
    variables: {
      input: {
        page: noticePage,
        limit: NOTICE_PAGE_LIMIT,
        sort: "createdAt",
        direction: Direction.DESC,
        search: {},
      },
    },
  });

  // Both detail queries exist to record a view for signed-in members; the payload
  // is the same normalized entity the list already returned.
  const [loadFaqDetail] = useLazyQuery(GET_FAQ_DETAIL, {
    fetchPolicy: "network-only",
  });
  const [loadNoticeDetail, { data: noticeDetailData }] = useLazyQuery(
    GET_NOTICE_DETAIL,
    { fetchPolicy: "network-only" },
  );

  /** DERIVED DATA **/

  // Keep the last good page on screen while a filter change is in flight, but drop
  // it on error so the empty state can take over.
  const faqsResult = faqsError ? undefined : (faqsData ?? faqsPreviousData);
  const faqs: FaqDetail[] = faqsResult?.getFaqs?.list ?? [];

  const noticesResult = noticesError
    ? undefined
    : (noticesData ?? noticesPreviousData);
  const notices: NoticeDetail[] = noticesResult?.getNotices?.list ?? [];
  const totalNotices: number =
    latestNoticeData?.getNotices?.metaCounter?.[0]?.total ?? 0;
  const pagedNoticeTotal: number =
    noticesResult?.getNotices?.metaCounter?.[0]?.total ?? 0;

  const latestNotice: NoticeDetail | undefined =
    latestNoticeData?.getNotices?.list?.[0];

  const faqContents = useMemo(() => {
    const map = new Map<string, FaqContent>();
    faqs.forEach((faq) => map.set(faq._id, parseFaqContent(faq.faqContent)));
    return map;
  }, [faqs]);

  // Members read from the server; guests fall back to what this browser remembers.
  const isNoticeRead = (notice: NoticeDetail) =>
    memberId
      ? Boolean(notice.meViewed?.length) ||
        sessionViewedIds.includes(notice._id)
      : guestViewedIds.includes(notice._id);

  const serverUnviewedCount: number =
    latestNoticeData?.getNotices?.unviewedCounter?.[0]?.total ?? 0;
  const unviewedNoticeCount = memberId
    ? serverUnviewedCount
    : Math.max(0, totalNotices - guestViewedIds.length);
  const totalNoticePages = Math.max(
    1,
    Math.ceil(pagedNoticeTotal / NOTICE_PAGE_LIMIT),
  );
  const currentNoticeStart = notices.length
    ? (noticePage - 1) * NOTICE_PAGE_LIMIT + 1
    : 0;
  const currentNoticeEnd = notices.length
    ? currentNoticeStart + notices.length - 1
    : 0;

  // A second click on another card can land before the first detail response, so
  // only trust the payload when it still matches the open notice.
  const detailNotice: NoticeDetail | undefined =
    noticeDetailData?.getNoticeDetail;
  const modalNotice =
    selectedNotice && detailNotice?._id === selectedNotice._id
      ? detailNotice
      : selectedNotice;

  const faqsPending = faqsLoading && !faqs.length;
  const noticesPending = noticesLoading && !notices.length;

  /** HANDLERS **/

  const handleCategorySelect = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    setExpandedFaqId(null);
    if (categoryId === NOTICES_TAB) setNoticePage(1);
  };

  const handleFaqToggle = (faqId: string) => {
    setExpandedFaqId((prev) => {
      if (prev === faqId) return null;
      loadFaqDetail({ variables: { input: faqId } }).catch(() => {});
      return faqId;
    });
  };

  const openNoticeModal = (notice: NoticeDetail) => {
    setSelectedNotice(notice);
    setSessionViewedIds((prev) =>
      prev.includes(notice._id) ? prev : [...prev, notice._id],
    );

    if (!memberId) {
      setGuestViewedIds((prev) => {
        if (prev.includes(notice._id)) return prev;
        const next = [...prev, notice._id];
        writeGuestViewedIds(next);
        return next;
      });
    }

    // For a member this call IS the view record. Its payload carries `meViewed`
    // and normalizes onto the list row, so the card marks itself read; the badge
    // needs the summary recounted server-side.
    loadNoticeDetail({ variables: { input: notice._id } })
      .then(() => {
        if (memberId) refetchNoticeSummary();
      })
      .catch(() => {});
  };

  const moveToNotices = () => {
    setActiveCategory(NOTICES_TAB);
    setExpandedFaqId(null);
    setNoticePage(1);
  };

  /** LIFECYCLES **/

  // Hydrated after mount, not in the initial state, so the server render and the
  // first client render agree.
  useEffect(() => {
    setGuestViewedIds(readGuestViewedIds());
  }, []);

  useEffect(() => {
    if (!isNoticeView) return;

    noticeTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [noticePage, isNoticeView]);

  // Deleting notices can shrink the list under the page the user is parked on.
  useEffect(() => {
    if (noticePage > totalNoticePages) setNoticePage(totalNoticePages);
  }, [noticePage, totalNoticePages]);

  return (
    <Stack className="support-hub-section">
      <Stack className="container">
        <button
          type="button"
          className="support-notice-highlight"
          onClick={moveToNotices}
        >
          <Stack className="notice-chip" direction="row">
            <Box className="notice-chip-label">{t("cs.noticesChip")}</Box>
            <Box className="notice-chip-count">{unviewedNoticeCount}</Box>
          </Stack>
          <Box className="notice-icon-wrap">
            <NotificationsOutlinedIcon className="notice-icon" />
          </Box>
          <Stack className="notice-copy">
            <Box className="title">
              {latestNotice
                ? t(noticeBadgeKey(latestNotice.noticeType))
                : t("cs.noticesChip")}
            </Box>
            <Box className="summary">
              {latestNotice
                ? latestNotice.noticeTitle
                : t("cs.noticesPlaceholder")}
            </Box>
          </Stack>
          <Box className="notice-cta">
            <LaunchRoundedIcon />
          </Box>
        </button>

        <Stack className="support-hub-main" direction="row">
          <Stack className="support-hub-sidebar">
            <Stack className="sidebar-list">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`sidebar-item ${isActive ? "active" : ""}`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <Icon className="sidebar-icon" />
                    <span>{t(category.labelKey)}</span>
                  </button>
                );
              })}
            </Stack>
          </Stack>

          <Stack className="support-hub-panel">
            {!isNoticeView ? (
              <>
                <Stack className="panel-head" direction="row">
                  <Box className="panel-title">{t("cs.popularQuestions")}</Box>
                </Stack>

                {faqsPending ? (
                  <Stack className="empty-state">
                    <Box className="empty-title">{t("cs.loadingFaqs")}</Box>
                    <Box className="empty-copy">{t("cs.loadingFaqsDesc")}</Box>
                  </Stack>
                ) : faqs.length ? (
                  <Box className="faq-grid">
                    {faqs.map((faq) => {
                      const isExpanded = expandedFaqId === faq._id;
                      const shouldFade = expandedFaqId && !isExpanded;
                      const content =
                        faqContents.get(faq._id) ?? parseFaqContent();

                      return (
                        <Box
                          key={faq._id}
                          className={`faq-card ${isExpanded ? "expanded" : ""} ${
                            shouldFade ? "faded" : ""
                          }`}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleFaqToggle(faq._id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              handleFaqToggle(faq._id);
                            }
                          }}
                        >
                          <Stack className="faq-card-inner">
                            <Stack className="faq-card-top" direction="row">
                              <Box className="faq-title">{faq.faqTitle}</Box>
                              <KeyboardArrowRightRoundedIcon className="faq-arrow" />
                            </Stack>

                            {content.preview ? (
                              <Box className="faq-description">
                                {content.preview}
                              </Box>
                            ) : null}

                            <Box className="faq-expanded-content">
                              {content.paragraphs.map((paragraph, index) => (
                                <Box
                                  className="faq-answer"
                                  key={`${faq._id}-p-${index}`}
                                >
                                  {paragraph}
                                </Box>
                              ))}

                              {content.bullets.length ? (
                                <ul className="faq-bullets">
                                  {content.bullets.map((bullet, index) => (
                                    <li key={`${faq._id}-b-${index}`}>
                                      {bullet}
                                    </li>
                                  ))}
                                </ul>
                              ) : null}

                              <Stack
                                className="faq-feedback-row"
                                direction="row"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <Box className="feedback-label">
                                  {t("cs.helpful")}
                                </Box>
                                <button
                                  type="button"
                                  className="close-expanded"
                                  onClick={() => setExpandedFaqId(null)}
                                >
                                  <CloseRoundedIcon />
                                </button>
                              </Stack>
                            </Box>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Stack className="empty-state">
                    <Box className="empty-title">{t("cs.noFaqs")}</Box>
                    <Box className="empty-copy">{t("cs.noFaqsDesc")}</Box>
                  </Stack>
                )}
              </>
            ) : (
              <>
                <Stack className="panel-head notice-head" direction="row">
                  <Stack className="notice-head-copy" ref={noticeTopRef}>
                    <Box className="panel-title">{t("cs.noticesTitle")}</Box>
                    <Box className="notice-results">
                      {t("cs.noticeResults", {
                        total: pagedNoticeTotal,
                        shown: notices.length,
                      })}
                    </Box>
                  </Stack>
                </Stack>

                {noticesPending ? (
                  <Stack className="empty-state">
                    <Box className="empty-title">{t("cs.loadingNotices")}</Box>
                    <Box className="empty-copy">
                      {t("cs.loadingNoticesDesc")}
                    </Box>
                  </Stack>
                ) : notices.length ? (
                  <>
                    <Stack className="notice-list">
                      {notices.map((notice) => (
                        <button
                          type="button"
                          key={notice._id}
                          className={`notice-card ${notice.noticeType.toLowerCase()} ${
                            isNoticeRead(notice) ? "viewed" : ""
                          }`}
                          onClick={() => openNoticeModal(notice)}
                        >
                          <Box className="notice-line" />
                          <Stack className="notice-body">
                            <Stack className="notice-meta" direction="row">
                              <Box className="notice-date">
                                {formatNoticeDate(notice.createdAt, intlLocale)}
                              </Box>
                              <Box
                                className={`notice-badge ${notice.noticeType.toLowerCase()}`}
                              >
                                {t(noticeBadgeKey(notice.noticeType))}
                              </Box>
                            </Stack>
                            <Box className="notice-title">
                              {notice.noticeTitle}
                            </Box>
                            <Box className="notice-summary">
                              {notice.noticeSummary}
                            </Box>
                          </Stack>
                          <KeyboardArrowRightRoundedIcon className="notice-arrow" />
                        </button>
                      ))}
                    </Stack>

                    <Stack className="notice-pagination-wrap" direction="row">
                      <Box className="notice-page-summary">
                        {currentNoticeStart}-{currentNoticeEnd} of{" "}
                        {pagedNoticeTotal} notices
                      </Box>
                      <Pagination
                        className="notice-pagination"
                        count={totalNoticePages}
                        page={noticePage}
                        color="primary"
                        shape="rounded"
                        onChange={(_event, page) => setNoticePage(page)}
                      />
                    </Stack>
                  </>
                ) : (
                  <Stack className="empty-state">
                    <Box className="empty-title">{t("cs.noNotices")}</Box>
                    <Box className="empty-copy">
                      Service updates, delivery notices, and announcements will
                      show up here as soon as the Petora team posts them.
                    </Box>
                  </Stack>
                )}
              </>
            )}
          </Stack>
        </Stack>
      </Stack>

      {modalNotice ? (
        <Box
          className="support-modal-backdrop"
          onClick={() => setSelectedNotice(null)}
          role="presentation"
        >
          <Stack
            className="support-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedNotice(null)}
            >
              <CloseRoundedIcon />
            </button>

            <Box className={modalNotice.noticeType.toLowerCase()}>
              {t(noticeBadgeKey(modalNotice.noticeType))}
            </Box>
            <Box className="modal-title">{modalNotice.noticeTitle}</Box>
            <Box className="modal-date">
              {formatNoticeDate(modalNotice.createdAt, intlLocale)}
            </Box>

            <Stack className="modal-copy">
              {noticeParagraphs(modalNotice).map((paragraph, index) => (
                <Box key={`${modalNotice._id}-${index}`}>{paragraph}</Box>
              ))}
            </Stack>
          </Stack>
        </Box>
      ) : null}
    </Stack>
  );
};

export default SupportHub;
