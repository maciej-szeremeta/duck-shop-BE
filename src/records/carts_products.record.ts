import { FieldPacket, } from 'mysql2/promise';
import { pool, } from '../utils/db';
import { CartsProductsEntity, } from '../types';

import { NotFoundError, } from '../utils/error';

type CartsProductsRecordResult = [CartsProductsRecord[], FieldPacket[]];
type CartsProductsTotalPrice = [{ total: number }[], FieldPacket[]];

export class CartsProductsRecord implements CartsProductsEntity {

  public cartId?: string;

  public productId?: string;
   
  public quantity:number;
  
  public createdAt: number | Date;
  
  public updatedAt: number | Date;

  constructor(obj: Omit<CartsProductsRecord, 'insert' | 'update'| 'delete'>) {
    this.cartId = obj.cartId;
    this.productId = obj.productId;
    this.quantity = obj.quantity ?? 1;
    this.createdAt= obj.createdAt ?? Date.now ();
    this.updatedAt= obj.updatedAt ?? Date.now ();

  }

  // # Add products_categories
  async insert(): Promise<CartsProductsRecord> {
    await pool.execute (
      'INSERT INTO `carts_products` (`cartId`,`productId`,`quantity`,`createdAt`,`updatedAt`) VALUES ( :cartId, :productId, :quantity, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());', {
        cartId   : this.cartId,
        productId: this.productId,
        quantity : this.quantity,
      }
    );
    return this as CartsProductsRecord;
  }

  // # Get All products_categories by ProductId
  static async listAll(cartId: string): Promise<CartsProductsRecord[]> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `carts_products` WHERE `cartId`= :cartId', {
        cartId,
      }
    )) as CartsProductsRecordResult;
    return results.map (obj => 
      new CartsProductsRecord (obj));
  }

  // # Get One products_categories by ProductId and CartId
  static async getOneByProductIdAndCart(
    cartId: string, productId:string
  ): Promise<CartsProductsRecord | null> {
    
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `carts_products` WHERE `cartId`=:cartId AND `productId`=:productId;', { cartId, productId, }
    )) as CartsProductsRecordResult;
    return results.length === 0 ? null : new CartsProductsRecord (results[ 0 ]);
  }

  // # Update Product_category Quantity
  async update(): Promise<string> {
    if (!this.cartId) {
      throw new NotFoundError ('Brak id w zapytaniu');
    }
    await pool.execute (
      'UPDATE `carts_products` SET `quantity`= :quantity,`updatedAt`=CURRENT_TIMESTAMP() WHERE `cartId`=:cartId AND `productId`=:productId;', {
        quantity : this.quantity,
        cartId   : this.cartId,
        productId: this.productId,
      }
    );
    return this.cartId;
  }

  // # Delete products from cart
  async delete(): Promise<string> {
    if (!this.cartId) {
      throw new NotFoundError ('Brak takiego id');
    }
    await pool.execute (
      'DELETE FROM `carts_products` WHERE `cartId`=:cartId AND `productId`=:productId;', {
        cartId   : this.cartId,
        productId: this.productId,
      }
    );
    return this.cartId;
  }

  // # Get One products_categories by ProductId and CartId
  static async getTotalCart(cartId: string): Promise<number> {
    const [ results, ] = (await pool.execute (
      'SELECT Sum(`carts_products`.`quantity` * `products`.`price`) as total FROM `products` JOIN `carts_products` ON `products`.`id` = `carts_products`.`productId` GROUP BY `carts_products`.`cartId` HAVING (((`carts_products`.`cartId`) =:cartId));', { cartId, }
    )) as CartsProductsTotalPrice;
    return Number (results[ 0 ].total);
  }
}
