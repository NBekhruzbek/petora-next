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

const INPUT_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: "14px",
    color: "#111827",
    background: "#FAFAFA",
    "& fieldset": { borderColor: "#E5E7EB" },
    "&:hover fieldset": { borderColor: "#C7D2FE" },
    "&.Mui-focused fieldset": { borderColor: "#6366F1", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { fontSize: "13px", color: "#9CA3AF" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6366F1" },
  "& .MuiInputBase-input": { color: "#111827" },
};

const MULTILINE_SX = {
  ...INPUT_SX,
  "& .MuiOutlinedInput-root": {
    ...INPUT_SX["& .MuiOutlinedInput-root"],
    height: "auto !important",
  },
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
    PaperProps={{
      sx: {
        width: 520,
        boxShadow: "-8px 0 32px rgba(0,0,0,0.10)",
        background: "#F4F5FA",
        overflowY: "auto",
      },
    }}
  >
    {/* Sticky Header */}
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      sx={{
        px: 3,
        py: 2.5,
        background: "#fff",
        borderBottom: "1px solid #E8ECF0",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Stack flex={1} minWidth={0}>
        <Typography
          sx={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: "12px", color: "#9CA3AF", mt: 0.2 }}>
            {subtitle}
          </Typography>
        )}
      </Stack>
      <IconButton
        onClick={onClose}
        size="small"
        sx={{ color: "#6B7280", "&:hover": { background: "#F3F4F6" } }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Stack>

    {/* Body */}
    <Stack sx={{ p: 2.5, gap: 2, pb: 14 }}>{children}</Stack>

    {/* Sticky Footer */}
    <Stack
      direction="row"
      justifyContent="flex-end"
      gap={1.5}
      sx={{
        px: 3,
        py: 2,
        background: "#fff",
        borderTop: "1px solid #E8ECF0",
        position: "sticky",
        bottom: 0,
        zIndex: 10,
      }}
    >
      <Button
        onClick={onClose}
        sx={{
          textTransform: "none",
          fontSize: "13px",
          fontWeight: 600,
          color: "#6B7280",
          border: "1px solid #E8ECF0",
          borderRadius: "10px",
          height: "40px",
          px: 2.5,
          "&:hover": { background: "#F9FAFB" },
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onSave}
        disabled={saveDisabled}
        sx={{
          textTransform: "none",
          fontSize: "13px",
          fontWeight: 700,
          color: "#ffffff",
          backgroundColor: "#6366F1",
          boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
          borderRadius: "10px",
          height: "40px",
          px: 3,
          "&:hover": { backgroundColor: "#5254CC" },
          "&:disabled": {
            backgroundColor: "#E5E7EB",
            color: "#9CA3AF",
            boxShadow: "none",
          },
        }}
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
          className="admin-toolbar-select"
          sx={{ width: 200 }}
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
          sx={{
            backgroundColor: "#6366F1",
            color: "#ffffff",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "12px",
            borderRadius: "8px",
            height: "34px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#5254CC", boxShadow: "none" },
          }}
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
              <Stack
                sx={{
                  px: 3,
                  py: 1.2,
                  background: "#FAFBFC",
                  borderBottom: "1px solid #F0F1F5",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#6366F1",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {cat.label} · {items.length}
                </Typography>
              </Stack>

              {items.map((faq, idx) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <Stack
                    key={faq.id}
                    sx={{ borderBottom: "1px solid #F0F1F5" }}
                  >
                    {/* Row */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={1.5}
                      sx={{
                        px: 3,
                        py: 1.8,
                        cursor: "pointer",
                        "&:hover": { background: "#FAFBFF" },
                      }}
                      onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    >
                      <Stack flex={1} minWidth={0}>
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "#111827",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Q{String(idx + 1).padStart(2, "0")}. {faq.title}
                          </Typography>
                        </Stack>
                        {!isExpanded && (
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#9CA3AF",
                              mt: 0.2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
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
                        sx={{ color: "#9CA3AF" }}
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
                      <Stack
                        sx={{ px: 3, pb: 2, pt: 0.5, background: "#FAFBFF" }}
                      >
                        <Stack
                          sx={{
                            background: "#fff",
                            borderRadius: "10px",
                            border: "1px solid #E8ECF0",
                            p: 2,
                            gap: 1.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#374151",
                              lineHeight: 1.7,
                            }}
                          >
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
                                  <Stack
                                    sx={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      background: "#6366F1",
                                      mt: "7px",
                                      flexShrink: 0,
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontSize: "12.5px",
                                      color: "#6B7280",
                                      lineHeight: 1.6,
                                    }}
                                  >
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
          <Stack alignItems="center" sx={{ py: 8 }}>
            <Typography sx={{ fontSize: "14px", color: "#9CA3AF" }}>
              No FAQs found
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* FAQ Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs">
        <DialogTitle
          sx={{ fontWeight: 700, fontSize: "16px", color: "#111827" }}
        >
          Delete FAQ?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>
            This FAQ will be permanently removed from the CS page. This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              textTransform: "none",
              color: "#6B7280",
              border: "1px solid #E8ECF0",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setFaqs((prev) => prev.filter((f) => f.id !== deleteId));
              setDeleteId(null);
            }}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: "#ffffff",
              backgroundColor: "#EF4444",
              boxShadow: "none",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#DC2626", boxShadow: "none" },
            }}
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
        <Stack
          sx={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid #F0F1F5",
            p: 2.5,
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Category & Question
          </Typography>
          <Stack gap={0.8}>
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
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
              sx={{
                height: 42,
                borderRadius: "10px",
                fontSize: "14px",
                color: "#111827",
                background: "#FAFAFA",
                "& fieldset": { borderColor: "#E5E7EB" },
                "&:hover fieldset": { borderColor: "#C7D2FE" },
                "&.Mui-focused fieldset": {
                  borderColor: "#6366F1",
                  borderWidth: "1.5px",
                },
                "& .MuiSelect-icon": { color: "#9CA3AF" },
              }}
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
            sx={INPUT_SX}
          />
          <TextField
            label="Short Description (preview)"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            size="small"
            fullWidth
            sx={INPUT_SX}
          />
        </Stack>

        <Stack
          sx={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid #F0F1F5",
            p: 2.5,
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
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
            sx={MULTILINE_SX}
          />

          <Stack gap={1.2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Step-by-Step Instructions
                </Typography>
                <Typography
                  sx={{ fontSize: "11px", color: "#9CA3AF", mt: 0.3 }}
                >
                  Action steps shown as a bullet list below the answer
                </Typography>
              </Stack>
              <Button
                size="small"
                onClick={addBullet}
                sx={{
                  fontSize: "11px",
                  textTransform: "none",
                  color: "#6366F1",
                  fontWeight: 600,
                }}
              >
                Add Step
              </Button>
            </Stack>
            {form.bullets.map((b, i) => (
              <Stack key={i} direction="row" alignItems="center" gap={1}>
                <Stack
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "6px",
                    background: "#EEF2FF",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{ fontSize: "9px", fontWeight: 800, color: "#6366F1" }}
                  >
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
                  sx={{
                    ...INPUT_SX,
                    "& .MuiOutlinedInput-root": {
                      ...INPUT_SX["& .MuiOutlinedInput-root"],
                      height: 38,
                    },
                  }}
                />
                {form.bullets.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => removeBullet(i)}
                    sx={{ color: "#EF4444", flexShrink: 0 }}
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
          className="admin-toolbar-select"
          sx={{ width: 160 }}
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
          sx={{
            color: "#ffffff",
            backgroundColor: "#6366F1",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "12px",
            borderRadius: "8px",
            height: "34px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#5254CC", boxShadow: "none" },
          }}
        >
          Add Notice
        </Button>
      </Stack>

      <Stack>
        {filtered.map((notice) => {
          const bs = BADGE_STYLE[notice.badge];
          const isExpanded = expandedId === notice.id;
          return (
            <Stack key={notice.id} sx={{ borderBottom: "1px solid #F0F1F5" }}>
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
                sx={{
                  px: 3,
                  py: 1.8,
                  cursor: "pointer",
                  "&:hover": { background: "#FAFBFF" },
                }}
                onClick={() => setExpandedId(isExpanded ? null : notice.id)}
              >
                <Stack flex={1} minWidth={0}>
                  <Stack direction="row" alignItems="center" gap={1} mb={0.3}>
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
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#111827",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {notice.title}
                    </Typography>
                  </Stack>
                  {!isExpanded && (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#9CA3AF",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {notice.summary}
                    </Typography>
                  )}
                </Stack>

                <Typography
                  sx={{ fontSize: "11px", color: "#9CA3AF", flexShrink: 0 }}
                >
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
                  sx={{ color: "#9CA3AF" }}
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
                <Stack sx={{ px: 3, pb: 2, pt: 0.5, background: "#FAFBFF" }}>
                  <Stack
                    sx={{
                      background: "#fff",
                      borderRadius: "10px",
                      border: "1px solid #E8ECF0",
                      p: 2,
                      gap: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#6B7280",
                        fontStyle: "italic",
                      }}
                    >
                      {notice.summary}
                    </Typography>
                    <Divider sx={{ borderColor: "#F0F1F5" }} />
                    {notice.fullText.map((para, i) => (
                      <Typography
                        key={i}
                        sx={{
                          fontSize: "13px",
                          color: "#374151",
                          lineHeight: 1.75,
                        }}
                      >
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
          <Stack alignItems="center" sx={{ py: 8 }}>
            <Typography sx={{ fontSize: "14px", color: "#9CA3AF" }}>
              No notices found
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* Notice Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs">
        <DialogTitle
          sx={{ fontWeight: 700, fontSize: "16px", color: "#111827" }}
        >
          Delete Notice?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>
            This notice will be permanently removed from the CS page. This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              textTransform: "none",
              color: "#6B7280",
              border: "1px solid #E8ECF0",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setNotices((prev) => prev.filter((n) => n.id !== deleteId));
              setDeleteId(null);
            }}
            sx={{
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#EF4444",
              boxShadow: "none",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#DC2626", boxShadow: "none" },
            }}
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
        <Stack
          sx={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid #F0F1F5",
            p: 2.5,
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Notice Details
          </Typography>

          {/* Type toggle */}
          <Stack gap={0.8}>
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Type
            </Typography>
            <Stack direction="row" gap={1}>
              {BADGE_OPTIONS.map((b) => {
                const bs = BADGE_STYLE[b];
                const active = form.badge === b;
                return (
                  <Stack
                    key={b}
                    onClick={() => setForm((p) => ({ ...p, badge: b }))}
                    direction="row"
                    alignItems="center"
                    gap={1}
                    sx={{
                      flex: 1,
                      border: "1.5px solid",
                      borderColor: active ? bs.color : "#E5E7EB",
                      borderRadius: "10px",
                      px: 2,
                      py: 1.2,
                      cursor: "pointer",
                      background: active ? bs.bg : "#FAFAFA",
                      transition: "all 0.15s",
                      "&:hover": { borderColor: bs.color, background: bs.bg },
                    }}
                  >
                    <Stack
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: active ? bs.color : "#D1D5DB",
                        flexShrink: 0,
                        transition: "background 0.15s",
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
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
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
              sx={{
                ...INPUT_SX,
                "& .MuiOutlinedInput-root": {
                  ...INPUT_SX["& .MuiOutlinedInput-root"],
                  height: 42,
                },
              }}
            />
          </Stack>

          {/* Summary */}
          <Stack gap={0.8}>
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
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
              sx={{
                ...INPUT_SX,
                "& .MuiOutlinedInput-root": {
                  ...INPUT_SX["& .MuiOutlinedInput-root"],
                  height: 42,
                },
              }}
            />
          </Stack>

          {/* Date */}
          <Stack gap={0.8}>
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Date
            </Typography>
            <TextField
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              size="small"
              fullWidth
              placeholder="e.g. May 20, 2026"
              inputProps={{ style: { color: "#111827" } }}
              sx={{
                ...INPUT_SX,
                "& .MuiOutlinedInput-root": {
                  ...INPUT_SX["& .MuiOutlinedInput-root"],
                  height: 42,
                },
              }}
            />
          </Stack>
        </Stack>

        <Stack
          sx={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid #F0F1F5",
            p: 2.5,
            gap: 1.5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Full Content
            </Typography>
            <Button
              size="small"
              onClick={() =>
                setForm((p) => ({ ...p, paragraphs: [...p.paragraphs, ""] }))
              }
              sx={{
                fontSize: "11px",
                textTransform: "none",
                color: "#6366F1",
                fontWeight: 600,
              }}
            >
              Add Paragraph
            </Button>
          </Stack>
          {form.paragraphs.map((para, i) => (
            <Stack key={i} direction="row" alignItems="flex-start" gap={1}>
              <Stack
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "6px",
                  background: "#EEF2FF",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: "10px",
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{ fontSize: "10px", fontWeight: 700, color: "#6366F1" }}
                >
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
                sx={MULTILINE_SX}
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
                  sx={{ color: "#EF4444", mt: "6px", flexShrink: 0 }}
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
          sx={{
            px: 2,
            borderBottom: "1px solid #E8ECF0",
            minHeight: 46,
            "& .MuiTab-root": {
              fontSize: "13px",
              fontWeight: 600,
              color: "#6B7280",
              textTransform: "none",
              minHeight: 46,
              py: 0,
              px: 2,
            },
            "& .Mui-selected": { color: "#6366F1" },
            "& .MuiTabs-indicator": {
              background: "#6366F1",
              height: "2.5px",
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab
            label={
              <Stack direction="row" alignItems="center" gap={0.8}>
                <HelpOutlineIcon sx={{ fontSize: 15 }} /> FAQ
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" gap={0.8}>
                <CampaignIcon sx={{ fontSize: 15 }} /> Notices
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
