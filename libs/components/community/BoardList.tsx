import { useState, useRef, ChangeEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FreeBoardNewsCard, { FreeBoardNewsCardType } from "./FreeBoardNewsCard";

type BoardListProps = {
  category: "FREE" | "NEWS";
  initialPosts: FreeBoardNewsCardType[];
  isWriteOpen: boolean;
  onWriteClose: () => void;
};

const BoardList = ({
  category,
  initialPosts,
  isWriteOpen,
  onWriteClose,
}: BoardListProps) => {
  const [posts, setPosts] = useState<FreeBoardNewsCardType[]>(initialPosts);
  const [writeForm, setWriteForm] = useState({
    title: "",
    content: "",
    image: null as { file: File; preview: string } | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (writeForm.image) {
        URL.revokeObjectURL(writeForm.image.preview);
      }
      setWriteForm((prev) => ({
        ...prev,
        image: {
          file,
          preview: URL.createObjectURL(file),
        },
      }));
    }
  };

  const handleRemoveImage = () => {
    if (writeForm.image) {
      URL.revokeObjectURL(writeForm.image.preview);
    }
    setWriteForm((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = () => {
    if (!writeForm.title.trim() || !writeForm.content.trim()) return;

    const newPost: FreeBoardNewsCardType = {
      id: `${category.toLowerCase()}-${Date.now()}`,
      title: writeForm.title.trim(),
      description: writeForm.content.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      image: writeForm.image?.preview || "/img/headers/community-header.png",
      views: 0,
      likes: 0,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setWriteForm({ title: "", content: "", image: null });
    onWriteClose();
  };

  return (
    <>
      <Stack className="community-card-flex">
        {posts.map((post) => (
          <FreeBoardNewsCard key={post.id} item={post} />
        ))}
      </Stack>

      {/* Write Dialog */}
      <Dialog
        className="qna-dialog qna-ask-dialog"
        open={isWriteOpen}
        onClose={onWriteClose}
        disableScrollLock
        fullWidth
        maxWidth="md"
        PaperProps={{ className: "qna-dialog-paper" }}
      >
        <Stack className="qna-dialog-header">
          <Stack className="qna-dialog-heading">
            <Typography className="qna-dialog-title">Create New Post</Typography>
          </Stack>
          <IconButton onClick={onWriteClose} className="qna-close-btn">
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

            {/* Single Image Upload */}
            <Stack className="qna-ask-field-group">
              <Typography className="qna-ask-label">Image (you can upload only one image.)</Typography>
              <Stack direction="row" gap={2} alignItems="flex-start">
                {!writeForm.image && (
                  <Button
                    component="label"
                    className="qna-image-upload-btn"
                  >
                    <AddPhotoAlternateOutlinedIcon />
                    <Typography component="span">
                      Upload
                    </Typography>
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
              startIcon={<SendRoundedIcon />}
              onClick={handleSubmit}
              disabled={!writeForm.title.trim() || !writeForm.content.trim()}
            >
              Publish Post
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BoardList;
