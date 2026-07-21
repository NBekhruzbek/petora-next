import { jwtDecode } from "jwt-decode";
import { initializeApollo } from "../../apollo/client";
import { userVar } from "../../apollo/store";
import { CustomJwtPayload } from "../types/customJwtPayload";
import { sweetMixinErrorAlert } from "../sweetAlert";
import { LOGIN, SIGN_UP } from "../../apollo/user/mutation";
import { REACT_APP_API_URL } from "../config";

export function getJwtToken(): any {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") ?? "";
  }
}

export function setJwtToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export const logIn = async (nick: string, password: string): Promise<void> => {
  try {
    const { jwtToken } = await requestJwtToken({ nick, password });

    if (jwtToken) {
      updateStorage({ jwtToken });
      updateUserInfo(jwtToken);
    }
  } catch (err) {
    console.warn("login err", err);
    logOut();
    // throw new Error('Login Err');
  }
};

const requestJwtToken = async ({
  nick,
  password,
}: {
  nick: string;
  password: string;
}): Promise<{ jwtToken: string }> => {
  const apolloClient = await initializeApollo();

  try {
    const result = await apolloClient.mutate({
      mutation: LOGIN,
      variables: {
        input: { memberUserName: nick, memberPassword: password },
      },
      fetchPolicy: "network-only",
    });

    console.log("---------- login ----------");
    const { accessToken } = result?.data?.login;

    return { jwtToken: accessToken };
  } catch (err: any) {
    console.log("request token err", err.graphQLErrors);
    switch (err.graphQLErrors[0].message) {
      case "Definer: login and password do not match":
        await sweetMixinErrorAlert("Please check your password again");
        break;
      case "Definer: user has been blocked!":
        await sweetMixinErrorAlert("User has been blocked!");
        break;
    }
    throw new Error("token error");
  }
};

export const signUp = async (
  nick: string,
  email: string,
  password: string,
  phone: string,
  type: string,
): Promise<void> => {
  try {
    const { jwtToken } = await requestSignUpJwtToken({
      nick,
      email,
      password,
      phone,
      type,
    });

    if (jwtToken) {
      updateStorage({ jwtToken });
      updateUserInfo(jwtToken);
    }
  } catch (err) {
    console.warn("login err", err);
    logOut();
    // throw new Error('Login Err');
  }
};

const requestSignUpJwtToken = async ({
  nick,
  email,
  password,
  phone,
  type,
}: {
  nick: string;
  email: string;
  password: string;
  phone: string;
  type: string;
}): Promise<{ jwtToken: string }> => {
  const apolloClient = await initializeApollo();

  try {
    const result = await apolloClient.mutate({
      mutation: SIGN_UP,
      variables: {
        input: {
          memberUserName: nick,
          memberEmail: email,
          memberPassword: password,
          memberPhone: phone,
          memberType: type,
        },
      },
      fetchPolicy: "network-only",
    });

    console.log("---------- login ----------");
    const { accessToken } = result?.data?.signup;

    return { jwtToken: accessToken };
  } catch (err: any) {
    console.log("request token err", err.graphQLErrors);
    switch (err.graphQLErrors[0].message) {
      case "Definer: login and password do not match":
        await sweetMixinErrorAlert("Please check your password again");
        break;
      case "Definer: user has been blocked!":
        await sweetMixinErrorAlert("User has been blocked!");
        break;
    }
    throw new Error("token error");
  }
};

export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
  setJwtToken(jwtToken);
  window.localStorage.setItem("login", Date.now().toString());
};

export const updateUserInfo = (jwtToken: any) => {
  if (!jwtToken) return false;

  const claims = jwtDecode<CustomJwtPayload>(jwtToken);
  userVar({
    _id: claims._id ?? "",
    memberType: claims.memberType ?? "",
    memberStatus: claims.memberStatus ?? "",
    memberAuthType: claims.memberAuthType ?? "",
    memberPhone: claims.memberPhone ?? "",
    memberEmail: claims.memberEmail ?? "",
    memberUserName: claims.memberUserName ?? "",
    memberFullName: claims.memberFullName ?? "",
    memberImage: claims.memberImage
      ? `${REACT_APP_API_URL}/${claims.memberImage}`
      : "/img/profile/defaultUser.png",
    memberExperience: claims.memberExperience ?? "",
    memberApproach: claims.memberApproach ?? "",
    memberAddress: claims.memberAddress ?? "",
    memberDesc: claims.memberDesc ?? "",
    memberServices: claims.memberServices,
    memberServiceTypes: claims.memberServiceTypes ?? [""],
    memberCertificates: claims.memberCertificates ?? [""],
    memberLanguages: claims.memberLanguages ?? "",
    memberSpecialty: claims.memberSpecialty ?? "",
    memberServiceArea: claims.memberServiceArea ?? [""],
    memberResponseTime: claims.memberResponseTime ?? "",
    memberRank: claims.memberRank,
    memberArticles: claims.memberArticles,
    memberQuestions: claims.memberQuestions,
    memberPoints: claims.memberPoints,
    memberLikes: claims.memberLikes,
    memberViews: claims.memberViews,
    memberReviews: claims.memberReviews,
    memberRating: claims.memberRating,
    memberWarnings: claims.memberWarnings,
    memberBlocks: claims.memberBlocks,
  });
};

export const logOut = () => {
  deleteStorage();
  deleteUserInfo();
  window.location.reload();
};

const deleteStorage = () => {
  localStorage.removeItem("accessToken");
  window.localStorage.setItem("logout", Date.now().toString());
};

const deleteUserInfo = () => {
  userVar({
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
    memberRank: 0,
    memberArticles: 0,
    memberQuestions: 0,
    memberPoints: 0,
    memberLikes: 0,
    memberViews: 0,
    memberReviews: 0,
    memberRating: 0,
    memberWarnings: 0,
    memberBlocks: 0,
  });
};
