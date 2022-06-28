
export interface ProductEntity {
  id?: string;
  title: string;
  description: string;
  img: string;
  categoriesId?: string | null;
  size?: string | null;
  color?: string | null;
  price: number;
  createdAt?: Date | number;
  updatedAt? : Date | number;
}

export type CreateProductReq = Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>;