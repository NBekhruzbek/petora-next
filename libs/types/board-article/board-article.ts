import { ArticleCategory, ArticleStatus } from "@/libs/enums/boardArticle.enum";
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";

export interface BoardArticle {
  _id: string;
  articleCategory: ArticleCategory;
  articleStatus: ArticleStatus;
  articleTitle: string;
  articleContent: string;
  articleImage: string;
  articleLikes: number;
  articleViews: number;
  articleComments: number;
  memberId: string;
  memberData?: Member;
  createdAt: Date;
  updatedAt: Date;

  /** from aggregation */
  meLiked?: MeLiked[];
}

export interface BoardArticles {
  list: BoardArticle[];
  metaCounter: TotalCounter[];
}
