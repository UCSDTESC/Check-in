import * as express from 'express';
import * as path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

import Loader from './Loader';

export default class SwaggerLoader extends Loader {
  static options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'TESC Events User API',
        description: 'API for user information for the TESC Events website.',
        version: '1.0.0',
        contact: {
          email: 'hello@tesc.ucsd.edu',
        },
      },
      components: {
        securitySchemes: {
          APIAuthorizationHeader: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
          },
        },
      },
      security: [{
        APIAuthorizationHeader: [],
      }],
      servers: [{
        url: 'https://api.tesc.events/v2',
      }],
    },
    apis: [
      path.join(__dirname, '../api/controllers/*.ts'),
      path.join(__dirname, '../models/*.ts'),
    ],
  };

  public static async initialiseLoader(app: express.Application) {
    const specs = swaggerJsdoc(SwaggerLoader.options);
    const displayOptions = {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
    };

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, displayOptions));
  }
}
