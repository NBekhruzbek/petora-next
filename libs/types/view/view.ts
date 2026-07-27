import { ViewGroup } from "@/libs/enums/view.enum";

export interface View {
  _id: string;
  viewGroup: ViewGroup;
  memberId: string;
  viewRefId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Empty array means the signed-in member has not opened the target yet. */
export interface MeViewed {
  memberId: string;
  viewRefId: string;
}
