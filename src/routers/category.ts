import { Router, } from 'express';
import { CreateCategoryReq, CreateCategoryRes, ListCategoriesRes, ProductCategoryRes, UpdateCategoryRes, } from '../types';
import { CategoryRecord, } from '../records/category.record';
import { NotFoundError, ValidationError, } from '../utils/error';
import { verifyTokenAndAdmin, } from '../utils/verify';

export const categoryRouter = Router ();

categoryRouter

// # Create category
// @ Admin
  .post (
    '/', verifyTokenAndAdmin, async (
      req, res
    ) => {
      if (await CategoryRecord.isNameTaken (req.body.name)) {
        throw new ValidationError (`Kategoria ${req.body.name} znajduje się już w bazie.`);
      }
      const newCategory = new CategoryRecord ({
        name: req.body.name,
      } as CreateCategoryReq);        
      await newCategory.insert ();   
      res.status (201).json ({ newCategory, } as CreateCategoryRes);
    } 
  )

// # Update category
// @ Admin
  .patch (
    '/:id', verifyTokenAndAdmin, async (
      req, res
    ) => {
      
      const category = await CategoryRecord.getOneById (req.params.id);
      
      if (!category) {
        throw new NotFoundError ('Brak takiego id');
      }
      if (await CategoryRecord.isNameTaken (req.body.name)) {
        throw new ValidationError (`Kategoria ${req.body.name} znajduje się już w bazie.`);
      }

      category.name = req.body.name || category.name;

      await category.update ();
      
      res.json ({ category, } as UpdateCategoryRes);
    }
  )

// # Get One Category
// @ All
  .get (
    '/find/:id', async (
      req, res
    ) => {
      const category = await CategoryRecord.getOneById (req.params.id);

      if (!category) {
        throw new NotFoundError ('Nie odnaleziona takiej kategorii produktu.');
      }

      res.json ({ category, } as ProductCategoryRes) ;
    }
  )

// # Get All categories
// @ All
  .get (
    '/', async (
      req, res
    ) => {
      const categoriesList = await CategoryRecord.listAll ();
      res.json ({ categoriesList, } as ListCategoriesRes);
    }
  );