import { FieldPacket, } from 'mysql2/promise';
import { v4 as uuid, } from 'uuid';
import { pool, } from '../utils/db';
import { ProductCategoriesEntity, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';

type ProductCategoriesRecordResult = [ProductCategoriesRecord[], FieldPacket[]];

export class ProductCategoriesRecord implements ProductCategoriesEntity {
  public id?: string;
  
  public name: string;
  
  public createdAt?: number | Date;
  
  public updatedAt?: number | Date;

  constructor(obj: Omit<ProductCategoriesEntity, 'insert'| 'update'>) {

    this.id = obj.id ?? uuid ();
    this.name = obj.name;
    this.createdAt= obj.createdAt ?? Date.now ();
    this.updatedAt= obj.updatedAt ?? Date.now ();

    this._validate ();
  }

  _validate() {

    if (
      !this.name ||
      this.name.trim ().length < 3 ||
      this.name.trim ().length > 50
    ) {
      throw new ValidationError ('Nazwa kategori przedmiotu jest wymaga oraz musi zawierać od 3 do 50 znaków.');
    }
  }
  
  // * Sprawdzanie Unique Title WALIDACJA
  static async isNameTaken(name: string): Promise<boolean> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `productCategories` WHERE `name`=:name', { name, }
    )) as ProductCategoriesRecordResult;
    return results.length > 0;
  }

  async insert(): Promise<ProductCategoriesRecord> {
    await pool.execute (
      'INSERT INTO `productCategories` VALUES(:id, :name, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());', {
        id  : this.id,
        name: this.name,
      }
    );
    return this as ProductCategoriesRecord;
  }

  static async getOneById(id: string): Promise<ProductCategoriesRecord | null> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `productCategories` WHERE `id`=:id', { id, }
    )) as ProductCategoriesRecordResult;
    return results.length === 0 ? null : new ProductCategoriesRecord (results[ 0 ]);
  } 
  
  async update(): Promise<string> {
    if (!this.id) {
      throw new NotFoundError ('Brak id w zapytaniu');
    }
    this._validate ();
    await pool.execute (
      'UPDATE `productCategories` SET `name`= :name,`updatedAt`=CURRENT_TIMESTAMP() WHERE `id`=:id', {
        id  : this.id,
        name: this.name,
      }
    );
    return this.id;
  }
  
  static async listAll(): Promise<ProductCategoriesRecord[]> {
    const [ results, ] = (await pool.execute ('SELECT * FROM `productCategories` ORDER BY `name` DESC;')) as ProductCategoriesRecordResult;
    return results.map (obj => 
      new ProductCategoriesRecord (obj));
  }
}
