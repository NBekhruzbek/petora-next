import { NoticeStatus, NoticeType } from "@/libs/enums/notice.enum";
import { Direction } from "@/libs/enums/common.enum";

/** `memberId` is set server-side from the auth token — sending it is a schema error. */
export interface NoticeInput {
  noticeType: NoticeType;
  noticeStatus: NoticeStatus;
  noticeTitle: string;
  noticeSummary: string;
  noticeContent: string;
}

interface NoticeISearch {
  text?: string;
}

export interface NoticeInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: NoticeISearch;
}
