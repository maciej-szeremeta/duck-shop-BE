import { FieldPacket, } from 'mysql2/promise';
import { v4 as uuid, } from 'uuid';

import { pool, } from '../utils/db';
import { OrderEntity, OrderStats, OrderStatus, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';

type OrderRecordResult = [OrderRecord[], FieldPacket[]];
type OrderStatsResult = [OrderStats[], FieldPacket[]];

export class OrderRecord implements OrderEntity {
  public id?: string;

  public userId?: string;

  public productId?: string;

  public quantity = 1;

  public amount :number;

  public address :string;

  public statusName: OrderStatus;
  
  public createdAt?: number | Date;

  public updatedAt?: number | Date;

  constructor(obj: Omit<OrderEntity, 'insert' | 'update'>) {

    this.id = obj.id ?? uuid ();
    this.userId = obj.userId;
    this.productId = obj.productId;
    this.quantity = obj.quantity;
    this.amount = obj.amount;
    this.address = obj.address;
    this.statusName = obj.statusName ?? 'pending';
    this.createdAt= obj.createdAt ?? Date.now ();
    this.updatedAt= obj.updatedAt ?? Date.now ();

    this._validate ();
  }

  _validate() {

    if (
      !this.address ||
         this.address.trim ().length < 3 ||
         this.address.trim ().length > 50
    ) {
      throw new ValidationError ('Adress jest wymagany oraz musi zawierać od 3 do 50 znaków.');
    }
  }

  async insert(): Promise<OrderRecord> {
    await pool.execute (
      'INSERT INTO `orders` VALUES(:id, :userId, :productId, :quantity, :amount, :address, :statusName, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());', this
    );
    return this as OrderRecord;
  }

  static async getOneById(id: string): Promise<OrderRecord | null> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `orders` WHERE `id`=:id', { id, }
    )) as OrderRecordResult;
    return results.length === 0 ? null : new OrderRecord (results[ 0 ]);
  }
 
  async update(): Promise<string> {
    if (!this.id) {
      throw new NotFoundError ('Brak id w zapytaniu');
    }
    this._validate ();
    
    await pool.execute (
      'UPDATE `orders` SET `userId`= :userId,`productId`=:productId,`quantity`=:quantity,`amount`=:amount, `address`=:address, `statusName`=:statusName, `updatedAt`=CURRENT_TIMESTAMP() WHERE `id`=:id', this
    );
    return this.id;
  }

  async delete(): Promise<string> {

    if (!this.id) {
      throw new NotFoundError ('Brak takiego id');
    }
    await pool.execute (
      'DELETE FROM `orders` WHERE `id`=:id', { id: this.id, }
    );

    return this.id;
  }

  static async getOrderByUserId(userId: string): Promise<OrderRecord | null> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `orders` WHERE `userId`=:userId', { userId, }
    )) as OrderRecordResult;
    return results.length === 0 ? null : new OrderRecord (results[ 0 ]);
  } 

  static async listAll(): Promise<OrderRecord[]> {
    const [ results, ] = (await pool.execute ('SELECT * FROM `orders` ORDER BY `userId` ASC')) as OrderRecordResult;
    return results.map ((obj: OrderRecord) => 
      new OrderRecord (obj));
  }

  static async getStatsOrders(): Promise<OrderStats[]> {
    const [ results, ] = await pool.execute ('SELECT DATE_FORMAT(`createdAt`,"%Y.%m") AS id, COUNT(`id`) as total FROM `orders` GROUP BY DATE_FORMAT(`createdAt`,"%Y.%m");') as OrderStatsResult;
    return results.map (obj => 
      obj);
  }
}
