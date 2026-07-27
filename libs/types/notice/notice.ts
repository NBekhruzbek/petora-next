import { NoticeStatus, NoticeType } from "@/libs/enums/notice.enum";
import { TotalCounter } from "../member/member";
import { MeViewed } from "../view/view";

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
  meViewed?: MeViewed[];
}

export interface Notices {
  list: NoticeDetail[];
  metaCounter: TotalCounter[];
  /** Unread across every notice, not just the requested page. */
  unviewedCounter?: TotalCounter[];
}
