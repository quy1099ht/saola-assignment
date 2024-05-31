import fastify from "fastify";
import paymentAccountRoutes from "./routes/paymentAccounts";
import transactionRoutes from "./routes/transactions";
import loadConfig from "./config";
import { utils } from "./utils/utils";
import pino from "pino";
import userRouter from "./routes/users";
loadConfig();

const port = 8080;

const server = fastify({ logger: pino({ level: "info" }) });

server.register(userRouter, { prefix: "/api/user" });
server.register(paymentAccountRoutes, { prefix: "/api/payment-account" });
server.register(transactionRoutes, { prefix: "/api/transaction" });
// server.register(testRoutes);

const start = async () => {
  try {
    server.setErrorHandler((error, request, reply) => {
      server.log.error(error);
    });

    server.get("/", (_, reply) => {
      reply.send({ name: "fastify-typescript" });
    });

    await server.listen({ port });
    server.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
