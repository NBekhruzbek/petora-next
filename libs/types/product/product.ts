import {
  ProductPetType,
  ProductStatus,
  ProductType,
} from "@/libs/enums/product.enum";
import { MeLiked } from "../like/like";

export interface Product {
  _id: string;
  productType: ProductType;
  productStatus: ProductStatus;
  productPetType: ProductPetType;
  productName: string;
  productImages: string[];
  productShortDesc: string;
  productDesc: string;
  productBrand?: string;
  productBenefits?: string;
  productPrice: number;
  productDiscount: number;
  productPriceAfterDiscount?: number;
  productQuantity: number;
  productLikes: number;
  productViews: number;
  productReviews: number;
  productRating: number;
  productRank: number;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation */
  meLiked?: MeLiked[];
}

export interface ProductTotalCounter {
  total: number;
}

export interface Products {
  list: Product[];
  metaCounter: ProductTotalCounter[];
}
