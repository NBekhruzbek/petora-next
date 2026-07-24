import {
  ProductPetType,
  ProductStatus,
  ProductType,
} from "@/libs/enums/product.enum";

export interface ProductUpdate {
  productId: string;
  productType?: ProductType;
  productStatus?: ProductStatus;
  productPetType?: ProductPetType;
  productName?: string;
  productImages?: string[];
  productShortDesc?: string;
  productDesc?: string;
  productBrand?: string;
  productBenefits?: string;
  productPrice?: number;
  productDiscount?: number;
  productPriceAfterDiscount?: number;
  productQuantity?: number;
  deletedAt?: Date;
}
