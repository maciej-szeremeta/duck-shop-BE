import { FieldPacket, } from 'mysql2/promise';
import { v4 as uuid, } from 'uuid';

import { pool, } from '../utils/db';
import { UserEntity, } from '../types/user/user.entity';
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

  // Omit tworzy na typ lub interface bez 2 metod update i insert
  constructor(obj: Omit<UserEntity, 'insert' | 'update'>) {

    // Możliwość stosowania bezpośrednio wartości
    this.id = obj.id ?? uuid ();
    this.username = obj.username;
    this.email = obj.email;
    this.password = obj.password;
    this.isAdmin= obj.isAdmin ?? false;

    //  this.createdAt= obj.createdAt ?? Date.now ();
    //  this.updatedAt= obj.updatedAt ?? Date.now ();

    // * Walidacja danych przy dodawaniu danych
    this._validate ();
  }

  // * Parametry walidacji
  _validate() {

    // * Walidacja wprowadzonych danych
    // ! Nazwa użytkownika jest wymagana
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

    // ! Hasło jest wymagane
    if (
      !this.password || this.password.trim ().length <= 6
    ) {
      throw new ValidationError ('Hasło jest wymagane oraz musi zawierać min 6 znaków.');
    }
  }

  // * Sprawdzanie Unique UserName (ActiveRecord) WALIDACJA
  static async isUserNameTaken(username: string): Promise<boolean> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `user` WHERE `username`=:username', { username, }
    )) as UserRecordResult;
    return results.length > 0;
  }

  // * Sprawdzanie Unique Email (ActiveRecord) WALIDACJA
  static async isEmailTaken(email: string): Promise<boolean> {
    const [ results, ] = (await pool.execute (
      'SELECT * FROM `user` WHERE `email`=:email', { email, }
    )) as UserRecordResult;
    return results.length > 0;
  }

  // * Dodawanie jednego (ActiveRecord)
  //   async insert(): Promise<string> {

  // Sprawdzenie czy przesłany obiekt ma id (public id?: string) jeśli nie to go dodaje
  // ? 1
  // if (typeof this.id === 'undefined') {
  //   this.id = uuid();
  // }
  //  ? 2
  // if (!this.id) {
  //   this.id = uuid();
  // }
  // ? 3
  //     this.id = this.id ?? uuid ();

  //     await pool.execute (
  //       'INSERT INTO `children` (`id`,`name`) VALUES(:id, :name)', {
  //         id  : this.id,
  //         name: this.name,
  //       }
  //     );
  //     return this.id;
  //   }

  // * Pobranie wszystkich obiektów posortowanych alfabetycznie (ActiveRecord)
  //   static async listAll(): Promise<ChildRecord[]> {
  //     const [ results, ] = (await pool.execute ('SELECT * FROM `children` ORDER BY `name` ASC')) as ChildRecordResult;
  //     return results.map ((obj: ChildRecord) => 
  //       new ChildRecord (obj));
  //   }

  //   // * Pobranie jednego obiektów (ActiveRecord)
  //   static async getOne(id: string): Promise<ChildRecord | null> {
  //     const [ results, ] = (await pool.execute (
  //       'SELECT * FROM `children` WHERE `id`=:id', { id, }
  //     )) as ChildRecordResult;
  //     return results.length === 0 ? null : new ChildRecord (results[ 0 ]);
  //   }

  //   // * Aktualizacja jednego (ActiveRecord)
  //   async update(): Promise<string> {

  //     // Sprawdzenie czy istnieje takie ID (można zrobić w routes)
  //     if (!this.id) {
  //       throw new NotFoundError ('Brak takiego id');
  //     }

  //     // Walidacja danych przy aktualizowaniu rekordu
  //     this._validate ();

//     await pool.execute (
//       'UPDATE `children` SET `name`= :name, `giftId`=:giftId WHERE `id`=:id', {
//         id    : this.id,
//         name  : this.name,
//         giftId: this.giftId,
//       }
//     );
//     return this.id;
//   }
}
