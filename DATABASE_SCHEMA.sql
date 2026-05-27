-- TeleOSS Database Schema
-- This is a complete schema matching your application structure
-- Change database name, table names, and field names as needed

CREATE DATABASE IF NOT EXISTS teleoss;
USE teleoss;

-- ============================================
-- ENTERPRISE MODULE
-- ============================================
CREATE TABLE IF NOT EXISTS enterprise (
  enterprise_id INT AUTO_INCREMENT PRIMARY KEY,
  enterprise_name VARCHAR(255) NOT NULL UNIQUE,
  enterprise_type ENUM('CUSTOMER', 'VENDOR', 'SUPPLIER') NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_type (enterprise_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- FINANCE MODULE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  info_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  payment_date DATE NOT NULL,
  transaction_time TIME,
  mode_of_payment VARCHAR(100),
  payment_type ENUM('CREDIT', 'DEBIT') NOT NULL,
  transaction_type VARCHAR(100),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  invoice_number VARCHAR(100),
  payment_status ENUM('FULL', 'PARTIAL', 'PENDING') DEFAULT 'PENDING',
  description TEXT,
  updated_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payment_date (payment_date),
  INDEX idx_status (payment_status),
  INDEX idx_amount (amount)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS invoices (
  invoice_id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_no VARCHAR(100) NOT NULL UNIQUE,
  status ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'DRAFT',
  enterprise_name VARCHAR(255) NOT NULL,
  enterprise_type ENUM('CUSTOMER', 'VENDOR') NOT NULL,
  invoice_type ENUM('MANUAL', 'AUTO') DEFAULT 'AUTO',
  billing_type ENUM('POSTPAID', 'PREPAID') NOT NULL,
  invoice_date DATE NOT NULL,
  usage_start DATE,
  usage_end DATE,
  due_date DATE,
  amount DECIMAL(15, 2) NOT NULL,
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_invoice_date (invoice_date),
  INDEX idx_status (status),
  INDEX idx_enterprise (enterprise_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS enterprise_balance (
  balance_id INT AUTO_INCREMENT PRIMARY KEY,
  enterprise_name VARCHAR(255) NOT NULL UNIQUE,
  customer_balance DECIMAL(15, 2) DEFAULT 0,
  vendor_balance DECIMAL(15, 2) DEFAULT 0,
  net_balance DECIMAL(15, 2) DEFAULT 0,
  account_manager VARCHAR(100),
  customer_credit DECIMAL(15, 2),
  billing_cycle VARCHAR(50),
  currency VARCHAR(3) DEFAULT 'USD',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_enterprise (enterprise_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS billing_cycle (
  info_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  usage_days INT NOT NULL,
  due_days INT NOT NULL,
  billing_type ENUM('POSTPAID', 'PREPAID') NOT NULL,
  updated_by VARCHAR(100),
  updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- RATE MODULE
-- ============================================
CREATE TABLE IF NOT EXISTS country (
  country_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  iso_code VARCHAR(2) NOT NULL UNIQUE,
  dial_code VARCHAR(5),
  updated_by VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_iso_code (iso_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS mccmnc_unique_codes (
  info_id INT AUTO_INCREMENT PRIMARY KEY,
  mcc VARCHAR(3) NOT NULL,
  mnc VARCHAR(3) NOT NULL,
  original_mnc VARCHAR(3),
  mccmnc VARCHAR(6) NOT NULL UNIQUE,
  iso VARCHAR(2) NOT NULL,
  country VARCHAR(100) NOT NULL,
  country_code VARCHAR(5),
  code_network VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_mccmnc (mccmnc),
  INDEX idx_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS mo_reference_book (
  info_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_trunk VARCHAR(100) NOT NULL,
  number VARCHAR(50) NOT NULL,
  keyword VARCHAR(100),
  rate DECIMAL(10, 4) NOT NULL,
  vendor_rate DECIMAL(10, 4),
  mccmnc VARCHAR(6) NOT NULL,
  destination VARCHAR(100),
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_trunk (customer_trunk),
  INDEX idx_mccmnc (mccmnc),
  INDEX idx_number (number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS wholesale_rates (
  rate_id INT AUTO_INCREMENT PRIMARY KEY,
  destination VARCHAR(100) NOT NULL,
  mccmnc VARCHAR(6),
  rate DECIMAL(10, 4) NOT NULL,
  effective_date DATE,
  expiry_date DATE,
  currency VARCHAR(3) DEFAULT 'USD',
  updated_by VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_destination (destination),
  INDEX idx_mccmnc (mccmnc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- PRODUCT MODULE
-- ============================================
CREATE TABLE IF NOT EXISTS product_category (
  info_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE,
  updated_by VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  category_id INT NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES product_category(info_id),
  INDEX idx_category (category_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SMS SERVICES MODULE
-- ============================================
CREATE TABLE IF NOT EXISTS translation_rule (
  info_id INT AUTO_INCREMENT PRIMARY KEY,
  translation_rule_name VARCHAR(255) NOT NULL UNIQUE,
  type ENUM('INGRESS', 'EGRESS') NOT NULL,
  action VARCHAR(100),
  continue_rule ENUM('YES', 'NO') DEFAULT 'NO',
  sender_id VARCHAR(100),
  dwd VARCHAR(50),
  mccmnc VARCHAR(6),
  message_text TEXT,
  updated_by VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_mccmnc (mccmnc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS auto_upload_rules (
  info_id INT AUTO_INCREMENT PRIMARY KEY,
  auto_upload_rules_name VARCHAR(255) NOT NULL UNIQUE,
  enterprise_name VARCHAR(255) NOT NULL,
  vendor_trunk VARCHAR(100),
  imap_mail_account_name VARCHAR(255),
  file_template_name VARCHAR(100),
  file_prefix VARCHAR(50),
  status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  updated_by VARCHAR(100),
  updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_enterprise (enterprise_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS business_company (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  currency VARCHAR(3) DEFAULT 'USD',
  tps_limit INT,
  base_currency VARCHAR(3),
  updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- REPORT MODULE
-- ============================================
CREATE TABLE IF NOT EXISTS daily_reports (
  report_id INT AUTO_INCREMENT PRIMARY KEY,
  enterprise_id INT,
  report_date DATE NOT NULL,
  total_messages INT DEFAULT 0,
  successful_messages INT DEFAULT 0,
  failed_messages INT DEFAULT 0,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (report_date),
  INDEX idx_enterprise (enterprise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS summary_reports (
  report_id INT AUTO_INCREMENT PRIMARY KEY,
  period VARCHAR(50) NOT NULL,
  start_date DATE,
  end_date DATE,
  total_messages INT DEFAULT 0,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  avg_tps INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_period (period)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- ADMIN MODULE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role_id INT,
  status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS permissions (
  permission_id INT AUTO_INCREMENT PRIMARY KEY,
  permission_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  module VARCHAR(100),
  action VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  module VARCHAR(100),
  entity_type VARCHAR(100),
  entity_id INT,
  description TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Create sample indexes for better performance
-- ============================================
CREATE INDEX idx_enterprise_type ON enterprise(enterprise_type);
CREATE INDEX idx_transaction_date ON transactions(payment_date);
CREATE INDEX idx_invoice_enterprise ON invoices(enterprise_name);
CREATE INDEX idx_mo_reference_number ON mo_reference_book(number);

-- Sample Insert Data
INSERT INTO enterprise (enterprise_name, enterprise_type, status) VALUES
('ABC Corp', 'CUSTOMER', 'ACTIVE'),
('XYZ Telecom', 'VENDOR', 'ACTIVE');

INSERT INTO country (name, iso_code, dial_code) VALUES
('United States', 'US', '1'),
('United Kingdom', 'GB', '44'),
('India', 'IN', '91');
