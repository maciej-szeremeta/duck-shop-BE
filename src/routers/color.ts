import { Router, } from 'express';
import { ColorRecord, } from '../records/color.record';
import { CreateColorReq, CreateColorRes, UpdateColorRes, ColorRes, ColorsListRes, } from '../types';
import { NotFoundError, ValidationError, } from '../utils/error';
import { verifyTokenAndAdmin, } from '../utils/verify';

export const colorRouter = Router ();

colorRouter

// # Create color
  .post (
    '/', verifyTokenAndAdmin, async (
      req, res
    ) => {

      if (await ColorRecord.isNameTaken (req.body.name)) {
        throw new ValidationError (`Kolor ${req.body.name} znajduje się już w bazie.`);
      }
      const newColor = new ColorRecord ({
        name: req.body.name,
      } as CreateColorReq); 
      await newColor.insert ();
      res.status (201).json ({ newColor, } as CreateColorRes);
    } 
  )

// # Update color
  .patch (
    '/:id', verifyTokenAndAdmin, async (
      req, res
    ) => {     
      const color = await ColorRecord.getOneById (req.params.id);    
      if (!color) {
        throw new NotFoundError ('Brak takiego id');
      }
      if (await ColorRecord.isNameTaken (req.body.name)) {
        throw new ValidationError (`Kolor ${req.body.name} znajduje się już w bazie.`);
      }
      color.name = req.body.name || color.name;
      await color.update ();
      
      res.json ({ color, } as UpdateColorRes);
    }
  )

// # Get One Color
  .get (
    '/find/:id', async (
      req, res
    ) => {
      const color = await ColorRecord.getOneById (req.params.id);

      if (!color) {
        throw new NotFoundError ('Nie odnaleziona takiej kategorii produktu.');
      }

      res.json ({ color, } as ColorRes) ;
    }
  )

// # Get All categories
  .get (
    '/', async (
      req, res
    ) => {
      const colorsList = await ColorRecord.listAll ();
      res.json ({ colorsList, } as ColorsListRes);
    }
  );