import { QnaStatus } from "@/libs/enums/qna.enum";

export interface QuestionUpdateInput {
  questionId: string;
  qnaStatus?: QnaStatus;
  questionTitle?: string;
  questionContent?: string;
  questionImages?: string[];
  memberId: string;
}
