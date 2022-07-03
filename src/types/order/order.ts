import { OrderEntity, } from './order.entity';

export type CreateOrderReq = Omit<OrderEntity, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateOrderRes {
  newOrder: OrderEntity;
}

export interface UpdateOrderRes {
  order: OrderEntity;
}

export interface ListUserOrdersRes {
  userOrderList: OrderEntity[];
}

export interface ListAllOrdersRes {
  ordersList: OrderEntity[];
}
