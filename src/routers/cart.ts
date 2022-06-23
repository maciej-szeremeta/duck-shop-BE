import { Router, } from 'express';

// import { NotFoundError, ValidationError, } from '../utils/error';

export const cartRouter = Router ();

cartRouter

  .get (
    '/', async (
      req, res
    ) => {
      res.json ({ msg: 'cart GET', });
    }
  )

  .post (
    '/', async (
      req, res
    ) => {

      res.json ({ msg: 'cart POST', body: req.body, });
    }
  );