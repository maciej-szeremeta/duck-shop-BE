import { Router, } from 'express';

// import { NotFoundError, ValidationError, } from '../utils/error';

export const orderRouter = Router ();

orderRouter

  .get (
    '/', async (
      req, res
    ) => {
      res.json ({ msg: 'order GET', });
    }
  )

  .post (
    '/', async (
      req, res
    ) => {

      res.json ({ msg: 'order POST', body: req.body, });
    }
  );