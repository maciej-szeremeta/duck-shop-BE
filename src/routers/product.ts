import { Router, } from 'express';
import { ProductRecord, } from '../records/product.record';
import { CreateProductReq, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';
import { verifyTokenAndAdmin, } from '../utils/verify';

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
    '/:id', verifyTokenAndAdmin, async (
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
      product.categoryId = req.body.categoryId || product.categoryId;
      product.size = req.body.size || product.size;
      product.color = req.body.color || product.color;
      product.price = Number (req.body.price) || product.price;
      
      await product.update ();
      res.json ({ product, });
    }
  )

// @Get
  .get (
    '/find/:id', async (
      req, res
    ) => {
      const product = await ProductRecord.getOneById (req.params.id);

      if (!product) {
        throw new NotFoundError ('Nie odnaleziona takiego użytkownika.');
      }

      res.json ({ product, } ) ;
    }
  )

  // @Get All
  .get (
    '/', async (
      req, res
    ) => {
      const qNew= req.query.top as string;
      const qCategory= req.query.category as string;
      const productsList = await ProductRecord.listAll (
        qNew, qCategory
      );
      res.json ({ productsList, });
    }
  );