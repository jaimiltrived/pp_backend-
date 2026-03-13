# Purchase Point Platform

Purchase Point is a robust B2B e-commerce and procurement platform designed to streamline the Request for Quotation (RFQ) process, manage supplier relationships, and provide deep financial analysis for industrial procurement.

---

## 📋 Basic Project Details
- **Version**: 1.0.0
- **Status**: Stable / Development
- **Main Entry**: `index.js`
- **Default Port**: `5000`
- **Active Endpoints**: 73 (Fully Documented)
- **Database**: MySQL (via Sequelize)

## 🛠 Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher
- **MySQL Server**: v8.0 or higher (Running on port 3307 or 3306)

## ⚡ Quick Start
1. `npm install`
2. Configure `.env` with your DB credentials.
3. `node index.js` (Server will start and sync tables).
4. `node test-full-workflow.js` (Run automated end-to-end test).

---

## 🔄 Step-by-Step Business Workflow

### Step 1: User Onboarding & Identity
- **Signup**: Users register with email and password.
- **Role Selection**: User chooses to be a `Buyer` or `Seller`.
- **OTP Verification**: A 6-digit code is sent to the email to verify identity.
- **Organization Setup**: User provides company details, tax IDs, and industry codes.
- **Approval**: New accounts enter a `pending_approval` state until an Admin reviews and activates them.

### Step 2: RFQ Creation (Buyer)
- **Initiation**: An approved Buyer creates a Request for Quotation (RFQ) with items, quantities, and deadlines.
- **Analysis Baseline**: Buyer sets `Comparison Price` and `Target Price` for each item to drive future analysis.
- **Assignment**: Buyer can assign specific approved Sellers to participate in the RFQ.

### Step 3: Quotation Submission (Seller)
- **Review**: Approved Sellers see RFQs they are invited to or that are marked as open.
- **Bidding**: Sellers submit `Unit Price`, `NRE Costs`, and `Delivery Lead Times`.
- **Revisions**: Sellers can update their quotes until the RFQ is closed or awarded.

### Step 4: Analysis & Selection (Buyer)
- **Comparison View**: Buyer uses the Analysis Dashboard to see all bids side-by-side.
- **Automated Math**: The system highlights the **Best Price** and calculates the **Percentage Deviation** from the budget.
- **Awarding**: Buyer selects the winning bid, which automatically updates the RFQ status to `Awarded` and notifies the Seller.

### Step 5: Order & Marketplace
- **Order Placement**: Awarded RFQs can be converted into Orders.
- **Status Tracking**: Orders move from `Pending` -> `Confirmed` -> `Shipped` -> `Delivered`.
- **Product Search**: Users can explore general marketplace products using AI-powered semantic search.

---

## 🚀 Key Features

### 1. Advanced Onboarding System
- **Multi-step Registration**: Secure onboarding for Buyers, Sellers, and Admins.
- **Identity Verification**: OTP-based email verification and organization validation.
- **Profile Management**: Detailed tracking of personal and company information.

### 2. Strategic Procurement (RFQ)
- **RFQ Lifecycle**: Create, track, and award RFQs with full status management.
- **BOM Management**: Import Bill of Materials and link them to RFQ items.
- **Supplier Matching**: Assign specific suppliers to RFQs for targeted bidding.

### 3. Deep Financial Analysis
- **Price Comparison**: Automatic calculation of best prices across all supplier quotes.
- **Deviation Tracking**: Real-time analysis of price variances against target and comparison baselines.
- **Savings Dashboard**: Global view of potential and realized savings across procurement activities.

### 4. Marketplace & Orders
- **AI-Powered Search**: Semantic search capabilities for product discovery.
- **Order Management**: End-to-end tracking from pending to delivered status.
- **Product Catalog**: Multi-category product management for sellers.

### 5. Admin Governance
- **User Review**: Centralized dashboard for approving or rejecting new business participants.
- **Account Security**: Suspend or reactivate accounts based on compliance.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS
- **Documentation**: Swagger UI (OpenAPI 3.0)
- **Testing**: Automated Workflow Testing with Axios

---

## 📦 Installation & Setup

### 1. Clone & Install
```bash
git clone <repository-url>
cd "Purchase point"
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=purchase_point
DB_DIALECT=mysql
JWT_SECRET=04f058abc86f6e6c016b595d68a1ec8f76609f81e931148e91240c46da68d10f
PORT=5000
```

### 3. Initialize Database
Ensure your MySQL server is running, then start the application to sync tables:
```bash
node index.js
```

### 4. Seed Data (Optional)
```bash
node seed-industries.js
```

### 🗄️ Database Backup
A complete SQL export of the database schema and structure is included for manual import:
- **File**: `purchase_point.sql`
- **Instructions**: You can import this file using MySQL Workbench, phpMyAdmin, or the command line:
  ```bash
  mysql -u root -p purchase_point < purchase_point.sql
  ```

---

## 📖 API Documentation

The platform features comprehensive interactive documentation.

- **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Specifications**: [http://localhost:5000/swagger.json](http://localhost:5000/swagger.json)

---

## 🧪 Testing the System

To verify the complete business workflow (Signup -> Approval -> RFQ -> Quote -> Award), run:
```bash
node test-full-workflow.js
```

This script automates:
1. Creating Admin, Buyer, and Seller accounts.
2. Admin approval of participants.
3. Buyer creating an RFQ.
4. Seller submitting a quotation.
5. Buyer awarding the contract based on analysis.

---

## 📂 Project Structure

- `/models`: Sequelize database schemas.
- `/controllers`: Business logic for RFQs, Auth, and Analysis.
- `/routes`: API endpoint definitions organized by role (Buyer, Seller, Admin).
- `/middleware`: Authentication and Role-Based Access Control (RBAC).
- `index.js`: Main entry point.
- `swagger.js`: Documentation configuration.

---

## 🤝 Support
For any issues or questions, contact [support@purchasepoint.com](mailto:support@purchasepoint.com).
