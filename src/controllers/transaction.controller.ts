import { FastifyReply, FastifyRequest } from 'fastify';
import { handleServerError } from '../utils/errors';

export const withdraw = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const send = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
  } catch (err) {
    handleServerError(reply, err);
  }
};
