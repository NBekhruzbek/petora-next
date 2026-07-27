import { QnaStatus } from "@/libs/enums/qna.enum";

/** `memberId` is set server-side from the auth token — sending it is a schema error. */
export interface QuestionUpdateInput {
  questionId: string;
  qnaStatus?: QnaStatus;
  questionTitle?: string;
  questionContent?: string;
  questionImages?: string[];
}
