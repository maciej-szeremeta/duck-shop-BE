// import { FieldPacket, } from 'mysql2/promise';
import { v4 as uuid, } from 'uuid';

// import { pool, } from '../utils/db';
import { OrderEntity, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';

// type OrderRecordResult = [OrderRecord[], FieldPacket[]];

export class OrderRecord implements OrderEntity {
  public id?: string;

  public userId?: string;

  public productId?: string;

  public quantity = 1;

  public amount :number;

  public address :string;

  public status :'pending';

  constructor(obj: Omit<OrderEntity, 'insert' | 'update'>) {

    this.id = obj.id ?? uuid ();
    this.userId = obj.userId;
    this.productId = obj.productId;
    this.quantity = obj.quantity;
    this.amount = obj.amount;
    this.address = obj.address;
    this.status = obj.status;

    //  this.createdAt= obj.createdAt ?? Date.now ();
    //  this.updatedAt= obj.updatedAt ?? Date.now ();

    this._validate ();
  }

  _validate() {

    if (
      !this.address ||
         this.address.trim ().length < 3 ||
         this.address.trim ().length > 50
    ) {
      throw new ValidationError ('Nazwa przedmiotu jest wymaga oraz musi zawierać od 3 do 50 znaków.');
    }
  }

}
