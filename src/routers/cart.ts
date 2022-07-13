import { Router, } from 'express';
import { CartsProductsRecord, } from '../records/carts_products.record';
import { CartRecord, } from '../records/cart.record';

import { CreateCartReq, } from '../types';
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, } from '../utils/verify';
import { NotFoundError, ValidationError, } from '../utils/error';
import { CreateProductCart, } from '../types/carts_products/carts_products';

export const cartRouter = Router ();

cartRouter

  // # Create new cart and add new product to the cart
  // @User
  .post (
    '/', verifyToken, async (
      req, res
    ) => {
      
      let cart = await CartRecord.getCartByUserId (req.body.userId);

      // * Create new Cart
      if (!cart) {
        const newCart = new CartRecord ({
          userId: req.body.userId,
        } as CreateCartReq);
        cart = await newCart.insert (); 
      }

      const isProductCart = await CartsProductsRecord.getOneByProductIdAndCart (
        String (cart.id), req.body.productId
      );

      if (isProductCart) { // * Update product quantity
        isProductCart.quantity += req.body.quantity;
        await isProductCart.update ();
      }

      else {

        // * Add new product to the cart
        const newProductInCart = new CartsProductsRecord ({
          cartId   : cart.id,
          productId: req.body.productId,
          quantity : req.body.quantity,
        } as CreateProductCart );
        await newProductInCart.insert ();
      }

      const listProductsInCart = await CartsProductsRecord.listAll (String (cart.id));

      const userCart = {
        ...cart,
        products: listProductsInCart,
        quantity: listProductsInCart.length,
        total   : 100,
      };
      res.status (201).json ({ userCart, });
    } 
  )

// # Update product quantity 
// @ User
  .patch (
    '/:cartId', verifyTokenAndAuthorization, async (
      req, res
    ) => {
      const cartProduct = await CartsProductsRecord.getOneByProductIdAndCart (
        req.params.cartId, req.body.productId
      );
      if (!cartProduct) {
        throw new NotFoundError ('Brak takiego id');
      }
      cartProduct.quantity = req.body.quantity || cartProduct.quantity;
      await cartProduct.update ();
      res.json ({ cartProduct, });
    }
  )

// # Delete product from cart
// @ User
// .delete (
//   '/:id', verifyTokenAndAuthorization, async (
//     req, res
//   ) => {
//     const cartProduct = await CartsProductsRecord.getOneByProductIdAndCart (
//       req.params.cartId, req.body.productId
//     );
//     if (!cartProduct) {
//       throw new NotFoundError ('Brak takiego id');
//     }
//     await cartProduct.delete ();
//     res.status (204).end ();
//   }
// );

// # Get User's cart
// @ User
  .get (
    '/find/:userId', verifyTokenAndAuthorization, async (
      req, res
    ) => {
      const cart = await CartRecord.getCartByUserId (req.params.userId);
      if (!cart) {
        throw new NotFoundError ('Nie odnaleziona takiego użytkownika.');
      }
      res.json ({ cart, } ) ;
    }
  );

// # Get all carts of Users
// @ Admin
// .get (
//   '/', verifyTokenAndAdmin, async (
//     req, res
//   ) => {
//     const cartsList = await CartRecord.listAll ();
//     res.json ({ cartsList, });
//   }
// );