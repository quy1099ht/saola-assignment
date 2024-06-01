import fastify from 'fastify';
import paymentAccountRoutes from './routes/paymentAccounts';
import transactionRoutes from './routes/transactions';
import loadConfig from './config';
import pino from 'pino';
import userRouter from './routes/users';
import mongoosePlugin from './plugins/mongoose';
import mongoose from 'mongoose';
import { ERROR_500, STANDARD, swaggerConfig } from './utils/constants';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifySwagger from '@fastify/swagger';
loadConfig();

const port = 8080;

const server = fastify({ logger: pino({ level: 'info' }) });

server.register(mongoosePlugin);

// server.register(testRoutes);

const start = async () => {
  try {
    await server.register(fastifySwagger, swaggerConfig);
    // Register fastifySwaggerUi with route prefix
    await server.register(fastifySwaggerUi, {
      routePrefix: '/docs', // Adjust route prefix as desired
    });

    server.register(userRouter, { prefix: '/api/user' });
    server.register(paymentAccountRoutes, { prefix: '/api/payment-account' });
    server.register(transactionRoutes, { prefix: '/api/transaction' });

    server.setErrorHandler((error, request, reply) => {
      server.log.error(error);
    });

    server.get('/', (_, reply) => {
      reply.send({ name: 'fastify-typescript' });
    });

    server.get('/health', async (request, reply) => {
      const mongoState = mongoose.connection.readyState;
      const isMongoConnected = mongoState === 1; // 1 means connected

      if (isMongoConnected) {
        reply.send({ status: 'ok', db: 'connected' });
      } else {
        reply.status(ERROR_500.statusCode).send({ status: ERROR_500.message, db: 'disconnected' });
      }
    });

    await server.listen({ port,  host: '0.0.0.0'});
    // server.log.info(`Server listening on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
