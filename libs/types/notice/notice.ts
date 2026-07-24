import { NoticeStatus, NoticeType } from "@/libs/enums/notice.enum";
import { TotalCounter } from "../member/member";

export interface NoticeDetail {
  _id: string;
  noticeType: NoticeType;
  noticeStatus: NoticeStatus;
  noticeTitle: string;
  noticeSummary: string;
  noticeContent: string;
  noticeViews: number;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notices {
  list: NoticeDetail[];
  metaCounter: TotalCounter[];
}
