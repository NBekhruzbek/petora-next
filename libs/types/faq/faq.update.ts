import { FaqStatus, FaqType } from "@/libs/enums/faq.enum";

/** `memberId` is set server-side from the auth token — sending it is a schema error. */
export interface FaqUpdateInput {
  faqId: string;
  faqType?: FaqType;
  faqStatus?: FaqStatus;
  faqTitle?: string;
  faqContent?: string;
}
