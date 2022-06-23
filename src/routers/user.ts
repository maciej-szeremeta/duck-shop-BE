import { Router, } from 'express';

import { NotFoundError, ValidationError, } from '../utils/error';

export const userRouter = Router ();

userRouter

  // * Pobranie wszystkich obiektów 
  .get (
    '/', async (
      req, res
    ) => {
      res.json ({ msg: 'user GET', });
    }
  )

  // * Dodawanie obiektu
  .post (
    '/', async (
      req, res
    ) => {

      res.json ({ msg: 'user POST', body: req.body, });
    }
  );
