// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

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
    },
    security: [{ bearerAuth: [] }], // 글로벌하게 인증
    tags: [
      { name: '인증', description: 'Auth' },
      { name: '유저', description: 'User' },
      { name: '프로젝트', description: 'Project' },
      { name: '멤버', description: 'ProjectMember' },
      { name: '할 일', description: 'Task' },
      { name: '하위 할 일', description: 'Subtask' },
      { name: '댓글', description: 'Comment' },
      { name: '파일 업로드', description: 'Files' }
    ]
  },
  apis: [path.join(process.cwd(), 'src', 'routers', '**', '*.ts')]
};

export const swaggerSpec = swaggerJSDoc(options);
