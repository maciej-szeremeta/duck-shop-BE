import { Router, } from 'express';
import { CategoryRecord, } from '../records/categories.record';
import { ProductRecord, } from '../records/products.record';
import { ProductsCategoriesRecord, } from '../records/products_categories.record';
import { CreateProductReq, ListProductsRes, OneProductRes, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';
import { verifyTokenAndAdmin, } from '../utils/verify';

export const productRouter = Router ();

productRouter

// # Create a new product
  .post (
    '/', verifyTokenAndAdmin, async (
      req, res
    ) => {

      // * Add product
      if (await ProductRecord.isTitleTaken (req.body.title)) {
        throw new ValidationError (`Produkt ${req.body.title} znajduje się w bazie.`);
      }
      const newProduct = new ProductRecord ({
        title      : req.body.title,
        description: req.body.description,
        img        : req.body.img,
        size       : req.body.size,
        colorId    : req.body.colorId,
        price      : Number (req.body.price),
        inStock    : req.body.inStock,
        
      } as CreateProductReq);
      const { id, } = await newProduct.insert ();
      
      // * Add categoriesList to product
      const { categories, } = req.body;
      if (!id) {
        throw new NotFoundError ('Brak takiego id');
      }
      for await (const category of categories) {
        const newProductCategory = new ProductsCategoriesRecord ({
          productId   : id,
          categoryName: category,
        });
        await newProductCategory.insert ();
      }
      const productsCategories = await ProductsCategoriesRecord.listAll (id);
      const product = {
        ...newProduct,
        categories: productsCategories,
      };
   
      res.status (201).json ({ product, });
    } 
  )

// # Update product and product categoriesList
  .patch (
    '/:id', verifyTokenAndAdmin, async (
      req, res
    ) => {
      const product = await ProductRecord.getOneById (req.params.id);
      if (!product) {
        throw new NotFoundError ('Brak takiego id');
      }

      //  * Update product
      // if (await ProductRecord.isTitleTaken (req.body.title)) {
      //   throw new ValidationError (`Produkt ${req.body.title} znajduje się w bazie.`);
      // }
      product.title = req.body.title || product.title;
      product.description = req.body.description || product.description;
      product.img = req.body.img || product.img;
      product.size = req.body.size || product.size;
      product.colorId = req.body.colorId || product.colorId;
      product.price = Number (req.body.price) || product.price;
      product.inStock = req.body.inStock || product.inStock;
      const id = await product.update ();
      
      // * Update product categoriesList
      const { categories, } = req.body;
      if (!id) {
        throw new NotFoundError ('Brak takiego id category');
      }
      const data = await ProductsCategoriesRecord.listAll (id);
      const categoryNames = data.map (({ categoryName, }) => 
        categoryName);
     
      const add:string[] = categories.filter ((x:string) => 
        !categoryNames.includes (x));      
      if (add.length > 0) {
        add.map (async (a: string) => {
          const newProductsCategory = new ProductsCategoriesRecord ({
            productId   : id,
            categoryName: a,
          });
          await newProductsCategory.insert ();
        });
      }

      const remove:string[] = categoryNames.filter ((x:string) => 
        !categories.includes (x));
      if (remove.length > 0) {
        remove.map (async (r: string) => {
          const productCategory = await ProductsCategoriesRecord.getOneByProductIdAndCategory (
            id, r
          );
          if (!productCategory) {
            throw new ValidationError ('Niema takiego produktu');
          }
          await productCategory.delete ();
        });
      }

      const productsCategories = await ProductsCategoriesRecord.listAll (id);
      
      const updateProduct = {
        ...product,
        categories: productsCategories,
      };
      res.json ({ updateProduct, });
    }
  )

// # Get One Product
  .get (
    '/find/:id', async (
      req, res
    ) => {
      const product = await ProductRecord.getOneById (req.params.id);
      if (!product) {
        throw new NotFoundError ('Nie odnaleziona takiego produktu.');
      }
      const productsCategories = await ProductsCategoriesRecord.listAll (product.id as string);
      const oneProduct = {
        ...product,
        categories: productsCategories,
      };
      res.json ({ oneProduct, } as OneProductRes ) ;
    }
  )

  // # Get all filtered product
  .get (
    '/', async (
      req, res
    ) => {
      const qNew= req.query.top as string;
      const qCategory= req.query.category as string;
      const productsList = await ProductRecord.listAll (
        qNew, qCategory
      );
      const categoriesList = await CategoryRecord.listAll ();
 
      res.json ({ productsList, categoriesList, } as ListProductsRes);
    }
  )

  // # Delete product and all product categories
  .delete (
    '/:id', verifyTokenAndAdmin, async (
      req, res
    ) => {

      // * Delete all product categories
      const productsCategories = await ProductsCategoriesRecord.listAll (req.params.id);
      if (!productsCategories) {
        throw new ValidationError ('Nie ma takiego użytkownika');
      }
      for await (const { productId, } of productsCategories) {
        const productsCategoriesItem = await ProductsCategoriesRecord.getOneByProductId (productId);
        if (!productsCategoriesItem) {
          throw new ValidationError ('Brak takiej kategorii');
        }
        await productsCategoriesItem.delete ();
      }
      
      // * Delete product
      const product = await ProductRecord.getOneById (req.params.id);
      if (!product) {
        throw new ValidationError ('Brak takiego produktu');
      }
      await product.delete ();

      // ? Response status
      res.status (204).end ();
    }
  );