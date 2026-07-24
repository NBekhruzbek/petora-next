import { ReviewGroup, ReviewStatus } from "@/libs/enums/review.enum";
import { Member, TotalCounter } from "../member/member";

export interface Review {
  _id: string;
  reviewStatus: ReviewStatus;
  reviewGroup: ReviewGroup;
  reviewImages?: string[];
  reviewMessage?: string;
  reviewRating: number;
  reviewRefId: string;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation */
  memberData?: Member;
}

export interface RatingCount {
  star: number;
  count: number;
  percentage: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: RatingCount[];
}

export interface Reviews {
  list: Review[];
  metaCounter: TotalCounter[];
  stats: ReviewStats;
}
