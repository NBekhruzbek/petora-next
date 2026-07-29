import { gql } from "@apollo/client";

/***********************************
 *             MEMBER             *
 ***********************************/

export const GET_MEMBER = gql`
  query GetMember($input: String!) {
    getMember(memberId: $input) {
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

export const GET_MEMBER_BILLING_INFOS = gql`
  query GetMemberBillingInfos {
    getMemberBillingInfos {
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

export const GET_AGENTS = gql`
  query GetAgents($input: AgentsInquiry!) {
    getAgents(input: $input) {
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
 *             PRODUCT             *
 ***********************************/

export const GET_PRODUCT = gql`
  query GetProduct($input: String!) {
    getProduct(productId: $input) {
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
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($input: ProductsInquiry!) {
    getProducts(input: $input) {
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

export const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($input: String!) {
    getRelatedProducts(productId: $input) {
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
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_FAVORITE_PRODUCTS = gql`
  query GetFavoriteProducts($input: OrdinaryInquiry!) {
    getFavoriteProducts(input: $input) {
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
 *              ORDER              *
 ***********************************/

export const GET_MY_ORDERS = gql`
  query GetMyOrders($input: OrdersInquiry!) {
    getMyOrders(input: $input) {
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
 *             SERVICE             *
 ***********************************/

export const GET_SERVICE = gql`
  query GetService($input: String!) {
    getService(serviceId: $input) {
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
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_ALL_SERVICES = gql`
  query GetAllServices($input: ServicesInquiry!) {
    getAllServices(input: $input) {
      list {
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

export const GET_RELATED_SERVICES = gql`
  query GetRelatedServices($input: String!) {
    getRelatedServices(serviceId: $input) {
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
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_FAVORITE_SERVICES = gql`
  query GetFavoriteServices($input: ServiceOrdinaryInquiry!) {
    getFavoriteServices(input: $input) {
      list {
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
 *             BOOKING             *
 ***********************************/

export const GET_MY_BOOKINGS = gql`
  query GetMyBookings($input: BookingsInquiry!) {
    getMyBookings(input: $input) {
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
          serviceDescription
          serviceBookings
          serviceLikes
          serviceViews
          serviceReviews
          serviceRating
          memberId
          createdAt
          updatedAt
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_AGENT_BOOKINGS = gql`
  query GetAgentBookings($input: BookingsInquiry!) {
    getAgentBookings(input: $input) {
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
          serviceDescription
          serviceBookings
          serviceLikes
          serviceViews
          serviceReviews
          serviceRating
          memberId
          createdAt
          updatedAt
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/***********************************
 *             ARTICLE             *
 ***********************************/

export const GET_BOARD_ARTICLE = gql`
  query GetBoardArticle($input: String!) {
    getBoardArticle(articleId: $input) {
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
  }
`;

export const GET_BOARD_ARTICLES = gql`
  query GetBoardArticles($input: BoardArticlesInquiry!) {
    getBoardArticles(input: $input) {
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

export const GET_QUESTION = gql`
  query GetQuestion($input: String!) {
    getQuestion(questionId: $input) {
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
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_QUESTIONS = gql`
  query GetQuestions($input: QnaQuestionInquiry!) {
    getQuestions(input: $input) {
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
 *               FAQ               *
 ***********************************/

export const GET_FAQ_DETAIL = gql`
  query GetFaqDetail($input: String!) {
    getFaqDetail(faqId: $input) {
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

export const GET_FAQS = gql`
  query GetFaqs($input: FaqsInquiry!) {
    getFaqs(input: $input) {
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

/***********************************
 *             NOTICE              *
 ***********************************/

export const GET_NOTICE_DETAIL = gql`
  query GetNoticeDetail($input: String!) {
    getNoticeDetail(noticeId: $input) {
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
      meViewed {
        memberId
        viewRefId
      }
    }
  }
`;

export const GET_NOTICES = gql`
  query GetNotices($input: NoticeInquiry!) {
    getNotices(input: $input) {
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
        meViewed {
          memberId
          viewRefId
        }
      }
      metaCounter {
        total
      }
      unviewedCounter {
        total
      }
    }
  }
`;

/***********************************
 *             COMMENT             *
 ***********************************/

export const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
      list {
        _id
        commentStatus
        commentGroup
        commentContent
        commentLikes
        commentRefId
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
 *             REVIEW              *
 ***********************************/

export const GET_REVIEWS = gql`
  query GetReviews($input: ReviewsInquiry!) {
    getReviews(input: $input) {
      list {
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
      metaCounter {
        total
      }
      stats {
        totalReviews
        averageRating
        ratingDistribution {
          star
          count
          percentage
        }
      }
    }
  }
`;

/***********************************
 *          NOTIFICATION           *
 ***********************************/

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($input: NotificationsInquiry!) {
    getNotifications(input: $input) {
      list {
        _id
        notificationType
        notificationStatus
        notificationGroup
        notificationTitle
        notificationContent
        notificationRefId
        authorId
        receiverId
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
      unreadCounter {
        total
      }
    }
  }
`;

export const GET_UNREAD_NOTIFICATIONS_COUNT = gql`
  query GetUnreadNotificationsCount {
    getUnreadNotificationsCount
  }
`;
