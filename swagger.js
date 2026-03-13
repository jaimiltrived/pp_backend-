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
        url: '/',
        description: 'Current Host'
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
            id: { type: 'integer' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['buyer', 'seller', 'admin'] },
            status: { type: 'string' },
            onboarding_step: { type: 'integer' }
          }
        },
        Organization: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            address: { type: 'string' },
            company_type: { type: 'string' }
          }
        },
        OrganizationInfo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            registration_number: { type: 'string' },
            tax_id: { type: 'string' },
            employee_count: { type: 'integer' }
          }
        },
        PersonalInfo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            job_title: { type: 'string' },
            phone_number: { type: 'string' }
          }
        },
        RFQ: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            rfq_number: { type: 'string' },
            status: { type: 'string', enum: ['open', 'closed', 'awarded', 'cancelled'] },
            deadline: { type: 'string', format: 'date' }
          }
        },
        RFQItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            part_number: { type: 'string' },
            quantity: { type: 'integer' },
            target_price: { type: 'number' },
            comparison_price: { type: 'number' },
            bom_level: { type: 'integer' }
          }
        },
        Quotation: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            unit_price: { type: 'number' },
            nre_cost: { type: 'number' },
            delivery_days: { type: 'integer' },
            terms: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'accepted', 'rejected'] }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            totalAmount: { type: 'number' },
            status: { type: 'string' },
            items: { type: 'array', items: { type: 'object' } }
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
  apis: ['./routes/*.js', './routes/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
