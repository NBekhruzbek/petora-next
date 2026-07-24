import { MemberStatus, MemberType } from "@/libs/enums/member.enum";

export interface MemberUpdate {
  _id: string;
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberPhone?: string;
  memberEmail?: string;
  memberUserName?: string;
  memberFullName?: string;
  memberPassword?: string;
  memberImage?: string;
  memberExperience?: string;
  memberApproach?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberServices?: number;
  memberServiceTypes?: string[];
  memberCertificates?: string[];
  memberLanguages?: string;
  memberSpecialty?: string;
  memberServiceArea?: string[];
  memberResponseTime?: string;
  deletedAt?: Date;
}

export interface MemberBillingUpdate {
  memberId: string;
  /** BILLING ADDRESS */
  companyName?: string;
  vatNumber?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  countryName?: string;
  deletedAt?: Date;
}
