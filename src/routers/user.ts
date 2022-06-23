import { Router, } from 'express';

// import { NotFoundError, ValidationError, } from '../utils/error';

export const userRouter = Router ();

userRouter

  .get (
    '/', async (
      req, res
    ) => {
      res.json ({ msg: 'user GET', });
    }
  )

  .post (
    '/', async (
      req, res
    ) => {

      res.json ({ msg: 'user POST', body: req.body, });
    }
  );
