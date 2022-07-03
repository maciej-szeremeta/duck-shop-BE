export interface UserEntity {
  id?: string;
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  createdAt?: Date | number;
  updatedAt? : Date | number;
}
