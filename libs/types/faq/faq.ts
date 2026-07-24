import { FaqStatus, FaqType } from "@/libs/enums/faq.enum";
import { TotalCounter } from "../member/member";

export interface FaqDetail {
  _id: string;
  faqType: FaqType;
  faqStatus: FaqStatus;
  faqTitle: string;
  faqContent: string;
  faqViews: number;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Faqs {
  list: FaqDetail[];
  metaCounter: TotalCounter[];
}
