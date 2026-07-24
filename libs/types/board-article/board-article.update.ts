import { ArticleCategory, ArticleStatus } from "@/libs/enums/boardArticle.enum";

export interface BoardArticleUpdateInput {
  articleId: string;
  articleCategory?: ArticleCategory;
  articleStatus?: ArticleStatus;
  articleTitle?: string;
  articleContent?: string;
  articleImage?: string;
  memberId: string;
}
