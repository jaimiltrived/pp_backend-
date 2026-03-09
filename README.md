# Purchase-point

# Purchase Point Backend

This is a Node.js and Express-based backend API for the "Purchase Point" project, originally migrated from MongoDB to MySQL using Sequelize ORM. It features user authentication, product management, and order processing.

## 🚀 Features

- **User Authentication**: Secure signup and login with hashed passwords (bcryptjs) and JWT tokens.
- **Product Management**: Full CRUD operations for products, including inventory tracking.
- **Order Processing**: Automated order creation with total calculation and real-time stock updates.
- **MySQL Database**: Robust data storage using Sequelize ORM.
- **Automated DB Setup**: Custom script to initialize the database without manual SQL commands.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MySQL Server](https://www.mysql.com/) (Ensure it is running)

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
Open [config/config.json](file:///d:/Purchase%20point/config/config.json) and update your MySQL root password:
```json
{
  "development": {
    "username": "root",
    "password": "YOUR_ACTUAL_PASSWORD",
    "database": "purchase_point",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

### 3. Initialize Database
Run the automated script to create the database schema:
```bash
node init-db.js
```

### 4. Configure Environment Variables
Create a [.env](file:///d:/Purchase%20point/.env) file in the root directory:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### 5. Start the Server
```bash
node index.js
```
The server will be running at `http://localhost:5000`.

## 📡 API Endpoints

### Auth
- `POST /api/auth/signup`: Create a new user account.
- `POST /api/auth/login`: Authenticate and receive a JWT token.

### Products
- `GET /api/products`: Retrieve all products.
- `GET /api/products/:id`: Get a specific product by ID.
- `POST /api/products`: Create a new product (Requires Auth).
- `PUT /api/products/:id`: Update an existing product (Requires Auth).
- `DELETE /api/products/:id`: Remove a product (Requires Auth).

### Orders
- `POST /api/orders`: Place a new order (Requires Auth).
- `GET /api/orders`: View user order history (Requires Auth).
- `GET /api/orders/:id`: Get details of a specific order (Requires Auth).

## 🧪 Testing
I have provided a test script to verify the core API flow:
```bash
node test-mysql.js
```

## 📁 Project Structure
- `config/`: Database configuration and connection.
- `controllers/`: Business logic for handling requests.
- `middleware/`: Authentication and other security checks.
- `models/`: Sequelize schemas for User, Product, and Order.
- `routes/`: API endpoint definitions.
