import { Router, } from 'express';
import { compare, hash, } from 'bcryptjs';

import { UnauthorizedError, ValidationError, } from '../utils/error';
import { UserRecord, } from '../records/users.record';
import { LoginUserRes, RegisterUserReq, RegisterUserRes, } from '../types';
import { generateAccessToken, TokenPayload, } from '../utils/token';

export const authRouter = Router ();

authRouter

// # Register User
  .post (
    '/register', async (
      req, res
    ) => {

      if (await UserRecord.isEmailTaken (req.body.email)) {
        throw new ValidationError (`Email ${req.body.email} jest zajęte. Wybierz inny email.`);
      }
      if (await UserRecord.isUserNameTaken (req.body.username)) {
        throw new ValidationError (`Nazwa użytkownika ${req.body.username} jest zajęta. Wybierz inny.`);
      }
      const saltAndHashPassword = await hash (
        req.body.password, 10
      );

      const newUser = new UserRecord ({
        username: req.body.username,
        email   : req.body.email,
        password: saltAndHashPassword,
        isAdmin : req.body.isAdmin,
      } as RegisterUserReq);
        
      await newUser.insert ();

      const { username, email, } = newUser;
   
      res.status (201).json ({ username, email, } as RegisterUserRes);
    } 
  )

// # Login Users
  .post (
    '/login', async (
      req, res
    ) => {

      if (!req.body.username || !req.body.password) {
        throw new ValidationError ('Proszę wypełnić dane logowania');
      }
      const user = await UserRecord.getOneByUsername (req.body.username);
      if (!user) {
        throw new UnauthorizedError ('Błędne dane Logowania');
      }
      const validPassword = await compare (
        req.body.password, user.password
      );
      console.log (validPassword);
      if (!validPassword) {
        throw new UnauthorizedError ('Błędne dane logowania hasło');
      }
      const accessToken = generateAccessToken ({ id: user.id, isAdmin: user.isAdmin, } as TokenPayload);
      const { password, ...others } = user;
      res.json ({
        ...others,
        accessToken,
      } as LoginUserRes);
    }
  );
