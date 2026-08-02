import { makeVar } from "@apollo/client";

import { CustomJwtPayload } from "../libs/types/customJwtPayload";
import { BasketItem } from "../libs/types/basket/basket";
import { ColorScheme } from "../libs/theme";

export const themeVar = makeVar<ColorScheme>("light");

export const basketVar = makeVar<BasketItem[]>([]);

export const userVar = makeVar<CustomJwtPayload>({
  _id: "",
  memberType: "",
  memberStatus: "",
  memberAuthType: "",
  memberPhone: "",
  memberEmail: "",
  memberUserName: "",
  memberFullName: "",
  memberImage: "",
  memberExperience: "",
  memberApproach: "",
  memberAddress: "",
  memberDesc: "",
  memberServices: 0,
  memberServiceTypes: [""],
  memberCertificates: [""],
  memberLanguages: "",
  memberSpecialty: "",
  memberServiceArea: [""],
  memberResponseTime: "",
  memberArticles: 0,
  memberQuestions: 0,
  memberPoints: 0,
  memberLikes: 0,
  memberViews: 0,
  memberReviews: 0,
  memberRating: 0,
  memberRank: 0,
  memberWarnings: 0,
  memberBlocks: 0,
});

// @ts-ignore
export const socketVar = makeVar<WebSocket>();
