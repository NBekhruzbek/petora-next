import { OrderStatus } from "@/libs/enums/order.enum";

export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  orderId?: string;
  productId: string;
}

export interface OrdersInquiry {
  page: number;
  limit: number;
  orderStatus?: OrderStatus;
}
