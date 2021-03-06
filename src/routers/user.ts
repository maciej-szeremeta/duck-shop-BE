import { Router, } from 'express';
import{ hash, } from 'bcryptjs';
import { UserRecord, } from '../records/user.record';
import { NotFoundError, ValidationError, } from '../utils/error';
import { verifyTokenAndAuthorization, verifyTokenAndAdmin, } from '../utils/verify';
import { ListUsersRes, UserRes, UpdateUserRes, StatsUsers, } from '../types';

export const userRouter = Router ();

userRouter

  // # Update User
  // @ Auth User
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
        throw new ValidationError (`Nazwa użytkownika ${req.body.username} jest zajęta. Wybierz inną nazwę.`);
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
      
      await user.update ();
      const { isAdmin, ...others } = user;
      res.json ({ others, } as UpdateUserRes);
    }
  )

  // # Remove User
  // @ Auth Admin
  .delete (
    '/:id', verifyTokenAndAdmin, async (
      req, res
    ) => {
      const user = await UserRecord.getOneById (req.params.id);
      if (!user) {
        throw new ValidationError ('Niema takiego użytkownika');
      }
      await user.delete ();
      res.status (204).end ();
    }
  )

  // # Get One User
  // @Auth User
  .get (
    '/find/:id', verifyTokenAndAuthorization, async (
      req, res
    ) => {
      const user = await UserRecord.getOneById (req.params.id);
      if (!user) {
        throw new NotFoundError ('Nie odnaleziona takiego użytkownika.');
      }
      const { password, ...others } = user ;
      res.json ({ others, } as UserRes) ;
    }
  )

  // # Get Users List
  // @ Admin
  .get (
    '/', verifyTokenAndAdmin, async (
      req, res
    ) => {
      const query= req.query.top as string;
      const usersList = query ? await UserRecord.listNew (query): await UserRecord.listAll ();
      res.json ({ usersList, } as ListUsersRes);
    }
  )

  // # Get Users Stats
  // @ Admin
  .get (
    '/stats', verifyTokenAndAdmin, async (
      req, res
    ) => {
      const statsUsers = await UserRecord.getStatsUsers ();
      res.json (statsUsers as StatsUsers);
    }
  );