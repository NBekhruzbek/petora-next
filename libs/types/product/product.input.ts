import { Direction } from "@/libs/enums/common.enum";
import {
  ProductPetType,
  ProductStatus,
  ProductType,
} from "@/libs/enums/product.enum";

export interface ProductInput {
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
}

interface PriceRange {
  min?: number;
  max?: number;
}

interface PISearch {
  priceRange?: PriceRange;
  onlyLiked: boolean;
  productPetType?: ProductPetType[];
  productType?: ProductType[];
  productStatus?: ProductStatus[];
  text?: string;
}

export interface ProductsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: PISearch;
}

export interface OrdinaryInquiry {
  page: number;
  limit: number;
}
