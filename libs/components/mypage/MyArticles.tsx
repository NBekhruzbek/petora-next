import { ChangeEvent, useEffect, useRef, useState } from "react";
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
import { useQuery, useReactiveVar } from "@apollo/client";
import FreeBoardNewsCard from "../community/FreeBoardNewsCard";
import { userVar } from "@/apollo/store";
import { GET_BOARD_ARTICLES } from "@/apollo/user/query";
import { BoardArticle } from "@/libs/types/board-article/board-article";
import { BoardArticlesInquiry } from "@/libs/types/board-article/board-article.input";
import { Direction } from "@/libs/enums/common.enum";

const ARTICLES_PER_PAGE = 6;

const MyArticles = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement | null>(null);

  /** APOLLO REQUESTS **/

  const searchFilter: BoardArticlesInquiry = {
    page,
    limit: ARTICLES_PER_PAGE,
    sort: "createdAt",
    direction: Direction.DESC,
    search: { memberId: user?._id },
  };

  const {
    data: getBoardArticlesData,
    previousData: getBoardArticlesPreviousData,
    refetch: getBoardArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    skip: !user?._id,
    notifyOnNetworkStatusChange: true,
  });

  /** DERIVED **/

  const getBoardArticlesResult =
    getBoardArticlesData ?? getBoardArticlesPreviousData;
  const articles: BoardArticle[] =
    getBoardArticlesResult?.getBoardArticles?.list ?? [];
  const total: number =
    getBoardArticlesResult?.getBoardArticles?.metaCounter?.[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE));

  /** LIFECYCLES **/

  // Signing in as somebody else has to reload the list rather than keep the
  // previous member's articles on screen.
  useEffect(() => {
    setPage(1);
  }, [user?._id]);

  /** HANDLERS **/

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
          {total} Articles
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
        {articles.map((article) => (
          <FreeBoardNewsCard
            key={article._id}
            article={article}
            onArticleUpdate={() =>
              getBoardArticlesRefetch({ input: searchFilter })
            }
          />
        ))}
      </Box>

      {total > ARTICLES_PER_PAGE && (
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
