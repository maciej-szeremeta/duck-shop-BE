import chalk from 'chalk';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express, {
  json, Router, static as eStatic,
} from 'express';
import rateLimit from 'express-rate-limit';

import path from 'path';
import { config, } from './config/config';

import 'express-async-errors';

import './utils/db';

import { handleError, } from './utils/error';

import { userRouter, } from './routers/user';
import { authRouter, } from './routers/auth';
import { productRouter, } from './routers/product';
import { categoryRouter, } from './routers/category';
import { cartRouter, } from './routers/cart';
import { colorRouter, } from './routers/color';

const app = express ();

app.use (helmet ({
  crossOriginResourcePolicy: false,
}) );

app.use (rateLimit ({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max     : 100, // Limit each IP to 100 requests per `window`  (here, per 15 minutes)
}));

app.use (cors ({
  origin : [ 'http://localhost:3000', '*', ],
  methods: 'GET,POST,DELETE,PUT,PATCH',

  // Ustawia poświadczenia nagłówka
  // credentials: true,
}));

app.use (morgan ('dev'));

app.use (json ());

// * Pliki Statyczne
app.use (eStatic ('public'));

const router = Router ();
router.use (
  '/test', (
    req, res
  ) => { res.json ({ message: 'Api OK', }); }
);
router.use (
  '/insomnia', (
    req, res
  ) => {
    const file = path.join (
      __dirname, '../public/DuckShop.postman_insomnia.json'
    );
    res.download (file);
  }
);
router.use (
  '/auth', authRouter
);
router.use (
  '/user', userRouter
);
router.use (
  '/product', productRouter
);
router.use (
  '/category', categoryRouter
);
router.use (
  '/cart', cartRouter
);
router.use (
  '/color', colorRouter
);
app.use (
  '/api', router
);

app.use (handleError );

const PORT = config.PORT || 5000;

app.listen (
  PORT, () => {
    return console.log (chalk.yellow.bold (`Server running in ${config.NODE_ENV} mode on http://localhost:${PORT}`));
  }
);
