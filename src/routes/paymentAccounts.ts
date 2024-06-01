import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { STANDARD } from '../utils/constants';

// export default async function transactionRoutes(
//   fastify: FastifyInstance,
//   opts: FastifyPluginOptions,
// ) {
//   fastify.post('/transactions', async (request, reply) => {
//     const { amount, fromAccountId, toAccountId } = request.body as {
//       amount: number;
//       fromAccountId: string;
//       toAccountId: string;
//     };

//     // const session = await prisma.$transaction(async (prisma) => {
//     //   const fromAccount = await prisma.paymentAccount.findUnique({ where: { id: fromAccountId } });
//     //   const toAccount = await prisma.paymentAccount.findUnique({ where: { id: toAccountId } });

//     //   if (!fromAccount || !toAccount || fromAccount.balance < amount) {
//     //     throw new Error('Transaction error: Invalid accounts or insufficient funds');
//     //   }

//     //   await prisma.paymentAccount.update({
//     //     where: { id: fromAccountId },
//     //     data: { balance: { decrement: amount } },
//     //   });

//     //   await prisma.paymentAccount.update({
//     //     where: { id: toAccountId },
//     //     data: { balance: { increment: amount } },
//     //   });

//     //   const transaction = await prisma.transaction.create({
//     //     data: {
//     //       amount,
//     //       fromAccountId,
//     //       toAccountId,
//     //       status: 'COMPLETED',
//     //     },
//     //   });

//     //   await prisma.paymentHistory.createMany({
//     //     data: [
//     //       { accountId: fromAccountId, transactionId: transaction.id },
//     //       { accountId: toAccountId, transactionId: transaction.id },
//     //     ],
//     //   });

//     //   return transaction;
//     // });

//     // reply.send(session);
//     reply.code(STANDARD.SUCCESS).send({ data: '' });
//   });
// }
import { loginSchema, signupSchema } from '../schema';
import * as controllers from '../controllers';

async function paymentAccountRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/createPaymentAccount',
    handler: controllers.createPaymentAccount,
  });

  fastify.route({
    method: 'POST',
    url: '/editPaymentAccount',
    handler: controllers.editPaymentAccount,
  });
  fastify.route({
    method: 'GET',
    url: '/getPaymentAccounts',
    handler: controllers.getUserPaymentAccounts,
  });
}

export default paymentAccountRouter;
