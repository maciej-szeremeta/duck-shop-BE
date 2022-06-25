import { Router, } from 'express';
import{ hash, } from 'bcryptjs';
import { UserRecord, } from '../records/user.record';
import { NotFoundError, ValidationError, } from '../utils/error';
import { verifyTokenAndAuthorization, } from '../utils/verify';
import { UserEntityWitoutPassword, } from '../types';

export const userRouter = Router ();

userRouter
  .patch (
    '/:id', verifyTokenAndAuthorization, async (
      req, res
    ) => {
      
      const user = await UserRecord.getOneById (req.params.id);
      
      if (!user) {
        throw new NotFoundError ('Brak takiego id');
      }
      if (req.body.email && await UserRecord.isEmailTaken (req.body.email)) {
        throw new ValidationError (`Email ${req.body.email} jest zajęte. Wybierz inny email.`);
      }
      if (req.body.username && await UserRecord.isUserNameTaken (req.body.username)) {
        throw new ValidationError (`Nazwa użytkownika ${req.body.username} jest zajęta. Wybierz inny.`);
      }
      let password;
      if (!req.body.password) {
        password = user.password;
      }
      else {
        password = await hash (
          req.body.password, 10
        );
      }
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.password = password;
      user.isAdmin = Boolean (req.body.isAdmin);
      user.updatedAt = Date.now ();
      
      await user.update ();
      res.json ({ user, } as UserEntityWitoutPassword);
    }
  );