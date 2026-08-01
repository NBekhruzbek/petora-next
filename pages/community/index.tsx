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
import { ReactNode, useEffect, useState } from "react";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import QNACard from "@/libs/components/community/QNACard";
import BoardList from "@/libs/components/community/BoardList";
import { ArticleCategory } from "@/libs/enums/boardArticle.enum";
import { useTranslation } from "react-i18next";

// Free Board and News are ArticleCategory values; Q&A is a separate collection
// on the API (getQuestions), so it only exists as a tab key here.
type CategoryKey = ArticleCategory | "QNA";

const categoryMeta: Record<
  CategoryKey,
  {
    labelKey: string;
    descKey: string;
    icon: ReactNode;
  }
> = {
  [ArticleCategory.FREE]: {
    labelKey: "community.free.label",
    descKey: "community.free.desc",
    icon: <ChatBubbleOutlineRoundedIcon />,
  },
  [ArticleCategory.NEWS]: {
    labelKey: "community.news.label",
    descKey: "community.news.desc",
    icon: <FeedOutlinedIcon />,
  },
  QNA: {
    labelKey: "community.qna.label",
    descKey: "community.qna.desc",
    icon: <HelpOutlineRoundedIcon />,
  },
};

const categoryOrder: CategoryKey[] = [
  ArticleCategory.FREE,
  ArticleCategory.NEWS,
  "QNA",
];

const Community: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const rawCategory = router.query.articleCategory;
  const activeCategory: CategoryKey =
    typeof rawCategory === "string" &&
    categoryOrder.includes(rawCategory as CategoryKey)
      ? (rawCategory as CategoryKey)
      : ArticleCategory.FREE;

  const activeMeta = categoryMeta[activeCategory];
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [isWriteOpen, setIsWriteOpen] = useState(false);

  useEffect(() => {
    if (router.query.write === "true") {
      setIsWriteOpen(true);
      void router.replace(
        { pathname: "/community", query: { articleCategory: activeCategory } },
        undefined,
        { shallow: true },
      );
    }
  }, [router.query.write]);

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
                {t("community.brandTitle")}
              </Typography>
              <Typography className="community-brand-subtitle">
                {t("community.brandSubtitle")}
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
                  {t(meta.labelKey)}
                </Button>
              );
            })}
          </Stack>

          <Stack className="community-sidebar-footer">
            <Typography className="community-footer-title">
              {t("community.hubTitle")}
            </Typography>
            <Typography className="community-footer-copy">
              {t("community.copyright")}
            </Typography>
          </Stack>
        </Stack>

        <Stack className="community-content">
          <Stack className="community-content-top">
            <Stack className="community-content-heading">
              <Typography className="community-board-title">
                {t(activeMeta.labelKey).toUpperCase()}
              </Typography>
              <Typography className="community-board-subtitle">
                {t(activeMeta.descKey)}
              </Typography>
            </Stack>

            <Button
              className="community-write-btn"
              variant="contained"
              startIcon={<DrawOutlinedIcon />}
              onClick={
                activeCategory === "QNA"
                  ? () => setIsAskOpen(true)
                  : () => setIsWriteOpen(true)
              }
            >
              {activeCategory === "QNA"
                ? t("community.askQuestion")
                : t("community.write")}
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
                  {t(categoryMeta[category].labelKey)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack className="community-card-flex">
            {activeCategory === "QNA" ? (
              <QNACard
                isAskOpen={isAskOpen}
                onAskClose={() => setIsAskOpen(false)}
              />
            ) : (
              <BoardList
                category={activeCategory}
                isWriteOpen={isWriteOpen}
                onWriteClose={() => setIsWriteOpen(false)}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(Community);
