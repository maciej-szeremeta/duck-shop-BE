export type OrderStatus = 'pending'

export interface OrderEntity {
  id?: string;
  userId?: string;
  productId?: string;
  quantity: number;
  amount: number;
  address: string;
  statusName: OrderStatus;
  createdAt?: Date | number;
  updatedAt? : Date | number;
}

export interface OrderStats {
  id: string,
  total: number;
}