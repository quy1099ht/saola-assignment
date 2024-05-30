import { FastifyReply, FastifyRequest } from 'fastify';
import { STANDARD } from '../utils/constants';
import { ERRORS, handleServerError } from '../utils/errors';
import { ISignInBody } from '../interfaces';
import { prisma, utils } from '../utils/utils';

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // const { email, password } = request.body
    // const user = await prisma.user.findUnique({ where: { email: email } })
    // if (!user) {
    //   reply.code(ERROR400.statusCode).send(ERRORS.userNotExists)
    // }
    // const checkPass = await utils.compareHash(password, user.password)
    // if (!checkPass) {
    //   reply.code(ERROR400.statusCode).send(ERRORS.userCredError)
    // }
    // const token = JWT.sign(
    //   {
    //     id: user.id,
    //     email: user.email,
    //   },
    //   process.env.APP_JWT_SECRET,
    // )
    reply.code(STANDARD.SUCCESS).send(null);
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
    await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        password,
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
