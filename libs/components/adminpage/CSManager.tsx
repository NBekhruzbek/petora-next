import { useIntlLocale } from "@/libs/i18n/format";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Stack,
  Typography,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  TextField,
  Drawer,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CampaignIcon from "@mui/icons-material/Campaign";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ALL_FAQS_BY_ADMIN,
  GET_ALL_NOTICES_BY_ADMIN,
} from "@/apollo/admin/query";
import {
  CREATE_NEW_FAQ,
  CREATE_NEW_NOTICE,
  REMOVE_FAQ_BY_ADMIN,
  REMOVE_NOTICE_BY_ADMIN,
  UPDATE_FAQ,
  UPDATE_NOTICE_BY_ADMIN,
} from "@/apollo/admin/mutation";
import { FaqDetail } from "@/libs/types/faq/faq";
import { NoticeDetail } from "@/libs/types/notice/notice";
import { FaqStatus, FaqType } from "@/libs/enums/faq.enum";
import { NoticeStatus, NoticeType } from "@/libs/enums/notice.enum";
import { Direction } from "@/libs/enums/common.enum";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";
import { formatDate, metaTotal } from "./adminHelpers";

// One page holds every FAQ / notice — the CS page has no pager either.
const CS_LIMIT = 50;

const FAQ_CATEGORIES: { value: FaqType; labelKey: string }[] = [
  { value: FaqType.ORDERS_PAYMENTS, labelKey: "cs.cat.ORDERS_PAYMENTS" },
  { value: FaqType.DELIVERY_TRACKING, labelKey: "cs.cat.DELIVERY_TRACKING" },
  { value: FaqType.RETURNS_REFUNDS, labelKey: "cs.cat.RETURNS_REFUNDS" },
  { value: FaqType.ACCOUNT_SECURITY, labelKey: "cs.cat.ACCOUNT_SECURITY" },
  { value: FaqType.PET_SERVICES, labelKey: "cs.cat.PET_SERVICES" },
];

const NOTICE_TYPES = Object.values(NoticeType);

const NOTICE_STYLE: Record<string, { bg: string; color: string }> = {
  [NoticeType.IMPORTANT]: { bg: "#FEF2F2", color: "#EF4444" },
  [NoticeType.UPDATE]: { bg: "#EFF6FF", color: "#3B82F6" },
  [NoticeType.EVENT]: { bg: "#F5F3FF", color: "#8B5CF6" },
  [NoticeType.ANNOUNCEMENT]: { bg: "#ECFDF5", color: "#059669" },
};

const BULLET_PREFIX = /^[-•*]\s+/;

/**
 * `faqContent` and `noticeContent` are single free-text fields, but the public
 * CS page (`libs/components/cspage/SupportHub.tsx`) derives structure from
 * them: the first line is the preview, later plain lines are paragraphs, and
 * `- ` lines become a bullet list. These two pairs keep the editor's separate
 * fields and that on-the-wire convention in sync, so whatever an admin types
 * here is what /cs renders.
 */
const composeFaqContent = (
  description: string,
  answer: string,
  bullets: string[],
) =>
  [
    description.trim(),
    ...answer
      .split(/\r?\n+/)
      .map((line) => line.trim())
      .filter(Boolean),
    ...bullets
      .map((b) => b.trim())
      .filter(Boolean)
      .map((b) => `- ${b}`),
  ]
    .filter(Boolean)
    .join("\n");

const toSentences = (text: string) =>
  (text.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) ?? [])
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const parseFaqContent = (content?: string) => {
  const lines = (content ?? "")
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const bullets = lines
    .filter((line) => BULLET_PREFIX.test(line))
    .map((line) => line.replace(BULLET_PREFIX, ""));
  const prose = lines.filter((line) => !BULLET_PREFIX.test(line));

  // Same fallback the CS page applies: an FAQ written as one unbroken blob is
  // split on sentences so the preview stays short. Mirroring it here means the
  // editor shows the reader's split rather than dumping everything into the
  // description field.
  if (prose.length <= 1 && !bullets.length) {
    const [first, ...rest] = toSentences(prose[0] ?? "");
    return {
      description: first ?? "",
      answer: rest.join(" "),
      bullets,
    };
  }

  return {
    description: prose[0] ?? "",
    answer: prose.slice(1).join("\n"),
    bullets,
  };
};

const composeParagraphs = (paragraphs: string[]) =>
  paragraphs
    .map((p) => p.trim())
    .filter(Boolean)
    .join("\n");

const parseParagraphs = (content?: string) => {
  const lines = (content ?? "")
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length ? lines : [""];
};

// ─── Drawer shell ─────────────────────────────────────────────────────────────

const DrawerShell = ({
  open,
  onClose,
  title,
  subtitle,
  onSave,
  saveLabel,
  saveDisabled,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  onSave: () => void;
  saveLabel: string;
  saveDisabled: boolean;
  children: React.ReactNode;
}) => (
  <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    PaperProps={{ className: "admin-cs-drawer-paper" }}
    disablePortal
  >
    {/* Sticky Header */}
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      className="admin-cs-drawer-header"
    >
      <Stack flex={1} minWidth={0}>
        <Typography className="admin-cs-drawer-title">{title}</Typography>
        {subtitle && (
          <Typography className="admin-cs-drawer-subtitle">
            {subtitle}
          </Typography>
        )}
      </Stack>
      <IconButton
        onClick={onClose}
        size="small"
        className="admin-cs-drawer-close-btn"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Stack>

    {/* Body */}
    <Stack className="admin-cs-drawer-body">{children}</Stack>

    {/* Sticky Footer */}
    <Stack
      direction="row"
      justifyContent="flex-end"
      gap={1.5}
      className="admin-cs-drawer-footer"
    >
      <Button onClick={onClose} className="admin-cs-cancel-btn">
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onSave}
        disabled={saveDisabled}
        className="admin-cs-save-btn"
      >
        {saveLabel}
      </Button>
    </Stack>
  </Drawer>
);

// ═══════════════════════════════════════════════════════════════════════════════
// FAQ Tab
// ═══════════════════════════════════════════════════════════════════════════════

const FaqTab = () => {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const [categoryFilter, setCategoryFilter] = useState<FaqType | "ALL">("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FaqDetail | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    faqType: FaqType.ORDERS_PAYMENTS,
    faqStatus: FaqStatus.ACTIVE,
    title: "",
    description: "",
    answer: "",
    bullets: ["", "", ""],
  });

  /** APOLLO REQUESTS **/

  const searchFilter = {
    page: 1,
    limit: CS_LIMIT,
    sort: "createdAt",
    direction: Direction.DESC,
    search: categoryFilter === "ALL" ? {} : { faqType: categoryFilter },
  };

  const { data: faqsData, refetch: faqsRefetch } = useQuery(
    GET_ALL_FAQS_BY_ADMIN,
    {
      fetchPolicy: "cache-and-network",
      variables: { input: searchFilter },
      notifyOnNetworkStatusChange: true,
    },
  );

  const [createNewFaq] = useMutation(CREATE_NEW_FAQ);
  const [updateFaq] = useMutation(UPDATE_FAQ);
  const [removeFaqByAdmin] = useMutation(REMOVE_FAQ_BY_ADMIN);

  /** DERIVED **/

  const faqs: FaqDetail[] = faqsData?.getAllFaqsByAdmin?.list ?? [];
  const total = metaTotal(faqsData?.getAllFaqsByAdmin?.metaCounter);
  const isSaveEnabled =
    Boolean(form.title.trim()) &&
    Boolean(form.description.trim() || form.answer.trim()) &&
    !isSaving;

  /** HANDLERS **/

  const openAdd = () => {
    setEditingFaq(null);
    setForm({
      faqType:
        categoryFilter === "ALL" ? FaqType.ORDERS_PAYMENTS : categoryFilter,
      faqStatus: FaqStatus.ACTIVE,
      title: "",
      description: "",
      answer: "",
      bullets: ["", "", ""],
    });
    setDrawerOpen(true);
  };

  const openEdit = (faq: FaqDetail) => {
    const parsed = parseFaqContent(faq.faqContent);
    const bullets = [...parsed.bullets];
    while (bullets.length < 3) bullets.push("");
    setEditingFaq(faq);
    setForm({
      faqType: faq.faqType,
      faqStatus: faq.faqStatus,
      title: faq.faqTitle,
      description: parsed.description,
      answer: parsed.answer,
      bullets,
    });
    setDrawerOpen(true);
  };

  const save = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const faqContent = composeFaqContent(
        form.description,
        form.answer,
        form.bullets,
      );

      if (editingFaq) {
        await updateFaq({
          variables: {
            input: {
              faqId: editingFaq._id,
              faqType: form.faqType,
              faqStatus: form.faqStatus,
              faqTitle: form.title.trim(),
              faqContent,
            },
          },
        });
      } else {
        await createNewFaq({
          variables: {
            input: {
              faqType: form.faqType,
              faqStatus: form.faqStatus,
              faqTitle: form.title.trim(),
              faqContent,
            },
          },
        });
      }

      await faqsRefetch({ input: searchFilter });
      setDrawerOpen(false);
      await sweetBottomSmallSuccessAlert(
        editingFaq ? t("admin.cs.faqSaved") : t("admin.cs.faqAdded"),
        700,
      );
    } catch (err: any) {
      console.log("ERROR, save faq:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // removeFaqByAdmin only matches rows already flagged DELETE, so deleting is
  // a status write followed by the removal.
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await updateFaq({
        variables: {
          input: { faqId: deleteTarget._id, faqStatus: FaqStatus.DELETE },
        },
      });
      await removeFaqByAdmin({ variables: { input: deleteTarget._id } });
      setDeleteTarget(null);
      await faqsRefetch({ input: searchFilter });
      await sweetBottomSmallSuccessAlert("FAQ deleted!", 700);
    } catch (err: any) {
      console.log("ERROR, delete faq:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const updateBullet = (i: number, val: string) =>
    setForm((p) => {
      const b = [...p.bullets];
      b[i] = val;
      return { ...p, bullets: b };
    });

  const addBullet = () =>
    setForm((p) => ({ ...p, bullets: [...p.bullets, ""] }));
  const removeBullet = (i: number) =>
    setForm((p) => ({
      ...p,
      bullets: p.bullets.filter((_, idx) => idx !== i),
    }));

  return (
    <Stack gap={0}>
      <Stack className="admin-toolbar">
        <Select
          size="small"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as FaqType | "ALL")}
          className="admin-toolbar-select admin-cs-faq-filter"
        >
          <MenuItem value="ALL">{t("admin.filter.allCategories")}</MenuItem>
          {FAQ_CATEGORIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {t(c.labelKey)}
            </MenuItem>
          ))}
        </Select>
        <Typography className="admin-meta-count">
          {t("admin.count.faq", { count: total })}
        </Typography>
        <Button
          variant="contained"
          onClick={openAdd}
          className="admin-cs-add-faq-btn"
        >
          {t("admin.addFaqBtn2")}
        </Button>
      </Stack>

      <Stack>
        {FAQ_CATEGORIES.filter(
          (c) => categoryFilter === "ALL" || c.value === categoryFilter,
        ).map((cat) => {
          const items = faqs.filter((f) => f.faqType === cat.value);
          if (!items.length) return null;
          return (
            <Stack key={cat.value}>
              {/* Category header */}
              <Stack className="admin-cs-category-header">
                <Typography className="admin-cs-category-label">
                  {t(cat.labelKey)} · {items.length}
                </Typography>
              </Stack>

              {items.map((faq, idx) => {
                const isExpanded = expandedId === faq._id;
                const parsed = parseFaqContent(faq.faqContent);
                return (
                  <Stack key={faq._id} className="admin-cs-faq-item">
                    {/* Row */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={1.5}
                      className="admin-cs-faq-row"
                      onClick={() => setExpandedId(isExpanded ? null : faq._id)}
                    >
                      <Stack flex={1} minWidth={0}>
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Typography className="admin-cs-faq-title">
                            Q{String(idx + 1).padStart(2, "0")}. {faq.faqTitle}
                          </Typography>
                          {faq.faqStatus === FaqStatus.HIDE && (
                            <span
                              className="status-chip status-hidden"
                              style={{ fontSize: "9.5px" }}
                            >
                              Hidden
                            </span>
                          )}
                        </Stack>
                        {!isExpanded && (
                          <Typography className="admin-cs-faq-desc">
                            {parsed.description}
                          </Typography>
                        )}
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={0.8}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="small"
                          onClick={() => openEdit(faq)}
                          className="admin-btn-sm admin-btn-sm-indigo"
                        >
                          {t("admin.act.edit")}
                        </Button>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(faq);
                          }}
                          className="admin-btn-sm admin-btn-sm-red"
                        >
                          {t("admin.act.delete")}
                        </Button>
                      </Stack>
                      <IconButton
                        size="small"
                        className="admin-cs-expand-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(isExpanded ? null : faq._id);
                        }}
                      >
                        {isExpanded ? (
                          <ExpandLessIcon fontSize="small" />
                        ) : (
                          <ExpandMoreIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Stack>

                    {/* Expanded content */}
                    {isExpanded && (
                      <Stack className="admin-cs-faq-expanded">
                        <Stack className="admin-cs-faq-answer-card">
                          <Typography className="admin-cs-faq-answer-text">
                            {parsed.answer || parsed.description}
                          </Typography>
                          {parsed.bullets.length > 0 && (
                            <Stack gap={0.6}>
                              {parsed.bullets.map((b, i) => (
                                <Stack
                                  key={i}
                                  direction="row"
                                  alignItems="flex-start"
                                  gap={1}
                                >
                                  <Stack className="admin-cs-bullet-dot" />
                                  <Typography className="admin-cs-bullet-text">
                                    {b}
                                  </Typography>
                                </Stack>
                              ))}
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          );
        })}

        {faqs.length === 0 && (
          <Stack className="admin-cs-empty">
            <Typography className="admin-cs-empty-text">
              {t("admin.empty.faqs")}
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* FAQ Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        disablePortal
      >
        <DialogTitle className="admin-cs-dialog-title">
          {t("admin.cs.deleteFaqTitle")}
        </DialogTitle>
        <DialogContent>
          <Typography className="admin-cs-dialog-body">
            This FAQ will be permanently removed from the CS page. This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="admin-cs-dialog-actions">
          <Button
            onClick={() => setDeleteTarget(null)}
            className="admin-cs-dialog-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            className="admin-cs-dialog-delete-btn"
          >
            {t("admin.act.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAQ Drawer */}
      <DrawerShell
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingFaq ? t("admin.cs.editFaq") : t("admin.cs.addFaq")}
        subtitle={t("admin.cs.visibleOnCs")}
        onSave={save}
        saveLabel={
          isSaving
            ? "Saving…"
            : editingFaq
              ? t("admin.cs.saveFaq")
              : t("admin.cs.addFaqBtn")
        }
        saveDisabled={!isSaveEnabled}
      >
        <Stack className="admin-cs-form-section-card">
          <Typography className="admin-cs-form-section-title">
            Category &amp; Question
          </Typography>
          <Stack gap={0.8}>
            <Typography className="admin-cs-form-field-label">
              Category
            </Typography>
            <Select
              size="small"
              value={form.faqType}
              onChange={(e) =>
                setForm((p) => ({ ...p, faqType: e.target.value as FaqType }))
              }
              className="admin-cs-cat-select"
            >
              {FAQ_CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {t(c.labelKey)}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <Stack gap={0.8}>
            <Typography className="admin-cs-form-field-label">
              Visibility
            </Typography>
            <Select
              size="small"
              value={form.faqStatus}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  faqStatus: e.target.value as FaqStatus,
                }))
              }
              className="admin-cs-cat-select"
            >
              <MenuItem value={FaqStatus.ACTIVE}>
                {t("admin.state.visible")}
              </MenuItem>
              <MenuItem value={FaqStatus.HIDE}>
                {t("admin.state.hidden")}
              </MenuItem>
            </Select>
          </Stack>
          <TextField
            label={t("admin.cs.question")}
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            size="small"
            fullWidth
            className="admin-cs-input"
          />
          <TextField
            label={t("admin.cs.shortDesc")}
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            size="small"
            fullWidth
            helperText="First line of the answer — shown collapsed on the CS page"
            className="admin-cs-input"
          />
        </Stack>

        <Stack className="admin-cs-form-section-card">
          <Typography className="admin-cs-form-section-title">
            Answer
          </Typography>
          <TextField
            label={t("admin.cs.fullAnswer")}
            value={form.answer}
            onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
            multiline
            rows={4}
            fullWidth
            inputProps={{ style: { color: "#111827" } }}
            InputProps={{
              style: {
                height: "auto",
                minHeight: "100px",
                alignItems: "flex-start",
              },
            }}
            className="admin-cs-multiline-input"
          />

          <Stack gap={1.2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack>
                <Typography className="admin-cs-step-instructions-text">
                  Step-by-Step Instructions
                </Typography>
                <Typography className="admin-cs-step-instructions-sub">
                  Action steps shown as a bullet list below the answer
                </Typography>
              </Stack>
              <Button
                size="small"
                onClick={addBullet}
                className="admin-cs-add-step-btn"
              >
                Add Step
              </Button>
            </Stack>
            {form.bullets.map((b, i) => (
              <Stack key={i} direction="row" alignItems="center" gap={1}>
                <Stack className="admin-cs-step-num-box">
                  <Typography className="admin-cs-step-num-text">
                    {i + 1}
                  </Typography>
                </Stack>
                <TextField
                  value={b}
                  onChange={(e) => updateBullet(i, e.target.value)}
                  size="small"
                  fullWidth
                  placeholder={`Bullet point ${i + 1}`}
                  inputProps={{ style: { color: "#111827" } }}
                  className="admin-cs-bullet-input-h38"
                />
                {form.bullets.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => removeBullet(i)}
                    className="admin-cs-remove-bullet-btn"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </DrawerShell>
    </Stack>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Notices Tab
// ═══════════════════════════════════════════════════════════════════════════════

const NoticesTab = () => {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const [typeFilter, setTypeFilter] = useState<NoticeType | "ALL">("ALL");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NoticeDetail | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    noticeType: NoticeType.UPDATE,
    noticeStatus: NoticeStatus.ACTIVE,
    paragraphs: [""],
  });

  /** APOLLO REQUESTS **/

  const searchFilter = {
    page: 1,
    limit: CS_LIMIT,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {},
  };

  const { data: noticesData, refetch: noticesRefetch } = useQuery(
    GET_ALL_NOTICES_BY_ADMIN,
    {
      fetchPolicy: "cache-and-network",
      variables: { input: searchFilter },
      notifyOnNetworkStatusChange: true,
    },
  );

  const [createNewNotice] = useMutation(CREATE_NEW_NOTICE);
  const [updateNoticeByAdmin] = useMutation(UPDATE_NOTICE_BY_ADMIN);
  const [removeNoticeByAdmin] = useMutation(REMOVE_NOTICE_BY_ADMIN);

  /** DERIVED **/

  // NoticeInquiry has no type filter, so this one narrows client-side over the
  // single page the CS page also loads.
  const allNotices: NoticeDetail[] =
    noticesData?.getAllNoticesByAdmin?.list ?? [];
  const notices = allNotices.filter(
    (n) => typeFilter === "ALL" || n.noticeType === typeFilter,
  );
  const isSaveEnabled =
    Boolean(form.title.trim()) && Boolean(form.summary.trim()) && !isSaving;

  /** HANDLERS **/

  const openAdd = () => {
    setEditingNotice(null);
    setForm({
      title: "",
      summary: "",
      noticeType: NoticeType.UPDATE,
      noticeStatus: NoticeStatus.ACTIVE,
      paragraphs: [""],
    });
    setDrawerOpen(true);
  };

  const openEdit = (notice: NoticeDetail) => {
    setEditingNotice(notice);
    setForm({
      title: notice.noticeTitle,
      summary: notice.noticeSummary,
      noticeType: notice.noticeType,
      noticeStatus: notice.noticeStatus,
      paragraphs: parseParagraphs(notice.noticeContent),
    });
    setDrawerOpen(true);
  };

  const save = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const noticeContent = composeParagraphs(form.paragraphs);
      if (!noticeContent) throw new Error(t("admin.cs.needParagraph"));

      if (editingNotice) {
        await updateNoticeByAdmin({
          variables: {
            input: {
              noticeId: editingNotice._id,
              noticeType: form.noticeType,
              noticeStatus: form.noticeStatus,
              noticeTitle: form.title.trim(),
              noticeSummary: form.summary.trim(),
              noticeContent,
            },
          },
        });
      } else {
        await createNewNotice({
          variables: {
            input: {
              noticeType: form.noticeType,
              noticeStatus: form.noticeStatus,
              noticeTitle: form.title.trim(),
              noticeSummary: form.summary.trim(),
              noticeContent,
            },
          },
        });
      }

      await noticesRefetch({ input: searchFilter });
      setDrawerOpen(false);
      await sweetBottomSmallSuccessAlert(
        editingNotice
          ? t("admin.cs.noticeSaved")
          : t("admin.cs.noticePublished"),
        700,
      );
    } catch (err: any) {
      console.log("ERROR, save notice:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await updateNoticeByAdmin({
        variables: {
          input: {
            noticeId: deleteTarget._id,
            noticeStatus: NoticeStatus.DELETE,
          },
        },
      });
      await removeNoticeByAdmin({ variables: { input: deleteTarget._id } });
      setDeleteTarget(null);
      await noticesRefetch({ input: searchFilter });
      await sweetBottomSmallSuccessAlert("Notice deleted!", 700);
    } catch (err: any) {
      console.log("ERROR, delete notice:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const updateParagraph = (i: number, val: string) =>
    setForm((p) => {
      const arr = [...p.paragraphs];
      arr[i] = val;
      return { ...p, paragraphs: arr };
    });

  return (
    <Stack gap={0}>
      <Stack className="admin-toolbar">
        <Select
          size="small"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as NoticeType | "ALL")}
          className="admin-toolbar-select admin-cs-cs-filter"
        >
          <MenuItem value="ALL">{t("admin.filter.allTypes")}</MenuItem>
          {NOTICE_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {t(`cs.noticeType.${type}`)}
            </MenuItem>
          ))}
        </Select>
        <Typography className="admin-meta-count">
          {t("admin.count.notice", { count: notices.length })}
        </Typography>
        <Button
          variant="contained"
          onClick={openAdd}
          className="admin-cs-add-notice-btn"
        >
          {t("admin.act.addNotice")}
        </Button>
      </Stack>

      <Stack>
        {notices.map((notice) => {
          const bs = NOTICE_STYLE[notice.noticeType] ?? NOTICE_STYLE.UPDATE;
          const isExpanded = expandedId === notice._id;
          const paragraphs = parseParagraphs(notice.noticeContent);
          return (
            <Stack key={notice._id} className="admin-cs-notice-item">
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
                className="admin-cs-notice-row"
                onClick={() => setExpandedId(isExpanded ? null : notice._id)}
              >
                <Stack flex={1} minWidth={0}>
                  <Stack direction="row" alignItems="center" gap={1} mb={0.3}>
                    {/* bg/color are dynamic (bs.bg, bs.color) */}
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        background: bs.bg,
                        color: bs.color,
                        borderRadius: "999px",
                        padding: "2px 9px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        flexShrink: 0,
                      }}
                    >
                      {t(`cs.noticeType.${notice.noticeType}`)}
                    </span>
                    {notice.noticeStatus === NoticeStatus.HIDE && (
                      <span
                        className="status-chip status-hidden"
                        style={{ fontSize: "9.5px" }}
                      >
                        Hidden
                      </span>
                    )}
                    <Typography className="admin-cs-notice-title">
                      {notice.noticeTitle}
                    </Typography>
                  </Stack>
                  {!isExpanded && (
                    <Typography className="admin-cs-notice-summary">
                      {notice.noticeSummary}
                    </Typography>
                  )}
                </Stack>

                <Typography className="admin-cs-notice-date">
                  {formatDate(notice.createdAt, intlLocale)}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.8}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="small"
                    onClick={() => openEdit(notice)}
                    className="admin-btn-sm admin-btn-sm-indigo"
                  >
                    {t("admin.act.edit")}
                  </Button>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(notice);
                    }}
                    className="admin-btn-sm admin-btn-sm-red"
                  >
                    {t("admin.act.delete")}
                  </Button>
                </Stack>
                <IconButton
                  size="small"
                  className="admin-cs-expand-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(isExpanded ? null : notice._id);
                  }}
                >
                  {isExpanded ? (
                    <ExpandLessIcon fontSize="small" />
                  ) : (
                    <ExpandMoreIcon fontSize="small" />
                  )}
                </IconButton>
              </Stack>

              {/* Expanded */}
              {isExpanded && (
                <Stack className="admin-cs-notice-expanded">
                  <Stack className="admin-cs-notice-expanded-card">
                    <Typography className="admin-cs-notice-summary-text">
                      {notice.noticeSummary}
                    </Typography>
                    <Divider className="admin-cs-notice-divider" />
                    {paragraphs.map((para, i) => (
                      <Typography key={i} className="admin-cs-notice-para">
                        {para}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          );
        })}

        {notices.length === 0 && (
          <Stack className="admin-cs-empty">
            <Typography className="admin-cs-empty-text">
              No notices found
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* Notice Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        disablePortal
      >
        <DialogTitle className="admin-cs-dialog-title">
          Delete Notice?
        </DialogTitle>
        <DialogContent>
          <Typography className="admin-cs-dialog-body">
            This notice will be permanently removed from the CS page. This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="admin-cs-dialog-actions">
          <Button
            onClick={() => setDeleteTarget(null)}
            className="admin-cs-dialog-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            className="admin-cs-dialog-delete-btn"
          >
            {t("admin.act.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notice Drawer */}
      <DrawerShell
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          editingNotice ? t("admin.cs.editNotice") : t("admin.cs.addNotice")
        }
        subtitle={t("admin.cs.shownOnCs")}
        onSave={save}
        saveLabel={
          isSaving
            ? "Saving…"
            : editingNotice
              ? "Save Changes"
              : "Publish Notice"
        }
        saveDisabled={!isSaveEnabled}
      >
        <Stack className="admin-cs-form-section-card">
          <Typography className="admin-cs-notice-badge-type-heading">
            Notice Details
          </Typography>

          {/* Type toggle */}
          <Stack gap={0.8}>
            <Typography className="admin-cs-form-field-label-dark">
              Type
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {NOTICE_TYPES.map((type) => {
                const bs = NOTICE_STYLE[type];
                const active = form.noticeType === type;
                return (
                  // border, background are dynamic (active state)
                  <Stack
                    key={type}
                    onClick={() => setForm((p) => ({ ...p, noticeType: type }))}
                    direction="row"
                    alignItems="center"
                    gap={1}
                    className="admin-cs-badge-option"
                    sx={{
                      border: "1.5px solid",
                      borderColor: active ? bs.color : "#E5E7EB",
                      background: active ? bs.bg : "#FAFAFA",
                      "&:hover": { borderColor: bs.color, background: bs.bg },
                    }}
                  >
                    <Stack
                      className="admin-cs-badge-dot"
                      sx={{ background: active ? bs.color : "#D1D5DB" }}
                    />
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: active ? bs.color : "#9CA3AF",
                      }}
                    >
                      {t(`cs.noticeType.${type}`)}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>

          {/* Visibility */}
          <Stack gap={0.8}>
            <Typography className="admin-cs-form-field-label-dark">
              Visibility
            </Typography>
            <Select
              size="small"
              value={form.noticeStatus}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  noticeStatus: e.target.value as NoticeStatus,
                }))
              }
              className="admin-cs-cat-select"
            >
              <MenuItem value={NoticeStatus.ACTIVE}>
                {t("admin.state.visible")}
              </MenuItem>
              <MenuItem value={NoticeStatus.HIDE}>
                {t("admin.state.hidden")}
              </MenuItem>
            </Select>
          </Stack>

          {/* Title */}
          <Stack gap={0.8}>
            <Typography className="admin-cs-form-field-label-dark">
              Title
            </Typography>
            <TextField
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              size="small"
              fullWidth
              placeholder={t("admin.cs.phNoticeTitle")}
              inputProps={{ style: { color: "#111827" } }}
              className="admin-cs-input-h42"
            />
          </Stack>

          {/* Summary */}
          <Stack gap={0.8}>
            <Typography className="admin-cs-form-field-label-dark">
              Summary{" "}
              <span
                style={{
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                  fontSize: "10px",
                  color: "#9CA3AF",
                }}
              >
                · one-line preview shown in list
              </span>
            </Typography>
            <TextField
              value={form.summary}
              onChange={(e) =>
                setForm((p) => ({ ...p, summary: e.target.value }))
              }
              size="small"
              fullWidth
              placeholder={t("admin.cs.phShortDesc")}
              inputProps={{ style: { color: "#111827" } }}
              className="admin-cs-input-h42"
            />
          </Stack>
        </Stack>

        <Stack className="admin-cs-form-section-card">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className="admin-cs-notice-full-content-heading">
              Full Content
            </Typography>
            <Button
              size="small"
              onClick={() =>
                setForm((p) => ({ ...p, paragraphs: [...p.paragraphs, ""] }))
              }
              className="admin-cs-add-para-btn"
            >
              Add Paragraph
            </Button>
          </Stack>
          {form.paragraphs.map((para, i) => (
            <Stack key={i} direction="row" alignItems="flex-start" gap={1}>
              <Stack className="admin-cs-para-num-box">
                <Typography className="admin-cs-para-num-text">
                  {i + 1}
                </Typography>
              </Stack>
              <TextField
                value={para}
                onChange={(e) => updateParagraph(i, e.target.value)}
                multiline
                rows={2}
                fullWidth
                placeholder={`Paragraph ${i + 1}`}
                inputProps={{ style: { color: "#111827" } }}
                InputProps={{
                  style: {
                    height: "auto",
                    minHeight: "60px",
                    alignItems: "flex-start",
                  },
                }}
                className="admin-cs-multiline-input"
              />
              {form.paragraphs.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      paragraphs: p.paragraphs.filter((_, idx) => idx !== i),
                    }))
                  }
                  className="admin-cs-remove-para-btn"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          ))}
        </Stack>
      </DrawerShell>
    </Stack>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Main CSManager
// ═══════════════════════════════════════════════════════════════════════════════

const CSManager = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">
          {t("admin.cs.title")}
        </Typography>
      </Stack>

      <Stack className="admin-card">
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          className="admin-cs-tabs"
        >
          <Tab
            label={
              <Stack direction="row" alignItems="center" gap={0.8}>
                <HelpOutlineIcon className="admin-icon-15" /> FAQ
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" gap={0.8}>
                <CampaignIcon className="admin-icon-15" /> {t("admin.notices")}
              </Stack>
            }
          />
        </Tabs>

        {tab === 0 && <FaqTab />}
        {tab === 1 && <NoticesTab />}
      </Stack>
    </Stack>
  );
};

export default CSManager;
