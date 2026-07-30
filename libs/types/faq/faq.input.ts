import { FaqStatus, FaqType } from "@/libs/enums/faq.enum";
import { Direction } from "@/libs/enums/common.enum";

/** `memberId` is set server-side from the auth token — sending it is a schema error. */
export interface FaqInput {
  faqType: FaqType;
  faqStatus: FaqStatus;
  faqTitle: string;
  faqContent: string;
}

interface FaqISearch {
  faqType?: FaqType;
  text?: string;
}

export interface FaqsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: FaqISearch;
}
