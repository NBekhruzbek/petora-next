import { OrderStatus } from "@/libs/enums/order.enum";

export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}
