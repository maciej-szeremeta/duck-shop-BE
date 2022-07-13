import { CartsProductsEntity, } from './carts_products.entity';

export type CreateProductCart = Omit<CartsProductsEntity, 'id'>;