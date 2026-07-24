import { CommentGroup, CommentStatus } from "@/libs/enums/comment.enum";
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";

export interface Comment {
  _id: string;
  commentStatus: CommentStatus;
  commentGroup: CommentGroup;
  commentContent: string;
  commentLikes: number;
  commentRefId: string;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation **/
  memberData?: Member;
  meLiked?: MeLiked[];
}

export interface Comments {
  list: Comment[];
  metaCounter: TotalCounter[];
}
