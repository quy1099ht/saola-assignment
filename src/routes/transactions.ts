import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as controllers from '../controllers';

async function transactionRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/withdraw',
    handler: controllers.withdraw,
  });

  fastify.route({
    method: 'POST',
    url: '/send',
    handler: controllers.send,
  });
}

export default transactionRouter;
