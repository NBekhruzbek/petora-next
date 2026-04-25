import { Box, Pagination, Stack } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import { ComponentType, FocusEvent, useMemo, useState } from "react";
import { useEffect, useRef } from "react";

type CategoryId =
  | "orders"
  | "delivery"
  | "returns"
  | "account"
  | "services"
  | "notices";

interface FaqItem {
  id: string;
  category: Exclude<CategoryId, "notices">;
  title: string;
  description: string;
  answer: string;
  bullets: string[];
}

interface NoticeItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  badge: "Important" | "Update";
  fullText: string[];
}

interface CategoryItem {
  id: CategoryId;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const categories: CategoryItem[] = [
  { id: "orders", label: "Orders & Payments", icon: Inventory2OutlinedIcon },
  {
    id: "delivery",
    label: "Delivery & Tracking",
    icon: LocalShippingOutlinedIcon,
  },
  { id: "returns", label: "Returns & Refunds", icon: ReplayOutlinedIcon },
  { id: "account", label: "Account & Security", icon: ShieldOutlinedIcon },
  { id: "services", label: "Pet Services", icon: PetsOutlinedIcon },
  { id: "notices", label: "Notices", icon: NotificationsOutlinedIcon },
];

const popularTopics = [
  "Track my order",
  "Return policy",
  "Reschedule grooming",
  "Payment security",
];

const faqs: FaqItem[] = [
  {
    id: "orders-1",
    category: "orders",
    title: "How do I confirm my payment went through?",
    description:
      "Check receipts, wallet activity, and order confirmation in one place.",
    answer:
      "Payments are confirmed as soon as the order timeline shows a completed status and a receipt is generated in your order details.",
    bullets: [
      "Open My Orders and select the latest order.",
      "Look for the receipt line under Payment Summary.",
      "If the charge is pending for more than 30 minutes, refresh the order page and check your email inbox.",
    ],
  },
  {
    id: "orders-2",
    category: "orders",
    title: "Can I split payment between points and card?",
    description: "Combine rewards and card payment during checkout.",
    answer:
      "Yes. Petora supports mixed payments when reward points cover part of the order total and a saved card completes the rest.",
    bullets: [
      "Apply available points on the checkout panel.",
      "Select a primary card for the remaining balance.",
      "Review the split before placing the order.",
    ],
  },
  {
    id: "delivery-1",
    category: "delivery",
    title: "Where can I see live delivery updates?",
    description:
      "Find the courier stage, expected arrival window, and status notes.",
    answer:
      "Live delivery updates appear in your order timeline with each handoff, route update, and delivery confirmation.",
    bullets: [
      "Open the order detail screen.",
      "Tap Tracking to view the latest courier checkpoint.",
      "Enable text alerts if you want arrival updates sent automatically.",
    ],
  },
  {
    id: "delivery-2",
    category: "delivery",
    title: "What happens if my pet essentials arrive late?",
    description:
      "Learn what Petora does when priority deliveries miss the promised time.",
    answer:
      "If a priority order misses its promised delivery window, the support team reviews the shipment automatically and may issue store credit depending on the delay.",
    bullets: [
      "Keep the order open until the final delivery scan appears.",
      "Use the Help with this Order action inside tracking.",
      "Our team checks courier logs before issuing a resolution.",
    ],
  },
  {
    id: "returns-1",
    category: "returns",
    title: "How do refunds work for unopened products?",
    description: "Start a return and understand timing for refunds.",
    answer:
      "Unopened products can usually be returned within the eligible window after inspection, and refunds are sent back to the original payment method.",
    bullets: [
      "Choose Return Item from the order detail page.",
      "Upload a quick photo of the unopened packaging if requested.",
      "Refunds usually post after warehouse inspection is completed.",
    ],
  },
  {
    id: "returns-2",
    category: "returns",
    title: "Can I reschedule a booked pet service instead of canceling?",
    description: "Move a grooming or care session without losing your booking.",
    answer:
      "Most appointments can be rescheduled directly from the booking card if the provider still has availability in the next open slots.",
    bullets: [
      "Open Bookings from your account menu.",
      "Select Manage Schedule on the appointment card.",
      "Choose a new time and review any policy notes before confirming.",
    ],
  },
  {
    id: "account-1",
    category: "account",
    title: "How can I secure my Petora account?",
    description: "Strengthen login protection and manage active sessions.",
    answer:
      "Security settings let you update your password, verify your email, and review recent devices that accessed your account.",
    bullets: [
      "Visit Account Settings and open Security.",
      "Update your password and confirm your email address.",
      "Sign out of devices you do not recognize.",
    ],
  },
  {
    id: "account-2",
    category: "account",
    title: "Why is my account temporarily limited?",
    description: "Understand verification holds and next steps.",
    answer:
      "Temporary limits usually appear when Petora detects unusual login activity or needs to re-verify payment details for account safety.",
    bullets: [
      "Check your inbox for a verification email.",
      "Complete the requested confirmation step.",
      "If the limit remains after verification, contact support with the email tied to your account.",
    ],
  },
  {
    id: "services-1",
    category: "services",
    title: "How do I prepare my pet for a grooming visit?",
    description:
      "A quick checklist to make handoff smoother for you and your pet.",
    answer:
      "Before a grooming visit, make sure your pet profile is up to date and share any sensitivities, medications, or behavior notes with the groomer.",
    bullets: [
      "Confirm the pet profile and vaccination details are current.",
      "Add notes about coat condition, skin sensitivity, or anxiety triggers.",
      "Arrive a few minutes early for a calmer handoff.",
    ],
  },
  {
    id: "services-2",
    category: "services",
    title: "Can I request the same sitter or walker again?",
    description: "Rebook favorite caregivers from past services.",
    answer:
      "Yes. If the provider is available, you can rebook them directly from your completed service history.",
    bullets: [
      "Open Past Services from your account.",
      "Choose the provider you want to book again.",
      "Select a new date and confirm the session details.",
    ],
  },
];

const notices: NoticeItem[] = [
  {
    id: "notice-1",
    title: "Holiday delivery windows are slightly extended this week",
    summary:
      "High order volume may add 1 to 2 days to some pet essentials and food deliveries in select areas.",
    date: "April 25, 2026",
    badge: "Important",
    fullText: [
      "Petora is seeing a seasonal increase in orders for food, toys, and grooming supplies in select delivery zones.",
      "Standard deliveries may take slightly longer than usual, especially for orders placed after 6 PM local time.",
      "Priority deliveries are still being processed first, and tracking pages will continue to show real-time courier updates.",
    ],
  },
  {
    id: "notice-2",
    title: "Booking reminders now include provider arrival windows",
    summary:
      "Service reminders have been refreshed to show clearer arrival estimates for walking and sitting sessions.",
    date: "April 22, 2026",
    badge: "Update",
    fullText: [
      "Reminder notifications now include a tighter arrival window so it is easier to plan your handoff.",
      "You will also see a direct link to your booking detail page from the reminder message.",
      "This update is rolling out gradually to all supported service categories.",
    ],
  },
  {
    id: "notice-3",
    title: "Refund timeline improvements for canceled service bookings",
    summary:
      "Eligible service refunds are now processed faster after provider-approved cancellations.",
    date: "April 18, 2026",
    badge: "Update",
    fullText: [
      "Refund requests tied to provider-approved service cancellations now enter expedited review.",
      "Most eligible refunds will be submitted to the original payment method sooner than before.",
      "You can continue to monitor progress from the booking detail page while the request is in motion.",
    ],
  },
  {
    id: "notice-4",
    title: "Expanded evening slots for dog walking in Seoul",
    summary:
      "New weekday evening booking slots are now available in select neighborhoods.",
    date: "April 16, 2026",
    badge: "Update",
    fullText: [
      "Petora has added additional evening walker availability in popular Seoul service areas.",
      "You may see more flexible slots between 6 PM and 9 PM when booking repeat walks.",
      "Availability still depends on your saved address and provider schedule.",
    ],
  },
  {
    id: "notice-5",
    title: "Profile photo upload issue has been resolved",
    summary:
      "Customers who had trouble updating pet profile photos can now retry successfully.",
    date: "April 14, 2026",
    badge: "Update",
    fullText: [
      "A temporary upload issue affected some pet profile edits on desktop.",
      "The issue has now been resolved and uploads should complete as expected.",
      "If a previous upload failed, reopening the profile editor should let you retry normally.",
    ],
  },
  {
    id: "notice-6",
    title: "Weekend grooming demand is higher than usual",
    summary:
      "Popular salons may book out earlier than normal for Saturday and Sunday appointments.",
    date: "April 12, 2026",
    badge: "Important",
    fullText: [
      "Weekend grooming demand has increased across several popular partner salons.",
      "Early booking is recommended if you want a preferred stylist or time window.",
      "Alternative weekday appointments may still be available in nearby locations.",
    ],
  },
  {
    id: "notice-7",
    title: "Faster cancellation confirmations for service bookings",
    summary:
      "Canceled bookings now update in the dashboard more quickly after provider approval.",
    date: "April 10, 2026",
    badge: "Update",
    fullText: [
      "Cancellation confirmations for pet services are now reflected faster in your account.",
      "This includes updated status labels and faster refund handoff when eligible.",
      "You can review the latest state from the booking detail screen.",
    ],
  },
  {
    id: "notice-8",
    title: "Late-night support replies may take slightly longer",
    summary:
      "Support remains available, but some complex requests may need extra overnight review time.",
    date: "April 8, 2026",
    badge: "Important",
    fullText: [
      "Our support team continues to monitor requests overnight.",
      "Some account and payment issues may require specialist follow-up the next morning.",
      "Urgent delivery and booking changes are still prioritized whenever possible.",
    ],
  },
  {
    id: "notice-9",
    title: "Improved receipt formatting for mixed payments",
    summary:
      "Receipts now show points and card splits more clearly after checkout.",
    date: "April 6, 2026",
    badge: "Update",
    fullText: [
      "Mixed payment receipts now separate reward point usage from card charges more clearly.",
      "This update applies to new transactions across supported checkout flows.",
      "Older receipts will continue to display in their previous format.",
    ],
  },
  {
    id: "notice-10",
    title: "Address edits are locked shortly before dispatch",
    summary:
      "Orders preparing for courier pickup may no longer support last-minute address changes.",
    date: "April 4, 2026",
    badge: "Important",
    fullText: [
      "Address edits remain available until an order reaches its courier preparation stage.",
      "Once dispatch is underway, you may need to contact support for rerouting options.",
      "Eligibility still depends on the courier and delivery area.",
    ],
  },
  {
    id: "notice-11",
    title: "Pet sitter notes now support longer care instructions",
    summary:
      "You can add more detailed feeding, medication, and behavior notes before a visit.",
    date: "April 2, 2026",
    badge: "Update",
    fullText: [
      "Petora has expanded the sitter instruction field for more detailed care guidance.",
      "This helps providers review routines, medication timing, and home access notes more easily.",
      "Existing bookings can also be updated if the provider has not started the session yet.",
    ],
  },
  {
    id: "notice-12",
    title: "Priority delivery labels refreshed in tracking view",
    summary:
      "Tracking pages now highlight priority shipment stages with clearer labels.",
    date: "March 30, 2026",
    badge: "Update",
    fullText: [
      "Priority shipments now use clearer visual labels throughout the tracking flow.",
      "This change makes it easier to distinguish standard and priority updates at a glance.",
      "The refresh is visual only and does not change delivery speed or eligibility.",
    ],
  },
];

const featuredNotice = notices[0];
const NOTICE_PAGE_LIMIT = 8;

const SupportHub = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("orders");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});
  const [viewedNoticeIds, setViewedNoticeIds] = useState<string[]>([]);
  const [noticePage, setNoticePage] = useState(1);
  const noticeTopRef = useRef<HTMLDivElement | null>(null);

  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredFaqs = useMemo(() => {
    const baseFaqs =
      activeCategory === "notices"
        ? faqs
        : faqs.filter((item) => item.category === activeCategory);

    if (!normalizedSearch) return baseFaqs;

    return faqs.filter((item) => {
      const haystack = [
        item.title,
        item.description,
        item.answer,
        item.category,
        item.bullets.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [activeCategory, normalizedSearch]);

  const filteredNotices = useMemo(() => {
    if (!normalizedSearch) return notices;

    return notices.filter((item) =>
      [item.title, item.summary, item.badge, item.fullText.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [normalizedSearch]);

  const handleSearchBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsSearchFocused(false);
    }
  };

  const handleCategorySelect = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    setExpandedFaqId(null);
    if (categoryId === "notices") {
      setNoticePage(1);
    }
  };

  const handleFaqToggle = (faqId: string) => {
    setExpandedFaqId((prev) => (prev === faqId ? null : faqId));
  };

  const handleSuggestionSelect = (value: string) => {
    setSearchValue(value);
    setIsSearchFocused(false);
    setExpandedFaqId(null);
    setActiveCategory("orders");
  };

  const openNoticeModal = (notice: NoticeItem) => {
    setSelectedNotice(notice);
    setViewedNoticeIds((prev) =>
      prev.includes(notice.id) ? prev : [...prev, notice.id],
    );
  };

  const moveToNotices = () => {
    setActiveCategory("notices");
    setExpandedFaqId(null);
    setNoticePage(1);
  };

  const unviewedNoticeCount = notices.length - viewedNoticeIds.length;
  const searchDropdownVisible = isSearchFocused && !selectedNotice;
  const isNoticeView = activeCategory === "notices";
  const totalNoticePages = Math.max(
    1,
    Math.ceil(filteredNotices.length / NOTICE_PAGE_LIMIT),
  );
  const currentNoticePage = Math.min(noticePage, totalNoticePages);
  const paginatedNotices = filteredNotices.slice(
    (currentNoticePage - 1) * NOTICE_PAGE_LIMIT,
    currentNoticePage * NOTICE_PAGE_LIMIT,
  );
  const currentNoticeStart =
    filteredNotices.length === 0
      ? 0
      : (currentNoticePage - 1) * NOTICE_PAGE_LIMIT + 1;
  const currentNoticeEnd =
    filteredNotices.length === 0
      ? 0
      : Math.min(currentNoticePage * NOTICE_PAGE_LIMIT, filteredNotices.length);

  useEffect(() => {
    if (!isNoticeView) return;

    noticeTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentNoticePage, isNoticeView]);

  return (
    <Stack className="support-hub-section">
      <Stack className="container">
        <Stack
          className="support-hub-search"
          onBlur={handleSearchBlur}
          tabIndex={-1}
        >
          <Box className="search-shell">
            <SearchRoundedIcon className="search-icon" />
            <input
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
                setExpandedFaqId(null);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search for help, orders, delivery..."
              aria-label="Search support topics"
            />
          </Box>

          {searchDropdownVisible ? (
            <Stack className="search-dropdown">
              <Stack className="search-group">
                <Box className="group-label">Popular topics</Box>
                <Stack className="topic-list">
                  {popularTopics.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="topic-link"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSuggestionSelect(item)}
                    >
                      <span>{item}</span>
                      <KeyboardArrowRightRoundedIcon />
                    </button>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          ) : null}
        </Stack>

        <button
          type="button"
          className="support-notice-highlight"
          onClick={moveToNotices}
        >
          <Stack className="notice-chip" direction="row">
            <Box className="notice-chip-label">Notices</Box>
            <Box className="notice-chip-count">{unviewedNoticeCount}</Box>
          </Stack>
          <Box className="notice-icon-wrap">
            <NotificationsOutlinedIcon className="notice-icon" />
          </Box>
          <Stack className="notice-copy">
            <Box className="title">Important Notice</Box>
            <Box className="summary">
              Uploaded new Important Notices, click to read more.
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
                    <span>{category.label}</span>
                    {category.id === "notices" ? (
                      <Box className="sidebar-badge">{unviewedNoticeCount}</Box>
                    ) : null}
                  </button>
                );
              })}
            </Stack>
          </Stack>

          <Stack className="support-hub-panel">
            {!isNoticeView ? (
              <>
                <Stack className="panel-head" direction="row">
                  <Box className="panel-title">
                    {normalizedSearch ? "Search Results" : "Popular Questions"}
                  </Box>
                </Stack>

                {filteredFaqs.length ? (
                  <Box className="faq-grid">
                    {filteredFaqs.map((faq) => {
                      const isExpanded = expandedFaqId === faq.id;
                      const shouldFade = expandedFaqId && !isExpanded;

                      return (
                        <Box
                          key={faq.id}
                          className={`faq-card ${isExpanded ? "expanded" : ""} ${
                            shouldFade ? "faded" : ""
                          }`}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleFaqToggle(faq.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              handleFaqToggle(faq.id);
                            }
                          }}
                        >
                          <Stack className="faq-card-inner">
                            <Stack className="faq-card-top" direction="row">
                              <Box className="faq-title">{faq.title}</Box>
                              <KeyboardArrowRightRoundedIcon className="faq-arrow" />
                            </Stack>

                            <Box className="faq-description">
                              {faq.description}
                            </Box>

                            <Box className="faq-expanded-content">
                              <Box className="faq-answer">{faq.answer}</Box>
                              <ul className="faq-bullets">
                                {faq.bullets.map((bullet) => (
                                  <li key={bullet}>{bullet}</li>
                                ))}
                              </ul>

                              <Stack
                                className="faq-feedback-row"
                                direction="row"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <Box className="feedback-label">
                                  Was this helpful?
                                </Box>
                                <Stack
                                  className="feedback-actions"
                                  direction="row"
                                >
                                  <button
                                    type="button"
                                    className={`feedback-btn ${
                                      feedback[faq.id] === "up"
                                        ? "selected"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setFeedback((prev) => ({
                                        ...prev,
                                        [faq.id]: "up",
                                      }))
                                    }
                                  >
                                    <ThumbUpAltOutlinedIcon />
                                  </button>
                                  <button
                                    type="button"
                                    className={`feedback-btn ${
                                      feedback[faq.id] === "down"
                                        ? "selected down"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setFeedback((prev) => ({
                                        ...prev,
                                        [faq.id]: "down",
                                      }))
                                    }
                                  >
                                    <ThumbDownAltOutlinedIcon />
                                  </button>
                                </Stack>
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
                    <Box className="empty-title">
                      No help topics matched that search.
                    </Box>
                    <Box className="empty-copy">
                      Try a simpler keyword like delivery, refund, or booking.
                      If you still need help, the contact form is right below
                      this section.
                    </Box>
                  </Stack>
                )}
              </>
            ) : (
              <>
                <Stack className="panel-head notice-head" direction="row">
                  <Stack className="notice-head-copy" ref={noticeTopRef}>
                    <Box className="panel-title">Notices</Box>
                    <Box className="notice-results">
                      Total {filteredNotices.length} notices, showing{" "}
                      {paginatedNotices.length} on this page
                    </Box>
                  </Stack>
                </Stack>

                <Stack className="notice-list">
                  {paginatedNotices.map((notice) => (
                    <button
                      type="button"
                      key={notice.id}
                      className={`notice-card ${
                        notice.badge === "Important" ? "important" : "update"
                      } ${viewedNoticeIds.includes(notice.id) ? "viewed" : ""}`}
                      onClick={() => openNoticeModal(notice)}
                    >
                      <Box className="notice-line" />
                      <Stack className="notice-body">
                        <Stack className="notice-meta" direction="row">
                          <Box className="notice-date">{notice.date}</Box>
                          <Box
                            className={`notice-badge ${notice.badge.toLowerCase()}`}
                          >
                            {notice.badge}
                          </Box>
                        </Stack>
                        <Box className="notice-title">{notice.title}</Box>
                        <Box className="notice-summary">{notice.summary}</Box>
                      </Stack>
                      <KeyboardArrowRightRoundedIcon className="notice-arrow" />
                    </button>
                  ))}
                </Stack>

                <Stack className="notice-pagination-wrap" direction="row">
                  <Box className="notice-page-summary">
                    {currentNoticeStart}-{currentNoticeEnd} of{" "}
                    {filteredNotices.length} notices
                  </Box>
                  <Pagination
                    className="notice-pagination"
                    count={totalNoticePages}
                    page={currentNoticePage}
                    color="primary"
                    shape="rounded"
                    onChange={(_event, page) => setNoticePage(page)}
                  />
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>

      {selectedNotice ? (
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

            <Box className="modal-kicker">{selectedNotice.badge}</Box>
            <Box className="modal-title">{selectedNotice.title}</Box>
            <Box className="modal-date">{selectedNotice.date}</Box>

            <Stack className="modal-copy">
              {selectedNotice.fullText.map((paragraph) => (
                <Box key={paragraph}>{paragraph}</Box>
              ))}
            </Stack>
          </Stack>
        </Box>
      ) : null}
    </Stack>
  );
};

export default SupportHub;
