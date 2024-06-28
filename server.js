const fastify = require('fastify')({ logger: true });
fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: { title: 'fastify-api' },
  },
})
fastify.register(require('./src/routes'));
const mongoose = require('mongoose');
require('dotenv').config();

const apiRoutes = require('./src/routes');

const PORT = process.env.PORT || 3003;
const MONGO_CONN = process.env.MONGO_URI;

// Mongo connection
mongoose
  .connect(MONGO_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Mongo connected succesfully');
  })
  .catch((err) => {
    console.log(`Error in mongo connection: ${err}`);
  });

// API routes
fastify.register(apiRoutes, { prefix: '/api' });

// Run the server!
const start = async () => {
  try {
    await fastify.listen(PORT);
    console.log(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

process.on('SIGINT', () => {
  console.log('SIGINT RECEIVED. Shutting down gracefully');
  fastify.close(() => {
    console.log('Process terminated!');
  });
});

start();
