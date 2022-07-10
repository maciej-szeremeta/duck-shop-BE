import { ProductCategoriesEntity, } from '../category';
import { ProductEntity, } from './product.entity';

export type CreateProductReq = Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateProductRes { product: ProductEntity }

export interface OneProductRes { oneProduct: ProductEntity }

export interface ListProductsRes {
  productsList: ProductEntity[];
  categoriesList: ProductCategoriesEntity[];
}