import { FieldPacket, } from 'mysql2/promise';
import { v4 as uuid, } from 'uuid';
import { pool, } from '../utils/db';
import { CategoryEntity, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';

type CategoryRecordResult = [CategoryRecord[], FieldPacket[]];

export class CategoryRecord implements CategoryEntity {
  public id?: string;
  
  public name: string;
  
  public createdAt?: number | Date;
  
  public updatedAt?: number | Date;

  constructor(obj: Omit<CategoryEntity, 'insert'| 'update'>) {

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
  
  // # Sprawdzanie Unique Title WALIDACJA
  static async isNameTaken(name: string): Promise<boolean> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `categories` WHERE `name`=:name', { name, }
    )) as CategoryRecordResult;
    return results.length > 0;
  }

  // # Add Category
  async insert(): Promise<CategoryRecord> {
    await pool.execute (
      'INSERT INTO `categories` VALUES(:id, :name, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());', {
        id  : this.id,
        name: this.name,
      }
    );
    return this as CategoryRecord;
  }

  // # Get One Category
  static async getOneById(id: string): Promise<CategoryRecord | null> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `categories` WHERE `id`=:id', { id, }
    )) as CategoryRecordResult;
    return results.length === 0 ? null : new CategoryRecord (results[ 0 ]);
  } 
  
  // # Update Category
  async update(): Promise<string> {
    if (!this.id) {
      throw new NotFoundError ('Brak id w zapytaniu');
    }
    this._validate ();
    await pool.execute (
      'UPDATE `categories` SET `name`= :name,`updatedAt`=CURRENT_TIMESTAMP() WHERE `id`=:id', {
        id  : this.id,
        name: this.name,
      }
    );
    return this.id;
  }
  
  // # List Categories
  static async listAll(): Promise<CategoryRecord[]> {
    const [ results, ] = (await pool.execute ('SELECT * FROM `categories` ORDER BY `name` DESC;')) as CategoryRecordResult;
    return results.map (obj => 
      new CategoryRecord (obj));
  }
}
