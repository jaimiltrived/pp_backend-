require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/swagger.json'
  }
}));

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/rfq', require('./routes/rfq'));
app.use('/api/procurement/rfq', require('./routes/procurement/rfq'));
app.use('/api/procurement/dropdown', require('./routes/procurement/dropdown'));
app.use('/api/supplier/rfq', require('./routes/supplier/rfq'));
app.use('/api/supplier', require('./routes/supplier/supplier'));
app.use('/api/onboarding', require('./routes/onboarding'));
app.use('/api/user', require('./routes/user'));
app.use('/api/buyer', require('./routes/buyer'));
app.use('/api/seller', require('./routes/seller'));
app.use('/api/admin', require('./routes/admin'));

// Database Connection
db.sequelize.sync({ alter: true })
  .then(() => console.log('MySQL Connected and Tables Altered'))
  .catch(err => console.error('MySQL Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
