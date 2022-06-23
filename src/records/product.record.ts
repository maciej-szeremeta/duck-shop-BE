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

  public categories?: string;

  public size?: string;

  public color?: string;

  public price: number;

  constructor(obj: Omit<ProductEntity, 'insert' | 'update'>) {

    this.id = obj.id ?? uuid ();
    this.title = obj.title;
    this.description = obj.description;
    this.img = obj.img;
    this.categories = obj.categories;
    this.size = obj.size;
    this.color = obj.color;
    this.price = obj.price;

    //  this.createdAt= obj.createdAt ?? Date.now ();
    //  this.updatedAt= obj.updatedAt ?? Date.now ();

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
}
