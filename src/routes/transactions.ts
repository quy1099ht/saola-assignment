import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { AccountType, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function paymentAccountRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.post('/payment-accounts', async (request, reply) => {
    const { userId, accountType, accountNumber, balance } = request.body as { userId: string, accountType: AccountType, accountNumber: string, balance: number };
    const paymentAccount = await prisma.paymentAccount.create({
      data: { userId, accountType, accountNumber, balance },
    });
    reply.send(paymentAccount);
  });
}
