import { gql } from "@apollo/client";

/***********************************
 *             PRODUCT             *
 ***********************************/

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
 *             ARTICLE             *
 ***********************************/
