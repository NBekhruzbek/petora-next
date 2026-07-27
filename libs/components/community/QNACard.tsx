import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import moment from "moment";
import { userVar } from "@/apollo/store";
import { GET_COMMENTS, GET_QUESTION, GET_QUESTIONS } from "@/apollo/user/query";
import {
  CREATE_COMMENT,
  CREATE_NEW_QNA,
  IMAGES_UPLOADER,
} from "@/apollo/user/mutation";
import { QnaQuestion } from "@/libs/types/qna/qna";
import { QnaQuestionInquiry } from "@/libs/types/qna/qna.input";
import { Comment } from "@/libs/types/comment/comment";
import { CommentGroup } from "@/libs/enums/comment.enum";
import { Direction } from "@/libs/enums/common.enum";
import { Messages } from "@/libs/config";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";
import { getMemberImage, getMemberName, toServerImage } from "./helpers";

const QUESTIONS_PER_PAGE = 8;
const ANSWERS_PER_PAGE = 10;
const SUMMARY_PREVIEW_LIMIT = 120;
const MAX_QUESTION_IMAGES = 5;

type AskQuestionForm = {
  title: string;
  body: string;
  images: { file: File; preview: string }[];
};

const getAuthorInitial = (author: string) =>
  author.trim().charAt(0).toUpperCase();

const getSummaryPreview = (summary: string) =>
  summary.length > SUMMARY_PREVIEW_LIMIT
    ? `${summary.slice(0, SUMMARY_PREVIEW_LIMIT).trim()}...`
    : summary;

const getQuestionImages = (question?: QnaQuestion): string[] =>
  (question?.questionImages ?? [])
    .map((image) => toServerImage(image))
    .filter((image): image is string => Boolean(image));

const renderUserAvatar = (name: string, image?: string, extraClassName = "") => (
  <Avatar className={`qna-author-avatar ${extraClassName}`.trim()} src={image}>
    {image ? undefined : getAuthorInitial(name)}
  </Avatar>
);

type QNACardProps = {
  isAskOpen?: boolean;
  onAskClose?: () => void;
};

const QNACard = ({ isAskOpen = false, onAskClose }: QNACardProps) => {
  const user = useReactiveVar(userVar);

  const [searchFilter, setSearchFilter] = useState<QnaQuestionInquiry>({
    page: 1,
    limit: QUESTIONS_PER_PAGE,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {},
  });
  const [searchValue, setSearchValue] = useState("");
  const [answerPage, setAnswerPage] = useState(1);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [isPostingAnswer, setIsPostingAnswer] = useState(false);
  const [isPostingQuestion, setIsPostingQuestion] = useState(false);
  const [imageGallery, setImageGallery] = useState<{
    images: string[];
    index: number;
  } | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [askForm, setAskForm] = useState<AskQuestionForm>({
    title: "",
    body: "",
    images: [],
  });
  const boardRef = useRef<HTMLDivElement | null>(null);
  const answerSectionRef = useRef<HTMLDivElement | null>(null);
  const askImageInputRef = useRef<HTMLInputElement | null>(null);
  const previousPageRef = useRef(searchFilter.page);
  const previousAnswerPageRef = useRef(answerPage);

  /** APOLLO REQUESTS **/

  const {
    data: getQuestionsData,
    previousData: getQuestionsPreviousData,
    loading: getQuestionsLoading,
    refetch: getQuestionsRefetch,
  } = useQuery(GET_QUESTIONS, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  // Opening a question is what records its view — the list query never does.
  const { data: getQuestionData, refetch: getQuestionRefetch } = useQuery(
    GET_QUESTION,
    {
      fetchPolicy: "cache-and-network",
      variables: { input: selectedQuestionId },
      skip: !isDialogOpen || !selectedQuestionId,
      notifyOnNetworkStatusChange: true,
    },
  );

  // Answers are comments in the QNA group.
  const { data: getAnswersData, refetch: getAnswersRefetch } = useQuery(
    GET_COMMENTS,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        input: {
          page: answerPage,
          limit: ANSWERS_PER_PAGE,
          sort: "createdAt",
          // Answers read as a thread, so oldest first.
          direction: Direction.ASC,
          search: { commentRefId: selectedQuestionId },
        },
      },
      skip: !isDialogOpen || !selectedQuestionId,
      notifyOnNetworkStatusChange: true,
    },
  );

  const [createNewQuestion] = useMutation(CREATE_NEW_QNA);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [imagesUploader] = useMutation(IMAGES_UPLOADER);

  /** DERIVED **/

  // Keep the previous page on screen while the next one loads — Apollo empties
  // `data` whenever the variables change, and a momentary total of 0 would
  // collapse the pager mid-navigation.
  const getQuestionsResult = getQuestionsData ?? getQuestionsPreviousData;
  const questions: QnaQuestion[] = getQuestionsResult?.getQuestions?.list ?? [];
  const total: number =
    getQuestionsResult?.getQuestions?.metaCounter?.[0]?.total ?? 0;
  const currentPage = searchFilter.page;
  const totalPages = Math.max(1, Math.ceil(total / searchFilter.limit));

  // Render the list row immediately, then let the detail query fill in the
  // recorded view / meLiked once it lands.
  const selectedQuestion: QnaQuestion | null =
    getQuestionData?.getQuestion ??
    questions.find((question) => question._id === selectedQuestionId) ??
    null;
  const selectedQuestionImages = getQuestionImages(
    selectedQuestion ?? undefined,
  );

  const answers: Comment[] = getAnswersData?.getComments?.list ?? [];
  const answerTotal: number =
    getAnswersData?.getComments?.metaCounter?.[0]?.total ??
    selectedQuestion?.questionAnswers ??
    0;
  const answerTotalPages = Math.max(
    1,
    Math.ceil(answerTotal / ANSWERS_PER_PAGE),
  );
  const currentUserName = user?._id ? getMemberName(user) : "You";
  const activeGalleryImage = imageGallery
    ? imageGallery.images[imageGallery.index]
    : null;

  /** LIFECYCLES **/

  // Debounced live search — the API matches the text against title and content.
  useEffect(() => {
    const nextText = searchValue.trim() || undefined;
    const timer = setTimeout(() => {
      setSearchFilter((prev) =>
        prev.search.text === nextText
          ? prev
          : { ...prev, page: 1, search: { ...prev.search, text: nextText } },
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // meLiked / view state is resolved from the auth token.
  useEffect(() => {
    getQuestionsRefetch({ input: searchFilter });
  }, [user?._id]);

  useEffect(() => {
    setDraftAnswer("");
    setAnswerPage(1);
  }, [selectedQuestionId, isDialogOpen]);

  useEffect(() => {
    if (previousPageRef.current === currentPage) return;

    previousPageRef.current = currentPage;
    boardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentPage]);

  useEffect(() => {
    if (!isDialogOpen || previousAnswerPageRef.current === answerPage) {
      return;
    }

    previousAnswerPageRef.current = answerPage;
    answerSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [answerPage, isDialogOpen]);

  /** HANDLERS **/

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleImageLoad = (imageKey: string) => {
    setLoadedImages((prev) =>
      prev[imageKey]
        ? prev
        : {
            ...prev,
            [imageKey]: true,
          },
    );
  };

  const getLoadedImageClassName = (imageKey: string) =>
    `qna-reveal-image ${loadedImages[imageKey] ? "is-loaded" : ""}`.trim();

  const handleOpenQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // The dialog recorded a view and may have added answers.
    void getQuestionsRefetch({ input: searchFilter });
  };

  const handleOpenImage = (images: string[], index: number) => {
    setImageGallery({ images, index });
  };

  const handleCloseImage = () => {
    setImageGallery(null);
  };

  const handlePreviousImage = () => {
    setImageGallery((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        index: prev.index === 0 ? prev.images.length - 1 : prev.index - 1,
      };
    });
  };

  const handleNextImage = () => {
    setImageGallery((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        index: prev.index === prev.images.length - 1 ? 0 : prev.index + 1,
      };
    });
  };

  const handleSelectImage = (index: number) => {
    setImageGallery((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        index,
      };
    });
  };

  const handlePostAnswer = async () => {
    const commentContent = draftAnswer.trim();
    if (!commentContent || !selectedQuestionId || isPostingAnswer) return;

    setIsPostingAnswer(true);
    try {
      if (!user?._id) throw new Error(Messages.error2);

      await createComment({
        variables: {
          input: {
            commentGroup: CommentGroup.QNA,
            commentRefId: selectedQuestionId,
            commentContent,
          },
        },
      });

      setDraftAnswer("");
      // Oldest first, so a new answer lands on the last page.
      const nextLastPage = Math.max(
        1,
        Math.ceil((answerTotal + 1) / ANSWERS_PER_PAGE),
      );
      if (answerPage !== nextLastPage) setAnswerPage(nextLastPage);
      else await getAnswersRefetch();
      await getQuestionRefetch({ input: selectedQuestionId });
    } catch (err: any) {
      console.log("ERROR, handlePostAnswer:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsPostingAnswer(false);
    }
  };

  const handleAskClose = () => {
    onAskClose?.();
  };

  const handleAskFormReset = () => {
    askForm.images.forEach((img) => URL.revokeObjectURL(img.preview));
    setAskForm({ title: "", body: "", images: [] });
  };

  const handleAskImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const remaining = MAX_QUESTION_IMAGES - askForm.images.length;
    const newFiles = Array.from(files).slice(0, remaining);

    const newImages = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setAskForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Reset input so the same file can be re-selected
    event.target.value = "";
  };

  const handleRemoveAskImage = (index: number) => {
    setAskForm((prev) => {
      const updated = [...prev.images];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return { ...prev, images: updated };
    });
  };

  const handleSubmitQuestion = async () => {
    const questionTitle = askForm.title.trim();
    const questionContent = askForm.body.trim();

    if (!questionTitle || !questionContent || isPostingQuestion) return;

    setIsPostingQuestion(true);
    try {
      if (!user?._id) throw new Error(Messages.error2);

      let questionImages: string[] = [];
      if (askForm.images.length) {
        try {
          const { data } = await imagesUploader({
            variables: {
              files: askForm.images.map((image) => image.file),
              target: "question",
            },
          });
          questionImages = (data?.imagesUploader ?? []).filter(Boolean);
        } catch (err: any) {
          // Images are optional here — a failed upload shouldn't lose the text.
          console.log("ERROR, question imagesUploader:", err.message);
        }
      }

      await createNewQuestion({
        variables: {
          input: {
            questionTitle,
            questionContent,
            ...(questionImages.length ? { questionImages } : {}),
          },
        },
      });

      handleAskFormReset();
      handleAskClose();
      // Newest first — the new question is on page 1.
      if (searchFilter.page !== 1) {
        setSearchFilter((prev) => ({ ...prev, page: 1 }));
      } else {
        await getQuestionsRefetch({ input: searchFilter });
      }
      await sweetBottomSmallSuccessAlert("Your question is live!", 900);
    } catch (err: any) {
      console.log("ERROR, handleSubmitQuestion:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsPostingQuestion(false);
    }
  };

  return (
    <>
      <Stack className="qna-board" ref={boardRef}>
        <TextField
          className="qna-search-field"
          placeholder="Search questions by Title ..."
          value={searchValue}
          onChange={handleSearchChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
          }}
        />

        <Stack className="qna-card-list">
          {questions.length ? (
            questions.map((question, index) => {
              const questionNumber =
                total - (currentPage - 1) * searchFilter.limit - index;
              const questionImages = getQuestionImages(question);

              return (
                <Stack
                  key={question._id}
                  className="qna-question-card"
                  onClick={() => handleOpenQuestion(question._id)}
                >
                  <Stack className="qna-question-votes">
                    <Box className="qna-number-tag">
                      {String(questionNumber).padStart(2, "0")}
                    </Box>
                  </Stack>

                  <Stack className="qna-question-main">
                    <Typography className="qna-question-title">
                      {question.questionTitle}
                    </Typography>

                    <Typography className="qna-question-summary">
                      {getSummaryPreview(question.questionContent)}
                    </Typography>

                    {questionImages.length ? (
                      <Stack className="qna-question-image-row">
                        {questionImages.map((image, imageIndex) => {
                          const imageKey = `${question._id}-list-${imageIndex}`;

                          return (
                            <Box
                              key={`${question._id}-image-${imageIndex}`}
                              className="qna-question-image-thumb"
                            >
                              <img
                                className={getLoadedImageClassName(imageKey)}
                                src={image}
                                alt={`${question.questionTitle} preview ${imageIndex + 1}`}
                                loading="lazy"
                                draggable={false}
                                onLoad={() => handleImageLoad(imageKey)}
                              />
                            </Box>
                          );
                        })}
                      </Stack>
                    ) : null}

                    <Stack className="qna-question-meta">
                      <Stack className="qna-author-group">
                        {renderUserAvatar(
                          getMemberName(question.memberData),
                          getMemberImage(question.memberData),
                        )}
                        <Typography className="qna-author-name">
                          {getMemberName(question.memberData)}
                        </Typography>
                      </Stack>

                      <Typography className="qna-meta-dot">•</Typography>
                      <Typography className="qna-meta-text">
                        {moment(question.createdAt).fromNow()}
                      </Typography>

                      <Typography className="qna-meta-dot">•</Typography>
                      <Box className="qna-meta-icon-text">
                        <ChatBubbleOutlineRoundedIcon />
                        <span>{question.questionAnswers} answers</span>
                      </Box>

                      <Typography className="qna-meta-dot">•</Typography>
                      <Box className="qna-meta-icon-text">
                        <VisibilityOutlinedIcon />
                        <span>{question.questionViews} views</span>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              );
            })
          ) : getQuestionsLoading ? (
            <Stack className="qna-empty-state">
              <CircularProgress size={28} />
            </Stack>
          ) : (
            <Stack className="qna-empty-state">
              <Typography className="qna-empty-title">
                No questions found
              </Typography>
              <Typography className="qna-empty-copy">
                {searchValue.trim()
                  ? "Try another keyword to find the topic you need."
                  : "Be the first to ask the community a question."}
              </Typography>
            </Stack>
          )}
        </Stack>

        {total > searchFilter.limit && (
          <Stack className="qna-pagination-wrap">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, nextPage) =>
                setSearchFilter((prev) => ({ ...prev, page: nextPage }))
              }
              shape="rounded"
              className="qna-pagination"
            />
          </Stack>
        )}
      </Stack>

      <Dialog
        className="qna-dialog"
        open={isDialogOpen && Boolean(selectedQuestion)}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        disableScrollLock
        transitionDuration={{ enter: 320, exit: 220 }}
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-start",
          },
          "& .MuiDialog-paper": {
            marginTop: {
              xs: "64px",
              sm: "88px",
              md: "120px",
            },
            maxHeight: "710px",
          },
        }}
        PaperProps={{ className: "qna-dialog-paper" }}
      >
        {selectedQuestion ? (
          <>
            <Stack className="qna-dialog-header">
              <Stack className="qna-dialog-heading">
                <Typography className="qna-dialog-title">
                  {selectedQuestion.questionTitle}
                </Typography>
              </Stack>

              <IconButton onClick={handleCloseDialog} className="qna-close-btn">
                <CloseRoundedIcon />
              </IconButton>
            </Stack>

            <DialogContent className="qna-dialog-content">
              <Stack className="qna-dialog-section">
                <Stack className="qna-question-card qna-question-detail-card">
                  <Stack className="qna-question-main">
                    <Typography className="qna-question-summary qna-detail-copy">
                      {selectedQuestion.questionContent}
                    </Typography>

                    {selectedQuestionImages.length ? (
                      <Stack className="qna-seledted-question-image-row">
                        {selectedQuestionImages.map((image, index) => {
                          const imageKey = `${selectedQuestion._id}-detail-${index}`;

                          return (
                            <Box
                              key={`${selectedQuestion._id}-image-${index}`}
                              className="qna-seledted-question-image-thumb"
                              onClick={() =>
                                handleOpenImage(selectedQuestionImages, index)
                              }
                            >
                              <img
                                className={getLoadedImageClassName(imageKey)}
                                src={image}
                                alt={`${selectedQuestion.questionTitle} preview ${index + 1}`}
                                loading="lazy"
                                // Without this the browser starts a native image
                                // drag on the smallest pointer drift and never
                                // fires the click that opens the gallery.
                                draggable={false}
                                onLoad={() => handleImageLoad(imageKey)}
                              />
                            </Box>
                          );
                        })}
                      </Stack>
                    ) : null}

                    <Stack className="qna-question-meta">
                      <Stack className="qna-author-group">
                        {renderUserAvatar(
                          getMemberName(selectedQuestion.memberData),
                          getMemberImage(selectedQuestion.memberData),
                        )}
                        <Typography className="qna-author-name">
                          {getMemberName(selectedQuestion.memberData)}
                        </Typography>
                      </Stack>

                      <Typography className="qna-meta-dot">•</Typography>
                      <Typography className="qna-meta-text">
                        {moment(selectedQuestion.createdAt).fromNow()}
                      </Typography>

                      <Typography className="qna-meta-dot">•</Typography>
                      <Box className="qna-meta-icon-text">
                        <VisibilityOutlinedIcon />
                        <span>{selectedQuestion.questionViews} views</span>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              <Stack className="qna-dialog-section" ref={answerSectionRef}>
                <Typography className="qna-section-title">
                  {answerTotal} Answers
                </Typography>

                <Stack className="qna-answer-list">
                  {answers.length === 0 ? (
                    <Stack className="qna-empty-answers">
                      <Box className="qna-empty-icon-wrap">
                        <ChatBubbleOutlineRoundedIcon />
                      </Box>
                      <Typography className="qna-empty-title">
                        No answers yet
                      </Typography>
                      <Typography className="qna-empty-subtitle">
                        Be the first to share your knowledge and help others!
                      </Typography>
                    </Stack>
                  ) : (
                    answers.map((answer) => (
                      <Stack key={answer._id} className="qna-answer-main">
                        <Stack className="qna-question-meta">
                          <Stack className="qna-author-group">
                            {renderUserAvatar(
                              getMemberName(answer.memberData),
                              getMemberImage(answer.memberData),
                            )}
                            <Typography className="qna-author-name">
                              {getMemberName(answer.memberData)}
                            </Typography>
                          </Stack>

                          <Typography className="qna-meta-dot">•</Typography>
                          <Typography className="qna-meta-text">
                            {moment(answer.createdAt).fromNow()}
                          </Typography>
                        </Stack>
                        <Typography
                          component="pre"
                          className="qna-answer-content"
                        >
                          {answer.commentContent}
                        </Typography>
                      </Stack>
                    ))
                  )}
                </Stack>

                {answerTotal > ANSWERS_PER_PAGE ? (
                  <Stack className="qna-answer-pagination-wrap">
                    <Pagination
                      count={answerTotalPages}
                      page={answerPage}
                      onChange={(_, nextPage) => setAnswerPage(nextPage)}
                      shape="rounded"
                      className="qna-pagination"
                    />
                  </Stack>
                ) : null}
              </Stack>

              <Stack className="qna-dialog-section qna-answer-form-section">
                <Typography className="qna-section-title">
                  Your Answer
                </Typography>

                <Stack className="qna-answer-form">
                  {renderUserAvatar(
                    currentUserName,
                    getMemberImage(user),
                    "qna-user-avatar",
                  )}

                  <Stack className="qna-answer-input-wrap">
                    <Box className="qna-answer-input">
                      <textarea
                        rows={4}
                        placeholder="Write your answer..."
                        value={draftAnswer}
                        onChange={(event) => setDraftAnswer(event.target.value)}
                      />
                    </Box>

                    <Stack className="qna-answer-form-footer">
                      <Button
                        className="community-write-btn qna-post-answer-btn"
                        variant="contained"
                        startIcon={<SendRoundedIcon />}
                        onClick={handlePostAnswer}
                        disabled={!draftAnswer.trim() || isPostingAnswer}
                      >
                        Post Answer
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </DialogContent>
          </>
        ) : null}
      </Dialog>

      <Dialog
        className="qna-image-dialog"
        open={Boolean(imageGallery)}
        onClose={handleCloseImage}
        maxWidth="lg"
        transitionDuration={{ enter: 280, exit: 200 }}
        PaperProps={{ className: "qna-image-dialog-paper" }}
      >
        {imageGallery ? (
          <Stack className="qna-image-dialog-body">
            <IconButton
              onClick={handleCloseImage}
              className="qna-image-dialog-close"
            >
              <CloseRoundedIcon />
            </IconButton>

            {imageGallery.images.length > 1 ? (
              <IconButton
                onClick={handlePreviousImage}
                className="qna-image-dialog-nav prev"
              >
                <ArrowBackIosNewRoundedIcon />
              </IconButton>
            ) : null}

            <Stack className="qna-image-stage">
              <img
                key={`${imageGallery.index}-${activeGalleryImage}`}
                className="qna-stage-image"
                src={activeGalleryImage ?? ""}
                alt={`Selected question preview ${imageGallery.index + 1}`}
                draggable={false}
              />
            </Stack>

            {imageGallery.images.length > 1 ? (
              <IconButton
                onClick={handleNextImage}
                className="qna-image-dialog-nav next"
              >
                <ArrowForwardIosRoundedIcon />
              </IconButton>
            ) : null}

            {imageGallery.images.length > 1 ? (
              <Typography className="qna-image-dialog-counter">
                {imageGallery.index + 1} / {imageGallery.images.length}
              </Typography>
            ) : null}

            {imageGallery.images.length > 1 ? (
              <Stack className="qna-image-dialog-thumbs">
                {imageGallery.images.map((image, index) => {
                  const imageKey = `gallery-thumb-${index}-${image}`;

                  return (
                    <Box
                      key={`${image}-${index}`}
                      className={`qna-image-dialog-thumb ${imageGallery.index === index ? "active" : ""}`}
                      onClick={() => handleSelectImage(index)}
                    >
                      <img
                        className={getLoadedImageClassName(imageKey)}
                        src={image}
                        alt={`Gallery thumbnail ${index + 1}`}
                        loading="lazy"
                        draggable={false}
                        onLoad={() => handleImageLoad(imageKey)}
                      />
                    </Box>
                  );
                })}
              </Stack>
            ) : null}
          </Stack>
        ) : null}
      </Dialog>

      {/* Ask Question Dialog */}
      <Dialog
        className="qna-dialog qna-ask-dialog"
        open={isAskOpen}
        onClose={handleAskClose}
        fullWidth
        maxWidth="md"
        disableScrollLock
        transitionDuration={{ enter: 320, exit: 220 }}
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-start",
          },
          "& .MuiDialog-paper": {
            marginTop: {
              xs: "64px",
              sm: "88px",
              md: "120px",
            },
            maxHeight: "780px",
          },
        }}
        PaperProps={{ className: "qna-dialog-paper" }}
      >
        <Stack className="qna-dialog-header">
          <Stack className="qna-dialog-heading">
            <Stack direction="row" alignItems="center" gap={1.2}>
              <QuestionAnswerOutlinedIcon
                sx={{ fontSize: 26, color: "#cb33df" }}
              />
              <Typography className="qna-dialog-title">
                Ask a Question
              </Typography>
            </Stack>
          </Stack>

          <IconButton onClick={handleAskClose} className="qna-close-btn">
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
                  placeholder="What's your question about?"
                  value={askForm.title}
                  onChange={(e) =>
                    setAskForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="qna-ask-title-input"
                />
              </Box>
            </Stack>

            {/* Body Field */}
            <Stack className="qna-ask-field-group">
              <Typography className="qna-ask-label">Description</Typography>
              <Box className="qna-answer-input">
                <textarea
                  rows={6}
                  placeholder="Describe your question in detail..."
                  value={askForm.body}
                  onChange={(e) =>
                    setAskForm((prev) => ({ ...prev, body: e.target.value }))
                  }
                />
              </Box>
            </Stack>

            {/* Image Upload */}
            <Stack className="qna-ask-field-group">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography className="qna-ask-label">Images</Typography>
                <Typography className="qna-ask-image-count">
                  {askForm.images.length} / {MAX_QUESTION_IMAGES}
                </Typography>
              </Stack>

              {/* Image Previews */}
              {askForm.images.length > 0 && (
                <Stack className="qna-ask-image-preview-row">
                  {askForm.images.map((img, index) => {
                    const imageKey = `ask-preview-${index}`;

                    return (
                      <Box
                        key={`ask-img-${index}`}
                        className="qna-ask-image-preview-thumb"
                      >
                        <img
                          className={getLoadedImageClassName(imageKey)}
                          src={img.preview}
                          alt={`Upload preview ${index + 1}`}
                          draggable={false}
                          onLoad={() => handleImageLoad(imageKey)}
                        />
                        <IconButton
                          className="qna-ask-image-remove-btn"
                          onClick={() => handleRemoveAskImage(index)}
                          size="small"
                        >
                          <CloseRoundedIcon />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Stack>
              )}

              {/* Upload Button */}
              {askForm.images.length < MAX_QUESTION_IMAGES && (
                <Button
                  className="qna-ask-upload-btn"
                  variant="outlined"
                  startIcon={<AddPhotoAlternateOutlinedIcon />}
                  onClick={() => askImageInputRef.current?.click()}
                >
                  Add Image
                </Button>
              )}

              <input
                ref={askImageInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleAskImageUpload}
              />
            </Stack>

            {/* Submit Button */}
            <Button
              className="community-write-btn qna-post-answer-btn qna-ask-submit-btn"
              variant="contained"
              startIcon={
                isPostingQuestion ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SendRoundedIcon />
                )
              }
              onClick={handleSubmitQuestion}
              disabled={
                !askForm.title.trim() ||
                !askForm.body.trim() ||
                isPostingQuestion
              }
            >
              {isPostingQuestion ? "Posting..." : "Post Question"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QNACard;
