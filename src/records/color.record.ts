import { FieldPacket, } from 'mysql2/promise';
import { v4 as uuid, } from 'uuid';
import { pool, } from '../utils/db';
import { ColorEntity, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';

type ColorRecordResult = [ColorRecord[], FieldPacket[]];

export class ColorRecord implements ColorEntity {
  public id?: string;
  
  public name: string;
  
  public createdAt?: number | Date;
  
  public updatedAt?: number | Date;

  constructor(obj: Omit<ColorEntity, 'insert'| 'update'>) {

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
  
  // # Sprawdzanie Unique Color WALIDACJA
  static async isNameTaken(name: string): Promise<boolean> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `colors` WHERE `name`=:name', { name, }
    )) as ColorRecordResult;
    return results.length > 0;
  }

  // # Create Color
  async insert(): Promise<ColorRecord> {
    await pool.execute (
      'INSERT INTO `colors` VALUES(:id, :name, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());', {
        id  : this.id,
        name: this.name,
      }
    );
    return this as ColorRecord;
  }

  // # Get One Color By Id
  static async getOneById(id: string): Promise<ColorRecord | null> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `colors` WHERE `id`=:id', { id, }
    )) as ColorRecordResult;
    return results.length === 0 ? null : new ColorRecord (results[ 0 ]);
  } 
  
  // # Update Color
  async update(): Promise<string> {
    if (!this.id) {
      throw new NotFoundError ('Brak id w zapytaniu');
    }
    this._validate ();
    await pool.execute (
      'UPDATE `colors` SET `name`= :name,`updatedAt`=CURRENT_TIMESTAMP() WHERE `id`=:id', {
        id  : this.id,
        name: this.name,
      }
    );
    return this.id;
  }

  // # Get All Colors
  static async listAll(): Promise<ColorRecord[]> {
    const [ results, ] = (await pool.execute ('SELECT * FROM `colors` ORDER BY `name` DESC;')) as ColorRecordResult;
    return results.map (obj => 
      new ColorRecord (obj));
  }
}
