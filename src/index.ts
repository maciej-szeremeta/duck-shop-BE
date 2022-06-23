import chalk from 'chalk';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express, {
  json, Router,
} from 'express';
import rateLimit from 'express-rate-limit';

import { config, } from './config/config';

import 'express-async-errors';

import './utils/db';

import { handleError, } from './utils/error';

import { userRouter, } from './routers/user';

const app = express ();

app.use (helmet () );

app.use (rateLimit ({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max     : 100, // Limit each IP to 100 requests per `window`  (here, per 15 minutes)
}));

app.use (cors ({
  origin : 'http://localhost:3000',
  methods: 'GET,POST,DELETE,PUT,PATCH',

  // Ustawia poświadczenia nagłówka
  // credentials: true,
}));

app.use (morgan ('dev'));

app.use (json ());

const router = Router ();
router.use (
  '/user', userRouter
);
app.use (
  '/api', router
);

app.use (handleError );

const PORT:number = config.PORT || 5000;

app.listen (
  PORT, () => {
    return console.log (chalk.yellow.bold (`Server running in ${config.NODE_ENV} mode on http://localhost:${PORT}`));
  }
);
