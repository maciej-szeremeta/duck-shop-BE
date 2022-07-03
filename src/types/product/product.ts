import { ProductEntity, } from './product.entity';

export type CreateProductReq = Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>;