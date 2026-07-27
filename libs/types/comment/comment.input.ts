import { CommentGroup } from "@/libs/enums/comment.enum";
import { Direction } from "@/libs/enums/common.enum";

/** `memberId` is set server-side from the auth token — sending it is a schema error. */
export interface CommentInput {
  commentGroup: CommentGroup;
  commentContent: string;
  commentRefId: string;
}

interface CISearch {
  commentRefId: string;
}

export interface CommentsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: CISearch;
}
