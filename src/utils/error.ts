// res.status(200) // Ok
// res.status(201) // Created
// res.status(204) // No content
// res.status(400) // Bad request
// res.status(401) // Unauthorized
// res.status(403) // Forbidden
// res.status(404) // Not found
// res.status(500) // Server error

/* eslint-disable max-classes-per-file */
import { NextFunction, Request, Response, } from 'express';

export class ValidationError extends Error {}
export class NotFoundError extends Error {}
export class UnauthorizedError extends Error {}
export class ForbidenError extends Error {}

export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // * Nieautoryzowany dostęp – żądanie zasobu, który wymaga uwierzytelnienia (Niezalogowany brak dostępu)
  if (err instanceof UnauthorizedError) {
    res.status (401).json ({
      message: err.message !== '' ? err.message : 'Nieautoryzowany dostęp',
    });
    return;
  }

  // * Zabroniony – serwer zrozumiał zapytanie lecz konfiguracja bezpieczeństwa zabrania mu zwrócić żądany zasób (Zalogowany brak uprawnień)
  if (err instanceof ForbidenError) {
    res.status (403).json ({
      message: err.message !== '' ? err.message : 'Zabroniony dostęp',
    });
    return;
  }

  // * Nie znaleziono – serwer nie odnalazł zasobu według podanego URL ani niczego co by wskazywało na istnienie takiego zasobu w przeszłości
  if (err instanceof NotFoundError) {
    res.status (404).json ({
      message:
        err.message !== ''? err.message: 'Nie można znaleźć elementu o danym ID/Email',
    });
    return;
  }

  if (err instanceof ValidationError) {
    console.error (err);
  }

  // * Nieprawidłowe zapytanie – żądanie nie może być obsłużone przez serwer z powodu błędnej składni zapytania
  // * Wewnętrzny błąd serwera – serwer napotkał niespodziewane trudności, które uniemożliwiły zrealizowanie żądania
  res.status (err instanceof ValidationError ? 400 : 500).json ({
    message:
      err instanceof ValidationError? err.message: 'Przepraszamy spróbuj ponownie za kilka minut',
  });
};
