import { FaqStatus, FaqType } from "@/libs/enums/faq.enum";

export interface FaqUpdateInput {
  faqId: string;
  faqType?: FaqType;
  faqStatus?: FaqStatus;
  faqTitle?: string;
  faqContent?: string;
  memberId: string;
}
