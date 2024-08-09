const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const baseUrl = process.env.BASE_URL;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Binar Bank API',
    version: '1.0.0',
    description: 'API documentation for Binar Bank',
  },
  servers: [
    {
      url: baseUrl,
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis:['./src/routes/**/docs/index.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
