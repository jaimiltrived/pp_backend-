

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

### 2. Configure Environment Variables
Create a [.env](file:///c:/Users/ADMIN/Downloads/Purchase%20point/Purchase-point/.env) file in the root directory (one has been created for you):
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key

# Database Configuration
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=password
DB_NAME=purchase_point
DB_DIALECT=mysql
```

### 3. Initialize Database
Run the automated script to create the database schema:
```bash
node init-db.js
```

### 4. Start the Server
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
- `routes/`: API endpoint definitions.

## 📊 RFQ Data Analysis (Purchase point_Analysis 1.xlsx)

The `Purchase point_Analysis 1.xlsx` file serves as a comprehensive Request For Quotation (RFQ) evaluation toolkit. It tracks and analyzes supplier quotes vs comparison prices to identify savings. Here is a breakdown of its core sheets:

### Key Sheets & Purpose:
1. **RFQ-Tracking**:
   - Acts as the main dashboard tracking the status of various RFQs (e.g., Dates, Deadlines, Status, Supplier comparisons).
2. **Detailanalysis**:
   - Provides granular information at the part number (P/N) and bill of material (BOM) level. 
   - Tracks **Requested Quantities**, **Quotes by Suppliers**, **Target Price**, and calculates explicit variations: **Deviation to Comparison Price (%)** and **Deviation to Best Price (%)**.
3. **Supplier selection**:
   - Highlights the 1st, 2nd, and 3rd Best Price providers for specific quotes and parts. 
   - Defines maximum achievable savings and facilitates final supplier decisions based on comparative net prices and NRE (Non-Recurring Engineering) costs.
4. **RFQ-Input**:
   - The primary data intake sheet capturing the raw unit prices and one-off costs from up to 4 different suppliers alongside the internal baseline (Comparison Price).
5. **Adapter RFQ-Generator**:
   - A mapping list of Part Numbers (e.g., `111-1`, `333-1`) used to streamline data generation.
6. **RFQ-Supplier & DropDown**:
   - Reference datasets containing the supplier names (`Lieferant 1`, `Lieferant 2`, etc.) and dropdown list options for dynamic data validation across the workbook.

### Business Value:
This tool aligns with the Purchase Point backend by providing robust off-platform supply chain analysis. It is designed to automatically rank suppliers and compute maximum potential savings, aiding procurement teams in making data-driven purchasing decisions.
