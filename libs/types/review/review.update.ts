import { ReviewStatus } from "@/libs/enums/review.enum";

export interface ReviewUpdate {
  reviewId: string;
  reviewMessage?: string;
  reviewImages?: string[];
  reviewRating?: number;
}

export interface AdminReviewUpdate {
  reviewId: string;
  reviewStatus?: ReviewStatus;
}
