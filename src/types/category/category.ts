import { CategoryEntity, } from './category.entity';

export type CreateCategoryReq = Omit<CategoryEntity, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateCategoryRes{ newCategory: CategoryEntity}

export interface UpdateCategoryRes { category: CategoryEntity}

export interface ProductCategoryRes { category: CategoryEntity };

export interface ListCategoriesRes { categoriesList: CategoryEntity[] };