import { gql } from "@apollo/client";

/***********************************
 *             MEMBER             *
 ***********************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
  mutation UpdateMemberByAdmin($input: MemberUpdate!) {
    updateMemberByAdmin(input: $input) {
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

/***********************************
 *             PRODUCT             *
 ***********************************/

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      _id
      productType
      productStatus
      productPetType
      productName
      productImages
      productShortDesc
      productDesc
      productBrand
      productBenefits
      productPrice
      productDiscount
      productPriceAfterDiscount
      productQuantity
      productLikes
      productViews
      productReviews
      productRating
      productRank
      productSoldTimes
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: ProductUpdate!) {
    updateProduct(input: $input) {
      _id
      productType
      productStatus
      productPetType
      productName
      productImages
      productShortDesc
      productDesc
      productBrand
      productBenefits
      productPrice
      productDiscount
      productPriceAfterDiscount
      productQuantity
      productLikes
      productViews
      productReviews
      productRating
      productRank
      productSoldTimes
      createdAt
      updatedAt
    }
  }
`;

/***********************************
 *              ORDER              *
 ***********************************/

export const UPDATE_ORDER_BY_ADMIN = gql`
  mutation UpdateOrderByAdmin($input: OrderUpdateInput!) {
    updateOrderByAdmin(input: $input) {
      _id
      orderNumber
      orderTotal
      orderDelivery
      orderStatus
      paymentMethod
      deliveryAddress
      receiverName
      receiverPhone
      memberId
      createdAt
      updatedAt
    }
  }
`;

/***********************************
 *             SERVICE             *
 ***********************************/

export const UPDATE_SERVICE_BY_ADMIN = gql`
  mutation UpdateServiceByAdmin($input: ServiceUpdate!) {
    updateServiceByAdmin(input: $input) {
      _id
      serviceType
      serviceTitle
      serviceStatus
      serviceLocation
      servicePrice
      serviceImages
      serviceDurationMinutes
      serviceDescription
      serviceBookings
      serviceLikes
      serviceViews
      serviceReviews
      serviceRating
      serviceRank
      memberId
      createdAt
      updatedAt
    }
  }
`;

/***********************************
 *             ARTICLE             *
 ***********************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdateInput!) {
    updateBoardArticleByAdmin(input: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleLikes
      articleViews
      articleComments
      memberId
      createdAt
      updatedAt
      memberData {
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
  }
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation RemoveBoardArticlesByAdmin($input: String!) {
    removeBoardArticlesByAdmin(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleLikes
      articleViews
      articleComments
      memberId
      createdAt
      updatedAt
      memberData {
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
  }
`;

/***********************************
 *               QNA               *
 ***********************************/

export const UPDATE_QNA_QUESTION_BY_ADMIN = gql`
  mutation UpdateQnaQuestionByAdmin($input: QuestionUpdateInput!) {
    updateQnaQuestionByAdmin(input: $input) {
      _id
      qnaStatus
      questionTitle
      questionContent
      questionImages
      questionLikes
      questionViews
      questionAnswers
      memberId
      createdAt
      updatedAt
      memberData {
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
  }
`;

export const REMOVE_QNA_QUESTION_BY_ADMIN = gql`
  mutation RemoveQnaQuestionByAdmin($input: String!) {
    removeQnaQuestionByAdmin(questionId: $input) {
      _id
      qnaStatus
      questionTitle
      questionContent
      questionImages
      questionLikes
      questionViews
      questionAnswers
      memberId
      createdAt
      updatedAt
      memberData {
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
  }
`;

/***********************************
 *               FAQ               *
 ***********************************/

export const CREATE_NEW_FAQ = gql`
  mutation CreateNewFaq($input: FaqInput!) {
    createNewFaq(input: $input) {
      _id
      faqType
      faqStatus
      faqTitle
      faqContent
      faqViews
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_FAQ = gql`
  mutation UpdateFaq($input: FaqUpdateInput!) {
    updateFaq(input: $input) {
      _id
      faqType
      faqStatus
      faqTitle
      faqContent
      faqViews
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_FAQ_BY_ADMIN = gql`
  mutation RemoveFaqByAdmin($input: String!) {
    removeFaqByAdmin(faqId: $input) {
      _id
      faqType
      faqStatus
      faqTitle
      faqContent
      faqViews
      memberId
      createdAt
      updatedAt
    }
  }
`;

/***********************************
 *             NOTICE              *
 ***********************************/

export const CREATE_NEW_NOTICE = gql`
  mutation CreateNewNotice($input: NoticeInput!) {
    createNewNotice(input: $input) {
      _id
      noticeType
      noticeStatus
      noticeTitle
      noticeSummary
      noticeContent
      noticeViews
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_NOTICE_BY_ADMIN = gql`
  mutation UpdateNoticeByAdmin($input: NoticeUpdateInput!) {
    updateNoticeByAdmin(input: $input) {
      _id
      noticeType
      noticeStatus
      noticeTitle
      noticeSummary
      noticeContent
      noticeViews
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_NOTICE_BY_ADMIN = gql`
  mutation RemoveNoticeByAdmin($input: String!) {
    removeNoticeByAdmin(noticeId: $input) {
      _id
      noticeType
      noticeStatus
      noticeTitle
      noticeSummary
      noticeContent
      noticeViews
      memberId
      createdAt
      updatedAt
    }
  }
`;

/***********************************
 *             COMMENT             *
 ***********************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
  mutation RemoveCommentByAdmin($input: String!) {
    removeCommentByAdmin(commentId: $input) {
      _id
      commentStatus
      commentGroup
      commentContent
      commentLikes
      commentRefId
      memberId
      createdAt
      updatedAt
    }
  }
`;

/***********************************
 *             REVIEW              *
 ***********************************/

export const UPDATE_REVIEW_BY_ADMIN = gql`
  mutation UpdateReviewByAdmin($input: AdminReviewUpdate!) {
    updateReviewByAdmin(input: $input) {
      _id
      reviewStatus
      reviewGroup
      reviewImages
      reviewMessage
      reviewRating
      reviewRefId
      memberId
      createdAt
      updatedAt
    }
  }
`;
