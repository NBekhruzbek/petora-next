import {
  MemberAuthType,
  MemberStatus,
  MemberType,
} from "@/libs/enums/member.enum";
import { ServiceLocation, ServiceType } from "@/libs/enums/service.enum";
import { Direction } from "@/libs/enums/common.enum";

export interface MemberInput {
  memberUserName: string;
  memberEmail: string;
  memberPhone: string;
  memberPassword: string;
  memberType?: MemberType;
  memberAuthType?: MemberAuthType;
}

export interface LoginInput {
  memberUserName: string;
  memberPassword: string;
}

interface AISearch {
  memberId?: string;
  memberServiceTypes?: ServiceType[];
  memberServiceArea?: ServiceLocation[];
  text?: string;
}

export interface AgentsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: AISearch;
}

interface MISearch {
  memberStatus?: MemberStatus;
  text?: string;
}

export interface MembersInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: MISearch;
}
