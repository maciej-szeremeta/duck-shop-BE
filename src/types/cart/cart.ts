import { CartEntity, } from './cart.entity';

export type CreateCartReq = Omit<CartEntity, 'id' | 'createdAt' | 'updatedAt'>;