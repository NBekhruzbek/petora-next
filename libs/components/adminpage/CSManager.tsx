import { useState, useMemo } from "react";
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
import {
  mockFaqs,
  mockNotices,
  AdminFaq,
  AdminNotice,
  FaqCategory,
  NoticeBadge,
} from "../../data/adminMockData";

// ─── Constants ───────────────────────────────────────────────────────────────

const FAQ_CATEGORIES: { value: FaqCategory; label: string }[] = [
  { value: "orders", label: "Orders & Payments" },
  { value: "delivery", label: "Delivery & Tracking" },
  { value: "returns", label: "Returns & Refunds" },
  { value: "account", label: "Account & Security" },
  { value: "services", label: "Pet Services" },
];

const BADGE_OPTIONS: NoticeBadge[] = ["Important", "Update"];

const BADGE_STYLE: Record<NoticeBadge, { bg: string; color: string }> = {
  Important: { bg: "#FEF2F2", color: "#EF4444" },
  Update: { bg: "#EFF6FF", color: "#3B82F6" },
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
          <Typography className="admin-cs-drawer-subtitle">{subtitle}</Typography>
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
  const [faqs, setFaqs] = useState<AdminFaq[]>(mockFaqs);
  const [categoryFilter, setCategoryFilter] = useState<FaqCategory | "ALL">(
    "ALL",
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    category: "orders" as FaqCategory,
    title: "",
    description: "",
    answer: "",
    bullets: ["", "", ""],
  });

  const filtered = useMemo(
    () =>
      faqs.filter(
        (f) => categoryFilter === "ALL" || f.category === categoryFilter,
      ),
    [faqs, categoryFilter],
  );

  const openAdd = () => {
    setEditingFaq(null);
    setForm({
      category: "orders",
      title: "",
      description: "",
      answer: "",
      bullets: ["", "", ""],
    });
    setDrawerOpen(true);
  };

  const openEdit = (faq: AdminFaq) => {
    setEditingFaq(faq);
    const bullets = [...faq.bullets];
    while (bullets.length < 3) bullets.push("");
    setForm({
      category: faq.category,
      title: faq.title,
      description: faq.description,
      answer: faq.answer,
      bullets,
    });
    setDrawerOpen(true);
  };

  const save = () => {
    const bullets = form.bullets.filter((b) => b.trim());
    if (editingFaq) {
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === editingFaq.id ? { ...f, ...form, bullets } : f,
        ),
      );
    } else {
      setFaqs((prev) => [
        ...prev,
        { id: `faq-${Date.now()}`, ...form, bullets },
      ]);
    }
    setDrawerOpen(false);
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

  const isSaveEnabled = form.title.trim() && form.answer.trim();

  return (
    <Stack gap={0}>
      <Stack className="admin-toolbar">
        <Select
          size="small"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as any)}
          className="admin-toolbar-select admin-cs-faq-filter"
        >
          <MenuItem value="ALL">All Categories</MenuItem>
          {FAQ_CATEGORIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </Select>
        <Typography className="admin-meta-count">
          {filtered.length} FAQ{filtered.length !== 1 ? "s" : ""}
        </Typography>
        <Button
          variant="contained"
          onClick={openAdd}
          className="admin-cs-add-faq-btn"
        >
          Add FAQ
        </Button>
      </Stack>

      <Stack>
        {FAQ_CATEGORIES.filter(
          (c) => categoryFilter === "ALL" || c.value === categoryFilter,
        ).map((cat) => {
          const items = filtered.filter((f) => f.category === cat.value);
          if (!items.length) return null;
          return (
            <Stack key={cat.value}>
              {/* Category header */}
              <Stack className="admin-cs-category-header">
                <Typography className="admin-cs-category-label">
                  {cat.label} · {items.length}
                </Typography>
              </Stack>

              {items.map((faq, idx) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <Stack key={faq.id} className="admin-cs-faq-item">
                    {/* Row */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={1.5}
                      className="admin-cs-faq-row"
                      onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    >
                      <Stack flex={1} minWidth={0}>
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Typography className="admin-cs-faq-title">
                            Q{String(idx + 1).padStart(2, "0")}. {faq.title}
                          </Typography>
                        </Stack>
                        {!isExpanded && (
                          <Typography className="admin-cs-faq-desc">
                            {faq.description}
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
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(faq.id);
                          }}
                          className="admin-btn-sm admin-btn-sm-red"
                        >
                          Delete
                        </Button>
                      </Stack>
                      <IconButton
                        size="small"
                        className="admin-cs-expand-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(isExpanded ? null : faq.id);
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
                            {faq.answer}
                          </Typography>
                          {faq.bullets.length > 0 && (
                            <Stack gap={0.6}>
                              {faq.bullets.map((b, i) => (
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

        {filtered.length === 0 && (
          <Stack className="admin-cs-empty">
            <Typography className="admin-cs-empty-text">
              No FAQs found
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* FAQ Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" disablePortal>
        <DialogTitle className="admin-cs-dialog-title">Delete FAQ?</DialogTitle>
        <DialogContent>
          <Typography className="admin-cs-dialog-body">
            This FAQ will be permanently removed from the CS page. This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="admin-cs-dialog-actions">
          <Button
            onClick={() => setDeleteId(null)}
            className="admin-cs-dialog-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setFaqs((prev) => prev.filter((f) => f.id !== deleteId));
              setDeleteId(null);
            }}
            className="admin-cs-dialog-delete-btn"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAQ Drawer */}
      <DrawerShell
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingFaq ? "Edit FAQ" : "Add New FAQ"}
        subtitle="Visible to all users on the CS page"
        onSave={save}
        saveLabel={editingFaq ? "Save Changes" : "Add FAQ"}
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
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  category: e.target.value as FaqCategory,
                }))
              }
              className="admin-cs-cat-select"
            >
              {FAQ_CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <TextField
            label="Question (Title)"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            size="small"
            fullWidth
            className="admin-cs-input"
          />
          <TextField
            label="Short Description (preview)"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            size="small"
            fullWidth
            className="admin-cs-input"
          />
        </Stack>

        <Stack className="admin-cs-form-section-card">
          <Typography className="admin-cs-form-section-title">
            Answer
          </Typography>
          <TextField
            label="Full Answer"
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
  const [notices, setNotices] = useState<AdminNotice[]>(mockNotices);
  const [badgeFilter, setBadgeFilter] = useState<NoticeBadge | "ALL">("ALL");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<AdminNotice | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    badge: "Update" as NoticeBadge,
    date: "",
    paragraphs: [""],
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      notices.filter((n) => badgeFilter === "ALL" || n.badge === badgeFilter),
    [notices, badgeFilter],
  );

  const openAdd = () => {
    setEditingNotice(null);
    setForm({
      title: "",
      summary: "",
      badge: "Update",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      paragraphs: [""],
    });
    setDrawerOpen(true);
  };

  const openEdit = (notice: AdminNotice) => {
    setEditingNotice(notice);
    setForm({
      title: notice.title,
      summary: notice.summary,
      badge: notice.badge,
      date: notice.date,
      paragraphs: [...notice.fullText],
    });
    setDrawerOpen(true);
  };

  const save = () => {
    const fullText = form.paragraphs.filter((p) => p.trim());
    if (editingNotice) {
      setNotices((prev) =>
        prev.map((n) =>
          n.id === editingNotice.id ? { ...n, ...form, fullText } : n,
        ),
      );
    } else {
      setNotices((prev) => [
        { id: `notice-${Date.now()}`, ...form, fullText, featured: false },
        ...prev,
      ]);
    }
    setDrawerOpen(false);
  };

  const updateParagraph = (i: number, val: string) =>
    setForm((p) => {
      const arr = [...p.paragraphs];
      arr[i] = val;
      return { ...p, paragraphs: arr };
    });

  const isSaveEnabled =
    form.title.trim() && form.summary.trim() && form.date.trim();

  return (
    <Stack gap={0}>
      <Stack className="admin-toolbar">
        <Select
          size="small"
          value={badgeFilter}
          onChange={(e) => setBadgeFilter(e.target.value as any)}
          className="admin-toolbar-select admin-cs-cs-filter"
        >
          <MenuItem value="ALL">All Types</MenuItem>
          <MenuItem value="Important">Important</MenuItem>
          <MenuItem value="Update">Update</MenuItem>
        </Select>
        <Typography className="admin-meta-count">
          {filtered.length} notice{filtered.length !== 1 ? "s" : ""}
        </Typography>
        <Button
          variant="contained"
          onClick={openAdd}
          className="admin-cs-add-notice-btn"
        >
          Add Notice
        </Button>
      </Stack>

      <Stack>
        {filtered.map((notice) => {
          const bs = BADGE_STYLE[notice.badge];
          const isExpanded = expandedId === notice.id;
          return (
            <Stack key={notice.id} className="admin-cs-notice-item">
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
                className="admin-cs-notice-row"
                onClick={() => setExpandedId(isExpanded ? null : notice.id)}
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
                      {notice.badge}
                    </span>
                    <Typography className="admin-cs-notice-title">
                      {notice.title}
                    </Typography>
                  </Stack>
                  {!isExpanded && (
                    <Typography className="admin-cs-notice-summary">
                      {notice.summary}
                    </Typography>
                  )}
                </Stack>

                <Typography className="admin-cs-notice-date">
                  {notice.date}
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
                    Edit
                  </Button>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(notice.id);
                    }}
                    className="admin-btn-sm admin-btn-sm-red"
                  >
                    Delete
                  </Button>
                </Stack>
                <IconButton
                  size="small"
                  className="admin-cs-expand-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(isExpanded ? null : notice.id);
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
                      {notice.summary}
                    </Typography>
                    <Divider className="admin-cs-notice-divider" />
                    {notice.fullText.map((para, i) => (
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

        {filtered.length === 0 && (
          <Stack className="admin-cs-empty">
            <Typography className="admin-cs-empty-text">
              No notices found
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* Notice Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" disablePortal>
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
            onClick={() => setDeleteId(null)}
            className="admin-cs-dialog-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setNotices((prev) => prev.filter((n) => n.id !== deleteId));
              setDeleteId(null);
            }}
            className="admin-cs-dialog-delete-btn"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notice Drawer */}
      <DrawerShell
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingNotice ? "Edit Notice" : "Add New Notice"}
        subtitle="Shown to users on the CS support page"
        onSave={save}
        saveLabel={editingNotice ? "Save Changes" : "Publish Notice"}
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
            <Stack direction="row" gap={1}>
              {BADGE_OPTIONS.map((b) => {
                const bs = BADGE_STYLE[b];
                const active = form.badge === b;
                return (
                  // border, background are dynamic (active state)
                  <Stack
                    key={b}
                    onClick={() => setForm((p) => ({ ...p, badge: b }))}
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
                      sx={{
                        background: active ? bs.color : "#D1D5DB",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: active ? bs.color : "#9CA3AF",
                      }}
                    >
                      {b}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
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
              placeholder="e.g. Scheduled Maintenance — May 20, 2026"
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
              placeholder="Brief one-sentence description…"
              inputProps={{ style: { color: "#111827" } }}
              className="admin-cs-input-h42"
            />
          </Stack>

          {/* Date */}
          <Stack gap={0.8}>
            <Typography className="admin-cs-form-field-label-dark">
              Date
            </Typography>
            <TextField
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              size="small"
              fullWidth
              placeholder="e.g. May 20, 2026"
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
  const [tab, setTab] = useState(0);

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">Customer Support</Typography>
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
                <CampaignIcon className="admin-icon-15" /> Notices
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
