const { version } = require('../../package.json');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Secure Bella API documentation',
    version,
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
    },
  ],
};

module.exports = swaggerDef;
