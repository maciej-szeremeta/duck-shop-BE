import { FieldPacket, } from 'mysql2/promise';
import { v4 as uuid, } from 'uuid';
import { pool, } from '../utils/db';
import { CartEntity, } from '../types';
import { NotFoundError, } from '../utils/error';

type CartRecordResult = [CartRecord[], FieldPacket[]];

export class CartRecord implements CartEntity {
  public id?: string;

  public userId?: string;

  public createdAt?: number | Date;

  public updatedAt?: number | Date;

  constructor(obj: Omit<CartEntity, 'insert' | 'update'>) {

    this.id = obj.id ?? uuid ();
    this.userId = obj.userId;
    this.createdAt= obj.createdAt ?? Date.now ();
    this.updatedAt= obj.updatedAt ?? Date.now ();

  }

  // # Add Product to Cart
  async insert(): Promise<CartRecord> {

    await pool.execute (
      'INSERT INTO `carts` VALUES(:id, :userId, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());', this
    );
    return this as CartRecord;
  }

  // # Get One Cart By Id
  static async getOneById(id: string): Promise<CartRecord | null> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `carts` WHERE `id`=:id', { id, }
    )) as CartRecordResult;
    return results.length === 0 ? null : new CartRecord (results[ 0 ]);
  } 

  // # Get Cart By UserId
  static async getCartByUserId(userid: string): Promise<CartRecord | null> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `carts` WHERE `userid`=:userid', { userid, }
    )) as CartRecordResult;
    return results.length === 0 ? null : new CartRecord (results[ 0 ]);;
  } 

  // # Get All Carts
  static async listAll(): Promise<CartRecord[]> {
    const [ results, ] = (await pool.execute ('SELECT * FROM `carts` ORDER BY `userId` ASC')) as CartRecordResult;
    return results.map ((obj: CartRecord) => 
      new CartRecord (obj));
  }

  // # Update Cart
  async update(): Promise<string> {
    if (!this.id) {
      throw new NotFoundError ('Brak id w zapytaniu');
    }
    await pool.execute (
      'UPDATE `carts` SET `userId`= :userId,`updatedAt`=CURRENT_TIMESTAMP() WHERE `id`=:id', {
        id    : this.id,
        userId: this.userId,
      }
    );
    return this.id;
  }

  // # Delete Cart
  async delete(): Promise<string> {
    if (!this.id) {
      throw new NotFoundError ('Brak takiego id');
    }
    await pool.execute (
      'DELETE FROM `carts` WHERE `id`=:id', { id: this.id, }
    );
    return this.id;
  }
}
