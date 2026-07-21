import { JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  memberType: string;
  memberStatus: string;
  memberAuthType: string;
  memberPhone: string;
  memberEmail: string;
  memberUserName: string;
  memberFullName?: string;
  memberImage?: string;
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
}
