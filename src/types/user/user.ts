import { UserEntity, } from './user.entity';

// @ Auth
export type RegisterUserReq = Omit<UserEntity, 'id' | 'isAdmin' | 'createdAt' | 'updatedAt'>;

export type RegisterUserRes = {
  username: string;
  email: string;
}
export type UserEntityWitoutPasswordRes = Omit<UserEntity, 'password'>

export interface LoginUserRes extends UserEntityWitoutPasswordRes{
  accessToken: string
}

// @User
export type UpdateUserRes = { others: Omit<UserEntity, 'isAdmin'> }

export type UserRes = { others : Omit<UserEntity, 'password' >}

export type ListUsersRes = { usersList : UserEntity[]}

export interface UserStats {
  id: string,
  total: number;
}

export type StatsUsers = UserStats[]