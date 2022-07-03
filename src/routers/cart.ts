import { Router, } from 'express';
import { CartRecord, } from '../records/cart.record';
import { CreateCartReq, } from '../types';
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, } from '../utils/verify';
import { NotFoundError, ValidationError, } from '../utils/error';

export const cartRouter = Router ();

cartRouter

// @ Create
  .post (
    '/', verifyToken, async (
      req, res
    ) => {

      const newCart = new CartRecord ({
        userId   : req.body.userId,
        productId: req.body.productId,
        quantity : req.body.quantity,
      } as CreateCartReq);
        
      await newCart.insert ();
   
      res.status (201).json ({ newCart, });
    } 
  )

// @Update
  .patch (
    '/:id', verifyTokenAndAuthorization, async (
      req, res
    ) => {
      
      const cart = await CartRecord.getOneById (req.params.id);
      if (!cart) {
        throw new NotFoundError ('Brak takiego id');
      }

      cart.userId = req.body.userId || cart.userId;
      cart.productId = req.body.productId || cart.productId;
      cart.quantity = req.body.quantity || cart.quantity;
      
      await cart.update ();
      res.json ({ cart, });
    }
  )

  // @Delete Cart
  .delete (
    '/:id', verifyTokenAndAuthorization, async (
      req, res
    ) => {
      const user = await CartRecord.getOneById (req.params.id);

      if (!user) {
        throw new ValidationError ('Nie ma takiego koszyka');
      }
      await user.delete ();
      res.status (204).end ();
    }
  )

// @Get One product from cart
  .get (
    '/find/:userId', verifyTokenAndAuthorization, async (
      req, res
    ) => {
      const cart = await CartRecord.getOneCartByUserId (req.params.userId);

      if (!cart) {
        throw new NotFoundError ('Nie odnaleziona takiego użytkownika.');
      }

      res.json ({ cart, } ) ;
    }
  )

// @Get All carts
  .get (
    '/', verifyTokenAndAdmin, async (
      req, res
    ) => {
      const cartsList = await CartRecord.listAll ();
      res.json ({ cartsList, });
    }
  );