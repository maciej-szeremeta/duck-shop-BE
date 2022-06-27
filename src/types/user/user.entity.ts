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

export type UserEntityWitoutPasswordRes = Omit<UserEntity, 'password'>

export interface LoginUserRes extends UserEntityWitoutPasswordRes{
  accessToken: string
}

export type ListUsersRes = UserEntityWitoutPasswordRes[]

export interface UserStats {
  id: string,
  total: number;
}