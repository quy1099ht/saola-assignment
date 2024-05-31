import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_400, STANDARD } from '../utils/constants';
import { ERRORS, handleServerError } from '../utils/errors';
import { ILoginBody, ISignInBody } from '../interfaces';
import { utils } from '../utils/utils';
import User from '../models/user.model';

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { username, password } = request.body as ILoginBody;
    const user = await User.findOne({ username: username });
    if (!user) {
      throw ERRORS.userNotExists;
    }

    const checkPass = await utils.compareHash(password, user.passwordHash);
    if (!checkPass) {
      throw ERRORS.userCredError;
    }

    const token = utils.generateToken({
      id: user._id,
      email: user.username,
    });

    reply.code(STANDARD.SUCCESS).send({ token });
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { username, password, firstName, lastName } = request.body as ISignInBody;
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      throw ERRORS.userExists;
    }

    const hashPass = await utils.genSalt(10, password);
    const newUser = new User({
      username,
      firstName,
      lastName,
      passwordHash: hashPass,
    });
    await newUser.save();

    reply.code(STANDARD.SUCCESS).send({
      username,
      firstName,
      lastName,
    });
  } catch (err) {
    handleServerError(reply, err);
  }
};
