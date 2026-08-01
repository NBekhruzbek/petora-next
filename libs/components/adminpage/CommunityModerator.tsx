import { useIntlLocale } from "@/libs/i18n/format";
import { useTranslation } from "react-i18next";
import { useMemo, useRef, useState, ChangeEvent } from "react";
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
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ALL_BOARD_ARTICLES_BY_ADMIN,
  GET_ALL_QUESTIONS_BY_ADMIN,
  GET_COMMUNITY_COUNTS_BY_ADMIN,
} from "@/apollo/admin/query";
import {
  REMOVE_BOARD_ARTICLE_BY_ADMIN,
  REMOVE_QNA_QUESTION_BY_ADMIN,
  UPDATE_BOARD_ARTICLE_BY_ADMIN,
  UPDATE_QNA_QUESTION_BY_ADMIN,
} from "@/apollo/admin/mutation";
import { CREATE_NEW_ARTICLE, IMAGES_UPLOADER } from "@/apollo/user/mutation";
import { BoardArticle } from "@/libs/types/board-article/board-article";
import { QnaQuestion } from "@/libs/types/qna/qna";
import { ArticleCategory, ArticleStatus } from "@/libs/enums/boardArticle.enum";
import { QnaStatus } from "@/libs/enums/qna.enum";
import { Direction } from "@/libs/enums/common.enum";
import { Messages } from "@/libs/config";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";
import {
  BLANK_IMAGE,
  avatarUrl,
  formatDate,
  imageUrl,
  metaTotal,
} from "./adminHelpers";

const POSTS_PER_PAGE = 10;

type BoardKey = "FREE" | "NEWS" | "QNA";
type TabKey = BoardKey | "ALL";
/** ACTIVE and HIDE are the only states a listed post can be in. */
type StatusFilter = "ALL" | "ACTIVE" | "HIDE";

const BOARD_COLORS: Record<BoardKey, { bg: string; color: string }> = {
  FREE: { bg: "#F0F0FF", color: "#6366F1" },
  NEWS: { bg: "#EFF6FF", color: "#3B82F6" },
  QNA: { bg: "#ECFDF5", color: "#059669" },
};

const TABS: { labelKey: string; value: TabKey }[] = [
  { labelKey: "admin.community.all", value: "ALL" },
  { labelKey: "admin.community.free", value: "FREE" },
  { labelKey: "admin.community.news", value: "NEWS" },
  { labelKey: "admin.community.qna", value: "QNA" },
];

/**
 * Articles and Q&A live in separate collections with separate resolvers, but
 * the panel moderates them as one feed. Both are mapped onto this shape so the
 * list, the drawer and the actions only deal with one kind of row.
 */
interface Post {
  id: string;
  board: BoardKey;
  title: string;
  content: string;
  image?: string;
  author: string;
  authorImage?: string;
  createdAt: Date;
  status: string;
  views: number;
  likes: number;
  /** Comments for articles, answers for Q&A. */
  replies: number;
}

const fromArticle = (article: BoardArticle): Post => ({
  id: article._id,
  board: article.articleCategory === ArticleCategory.NEWS ? "NEWS" : "FREE",
  title: article.articleTitle,
  content: article.articleContent,
  image: article.articleImage,
  author: article.memberData?.memberUserName ?? "unknown",
  authorImage: article.memberData?.memberImage,
  createdAt: new Date(article.createdAt),
  status: article.articleStatus,
  views: article.articleViews ?? 0,
  likes: article.articleLikes ?? 0,
  replies: article.articleComments ?? 0,
});

const fromQuestion = (question: QnaQuestion): Post => ({
  id: question._id,
  board: "QNA",
  title: question.questionTitle,
  content: question.questionContent,
  image: question.questionImages?.[0],
  author: question.memberData?.memberUserName ?? "unknown",
  authorImage: question.memberData?.memberImage,
  createdAt: new Date(question.createdAt),
  status: question.qnaStatus,
  views: question.questionViews ?? 0,
  likes: question.questionLikes ?? 0,
  replies: question.questionAnswers ?? 0,
});

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
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const [boardTab, setBoardTab] = useState<TabKey>("ALL");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  // ── Write Post ───────────────────────────────────────────
  const [writeOpen, setWriteOpen] = useState(false);
  const [writeTitle, setWriteTitle] = useState("");
  const [writeContent, setWriteContent] = useState("");
  const [writeImage, setWriteImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const canWrite = boardTab === "FREE" || boardTab === "NEWS";
  const writeBoard = (canWrite ? boardTab : "FREE") as "FREE" | "NEWS";

  /** APOLLO REQUESTS **/

  const articleSearch = {
    ...(filterStatus === "ALL"
      ? {}
      : { articleStatus: filterStatus as ArticleStatus }),
    ...(search.trim() ? { text: search.trim() } : {}),
  };
  const qnaSearch = {
    ...(filterStatus === "ALL" ? {} : { qnaStatus: filterStatus as QnaStatus }),
    ...(search.trim() ? { text: search.trim() } : {}),
  };

  const wantsArticles = boardTab !== "QNA";
  const wantsQuestions = boardTab === "ALL" || boardTab === "QNA";

  const {
    data: articlesData,
    previousData: articlesPreviousData,
    refetch: articlesRefetch,
  } = useQuery(GET_ALL_BOARD_ARTICLES_BY_ADMIN, {
    fetchPolicy: "cache-and-network",
    skip: !wantsArticles,
    variables: {
      input: {
        // The merged "All" feed shows the newest of each board rather than
        // paging, since two collections cannot share one page cursor.
        page: boardTab === "ALL" ? 1 : page,
        limit: POSTS_PER_PAGE,
        sort: "createdAt",
        direction: Direction.DESC,
        search: {
          ...articleSearch,
          ...(boardTab === "FREE" || boardTab === "NEWS"
            ? { articleCategory: boardTab as ArticleCategory }
            : {}),
        },
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: questionsData,
    previousData: questionsPreviousData,
    refetch: questionsRefetch,
  } = useQuery(GET_ALL_QUESTIONS_BY_ADMIN, {
    fetchPolicy: "cache-and-network",
    skip: !wantsQuestions,
    variables: {
      input: {
        page: boardTab === "ALL" ? 1 : page,
        limit: POSTS_PER_PAGE,
        sort: "createdAt",
        direction: Direction.DESC,
        search: qnaSearch,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const { data: countsData, refetch: countsRefetch } = useQuery(
    GET_COMMUNITY_COUNTS_BY_ADMIN,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        free: {
          page: 1,
          limit: 1,
          search: {
            ...articleSearch,
            articleCategory: ArticleCategory.FREE,
          },
        },
        news: {
          page: 1,
          limit: 1,
          search: {
            ...articleSearch,
            articleCategory: ArticleCategory.NEWS,
          },
        },
        qna: { page: 1, limit: 1, search: qnaSearch },
      },
    },
  );

  const [updateArticle] = useMutation(UPDATE_BOARD_ARTICLE_BY_ADMIN);
  const [removeArticle] = useMutation(REMOVE_BOARD_ARTICLE_BY_ADMIN);
  const [updateQuestion] = useMutation(UPDATE_QNA_QUESTION_BY_ADMIN);
  const [removeQuestion] = useMutation(REMOVE_QNA_QUESTION_BY_ADMIN);
  const [createNewArticle] = useMutation(CREATE_NEW_ARTICLE);
  const [imagesUploader] = useMutation(IMAGES_UPLOADER);

  /** DERIVED **/

  const articlesResult = articlesData ?? articlesPreviousData;
  const questionsResult = questionsData ?? questionsPreviousData;

  const posts: Post[] = useMemo(() => {
    const articles: BoardArticle[] = wantsArticles
      ? (articlesResult?.getAllBoardArticlesByAdmin?.list ?? [])
      : [];
    const questions: QnaQuestion[] = wantsQuestions
      ? (questionsResult?.getAllQuestionsByAdmin?.list ?? [])
      : [];

    return (
      [...articles.map(fromArticle), ...questions.map(fromQuestion)]
        // A row still sitting in DELETE means a remove that never landed — it is
        // gone as far as the public site is concerned, so keep it out of here too.
        .filter((post) => post.status !== ArticleStatus.DELETE)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    );
  }, [articlesResult, questionsResult, wantsArticles, wantsQuestions]);

  const counts = {
    FREE: metaTotal(countsData?.free?.metaCounter),
    NEWS: metaTotal(countsData?.news?.metaCounter),
    QNA: metaTotal(countsData?.qna?.metaCounter),
  };
  const countFor = (board: TabKey) =>
    board === "ALL" ? counts.FREE + counts.NEWS + counts.QNA : counts[board];

  const tabTotal = countFor(boardTab);
  // Only a single-collection tab can be paged correctly.
  const totalPages =
    boardTab === "ALL" ? 1 : Math.max(1, Math.ceil(tabTotal / POSTS_PER_PAGE));

  const selectedPost = posts.find((post) => post.id === selectedId) ?? null;

  /** HANDLERS **/

  const refreshAll = async () => {
    await Promise.allSettled([
      wantsArticles ? articlesRefetch() : Promise.resolve(),
      wantsQuestions ? questionsRefetch() : Promise.resolve(),
      countsRefetch(),
    ]);
  };

  const setStatus = async (post: Post, status: ArticleStatus | QnaStatus) => {
    try {
      if (post.board === "QNA") {
        await updateQuestion({
          variables: { input: { questionId: post.id, qnaStatus: status } },
        });
      } else {
        await updateArticle({
          variables: { input: { articleId: post.id, articleStatus: status } },
        });
      }
      await refreshAll();
      await sweetBottomSmallSuccessAlert("Post updated!", 700);
    } catch (err: any) {
      console.log("ERROR, setStatus:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  // The hard-delete resolvers only match rows already in DELETE status, so a
  // real delete is two calls: flag it, then remove it.
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const post = deleteTarget;
    try {
      if (post.board === "QNA") {
        await updateQuestion({
          variables: {
            input: { questionId: post.id, qnaStatus: QnaStatus.DELETE },
          },
        });
        await removeQuestion({ variables: { input: post.id } });
      } else {
        await updateArticle({
          variables: {
            input: { articleId: post.id, articleStatus: ArticleStatus.DELETE },
          },
        });
        await removeArticle({ variables: { input: post.id } });
      }
      setDeleteTarget(null);
      if (selectedId === post.id) setDrawerOpen(false);
      await refreshAll();
      await sweetBottomSmallSuccessAlert("Post deleted!", 700);
    } catch (err: any) {
      console.log("ERROR, confirmDelete:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const openDetail = (post: Post) => {
    setSelectedId(post.id);
    setDrawerOpen(true);
  };

  const openWrite = () => {
    if (writeImage) URL.revokeObjectURL(writeImage.preview);
    setWriteTitle("");
    setWriteContent("");
    setWriteImage(null);
    setWriteOpen(true);
  };

  const handleImagePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (writeImage) URL.revokeObjectURL(writeImage.preview);
    setWriteImage({ file, preview: URL.createObjectURL(file) });
    // Reset the input so re-picking the same file still fires a change.
    e.target.value = "";
  };

  const removeWriteImage = () => {
    if (writeImage) URL.revokeObjectURL(writeImage.preview);
    setWriteImage(null);
  };

  const submitPost = async () => {
    if (isPublishing || !writeImage) return;
    try {
      setIsPublishing(true);

      // articleImage is required by the API, so a failed upload has to abort
      // the write rather than post a picture-less article.
      const { data: uploadData } = await imagesUploader({
        variables: { files: [writeImage.file], target: "article" },
      });
      const articleImage: string | undefined = (
        uploadData?.imagesUploader ?? []
      ).filter(Boolean)[0];
      if (!articleImage) throw new Error(Messages.error1);

      await createNewArticle({
        variables: {
          input: {
            articleCategory: writeBoard as ArticleCategory,
            articleTitle: writeTitle.trim(),
            articleContent: writeContent.trim(),
            articleImage,
          },
        },
      });

      removeWriteImage();
      setWriteOpen(false);
      await refreshAll();
      await sweetBottomSmallSuccessAlert("Post published!", 700);
    } catch (err: any) {
      console.log("ERROR, submitPost:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const changeTab = (value: TabKey) => {
    setBoardTab(value);
    setPage(1);
  };

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">
          {t("admin.community.title")}
        </Typography>
        {canWrite && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={openWrite}
            className="admin-cm-write-btn"
          >
            Write{" "}
            {writeBoard === "NEWS"
              ? t("admin.community.newsItem")
              : t("admin.community.post")}
          </Button>
        )}
      </Stack>

      <Stack className="admin-card">
        {/* Board Tabs */}
        <Tabs
          value={boardTab}
          onChange={(_, v) => changeTab(v)}
          className="admin-cm-tabs"
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Stack direction="row" alignItems="center" gap={0.8}>
                  {t(tab.labelKey)}
                  {/* bg and color are dynamic based on boardTab === tab.value */}
                  <Stack
                    sx={{
                      background:
                        boardTab === tab.value ? "#EEF2FF" : "#F3F4F6",
                      borderRadius: "999px",
                      px: 0.9,
                      py: 0.1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: boardTab === tab.value ? "#6366F1" : "#9CA3AF",
                      }}
                    >
                      {countFor(tab.value)}
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
            placeholder={t("admin.community.phSearch")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="admin-toolbar-search admin-cm-search"
          />
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as StatusFilter);
              setPage(1);
            }}
            className="admin-toolbar-select admin-cm-status-filter"
          >
            <MenuItem value="ALL">{t("admin.filter.allStatuses")}</MenuItem>
            <MenuItem value="ACTIVE">{t("admin.state.visible")}</MenuItem>
            <MenuItem value="HIDE">{t("admin.state.hidden")}</MenuItem>
          </Select>
          <Typography className="admin-meta-count">
            {boardTab === "ALL"
              ? t("admin.mostRecentOf", {
                  shown: posts.length,
                  total: tabTotal,
                })
              : `${posts.length} of ${tabTotal}`}
          </Typography>
        </Stack>

        {/* Card list */}
        <Stack className="admin-cm-card-list">
          {posts.map((post) => {
            const isQna = post.board === "QNA";
            const isHidden = post.status === ArticleStatus.HIDE;
            const bc = BOARD_COLORS[post.board];

            return (
              <Stack
                key={post.id}
                direction="row"
                alignItems="center"
                gap={0}
                width="100%"
                className={`admin-cm-post-card${isHidden ? " hidden-post" : ""}`}
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
                      src={imageUrl(post.image)}
                      alt=""
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = BLANK_IMAGE;
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
                      {isQna ? "Q&A" : post.board}
                    </span>
                    {isHidden && (
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
                      {post.content}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={1.2}
                      flexShrink={0}
                    >
                      <Stack direction="row" alignItems="center" gap={0.3}>
                        <img
                          src={avatarUrl(post.authorImage, post.author)}
                          alt=""
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            objectFit: "cover",
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
                      <StatBadge
                        icon={
                          isQna ? (
                            <QuestionAnswerIcon className="admin-icon-11-gray" />
                          ) : (
                            <ChatBubbleOutlineIcon className="admin-icon-11-gray" />
                          )
                        }
                        value={post.replies}
                      />
                      <Typography className="admin-cm-dot">·</Typography>
                      <Typography className="admin-cm-date">
                        {formatDate(post.createdAt, intlLocale)}
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
                  {isHidden ? (
                    <Button
                      size="small"
                      onClick={() => setStatus(post, ArticleStatus.ACTIVE)}
                      className="admin-btn-sm admin-btn-sm-green"
                    >
                      Show
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => setStatus(post, ArticleStatus.HIDE)}
                      className="admin-btn-sm admin-btn-sm-orange"
                    >
                      Hide
                    </Button>
                  )}
                  <Button
                    size="small"
                    onClick={() => setDeleteTarget(post)}
                    className="admin-btn-sm admin-btn-sm-red"
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            );
          })}

          {posts.length === 0 && (
            <Stack className="admin-cm-empty">
              <Typography style={{ fontSize: "32px", marginBottom: 8 }}>
                📭
              </Typography>
              <Typography className="admin-cm-empty-title">
                {t("admin.empty.posts")}
              </Typography>
              <Typography className="admin-cm-empty-sub">
                {t("admin.empty.tryOtherFilter")}
              </Typography>
            </Stack>
          )}
        </Stack>

        {totalPages > 1 && (
          <Stack className="admin-pagination">
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="primary"
            />
          </Stack>
        )}
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
            {/* bg is dynamic (the board's own colour) */}
            <Stack
              alignItems="center"
              justifyContent="center"
              className="admin-cm-write-icon-box"
              sx={{ background: BOARD_COLORS[writeBoard].bg }}
            >
              <EditIcon
                sx={{ fontSize: 18, color: BOARD_COLORS[writeBoard].color }}
              />
            </Stack>
            <Stack>
              <Typography className="admin-cm-write-title">
                Write{" "}
                {writeBoard === "NEWS"
                  ? t("admin.community.newsItem")
                  : t("admin.community.post")}
              </Typography>
              <Typography className="admin-cm-write-subtitle">
                {writeBoard === "NEWS"
                  ? t("admin.community.newsBoard")
                  : t("admin.community.freeBoard")}{" "}
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
                  placeholder={t("admin.community.phTitle")}
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
                  placeholder={t("admin.community.phBody")}
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

          {/* Image Upload — required by the API */}
          <Stack className="admin-cm-write-section">
            <Stack className="admin-cm-write-section-header">
              <Typography className="admin-cm-write-section-title">
                Cover Image
              </Typography>
            </Stack>
            <Stack style={{ padding: "20px" }}>
              {writeImage ? (
                <Stack className="admin-cm-img-preview-wrap">
                  <img
                    src={writeImage.preview}
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
                    PNG, JPG, WEBP — required
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
            disabled={
              !writeTitle.trim() ||
              !writeContent.trim() ||
              !writeImage ||
              isPublishing
            }
            className="admin-cm-write-publish-btn"
          >
            {isPublishing
              ? t("admin.community.publishing")
              : t("admin.community.publish")}
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
            const isHidden = selectedPost.status === ArticleStatus.HIDE;
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
                      {isQna ? "Q&A" : selectedPost.board}
                    </span>
                    <span
                      className={`status-chip status-${isHidden ? "hidden" : "visible"}`}
                    >
                      {isHidden ? "hidden" : "visible"}
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
                        src={imageUrl(selectedPost.image)}
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
                        <img
                          src={avatarUrl(
                            selectedPost.authorImage,
                            selectedPost.author,
                          )}
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
                        <Stack>
                          <Typography className="admin-cm-author-name">
                            @{selectedPost.author}
                          </Typography>
                          <Typography className="admin-cm-author-date">
                            Posted ·{" "}
                            {formatDate(selectedPost.createdAt, intlLocale)}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Full description */}
                      <Stack className="admin-cm-desc-box">
                        <Typography className="admin-cm-desc-text">
                          {selectedPost.content}
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
                          label: t("admin.col.board"),
                          value: isQna ? "Q&A" : selectedPost.board,
                        },
                        {
                          label: t("admin.col.status"),
                          value: isHidden ? "hidden" : "visible",
                        },
                        {
                          label: t("admin.col.author"),
                          value: `@${selectedPost.author}`,
                        },
                        {
                          label: t("admin.col.published"),
                          value: formatDate(selectedPost.createdAt, intlLocale),
                        },
                        {
                          label: isQna
                            ? t("admin.col.answers")
                            : t("admin.col.comments"),
                          value: selectedPost.replies,
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
                        label: t("admin.col.views"),
                        value: selectedPost.views.toLocaleString(),
                      },
                      {
                        icon: <FavoriteIcon className="admin-icon-17-red" />,
                        label: t("admin.col.likes"),
                        value: selectedPost.likes,
                      },
                      isQna
                        ? {
                            icon: (
                              <QuestionAnswerIcon className="admin-icon-18-green" />
                            ),
                            label: t("admin.col.answers"),
                            value: selectedPost.replies,
                          }
                        : {
                            icon: (
                              <ChatBubbleOutlineIcon className="admin-icon-17-amber" />
                            ),
                            label: t("admin.col.comments"),
                            value: selectedPost.replies,
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
                      {isHidden ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() =>
                            setStatus(selectedPost, ArticleStatus.ACTIVE)
                          }
                          className="admin-cm-show-btn"
                        >
                          Make Visible
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() =>
                            setStatus(selectedPost, ArticleStatus.HIDE)
                          }
                          className="admin-cm-hide-btn"
                        >
                          Hide Post
                        </Button>
                      )}
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setDeleteTarget(selectedPost)}
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
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
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
            onClick={() => setDeleteTarget(null)}
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
            onClick={confirmDelete}
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
