import { CategoryEntity, } from './category.entity';

export type CreateProductCategoriesReq = Omit<CategoryEntity, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateProductCategoriesRes
{
      newProductCategories: CategoryEntity
}

export interface UpdateProductCategoriesRes { productCategories: CategoryEntity}

export interface ProductCategoriesRes { productCategories: CategoryEntity };

export interface ListProductCategoriesRes { productCategoriesList: CategoryEntity[] };