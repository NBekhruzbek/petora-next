import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  Pagination,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import moment from "moment";
import { userVar } from "@/apollo/store";
import { GET_BOARD_ARTICLE, GET_COMMENTS } from "@/apollo/user/query";
import {
  CREATE_COMMENT,
  LIKE_TARGET_BOARD_ARTICLE,
} from "@/apollo/user/mutation";
import { BoardArticle } from "@/libs/types/board-article/board-article";
import { Comment } from "@/libs/types/comment/comment";
import { CommentGroup } from "@/libs/enums/comment.enum";
import { Direction } from "@/libs/enums/common.enum";
import { Messages } from "@/libs/config";
import { sweetMixinErrorAlert } from "@/libs/sweetAlert";
import {
  FALLBACK_ARTICLE_IMAGE,
  getArticleImage,
  getMemberImage,
  getMemberName,
} from "./helpers";

export type FreeBoardNewsCardProps = {
  article: BoardArticle;
  /** Refetch the owning list so counters / meLiked stay in step with the server. */
  onArticleUpdate?: () => void;
};

const DESCRIPTION_LIMIT = 80;
const COMMENTS_PER_PAGE = 10;

const FreeBoardNewsCard = ({
  article,
  onArticleUpdate,
}: FreeBoardNewsCardProps) => {
  const user = useReactiveVar(userVar);
  const [isOpen, setIsOpen] = useState(false);
  const [draftComment, setDraftComment] = useState("");
  const [commentPage, setCommentPage] = useState(1);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const commentSectionRef = useRef<HTMLDivElement>(null);

  /** APOLLO REQUESTS **/

  // Opening the dialog is what records a view — the list query never does.
  // A logged-out reader still gets the article, just without the view / meLiked.
  const { data: getBoardArticleData, refetch: getBoardArticleRefetch } =
    useQuery(GET_BOARD_ARTICLE, {
      fetchPolicy: "cache-and-network",
      variables: { input: article._id },
      skip: !isOpen,
      notifyOnNetworkStatusChange: true,
    });

  const { data: getCommentsData, refetch: getCommentsRefetch } = useQuery(
    GET_COMMENTS,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        input: {
          page: commentPage,
          limit: COMMENTS_PER_PAGE,
          sort: "createdAt",
          direction: Direction.DESC,
          search: { commentRefId: article._id },
        },
      },
      skip: !isOpen,
      notifyOnNetworkStatusChange: true,
    },
  );

  const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
  const [createComment] = useMutation(CREATE_COMMENT);

  /** DERIVED **/

  // The detail query returns the same normalized entity, so once it resolves the
  // card and the dialog read the same (fresher) counters.
  const detail: BoardArticle =
    getBoardArticleData?.getBoardArticle ?? article;
  const comments: Comment[] = getCommentsData?.getComments?.list ?? [];
  const commentTotal: number =
    getCommentsData?.getComments?.metaCounter?.[0]?.total ??
    detail.articleComments ??
    0;
  const totalCommentPages = Math.ceil(commentTotal / COMMENTS_PER_PAGE);
  const myFavorite = Boolean(detail.meLiked?.[0]?.myFavorite);
  const articleImage = getArticleImage(detail.articleImage);
  const articleDate = moment(detail.createdAt).format("MMM DD, YYYY");
  const currentUserName = user?._id ? getMemberName(user) : "You";

  const shortDescription =
    detail.articleContent.length > DESCRIPTION_LIMIT
      ? `${detail.articleContent.slice(0, DESCRIPTION_LIMIT).trim()}...`
      : detail.articleContent;

  /** LIFECYCLES **/

  // meLiked is resolved from the auth token, so a login / logout has to re-ask.
  useEffect(() => {
    if (isOpen) getBoardArticleRefetch({ input: article._id });
  }, [user?._id]);

  /** HANDLERS **/

  const handleOpenDialog = () => setIsOpen(true);

  const handleCloseDialog = () => {
    setIsOpen(false);
    setDraftComment("");
    setCommentPage(1);
    // The dialog recorded a view / may have added comments — let the list catch up.
    onArticleUpdate?.();
  };

  const handleToggleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      if (!user?._id) throw new Error(Messages.error2);

      await likeTargetBoardArticle({ variables: { input: article._id } });
      // The mutation returns articleLikes but not meLiked, so the heart state
      // only settles once a query that computes it runs again.
      if (isOpen) await getBoardArticleRefetch({ input: article._id });
      onArticleUpdate?.();
    } catch (err: any) {
      console.log("ERROR, handleToggleLike:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const handlePostComment = async () => {
    const commentContent = draftComment.trim();
    if (!commentContent || isPostingComment) return;

    setIsPostingComment(true);
    try {
      if (!user?._id) throw new Error(Messages.error2);

      await createComment({
        variables: {
          input: {
            commentGroup: CommentGroup.ARTICLE,
            commentRefId: article._id,
            commentContent,
          },
        },
      });

      setDraftComment("");
      // Newest first, so a fresh comment always lands on page 1.
      if (commentPage !== 1) setCommentPage(1);
      else await getCommentsRefetch();
      await getBoardArticleRefetch({ input: article._id });
      onArticleUpdate?.();

      commentSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (err: any) {
      console.log("ERROR, handlePostComment:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleCommentPageChange = (
    _: ChangeEvent<unknown>,
    value: number,
  ) => {
    setCommentPage(value);
    commentSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const renderUserAvatar = (name: string, image?: string) => (
    <Avatar src={image} className="qna-author-avatar">
      {name.charAt(0).toUpperCase()}
    </Avatar>
  );

  return (
    <>
      <Stack className="free-board-news-card" onClick={handleOpenDialog}>
        <Box className="free-board-news-media">
          <img
            className="free-board-news-image"
            src={articleImage}
            alt={detail.articleTitle}
            // The whole card is the click target; a draggable image would eat
            // the click whenever the pointer drifts a few pixels.
            draggable={false}
            onError={(event) => {
              event.currentTarget.src = FALLBACK_ARTICLE_IMAGE;
            }}
          />
          <Box className="free-board-news-date">{articleDate}</Box>
        </Box>

        <Stack className="free-board-news-body">
          <Typography className="free-board-news-title">
            {detail.articleTitle}
          </Typography>

          <Typography className="free-board-news-description">
            {shortDescription}
          </Typography>

          <Stack className="free-board-news-meta">
            <Box className="free-board-news-stat">
              <VisibilityOutlinedIcon />
              <span>{detail.articleViews.toLocaleString()}</span>
            </Box>

            <Box className={`free-board-news-stat ${myFavorite ? "liked" : ""}`}>
              {myFavorite ? (
                <FavoriteRoundedIcon />
              ) : (
                <FavoriteBorderRoundedIcon />
              )}
              <span>{detail.articleLikes.toLocaleString()}</span>
            </Box>

            <Box className="free-board-news-stat">
              <ChatBubbleOutlineRoundedIcon />
              <span>{detail.articleComments.toLocaleString()}</span>
            </Box>
          </Stack>
        </Stack>
      </Stack>

      {/* Detail Dialog */}
      <Dialog
        className="qna-dialog"
        open={isOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        disableScrollLock
        transitionDuration={{ enter: 320, exit: 220 }}
        PaperProps={{ className: "qna-dialog-paper" }}
      >
        <Stack className="qna-dialog-header">
          <Stack className="qna-dialog-heading">
            <Typography className="qna-dialog-title">
              {detail.articleTitle}
            </Typography>
          </Stack>

          <IconButton onClick={handleCloseDialog} className="qna-close-btn">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <DialogContent className="qna-dialog-content">
          <Stack className="qna-dialog-section free-board-detail-section">
            <Box
              component="img"
              src={articleImage}
              className="qna-reveal-image is-loaded free-board-detail-image"
              draggable={false}
              onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
                event.currentTarget.src = FALLBACK_ARTICLE_IMAGE;
              }}
            />

            <Stack className="free-board-detail-body">
              <Stack className="qna-question-meta">
                <Stack className="qna-author-group">
                  {renderUserAvatar(
                    getMemberName(detail.memberData),
                    getMemberImage(detail.memberData),
                  )}
                  <Typography className="qna-author-name">
                    {getMemberName(detail.memberData)}
                  </Typography>
                </Stack>

                <Typography className="qna-meta-dot">•</Typography>
                <Typography className="qna-meta-text">
                  {moment(detail.createdAt).fromNow()}
                </Typography>
              </Stack>

              <Typography className="free-board-detail-content">
                {detail.articleContent}
              </Typography>

              <Stack className="free-board-news-meta free-board-detail-meta">
                <Box className="free-board-news-stat">
                  <VisibilityOutlinedIcon />
                  <span>{detail.articleViews.toLocaleString()} views</span>
                </Box>
                <Typography className="qna-meta-dot">•</Typography>
                <Box
                  className={`free-board-news-stat like-btn ${myFavorite ? "liked" : ""}`}
                  onClick={handleToggleLike}
                >
                  {myFavorite ? (
                    <FavoriteRoundedIcon />
                  ) : (
                    <FavoriteBorderRoundedIcon />
                  )}
                  <span>{detail.articleLikes.toLocaleString()} likes</span>
                </Box>
                <Typography className="qna-meta-dot">•</Typography>
                <Typography className="qna-meta-text">{articleDate}</Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Comments Section */}
          <Stack className="qna-dialog-section" ref={commentSectionRef}>
            <Typography className="qna-section-title">
              {commentTotal} Comments
            </Typography>

            <Stack className="qna-answer-list">
              {comments.length === 0 ? (
                <Stack className="qna-empty-answers">
                  <Box className="qna-empty-icon-wrap">
                    <ChatBubbleOutlineRoundedIcon />
                  </Box>
                  <Typography className="qna-empty-title">
                    No comments yet
                  </Typography>
                  <Typography className="qna-empty-subtitle">
                    Be the first to share your thoughts on this post!
                  </Typography>
                </Stack>
              ) : (
                comments.map((comment) => (
                  <Stack key={comment._id} className="qna-answer-main">
                    <Stack className="qna-question-meta">
                      <Stack className="qna-author-group">
                        {renderUserAvatar(
                          getMemberName(comment.memberData),
                          getMemberImage(comment.memberData),
                        )}
                        <Typography className="qna-author-name">
                          {getMemberName(comment.memberData)}
                        </Typography>
                      </Stack>

                      <Typography className="qna-meta-dot">•</Typography>
                      <Typography className="qna-meta-text">
                        {moment(comment.createdAt).fromNow()}
                      </Typography>
                    </Stack>
                    <Typography component="pre" className="qna-answer-content">
                      {comment.commentContent}
                    </Typography>
                  </Stack>
                ))
              )}
            </Stack>

            {totalCommentPages > 1 && (
              <Stack className="qna-answer-pagination-wrap">
                <Pagination
                  count={totalCommentPages}
                  page={commentPage}
                  onChange={handleCommentPageChange}
                  shape="rounded"
                  className="qna-pagination"
                />
              </Stack>
            )}
          </Stack>

          {/* Add Comment Section */}
          <Stack className="qna-dialog-section qna-answer-form-section">
            <Typography className="qna-section-title">
              Leave a Comment
            </Typography>

            <Stack className="qna-answer-form">
              {renderUserAvatar(currentUserName, getMemberImage(user))}

              <Stack className="qna-answer-input-wrap">
                <Box className="qna-answer-input">
                  <textarea
                    placeholder="Write your comment..."
                    value={draftComment}
                    onChange={(e) => setDraftComment(e.target.value)}
                  />
                </Box>

                <Stack className="qna-answer-form-footer">
                  <Button
                    className="community-write-btn qna-post-answer-btn"
                    variant="contained"
                    startIcon={<SendRoundedIcon />}
                    onClick={handlePostComment}
                    disabled={!draftComment.trim() || isPostingComment}
                  >
                    Post Comment
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FreeBoardNewsCard;
