import { ArticleCategory, ArticleStatus } from "@/libs/enums/boardArticle.enum";

/** `memberId` is set server-side from the auth token — sending it is a schema error. */
export interface BoardArticleUpdateInput {
  articleId: string;
  articleCategory?: ArticleCategory;
  articleStatus?: ArticleStatus;
  articleTitle?: string;
  articleContent?: string;
  articleImage?: string;
}
