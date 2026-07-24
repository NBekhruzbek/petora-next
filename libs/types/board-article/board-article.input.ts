import { ArticleCategory, ArticleStatus } from "@/libs/enums/boardArticle.enum";
import { Direction } from "@/libs/enums/common.enum";

export interface BoardArticleInput {
  articleCategory: ArticleCategory;
  articleTitle: string;
  articleContent: string;
  articleImage: string;
  memberId?: string;
}

interface BAISearch {
  articleCategory?: ArticleCategory;
  text?: string;
  memberId?: string;
}

export interface BoardArticlesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: BAISearch;
}

interface ABAISearch {
  articleStatus?: ArticleStatus;
  articleCategory?: ArticleCategory;
  text?: string;
}

export interface AllBoardArticlesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: ABAISearch;
}
