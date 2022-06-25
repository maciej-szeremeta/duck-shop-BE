import { FieldPacket, } from 'mysql2/promise';
import { v4 as uuid, } from 'uuid';

import { pool, } from '../utils/db';
import { UserEntity, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';

type UserRecordResult = [UserRecord[], FieldPacket[]];

export class UserRecord implements UserEntity {
  public id?: string;

  public username: string;

  public email: string;

  public password: string;

  public isAdmin?: boolean;

  public createdAt?: Date | number;

  public updatedAt?: Date | number;

  constructor(obj: Omit<UserEntity, 'insert' | 'update'>) {

    this.id = obj.id ?? uuid ();
    this.username = obj.username;
    this.email = obj.email;
    this.password = obj.password;
    this.isAdmin= obj.isAdmin ?? false;
    this.createdAt= obj.createdAt ?? Date.now ();
    this.updatedAt= obj.updatedAt ?? Date.now ();

    this._validate ();
  }

  _validate() {

    if (
      !this.username ||
      this.username.trim ().length < 3 ||
      this.username.trim ().length > 20
    ) {
      throw new ValidationError ('Nazwa użytownika nie może być pusta oraz musi zawierać od 3 do 20 znaków.');
    }

    // ! Email jest wymagany
    if (
      !this.email
    ) {
      throw new ValidationError ('Email jest wymagany.');
    }
     
    const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegExp.test (this.email)) {
      throw new ValidationError ('Email musi być poprawny');
    }

    if (
      !this.password || this.password.trim ().length <= 6
    ) {
      throw new ValidationError ('Hasło jest wymagane oraz musi zawierać min 6 znaków.');
    }
  }

  // * Sprawdzanie Unique UserName  WALIDACJA
  static async isUserNameTaken(username: string): Promise<boolean> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `users` WHERE `username`=:username', { username, }
    )) as UserRecordResult;
    return results.length > 0;
  }

  // * Sprawdzanie Unique Email WALIDACJA
  static async isEmailTaken(email: string): Promise<boolean> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `users` WHERE `email`=:email', { email, }
    )) as UserRecordResult;
    return results.length > 0;
  }

  async insert(): Promise<UserRecord> {
    await pool.execute (
      'INSERT INTO `users` VALUES(:id, :username, :email, :password, :isAdmin, :createdAt, :updatedAt)', {
        id       : this.id,
        username : this.username,
        email    : this.email,
        password : this.password,
        isAdmin  : this.isAdmin,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      }
    );
    return this as UserRecord;
  }

  static async getOneByUsername(username: string): Promise<UserRecord | null> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `users` WHERE `username`=:username', { username, }
    )) as UserRecordResult;
    return results.length === 0 ? null : new UserRecord (results[ 0 ]);
  } 

  static async getOneById(id: string): Promise<UserRecord | null> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `users` WHERE `id`=:id', { id, }
    )) as UserRecordResult;
    return results.length === 0 ? null : new UserRecord (results[ 0 ]);
  } 

  async update(): Promise<string> {

    if (!this.id) {
      throw new NotFoundError ('Brak id w zapytaniu');
    }
    console.log (this);
    this._validate ();
    await pool.execute (
      'UPDATE `users` SET `username`= :username,`email`=:email,`password`=:password,`isAdmin`=:isAdmin,`updatedAt`=:updatedAt WHERE `id`=:id', {
        id       : this.id,
        username : this.username,
        email    : this.email,
        password : this.password,
        isAdmin  : this.isAdmin,
        createdAt: this.createdAt,
        updatedAt: Date.now (),
      }
    );
    return this.id;
  }
}
