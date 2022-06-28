import { Router, } from 'express';
import { ProductRecord, } from '../records/product.record';
import { CreateProductReq, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';
import { verifyTokenAndAuthorization, verifyTokenAndAdmin, } from '../utils/verify';

export const productRouter = Router ();

productRouter

// @ Create
  .post (
    '/', verifyTokenAndAdmin, async (
      req, res
    ) => {

      if (await ProductRecord.isTitleTaken (req.body.title)) {
        throw new ValidationError (`Produkt ${req.body.title} znajduje się już w bazie.`);
      }

      const newProduct = new ProductRecord ({
        title       : req.body.title,
        description : req.body.description,
        img         : req.body.img,
        categoriesId: req.body.categoriesId,
        size        : req.body.size,
        color       : req.body.color,
        price       : Number (req.body.price),
        
      } as CreateProductReq);
        
      await newProduct.insert ();
   
      res.status (201).json ({ newProduct, });
    } 
  )

// @Update
  .patch (
    '/:id', async (
      req, res
    ) => {
      
      const product = await ProductRecord.getOneById (req.params.id);
      
      if (!product) {
        throw new NotFoundError ('Brak takiego id');
      }
      if (await ProductRecord.isTitleTaken (req.body.title)) {
        throw new ValidationError (`Produkt ${req.body.title} znajduje się już w bazie.`);
      }
      product.title = req.body.title || product.title;
      product.description = req.body.description || product.description;
      product.img = req.body.img || product.img;
      product.categoriesId = req.body.categoriesId || product.categoriesId;
      product.size = req.body.size || product.size;
      product.color = req.body.color || product.color;
      product.price = Number (req.body.price) || product.price;
      
      await product.update ();
      res.json ({ product, });
    }
  );

// .delete (
//   '/:id', verifyTokenAndAdmin, async (
//     req, res
//   ) => {
//     const user = await UserRecord.getOneById (req.params.id);

//     if (!user) {
//       throw new ValidationError ('Niema takiego użytkownika');
//     }
//     await user.delete ();
//     res.status (204).end ();
//   }
// )
// .get (
//   '/find/:id', verifyTokenAndAuthorization, async (
//     req, res
//   ) => {
//     const user = await UserRecord.getOneById (req.params.id);

//     if (!user) {
//       throw new NotFoundError ('Nie odnaleziona takiego użytkownika.');
//     }
//     const { password, ...others } = user ;

//     res.json ({ others, } ) ;
//   }
// )
// .get (
//   '/', verifyTokenAndAdmin, async (
//     req, res
//   ) => {
//     const query= req.query.top as string;
//     const usersList = query ? await UserRecord.listNew (query): await UserRecord.listAll ();
//     res.json ({ usersList, });
//   }
// )
  
// .get (
//   '/stats', verifyTokenAndAdmin, async (
//     req, res
//   ) => {
//     const stats = await UserRecord.getStatsUsers ();
//     res.json ( stats);
//   }
// );