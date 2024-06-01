import { FastifyRequest } from 'fastify';
import { ERRORS } from './errors';
import { utils } from './utils';
import User, { UserDocument } from '../models/user.model';

export const auth = {
  getUser: async (request: FastifyRequest) => {
    const token = utils.getBearerToken(request.headers.authorization);

    if (!token) throw ERRORS.tokenNotExist;

    const user = utils.verifyToken(token) as UserDocument;

    if (!user) throw ERRORS.invalidToken;

    const tempUser = await User.findById(user.id);

    if (!tempUser) throw ERRORS.userNotExists;

    return tempUser;
  },
};
