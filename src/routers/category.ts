import { Router, } from 'express';
import { ListProductCategoriesRes, } from '../types/category/category';
import { CategoryRecord, } from '../records/categories.record';
import { CreateProductCategoriesReq, CreateProductCategoriesRes, ProductCategoriesRes, UpdateProductCategoriesRes, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';
import { verifyTokenAndAdmin, } from '../utils/verify';

export const categoryRouter = Router ();

categoryRouter

// # Create category
  .post (
    '/', verifyTokenAndAdmin, async (
      req, res
    ) => {

      if (await CategoryRecord.isNameTaken (req.body.name)) {
        throw new ValidationError (`Kategoria ${req.body.name} znajduje się już w bazie.`);
      }
      const newProductCategories = new CategoryRecord ({
        name: req.body.name,
      } as CreateProductCategoriesReq);
        
      await newProductCategories.insert ();
   
      res.status (201).json ({ newProductCategories, } as CreateProductCategoriesRes);
    } 
  )

// # Update category
  .patch (
    '/:id', verifyTokenAndAdmin, async (
      req, res
    ) => {
      
      const productCategories = await CategoryRecord.getOneById (req.params.id);
      
      if (!productCategories) {
        throw new NotFoundError ('Brak takiego id');
      }
      if (await CategoryRecord.isNameTaken (req.body.name)) {
        throw new ValidationError (`Kategoria ${req.body.name} znajduje się już w bazie.`);
      }

      productCategories.name = req.body.name || productCategories.name;

      await productCategories.update ();
      
      res.json ({ productCategories, } as UpdateProductCategoriesRes);
    }
  )

// # Get One Category
  .get (
    '/find/:id', async (
      req, res
    ) => {
      const productCategories = await CategoryRecord.getOneById (req.params.id);

      if (!productCategories) {
        throw new NotFoundError ('Nie odnaleziona takiej kategorii produktu.');
      }

      res.json ({ productCategories, } as ProductCategoriesRes) ;
    }
  )

// # Get All categories
  .get (
    '/', async (
      req, res
    ) => {
      const productCategoriesList = await CategoryRecord.listAll ();
      res.json ({ productCategoriesList, } as ListProductCategoriesRes);
    }
  );