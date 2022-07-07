import { FieldPacket, } from 'mysql2/promise';
import { pool, } from '../utils/db';
import { OrdersProductsEntity, } from '../types';

// import { NotFoundError, } from '../utils/error';

type OrdersProductsRecordResult = [OrdersProductsRecord[], FieldPacket[]];

export class OrdersProductsRecord implements OrdersProductsEntity {

  public userId?: string | null;
   
  public productId?: string | null;

  public quantity: number;
  
  public createdAt: number | Date;
  
  public updatedAt: number | Date;

  constructor(obj: Omit<OrdersProductsEntity, 'insert'| 'update'>) {
    this.userId = obj.userId ?? null;
    this.productId = obj.productId ?? null;
    this.quantity = obj.quantity ?? 1;
    this.createdAt= obj.createdAt ?? Date.now ();
    this.updatedAt= obj.updatedAt ?? Date.now ();

  }

  async insert(): Promise<OrdersProductsEntity> {
    await pool.execute (
      'INSERT INTO `orders_products`(`userId`,`productId`,`quantity`,`createdAt`,`updatedAt`) VALUES ( :userId, :productId, :quantity, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());', this
    );
    return this as OrdersProductsEntity;
  }
  
  static async listAll(userId: string): Promise<OrdersProductsRecord[]> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `orders_products` WHERE `userId`= :userId', {
        userId,
      }
    )) as OrdersProductsRecordResult;
    return results.map (obj => 
      new OrdersProductsRecord (obj));
  }

  //   static async getOneByProductId(productId: string): Promise<ProductsCategoriesRecord | null> {
  //     const [ results, ] = (await pool.execute (
  //       'SELECT * FROM `products_categories` WHERE `productId`=:productId', { productId, }
  //     )) as ProductsCategoriesRecordResult;
  //     return results.length === 0 ? null : new ProductsCategoriesRecord (results[ 0 ]);
   
  //   } 
  //   static async getOneByProductIdAndCategory(
  //     productId: string, categoryName:string
  //   ): Promise<ProductsCategoriesRecord | null> {
    
  //     const [ results, ] = (await pool.execute (
  //       'SELECT * FROM `products_categories` WHERE `productId`=:productId AND `categoryName`=:categoryName', { productId, categoryName, }
  //     )) as ProductsCategoriesRecordResult;
  //     return results.length === 0 ? null : new ProductsCategoriesRecord (results[ 0 ]);
  //   } 

  //   async delete(): Promise<number> {
  //     if (!this.id) {
  //       throw new NotFoundError ('Brak takiego id');
  //     }
  //     await pool.execute (
  //       'DELETE FROM `products_categories` WHERE `id`=:id', { id: this.id, }
  //     );
  //     return this.id;
  //   }
}
