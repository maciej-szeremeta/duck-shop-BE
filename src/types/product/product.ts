import { CategoryEntity, } from '../category';
import { ColorEntity } from '../color/color.entity';
import { ProductsCategoriesEntity, } from '../products_categories';
import { ProductEntity, } from './product.entity';

export type CreateProductReq = Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateProductRes { product: ProductEntity }

export interface CreateProductWithCategoriesRes extends ProductEntity {
  categories: ProductsCategoriesEntity[]
}

export interface UpdateProductWithCategoriesRes extends ProductEntity {
  categories: ProductsCategoriesEntity[]
}

export interface OneProductRes { oneProduct: ProductEntity }

export interface ListProductsRes {
  productsList: ProductEntity[];
  categoriesList: CategoryEntity[];
  colorsList: ColorEntity[];
}