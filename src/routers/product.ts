import { Router, } from 'express';

// import { NotFoundError, ValidationError, } from '../utils/error';

export const productRouter = Router ();

productRouter

  .get (
    '/', async (
      req, res
    ) => {
      res.json ({ msg: 'product GET', });
    }
  )

  .post (
    '/', async (
      req, res
    ) => {

      res.json ({ msg: 'product POST', body: req.body, });
    }
  );