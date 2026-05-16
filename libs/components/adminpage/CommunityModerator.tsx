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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
    <Typography className="admin-cm-author-handle" style={{ fontWeight: 500 }}>
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
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [writeOpen, setWriteOpen] = useState(false);
  const [writeTitle, setWriteTitle] = useState("");
  const [writeContent, setWriteContent] = useState("");
  const [, setWriteImageFile] = useState<File | null>(null);
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
            className="admin-cm-write-btn"
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
          className="admin-cm-tabs"
        >
          {TABS.map((t) => (
            <Tab
              key={t.value}
              value={t.value}
              label={
                <Stack direction="row" alignItems="center" gap={0.8}>
                  {t.label}
                  {/* bg and color are dynamic based on boardTab === t.value */}
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
            className="admin-toolbar-search admin-cm-search"
          />
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
            className="admin-toolbar-select admin-cm-status-filter"
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
        <Stack className="admin-cm-card-list">
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
                className={`admin-cm-post-card${status === "hidden" ? " hidden-post" : ""}`}
              >
                {/* Board color strip — color is dynamic (bc.color) */}
                <Stack
                  className="admin-cm-color-strip"
                  sx={{ background: bc.color }}
                />

                {/* Thumbnail */}
                {post.image && (
                  <Stack className="admin-cm-thumb">
                    <img
                      src={post.image}
                      alt=""
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
                <Stack flex={1} minWidth={0} className="admin-cm-post-body">
                  {/* Title row */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    mb={0.4}
                    className="admin-cm-title-row"
                  >
                    {/* Board badge — bg/color are dynamic (bc.bg, bc.color) */}
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
                    <Typography className="admin-cm-post-title">
                      {post.title}
                    </Typography>
                  </Stack>

                  {/* Description + meta row */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1.5}
                    className="admin-cm-meta-row"
                  >
                    <Typography className="admin-cm-post-desc">
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
                        <Typography className="admin-cm-author-handle">
                          @{post.author}
                        </Typography>
                      </Stack>
                      <Typography className="admin-cm-dot">·</Typography>
                      <StatBadge
                        icon={<VisibilityIcon className="admin-icon-11-gray" />}
                        value={post.views.toLocaleString()}
                      />
                      <StatBadge
                        icon={<FavoriteIcon className="admin-icon-10-gray" />}
                        value={post.likes}
                      />
                      {isQna ? (
                        <StatBadge
                          icon={
                            <QuestionAnswerIcon className="admin-icon-11-gray" />
                          }
                          value={`${post.answersCount ?? 0}`}
                        />
                      ) : (
                        <StatBadge
                          icon={
                            <ChatBubbleOutlineIcon className="admin-icon-11-gray" />
                          }
                          value={post.commentsCount}
                        />
                      )}
                      <Typography className="admin-cm-dot">·</Typography>
                      <Typography className="admin-cm-date">
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
                  className="admin-cm-actions"
                >
                  <Button
                    size="small"
                    onClick={() => openDetail(post)}
                    className="admin-btn-sm admin-btn-sm-indigo-bold admin-cm-details-btn"
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
                    onClick={() => setDeleteConfirmId(post.id)}
                    className="admin-btn-sm admin-btn-sm-red"
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            );
          })}

          {filtered.length === 0 && (
            <Stack className="admin-cm-empty">
              <Typography style={{ fontSize: "32px", marginBottom: 8 }}>
                📭
              </Typography>
              <Typography className="admin-cm-empty-title">
                No posts found
              </Typography>
              <Typography className="admin-cm-empty-sub">
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
        PaperProps={{ className: "admin-cm-write-paper" }}
        disablePortal
      >
        {/* Sticky Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className="admin-cm-write-header"
        >
          <Stack direction="row" alignItems="center" gap={1.5}>
            {/* bg is dynamic (canWrite ? BOARD_COLORS[writeBoard].bg : "#F3F4F6") */}
            <Stack
              alignItems="center"
              justifyContent="center"
              className="admin-cm-write-icon-box"
              sx={{
                background: canWrite ? BOARD_COLORS[writeBoard].bg : "#F3F4F6",
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
              <Typography className="admin-cm-write-title">
                Write {canWrite && writeBoard === "NEWS" ? "News" : "Post"}
              </Typography>
              <Typography className="admin-cm-write-subtitle">
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
            className="admin-cm-write-close-btn"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Body */}
        <Stack className="admin-cm-write-body">
          {/* Title + Content */}
          <Stack className="admin-cm-write-section">
            <Stack className="admin-cm-write-section-header">
              <Typography className="admin-cm-write-section-title">
                Content
              </Typography>
            </Stack>
            <Stack className="admin-cm-write-section-body">
              <Stack gap={0.8}>
                <Typography className="admin-cm-write-field-label">
                  Title
                </Typography>
                <TextField
                  value={writeTitle}
                  onChange={(e) => setWriteTitle(e.target.value)}
                  placeholder="Enter a catchy title…"
                  size="small"
                  fullWidth
                  inputProps={{ style: { color: "#111827", fontWeight: 600 } }}
                  className="admin-cm-title-input"
                />
              </Stack>
              <Stack gap={0.8}>
                <Typography className="admin-cm-write-field-label">
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
                  className="admin-cm-content-input"
                />
              </Stack>
            </Stack>
          </Stack>

          {/* Image Upload */}
          <Stack className="admin-cm-write-section">
            <Stack className="admin-cm-write-section-header">
              <Typography className="admin-cm-write-section-title">
                Image (Optional)
              </Typography>
            </Stack>
            <Stack style={{ padding: "20px" }}>
              {writeImagePreview ? (
                <Stack className="admin-cm-img-preview-wrap">
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
                    className="admin-cm-img-overlay-btns"
                  >
                    <Button
                      size="small"
                      onClick={() => imageInputRef.current?.click()}
                      className="admin-cm-img-change-btn"
                    >
                      Change
                    </Button>
                    <Button
                      size="small"
                      onClick={removeWriteImage}
                      className="admin-cm-img-remove-btn"
                    >
                      Remove
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack
                  onClick={() => imageInputRef.current?.click()}
                  className="admin-cm-img-upload-zone"
                >
                  <Stack className="admin-cm-img-upload-icon-box">
                    <AddPhotoAlternateIcon className="admin-icon-22-gray" />
                  </Stack>
                  <Typography className="admin-cm-img-upload-label">
                    Click to add a cover image
                  </Typography>
                  <Typography className="admin-cm-img-upload-hint">
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
          className="admin-cm-write-footer"
        >
          <Button
            onClick={() => setWriteOpen(false)}
            className="admin-cm-write-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitPost}
            disabled={!writeTitle.trim() || !writeContent.trim()}
            className="admin-cm-write-publish-btn"
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
        PaperProps={{ className: "admin-cm-detail-paper" }}
        disablePortal
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
                  className="admin-cm-detail-header"
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    {/* bg/color are dynamic (bc.bg, bc.color) */}
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
                    className="admin-cm-detail-close-btn"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Stack className="admin-cm-detail-body">
                  {/* Hero image */}
                  {selectedPost.image && (
                    <Stack className="admin-cm-hero-img">
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
                  <Stack className="admin-cm-post-content-card">
                    {/* Color strip — dynamic (bc.color) */}
                    <Stack
                      className="admin-cm-color-top-strip"
                      sx={{ background: bc.color }}
                    />
                    <Stack className="admin-cm-post-content-body">
                      <Typography className="admin-cm-post-full-title">
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
                              // border is dynamic: `2px solid ${bc.bg}`
                              border: `2px solid ${bc.bg}`,
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          // bg and border are dynamic (bc.bg, bc.color)
                          <Stack
                            className="admin-cm-author-avatar-fallback"
                            sx={{
                              background: bc.bg,
                              border: `2px solid ${bc.color}22`,
                            }}
                          >
                            <Typography
                              className="admin-cm-author-initial"
                              sx={{ color: bc.color }}
                            >
                              {selectedPost.author.charAt(0).toUpperCase()}
                            </Typography>
                          </Stack>
                        )}
                        <Stack>
                          <Typography className="admin-cm-author-name">
                            @{selectedPost.author}
                          </Typography>
                          <Typography className="admin-cm-author-date">
                            Posted · {selectedPost.date}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Full description */}
                      <Stack className="admin-cm-desc-box">
                        <Typography className="admin-cm-desc-text">
                          {selectedPost.description}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Info grid */}
                  <Stack className="admin-cm-info-card">
                    <Typography className="admin-cm-info-heading">
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
                          className="admin-cm-info-row"
                        >
                          <Typography className="admin-cm-info-label">
                            {label}
                          </Typography>
                          <Typography className="admin-cm-info-value">
                            {value}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>

                  {/* Stats */}
                  <Stack direction="row" className="admin-cm-stats-row">
                    {[
                      {
                        icon: (
                          <VisibilityIcon className="admin-icon-18-indigo" />
                        ),
                        label: "Views",
                        value: selectedPost.views.toLocaleString(),
                      },
                      {
                        icon: <FavoriteIcon className="admin-icon-17-red" />,
                        label: "Likes",
                        value: selectedPost.likes,
                      },
                      isQna
                        ? {
                            icon: (
                              <QuestionAnswerIcon className="admin-icon-18-green" />
                            ),
                            label: "Answers",
                            value: selectedPost.answersCount ?? 0,
                          }
                        : {
                            icon: (
                              <ChatBubbleOutlineIcon className="admin-icon-17-amber" />
                            ),
                            label: "Comments",
                            value: selectedPost.commentsCount,
                          },
                    ].map(({ icon, label, value }, i, arr) => (
                      <Stack
                        key={label}
                        className={`admin-cm-stat-cell${i < arr.length - 1 ? " bordered" : ""}`}
                      >
                        {icon}
                        <Typography className="admin-cm-stat-value">
                          {value}
                        </Typography>
                        <Typography className="admin-cm-stat-label">
                          {label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {/* Moderation */}
                  <Stack className="admin-cm-mod-card">
                    <Typography className="admin-cm-mod-heading">
                      Moderation
                    </Typography>
                    <Stack direction="row" gap={1}>
                      {status === "visible" ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => setStatus(selectedPost.id, "hidden")}
                          className="admin-cm-hide-btn"
                        >
                          Hide Post
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => setStatus(selectedPost.id, "visible")}
                          className="admin-cm-show-btn"
                        >
                          Make Visible
                        </Button>
                      )}
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setDeleteConfirmId(selectedPost.id)}
                        className="admin-cm-delete-post-btn"
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
                  className="admin-cm-detail-footer"
                >
                  <Button
                    onClick={() => setDrawerOpen(false)}
                    className="admin-cm-detail-close-footer-btn"
                  >
                    Close
                  </Button>
                </Stack>
              </>
            );
          })()}
      </Drawer>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        maxWidth="xs"
        disablePortal
      >
        <DialogTitle
          sx={{ fontWeight: 700, fontSize: "16px", color: "#111827" }}
        >
          Delete Post?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>
            This post will be permanently removed and cannot be restored.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteConfirmId(null)}
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
              if (deleteConfirmId) {
                setStatus(deleteConfirmId, "deleted");
                if (selectedPost?.id === deleteConfirmId) setDrawerOpen(false);
                setDeleteConfirmId(null);
              }
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
    </Stack>
  );
};

export default CommunityModerator;
