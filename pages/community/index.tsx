import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import FreeBoardNewsCard from "@/libs/components/community/FreeBoardNewsCard";

type CategoryKey = "FREE" | "NEWS" | "QNA";

type CommunityPost = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  views: number;
  likes: number;
};

const categoryMeta: Record<
  CategoryKey,
  {
    label: string;
    description: string;
    icon: ReactNode;
  }
> = {
  FREE: {
    label: "Free Board",
    description:
      "Share your thoughts, ideas, and experiences with the community",
    icon: <ChatBubbleOutlineRoundedIcon />,
  },
  NEWS: {
    label: "News",
    description: "Stay updated with the latest stories and announcements",
    icon: <FeedOutlinedIcon />,
  },
  QNA: {
    label: "Q&A",
    description: "Ask questions and get helpful answers from other members",
    icon: <HelpOutlineRoundedIcon />,
  },
};

const communityPosts: Record<CategoryKey, CommunityPost[]> = {
  FREE: [
    {
      id: "free-1",
      title: "Building a Modern Tech Community: Best Practices",
      description:
        "Explore the essential strategies for creating an engaging and supportive tech community that keeps members participating over time.",
      date: "Mar 28, 2026",
      image: "/img/services/training.jpg",
      views: 1248,
      likes: 89,
    },
    {
      id: "free-2",
      title: "Effective Workspace Collaboration Techniques",
      description:
        "Learn how to maximize productivity and creativity through better team collaboration in modern hybrid workspaces.",
      date: "Mar 27, 2026",
      image: "/img/services/grooming.jpg",
      views: 892,
      likes: 64,
    },
    {
      id: "free-3",
      title: "Networking Strategies for Business Growth",
      description:
        "Discover proven networking strategies that help build meaningful business relationships and drive long-term growth.",
      date: "Mar 25, 2026",
      image: "/img/services/day-care.jpg",
      views: 1567,
      likes: 98,
    },
    {
      id: "free-4",
      title: "Remote Study Session Setup for Better Focus",
      description:
        "A practical guide for setting up a calm, efficient online study routine with friends and accountability partners.",
      date: "Mar 21, 2026",
      image: "/img/agents/topAgent8.jpeg",
      views: 743,
      likes: 51,
    },
  ],
  NEWS: [
    {
      id: "news-1",
      title: "Community Platform Update Released This Week",
      description:
        "We have rolled out a cleaner browsing experience, improved board categories, and better article discovery features.",
      date: "Apr 01, 2026",
      image: "/img/headers/community-header.png",
      views: 954,
      likes: 44,
    },
    {
      id: "news-2",
      title: "Spring Creator Meetup Announced for Seoul Members",
      description:
        "Our next in-person networking meetup is now open for signups, with sessions for creators, founders, and remote teams.",
      date: "Mar 29, 2026",
      image: "/img/services/day-care.jpg",
      views: 1411,
      likes: 73,
    },
    {
      id: "news-3",
      title: "Editorial Picks Feature Added to Recommendation Board",
      description:
        "A new curated recommendation label will help members discover standout posts more quickly.",
      date: "Mar 24, 2026",
      image: "/img/services/walking.jpg",
      views: 801,
      likes: 39,
    },
  ],
  QNA: [
    {
      id: "qna-1",
      title: "How do you structure a community post for better engagement?",
      description:
        "Members share examples of strong titles, better formatting, and ways to encourage more thoughtful replies.",
      date: "Mar 30, 2026",
      image: "/img/services/boarding.png",
      views: 602,
      likes: 27,
    },
    {
      id: "qna-2",
      title: "Best tools for collaborative writing with a small team?",
      description:
        "Looking for simple workflows that support comments, version history, and quick content reviews.",
      date: "Mar 26, 2026",
      image: "/img/services/grooming.jpg",
      views: 847,
      likes: 35,
    },
    {
      id: "qna-3",
      title: "How often should a recommendation board be moderated?",
      description:
        "Community managers discuss moderation cadence, quality control, and how to keep recommendations useful.",
      date: "Mar 19, 2026",
      image: "/img/services/training.jpg",
      views: 519,
      likes: 18,
    },
  ],
};

const categoryOrder: CategoryKey[] = ["FREE", "NEWS", "QNA"];

const Community: NextPage = () => {
  const router = useRouter();
  const rawCategory = router.query.articleCategory;
  const activeCategory: CategoryKey =
    typeof rawCategory === "string" &&
    categoryOrder.includes(rawCategory as CategoryKey)
      ? (rawCategory as CategoryKey)
      : "FREE";

  const activeMeta = categoryMeta[activeCategory];
  const activePosts = communityPosts[activeCategory];

  const handleCategoryChange = (category: CategoryKey) => {
    void router.push(
      {
        pathname: "/community",
        query: { articleCategory: category },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <Stack className="community-page">
      <Stack className="container">
        <Stack className="community-sidebar">
          <Stack className="community-sidebar-brand">
            <Box className="community-brand-icon">
              <PeopleAltOutlinedIcon />
            </Box>
            <Stack className="community-brand-copy">
              <Typography className="community-brand-title">
                Community
              </Typography>
              <Typography className="community-brand-subtitle">
                Connect &amp; Share
              </Typography>
            </Stack>
          </Stack>

          <Stack className="community-category-list">
            {categoryOrder.map((category) => {
              const meta = categoryMeta[category];
              const isActive = activeCategory === category;

              return (
                <Button
                  key={category}
                  className={`community-category-btn ${isActive ? "active" : ""}`}
                  onClick={() => handleCategoryChange(category)}
                  startIcon={meta.icon}
                >
                  {meta.label}
                </Button>
              );
            })}
          </Stack>

          <Stack className="community-sidebar-footer">
            <Typography className="community-footer-title">
              Community Hub
            </Typography>
            <Typography className="community-footer-copy">
              © 2026 All rights reserved
            </Typography>
          </Stack>
        </Stack>

        <Stack className="community-content">
          <Stack className="community-content-top">
            <Stack className="community-content-heading">
              <Typography className="community-board-title">
                {activeMeta.label.toUpperCase()}
              </Typography>
              <Typography className="community-board-subtitle">
                {activeMeta.description}
              </Typography>
            </Stack>

            <Button
              className="community-write-btn"
              variant="contained"
              startIcon={<DrawOutlinedIcon />}
            >
              {activeCategory === "QNA" ? "Ask Question" : "Write"}
            </Button>
          </Stack>

          <Stack className="community-mobile-filter">
            <TextField
              select
              size="small"
              value={activeCategory}
              onChange={(event) =>
                handleCategoryChange(event.target.value as CategoryKey)
              }
            >
              {categoryOrder.map((category) => (
                <MenuItem key={category} value={category}>
                  {categoryMeta[category].label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack className="community-card-flex">
            {activePosts.map((post) => (
              <FreeBoardNewsCard key={post.id} item={post} />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(Community);
