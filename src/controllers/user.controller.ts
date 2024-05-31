import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_400, STANDARD } from '../utils/constants';
import { ERRORS, handleServerError } from '../utils/errors';
import { ISignInBody } from '../interfaces';
import { prisma, utils } from '../utils/utils';

export const login = async (
  request: FastifyRequest<{ Body: ISignInBody }>,
  reply: FastifyReply,
) => {
  try {
    const { username, password, firstName, lastName } = request.body;
    const user = await prisma.user.findUnique({ where: { username: username } });
    if (!user) {
      reply.code(ERROR_400.statusCode).send(ERRORS.userNotExists);
    }
    const checkPass = await utils.compareHash(password, user?.passwordHash);
    if (!checkPass) {
      reply.code(ERROR_400.statusCode).send(ERRORS.userCredError);
    }
    const token = utils.generateToken({
      id: user?.id,
      email: user?.username,
    });
    reply.code(STANDARD.SUCCESS).send({ token });
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const signUp = async (
  request: FastifyRequest<{ Body: ISignInBody }>,
  reply: FastifyReply,
) => {
  try {
    const { username, password, firstName, lastName } = request.body;
    const user = await prisma.user.findUnique({ where: { username: username } });
    if (user) {
      reply.code(409).send(ERRORS.userExists);
    }

    const hashPass = await utils.genSalt(10, password);
    await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        passwordHash: String(hashPass),
      },
    });

    reply.code(STANDARD.SUCCESS).send({
      username,
      firstName,
      lastName,
    });
  } catch (err) {
    handleServerError(reply, err);
  }
};
