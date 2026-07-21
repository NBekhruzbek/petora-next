import { ChangeEvent, useRef, useState } from "react";
import {
  Box,
  Button,
  Pagination,
  PaginationItem,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import FreeBoardNewsCard, {
  FreeBoardNewsCardType,
} from "../community/FreeBoardNewsCard";

const MY_ARTICLES: FreeBoardNewsCardType[] = [
  {
    id: "ma-1",
    title: "5 Essential Tips for First-Time Dog Owners",
    description:
      "Bringing home a new dog is one of life's most rewarding experiences, but it comes with real responsibilities. From establishing a feeding schedule to introducing your puppy to other pets, these five tips will help you navigate the first few weeks with confidence and keep your furry friend healthy and happy.",
    date: "May 10, 2026",
    image: "/img/services/grooming.jpg",
    views: 3420,
    likes: 218,
    author: "You",
    authorImage: "/img/profile/defaultUser.png",
    comments: [
      {
        id: "c1",
        content:
          "Really helpful article! My puppy settled in so much faster after I followed the feeding schedule tip.",
        author: "Sarah K.",
        authorImage: "/img/avatar/member-1.png",
        timeAgo: "2 days ago",
      },
      {
        id: "c2",
        content: "Great read. Would love a follow-up on crate training.",
        author: "James L.",
        timeAgo: "1 day ago",
      },
    ],
  },
  {
    id: "ma-2",
    title: "How to Keep Your Cat Calm During Vet Visits",
    description:
      "Vet anxiety is one of the most common issues cat owners face. Learn how carrier training, calming sprays, and the right appointment timing can turn a stressful outing into a much smoother experience — for both you and your cat.",
    date: "Apr 28, 2026",
    image: "/img/services/veterinary.png",
    views: 1875,
    likes: 142,
    author: "You",
    authorImage: "/img/profile/.png",
    comments: [
      {
        id: "c3",
        content:
          "The carrier training tip was a game changer for me. My cat actually walks in by herself now!",
        author: "Emily R.",
        authorImage: "/img/avatar/member-1.png",
        timeAgo: "3 days ago",
      },
    ],
  },
  {
    id: "ma-3",
    title: "The Benefits of Professional Dog Walking Services",
    description:
      "Regular walks are critical for a dog's physical and mental wellbeing — but busy schedules often get in the way. Discover why hiring a professional dog walker can be a worthwhile investment, and what to look for when choosing the right service for your pup.",
    date: "Apr 15, 2026",
    image: "/img/services/walking.jpg",
    views: 2640,
    likes: 196,
    author: "You",
    authorImage: "/img/profile/.png",
    comments: [],
  },
  {
    id: "ma-4",
    title: "Understanding Pet Boarding: What to Expect",
    description:
      "Leaving your pet behind while you travel can feel stressful. This guide breaks down the different types of boarding options — from kennels to home boarding — and explains how to prepare your pet for their stay so they feel comfortable and secure.",
    date: "Apr 2, 2026",
    image: "/img/services/boarding.png",
    views: 1130,
    likes: 87,
    author: "You",
    authorImage: "/img/profile/defaultUser.png",
    comments: [
      {
        id: "c4",
        content:
          "I had no idea home boarding was an option. This really helped me feel better about leaving my dog.",
        author: "Tom B.",
        timeAgo: "5 days ago",
      },
      {
        id: "c5",
        content: "What questions should I ask a new boarder?",
        author: "Nina S.",
        authorImage: "/img/avatar/member-1.png",
        timeAgo: "4 days ago",
      },
    ],
  },
  {
    id: "ma-5",
    title: "Grooming Your Pet at Home: A Step-by-Step Guide",
    description:
      "Regular grooming keeps your pet looking great and helps you spot health issues early. This guide covers brushing techniques, safe bathing practices, nail trimming, and ear cleaning — everything you need to maintain a healthy coat between professional appointments.",
    date: "Mar 20, 2026",
    image: "/img/services/day-care.jpg",
    views: 4810,
    likes: 335,
    author: "You",
    authorImage: "/img/profile/defaultUser.png",
    comments: [
      {
        id: "c6",
        content:
          "Finally a guide that explains how to hold the clippers properly. My dog no longer dreads bath day!",
        author: "Lucy M.",
        authorImage: "/img/avatar/member-1.png",
        timeAgo: "1 week ago",
      },
    ],
  },
  {
    id: "ma-6",
    title: "Training Your Dog: Positive Reinforcement Basics",
    description:
      "Positive reinforcement is the gold standard in modern dog training. Learn how reward timing, consistency, and the right treats can help your dog master basic commands, break bad habits, and strengthen the bond between the two of you.",
    date: "Mar 5, 2026",
    image: "/img/services/training.jpg",
    views: 2290,
    likes: 174,
    author: "You",
    authorImage: "/img/profile/defaultUser.png",
    comments: [],
  },
];

const ARTICLES_PER_PAGE = 6;

const MyArticles = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement | null>(null);

  const totalPages = Math.max(
    1,
    Math.ceil(MY_ARTICLES.length / ARTICLES_PER_PAGE),
  );
  const start = (page - 1) * ARTICLES_PER_PAGE;
  const pagedArticles = MY_ARTICLES.slice(start, start + ARTICLES_PER_PAGE);

  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    if (!topRef.current) return;
    const scrollTarget =
      window.scrollY + topRef.current.getBoundingClientRect().top - 210;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
  };

  return (
    <Stack className="my-articles-container" ref={topRef}>
      <Stack className="my-articles-toolbar">
        <Typography className="my-articles-count">
          {MY_ARTICLES.length} Articles
        </Typography>
        <Button
          className="btn-write-article"
          variant="contained"
          startIcon={<DrawOutlinedIcon />}
          onClick={() =>
            void router.push("/community?articleCategory=FREE&write=true")
          }
        >
          Write Article
        </Button>
      </Stack>

      <Box className="my-articles-grid">
        {pagedArticles.map((article) => (
          <FreeBoardNewsCard key={article.id} item={article} />
        ))}
      </Box>

      {MY_ARTICLES.length > ARTICLES_PER_PAGE && (
        <Stack className="pagination-section">
          <Pagination
            count={totalPages}
            page={page}
            renderItem={(item) => (
              <PaginationItem
                components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
                color="primary"
              />
            )}
            onChange={handlePageChange}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default MyArticles;
