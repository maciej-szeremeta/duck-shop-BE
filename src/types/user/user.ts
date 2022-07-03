import { UserEntity, } from './user.entity';

export type RegisterUserReq = Omit<UserEntity, 'id' | 'isAdmin' | 'createdAt' | 'updatedAt'>;

export type RegisterUserRes = {
  username: string;
  email: string;
}

export type UserEntityWitoutPasswordRes = Omit<UserEntity, 'password'>

export interface LoginUserRes extends UserEntityWitoutPasswordRes{
  accessToken: string
}

export type ListUsersRes = UserEntityWitoutPasswordRes[]

export interface UserStats {
  id: string,
  total: number;
}