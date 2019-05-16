import * as express from 'express';
import * as path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

import Loader from './Loader';

export default class SwaggerLoader extends Loader {
  static options = {
    swaggerDefinition: {
      // Like the one described here: https://swagger.io/specification/#infoObject
      info: {
        title: 'TESC Events User API',
        version: '1.0.0',
        description: 'API for user information for the TESC Events website.',
      },
    },
    apis: [path.join(__dirname, '../api/documentation/*.yaml'), path.join(__dirname, '../api/controllers/*.ts')],
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
