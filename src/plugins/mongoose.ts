import { FastifyPluginAsync } from 'fastify';
import mongoose from 'mongoose';

const mongoosePlugin: FastifyPluginAsync = async (fastify, _options) => {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL ||
        'mongodb://admin:admin@localhost:27017/saola-crypto?retryWrites=true&w=majority&authSource=admin',
    );
    fastify.log.info('Mongoose connected to the database');
  } catch (err) {
    fastify.log.error(err, 'Mongoose connection error');
    throw err;
  }

  fastify.addHook('onClose', (_fastify, done) => {
    mongoose.connection.close().then(() => done());
  });
};

export default mongoosePlugin;
