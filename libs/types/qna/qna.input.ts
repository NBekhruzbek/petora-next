import { Direction } from "@/libs/enums/common.enum";
import { QnaStatus } from "@/libs/enums/qna.enum";

/** `memberId` is set server-side from the auth token — sending it is a schema error. */
export interface QnaInput {
  questionTitle: string;
  questionContent: string;
  questionImages?: string[];
}
interface QnaISearch {
  text?: string;
  memberId?: string;
}

export interface QnaQuestionInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: QnaISearch;
}

interface AQnaISearch {
  qnaStatus?: QnaStatus;
  text?: string;
  memberId?: string;
}

export interface AllQnaQuestionsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: AQnaISearch;
}
