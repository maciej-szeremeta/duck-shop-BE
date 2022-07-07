export interface OrdersProductsEntity {
  orderId?: string | null;
  userId?: string | null;
  productId?: string | null;
  quantity: number;
  createdAt?: Date | number;
  updatedAt? : Date | number;
}
