import { gql } from "@apollo/client";

/***********************************
 *              MEMBER             *
 ***********************************/

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      memberType
      memberStatus
      memberAuthType
      memberPhone
      memberEmail
      memberUserName
      memberFullName
      memberImage
      memberExperience
      memberApproach
      memberAddress
      memberDesc
      memberServices
      memberServiceTypes
      memberCertificates
      memberLanguages
      memberSpecialty
      memberServiceArea
      memberResponseTime
      memberArticles
      memberQuestions
      memberPoints
      memberLikes
      memberViews
      memberReviews
      memberRating
      memberRank
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

export const SIGN_UP = gql`
  mutation Signup($input: MemberInput!) {
    signup(input: $input) {
      _id
      memberType
      memberStatus
      memberAuthType
      memberPhone
      memberEmail
      memberUserName
      memberFullName
      memberImage
      memberExperience
      memberApproach
      memberAddress
      memberDesc
      memberServices
      memberServiceTypes
      memberCertificates
      memberLanguages
      memberSpecialty
      memberServiceArea
      memberResponseTime
      memberArticles
      memberQuestions
      memberPoints
      memberLikes
      memberViews
      memberReviews
      memberRating
      memberRank
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;
