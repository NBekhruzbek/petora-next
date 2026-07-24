import { ReviewGroup } from "@/libs/enums/review.enum";
import { Direction } from "@/libs/enums/common.enum";

export interface ReviewInput {
  reviewRefId: string;
  reviewGroup: ReviewGroup;
  reviewImages?: string[];
  reviewMessage?: string;
  reviewRating: number;
  memberId?: string;
}

interface RISearch {
  reviewGroup: ReviewGroup;
  reviewRefId: string;
}

export interface ReviewsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: RISearch;
}
