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

  private createdAt?: Date | number;

  private updatedAt?: Date | number;

  constructor(obj: Omit<UserEntity, 'insert' | 'update'>) {

    this.id = obj.id ?? uuid ();
    this.username = obj.username;
    this.email = obj.email;
    this.password = obj.password;
    this.isAdmin= obj.isAdmin ?? false;

    //  this.createdAt= obj.createdAt ?? Date.now ();
    //  this.updatedAt= obj.updatedAt ?? Date.now ();

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

}
