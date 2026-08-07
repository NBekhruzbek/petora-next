import { Dialog, IconButton, Stack, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export type ImageViewerState = { images: string[]; index: number } | null;

interface ImageViewerDialogProps {
  viewer: ImageViewerState;
  onChange: (viewer: ImageViewerState) => void;
  /** Alt-text stem, e.g. "Review photo" -> "Review photo 2". */
  altPrefix?: string;
}

const ImageViewerDialog = ({
  viewer,
  onChange,
  altPrefix = "Image",
}: ImageViewerDialogProps) => {
  const handleClose = () => onChange(null);
  const handlePrevious = () =>
    viewer &&
    onChange({
      ...viewer,
      index: viewer.index === 0 ? viewer.images.length - 1 : viewer.index - 1,
    });
  const handleNext = () =>
    viewer &&
    onChange({
      ...viewer,
      index: viewer.index === viewer.images.length - 1 ? 0 : viewer.index + 1,
    });

  return (
    <Dialog
      className="image-viewer-dialog"
      open={Boolean(viewer)}
      onClose={handleClose}
      maxWidth="lg"
      transitionDuration={{ enter: 280, exit: 200 }}
      PaperProps={{ className: "image-viewer-dialog-paper" }}
    >
      {viewer ? (
        <Stack className="image-viewer-dialog-body">
          <IconButton
            onClick={handleClose}
            className="image-viewer-dialog-close"
          >
            <CloseRoundedIcon />
          </IconButton>

          {viewer.images.length > 1 ? (
            <IconButton
              onClick={handlePrevious}
              className="image-viewer-dialog-nav prev"
            >
              <ArrowBackIosNewRoundedIcon />
            </IconButton>
          ) : null}

          <Stack className="image-viewer-stage">
            <img
              key={viewer.images[viewer.index]}
              className="image-viewer-stage-image"
              src={viewer.images[viewer.index]}
              alt={`${altPrefix} ${viewer.index + 1}`}
              draggable={false}
            />
          </Stack>

          {viewer.images.length > 1 ? (
            <IconButton
              onClick={handleNext}
              className="image-viewer-dialog-nav next"
            >
              <ArrowForwardIosRoundedIcon />
            </IconButton>
          ) : null}

          {viewer.images.length > 1 ? (
            <Typography className="image-viewer-dialog-counter">
              {viewer.index + 1} / {viewer.images.length}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
    </Dialog>
  );
};

export default ImageViewerDialog;
