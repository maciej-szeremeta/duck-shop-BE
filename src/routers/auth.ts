import { Router, } from 'express';
import { compare, hash, } from 'bcryptjs';

import { NotFoundError, UnauthorizedError, ValidationError, } from '../utils/error';
import { UserRecord, } from '../records/user.record';
import { RegisterUserReq, } from '../types';

export const authRouter = Router ();

authRouter

// @ Register
  .post (
    '/register', async (
      req, res
    ) => {

      if (await UserRecord.isEmailTaken (req.body.email)) {
        throw new ValidationError (`Email ${req.body.email} jest zajęte. Wybierz inny email.`);
      }
      if (await UserRecord.isUserNameTaken (req.body.username)) {
        throw new ValidationError (`ENazwa użytkownika ${req.body.username} jest zajęta. Wybierz inny.`);
      }
      const hashedPassword = await hash (
        req.body.password, 1
      );
      const hashedUser = {
        username: req.body.username,
        email   : req.body.email,
        password: hashedPassword,
        isAdmin : req.body.isAdmin,
      };

      const newUser = new UserRecord (hashedUser as RegisterUserReq);
      await newUser.insert ();

      // Zwracane tylko te dane które są niezbędne
      // const { username, email, } = newUser;
   
      // res.status (201).json ({ username, email, });
      res.status (201).json (newUser);
    } 
  )

// Login
  .post (
    '/login', async (
      req, res
    ) => {

      // Sprawdzamy wpisanych danych
      if (!req.body.username || !req.body.password) {
        throw new ValidationError ('Proszę wypełnić dane logowania');
      }

      const user = await UserRecord.getOneByUsername (req.body.username);

      // Sprawdzamy czy dany user istnieje w bazie (można zrobić w record)
      if (!user) {
        throw new UnauthorizedError ('Błędne dane Logowania');
      }

      // Sprawdzamy czy wpisane jest poprawne hasło
      const validPassword = await compare (
        req.body.password, user.password
      );
      console.log (validPassword);
      if (!validPassword) {
        throw new UnauthorizedError ('Błędne dane logowania hasło');
      }

      console.log (user);

      // Jeżeli wszystkie dane są poprawne generowany jest podpis i jego wersja odświeżająca
      // const { id, isAdmin, } = user as UserVerify;
      // const accessToken = generateAccessToken ({ id, isAdmin, });
      // const refreshToken = generateRefreshToken ({ id, isAdmin, });

      // // Zapisanie do tablicy
      // refreshTokens.push (refreshToken);

      // res.json ({
      //   username: user.username,
      //   isAdmin : user.isAdmin,
      //   accessToken,
      //   refreshToken,
      // } as LoginUserReq);
    }
  );
