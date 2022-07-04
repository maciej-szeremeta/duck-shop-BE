import { FieldPacket, } from 'mysql2/promise';
import { pool, } from '../utils/db';
import { ProductsCategoriesEntity, } from '../types';
import { NotFoundError, } from '../utils/error';

type ProductsCategoriesRecordResult = [ProductsCategoriesRecord[], FieldPacket[]];

export class ProductsCategoriesRecord implements ProductsCategoriesEntity {
  public id?: number;

  public productId: string;

  public categoryName: string;
  
  public createdAt: number | Date;
  
  public updatedAt: number | Date;

  constructor(obj: Omit<ProductsCategoriesEntity, 'insert'| 'update'>) {
    this.id = obj.id;
    this.productId = obj.productId;
    this.categoryName = obj.categoryName;
    this.createdAt= obj.createdAt ?? Date.now ();
    this.updatedAt= obj.updatedAt ?? Date.now ();

  }

  async insert(): Promise<ProductsCategoriesRecord> {
    await pool.execute (
      'INSERT INTO `products_categories`(`productId`,`categoryName`,`createdAt`,`updatedAt`) VALUES( :productId, :categoryName, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());', this
    );
    return this as ProductsCategoriesRecord;
  }

  static async getOneByProductId(productId: string): Promise<ProductsCategoriesRecord | null> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `products_Categories` WHERE `productId`=:productId', { productId, }
    )) as ProductsCategoriesRecordResult;
    return results.length === 0 ? null : new ProductsCategoriesRecord (results[ 0 ]);
  } 
  
  static async listAll(productId: string): Promise<ProductsCategoriesRecord[]> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `products_categories` WHERE `productId`= :productId', {
        productId,
      }
    )) as ProductsCategoriesRecordResult;
    return results.map (obj => 
      new ProductsCategoriesRecord (obj));
  }

  async delete(): Promise<number> {

    if (!this.id) {
      throw new NotFoundError ('Brak takiego id');
    }
    
    await pool.execute (
      'DELETE FROM `products_categories` WHERE `id`=:id', { id: this.id, }
    );

    return this.id;
  }
}
