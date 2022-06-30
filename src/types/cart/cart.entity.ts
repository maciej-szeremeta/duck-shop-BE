export interface CartEntity {
  id?: string;
  userId?: string;
  productId?: string;
  quantity: number;
  createdAt?: Date | number;
  updatedAt? : Date | number;
}

export type CreateCartReq = Omit<CartEntity, 'id' | 'createdAt' | 'updatedAt'>;