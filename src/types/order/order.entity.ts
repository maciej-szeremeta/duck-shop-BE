export type OrderStatus = 'pending'

export interface OrderEntity {
  id?: string;
  userId?: string;
  productId?: string;
  quantity: number;
  amount: number;
  address: string;
  status: OrderStatus;
}