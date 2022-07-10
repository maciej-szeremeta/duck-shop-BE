import { verify, } from 'jsonwebtoken';
import { NextFunction, Request, Response, } from 'express';
import { Console, } from 'console';
import { ForbidenError, UnauthorizedError, } from './error';
import { config, } from '../config/config';

export interface VerifyPayload {
  id: string;
  isAdmin: number;
  iat: number;
  exp?: number;
}

// ! Sprawdzenie czy Mamy User-a
// Rozszerzamy Request
export type ExtendRequest = Request & {
  user?: VerifyPayload;
};

export const verifyToken = (
  req: ExtendRequest,
  res: Response,
  next: NextFunction
) => {

  // Pobieram z nagłówka authorization
  const authHeader = req.headers.authorization;

  // Sprawdzenie czy istnieje authHeader
  if (!authHeader) {
    throw new UnauthorizedError ('Nie jesteś uwierzytelniony/You are not authenticate');
  }
  else {

    //   Rozdzielam Bearer od podpisu
    const [ , token, ] = authHeader.split (' ');
    verify (
      token, config.JWT_KEY, (
        err, user
      ) => {
        if (err) {

          // Sprawdzam czy token jest poprawny
          throw new ForbidenError ('Token jest nieprawidłowy!');
        }

        // Zwracam dane użytkownika
        req.user = user as VerifyPayload;
        next ();
      }
    );
  }
};

export const verifyTokenAndAuthorization = (
  req:ExtendRequest, res: Response, next: NextFunction
) => {
  verifyToken (
    req, res, () => {
      if ((req.user as VerifyPayload).id === req.params.id || (req.user as VerifyPayload).isAdmin) {
        next ();
      }
      else {
        throw new ForbidenError ('Dostęp do tego zasobu posiada tylko Uzytkownik i Administrator');
      }
    }
  );
};

export const verifyTokenAndAdmin = (
  req:ExtendRequest, res: Response, next: NextFunction
) => {
  verifyToken (
    req, res, () => {
      console.log ((req.user as VerifyPayload).isAdmin);
      if ((req.user as VerifyPayload).isAdmin) {
        next ();
      }
      else {
        throw new ForbidenError ('Dostęp do tego zasobu posiada tylko Administrator');
      }
    }
  );
};