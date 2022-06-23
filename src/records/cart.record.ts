// import { FieldPacket, } from 'mysql2/promise';
import { v4 as uuid, } from 'uuid';

// import { pool, } from '../utils/db';
import { CartEntity, } from '../types';

// import { NotFoundError, ValidationError, } from '../utils/error';

export class CartRecord implements CartEntity {
  public id?: string;

  public userId?: string;

  public productId?: string;

  public quantity= 1;

  constructor(obj: Omit<CartEntity, 'insert' | 'update'>) {

    this.id = obj.id ?? uuid ();
    this.userId = obj.userId;
    this.productId = obj.productId;
    this.quantity = obj.quantity;

    //  this.createdAt= obj.createdAt ?? Date.now ();
    //  this.updatedAt= obj.updatedAt ?? Date.now ();

  }

}
