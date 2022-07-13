
export interface CartsProductsEntity {
  id?: number;
  cartId?: string;
  productId?: string;
  quantity: number;
  createdAt: Date | number;
  updatedAt : Date | number;
}
