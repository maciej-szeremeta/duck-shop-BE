// Połączenie mysql2/promise lokalnie
import { createPool, } from 'mysql2/promise';
import { config as DB, } from '../config/config';

// * Plączecie MySQL 2

const config = {
  host             : DB.smallDuck.MYSQL_HOST,
  user             : DB.smallDuck.MYSQL_USER,
  password         : DB.smallDuck.MYSQL_PASSWORD,
  port             : DB.smallDuck.MYSQL_PORT,
  database         : DB.smallDuck.MYSQL_DATABASE,
  namedPlaceholders: true,
  decimalNumbers   : true,
};

export const pool = createPool (config);
