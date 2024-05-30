import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { loginSchema, signupSchema } from '../schema';
import * as controllers from '../controllers'

const prisma = new PrismaClient();

// export async function userRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
//   fastify.post('/users', async (request, reply) => {
//     const { username, passwordHash } = request.body as { username: string, passwordHash: string };
//     const user = await prisma.user.create({
//       data: { username, passwordHash },
//     });
//     reply.send(user);
//   });
// }

async function userRouter(fastify: FastifyInstance) {
  fastify.decorateRequest('authUser', '')

  fastify.route({
    method: 'POST',
    url: '/login',
    schema: loginSchema,
    handler: controllers.login,
  })

  fastify.route({
    method: 'POST',
    url: '/signup',
    schema: signupSchema,
    handler: controllers.signUp,
  })
}

export default userRouter
