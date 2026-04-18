import { useState, useRef } from "react";
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

export type Comment = {
  id: string;
  content: string;
  author: string;
  authorImage?: string;
  timeAgo: string;
};

export type FreeBoardNewsCardType = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  views: number;
  likes: number;
  author?: string;
  authorImage?: string;
  comments?: Comment[];
};

type FreeBoardNewsCardProps = {
  item: FreeBoardNewsCardType;
};

const DESCRIPTION_LIMIT = 80;
const COMMENTS_PER_PAGE = 10;
const CURRENT_USER = {
  name: "You",
  image: "/img/avatar/member-1.png",
};

const FreeBoardNewsCard = ({ item }: FreeBoardNewsCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>(item.comments || []);
  const [draftComment, setDraftComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes);
  const [commentPage, setCommentPage] = useState(1);
  const commentSectionRef = useRef<HTMLDivElement>(null);

  const totalCommentPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const pagedComments = comments.slice(
    (commentPage - 1) * COMMENTS_PER_PAGE,
    commentPage * COMMENTS_PER_PAGE,
  );

  const shortDescription =
    item.description.length > DESCRIPTION_LIMIT
      ? `${item.description.slice(0, DESCRIPTION_LIMIT).trim()}...`
      : item.description;

  const handleOpenDialog = () => setIsOpen(true);
  const handleCloseDialog = () => {
    setIsOpen(false);
    setDraftComment("");
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handlePostComment = () => {
    if (!draftComment.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content: draftComment.trim(),
      author: CURRENT_USER.name,
      authorImage: CURRENT_USER.image,
      timeAgo: "Just now",
    };

    setComments((prev) => [newComment, ...prev]);
    setDraftComment("");
    setCommentPage(1);

    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleCommentPageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCommentPage(value);
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const renderUserAvatar = (name: string, image?: string) => (
    <Avatar src={image} className="qna-author-avatar">
      {name.charAt(0)}
    </Avatar>
  );

  return (
    <>
      <Stack className="free-board-news-card" onClick={handleOpenDialog}>
        <Box className="free-board-news-media">
          <img
            className="free-board-news-image"
            src={item.image}
            alt={item.title}
          />
          <Box className="free-board-news-date">{item.date}</Box>
        </Box>

        <Stack className="free-board-news-body">
          <Typography className="free-board-news-title">{item.title}</Typography>

          <Typography className="free-board-news-description">
            {shortDescription}
          </Typography>

          <Stack className="free-board-news-meta">
            <Box className="free-board-news-stat">
              <VisibilityOutlinedIcon />
              <span>{item.views.toLocaleString()}</span>
            </Box>

            <Box className={`free-board-news-stat ${isLiked ? "liked" : ""}`}>
              {isLiked ? (
                <FavoriteRoundedIcon />
              ) : (
                <FavoriteBorderRoundedIcon />
              )}
              <span>{likesCount.toLocaleString()}</span>
            </Box>

            <Box className="free-board-news-stat">
              <ChatBubbleOutlineRoundedIcon />
              <span>{comments.length}</span>
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
        transitionDuration={{ enter: 320, exit: 220 }}
        PaperProps={{ className: "qna-dialog-paper" }}
      >
        <Stack className="qna-dialog-header">
          <Stack className="qna-dialog-heading">
            <Typography className="qna-dialog-title">{item.title}</Typography>
          </Stack>

          <IconButton onClick={handleCloseDialog} className="qna-close-btn">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <DialogContent className="qna-dialog-content">
          <Stack className="qna-dialog-section free-board-detail-section">
            <Box 
              component="img" 
              src={item.image} 
              className="qna-reveal-image is-loaded free-board-detail-image"
            />
            
            <Stack className="free-board-detail-body">
              <Typography className="free-board-detail-content">
                {item.description}
              </Typography>

              <Stack className="free-board-news-meta free-board-detail-meta">
                <Box className="free-board-news-stat">
                  <VisibilityOutlinedIcon />
                  <span>{item.views.toLocaleString()} views</span>
                </Box>
                <Typography className="qna-meta-dot">•</Typography>
                <Box 
                  className={`free-board-news-stat like-btn ${isLiked ? "liked" : ""}`}
                  onClick={handleToggleLike}
                >
                  {isLiked ? (
                    <FavoriteRoundedIcon />
                  ) : (
                    <FavoriteBorderRoundedIcon />
                  )}
                  <span>{likesCount.toLocaleString()} likes</span>
                </Box>
                <Typography className="qna-meta-dot">•</Typography>
                <Typography className="qna-meta-text">{item.date}</Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Comments Section */}
          <Stack className="qna-dialog-section" ref={commentSectionRef}>
            <Typography className="qna-section-title">
              {comments.length} Comments
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
                pagedComments.map((comment) => (
                  <Stack key={comment.id} className="qna-answer-main">
                    <Stack className="qna-question-meta">
                      <Stack className="qna-author-group">
                        {renderUserAvatar(
                          comment.author,
                          comment.authorImage,
                        )}
                        <Typography className="qna-author-name">
                          {comment.author}
                        </Typography>
                      </Stack>

                      <Typography className="qna-meta-dot">•</Typography>
                      <Typography className="qna-meta-text">
                        {comment.timeAgo}
                      </Typography>
                    </Stack>
                    <Typography component="pre" className="qna-answer-content">
                      {comment.content}
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
            <Typography className="qna-section-title">Leave a Comment</Typography>

            <Stack className="qna-answer-form">
              {renderUserAvatar(CURRENT_USER.name, CURRENT_USER.image)}

              <Stack className="qna-answer-input-wrap">
                <Box className="qna-answer-input">
                  <textarea
                    placeholder="Write your comment..."
                    value={draftComment}
                    onChange={(e) => setDraftComment(e.target.value)}
                  />
                </Box>

                <Button
                  className="community-write-btn qna-post-answer-btn"
                  variant="contained"
                  startIcon={<SendRoundedIcon />}
                  onClick={handlePostComment}
                  disabled={!draftComment.trim()}
                >
                  Post Comment
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FreeBoardNewsCard;