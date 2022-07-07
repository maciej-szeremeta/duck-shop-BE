import { Router, } from 'express';
import { OrderRecord, } from '../records/order.record';
import { OrdersProductsRecord, } from '../records/orders_products.record';
import { UserProductRecord, } from '../records/user_product.record';
import { CreateOrderReq, ListAllOrdersRes, UpdateOrderRes, } from '../types';

import { NotFoundError, ValidationError, } from '../utils/error';

import { verifyTokenAndAuthorization, verifyTokenAndAdmin, } from '../utils/verify';

export const orderRouter = Router ();

orderRouter

// # Create Order
  .post (
    '/', /* verifyTokenAndAdmin, */ async (
      req, res
    ) => {

      // * Create Order
      const newOrder = new OrderRecord ({
        userId    : req.body.userId,
        amount    : req.body.amount,
        address   : req.body.address,
        statusName: req.body.statusName,
      } as CreateOrderReq);
        
      const { userId, } = await newOrder.insert ();

      // * Add productsList to order
      const { products, } = req.body;

      if (!userId) {
        throw new NotFoundError ('Brak takiego id');
      }
      for await (const { productId, quantity, } of products) {

        const newOrderProduct = new OrdersProductsRecord ({
          userId,
          productId,
          quantity,
        });
        await newOrderProduct.insert ();
      }

      const ordersProducts = await OrdersProductsRecord.listAll (userId);

      const order = {
        ...newOrder,
        products: ordersProducts,
      };

      res.status (201).json ({ order, });
    } 
  )

// # Update Order
  .patch (
    '/:id', verifyTokenAndAdmin, async (
      req, res
    ) => {
      
      const order = await OrderRecord.getOneById (req.params.id);
      if (!order) {
        throw new NotFoundError ('Brak takiego id');
      }

      order.userId = req.body.userId || order.userId;
      order.amount = req.body.amount || order.amount;
      order.address = req.body.address || order.address;
      order.statusName = req.body.statusName || order.statusName;
      
      await order.update ();
      res.json ({ order, } as UpdateOrderRes);
    }
  )

  // # Delete Order
  .delete (
    '/:id', verifyTokenAndAdmin, async (
      req, res
    ) => {
      const user = await OrderRecord.getOneById (req.params.id);

      if (!user) {
        throw new ValidationError ('Nie ma takiego zamówienia');
      }
      await user.delete ();
      res.status (204).end ();
    }
  )

// # Get User Order
  .get (
    '/find/:userId', verifyTokenAndAuthorization, async (
      req, res
    ) => {
      const userOrderList = await OrderRecord.getOrderByUserId (req.params.userId);
      console.log (userOrderList);
      if (!userOrderList) {
        throw new NotFoundError ('Nie odnaleziona takiego zamówienia.');
      }
      const userProductsList = await UserProductRecord.getOrderByUserId (userOrderList.userId as string);
      const order = {
        userId    : userOrderList.userId,
        product   : userProductsList,
        amount    : userOrderList.amount,
        address   : userOrderList.address,
        statusName: userOrderList.statusName,
      };
      res.json ({ order, } ) ;
    }
  )

// # Get All Orders
  .get (
    '/', /* verifyTokenAndAdmin, */ async (
      req, res
    ) => {
      const ordersList = await OrderRecord.listAll ();
      res.json ({ ordersList, } as ListAllOrdersRes);
    }
  )

  // # Get Stats Summary Order
  .get (
    '/income', /* verifyTokenAndAdmin, */ async (
      req, res
    ) => {
      const stats = await OrderRecord.getStatsOrders ();
      res.json ( stats);
    }
  );