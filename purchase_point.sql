-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Mar 13, 2026 at 01:33 PM
-- Server version: 8.0.30
-- PHP Version: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `purchase_point`
--

-- --------------------------------------------------------

--
-- Table structure for table `industrycodes`
--

CREATE TABLE `industrycodes` (
  `id` int NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `industrycodes`
--

INSERT INTO `industrycodes` (`id`, `code`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'IT001', 'Information Technology', 'Software, hardware and services', '2026-03-13 12:35:13', '2026-03-13 12:35:13'),
(2, 'AG001', 'Agriculture', 'Farming and food production', '2026-03-13 12:35:13', '2026-03-13 12:35:13'),
(3, 'MF001', 'Manufacturing', 'Factory and production', '2026-03-13 12:35:13', '2026-03-13 12:35:13'),
(4, 'HC001', 'Healthcare', 'Medical and health services', '2026-03-13 12:35:13', '2026-03-13 12:35:13'),
(5, 'ED001', 'Education', 'Teaching and training', '2026-03-13 12:35:13', '2026-03-13 12:35:13');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  `items` json NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizationinfos`
--

CREATE TABLE `organizationinfos` (
  `id` int NOT NULL,
  `full_address` text NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `authorized_contact` varchar(255) NOT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `tax_number` varchar(255) DEFAULT NULL,
  `tax_registered` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `organizationinfos`
--

INSERT INTO `organizationinfos` (`id`, `full_address`, `website`, `authorized_contact`, `contact_phone`, `tax_number`, `tax_registered`, `createdAt`, `updatedAt`, `UserId`) VALUES
(1, '123 Test St', 'https://test.com', 'Test Contact', '1234567890', 'TX1773405319770', 1, '2026-03-13 12:35:20', '2026-03-13 12:35:20', 1),
(2, '123 Test St', 'https://test.com', 'Test Contact', '1234567890', 'TX1773405319770', 1, '2026-03-13 12:35:20', '2026-03-13 12:35:20', 2),
(3, '123 Test St', 'https://test.com', 'Test Contact', '1234567890', 'TX1773405319770', 1, '2026-03-13 12:35:20', '2026-03-13 12:35:20', 3);

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id` int NOT NULL,
  `organization_type` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `post_code` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`id`, `organization_type`, `department`, `country`, `state`, `city`, `post_code`, `createdAt`, `updatedAt`, `UserId`) VALUES
(1, 'Private Company', 'Engineering', 'USA', 'CA', 'San Francisco', '94105', '2026-03-13 12:35:19', '2026-03-13 12:35:19', 1),
(2, 'Private Company', 'Engineering', 'USA', 'CA', 'San Francisco', '94105', '2026-03-13 12:35:20', '2026-03-13 12:35:20', 2),
(3, 'Private Company', 'Engineering', 'USA', 'CA', 'San Francisco', '94105', '2026-03-13 12:35:20', '2026-03-13 12:35:20', 3);

-- --------------------------------------------------------

--
-- Table structure for table `otps`
--

CREATE TABLE `otps` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(255) NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `expiry_time` datetime NOT NULL,
  `attempts` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partmappings`
--

CREATE TABLE `partmappings` (
  `id` int NOT NULL,
  `internal_part_number` varchar(100) NOT NULL,
  `supplier_id` int NOT NULL,
  `supplier_part_number` varchar(100) NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `lead_time` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymentmethods`
--

CREATE TABLE `paymentmethods` (
  `id` int NOT NULL,
  `method_type` enum('internet_banking','paypal','google_pay','other') NOT NULL,
  `payment_identifier` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `paymentmethods`
--

INSERT INTO `paymentmethods` (`id`, `method_type`, `payment_identifier`, `is_default`, `createdAt`, `updatedAt`, `UserId`) VALUES
(1, 'paypal', 'admin_1773405319770@example.com', 1, '2026-03-13 12:35:20', '2026-03-13 12:35:20', 1),
(2, 'paypal', 'buyer_1773405319770@example.com', 1, '2026-03-13 12:35:20', '2026-03-13 12:35:20', 2),
(3, 'paypal', 'seller_1773405319770@example.com', 1, '2026-03-13 12:35:20', '2026-03-13 12:35:20', 3);

-- --------------------------------------------------------

--
-- Table structure for table `personalinfos`
--

CREATE TABLE `personalinfos` (
  `id` int NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `national_id` varchar(255) DEFAULT NULL,
  `tax_id` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `personalinfos`
--

INSERT INTO `personalinfos` (`id`, `full_name`, `last_name`, `designation`, `national_id`, `tax_id`, `createdAt`, `updatedAt`, `UserId`) VALUES
(1, 'Test', 'User', 'Manager', 'ID1773405319770', 'TAX1773405319770', '2026-03-13 12:35:20', '2026-03-13 12:35:20', 1),
(2, 'Test', 'User', 'Manager', 'ID1773405319770', 'TAX1773405319770', '2026-03-13 12:35:20', '2026-03-13 12:35:20', 2),
(3, 'Test', 'User', 'Manager', 'ID1773405319770', 'TAX1773405319770', '2026-03-13 12:35:20', '2026-03-13 12:35:20', 3);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `category` varchar(255) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `imageUrl` varchar(255) DEFAULT NULL,
  `embedding` longblob,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quotations`
--

CREATE TABLE `quotations` (
  `id` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `delivery_days` int NOT NULL,
  `terms` text,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `RFQId` int DEFAULT NULL,
  `SellerId` int DEFAULT NULL,
  `nre_cost` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `quotations`
--

INSERT INTO `quotations` (`id`, `unit_price`, `delivery_days`, `terms`, `status`, `createdAt`, `updatedAt`, `RFQId`, `SellerId`, `nre_cost`) VALUES
(1, 1500.00, 14, '50% advance, balance on delivery', 'accepted', '2026-03-13 12:35:20', '2026-03-13 12:35:20', 1, 3, 0.00),
(2, 42.00, 10, NULL, 'pending', '2026-03-13 12:57:26', '2026-03-13 12:57:26', 2, 3, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `rfqitems`
--

CREATE TABLE `rfqitems` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `RFQId` int DEFAULT NULL,
  `part_number` varchar(255) DEFAULT NULL,
  `target_price` decimal(10,2) DEFAULT NULL,
  `comparison_price` decimal(10,2) DEFAULT NULL,
  `bom_level` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rfqitems`
--

INSERT INTO `rfqitems` (`id`, `name`, `quantity`, `description`, `createdAt`, `updatedAt`, `RFQId`, `part_number`, `target_price`, `comparison_price`, `bom_level`) VALUES
(1, 'MacBook Pro', 10, NULL, '2026-03-13 12:35:20', '2026-03-13 12:35:20', 1, NULL, NULL, NULL, 1),
(2, 'Dell XPS', 20, NULL, '2026-03-13 12:35:20', '2026-03-13 12:35:20', 1, NULL, NULL, NULL, 1),
(3, 'Sensor Module A', 100, NULL, '2026-03-13 12:57:26', '2026-03-13 12:57:26', 2, 'SN-001', 45.00, 50.00, 1),
(4, 'Casing Level 1', 50, NULL, '2026-03-13 12:57:26', '2026-03-13 12:57:26', 2, 'CS-001', 100.00, 120.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `rfqs`
--

CREATE TABLE `rfqs` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` enum('open','closed','awarded','cancelled') DEFAULT 'open',
  `description` text,
  `category` varchar(255) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `BuyerId` int DEFAULT NULL,
  `rfq_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rfqs`
--

INSERT INTO `rfqs` (`id`, `title`, `status`, `description`, `category`, `deadline`, `createdAt`, `updatedAt`, `BuyerId`, `rfq_number`) VALUES
(1, 'RFQ for Laptops 1773405319770', 'awarded', NULL, NULL, NULL, '2026-03-13 12:35:20', '2026-03-13 12:35:20', 2, NULL),
(2, 'Analysis Test RFQ', 'open', NULL, NULL, NULL, '2026-03-13 12:57:26', '2026-03-13 12:57:26', 2, 'RFQ-ANALYSE-001');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `BuyerId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userindustries`
--

CREATE TABLE `userindustries` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int NOT NULL,
  `IndustryCodeId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `userindustries`
--

INSERT INTO `userindustries` (`createdAt`, `updatedAt`, `UserId`, `IndustryCodeId`) VALUES
('2026-03-13 12:35:20', '2026-03-13 12:35:20', 1, 1),
('2026-03-13 12:35:20', '2026-03-13 12:35:20', 1, 2),
('2026-03-13 12:35:20', '2026-03-13 12:35:20', 2, 1),
('2026-03-13 12:35:20', '2026-03-13 12:35:20', 2, 2),
('2026-03-13 12:35:20', '2026-03-13 12:35:20', 3, 1),
('2026-03-13 12:35:20', '2026-03-13 12:35:20', 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('buyer','seller','admin') DEFAULT NULL,
  `onboarding_step` int DEFAULT '1',
  `status` enum('registered','role_selected','onboarding_in_progress','pending_approval','active','rejected','suspended') DEFAULT 'registered',
  `email_verified` tinyint(1) DEFAULT '0',
  `login_attempts` int DEFAULT '0',
  `last_login` datetime DEFAULT NULL,
  `account_status` enum('active','pending_approval','rejected','suspended') DEFAULT 'pending_approval',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password`, `role`, `onboarding_step`, `status`, `email_verified`, `login_attempts`, `last_login`, `account_status`, `createdAt`, `updatedAt`) VALUES
(1, 'admin_user_1773405319770', NULL, 'admin_1773405319770@example.com', '$2b$10$kUBYXBsFG5MybdtQK.XHD.rFAvI4rAuyUAx3xUChzKb4ZzWq4XaO6', 'admin', 8, 'active', 1, 0, '2026-03-13 13:22:36', 'active', '2026-03-13 12:35:19', '2026-03-13 13:22:36'),
(2, 'buyer_user_1773405319770', NULL, 'buyer_1773405319770@example.com', '$2b$10$It6jC6VV7d4t4I79qJqBTOeKo99/SEcIa.QhnpM1Kaxd1vtyZVChK', 'buyer', 8, 'active', 1, 0, '2026-03-13 13:00:39', 'active', '2026-03-13 12:35:20', '2026-03-13 13:00:39'),
(3, 'seller_user_1773405319770', NULL, 'seller_1773405319770@example.com', '$2b$10$lvkLRjKxMvVedgx6.JWd6e/ueQeKLw0KEORohXTutQBVE/ZQgLyIS', 'seller', 8, 'rejected', 1, 0, '2026-03-13 12:35:20', 'rejected', '2026-03-13 12:35:20', '2026-03-13 13:27:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `industrycodes`
--
ALTER TABLE `industrycodes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `code_2` (`code`),
  ADD UNIQUE KEY `code_3` (`code`),
  ADD UNIQUE KEY `code_4` (`code`),
  ADD UNIQUE KEY `code_5` (`code`),
  ADD UNIQUE KEY `code_6` (`code`),
  ADD UNIQUE KEY `code_7` (`code`),
  ADD UNIQUE KEY `code_8` (`code`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `organizationinfos`
--
ALTER TABLE `organizationinfos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `otps`
--
ALTER TABLE `otps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `partmappings`
--
ALTER TABLE `partmappings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_mapping` (`internal_part_number`,`supplier_id`),
  ADD KEY `idx_internal_part_number` (`internal_part_number`),
  ADD KEY `idx_supplier_id` (`supplier_id`);

--
-- Indexes for table `paymentmethods`
--
ALTER TABLE `paymentmethods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `personalinfos`
--
ALTER TABLE `personalinfos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quotations`
--
ALTER TABLE `quotations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `RFQId` (`RFQId`),
  ADD KEY `SellerId` (`SellerId`);

--
-- Indexes for table `rfqitems`
--
ALTER TABLE `rfqitems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `RFQId` (`RFQId`);

--
-- Indexes for table `rfqs`
--
ALTER TABLE `rfqs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rfq_number` (`rfq_number`),
  ADD UNIQUE KEY `rfq_number_2` (`rfq_number`),
  ADD UNIQUE KEY `rfq_number_3` (`rfq_number`),
  ADD UNIQUE KEY `rfq_number_4` (`rfq_number`),
  ADD UNIQUE KEY `rfq_number_5` (`rfq_number`),
  ADD UNIQUE KEY `rfq_number_6` (`rfq_number`),
  ADD UNIQUE KEY `rfq_number_7` (`rfq_number`),
  ADD KEY `BuyerId` (`BuyerId`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD KEY `BuyerId` (`BuyerId`);

--
-- Indexes for table `userindustries`
--
ALTER TABLE `userindustries`
  ADD PRIMARY KEY (`UserId`,`IndustryCodeId`),
  ADD KEY `IndustryCodeId` (`IndustryCodeId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `user_id_2` (`user_id`),
  ADD UNIQUE KEY `user_id_3` (`user_id`),
  ADD UNIQUE KEY `user_id_4` (`user_id`),
  ADD UNIQUE KEY `user_id_5` (`user_id`),
  ADD UNIQUE KEY `user_id_6` (`user_id`),
  ADD UNIQUE KEY `user_id_7` (`user_id`),
  ADD UNIQUE KEY `user_id_8` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `industrycodes`
--
ALTER TABLE `industrycodes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organizationinfos`
--
ALTER TABLE `organizationinfos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `otps`
--
ALTER TABLE `otps`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `partmappings`
--
ALTER TABLE `partmappings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paymentmethods`
--
ALTER TABLE `paymentmethods`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `personalinfos`
--
ALTER TABLE `personalinfos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quotations`
--
ALTER TABLE `quotations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rfqitems`
--
ALTER TABLE `rfqitems`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `rfqs`
--
ALTER TABLE `rfqs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_6` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_8` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `organizationinfos`
--
ALTER TABLE `organizationinfos`
  ADD CONSTRAINT `organizationinfos_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_6` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_8` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `organizations_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_6` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_8` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `partmappings`
--
ALTER TABLE `partmappings`
  ADD CONSTRAINT `partmappings_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `paymentmethods`
--
ALTER TABLE `paymentmethods`
  ADD CONSTRAINT `paymentmethods_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_6` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_8` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `personalinfos`
--
ALTER TABLE `personalinfos`
  ADD CONSTRAINT `personalinfos_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_6` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_8` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `quotations`
--
ALTER TABLE `quotations`
  ADD CONSTRAINT `quotations_ibfk_1` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_10` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_11` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_12` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_13` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_14` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_15` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_16` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_2` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_3` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_4` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_5` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_6` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_7` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_8` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_9` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `rfqitems`
--
ALTER TABLE `rfqitems`
  ADD CONSTRAINT `rfqitems_ibfk_1` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_2` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_3` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_4` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_5` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_6` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_7` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_8` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `rfqs`
--
ALTER TABLE `rfqs`
  ADD CONSTRAINT `rfqs_ibfk_1` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_2` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_3` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_4` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_5` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_6` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_7` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_8` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD CONSTRAINT `suppliers_ibfk_1` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_2` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_3` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_4` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_5` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_6` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_7` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_8` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `userindustries`
--
ALTER TABLE `userindustries`
  ADD CONSTRAINT `userindustries_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userindustries_ibfk_2` FOREIGN KEY (`IndustryCodeId`) REFERENCES `industrycodes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
