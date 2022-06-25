export interface UserEntity {
  id?: string;
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  createdAt?: Date | number;
  updatedAt? : Date | number;
}

export type RegisterUserReq = Omit<UserEntity, 'id' | 'isAdmin' | 'createdAt' | 'updatedAt'>;

export type RegisterUserRes = {
  username: string;
  email: string;
}

type UserEntityWitoutPassword = Omit<UserEntity, 'password'>

export interface LoginUserRes extends UserEntityWitoutPassword{
  accessToken: string
}