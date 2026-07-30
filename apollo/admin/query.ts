import { gql } from "@apollo/client";

/***********************************
 *            DASHBOARD            *
 ***********************************/

// Collection-wide totals. The paged getAll*ByAdmin queries can only report the
// slice they returned, so the dashboard cards need their own aggregate.
export const GET_ADMIN_DASHBOARD_STATS = gql`
  query GetAdminDashboardStats {
    getAdminDashboardStats {
      totalUsers
      totalAgents
      totalProducts
      totalOrders
      pendingOrders
      totalBookings
      pendingBookings
      totalRevenue
    }
  }
`;

/***********************************
 *             MEMBER             *
 ***********************************/

export const GET_ALL_USERS_BY_ADMIN = gql`
  query GetAllUsersByAdmin($input: MembersInquiry!) {
    getAllUsersByAdmin(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ALL_AGENTS_BY_ADMIN = gql`
  query GetAllAgentsByAdmin($input: MembersInquiry!) {
    getAllAgentsByAdmin(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

/***********************************
 *             PRODUCT             *
 ***********************************/

export const GET_ALL_PRODUCTS_BY_ADMIN = gql`
  query GetAllProductsByAdmin($input: ProductsInquiry!) {
    getAllProductsByAdmin(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

/***********************************
 *              ORDER              *
 ***********************************/

export const GET_ALL_ORDERS_BY_ADMIN = gql`
  query GetAllOrdersByAdmin($input: OrdersInquiry!) {
    getAllOrdersByAdmin(input: $input) {
      list {
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
        orderItems {
          _id
          itemQuantity
          itemPrice
          orderId
          productId
          createdAt
          updatedAt
          productData {
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
            createdAt
            updatedAt
          }
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/***********************************
 *             BOOKING             *
 ***********************************/

// The only booking query that is scoped to nobody, and the only one that joins
// the customer and the agent — support needs both sides of the appointment.
export const GET_ALL_BOOKINGS_BY_ADMIN = gql`
  query GetAllBookingsByAdmin($input: BookingsInquiry!) {
    getAllBookingsByAdmin(input: $input) {
      list {
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
        serviceData {
          _id
          serviceType
          serviceTitle
          serviceStatus
          serviceLocation
          servicePrice
          serviceImages
          serviceDurationMinutes
          memberId
        }
        userData {
          _id
          memberUserName
          memberFullName
          memberEmail
          memberPhone
          memberImage
        }
        agentData {
          _id
          memberUserName
          memberFullName
          memberEmail
          memberPhone
          memberImage
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/***********************************
 *              ARTICLE            *
 ***********************************/

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
  query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
    getAllBoardArticlesByAdmin(input: $input) {
      list {
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/***********************************
 *               QNA               *
 ***********************************/

export const GET_ALL_QUESTIONS_BY_ADMIN = gql`
  query GetAllQuestionsByAdmin($input: AllQnaQuestionsInquiry!) {
    getAllQuestionsByAdmin(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

/***********************************
 *        COMMUNITY COUNTS         *
 ***********************************/

// The moderation tabs each show a count, but a board's total is only in that
// board's own metaCounter. Three aliased root fields fetch all of them in one
// round trip instead of mounting three separate queries.
export const GET_COMMUNITY_COUNTS_BY_ADMIN = gql`
  query GetCommunityCountsByAdmin(
    $free: AllBoardArticlesInquiry!
    $news: AllBoardArticlesInquiry!
    $qna: AllQnaQuestionsInquiry!
  ) {
    free: getAllBoardArticlesByAdmin(input: $free) {
      metaCounter {
        total
      }
    }
    news: getAllBoardArticlesByAdmin(input: $news) {
      metaCounter {
        total
      }
    }
    qna: getAllQuestionsByAdmin(input: $qna) {
      metaCounter {
        total
      }
    }
  }
`;

/***********************************
 *               FAQ               *
 ***********************************/

export const GET_ALL_FAQS_BY_ADMIN = gql`
  query GetAllFaqsByAdmin($input: FaqsInquiry!) {
    getAllFaqsByAdmin(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_FAQ_DETAIL_BY_ADMIN = gql`
  query GetFaqDetailByAdmin($input: String!) {
    getFaqDetailByAdmin(faqId: $input) {
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

export const GET_NOTICE_DETAIL_BY_ADMIN = gql`
  query GetNoticeDetailByAdmin($input: String!) {
    getNoticeDetailByAdmin(noticeId: $input) {
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

export const GET_ALL_NOTICES_BY_ADMIN = gql`
  query GetAllNoticesByAdmin($input: NoticeInquiry!) {
    getAllNoticesByAdmin(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;
