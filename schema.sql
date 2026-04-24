-- =============================================
-- PURCHASE POINT DATABASE SCHEMA
-- =============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS purchase_point;
USE purchase_point;

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  role ENUM('buyer', 'seller', 'admin'),
  onboarding_step INT DEFAULT 1,
  status ENUM('registered', 'role_selected', 'onboarding_in_progress', 'pending_approval', 'active', 'rejected', 'suspended') DEFAULT 'registered',
  email_verified BOOLEAN DEFAULT FALSE,
  login_attempts INT DEFAULT 0,
  last_login DATETIME,
  account_status ENUM('active', 'pending_approval', 'rejected', 'suspended') DEFAULT 'pending_approval',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
);

-- =============================================
-- 2. ORGANIZATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS Organizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organization_type VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  country VARCHAR(255) NOT NULL,
  state VARCHAR(255),
  city VARCHAR(255),
  post_code VARCHAR(20),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_country (country),
  INDEX idx_city (city)
);

-- =============================================
-- 3. ORGANIZATION INFO TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS OrganizationInfos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_address TEXT NOT NULL,
  website VARCHAR(255),
  authorized_contact VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  tax_number VARCHAR(50),
  tax_registered BOOLEAN DEFAULT FALSE,
  OrganizationId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (OrganizationId) REFERENCES Organizations(id) ON DELETE CASCADE,
  INDEX idx_OrganizationId (OrganizationId)
);

-- =============================================
-- 4. PERSONAL INFO TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS PersonalInfos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  designation VARCHAR(255),
  national_id VARCHAR(50),
  tax_id VARCHAR(50),
  UserId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_UserId (UserId)
);

-- =============================================
-- 5. PAYMENT METHODS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS PaymentMethods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  method_type ENUM('internet_banking', 'paypal', 'google_pay', 'other') NOT NULL,
  payment_identifier VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE,
  UserId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_UserId (UserId),
  INDEX idx_method_type (method_type)
);

-- =============================================
-- 6. INDUSTRY CODES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS IndustryCodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_name (name)
);

-- =============================================
-- 7. USER INDUSTRY TABLE (Junction Table)
-- =============================================
CREATE TABLE IF NOT EXISTS UserIndustries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  UserId INT NOT NULL,
  IndustryCodeId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (IndustryCodeId) REFERENCES IndustryCodes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_industry (UserId, IndustryCodeId),
  INDEX idx_IndustryCodeId (IndustryCodeId)
);

-- =============================================
-- 8. OTP TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS OTPs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(10) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  expiry_time DATETIME NOT NULL,
  attempts INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_expiry_time (expiry_time)
);

-- =============================================
-- 9. PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS Products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  category VARCHAR(255),
  stock INT DEFAULT 0,
  imageUrl VARCHAR(500),
  embedding LONGBLOB,
  UserId INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_name (name),
  INDEX idx_UserId (UserId)
);

-- =============================================
-- 10. ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS Orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  totalAmount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  items JSON NOT NULL,
  UserId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_UserId (UserId),
  INDEX idx_createdAt (createdAt)
);

-- =============================================
-- 11. RFQ TABLE (Request For Quotation)
-- =============================================
CREATE TABLE IF NOT EXISTS RFQs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('open', 'closed', 'awarded') DEFAULT 'open',
  category VARCHAR(255),
  buyer_id INT NOT NULL,
  seller_id INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_seller_id (seller_id),
  INDEX idx_category (category)
);

-- =============================================
-- 12. RFQ ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS RFQItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rfq_id INT NOT NULL,                           -- Links to RFQs table
  product_id INT,                                -- Links to Products table (optional)
  part_number VARCHAR(100),                      -- Internal/supplier part number
  quantity INT NOT NULL,                         -- Quantity requested
  unit_price DECIMAL(10, 2),                     -- Price per unit
  description TEXT,                              -- Item description
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Auto timestamp
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Auto timestamp
  FOREIGN KEY (rfq_id) REFERENCES RFQs(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE SET NULL,
  INDEX idx_rfq_id (rfq_id),
  INDEX idx_part_number (part_number)
);

-- =============================================
-- 13. QUOTATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS Quotations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rfq_id INT NOT NULL,                           -- Links to RFQs table
  supplier_id INT NOT NULL,                      -- Supplier (User) ID
  unit_price DECIMAL(10, 2) NOT NULL,            -- Price per unit
  total_price DECIMAL(12, 2),                    -- Total quote price
  delivery_days INT,                             -- Delivery timeline
  terms TEXT,                                    -- Payment/delivery terms
  status ENUM('draft', 'submitted', 'accepted', 'rejected') DEFAULT 'draft',  -- Quotation status
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Auto timestamp
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,   -- Auto timestamp
  FOREIGN KEY (rfq_id) REFERENCES RFQs(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_rfq_id (rfq_id),
  INDEX idx_supplier_id (supplier_id),
  INDEX idx_status (status)
);

-- =============================================
-- 14. SUPPLIERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS Suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  company_name VARCHAR(255),
  rating DECIMAL(3, 2),
  total_quotes INT DEFAULT 0,
  accepted_quotes INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user (user_id),
  INDEX idx_rating (rating)
);

-- =============================================
-- 15. PART MAPPINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS PartMappings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  internal_part_number VARCHAR(100) NOT NULL,
  supplier_id INT NOT NULL,
  supplier_part_number VARCHAR(100) NOT NULL,
  cost DECIMAL(10, 2),
  lead_time INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES Suppliers(id) ON DELETE CASCADE,
  UNIQUE KEY unique_mapping (internal_part_number, supplier_id),
  INDEX idx_internal_part_number (internal_part_number),
  INDEX idx_supplier_id (supplier_id)
);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_users_email_status ON Users(email, status);
CREATE INDEX idx_orders_user_status ON Orders(UserId, status);
CREATE INDEX idx_products_category_stock ON Products(category, stock);
CREATE INDEX idx_rfq_status_buyer ON RFQs(status, buyer_id);
CREATE INDEX idx_quotations_rfq_supplier ON Quotations(rfq_id, supplier_id);

-- =============================================
-- END OF SCHEMA
-- =============================================
