import { NoticeStatus, NoticeType } from "@/libs/enums/notice.enum";

export interface NoticeUpdateInput {
  noticeId: string;
  noticeType?: NoticeType;
  noticeStatus?: NoticeStatus;
  noticeTitle?: string;
  noticeSummary?: string;
  noticeContent?: string;
  memberId: string;
}
