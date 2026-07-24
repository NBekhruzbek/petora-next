import { FaqStatus, FaqType } from "@/libs/enums/faq.enum";
import { Direction } from "@/libs/enums/common.enum";

export interface FaqInput {
  faqType: FaqType;
  faqStatus: FaqStatus;
  faqTitle: string;
  faqContent: string;
  memberId: string;
}

interface FaqISearch {
  text?: string;
}

export interface FaqsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: FaqISearch;
}
