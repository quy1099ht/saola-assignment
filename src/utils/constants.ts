import { FastifyRegisterOptions } from 'fastify';
import { Currency } from '../interfaces';

export const STANDARD = {
  CREATED: 201,
  SUCCESS: 200,
  NOCONTENT: 204,
};

export const ERROR_404 = {
  statusCode: 404,
  message: 'NOT_FOUND',
};

export const ERROR_403 = {
  statusCode: 403,
  message: 'FORBIDDEN_ACCESS',
};

export const ERROR_401 = {
  statusCode: 401,
  message: 'UNAUTHORIZED',
};

export const ERROR_500 = {
  statusCode: 500,
  message: 'TRY_AGAIN',
};

export const ERROR_409 = {
  statusCode: 409,
  message: 'DUPLICATE_FOUND',
};

export const ERROR_400 = {
  statusCode: 400,
  message: 'BAD_REQUEST',
};

export const swaggerConfig: FastifyRegisterOptions<any> = {
  openapi: {
    info: {
      title: 'Forest Fire API',
      description: 'Forest Fire API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    tags: [
      {
        name: 'Root',
        description: 'Root endpoints',
      },
    ],
  },
};

export const defaultSecretKey = 'sfjusinuasngusdenafuasghnuijkasf'; // This is just a random text cus I don't want to put empty string in

export const exchangeRates: Record<Currency, Record<Currency, number>> = {
  USD: {
    VND: 23000, // Example exchange rate
    EUR: 0.85, // Example exchange rate
    USD: 1,
  },
  VND: {
    USD: 1 / 23000, // Example exchange rate
    EUR: 1 / 27000, // Example exchange rate (just an example, use real data)
    VND: 1,
  },
  EUR: {
    USD: 1.18, // Example exchange rate
    VND: 27000, // Example exchange rate (just an example, use real data)
    EUR: 1,
  },
};
