import { Direction } from "@/libs/enums/common.enum";
import { QnaStatus } from "@/libs/enums/qna.enum";

export interface QnaInput {
  questionTitle: string;
  questionContent: string;
  questionImages?: string[];
  memberId: string;
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
