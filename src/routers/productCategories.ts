import { Router, } from 'express';
import { ProductCategoriesRecord, } from '../records/productCategories.record';
import { CreateProductCategoriesReq, CreateProductCategoriesRes, UpdateProductCategoriesRes, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';
import { verifyTokenAndAdmin, } from '../utils/verify';

export const productCategoriesRouter = Router ();

productCategoriesRouter

// @ Create
  .post (
    '/', verifyTokenAndAdmin, async (
      req, res
    ) => {

      if (await ProductCategoriesRecord.isNameTaken (req.body.name)) {
        throw new ValidationError (`Kategoria ${req.body.name} znajduje się już w bazie.`);
      }

      const newProductCategories = new ProductCategoriesRecord ({
        name: req.body.name,
        
      } as CreateProductCategoriesReq);
        
      await newProductCategories.insert ();
   
      res.status (201).json ({ newProductCategories, } as CreateProductCategoriesRes);
    } 
  )

// @Update
  .patch (
    '/:id', verifyTokenAndAdmin, async (
      req, res
    ) => {
      
      const productCategories = await ProductCategoriesRecord.getOneById (req.params.id);
      
      if (!productCategories) {
        throw new NotFoundError ('Brak takiego id');
      }
      if (await ProductCategoriesRecord.isNameTaken (req.body.name)) {
        throw new ValidationError (`Kategoria ${req.body.name} znajduje się już w bazie.`);
      }

      productCategories.name = req.body.name || productCategories.name;

      await ProductCategoriesRecord.update ();
      
      res.json ({ productCategories, } as UpdateProductCategoriesRes);
    }
  )

// @Get
  .get (
    '/find/:id', async (
      req, res
    ) => {
      const productCategories = await ProductCategoriesRecord.getOneById (req.params.id);

      if (!productCategories) {
        throw new NotFoundError ('Nie odnaleziona takiej kategorii produktu.');
      }

      res.json ({ productCategories, } ) ;
    }
  )

// @Get All
  .get (
    '/', async (
      req, res
    ) => {
      const productCategoriesList = await ProductCategoriesRecord.listAll ();
      res.json ({ productCategoriesList, });
    }
  );