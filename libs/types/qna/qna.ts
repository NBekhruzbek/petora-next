import { QnaStatus } from "@/libs/enums/qna.enum";
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";

export interface QnaQuestion {
  _id: string;
  qnaStatus: QnaStatus;
  questionTitle: string;
  questionContent: string;
  questionImages?: string[];
  questionLikes: number;
  questionViews: number;
  questionAnswers: number;
  memberId: string;
  memberData?: Member;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation */
  meLiked?: MeLiked[];
}

export interface QnaQuestions {
  list: QnaQuestion[];
  metaCounter: TotalCounter[];
}
