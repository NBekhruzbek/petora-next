import { OrderStatus, PaymentMethod } from "@/libs/enums/order.enum";
import { Member } from "../member/member";
import { Product } from "../product/product";

export interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  orderId: string;
  productId: string;
  productData?: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  orderNumber: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  receiverName: string;
  receiverPhone: string;
  memberId: string;
  memberData?: Member;
  orderItems?: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderTotalCounter {
  total: number;
}

export interface Orders {
  list: Order[];
  metaCounter?: OrderTotalCounter[];
}
