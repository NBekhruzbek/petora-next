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

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
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

export const UPDATE_MEMBER_BILLING_INFOS = gql`
  mutation UpdateMemberBillingInfos($input: MemberBillingUpdate!) {
    updateMemberBillingInfos(input: $input) {
      memberId
      last4
      cardBrand
      cardHolderName
      expiryMonth
      expiryYear
      companyName
      vatNumber
      address
      city
      zipCode
      countryName
    }
  }
`;

export const LIKE_TARGET_MEMBER = gql`
  mutation LikeTargetMember($input: String!) {
    likeTargetMember(memberId: $input) {
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

export const LIKE_TARGET_PRODUCT = gql`
  mutation LikeTargetProduct($input: String!) {
    likeTargetProduct(productId: $input) {
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

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: [OrderItemInput!]!) {
    createOrder(input: $input) {
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

export const CREATE_SERVICE = gql`
  mutation CreateService($input: ServiceInput!) {
    createService(input: $input) {
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

export const UPDATE_SERVICE = gql`
  mutation UpdateService($input: ServiceUpdate!) {
    updateService(input: $input) {
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

export const LIKE_TARGET_SERVICE = gql`
  mutation LikeTargetService($input: String!) {
    likeTargetService(serviceId: $input) {
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
 *             BOOKING             *
 ***********************************/

export const CREATE_NEW_BOOKING = gql`
  mutation CreateNewBooking($input: BookingInput!) {
    createNewBooking(input: $input) {
      _id
      bookingNumber
      bookingStatus
      bookingPaymentStatus
      bookingDate
      bookingTime
      bookingPrice
      bookingPetType
      bookingPetName
      bookingPetAge
      bookingNote
      bookingAddress
      serviceId
      userId
      agentId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BOOKING_BY_USER = gql`
  mutation UpdateBookingByUser($input: BookingUpdateInput!) {
    updateBookingByUser(input: $input) {
      _id
      bookingNumber
      bookingStatus
      bookingPaymentStatus
      bookingDate
      bookingTime
      bookingPrice
      bookingPetType
      bookingPetName
      bookingPetAge
      bookingNote
      bookingAddress
      serviceId
      userId
      agentId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BOOKING_BY_AGENT = gql`
  mutation UpdateBookingByAgent($input: BookingUpdateInput!) {
    updateBookingByAgent(input: $input) {
      _id
      bookingNumber
      bookingStatus
      bookingPaymentStatus
      bookingDate
      bookingTime
      bookingPrice
      bookingPetType
      bookingPetName
      bookingPetAge
      bookingNote
      bookingAddress
      serviceId
      userId
      agentId
      createdAt
      updatedAt
    }
  }
`;

/***********************************
 *             ARTICLE             *
 ***********************************/

export const CREATE_NEW_ARTICLE = gql`
  mutation CreateNewArticle($input: BoardArticleInput!) {
    createNewArticle(input: $input) {
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

export const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($input: BoardArticleUpdateInput!) {
    updateArticle(input: $input) {
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

export const LIKE_TARGET_BOARD_ARTICLE = gql`
  mutation LikeTargetBoardArticle($input: String!) {
    likeTargetBoardArticle(articleId: $input) {
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
    }
  }
`;

/***********************************
 *               QNA               *
 ***********************************/

export const CREATE_NEW_QNA = gql`
  mutation CreateNewQuestion($input: QnaInput!) {
    createNewQuestion(input: $input) {
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

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($input: QuestionUpdateInput!) {
    updateQuestion(input: $input) {
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

export const LIKE_TARGET_QUESTION = gql`
  mutation LikeTargetQuestion($input: String!) {
    likeTargetQuestion(questionId: $input) {
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
    }
  }
`;

/***********************************
 *             COMMENT             *
 ***********************************/

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
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

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: CommentUpdate!) {
    updateComment(input: $input) {
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

export const LIKE_TARGET_COMMENT = gql`
  mutation LikeTargetComment($input: String!) {
    likeTargetComment(commentId: $input) {
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

export const CREATE_NEW_REVIEW = gql`
  mutation CreateNewReview($input: ReviewInput!) {
    createNewReview(input: $input) {
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

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($input: ReviewUpdate!) {
    updateReview(input: $input) {
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
 *             UPLOADER            *
 ***********************************/

// `target` is the uploads/<target> folder the files are written to, and the
// returned paths ("uploads/<target>/<file>") are what the models store.
export const IMAGES_UPLOADER = gql`
  mutation ImagesUploader($files: [Upload!]!, $target: String!) {
    imagesUploader(files: $files, target: $target)
  }
`;
