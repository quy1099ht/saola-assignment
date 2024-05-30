import { FastifyReply } from 'fastify';
import { ERROR_500 } from './constants';

export const ERRORS = {
  invalidToken: new Error('Token is invalid.'),
  userExists: new Error('User already exists'),
  userNotExists: new Error('User not exists'),
  userCredError: new Error('Invalid credential'),
  tokenError: new Error('Invalid Token'),
};

export function handleServerError(reply: FastifyReply, error: any) {
  return reply.status(ERROR_500.statusCode).send(ERROR_500);
}
