import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
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

type QNAAnswer = {
  id: string;
  content: string;
  author: string;
  authorImage?: string;
  timeAgo: string;
};

export type QNAQuestion = {
  id: string;
  title: string;
  summary: string;
  images?: string[];
  views: number;
  author: string;
  authorImage?: string;
  timeAgo: string;
  answers: QNAAnswer[];
};

const QUESTIONS_PER_PAGE = 8;
const ANSWERS_PER_PAGE = 10;
const SUMMARY_PREVIEW_LIMIT = 120;
const MAX_QUESTION_IMAGES = 5;
const CURRENT_USER = {
  name: "You",
  image: undefined as string | undefined,
};

type AskQuestionForm = {
  title: string;
  body: string;
  images: { file: File; preview: string }[];
};

const INITIAL_QNA_QUESTIONS: QNAQuestion[] = [
  {
    id: "qna-1",
    title: "How do I implement authentication in React with TypeScript?",
    summary:
      "I'm building a web app and need to add user authentication. What's the best approach for implementing secure auth in a React + TypeScript project?",
    images: [
      "/img/social-media/insta1.jpg",
      "/img/social-media/insta3.jpg",
      "/img/social-media/insta6.jpg",
    ],
    views: 342,
    author: "John Developer",
    authorImage: "/img/agents/topAgent1.jpg",
    timeAgo: "2h ago",
    answers: [
      {
        id: "qna-1-answer-1",
        content:
          "A clean setup is usually:\n\n1. Use an auth provider such as NextAuth, Clerk, or Auth0.\n2. Keep access tokens off localStorage when possible.\n3. Store user/session state in a small auth context or server session.\n4. Protect routes on both client and server.\n\nIf you're already on Next.js, NextAuth is usually the fastest path.",
        author: "Mina Auth",
        authorImage: "/img/pets/chihuahua-dog.png",
        timeAgo: "1h ago",
      },
      {
        id: "qna-1-answer-2",
        content:
          "If you need custom auth, define a strict `UserSession` type first and centralize refresh-token logic. That prevents auth state from drifting across components.",
        author: "Kai Session",
        authorImage: "/img/agents/topAgent7.jpeg",
        timeAgo: "48m ago",
      },
    ],
  },
  {
    id: "qna-2",
    title: "Best practices for state management in large React applications?",
    summary:
      "Our React app is growing and Redux feels like overkill. What are the modern alternatives for state management? Context API, Zustand, Jotai, or Recoil?",
    views: 567,
    author: "Emily Architect",
    authorImage: "/img/agents/topAgent4.jpg",
    timeAgo: "5h ago",
    answers: [
      {
        id: "qna-2-answer-1",
        content:
          "In 2026, I'd recommend:\n\n- Zustand for most app state\n- TanStack Query for server state\n- Context API for theme/auth or rare global values\n\nZustand stays small, readable, and avoids a lot of reducer boilerplate.",
        author: "David State",
        authorImage: "/img/pets/poodle-dog.png",
        timeAgo: "4h ago",
      },
      {
        id: "qna-2-answer-2",
        content:
          "The biggest win is separating server state from client state. Many teams keep too much data in a global store when it really belongs in request/query caching.",
        author: "Lena Query",
        authorImage: "/img/agents/topAgent8.jpeg",
        timeAgo: "3h ago",
      },
    ],
  },
  {
    id: "qna-3",
    title: "How to optimize React performance for large lists?",
    summary:
      "I have a component rendering 10,000+ items and it's causing performance issues. What's the best way to handle large lists in React?",
    views: 892,
    author: "Alex Performance",
    timeAgo: "1d ago",
    answers: [
      {
        id: "qna-3-answer-1",
        content:
          "Start with list virtualization using `react-window` or `react-virtualized`. That usually fixes the biggest bottleneck right away.\n\nAfter that, inspect unnecessary rerenders and expensive cell content.",
        author: "Sara Virtual",
        timeAgo: "20h ago",
      },
    ],
  },
  {
    id: "qna-4",
    title: "TypeScript generic constraints: When and how to use them?",
    summary:
      "I'm struggling to understand when to use generic constraints in TypeScript. Can someone explain with practical examples?",
    views: 234,
    author: "Chris TypeScript",
    timeAgo: "3h ago",
    answers: [
      {
        id: "qna-4-answer-1",
        content:
          "Use constraints when a generic must guarantee a shape.\n\nExample:\n`function pluckName<T extends { name: string }>(value: T) { return value.name; }`\n\nNow TypeScript knows `name` exists without losing the rest of `T`.",
        author: "Nora TS",
        timeAgo: "2h ago",
      },
    ],
  },
  {
    id: "qna-5",
    title: "Deploying React apps to production: Best practices 2026?",
    summary:
      "What's the current best practice for deploying React applications? Vercel, Netlify, AWS, or self-hosted? Looking for recommendations on CI/CD setup as well.",
    images: ["/img/agents/topAgent1.jpg", "/img/agents/topAgent4.jpg"],
    views: 1234,
    author: "Lisa DevOps",
    timeAgo: "6h ago",
    answers: [
      {
        id: "qna-5-answer-1",
        content:
          "For most teams, Vercel or Netlify is enough. Use preview deployments, environment separation, and automated smoke checks before promoting to production.",
        author: "Ken Release",
        timeAgo: "5h ago",
      },
      {
        id: "qna-5-answer-2",
        content:
          "Choose AWS only when you truly need custom networking, infra ownership, or cost optimization at scale. Otherwise you'll spend more time managing platform details than product.",
        author: "Ivy Cloud",
        timeAgo: "4h ago",
      },
    ],
  },
  {
    id: "qna-6",
    title: "CSS-in-JS vs Tailwind CSS: Which should I choose?",
    summary:
      "Starting a new project and debating between styled-components/emotion vs Tailwind CSS. What are the pros and cons in 2026?",
    views: 1738,
    author: "Maya UI",
    timeAgo: "8h ago",
    answers: [
      {
        id: "qna-6-answer-1",
        content:
          "Tailwind is usually faster for product teams and design systems with lots of repetition. CSS-in-JS still shines when styles are deeply stateful or tied closely to component logic.",
        author: "Derek Styles",
        timeAgo: "7h ago",
      },
    ],
  },
  {
    id: "qna-7",
    title: "What is the cleanest folder structure for a Next.js app?",
    summary:
      "I'm starting a medium-sized Next.js project. How should I organize components, hooks, services, and features so it scales well?",
    views: 421,
    author: "Juno Stack",
    timeAgo: "10h ago",
    answers: [
      {
        id: "qna-7-answer-1",
        content:
          "Feature-based structure scales well:\n\n- `features/` for domain UI + logic\n- `components/` for shared primitives\n- `libs/` for reusable utilities\n- `services/` only when shared integration logic is broad",
        author: "Theo Folder",
        timeAgo: "8h ago",
      },
    ],
  },
  {
    id: "qna-8",
    title: "How do you design APIs for infinite scroll feeds?",
    summary:
      "I'm building a feed experience and want to support infinite scroll. Should I use offset pagination or cursor pagination?",
    images: [
      "/img/social-media/insta4.webp",
      "/img/social-media/insta8.webp",
      "/img/agents/topAgent2.png",
    ],
    views: 688,
    author: "Noah Backend",
    timeAgo: "12h ago",
    answers: [
      {
        id: "qna-8-answer-1",
        content:
          "Cursor pagination is usually better for feeds because inserts won't shift the whole window the way offset pagination does. Use a stable sort key and return `nextCursor`.",
        author: "Rina Data",
        timeAgo: "11h ago",
      },
    ],
  },
  {
    id: "qna-9",
    title:
      "Server Components vs Client Components in Next.js: How do you decide?",
    summary:
      "I'm still not sure when something should stay server-side and when it needs to be a client component. Any practical rules?",
    views: 911,
    author: "Paul Render",
    timeAgo: "14h ago",
    answers: [
      {
        id: "qna-9-answer-1",
        content:
          "Default to server components, then move to client only when you need browser APIs, local interactive state, or event handlers. That keeps bundles smaller and data fetching simpler.",
        author: "Luca App Router",
        timeAgo: "13h ago",
      },
      {
        id: "qna-9-answer-2",
        content:
          "A good smell test: if the component can render from props alone and doesn't need `useState` or `useEffect`, it's often a strong candidate for server.",
        author: "Mika SSR",
        timeAgo: "12h ago",
      },
    ],
  },
  {
    id: "qna-10",
    title: "How should I validate forms in React without too much boilerplate?",
    summary:
      "Formik feels heavy for simple forms. What's a modern, lightweight approach for validation with good TypeScript support?",
    views: 304,
    author: "Ava Forms",
    timeAgo: "16h ago",
    answers: [
      {
        id: "qna-10-answer-1",
        content:
          "React Hook Form + Zod is still one of the best combos. It keeps forms fast, validation explicit, and TypeScript inference clean.",
        author: "Sol Input",
        timeAgo: "15h ago",
      },
    ],
  },
  {
    id: "qna-11",
    title: "What's the right way to handle optimistic updates?",
    summary:
      "I want likes and comments to feel instant, but I also need to recover gracefully when the server rejects the update. How do you usually structure this?",
    views: 532,
    author: "Jade Async",
    timeAgo: "18h ago",
    answers: [
      {
        id: "qna-11-answer-1",
        content:
          "Snapshot the previous cache, update immediately, and rollback on error. TanStack Query's mutation lifecycle makes this very manageable.",
        author: "Neo Cache",
        timeAgo: "16h ago",
      },
    ],
  },
  {
    id: "qna-12",
    title: "How do you make reusable MUI components without over-abstracting?",
    summary:
      "I keep creating wrappers around MUI and later regret how rigid they become. Any rules for deciding when a shared component is worth it?",
    views: 647,
    author: "Hana Design",
    timeAgo: "20h ago",
    answers: [
      {
        id: "qna-12-answer-1",
        content:
          "Abstract behavior and layout patterns, not visual one-offs. If only one screen uses it, keep it local. Once 3+ places need the same API, then promote it.",
        author: "Rafi System",
        timeAgo: "19h ago",
      },
    ],
  },
];

const getAuthorInitial = (author: string) =>
  author.trim().charAt(0).toUpperCase();

const getSummaryPreview = (summary: string) =>
  summary.length > SUMMARY_PREVIEW_LIMIT
    ? `${summary.slice(0, SUMMARY_PREVIEW_LIMIT).trim()}...`
    : summary;

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
  const [questions, setQuestions] = useState(INITIAL_QNA_QUESTIONS);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [answerPage, setAnswerPage] = useState(1);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    INITIAL_QNA_QUESTIONS[0]?.id ?? null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState("");
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
  const previousPageRef = useRef(page);
  const previousAnswerPageRef = useRef(answerPage);

  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredQuestions = questions.filter((question) => {
    if (!normalizedSearch) return true;

    const haystack = [question.title].join(" ").toLowerCase();

    return haystack.includes(normalizedSearch);
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);
  const pagedQuestions = filteredQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE,
  );
  const selectedQuestion =
    questions.find((question) => question.id === selectedQuestionId) ?? null;
  const answerTotalPages = Math.max(
    1,
    Math.ceil((selectedQuestion?.answers.length ?? 0) / ANSWERS_PER_PAGE),
  );
  const currentAnswerPage = Math.min(answerPage, answerTotalPages);
  const pagedAnswers = selectedQuestion
    ? selectedQuestion.answers.slice(
        (currentAnswerPage - 1) * ANSWERS_PER_PAGE,
        currentAnswerPage * ANSWERS_PER_PAGE,
      )
    : [];
  const activeGalleryImage = imageGallery
    ? imageGallery.images[imageGallery.index]
    : null;

  useEffect(() => {
    setPage(1);
  }, [normalizedSearch]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setDraftAnswer("");
    setAnswerPage(1);
  }, [selectedQuestionId, isDialogOpen]);

  useEffect(() => {
    if (answerPage > answerTotalPages) {
      setAnswerPage(answerTotalPages);
    }
  }, [answerPage, answerTotalPages]);

  useEffect(() => {
    if (previousPageRef.current === currentPage) return;

    previousPageRef.current = currentPage;
    boardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentPage]);

  useEffect(() => {
    if (!isDialogOpen || previousAnswerPageRef.current === currentAnswerPage) {
      return;
    }

    previousAnswerPageRef.current = currentAnswerPage;
    answerSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentAnswerPage, isDialogOpen]);

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

  const handlePostAnswer = () => {
    const nextAnswer = draftAnswer.trim();

    if (!nextAnswer || !selectedQuestionId) return;

    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === selectedQuestionId
          ? {
              ...question,
              answers: [
                ...question.answers,
                {
                  id: `${selectedQuestionId}-answer-${Date.now()}`,
                  content: nextAnswer,
                  author: "You",
                  timeAgo: "Just now",
                },
              ],
            }
          : question,
      ),
    );

    const nextAnswerCount =
      (selectedQuestion?.answers.length ?? 0) + 1;
    setAnswerPage(Math.ceil(nextAnswerCount / ANSWERS_PER_PAGE));
    setDraftAnswer("");
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

  const handleSubmitQuestion = () => {
    const trimmedTitle = askForm.title.trim();
    const trimmedBody = askForm.body.trim();

    if (!trimmedTitle || !trimmedBody) return;

    const newQuestion: QNAQuestion = {
      id: `qna-user-${Date.now()}`,
      title: trimmedTitle,
      summary: trimmedBody,
      images: askForm.images.length
        ? askForm.images.map((img) => img.preview)
        : undefined,
      views: 0,
      author: CURRENT_USER.name,
      authorImage: CURRENT_USER.image,
      timeAgo: "Just now",
      answers: [],
    };

    setQuestions((prev) => [newQuestion, ...prev]);
    setPage(1);
    // Don't revoke blob URLs — the new question card still needs them
    setAskForm({ title: "", body: "", images: [] });
    handleAskClose();
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
          {pagedQuestions.length ? (
            pagedQuestions.map((question, index) => {
              const questionNumber = filteredQuestions.length - (currentPage - 1) * QUESTIONS_PER_PAGE - index;

              return (
                <Stack
                  key={question.id}
                  className="qna-question-card"
                  onClick={() => handleOpenQuestion(question.id)}
                >
                  <Stack className="qna-question-votes">
                    <Box className="qna-number-tag">
                      {String(questionNumber).padStart(2, '0')}
                    </Box>
                  </Stack>

                <Stack className="qna-question-main">
                  <Typography className="qna-question-title">
                    {question.title}
                  </Typography>

                  <Typography className="qna-question-summary">
                    {getSummaryPreview(question.summary)}
                  </Typography>

                  {question.images?.length ? (
                    <Stack className="qna-question-image-row">
                      {question.images.slice(0, 3).map((image, index) => {
                        const imageKey = `${question.id}-list-${index}`;

                        return (
                          <Box
                            key={`${question.id}-image-${index}`}
                            className="qna-question-image-thumb"
                          >
                            <img
                              className={getLoadedImageClassName(imageKey)}
                              src={image}
                              alt={`${question.title} preview ${index + 1}`}
                              loading="lazy"
                              onLoad={() => handleImageLoad(imageKey)}
                            />
                          </Box>
                        );
                      })}
                    </Stack>
                  ) : null}

                  <Stack className="qna-question-meta">
                    <Stack className="qna-author-group">
                      {renderUserAvatar(question.author, question.authorImage)}
                      <Typography className="qna-author-name">
                        {question.author}
                      </Typography>
                    </Stack>

                    <Typography className="qna-meta-dot">•</Typography>
                    <Typography className="qna-meta-text">
                      {question.timeAgo}
                    </Typography>

                    <Typography className="qna-meta-dot">•</Typography>
                    <Box className="qna-meta-icon-text">
                      <ChatBubbleOutlineRoundedIcon />
                      <span>{question.answers.length} answers</span>
                    </Box>

                    <Typography className="qna-meta-dot">•</Typography>
                    <Box className="qna-meta-icon-text">
                      <VisibilityOutlinedIcon />
                      <span>{question.views} views</span>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            );
          })
        ) : (
            <Stack className="qna-empty-state">
              <Typography className="qna-empty-title">
                No questions found
              </Typography>
              <Typography className="qna-empty-copy">
                Try another keyword to find the topic you need.
              </Typography>
            </Stack>
          )}
        </Stack>

        {filteredQuestions.length > QUESTIONS_PER_PAGE && (
          <Stack className="qna-pagination-wrap">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, nextPage) => setPage(nextPage)}
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
                  {selectedQuestion.title}
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
                      {selectedQuestion.summary}
                    </Typography>

                    {selectedQuestion.images?.length ? (
                      <Stack className="qna-seledted-question-image-row">
                        {selectedQuestion.images
                          .slice(0, 3)
                          .map((image, index) => {
                            const imageKey = `${selectedQuestion.id}-detail-${index}`;

                            return (
                              <Box
                                key={`${selectedQuestion.id}-image-${index}`}
                                className="qna-seledted-question-image-thumb"
                                onClick={() =>
                                  handleOpenImage(
                                    selectedQuestion.images ?? [],
                                    index,
                                  )
                                }
                              >
                                <img
                                  className={getLoadedImageClassName(imageKey)}
                                  src={image}
                                  alt={`${selectedQuestion.title} preview ${index + 1}`}
                                  loading="lazy"
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
                          selectedQuestion.author,
                          selectedQuestion.authorImage,
                        )}
                        <Typography className="qna-author-name">
                          {selectedQuestion.author}
                        </Typography>
                      </Stack>

                      <Typography className="qna-meta-dot">•</Typography>
                      <Typography className="qna-meta-text">
                        {selectedQuestion.timeAgo}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              <Stack className="qna-dialog-section" ref={answerSectionRef}>
                <Typography className="qna-section-title">
                  {selectedQuestion.answers.length} Answers
                </Typography>

                <Stack className="qna-answer-list">
                  {selectedQuestion.answers.length === 0 ? (
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
                    pagedAnswers.map((answer) => (
                      <Stack key={answer.id} className="qna-answer-main">
                        <Stack className="qna-question-meta">
                          <Stack className="qna-author-group">
                            {renderUserAvatar(
                              answer.author,
                              answer.authorImage,
                            )}
                            <Typography className="qna-author-name">
                              {answer.author}
                            </Typography>
                          </Stack>

                          <Typography className="qna-meta-dot">•</Typography>
                          <Typography className="qna-meta-text">
                            {answer.timeAgo}
                          </Typography>
                        </Stack>
                        <Typography
                          component="pre"
                          className="qna-answer-content"
                        >
                          {answer.content}
                        </Typography>
                      </Stack>
                    ))
                  )}
                </Stack>

                {selectedQuestion.answers.length > ANSWERS_PER_PAGE ? (
                  <Stack className="qna-answer-pagination-wrap">
                    <Pagination
                      count={answerTotalPages}
                      page={currentAnswerPage}
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
                    CURRENT_USER.name,
                    CURRENT_USER.image,
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

                    <Button
                      className="community-write-btn qna-post-answer-btn"
                      variant="contained"
                      startIcon={<SendRoundedIcon />}
                      onClick={handlePostAnswer}
                      disabled={!draftAnswer.trim()}
                    >
                      Post Answer
                    </Button>
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
              startIcon={<SendRoundedIcon />}
              onClick={handleSubmitQuestion}
              disabled={!askForm.title.trim() || !askForm.body.trim()}
            >
              Post Question
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QNACard;
