import { UserEntity, } from './user.entity';

// // * Typ Danych przesłanych z Frontendu
// // Dane tworzenia nowego Children (POST)
// export type RegisterUserReq = Omit<UserEntity, 'id'>;

// // * Typ Danych przesłanych do Frontendu
// // Dane przesłane do Frontendu (GET)

// export type LoginUserReq =
//   | Pick<UserEntity, 'username' | 'isAdmin'>
//   | 'accessToken'
//   | 'refreshToken';
