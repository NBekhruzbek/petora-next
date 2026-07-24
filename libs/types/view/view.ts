import { ViewGroup } from "@/libs/enums/view.enum";

export interface View {
  _id: string;
  viewGroup: ViewGroup;
  memberId: string;
  viewRefId: string;
  createdAt: Date;
  updatedAt: Date;
}
