import {
  MemberAuthType,
  MemberStatus,
  MemberType,
} from "@/libs/enums/member.enum";
import { MeLiked } from "../like/like";

export interface Member {
  _id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberAuthType: MemberAuthType;
  memberPhone: string;
  memberEmail: string;
  memberUserName: string;
  memberFullName?: string;
  memberPassword?: string;
  memberImage: string;
  memberExperience?: string;
  memberApproach?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberServices: number;
  memberServiceTypes?: string[];
  memberCertificates: string[];
  memberLanguages?: string;
  memberSpecialty?: string;
  memberServiceArea?: string[];
  memberResponseTime?: string;
  memberArticles: number;
  memberQuestions: number;
  memberPoints: number;
  memberLikes: number;
  memberViews: number;
  memberReviews: number;
  memberRating: number;
  memberRank: number;
  memberWarnings: number;
  memberBlocks: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  accessToken?: string;
  /** from aggregation */
  meLiked?: MeLiked[];
}

export interface TotalCounter {
  total: number;
}

export interface Members {
  list: Member[];
  metaCounter: TotalCounter[];
}

export interface MemberBillingInfos {
  memberId: string;
  billingKey: string;
  last4?: string;
  cardBrand?: string;
  cardHolderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  companyName?: string;
  vatNumber?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  countryName?: string;
  deletedAt?: Date;
}
