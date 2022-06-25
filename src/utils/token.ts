import { sign, } from 'jsonwebtoken';
import { config, } from '../config/config';

export interface TokenPayload {
  id: string;
  isAdmin: boolean;
}

export const generateAccessToken = (user: TokenPayload):string => {
  return sign (
    { id: user.id, isAdmin: user.isAdmin, }, config.JWT_KEY, {
      expiresIn: '3d',
    }
  );
};