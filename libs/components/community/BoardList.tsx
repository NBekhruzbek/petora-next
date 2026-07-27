import { useState, useRef, ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import FreeBoardNewsCard from "./FreeBoardNewsCard";
import { userVar } from "@/apollo/store";
import { GET_BOARD_ARTICLES } from "@/apollo/user/query";
import { CREATE_NEW_ARTICLE, IMAGES_UPLOADER } from "@/apollo/user/mutation";
import { BoardArticle } from "@/libs/types/board-article/board-article";
import { BoardArticlesInquiry } from "@/libs/types/board-article/board-article.input";
import { ArticleCategory } from "@/libs/enums/boardArticle.enum";
import { Direction } from "@/libs/enums/common.enum";
import { Messages } from "@/libs/config";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";

type BoardListProps = {
  category: ArticleCategory;
  isWriteOpen: boolean;
  onWriteClose: () => void;
};

const ARTICLES_PER_PAGE = 9;

const BoardList = ({ category, isWriteOpen, onWriteClose }: BoardListProps) => {
  const user = useReactiveVar(userVar);

  const [searchFilter, setSearchFilter] = useState<BoardArticlesInquiry>({
    page: 1,
    limit: ARTICLES_PER_PAGE,
    sort: "createdAt",
    direction: Direction.DESC,
    search: { articleCategory: category },
  });
  const [writeForm, setWriteForm] = useState({
    title: "",
    content: "",
    image: null as { file: File; preview: string } | null,
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const boardTopRef = useRef<HTMLDivElement | null>(null);

  /** APOLLO REQUESTS **/

  const {
    data: getBoardArticlesData,
    previousData: getBoardArticlesPreviousData,
    loading: getBoardArticlesLoading,
    refetch: getBoardArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  const [createNewArticle] = useMutation(CREATE_NEW_ARTICLE);
  const [imagesUploader] = useMutation(IMAGES_UPLOADER);

  /** DERIVED **/

  // Keep the current page on screen while the next one loads — Apollo empties
  // `data` whenever the variables change, which would otherwise flash the empty
  // state between pages.
  const getBoardArticlesResult =
    getBoardArticlesData ?? getBoardArticlesPreviousData;
  const articles: BoardArticle[] =
    getBoardArticlesResult?.getBoardArticles?.list ?? [];
  const total: number =
    getBoardArticlesResult?.getBoardArticles?.metaCounter?.[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / searchFilter.limit));
  const canPublish = Boolean(
    writeForm.title.trim() && writeForm.content.trim() && writeForm.image,
  );

  /** LIFECYCLES **/

  // Switching between the Free Board and News tabs re-queries from page 1.
  useEffect(() => {
    setSearchFilter((prev) =>
      prev.search.articleCategory === category
        ? prev
        : {
            ...prev,
            page: 1,
            search: { ...prev.search, articleCategory: category },
          },
    );
  }, [category]);

  // meLiked is computed server-side from the auth token, so re-run the query
  // whenever the logged-in member changes (login / logout / reload).
  useEffect(() => {
    getBoardArticlesRefetch({ input: searchFilter });
  }, [user?._id]);

  /** HANDLERS **/

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (writeForm.image) URL.revokeObjectURL(writeForm.image.preview);
    setWriteForm((prev) => ({
      ...prev,
      image: { file, preview: URL.createObjectURL(file) },
    }));
    // Reset the input so re-picking the same file still fires a change.
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    if (writeForm.image) URL.revokeObjectURL(writeForm.image.preview);
    setWriteForm((prev) => ({ ...prev, image: null }));
  };

  const handleFormReset = () => {
    if (writeForm.image) URL.revokeObjectURL(writeForm.image.preview);
    setWriteForm({ title: "", content: "", image: null });
  };

  const handleClose = () => {
    handleFormReset();
    onWriteClose();
  };

  const handleSubmit = async () => {
    if (!canPublish || isPublishing) return;

    setIsPublishing(true);
    try {
      if (!user?._id) throw new Error(Messages.error2);

      // articleImage is required by the API, so a failed upload has to abort the
      // write rather than post a picture-less article.
      const { data: uploadData } = await imagesUploader({
        variables: { files: [writeForm.image!.file], target: "article" },
      });
      const articleImage: string | undefined = (
        uploadData?.imagesUploader ?? []
      ).filter(Boolean)[0];
      if (!articleImage) throw new Error("Image upload failed, please retry.");

      await createNewArticle({
        variables: {
          input: {
            articleCategory: category,
            articleTitle: writeForm.title.trim(),
            articleContent: writeForm.content.trim(),
            articleImage,
          },
        },
      });

      handleFormReset();
      onWriteClose();
      // Newest first — the new article is on page 1.
      if (searchFilter.page !== 1) {
        setSearchFilter((prev) => ({ ...prev, page: 1 }));
      } else {
        await getBoardArticlesRefetch({ input: searchFilter });
      }
      await sweetBottomSmallSuccessAlert("Your post is live!", 900);
    } catch (err: any) {
      console.log("ERROR, handleSubmit:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const paginationHandler = (_event: ChangeEvent<unknown>, page: number) => {
    setSearchFilter((prev) => ({ ...prev, page }));

    if (!boardTopRef.current) return;
    const scrollTarget =
      window.scrollY + boardTopRef.current.getBoundingClientRect().top - 180;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  return (
    <>
      <Stack className="qna-board" ref={boardTopRef}>
        {articles.length ? (
          <Stack className="community-card-flex">
            {articles.map((article) => (
              <FreeBoardNewsCard
                key={article._id}
                article={article}
                onArticleUpdate={() =>
                  getBoardArticlesRefetch({ input: searchFilter })
                }
              />
            ))}
          </Stack>
        ) : getBoardArticlesLoading ? (
          <Stack className="qna-empty-state">
            <CircularProgress size={28} />
          </Stack>
        ) : (
          <Stack className="qna-empty-state">
            <Typography className="qna-empty-title">No posts yet</Typography>
            <Typography className="qna-empty-copy">
              Be the first to write on this board.
            </Typography>
          </Stack>
        )}

        {total > searchFilter.limit && (
          <Stack className="qna-pagination-wrap">
            <Pagination
              count={totalPages}
              page={searchFilter.page}
              onChange={paginationHandler}
              shape="rounded"
              className="qna-pagination"
            />
          </Stack>
        )}
      </Stack>

      {/* Write Dialog */}
      <Dialog
        className="qna-dialog qna-ask-dialog"
        open={isWriteOpen}
        onClose={handleClose}
        disableScrollLock
        fullWidth
        maxWidth="md"
        PaperProps={{ className: "qna-dialog-paper" }}
      >
        <Stack className="qna-dialog-header">
          <Stack className="qna-dialog-heading">
            <Typography className="qna-dialog-title">
              Create New Post
            </Typography>
          </Stack>
          <IconButton onClick={handleClose} className="qna-close-btn">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <DialogContent className="qna-dialog-content">
          <Stack className="qna-dialog-section qna-ask-form-section">
            {/* Title Field */}
            <Stack className="qna-ask-field-group">
              <Typography className="qna-ask-label">Title</Typography>
              <Box className="qna-answer-input">
                <input
                  type="text"
                  placeholder="Enter a catchy title..."
                  value={writeForm.title}
                  onChange={(e) =>
                    setWriteForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="qna-ask-title-input"
                />
              </Box>
            </Stack>

            {/* Content Field */}
            <Stack className="qna-ask-field-group">
              <Typography className="qna-ask-label">Main Content</Typography>
              <Box className="qna-answer-input">
                <textarea
                  className="qna-write-content-area"
                  placeholder="Share your thoughts with the community..."
                  value={writeForm.content}
                  onChange={(e) =>
                    setWriteForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                />
              </Box>
            </Stack>

            {/* Single Image Upload — the API requires an article image. */}
            <Stack className="qna-ask-field-group">
              <Typography className="qna-ask-label">
                Image (required — you can upload only one image.)
              </Typography>
              <Stack direction="row" gap={2} alignItems="flex-start">
                {!writeForm.image && (
                  <Button component="label" className="qna-image-upload-btn">
                    <AddPhotoAlternateOutlinedIcon />
                    <Typography component="span">Upload</Typography>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </Button>
                )}

                {writeForm.image && (
                  <Box className="qna-image-preview-wrap">
                    <Box
                      component="img"
                      src={writeForm.image.preview}
                      draggable={false}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      className="qna-delete-img-btn"
                    >
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>
                )}
              </Stack>
            </Stack>

            {/* Submit Button */}
            <Button
              className="community-write-btn qna-post-answer-btn qna-ask-submit-btn"
              variant="contained"
              startIcon={
                isPublishing ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SendRoundedIcon />
                )
              }
              onClick={handleSubmit}
              disabled={!canPublish || isPublishing}
            >
              {isPublishing ? "Publishing..." : "Publish Post"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BoardList;
