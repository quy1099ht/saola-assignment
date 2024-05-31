import { FastifyReply } from 'fastify';
import { ERROR_403, ERROR_404, ERROR_409, ERROR_500 } from './constants';

class CustomError extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ERRORS = {
  invalidToken: new CustomError(`${ERROR_403.statusCode}`, 'Token is invalid.'),
  userExists: new CustomError(`${ERROR_409.statusCode}`, 'User already exists'),
  userNotExists: new CustomError(`${ERROR_404.statusCode}`, 'User not exists'),
  userCredError: new CustomError(`${ERROR_409.statusCode}`, 'Invalid credential'),
  tokenError: new CustomError(`${ERROR_409.statusCode}`, 'Invalid Token'),
};

export function handleServerError(reply: FastifyReply, error: any) {
  return reply.status(Number(error?.name || ERROR_500.statusCode)).send({
    status: error?.name,
    message: error?.message,
  });
}
