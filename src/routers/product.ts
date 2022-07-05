import { Router, } from 'express';
import { ProductRecord, } from '../records/products.record';
import { ProductsCategoriesRecord, } from '../records/products_categories.record';
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
        title      : req.body.title,
        description: req.body.description,
        img        : req.body.img,
        size       : req.body.size,
        color      : req.body.color,
        price      : Number (req.body.price),
        
      } as CreateProductReq);
        
      const { id, } = await newProduct.insert ();
      
      const { categories, } = req.body;

      if (!id) {
        throw new NotFoundError ('Brak takiego id');
      }

      categories.map (async (category: string) => {

        const newProductCategory = new ProductsCategoriesRecord ({
          productId   : id,
          categoryName: category,
        });
        await newProductCategory.insert ();
      });

      const productsCategories = await ProductsCategoriesRecord.listAll (id);
      const product = {
        ...newProduct,
        categories: productsCategories,
      };
   
      res.status (201).json ({ product, });
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

      // if (await ProductRecord.isTitleTaken (req.body.title)) {
      //   throw new ValidationError (`Produkt ${req.body.title} znajduje się już w bazie.`);
      // }
      product.title = req.body.title || product.title;
      product.description = req.body.description || product.description;
      product.img = req.body.img || product.img;
      product.size = req.body.size || product.size;
      product.color = req.body.color || product.color;
      product.price = Number (req.body.price) || product.price;
      
      const id = await product.update ();
      
      const { categories, } = req.body;

      if (!id) {
        throw new NotFoundError ('Brak takiego id category');
      }
      const data = await ProductsCategoriesRecord.listAll (id);
      const xx = data.map (({ categoryName, }) => 
        categoryName);
     
      const add:string[] = categories.filter ((x:string) => 
        !xx.includes (x));
      
      if (add.length > 0) {
        console.log (
          'add', add
        );

        add.map (async (a: string) => {

          const newProductsCategory = new ProductsCategoriesRecord ({
            productId   : id,
            categoryName: a,
          });
          await newProductsCategory.insert ();
        });
      }

      const remove:string[] = xx.filter ((x:string) => 
        !categories.includes (x));
      
      if (remove.length > 0) {
        console.log (
          'remove', remove
        );
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
      
      const updateproduct = {
        ...product,
        categories: productsCategories,
      };
      res.json ({ updateproduct, });
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

      const productsCategories = await ProductsCategoriesRecord.listAll (product.id as string);
      
      const oneProduct = {
        ...product,
        categories: productsCategories,
      };
      res.json ({ oneProduct, } ) ;
    }
  );

// @Get All
// .get (
//   '/', async (
//     req, res
//   ) => {
//     const qNew= req.query.top as string;
//     const qCategory= req.query.category as string;
//     const productsList = await ProductRecord.listAll (
//       qNew, qCategory
//     );
//     res.json ({ productsList, });
//   }
// );