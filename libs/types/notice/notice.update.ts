import { NoticeStatus, NoticeType } from "@/libs/enums/notice.enum";

/** `memberId` is set server-side from the auth token — sending it is a schema error. */
export interface NoticeUpdateInput {
  noticeId: string;
  noticeType?: NoticeType;
  noticeStatus?: NoticeStatus;
  noticeTitle?: string;
  noticeSummary?: string;
  noticeContent?: string;
}
