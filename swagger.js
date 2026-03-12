const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Purchase Point API',
      version: '1.0.0',
      description: 'API documentation for Purchase Point Platform - B2B e-commerce solution',
      contact: {
        name: 'Support',
        email: 'support@purchasepoint.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      },
      {
        url: 'https://api.purchasepoint.com',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using Bearer scheme'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID' },
            email: { type: 'string', description: 'User email' },
            password: { type: 'string', description: 'User password' },
            role: { type: 'string', enum: ['buyer', 'seller', 'admin'], description: 'User role' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Product ID' },
            name: { type: 'string', description: 'Product name' },
            description: { type: 'string', description: 'Product description' },
            price: { type: 'number', description: 'Product price' },
            category: { type: 'string', description: 'Product category' },
            seller_id: { type: 'string', description: 'Seller ID' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        RFQ: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'RFQ ID' },
            title: { type: 'string', description: 'RFQ title' },
            description: { type: 'string', description: 'RFQ description' },
            buyer_id: { type: 'string', description: 'Buyer ID' },
            status: { type: 'string', enum: ['open', 'closed', 'awarded'], description: 'RFQ status' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Order ID' },
            buyer_id: { type: 'string', description: 'Buyer ID' },
            seller_id: { type: 'string', description: 'Seller ID' },
            total_amount: { type: 'number', description: 'Order total amount' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'shipped', 'delivered'], description: 'Order status' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [] // No JSDoc comments - documentation is defined above
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
