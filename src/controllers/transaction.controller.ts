import { FastifyReply, FastifyRequest } from 'fastify';
import { handleServerError } from '../utils/errors';
import { auth } from '../utils/auth';

export const withdraw = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await auth.getUser(request);
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const send = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await auth.getUser(request);
  } catch (err) {
    handleServerError(reply, err);
  }
};
