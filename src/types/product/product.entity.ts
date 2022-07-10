
export interface ProductEntity {
  id?: string;
  title: string;
  description: string;
  img: string;
  size?: string | null;
  color?: string | null;
  price: number;
  inStock: boolean;
  createdAt?: Date | number;
  updatedAt? : Date | number;
}
