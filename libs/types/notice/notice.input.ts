import { NoticeStatus, NoticeType } from "@/libs/enums/notice.enum";
import { Direction } from "@/libs/enums/common.enum";

export interface NoticeInput {
  noticeType: NoticeType;
  noticeStatus: NoticeStatus;
  noticeTitle: string;
  noticeSummary: string;
  noticeContent: string;
  memberId: string;
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
