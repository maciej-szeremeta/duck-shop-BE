export interface UserProductEntity {
  id: number;
  userId?: string;
  productId?: string;
  quantity?: number;
  createdAt?: Date | number;
  updatedAt? : Date | number;
}
