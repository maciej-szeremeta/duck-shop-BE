import { ProductEntity, } from './product.entity';

export type CreateProductReq = Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateProductRes {
  product: ProductEntity;
}
