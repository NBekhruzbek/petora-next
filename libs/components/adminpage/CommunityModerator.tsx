import { useState, useMemo, useRef, ChangeEvent } from "react";
import {
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Drawer,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  mockPosts,
  AdminPost,
  PostBoard,
  PostStatus,
} from "../../data/adminMockData";

type StatusFilter = PostStatus | "ALL";

const BOARD_COLORS: Record<PostBoard, { bg: string; color: string }> = {
  FREE: { bg: "#F0F0FF", color: "#6366F1" },
  NEWS: { bg: "#EFF6FF", color: "#3B82F6" },
  QNA: { bg: "#ECFDF5", color: "#059669" },
};

const TABS: { label: string; value: PostBoard | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Free", value: "FREE" },
  { label: "News", value: "NEWS" },
  { label: "Q&A", value: "QNA" },
];

const StatBadge = ({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: number | string;
}) => (
  <Stack direction="row" alignItems="center" gap={0.4}>
    {icon}
    <Typography sx={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 500 }}>
      {value}
    </Typography>
  </Stack>
);

const CommunityModerator = () => {
  const [posts, setPosts] = useState<AdminPost[]>(mockPosts);
  const [postStatuses, setPostStatuses] = useState<Record<string, PostStatus>>(
    {},
  );
  const [boardTab, setBoardTab] = useState<PostBoard | "ALL">("ALL");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState<AdminPost | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Write Post ───────────────────────────────────────────
  const [writeOpen, setWriteOpen] = useState(false);
  const [writeTitle, setWriteTitle] = useState("");
  const [writeContent, setWriteContent] = useState("");
  const [writeImageFile, setWriteImageFile] = useState<File | null>(null);
  const [writeImagePreview, setWriteImagePreview] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const canWrite = boardTab === "FREE" || boardTab === "NEWS";
  const writeBoard = boardTab as "FREE" | "NEWS";

  const openWrite = () => {
    setWriteTitle("");
    setWriteContent("");
    setWriteImageFile(null);
    setWriteImagePreview("");
    setWriteOpen(true);
  };

  const handleImagePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (writeImagePreview) URL.revokeObjectURL(writeImagePreview);
    setWriteImageFile(file);
    setWriteImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeWriteImage = () => {
    if (writeImagePreview) URL.revokeObjectURL(writeImagePreview);
    setWriteImageFile(null);
    setWriteImagePreview("");
  };

  const submitPost = () => {
    const newPost: AdminPost = {
      id: `post-${Date.now()}`,
      title: writeTitle.trim(),
      description: writeContent.trim(),
      board: writeBoard,
      author: "Admin",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "visible",
      views: 0,
      likes: 0,
      commentsCount: 0,
      image: writeImagePreview || undefined,
    };
    setPosts((prev) => [newPost, ...prev]);
    if (writeImagePreview) URL.revokeObjectURL(writeImagePreview);
    setWriteImagePreview("");
    setWriteImageFile(null);
    setWriteOpen(false);
  };

  const getStatus = (post: AdminPost): PostStatus =>
    postStatuses[post.id] ?? post.status;

  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        const st = getStatus(p);
        if (st === "deleted") return false;
        if (boardTab !== "ALL" && p.board !== boardTab) return false;
        if (filterStatus !== "ALL" && st !== filterStatus) return false;
        const q = search.toLowerCase();
        return (
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
        );
      }),
    [posts, postStatuses, boardTab, filterStatus, search],
  );

  const countFor = (board: PostBoard | "ALL") =>
    posts.filter((p) => {
      const st = getStatus(p);
      if (st === "deleted") return false;
      return board === "ALL" || p.board === board;
    }).length;

  const setStatus = (id: string, status: PostStatus) =>
    setPostStatuses((prev) => ({ ...prev, [id]: status }));

  const openDetail = (post: AdminPost) => {
    setSelectedPost(post);
    setDrawerOpen(true);
  };

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">Community</Typography>
        {canWrite && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={openWrite}
            sx={{
              backgroundColor: "#6366F1",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13px",
              borderRadius: "9px",
              height: "36px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#5254CC", boxShadow: "none" },
            }}
          >
            Write {writeBoard === "NEWS" ? "News" : "Post"}
          </Button>
        )}
      </Stack>

      <Stack className="admin-card">
        {/* Board Tabs */}
        <Tabs
          value={boardTab}
          onChange={(_, v) => setBoardTab(v)}
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
          {TABS.map((t) => (
            <Tab
              key={t.value}
              value={t.value}
              label={
                <Stack direction="row" alignItems="center" gap={0.8}>
                  {t.label}
                  <Stack
                    sx={{
                      background: boardTab === t.value ? "#EEF2FF" : "#F3F4F6",
                      borderRadius: "999px",
                      px: 0.9,
                      py: 0.1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: boardTab === t.value ? "#6366F1" : "#9CA3AF",
                      }}
                    >
                      {countFor(t.value)}
                    </Typography>
                  </Stack>
                </Stack>
              }
            />
          ))}
        </Tabs>

        {/* Search + Status filter */}
        <Stack className="admin-toolbar">
          <TextField
            size="small"
            placeholder="Search title or author…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-toolbar-search"
            sx={{ width: 240 }}
          />
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
            className="admin-toolbar-select"
            sx={{ width: 140 }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="visible">Visible</MenuItem>
            <MenuItem value="hidden">Hidden</MenuItem>
          </Select>
          <Typography className="admin-meta-count">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </Typography>
        </Stack>

        {/* Card list */}
        <Stack sx={{ p: 1.5, gap: 1, overflowX: "hidden" }}>
          {filtered.map((post) => {
            const status = getStatus(post);
            const isQna = post.board === "QNA";
            const bc = BOARD_COLORS[post.board];

            return (
              <Stack
                key={post.id}
                direction="row"
                alignItems="center"
                gap={0}
                width="100%"
                sx={{
                  background: "#fff",
                  border: "1px solid",
                  borderColor: status === "hidden" ? "#FEF3C7" : "#F0F1F5",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  "&:hover": {
                    borderColor: "#C7D2FE",
                    boxShadow: "0 2px 8px rgba(99,102,241,0.06)",
                  },
                }}
              >
                {/* Board color strip */}
                <Stack
                  sx={{
                    width: 4,
                    alignSelf: "stretch",
                    background: bc.color,
                    flexShrink: 0,
                  }}
                />

                {/* Thumbnail */}
                {post.image && (
                  <Stack
                    sx={{
                      width: 56,
                      height: 56,
                      flexShrink: 0,
                      overflow: "hidden",
                      m: 1.5,
                      mr: 0,
                      borderRadius: "8px",
                      border: "1px solid #F0F1F5",
                    }}
                  >
                    <img
                      src={post.image}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src =
                          "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                        img.style.opacity = "0";
                      }}
                    />
                  </Stack>
                )}

                {/* Main content */}
                <Stack
                  flex={1}
                  minWidth={0}
                  sx={{ px: 1.5, py: 1.2, overflow: "hidden" }}
                >
                  {/* Title row */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    mb={0.4}
                    sx={{ minWidth: 0 }}
                  >
                    <span
                      style={{
                        fontSize: "9.5px",
                        fontWeight: 700,
                        background: bc.bg,
                        color: bc.color,
                        borderRadius: "999px",
                        padding: "2px 7px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        flexShrink: 0,
                      }}
                    >
                      {post.board === "QNA" ? "Q&A" : post.board}
                    </span>
                    {status === "hidden" && (
                      <span
                        className="status-chip status-hidden"
                        style={{ fontSize: "9.5px" }}
                      >
                        Hidden
                      </span>
                    )}
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#111827",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {post.title}
                    </Typography>
                  </Stack>

                  {/* Description + meta row */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1.5}
                    sx={{ minWidth: 0 }}
                  >
                    <Typography
                      sx={{
                        fontSize: "11.5px",
                        color: "#6B7280",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {post.description}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={1.2}
                      flexShrink={0}
                    >
                      <Stack direction="row" alignItems="center" gap={0.3}>
                        <img
                          src={post.authorImage}
                          alt=""
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            objectFit: "cover",
                            display: post.authorImage ? "block" : "none",
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        <Typography sx={{ fontSize: "11px", color: "#9CA3AF" }}>
                          @{post.author}
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontSize: "10.5px", color: "#D1D5DB" }}>
                        ·
                      </Typography>
                      <StatBadge
                        icon={
                          <VisibilityIcon
                            sx={{ fontSize: 11, color: "#9CA3AF" }}
                          />
                        }
                        value={post.views.toLocaleString()}
                      />
                      <StatBadge
                        icon={
                          <FavoriteIcon
                            sx={{ fontSize: 10, color: "#9CA3AF" }}
                          />
                        }
                        value={post.likes}
                      />
                      {isQna ? (
                        <StatBadge
                          icon={
                            <QuestionAnswerIcon
                              sx={{ fontSize: 11, color: "#9CA3AF" }}
                            />
                          }
                          value={`${post.answersCount ?? 0}`}
                        />
                      ) : (
                        <StatBadge
                          icon={
                            <ChatBubbleOutlineIcon
                              sx={{ fontSize: 11, color: "#9CA3AF" }}
                            />
                          }
                          value={post.commentsCount}
                        />
                      )}
                      <Typography sx={{ fontSize: "10.5px", color: "#D1D5DB" }}>
                        ·
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#9CA3AF",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {post.date}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                {/* Actions */}
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.6}
                  sx={{ px: 1.5, flexShrink: 0 }}
                >
                  <Button
                    size="small"
                    onClick={() => openDetail(post)}
                    className="admin-btn-sm admin-btn-sm-indigo-bold"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Details
                  </Button>
                  {status === "visible" ? (
                    <Button
                      size="small"
                      onClick={() => setStatus(post.id, "hidden")}
                      className="admin-btn-sm admin-btn-sm-orange"
                    >
                      Hide
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => setStatus(post.id, "visible")}
                      className="admin-btn-sm admin-btn-sm-green"
                    >
                      Show
                    </Button>
                  )}
                  <Button
                    size="small"
                    onClick={() => setStatus(post.id, "deleted")}
                    className="admin-btn-sm admin-btn-sm-red"
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            );
          })}

          {filtered.length === 0 && (
            <Stack alignItems="center" sx={{ py: 8 }}>
              <Typography sx={{ fontSize: "32px", mb: 1 }}>📭</Typography>
              <Typography
                sx={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}
              >
                No posts found
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "#9CA3AF", mt: 0.5 }}>
                Try changing the board tab or search filter
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>

      {/* ── Write Post Drawer ─────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
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
          justifyContent="space-between"
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
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: canWrite ? BOARD_COLORS[writeBoard].bg : "#F3F4F6",
                flexShrink: 0,
              }}
            >
              <EditIcon
                sx={{
                  fontSize: 18,
                  color: canWrite ? BOARD_COLORS[writeBoard].color : "#9CA3AF",
                }}
              />
            </Stack>
            <Stack>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.2,
                }}
              >
                Write {canWrite && writeBoard === "NEWS" ? "News" : "Post"}
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "#9CA3AF", mt: 0.2 }}>
                {canWrite && writeBoard === "NEWS"
                  ? "News Board"
                  : "Free Board"}{" "}
                · Published as Admin
              </Typography>
            </Stack>
          </Stack>
          <IconButton
            onClick={() => setWriteOpen(false)}
            size="small"
            sx={{ color: "#6B7280", "&:hover": { background: "#F3F4F6" } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Body */}
        <Stack sx={{ p: 2.5, gap: 2, pb: 14 }}>
          {/* Title + Content */}
          <Stack
            sx={{
              background: "#fff",
              borderRadius: "14px",
              border: "1px solid #F0F1F5",
              overflow: "hidden",
            }}
          >
            <Stack sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid #F3F4F6" }}>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Content
              </Typography>
            </Stack>
            <Stack sx={{ p: 2.5, gap: 2 }}>
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
                  Title
                </Typography>
                <TextField
                  value={writeTitle}
                  onChange={(e) => setWriteTitle(e.target.value)}
                  placeholder="Enter a catchy title…"
                  size="small"
                  fullWidth
                  inputProps={{ style: { color: "#111827", fontWeight: 600 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontSize: "15px",
                      background: "#FAFAFA",
                      "& fieldset": { borderColor: "#E5E7EB" },
                      "&:hover fieldset": { borderColor: "#C7D2FE" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#6366F1",
                        borderWidth: "1.5px",
                      },
                    },
                  }}
                />
              </Stack>
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
                  Content
                </Typography>
                <TextField
                  value={writeContent}
                  onChange={(e) => setWriteContent(e.target.value)}
                  placeholder="Share your thoughts with the community…"
                  multiline
                  rows={7}
                  fullWidth
                  inputProps={{ style: { color: "#111827" } }}
                  InputProps={{
                    style: {
                      height: "auto",
                      minHeight: "160px",
                      alignItems: "flex-start",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontSize: "14px",
                      background: "#FAFAFA",
                      height: "auto !important",
                      "& fieldset": { borderColor: "#E5E7EB" },
                      "&:hover fieldset": { borderColor: "#C7D2FE" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#6366F1",
                        borderWidth: "1.5px",
                      },
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Stack>

          {/* Image Upload */}
          <Stack
            sx={{
              background: "#fff",
              borderRadius: "14px",
              border: "1px solid #F0F1F5",
              overflow: "hidden",
            }}
          >
            <Stack sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid #F3F4F6" }}>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Image (Optional)
              </Typography>
            </Stack>
            <Stack sx={{ p: 2.5 }}>
              {writeImagePreview ? (
                <Stack
                  sx={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <img
                    src={writeImagePreview}
                    alt=""
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    gap={1}
                    sx={{ position: "absolute", bottom: 10, right: 10 }}
                  >
                    <Button
                      size="small"
                      onClick={() => imageInputRef.current?.click()}
                      sx={{
                        fontSize: "11px",
                        textTransform: "none",
                        color: "#fff",
                        background: "rgba(0,0,0,0.5)",
                        borderRadius: "8px",
                        height: "30px",
                        px: 1.5,
                        fontWeight: 600,
                        backdropFilter: "blur(4px)",
                        "&:hover": { background: "rgba(0,0,0,0.7)" },
                      }}
                    >
                      Change
                    </Button>
                    <Button
                      size="small"
                      onClick={removeWriteImage}
                      sx={{
                        fontSize: "11px",
                        textTransform: "none",
                        color: "#fff",
                        background: "rgba(239,68,68,0.75)",
                        borderRadius: "8px",
                        height: "30px",
                        px: 1.5,
                        fontWeight: 600,
                        backdropFilter: "blur(4px)",
                        "&:hover": { background: "rgba(220,38,38,0.9)" },
                      }}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack
                  onClick={() => imageInputRef.current?.click()}
                  sx={{
                    border: "2px dashed #E5E7EB",
                    borderRadius: "12px",
                    py: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: "#FAFAFA",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#6366F1",
                      background: "#EEF2FF",
                    },
                  }}
                >
                  <Stack
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      background: "#E5E7EB",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1.5,
                    }}
                  >
                    <AddPhotoAlternateIcon
                      sx={{ fontSize: 22, color: "#9CA3AF" }}
                    />
                  </Stack>
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}
                  >
                    Click to add a cover image
                  </Typography>
                  <Typography
                    sx={{ fontSize: "12px", color: "#9CA3AF", mt: 0.5 }}
                  >
                    PNG, JPG, WEBP — optional
                  </Typography>
                </Stack>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImagePick}
              />
            </Stack>
          </Stack>
        </Stack>

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
            onClick={() => setWriteOpen(false)}
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
            onClick={submitPost}
            disabled={!writeTitle.trim() || !writeContent.trim()}
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
            Publish Post
          </Button>
        </Stack>
      </Drawer>

      {/* ── Detail Drawer ─────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 500,
            boxShadow: "-8px 0 32px rgba(0,0,0,0.10)",
            background: "#F4F5FA",
            overflowY: "auto",
          },
        }}
      >
        {selectedPost &&
          (() => {
            const bc = BOARD_COLORS[selectedPost.board];
            const status = getStatus(selectedPost);
            const isQna = selectedPost.board === "QNA";
            return (
              <>
                {/* Sticky Header */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    px: 3,
                    py: 2,
                    background: "#fff",
                    borderBottom: "1px solid #E8ECF0",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        background: bc.bg,
                        color: bc.color,
                        borderRadius: "999px",
                        padding: "3px 10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {selectedPost.board === "QNA"
                        ? "Q&A"
                        : selectedPost.board}
                    </span>
                    <span className={`status-chip status-${status}`}>
                      {status}
                    </span>
                  </Stack>
                  <IconButton
                    onClick={() => setDrawerOpen(false)}
                    size="small"
                    sx={{
                      color: "#6B7280",
                      "&:hover": { background: "#F3F4F6" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Stack sx={{ p: 2, gap: 1.5, pb: 14 }}>
                  {/* Hero image */}
                  {selectedPost.image && (
                    <Stack
                      sx={{
                        borderRadius: "14px",
                        overflow: "hidden",
                        height: 200,
                        border: "1px solid #F0F1F5",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={selectedPost.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={(e) => {
                          (
                            e.target as HTMLImageElement
                          ).parentElement!.style.display = "none";
                        }}
                      />
                    </Stack>
                  )}

                  {/* Title + Author + Full Description */}
                  <Stack
                    sx={{
                      background: "#fff",
                      borderRadius: "14px",
                      border: "1px solid #F0F1F5",
                      overflow: "hidden",
                    }}
                  >
                    {/* Color strip */}
                    <Stack sx={{ height: 4, background: bc.color }} />
                    <Stack sx={{ p: 2.5, gap: 2 }}>
                      <Typography
                        sx={{
                          fontSize: "19px",
                          fontWeight: 800,
                          color: "#111827",
                          lineHeight: 1.4,
                        }}
                      >
                        {selectedPost.title}
                      </Typography>

                      {/* Author row */}
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        {selectedPost.authorImage ? (
                          <img
                            src={selectedPost.authorImage}
                            alt=""
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: `2px solid ${bc.bg}`,
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <Stack
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: bc.bg,
                              alignItems: "center",
                              justifyContent: "center",
                              border: `2px solid ${bc.color}22`,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 800,
                                color: bc.color,
                              }}
                            >
                              {selectedPost.author.charAt(0).toUpperCase()}
                            </Typography>
                          </Stack>
                        )}
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "#111827",
                            }}
                          >
                            @{selectedPost.author}
                          </Typography>
                          <Typography
                            sx={{ fontSize: "11px", color: "#9CA3AF" }}
                          >
                            Posted · {selectedPost.date}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Full description */}
                      <Stack
                        sx={{
                          background: "#FAFAFA",
                          borderRadius: "10px",
                          p: 2,
                          border: "1px solid #F0F1F5",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "13.5px",
                            color: "#374151",
                            lineHeight: 1.8,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {selectedPost.description}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Info grid */}
                  <Stack
                    sx={{
                      background: "#fff",
                      borderRadius: "14px",
                      border: "1px solid #F0F1F5",
                      p: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#9CA3AF",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        mb: 1.5,
                      }}
                    >
                      Post Info
                    </Typography>
                    <Stack gap={1}>
                      {[
                        {
                          label: "Board",
                          value:
                            selectedPost.board === "QNA"
                              ? "Q&A"
                              : selectedPost.board,
                        },
                        { label: "Status", value: status },
                        { label: "Author", value: `@${selectedPost.author}` },
                        { label: "Published", value: selectedPost.date },
                        {
                          label: isQna ? "Answers" : "Comments",
                          value: isQna
                            ? (selectedPost.answersCount ?? 0)
                            : selectedPost.commentsCount,
                        },
                      ].map(({ label, value }) => (
                        <Stack
                          key={label}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ py: 0.5, borderBottom: "1px solid #F9FAFB" }}
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#9CA3AF",
                              fontWeight: 600,
                            }}
                          >
                            {label}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#374151",
                              fontWeight: 700,
                            }}
                          >
                            {value}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>

                  {/* Stats */}
                  <Stack
                    direction="row"
                    sx={{
                      background: "#fff",
                      borderRadius: "14px",
                      border: "1px solid #F0F1F5",
                    }}
                  >
                    {[
                      {
                        icon: (
                          <VisibilityIcon
                            sx={{ fontSize: 18, color: "#6366F1" }}
                          />
                        ),
                        label: "Views",
                        value: selectedPost.views.toLocaleString(),
                      },
                      {
                        icon: (
                          <FavoriteIcon
                            sx={{ fontSize: 17, color: "#EF4444" }}
                          />
                        ),
                        label: "Likes",
                        value: selectedPost.likes,
                      },
                      isQna
                        ? {
                            icon: (
                              <QuestionAnswerIcon
                                sx={{ fontSize: 18, color: "#059669" }}
                              />
                            ),
                            label: "Answers",
                            value: selectedPost.answersCount ?? 0,
                          }
                        : {
                            icon: (
                              <ChatBubbleOutlineIcon
                                sx={{ fontSize: 17, color: "#F59E0B" }}
                              />
                            ),
                            label: "Comments",
                            value: selectedPost.commentsCount,
                          },
                    ].map(({ icon, label, value }, i, arr) => (
                      <Stack
                        key={label}
                        flex={1}
                        alignItems="center"
                        gap={0.4}
                        sx={{
                          py: 2,
                          borderRight:
                            i < arr.length - 1 ? "1px solid #F0F1F5" : "none",
                        }}
                      >
                        {icon}
                        <Typography
                          sx={{
                            fontSize: "22px",
                            fontWeight: 800,
                            color: "#111827",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {value}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#9CA3AF",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {/* Moderation */}
                  <Stack
                    sx={{
                      background: "#fff",
                      borderRadius: "14px",
                      border: "1px solid #F0F1F5",
                      p: 2,
                      gap: 1.5,
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
                      Moderation
                    </Typography>
                    <Stack direction="row" gap={1}>
                      {status === "visible" ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => setStatus(selectedPost.id, "hidden")}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "13px",
                            borderColor: "#FEF3C7",
                            color: "#D97706",
                            borderRadius: "10px",
                            height: "42px",
                            "&:hover": { background: "#FFFBEB" },
                          }}
                        >
                          Hide Post
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => setStatus(selectedPost.id, "visible")}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "13px",
                            borderColor: "#D1FAE5",
                            color: "#059669",
                            borderRadius: "10px",
                            height: "42px",
                            "&:hover": { background: "#ECFDF5" },
                          }}
                        >
                          Make Visible
                        </Button>
                      )}
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                          setStatus(selectedPost.id, "deleted");
                          setDrawerOpen(false);
                        }}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "13px",
                          borderColor: "#FEE2E2",
                          color: "#EF4444",
                          borderRadius: "10px",
                          height: "42px",
                          "&:hover": { background: "#FEF2F2" },
                        }}
                      >
                        Delete Post
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>

                {/* Sticky Footer */}
                <Stack
                  direction="row"
                  justifyContent="flex-end"
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
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      textTransform: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6B7280",
                      border: "1px solid #E8ECF0",
                      borderRadius: "10px",
                      height: "40px",
                      px: 3,
                      "&:hover": { background: "#F9FAFB" },
                    }}
                  >
                    Close
                  </Button>
                </Stack>
              </>
            );
          })()}
      </Drawer>
    </Stack>
  );
};

export default CommunityModerator;
