import { ProductCategoriesEntity, } from './productCategories.entity';

export type CreateProductCategoriesReq = Omit<ProductCategoriesEntity, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateProductCategoriesRes
{
      newProductCategories: ProductCategoriesEntity
}

export interface UpdateProductCategoriesRes
{
      productCategories: ProductCategoriesEntity
}

export interface ProductCategoriesRes { productCategories: ProductCategoriesEntity };

export interface ListProductCategoriesRes { productCategoriesList: ProductCategoriesEntity[] };