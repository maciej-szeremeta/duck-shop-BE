import { FieldPacket, } from 'mysql2/promise';
import { v4 as uuid, } from 'uuid';
import { pool, } from '../utils/db';
import { ProductEntity, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';

type ProductRecordResult = [ProductRecord[], FieldPacket[]];

export class ProductRecord implements ProductEntity {
  public id?: string;

  public title: string;

  public description: string;

  public img: string;

  public size?: string | null;

  public color?: string | null;

  public price: number;

  public inStock: boolean;

  public createdAt?: number | Date;

  public updatedAt?: number | Date;

  constructor(obj: Omit<ProductEntity, 'insert' | 'update'>) {

    this.id = obj.id ?? uuid ();
    this.title = obj.title;
    this.description = obj.description;
    this.img = obj.img;
    this.size = obj.size ?? null;
    this.color = obj.color ?? null;
    this.price = obj.price;
    this.inStock = obj.inStock ?? true;
    this.createdAt= obj.createdAt ?? Date.now ();
    this.updatedAt= obj.updatedAt ?? Date.now ();

    this._validate ();
  }

  _validate() {

    if (
      !this.title ||
      this.title.trim ().length < 3 ||
      this.title.trim ().length > 50
    ) {
      throw new ValidationError ('Nazwa przedmiotu jest wymaga oraz musi zawierać od 3 do 50 znaków.');
    }

    if (
      !this.description ||
      this.description.trim ().length < 3 ||
      this.description.trim ().length > 80
    ) {
      throw new ValidationError ('Opis przedmiotu jest wymagany oraz musi zawierać od 3 do 80 znaków.');
    }

    if (
      !this.img
    ) {
      throw new ValidationError ('Dodaj zdjęcie.');
    }

    if (!this.price || this.price < 1 || this.price > 9999) {
      throw new ValidationError ('Cena nie może być mniejsza niż 0 lub większa niż 9 999');
    }
  }

  // * Sprawdzanie Unique Title WALIDACJA
  static async isTitleTaken(title: string): Promise<boolean> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `products` WHERE `title`=:title', { title, }
    )) as ProductRecordResult;
    return results.length > 0;
  }

  async insert(): Promise<ProductRecord> {
    await pool.execute (
      'INSERT INTO `products` VALUES(:id, :title, :description, :img, :size, :color, :price, :inStock, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());', {
        id         : this.id,
        title      : this.title,
        description: this.description,
        img        : this.img,
        size       : this.size,
        color      : this.color,
        price      : this.price,
        inStock    : this.inStock,
      }
    );
    return this as ProductRecord;
  }

  static async getOneById(id: string): Promise<ProductRecord | null> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `products` WHERE `id`=:id', { id, }
    )) as ProductRecordResult;
    return results.length === 0 ? null : new ProductRecord (results[ 0 ]);
  } 

  async update(): Promise<string> {
    if (!this.id) {
      throw new NotFoundError ('Brak id w zapytaniu');
    }
    this._validate ();
    await pool.execute (
      'UPDATE `products` SET `title`= :title,`description`=:description,`img`=:img,`size`=:size,`color`=:color,`price`=:price,`inStock`=:inStock,`updatedAt`=CURRENT_TIMESTAMP() WHERE `id`=:id', {
        id         : this.id,
        title      : this.title,
        description: this.description,
        img        : this.img,
        size       : this.size,
        color      : this.color,
        price      : this.price,
        inStock    : this.inStock,
      }
    );
    return this.id;
  }

  static async listAll(
    topNew: string, category:string
  ): Promise<ProductRecord[]> {
    const [ results, ] = (await pool.execute (
      'SELECT `products`.* FROM `products` JOIN `products_categories` ON `products`.`id` = `products_categories`.`productId` WHERE `products_categories`.`categoryName` = :category ORDER BY `products`.`createdAt` DESC LIMIT :topNew;', { topNew: topNew || '100', category: category || 'IS NOT NULL', }
    )) as ProductRecordResult;
    return results.map (obj => 
      new ProductRecord (obj));
  }

  async delete(): Promise<string> {

    if (!this.id) {
      throw new NotFoundError ('Brak takiego id');
    }
    await pool.execute (
      'DELETE FROM `products` WHERE `id`=:id', { id: this.id, }
    );

    return this.id;
  }
}
