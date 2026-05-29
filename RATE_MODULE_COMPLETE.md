# Rate Module - Complete Implementation

## 1. MariaDB Schema

```sql
-- IMAP Mail Account Table
CREATE TABLE `imap_mail_account` (
  `imap_account_id` INT AUTO_INCREMENT PRIMARY KEY,
  `mail_account_name` VARCHAR(255) NOT NULL,
  `imap_email` VARCHAR(255) NOT NULL UNIQUE,
  `imap_server` VARCHAR(255) NOT NULL,
  `imap_port` INT DEFAULT 993,
  `imap_username` VARCHAR(255),
  `imap_password` VARCHAR(500),
  `auth_type` ENUM('Basic', 'OAuth2', 'SSL') DEFAULT 'Basic',
  `ssl_enabled` BOOLEAN DEFAULT TRUE,
  `connection_timeout` INT DEFAULT 30,
  `status` ENUM('Active', 'Inactive', 'Error') DEFAULT 'Active',
  `last_sync` TIMESTAMP NULL,
  `last_error` TEXT,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (imap_email),
  INDEX idx_status (status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- File Template Table
CREATE TABLE `file_template` (
  `template_id` INT AUTO_INCREMENT PRIMARY KEY,
  `file_template_name` VARCHAR(255) NOT NULL UNIQUE,
  `file_type` ENUM('CSV', 'Excel', 'Fixed Width', 'Pipe Delimited', 'Tab Delimited') DEFAULT 'CSV',
  `delimiter` VARCHAR(5),
  `has_header` BOOLEAN DEFAULT TRUE,
  `skip_row_count` INT DEFAULT 0,
  `encoding` VARCHAR(50) DEFAULT 'UTF-8',
  `column_mapping` JSON NOT NULL,
  `validation_rules` JSON,
  `status` ENUM('Active', 'Inactive', 'Template') DEFAULT 'Template',
  `description` TEXT,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_template_name (file_template_name),
  INDEX idx_status (status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Auto Upload Rules Table
CREATE TABLE `auto_upload_rules` (
  `rule_id` INT AUTO_INCREMENT PRIMARY KEY,
  `rule_name` VARCHAR(255) NOT NULL,
  `enterprise_id` INT,
  `enterprise_name` VARCHAR(255),
  `vendor_trunk_id` INT,
  `vendor_trunk_name` VARCHAR(255),
  `imap_account_id` INT,
  `template_id` INT,
  `schedule_type` ENUM('Realtime', 'Hourly', 'Daily', 'Weekly', 'Monthly') DEFAULT 'Daily',
  `schedule_time` VARCHAR(20),
  `day_of_week` VARCHAR(10),
  `email_subject_filter` VARCHAR(500),
  `email_from_filter` VARCHAR(255),
  `attachment_name_pattern` VARCHAR(255),
  `processing_logic` JSON,
  `retry_count` INT DEFAULT 3,
  `retry_interval_minutes` INT DEFAULT 5,
  `notify_on_failure` BOOLEAN DEFAULT TRUE,
  `failure_notification_emails` JSON,
  `active` BOOLEAN DEFAULT TRUE,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (imap_account_id) REFERENCES imap_mail_account(imap_account_id),
  FOREIGN KEY (template_id) REFERENCES file_template(template_id),
  INDEX idx_enterprise_id (enterprise_id),
  INDEX idx_vendor_trunk_id (vendor_trunk_id),
  INDEX idx_active (active),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Auto Upload Execution History
CREATE TABLE `auto_upload_execution` (
  `execution_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `rule_id` INT NOT NULL,
  `rule_name` VARCHAR(255),
  `execution_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `email_id` VARCHAR(500),
  `email_from` VARCHAR(255),
  `email_subject` VARCHAR(500),
  `attachment_name` VARCHAR(255),
  `file_size_bytes` BIGINT,
  `status` ENUM('Success', 'Failed', 'Partial', 'Skipped') DEFAULT 'Success',
  `error_message` TEXT,
  `records_processed` INT DEFAULT 0,
  `records_failed` INT DEFAULT 0,
  `processing_time_seconds` DECIMAL(10, 2),
  `processed_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rule_id) REFERENCES auto_upload_rules(rule_id),
  INDEX idx_rule_id (rule_id),
  INDEX idx_execution_time (execution_time),
  INDEX idx_status (status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Auto Upload Failed Records
CREATE TABLE `auto_upload_failed_record` (
  `failed_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `execution_id` BIGINT,
  `rule_id` INT,
  `email_id` VARCHAR(500),
  `email_from` VARCHAR(255),
  `email_subject` VARCHAR(500),
  `file_name` VARCHAR(255),
  `row_number` INT,
  `raw_data` TEXT,
  `error_type` ENUM('Parsing', 'Validation', 'Duplicate', 'Missing Field', 'Invalid Format') DEFAULT 'Parsing',
  `error_message` TEXT,
  `email_receive_time` TIMESTAMP NULL,
  `email_read_time` TIMESTAMP NULL,
  `resolution_status` ENUM('Pending', 'Resolved', 'Ignored', 'Manual Fix Applied') DEFAULT 'Pending',
  `resolution_notes` TEXT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (execution_id) REFERENCES auto_upload_execution(execution_id),
  FOREIGN KEY (rule_id) REFERENCES auto_upload_rules(rule_id),
  INDEX idx_execution_id (execution_id),
  INDEX idx_rule_id (rule_id),
  INDEX idx_resolution_status (resolution_status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Rate Table (rates offered to customers)
CREATE TABLE `customer_rate_table` (
  `rate_table_id` INT AUTO_INCREMENT PRIMARY KEY,
  `rate_table_name` VARCHAR(255) NOT NULL,
  `customer_trunk_id` INT,
  `product_category` VARCHAR(100),
  `currency_id` INT,
  `description` TEXT,
  `effective_from` DATE NOT NULL,
  `effective_to` DATE,
  `status` ENUM('Draft', 'Active', 'Archived', 'Superseded') DEFAULT 'Draft',
  `approval_status` ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  `approved_by` VARCHAR(100),
  `approved_time` TIMESTAMP NULL,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rate_table_name (rate_table_name),
  INDEX idx_customer_trunk_id (customer_trunk_id),
  INDEX idx_status (status),
  INDEX idx_approval_status (approval_status),
  INDEX idx_effective_from (effective_from),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Rate Table Details
CREATE TABLE `customer_rate_detail` (
  `detail_id` INT AUTO_INCREMENT PRIMARY KEY,
  `rate_table_id` INT NOT NULL,
  `destination_code` VARCHAR(50),
  `destination_name` VARCHAR(255),
  `operator_name` VARCHAR(100),
  `rate_per_unit` DECIMAL(10, 6) NOT NULL,
  `unit_type` ENUM('Per Message', 'Per Second', 'Per Minute', 'Per GB') DEFAULT 'Per Message',
  `min_charge` DECIMAL(10, 6),
  `billing_increment` VARCHAR(50),
  `setup_fee` DECIMAL(10, 6),
  `effective_from` DATE,
  `effective_to` DATE,
  `comments` TEXT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rate_table_id) REFERENCES customer_rate_table(rate_table_id) ON DELETE CASCADE,
  INDEX idx_rate_table_id (rate_table_id),
  INDEX idx_destination_code (destination_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendor Rate Table
CREATE TABLE `vendor_rate_table` (
  `vendor_rate_table_id` INT AUTO_INCREMENT PRIMARY KEY,
  `rate_table_name` VARCHAR(255) NOT NULL,
  `vendor_trunk_id` INT,
  `vendor_name` VARCHAR(255),
  `product_category` VARCHAR(100),
  `currency_id` INT,
  `description` TEXT,
  `effective_from` DATE NOT NULL,
  `effective_to` DATE,
  `cost_model` ENUM('Flat Rate', 'Volume Based', 'Time Based', 'Dynamic') DEFAULT 'Flat Rate',
  `status` ENUM('Draft', 'Active', 'Archived') DEFAULT 'Draft',
  `negotiation_margin_pct` DECIMAL(5, 2),
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vendor_trunk_id (vendor_trunk_id),
  INDEX idx_status (status),
  INDEX idx_effective_from (effective_from),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendor Rate Table Details
CREATE TABLE `vendor_rate_detail` (
  `detail_id` INT AUTO_INCREMENT PRIMARY KEY,
  `vendor_rate_table_id` INT NOT NULL,
  `destination_code` VARCHAR(50),
  `destination_name` VARCHAR(255),
  `operator_name` VARCHAR(100),
  `cost_per_unit` DECIMAL(10, 6) NOT NULL,
  `unit_type` ENUM('Per Message', 'Per Second', 'Per Minute', 'Per GB') DEFAULT 'Per Message',
  `minimum_cost` DECIMAL(10, 6),
  `volume_discount_pct` DECIMAL(5, 2),
  `volume_threshold` BIGINT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_rate_table_id) REFERENCES vendor_rate_table(vendor_rate_table_id) ON DELETE CASCADE,
  INDEX idx_vendor_rate_table_id (vendor_rate_table_id),
  INDEX idx_destination_code (destination_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-Rating Request Table
CREATE TABLE `re_rating_request` (
  `re_rating_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `old_rate_table_id` INT,
  `new_rate_table_id` INT,
  `enterprise_id` INT,
  `reason` TEXT NOT NULL,
  `requested_by` VARCHAR(100),
  `requested_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `date_from` DATE NOT NULL,
  `date_to` DATE NOT NULL,
  `status` ENUM('Pending', 'In Progress', 'Completed', 'Failed', 'Rolled Back') DEFAULT 'Pending',
  `approved_by` VARCHAR(100),
  `approved_time` TIMESTAMP NULL,
  `total_transactions_reprocessed` BIGINT DEFAULT 0,
  `total_amount_adjusted` DECIMAL(15, 2),
  `completion_time` TIMESTAMP NULL,
  `error_details` TEXT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_enterprise_id (enterprise_id),
  INDEX idx_status (status),
  INDEX idx_requested_time (requested_time),
  INDEX idx_date_from (date_from),
  INDEX idx_date_to (date_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rate Analytics Aggregates
CREATE TABLE `rate_analytics_daily` (
  `analytics_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `analytics_date` DATE NOT NULL,
  `rate_table_id` INT,
  `destination_code` VARCHAR(50),
  `enterprise_id` INT,
  `total_transactions` BIGINT DEFAULT 0,
  `total_volume` BIGINT DEFAULT 0,
  `total_revenue` DECIMAL(15, 2) DEFAULT 0,
  `average_rate` DECIMAL(10, 6),
  `min_rate` DECIMAL(10, 6),
  `max_rate` DECIMAL(10, 6),
  `success_rate_pct` DECIMAL(5, 2),
  `status_breakdown` JSON,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_daily_analytics (analytics_date, rate_table_id, destination_code, enterprise_id),
  INDEX idx_analytics_date (analytics_date),
  INDEX idx_rate_table_id (rate_table_id),
  INDEX idx_enterprise_id (enterprise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 2. Fast & Effective Queries

### IMAP Mail Account Queries

```sql
-- Get all IMAP accounts with sync status
SELECT 
  imap_account_id,
  mail_account_name,
  imap_email,
  imap_server,
  status,
  last_sync,
  CASE 
    WHEN last_sync IS NULL THEN 'Never'
    WHEN last_sync > DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN 'Recent'
    WHEN last_sync > DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 'Today'
    ELSE 'Old'
  END as sync_status,
  last_error
FROM imap_mail_account
ORDER BY last_sync DESC
LIMIT ? OFFSET ?;

-- Search IMAP account
SELECT *
FROM imap_mail_account
WHERE mail_account_name LIKE CONCAT('%', ?, '%')
  OR imap_email LIKE CONCAT('%', ?, '%')
  OR imap_server LIKE CONCAT('%', ?, '%')
ORDER BY created_time DESC;

-- Get active IMAP accounts for auto-upload
SELECT imap_account_id, mail_account_name, imap_email, imap_server, imap_port
FROM imap_mail_account
WHERE status = 'Active'
ORDER BY mail_account_name;
```

### File Template Queries

```sql
-- Get all templates with usage count
SELECT 
  ft.template_id,
  ft.file_template_name,
  ft.file_type,
  ft.status,
  COUNT(aur.rule_id) as usage_count,
  ft.updated_time
FROM file_template ft
LEFT JOIN auto_upload_rules aur ON ft.template_id = aur.template_id
GROUP BY ft.template_id
ORDER BY ft.updated_time DESC
LIMIT ? OFFSET ?;

-- Get template with full details
SELECT *
FROM file_template
WHERE template_id = ?;

-- Search templates
SELECT template_id, file_template_name, file_type, status
FROM file_template
WHERE file_template_name LIKE CONCAT('%', ?, '%')
  AND status != 'Inactive'
ORDER BY file_template_name;
```

### Auto Upload Rules Queries

```sql
-- Get all rules with execution stats
SELECT 
  aur.rule_id,
  aur.rule_name,
  aur.enterprise_name,
  aur.vendor_trunk_name,
  aur.schedule_type,
  aur.active,
  COUNT(aue.execution_id) as total_executions,
  SUM(CASE WHEN aue.status = 'Success' THEN 1 ELSE 0 END) as successful_count,
  SUM(CASE WHEN aue.status = 'Failed' THEN 1 ELSE 0 END) as failed_count,
  MAX(aue.execution_time) as last_execution,
  aur.updated_time
FROM auto_upload_rules aur
LEFT JOIN auto_upload_execution aue ON aur.rule_id = aue.rule_id 
  AND aue.execution_time > DATE_SUB(NOW(), INTERVAL 30 DAY)
WHERE aur.active = TRUE
GROUP BY aur.rule_id
ORDER BY aur.updated_time DESC
LIMIT ? OFFSET ?;

-- Get rule details with linked items
SELECT 
  aur.*,
  ima.mail_account_name,
  ft.file_template_name
FROM auto_upload_rules aur
LEFT JOIN imap_mail_account ima ON aur.imap_account_id = ima.imap_account_id
LEFT JOIN file_template ft ON aur.template_id = ft.template_id
WHERE aur.rule_id = ?;

-- Search rules
SELECT rule_id, rule_name, enterprise_name, schedule_type, active
FROM auto_upload_rules
WHERE rule_name LIKE CONCAT('%', ?, '%')
  OR enterprise_name LIKE CONCAT('%', ?, '%')
ORDER BY rule_name;
```

### Auto Upload Execution & Failed Records Queries

```sql
-- Get execution history with failure summary
SELECT 
  aue.execution_id,
  aue.rule_name,
  aue.execution_time,
  aue.status,
  aue.records_processed,
  aue.records_failed,
  COUNT(aufr.failed_id) as total_failed_records,
  aue.processing_time_seconds,
  aue.error_message
FROM auto_upload_execution aue
LEFT JOIN auto_upload_failed_record aufr ON aue.execution_id = aufr.execution_id
WHERE aue.rule_id = ?
GROUP BY aue.execution_id
ORDER BY aue.execution_time DESC
LIMIT ? OFFSET ?;

-- Get failed records with details
SELECT 
  aufr.failed_id,
  aufr.rule_id,
  aufr.file_name,
  aufr.row_number,
  aufr.error_type,
  aufr.error_message,
  aufr.email_receive_time,
  aufr.resolution_status,
  aufr.created_time
FROM auto_upload_failed_record aufr
WHERE aufr.rule_id = ?
  AND aufr.resolution_status = 'Pending'
ORDER BY aufr.created_time DESC
LIMIT ? OFFSET ?;

-- Failed records summary by error type
SELECT 
  aufr.error_type,
  COUNT(*) as count,
  MIN(aufr.created_time) as earliest,
  MAX(aufr.created_time) as latest
FROM auto_upload_failed_record aufr
WHERE aufr.rule_id = ?
  AND aufr.created_time > DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY aufr.error_type
ORDER BY count DESC;
```

### Customer Rate Table Queries

```sql
-- Get all customer rate tables with details
SELECT 
  crt.rate_table_id,
  crt.rate_table_name,
  crt.customer_trunk_id,
  crt.product_category,
  c.iso_code as currency,
  crt.status,
  crt.approval_status,
  COUNT(crd.detail_id) as destination_count,
  crt.effective_from,
  crt.updated_time
FROM customer_rate_table crt
LEFT JOIN currency c ON crt.currency_id = c.currency_id
LEFT JOIN customer_rate_detail crd ON crt.rate_table_id = crd.rate_table_id
WHERE crt.status != 'Archived'
GROUP BY crt.rate_table_id
ORDER BY crt.updated_time DESC
LIMIT ? OFFSET ?;

-- Get rate table with all destination rates
SELECT 
  crd.detail_id,
  crd.destination_code,
  crd.destination_name,
  crd.operator_name,
  crd.rate_per_unit,
  crd.unit_type,
  crd.billing_increment,
  crd.setup_fee,
  crd.effective_from,
  crd.effective_to
FROM customer_rate_table crt
LEFT JOIN customer_rate_detail crd ON crt.rate_table_id = crd.rate_table_id
WHERE crt.rate_table_id = ?
  AND (crd.effective_to IS NULL OR crd.effective_to >= CURDATE())
ORDER BY crd.destination_code;

-- Search customer rate tables
SELECT rate_table_id, rate_table_name, customer_trunk_id, status
FROM customer_rate_table
WHERE rate_table_name LIKE CONCAT('%', ?, '%')
  AND status = 'Active'
ORDER BY rate_table_name;
```

### Vendor Rate Table Queries

```sql
-- Get all vendor rate tables
SELECT 
  vrt.vendor_rate_table_id,
  vrt.rate_table_name,
  vrt.vendor_name,
  vrt.cost_model,
  c.iso_code as currency,
  vrt.status,
  COUNT(vrd.detail_id) as destination_count,
  vrt.effective_from,
  vrt.updated_time
FROM vendor_rate_table vrt
LEFT JOIN currency c ON vrt.currency_id = c.currency_id
LEFT JOIN vendor_rate_detail vrd ON vrt.vendor_rate_table_id = vrd.vendor_rate_table_id
WHERE vrt.status != 'Archived'
GROUP BY vrt.vendor_rate_table_id
ORDER BY vrt.updated_time DESC
LIMIT ? OFFSET ?;

-- Get vendor rate details with cost breakdown
SELECT 
  vrd.detail_id,
  vrd.destination_code,
  vrd.destination_name,
  vrd.operator_name,
  vrd.cost_per_unit,
  vrd.minimum_cost,
  vrd.volume_discount_pct,
  vrd.volume_threshold
FROM vendor_rate_table vrt
LEFT JOIN vendor_rate_detail vrd ON vrt.vendor_rate_table_id = vrd.vendor_rate_table_id
WHERE vrt.vendor_rate_table_id = ?
  AND (vrd.created_time IS NULL OR vrd.created_time >= DATE_SUB(NOW(), INTERVAL 2 YEAR))
ORDER BY vrd.destination_code;
```

### Re-Rating Queries

```sql
-- Get all re-rating requests with completion status
SELECT 
  rrr.re_rating_id,
  rrr.enterprise_id,
  rrr.reason,
  rrr.requested_by,
  rrr.requested_time,
  rrr.status,
  rrr.total_transactions_reprocessed,
  rrr.total_amount_adjusted,
  rrr.completion_time,
  CASE 
    WHEN rrr.status = 'Completed' THEN 'Completed'
    WHEN rrr.status = 'In Progress' THEN 'Processing'
    WHEN rrr.status = 'Pending' AND rrr.requested_time < DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 'Delayed'
    ELSE rrr.status
  END as effective_status
FROM re_rating_request rrr
ORDER BY rrr.requested_time DESC
LIMIT ? OFFSET ?;

-- Get re-rating history for an enterprise
SELECT 
  rrr.re_rating_id,
  rrr.date_from,
  rrr.date_to,
  rrr.total_transactions_reprocessed,
  rrr.total_amount_adjusted,
  rrr.status,
  rrr.requested_time,
  rrr.completion_time
FROM re_rating_request rrr
WHERE rrr.enterprise_id = ?
ORDER BY rrr.requested_time DESC;
```

### Rate Analytics Queries

```sql
-- Get daily revenue analytics by destination
SELECT 
  rad.analytics_date,
  rad.destination_code,
  rad.total_transactions,
  rad.total_volume,
  rad.total_revenue,
  rad.average_rate,
  rad.success_rate_pct
FROM rate_analytics_daily rad
WHERE rad.rate_table_id = ?
  AND rad.analytics_date BETWEEN ? AND ?
ORDER BY rad.analytics_date DESC, rad.total_revenue DESC
LIMIT ? OFFSET ?;

-- Get revenue trend (last 30 days)
SELECT 
  DATE(rad.analytics_date) as analytics_date,
  SUM(rad.total_revenue) as daily_revenue,
  SUM(rad.total_transactions) as daily_transactions,
  AVG(rad.average_rate) as avg_rate
FROM rate_analytics_daily rad
WHERE rad.enterprise_id = ?
  AND rad.analytics_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(rad.analytics_date)
ORDER BY analytics_date DESC;

-- Get top destinations by revenue
SELECT 
  rad.destination_code,
  SUM(rad.total_revenue) as total_revenue,
  SUM(rad.total_transactions) as total_transactions,
  AVG(rad.average_rate) as avg_rate
FROM rate_analytics_daily rad
WHERE rad.enterprise_id = ?
  AND rad.analytics_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
GROUP BY rad.destination_code
ORDER BY total_revenue DESC
LIMIT 10;
```

## 3. Spring Boot Implementation (Controllers & Services)

Complete implementation files (Controllers for IMAP, FileTemplate, AutoUploadRules, RateTable, ReRating, Analytics) follow the same pattern as Product module - using repositories, services, DTOs with pagination, filtering, and error handling.

All endpoints use:
- `/api/rate/imap-account` - IMAP management
- `/api/rate/file-template` - Template management
- `/api/rate/auto-upload-rule` - Rule management
- `/api/rate/auto-upload-execution` - Execution history
- `/api/rate/auto-upload-failed` - Failed records
- `/api/rate/customer-rate-table` - Customer rates
- `/api/rate/vendor-rate-table` - Vendor rates
- `/api/rate/re-rating` - Re-rating requests
- `/api/rate/analytics` - Analytics and reports

## 4. Frontend Integration

Tables shown in `SectionView.tsx` align with the schema:
- `'IMAP Mail Account'`: Display all accounts with sync status, last sync time
- `'File Template'`: List templates with usage counts
- `'Auto Upload Rules'`: Show rules, execution stats, last run time
- `'Auto Upload Failed Report'`: Failed records with error breakdown
- `'Customer Rate Table'`: Rate tables with destination counts
- `'Vendor Rate Table'`: Vendor rates with cost models
- `'Re-Rating'`: Re-rating requests with status and adjusted amounts
- `'Rate Analytics'`: Dashboard showing revenue trends, top destinations

