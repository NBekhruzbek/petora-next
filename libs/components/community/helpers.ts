import { REACT_APP_API_URL } from "@/libs/config";

/** The API stores relative paths ("uploads/<target>/<file>"), never full URLs. */
export const toServerImage = (path?: string) =>
  path ? `${REACT_APP_API_URL}/${path}` : undefined;

export const FALLBACK_ARTICLE_IMAGE = "/img/headers/community-header.png";

export const getArticleImage = (articleImage?: string) =>
  toServerImage(articleImage) ?? FALLBACK_ARTICLE_IMAGE;

type MemberLike = {
  memberFullName?: string;
  memberUserName?: string;
  memberImage?: string;
};

export const getMemberName = (member?: MemberLike) =>
  member?.memberFullName || member?.memberUserName || "Unknown member";

export const getMemberImage = (member?: MemberLike) =>
  toServerImage(member?.memberImage);
