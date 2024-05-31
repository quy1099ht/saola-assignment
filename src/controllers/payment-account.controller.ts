import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_400, STANDARD } from '../utils/constants';
import { ERRORS, handleServerError } from '../utils/errors';
import { ILoginBody, ISignInBody } from '../interfaces';
import { utils } from '../utils/utils';
import User from '../models/user.model';

export const createPaymentAccount = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { username, password } = request.body as ILoginBody;
    console.log(request.headers.authorization);
    
    throw new Error("Welp Test")
  } catch (err) {
    handleServerError(reply, err);
  }
};