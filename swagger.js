// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation'
    },
    servers: [{ url: 'http://localhost:3000', description: 'local' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  apis: ['./src/routes/**/*.js', './src/**/*.js'] // 너 프로젝트 구조에 맞게 수정
};

export const swaggerSpec = swaggerJSDoc(options);
