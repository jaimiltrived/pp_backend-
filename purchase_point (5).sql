-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Apr 23, 2026 at 01:44 PM
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `subject` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `sender_id` varchar(255) NOT NULL,
  `receiver_id` varchar(255) NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `type` enum('system','user','broadcast') DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  `items` LONGTEXT NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `totalAmount`, `status`, `items`, `createdAt`, `updatedAt`, `UserId`) VALUES
(1, 8500.00, 'completed', '\"[{\\\"name\\\":\\\"Motor\\\",\\\"qty\\\":10}]\"', '2026-03-21 12:35:23', '2026-04-20 12:35:23', 2),
(2, 4200.00, 'completed', '\"[{\\\"name\\\":\\\"Sensors\\\",\\\"qty\\\":50}]\"', '2026-04-05 12:35:23', '2026-04-20 12:35:23', 2),
(3, 125000.00, 'processing', '\"[{\\\"name\\\":\\\"Lathe\\\",\\\"qty\\\":1}]\"', '2026-04-15 12:35:23', '2026-04-20 12:35:23', 2),
(4, 1500.00, 'pending', '\"[{\\\"name\\\":\\\"Parts\\\",\\\"qty\\\":5}]\"', '2026-04-20 12:35:23', '2026-04-20 12:35:23', 2);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id` int NOT NULL,
  `organization_name` varchar(255) DEFAULT NULL,
  `organization_type` varchar(255) NOT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `description` text,
  `id_proof` varchar(255) DEFAULT NULL,
  `products_deal_with` text,
  `supplier_type` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `post_code` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`id`, `organization_name`, `organization_type`, `experience`, `description`, `id_proof`, `products_deal_with`, `supplier_type`, `department`, `country`, `state`, `city`, `post_code`, `createdAt`, `updatedAt`, `UserId`) VALUES
(1, 'John Logistics Org', 'Purchasing', NULL, NULL, NULL, NULL, NULL, NULL, 'USA', NULL, NULL, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23', 2),
(2, 'Global Tech Procurement Org', 'Purchasing', NULL, NULL, NULL, NULL, NULL, NULL, 'USA', NULL, NULL, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23', 3);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otps`
--

INSERT INTO `otps` (`id`, `email`, `otp`, `is_verified`, `expiry_time`, `attempts`, `createdAt`, `updatedAt`) VALUES
(4, 'jaimiltrivedi130@gmail.com', '819814', 0, '2026-04-23 13:48:13', 0, '2026-04-23 13:38:13', '2026-04-23 13:38:13');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymentmethods`
--

CREATE TABLE `paymentmethods` (
  `id` int NOT NULL,
  `method_type` enum('internet_banking','paypal','google_pay','other') NOT NULL,
  `payment_identifier` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `bank_name` varchar(255) DEFAULT NULL,
  `account_no` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(255) DEFAULT NULL,
  `account_holder_name` varchar(255) DEFAULT NULL,
  `bank_location` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `contact_phone` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personalinfos`
--

INSERT INTO `personalinfos` (`id`, `full_name`, `last_name`, `designation`, `national_id`, `tax_id`, `contact_phone`, `createdAt`, `updatedAt`, `UserId`) VALUES
(1, 'John', 'Logistics', NULL, NULL, NULL, '+1 555-0000', '2026-04-20 12:35:23', '2026-04-20 12:35:23', 2),
(2, 'Global', 'Tech', NULL, NULL, NULL, '+1 555-0000', '2026-04-20 12:35:23', '2026-04-20 12:35:23', 3),
(3, 'Elite', 'Pumps', NULL, NULL, NULL, '+1 555-0000', '2026-04-20 12:35:23', '2026-04-20 12:35:23', 4),
(4, 'Precision', 'Parts', NULL, NULL, NULL, '+1 555-0000', '2026-04-20 12:35:23', '2026-04-20 12:35:23', 5),
(5, 'Industrial', 'Gears', NULL, NULL, NULL, '+1 555-0000', '2026-04-20 12:35:23', '2026-04-20 12:35:23', 6);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `description`, `category`, `stock`, `imageUrl`, `embedding`, `createdAt`, `updatedAt`) VALUES
(1, 'Hydraulic Press HP-500', 45000.00, '500-ton hydraulic press', 'Machinery', 0, NULL, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23'),
(2, 'CNC Milling Machine M2', 85000.00, '3-axis CNC milling machine', 'Machinery', 0, NULL, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23'),
(3, 'Welding Robot Arm', 32000.00, '6-axis industrial welding robot', 'Automation', 0, NULL, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23'),
(4, 'Digital Multimeter', 120.00, 'Professional digital multimeter', 'Electrical', 0, NULL, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23'),
(5, 'Air Compressor 10HP', 2100.00, 'Industrial air compressor', 'Pneumatics', 0, NULL, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23'),
(6, 'Steel Sheet 2mm', 45.00, 'Cold rolled steel sheet', 'Materials', 0, NULL, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23');

-- --------------------------------------------------------

--
-- Table structure for table `quotations`
--

CREATE TABLE `quotations` (
  `id` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `nre_cost` decimal(10,2) DEFAULT '0.00',
  `delivery_days` int NOT NULL,
  `terms` text,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `RFQId` int DEFAULT NULL,
  `SellerId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotations`
--

INSERT INTO `quotations` (`id`, `unit_price`, `nre_cost`, `delivery_days`, `terms`, `status`, `createdAt`, `updatedAt`, `RFQId`, `SellerId`) VALUES
(1, 440.00, 0.00, 7, NULL, 'accepted', '2026-04-20 12:35:23', '2026-04-20 12:37:44', 1, 4),
(2, 435.00, 0.00, 10, NULL, 'accepted', '2026-04-20 12:35:23', '2026-04-20 12:38:11', 1, 5),
(3, 1150.00, 0.00, 14, NULL, 'accepted', '2026-04-20 12:35:23', '2026-04-20 12:38:13', 2, 6),
(4, 121.00, 221.00, 1212, 'i give best poeduct \n', 'pending', '2026-04-20 14:09:23', '2026-04-20 14:09:23', 2, 4);

-- --------------------------------------------------------

--
-- Table structure for table `rfqitems`
--

CREATE TABLE `rfqitems` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `part_number` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL,
  `target_price` decimal(10,2) DEFAULT NULL,
  `comparison_price` decimal(10,2) DEFAULT NULL,
  `bom_level` int DEFAULT '1',
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `RFQId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rfqitems`
--

INSERT INTO `rfqitems` (`id`, `name`, `part_number`, `quantity`, `target_price`, `comparison_price`, `bom_level`, `description`, `createdAt`, `updatedAt`, `RFQId`) VALUES
(1, 'AC Motor 5HP', NULL, 50, 450.00, NULL, 1, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23', 1),
(2, 'Gearbox G1', NULL, 10, 1200.00, NULL, 1, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23', 2);

-- --------------------------------------------------------

--
-- Table structure for table `rfqs`
--

CREATE TABLE `rfqs` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `rfq_number` varchar(255) DEFAULT NULL,
  `status` enum('open','closed','awarded','cancelled') DEFAULT 'open',
  `description` text,
  `category` varchar(255) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `BuyerId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rfqs`
--

INSERT INTO `rfqs` (`id`, `title`, `rfq_number`, `status`, `description`, `category`, `deadline`, `createdAt`, `updatedAt`, `BuyerId`) VALUES
(1, 'Urgent: 50x Industrial Motors', 'RFQ-2024- मोटर्स-01', 'open', 'Need high-efficiency 3-phase AC motors.', 'Electrical', '2026-04-30 12:35:23', '2026-04-20 12:35:23', '2026-04-20 12:35:23', 2),
(2, 'Custom Gearbox Manufacturing', 'RFQ-2024-GEAR-99', 'open', 'Monthly supply of custom gearboxes as per blueprints.', 'Mechanical', '2026-06-19 12:35:23', '2026-04-20 12:35:23', '2026-04-20 12:35:23', 3);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userindustries`
--

CREATE TABLE `userindustries` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int NOT NULL,
  `IndustryCodeId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `terms_accepted` tinyint(1) DEFAULT '0',
  `terms_accepted_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_id`, `name`, `email`, `password`, `role`, `onboarding_step`, `status`, `email_verified`, `login_attempts`, `last_login`, `account_status`, `terms_accepted`, `terms_accepted_at`, `createdAt`, `updatedAt`) VALUES
(1, 'PP-ADMIN-001', 'Super Admin', 'jaimiltrivedi130@gmail.com', '$2b$10$6hUoKRFqUw/5hIJF6nQZYOK5N/HrK0Cg4rkFCwBVYHRfbwycdZ9Wy', 'admin', 1, 'active', 0, 4, NULL, 'active', 0, NULL, '2026-04-20 12:35:22', '2026-04-23 13:27:28'),
(2, 'PP-2026-BJBOW', 'John Logistics', 'buyer1@gmail.com', '$2b$10$/65D/UmOA4ndH77OPdbwKuNTKK.K8S3r1vdr3CYjxRPBG9Qfpge9S', 'buyer', 1, 'active', 0, 0, '2026-04-20 13:21:44', 'active', 0, NULL, '2026-04-20 12:35:23', '2026-04-20 13:21:44'),
(3, 'PP-2026-XVY9J', 'Global Tech Procurement', 'buyer2@gmail.com', '$2b$10$h7s2CevaOfDHjJKTAFAEleOhsLPjghIEBnWVwdlvgVdTamqjaA7pi', 'buyer', 1, 'pending_approval', 0, 0, NULL, 'pending_approval', 0, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23'),
(4, 'PP-2026-I73DZ', 'Elite Pumps Ltd', 'seller1@gmail.com', '$2b$10$ZhMRCyvtaDErJJI5NlSbVuWvmHYBxw4GLyw5EuAFR9kOFPTWBlcBe', 'seller', 1, 'active', 1, 1, '2026-04-20 13:54:00', 'active', 0, NULL, '2026-04-20 12:35:23', '2026-04-20 13:54:00'),
(5, 'PP-2026-1HGUG', 'Precision Parts Corp', 'seller2@gmail.com', '$2b$10$4kZ6MRu0zgXxRy5gSvIgbu5Tyb37DkxfHaB/Cdupnm1dZaw7jlRJ2', 'seller', 1, 'active', 1, 1, NULL, 'active', 0, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23'),
(6, 'PP-2026-BG0NF', 'Industrial Gears Inc', 'seller3@gmail.com', '$2b$10$hLrdxDUjxHlxnD0fJPaQ3eB2sLxrgykofEv2kvq8yo/AdfrdF1TcG', 'seller', 1, 'active', 0, 0, NULL, 'active', 0, NULL, '2026-04-20 12:35:23', '2026-04-20 12:35:23');

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
  ADD UNIQUE KEY `code_8` (`code`),
  ADD UNIQUE KEY `code_9` (`code`),
  ADD UNIQUE KEY `code_10` (`code`),
  ADD UNIQUE KEY `code_11` (`code`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

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
  ADD UNIQUE KEY `rfq_number_8` (`rfq_number`),
  ADD UNIQUE KEY `rfq_number_9` (`rfq_number`),
  ADD UNIQUE KEY `rfq_number_10` (`rfq_number`),
  ADD UNIQUE KEY `rfq_number_11` (`rfq_number`),
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
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
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
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `user_id_2` (`user_id`),
  ADD UNIQUE KEY `user_id_3` (`user_id`),
  ADD UNIQUE KEY `user_id_4` (`user_id`),
  ADD UNIQUE KEY `user_id_5` (`user_id`),
  ADD UNIQUE KEY `user_id_6` (`user_id`),
  ADD UNIQUE KEY `user_id_7` (`user_id`),
  ADD UNIQUE KEY `user_id_8` (`user_id`),
  ADD UNIQUE KEY `user_id_9` (`user_id`),
  ADD UNIQUE KEY `user_id_10` (`user_id`),
  ADD UNIQUE KEY `user_id_11` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `industrycodes`
--
ALTER TABLE `industrycodes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `organizationinfos`
--
ALTER TABLE `organizationinfos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `otps`
--
ALTER TABLE `otps`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `partmappings`
--
ALTER TABLE `partmappings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paymentmethods`
--
ALTER TABLE `paymentmethods`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personalinfos`
--
ALTER TABLE `personalinfos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `quotations`
--
ALTER TABLE `quotations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `rfqitems`
--
ALTER TABLE `rfqitems`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_10` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_11` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_6` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_8` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_9` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `organizationinfos`
--
ALTER TABLE `organizationinfos`
  ADD CONSTRAINT `organizationinfos_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_10` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_11` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_6` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_8` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizationinfos_ibfk_9` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `organizations_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_10` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_11` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_6` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_8` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `organizations_ibfk_9` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `partmappings`
--
ALTER TABLE `partmappings`
  ADD CONSTRAINT `partmappings_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `paymentmethods`
--
ALTER TABLE `paymentmethods`
  ADD CONSTRAINT `paymentmethods_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_10` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_11` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_6` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_8` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paymentmethods_ibfk_9` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `personalinfos`
--
ALTER TABLE `personalinfos`
  ADD CONSTRAINT `personalinfos_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_10` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_11` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_6` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_8` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `personalinfos_ibfk_9` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quotations`
--
ALTER TABLE `quotations`
  ADD CONSTRAINT `quotations_ibfk_1` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_10` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_11` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_12` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_13` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_14` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_15` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_16` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_17` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_18` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_19` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_2` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_20` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_21` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_22` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_3` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_4` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_5` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_6` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_7` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_8` FOREIGN KEY (`SellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_9` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `rfqitems`
--
ALTER TABLE `rfqitems`
  ADD CONSTRAINT `rfqitems_ibfk_1` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_10` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_11` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_2` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_3` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_4` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_5` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_6` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_7` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_8` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqitems_ibfk_9` FOREIGN KEY (`RFQId`) REFERENCES `rfqs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `rfqs`
--
ALTER TABLE `rfqs`
  ADD CONSTRAINT `rfqs_ibfk_1` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_10` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_11` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_2` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_3` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_4` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_5` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_6` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_7` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_8` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rfqs_ibfk_9` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD CONSTRAINT `suppliers_ibfk_1` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_10` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_11` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_2` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_3` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_4` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_5` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_6` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_7` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_8` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_9` FOREIGN KEY (`BuyerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
