# 📚 TeleOSS Complete Reference - All Queries & APIs

**Comprehensive guide to all SQL queries, API endpoints, and configurations created for TeleOSS**

---

## 📋 Table of Contents

1. [Database Queries](#database-queries)
2. [API Endpoints](#api-endpoints)
3. [Frontend Services](#frontend-services)
4. [Configuration Reference](#configuration-reference)
5. [Usage Examples](#usage-examples)
6. [Performance Queries](#performance-queries)
7. [Troubleshooting Queries](#troubleshooting-queries)

---

## 🗄️ Database Queries

### ENTERPRISE TABLE QUERIES

```sql
-- Get all enterprises
SELECT * FROM enterprise;

-- Get paginated enterprises (page 0, size 50)
SELECT * FROM enterprise LIMIT 0, 50;

-- Get active enterprises
SELECT * FROM enterprise WHERE status = 'ACTIVE';

-- Get enterprises by type
SELECT * FROM enterprise WHERE enterprise_type = 'CUSTOMER';
SELECT * FROM enterprise WHERE enterprise_type = 'VENDOR';
SELECT * FROM enterprise WHERE enterprise_type = 'SUPPLIER';

-- Search enterprises by name
SELECT * FROM enterprise WHERE enterprise_name LIKE '%ABC%';

-- Count enterprises
SELECT COUNT(*) as total FROM enterprise;

-- Get enterprise by ID
SELECT * FROM enterprise WHERE enterprise_id = 1;

-- Insert new enterprise
INSERT INTO enterprise (enterprise_name, enterprise_type, status, created_at, updated_at)
VALUES ('ABC Corp', 'CUSTOMER', 'ACTIVE', NOW(), NOW());

-- Update enterprise
UPDATE enterprise SET enterprise_name = 'Updated Corp', status = 'INACTIVE' WHERE enterprise_id = 1;

-- Delete enterprise
DELETE FROM enterprise WHERE enterprise_id = 1;

-- Get enterprise count by type
SELECT enterprise_type, COUNT(*) as count FROM enterprise GROUP BY enterprise_type;

-- Get recently created enterprises
SELECT * FROM enterprise ORDER BY created_at DESC LIMIT 10;

-- Bulk insert enterprises
INSERT INTO enterprise (enterprise_name, enterprise_type, status) VALUES
('Corp 1', 'CUSTOMER', 'ACTIVE'),
('Corp 2', 'VENDOR', 'ACTIVE'),
('Corp 3', 'SUPPLIER', 'INACTIVE');
```

---

### FINANCE - TRANSACTIONS TABLE QUERIES

```sql
-- Get all transactions
SELECT * FROM transactions;

-- Get pending transactions
SELECT * FROM transactions WHERE payment_status = 'PENDING';

-- Get transactions by status
SELECT * FROM transactions WHERE payment_status = 'FULL';

-- Get transactions in date range
SELECT * FROM transactions 
WHERE payment_date BETWEEN '2024-01-01' AND '2024-01-31';

-- Get transactions by payment type
SELECT * FROM transactions WHERE payment_type = 'CREDIT';

-- Get transactions by mode
SELECT * FROM transactions WHERE mode_of_payment = 'Bank Transfer';

-- Sum transactions by status
SELECT payment_status, COUNT(*) as count, SUM(amount) as total
FROM transactions GROUP BY payment_status;

-- Get highest amount transactions
SELECT * FROM transactions ORDER BY amount DESC LIMIT 10;

-- Get transactions for invoice
SELECT * FROM transactions WHERE invoice_number = 'INV-001';

-- Insert transaction
INSERT INTO transactions (name, payment_date, amount, payment_status, payment_type)
VALUES ('ABC Corp', '2024-01-20', 5000.00, 'PENDING', 'CREDIT');

-- Update transaction status
UPDATE transactions SET payment_status = 'FULL' WHERE info_id = 1;

-- Calculate total by payment type
SELECT payment_type, SUM(amount) as total FROM transactions GROUP BY payment_type;

-- Get transactions by enterprise
SELECT * FROM transactions WHERE name LIKE '%ABC%';

-- Get pending amount
SELECT SUM(amount) as pending_amount FROM transactions WHERE payment_status = 'PENDING';
```

---

### FINANCE - INVOICES TABLE QUERIES

```sql
-- Get all invoices
SELECT * FROM invoices;

-- Get pending invoices
SELECT * FROM invoices WHERE status = 'PENDING';

-- Get paid invoices
SELECT * FROM invoices WHERE status = 'PAID';

-- Get overdue invoices
SELECT * FROM invoices WHERE status = 'OVERDUE' AND due_date < CURDATE();

-- Get invoices by enterprise
SELECT * FROM invoices WHERE enterprise_name = 'ABC Corp';

-- Get invoices by type
SELECT * FROM invoices WHERE billing_type = 'POSTPAID';

-- Get invoices in date range
SELECT * FROM invoices 
WHERE invoice_date BETWEEN '2024-01-01' AND '2024-01-31';

-- Get invoice with details
SELECT * FROM invoices WHERE invoice_no = 'INV-2024-001';

-- Sum invoices by status
SELECT status, COUNT(*) as count, SUM(amount) as total
FROM invoices GROUP BY status;

-- Get outstanding invoices
SELECT * FROM invoices WHERE status IN ('PENDING', 'OVERDUE');

-- Calculate total outstanding
SELECT SUM(amount - COALESCE(paid_amount, 0)) as outstanding
FROM invoices WHERE status IN ('PENDING', 'OVERDUE');

-- Insert invoice
INSERT INTO invoices (invoice_no, status, enterprise_name, amount, due_date)
VALUES ('INV-2024-100', 'DRAFT', 'ABC Corp', 2500.00, '2024-02-15');

-- Update invoice status
UPDATE invoices SET status = 'PAID', paid_amount = amount WHERE invoice_id = 1;

-- Get invoices by due date
SELECT * FROM invoices WHERE due_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
AND status != 'PAID';

-- Calculate revenue by month
SELECT MONTH(invoice_date) as month, SUM(amount) as revenue
FROM invoices WHERE status = 'PAID'
GROUP BY MONTH(invoice_date);
```

---

### FINANCE - BALANCE TABLE QUERIES

```sql
-- Get all balances
SELECT * FROM enterprise_balance;

-- Get balance for enterprise
SELECT * FROM enterprise_balance WHERE enterprise_name = 'ABC Corp';

-- Get enterprises with credit balance
SELECT * FROM enterprise_balance WHERE net_balance > 0;

-- Get enterprises with debit balance
SELECT * FROM enterprise_balance WHERE net_balance < 0;

-- Sum all customer balances
SELECT SUM(customer_balance) as total_customer_balance FROM enterprise_balance;

-- Sum all vendor balances
SELECT SUM(vendor_balance) as total_vendor_balance FROM enterprise_balance;

-- Get total net balance
SELECT SUM(net_balance) as total_net_balance FROM enterprise_balance;

-- Update customer balance
UPDATE enterprise_balance 
SET customer_balance = customer_balance + 1000 
WHERE enterprise_name = 'ABC Corp';

-- Update vendor balance
UPDATE enterprise_balance 
SET vendor_balance = vendor_balance - 500 
WHERE enterprise_name = 'ABC Corp';

-- Calculate net balance
UPDATE enterprise_balance 
SET net_balance = customer_balance - vendor_balance 
WHERE enterprise_name = 'ABC Corp';

-- Get account manager view
SELECT enterprise_name, account_manager, customer_balance, vendor_balance, net_balance
FROM enterprise_balance ORDER BY net_balance DESC;

-- Get balance by billing cycle
SELECT billing_cycle, COUNT(*) as count, SUM(net_balance) as total
FROM enterprise_balance GROUP BY billing_cycle;

-- Find accounts needing attention
SELECT * FROM enterprise_balance WHERE net_balance < -5000 OR net_balance > 50000;
```

---

### RATE - MCCMNC TABLE QUERIES

```sql
-- Get all MCCMNC codes
SELECT * FROM mccmnc_unique_codes;

-- Get MCCMNC by code
SELECT * FROM mccmnc_unique_codes WHERE mccmnc = '310410';

-- Get codes by country
SELECT * FROM mccmnc_unique_codes WHERE country = 'USA';

-- Get codes by ISO
SELECT * FROM mccmnc_unique_codes WHERE iso = 'US';

-- Get codes by MCC
SELECT * FROM mccmnc_unique_codes WHERE mcc = '310';

-- Get codes by MNC
SELECT * FROM mccmnc_unique_codes WHERE mnc = '410';

-- Get network details
SELECT mccmnc, country, code_network FROM mccmnc_unique_codes;

-- Count by country
SELECT country, COUNT(*) as count FROM mccmnc_unique_codes GROUP BY country;

-- Get all networks
SELECT DISTINCT code_network FROM mccmnc_unique_codes ORDER BY code_network;

-- Insert MCCMNC
INSERT INTO mccmnc_unique_codes (mcc, mnc, mccmnc, iso, country, code_network)
VALUES ('310', '410', '310410', 'US', 'USA', 'AT&T');

-- Update MCCMNC
UPDATE mccmnc_unique_codes SET code_network = 'New Network' WHERE mccmnc = '310410';

-- Search MCCMNC
SELECT * FROM mccmnc_unique_codes WHERE country LIKE '%India%' OR code_network LIKE '%Vodafone%';
```

---

### RATE - MO REFERENCE BOOK QUERIES

```sql
-- Get all MO references
SELECT * FROM mo_reference_book;

-- Get by trunk
SELECT * FROM mo_reference_book WHERE customer_trunk = 'TRUNK_001';

-- Get by MCCMNC
SELECT * FROM mo_reference_book WHERE mccmnc = '310410';

-- Get by keyword
SELECT * FROM mo_reference_book WHERE keyword = 'SALE';

-- Get by number
SELECT * FROM mo_reference_book WHERE number = '1712284';

-- Get by destination
SELECT * FROM mo_reference_book WHERE destination = 'USA';

-- Get rates between range
SELECT * FROM mo_reference_book WHERE rate BETWEEN 0.01 AND 0.05;

-- Get highest rates
SELECT * FROM mo_reference_book ORDER BY rate DESC LIMIT 10;

-- Get lowest rates
SELECT * FROM mo_reference_book ORDER BY rate ASC LIMIT 10;

-- Compare vendor vs customer rates
SELECT customer_trunk, number, rate as customer_rate, vendor_rate, 
(rate - vendor_rate) as margin FROM mo_reference_book;

-- Insert MO reference
INSERT INTO mo_reference_book (customer_trunk, number, keyword, rate, vendor_rate, mccmnc, destination)
VALUES ('TRUNK_001', '1712284', 'SALE', 0.015, 0.012, '310410', 'USA');

-- Update rate
UPDATE mo_reference_book SET rate = 0.018 WHERE info_id = 1;

-- Bulk rate update
UPDATE mo_reference_book SET rate = rate * 1.1 WHERE destination = 'USA';

-- Get average rate by destination
SELECT destination, AVG(rate) as avg_rate FROM mo_reference_book GROUP BY destination;

-- Get rate volatility
SELECT destination, MIN(rate) as min_rate, MAX(rate) as max_rate, 
MAX(rate) - MIN(rate) as variance FROM mo_reference_book GROUP BY destination;
```

---

### RATE - COUNTRIES TABLE QUERIES

```sql
-- Get all countries
SELECT * FROM country;

-- Get country by name
SELECT * FROM country WHERE name = 'United States';

-- Get country by ISO code
SELECT * FROM country WHERE iso_code = 'US';

-- Get country by dial code
SELECT * FROM country WHERE dial_code = '1';

-- Count all countries
SELECT COUNT(*) as total_countries FROM country;

-- Get countries sorted by name
SELECT * FROM country ORDER BY name ASC;

-- Search countries
SELECT * FROM country WHERE name LIKE '%India%' OR iso_code LIKE '%IN%';

-- Insert country
INSERT INTO country (name, iso_code, dial_code) VALUES ('Germany', 'DE', '49');

-- Update country
UPDATE country SET dial_code = '91' WHERE iso_code = 'IN';

-- Get all dial codes
SELECT name, dial_code FROM country ORDER BY dial_code;

-- Countries with specific dial code
SELECT * FROM country WHERE dial_code IN ('1', '44', '91');
```

---

### PRODUCT TABLE QUERIES

```sql
-- Get all products
SELECT * FROM products;

-- Get active products
SELECT * FROM products WHERE status = 'ACTIVE';

-- Get inactive products
SELECT * FROM products WHERE status = 'INACTIVE';

-- Get products by category
SELECT * FROM products WHERE category_id = 1;

-- Get product with category name
SELECT p.*, c.category_name FROM products p
LEFT JOIN product_category c ON p.category_id = c.info_id;

-- Search products
SELECT * FROM products WHERE product_name LIKE '%SMS%';

-- Get products by category with count
SELECT c.category_name, COUNT(p.product_id) as count
FROM product_category c
LEFT JOIN products p ON c.info_id = p.category_id
GROUP BY c.category_name;

-- Insert product
INSERT INTO products (product_name, category_id, status)
VALUES ('SMS Bulk', 1, 'ACTIVE');

-- Update product
UPDATE products SET status = 'INACTIVE' WHERE product_id = 1;

-- Delete product
DELETE FROM products WHERE product_id = 1;

-- Get total products
SELECT COUNT(*) as total FROM products;

-- Get category with most products
SELECT category_id, COUNT(*) as product_count FROM products
GROUP BY category_id ORDER BY product_count DESC LIMIT 1;
```

---

### PRODUCT CATEGORY TABLE QUERIES

```sql
-- Get all categories
SELECT * FROM product_category;

-- Get category by ID
SELECT * FROM product_category WHERE info_id = 1;

-- Get category by name
SELECT * FROM product_category WHERE category_name = 'International';

-- Insert category
INSERT INTO product_category (category_name, updated_by)
VALUES ('Premium Services', 'Admin');

-- Update category
UPDATE product_category SET category_name = 'International SMS' WHERE info_id = 1;

-- Delete category
DELETE FROM product_category WHERE info_id = 1;

-- Get category usage count
SELECT c.*, COUNT(p.product_id) as product_count
FROM product_category c
LEFT JOIN products p ON c.info_id = p.category_id
GROUP BY c.info_id;
```

---

### SMS SERVICES - TRANSLATION RULES QUERIES

```sql
-- Get all translation rules
SELECT * FROM translation_rule;

-- Get ingress rules
SELECT * FROM translation_rule WHERE type = 'INGRESS';

-- Get egress rules
SELECT * FROM translation_rule WHERE type = 'EGRESS';

-- Get rules by MCCMNC
SELECT * FROM translation_rule WHERE mccmnc = '310410';

-- Get rules that continue
SELECT * FROM translation_rule WHERE continue_rule = 'YES';

-- Search rules by name
SELECT * FROM translation_rule WHERE translation_rule_name LIKE '%Strip%';

-- Insert translation rule
INSERT INTO translation_rule (translation_rule_name, type, action, mccmnc, updated_by)
VALUES ('Strip Prefix', 'INGRESS', 'MODIFY', '310410', 'Admin');

-- Update rule
UPDATE translation_rule SET action = 'APPEND' WHERE info_id = 1;

-- Get rules by action
SELECT action, COUNT(*) as count FROM translation_rule GROUP BY action;

-- Get active rules
SELECT * FROM translation_rule ORDER BY updated_at DESC;
```

---

### SMS SERVICES - AUTO UPLOAD RULES QUERIES

```sql
-- Get all auto upload rules
SELECT * FROM auto_upload_rules;

-- Get active rules
SELECT * FROM auto_upload_rules WHERE status = 'ACTIVE';

-- Get inactive rules
SELECT * FROM auto_upload_rules WHERE status = 'INACTIVE';

-- Get rules by enterprise
SELECT * FROM auto_upload_rules WHERE enterprise_name = 'ABC Corp';

-- Get rules by vendor trunk
SELECT * FROM auto_upload_rules WHERE vendor_trunk = 'VT_001';

-- Search rules
SELECT * FROM auto_upload_rules WHERE auto_upload_rules_name LIKE '%Rates%';

-- Insert auto upload rule
INSERT INTO auto_upload_rules (auto_upload_rules_name, enterprise_name, status, updated_by)
VALUES ('Daily Rates', 'ABC Corp', 'ACTIVE', 'Admin');

-- Update rule status
UPDATE auto_upload_rules SET status = 'INACTIVE' WHERE info_id = 1;

-- Toggle rule
UPDATE auto_upload_rules SET status = CASE 
  WHEN status = 'ACTIVE' THEN 'INACTIVE'
  ELSE 'ACTIVE' END WHERE info_id = 1;

-- Get rule count by enterprise
SELECT enterprise_name, COUNT(*) as rule_count FROM auto_upload_rules
GROUP BY enterprise_name;

-- Get last updated rules
SELECT * FROM auto_upload_rules ORDER BY updated_time DESC LIMIT 10;
```

---

### REPORTS TABLE QUERIES

```sql
-- Get all daily reports
SELECT * FROM daily_reports;

-- Get report for specific date
SELECT * FROM daily_reports WHERE report_date = '2024-01-20';

-- Get reports in date range
SELECT * FROM daily_reports WHERE report_date BETWEEN '2024-01-01' AND '2024-01-31';

-- Get report for enterprise
SELECT * FROM daily_reports WHERE enterprise_id = 1;

-- Get daily summary
SELECT report_date, SUM(total_messages) as total, SUM(successful_messages) as success,
SUM(failed_messages) as failed, SUM(total_revenue) as revenue
FROM daily_reports WHERE report_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY report_date;

-- Get summary reports
SELECT * FROM summary_reports;

-- Get summary by period
SELECT * FROM summary_reports WHERE period = 'MONTHLY';

-- Get monthly revenue
SELECT YEAR(start_date) as year, MONTH(start_date) as month, total_revenue
FROM summary_reports WHERE period = 'MONTHLY'
ORDER BY start_date DESC;

-- Get yearly totals
SELECT YEAR(start_date) as year, SUM(total_revenue) as annual_revenue
FROM summary_reports GROUP BY YEAR(start_date);

-- Calculate success rate
SELECT enterprise_id, 
ROUND((SUM(successful_messages) / SUM(total_messages)) * 100, 2) as success_rate
FROM daily_reports GROUP BY enterprise_id;

-- Get top performing enterprises
SELECT enterprise_id, SUM(total_revenue) as revenue FROM daily_reports
GROUP BY enterprise_id ORDER BY revenue DESC LIMIT 10;
```

---

### ADMIN - USERS TABLE QUERIES

```sql
-- Get all users
SELECT * FROM users;

-- Get active users
SELECT * FROM users WHERE status = 'ACTIVE';

-- Get user by username
SELECT * FROM users WHERE username = 'admin';

-- Get user by email
SELECT * FROM users WHERE email = 'admin@example.com';

-- Get users by role
SELECT * FROM users WHERE role_id = 1;

-- Search users
SELECT * FROM users WHERE first_name LIKE '%John%' OR last_name LIKE '%Doe%';

-- Get user with role
SELECT u.*, r.role_name FROM users u
LEFT JOIN roles r ON u.role_id = r.role_id;

-- Insert user
INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, status)
VALUES ('john_doe', 'john@example.com', 'hashed_password', 'John', 'Doe', 1, 'ACTIVE');

-- Update user
UPDATE users SET email = 'newemail@example.com' WHERE user_id = 1;

-- Deactivate user
UPDATE users SET status = 'INACTIVE' WHERE user_id = 1;

-- Get recently logged in users
SELECT * FROM users WHERE last_login IS NOT NULL
ORDER BY last_login DESC LIMIT 10;

-- Update last login
UPDATE users SET last_login = NOW() WHERE user_id = 1;

-- Count users by role
SELECT role_id, COUNT(*) as count FROM users GROUP BY role_id;

-- Find suspended users
SELECT * FROM users WHERE status = 'SUSPENDED';
```

---

### ADMIN - AUDIT LOG QUERIES

```sql
-- Get all audit logs
SELECT * FROM audit_log;

-- Get logs for user
SELECT * FROM audit_log WHERE user_id = 1;

-- Get logs in date range
SELECT * FROM audit_log WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';

-- Get logs by action
SELECT * FROM audit_log WHERE action = 'CREATE';

-- Get logs by module
SELECT * FROM audit_log WHERE module = 'ENTERPRISE';

-- Get recent logs
SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 50;

-- Get logs by IP
SELECT * FROM audit_log WHERE ip_address = '192.168.1.100';

-- Summary of actions
SELECT action, COUNT(*) as count FROM audit_log GROUP BY action;

-- Summary by module
SELECT module, COUNT(*) as count FROM audit_log GROUP BY module;

-- User activity timeline
SELECT user_id, action, module, COUNT(*) as count FROM audit_log
GROUP BY user_id, action, module ORDER BY user_id;

-- Find suspicious activity
SELECT * FROM audit_log WHERE action = 'DELETE' OR action = 'UPDATE'
ORDER BY created_at DESC LIMIT 20;

-- Daily activity summary
SELECT DATE(created_at) as date, COUNT(*) as total_actions FROM audit_log
GROUP BY DATE(created_at) ORDER BY date DESC;
```

---

## 📡 API Endpoints

### Enterprise Module Endpoints

```
GET    /api/enterprise/list?page=0&size=50&search=query&type=CUSTOMER
GET    /api/enterprise/{id}
POST   /api/enterprise/create
PUT    /api/enterprise/update/{id}
DELETE /api/enterprise/delete/{id}
```

### Finance Module Endpoints

```
GET    /api/finance/transactions?page=0&size=50&status=PENDING
POST   /api/finance/transactions/create
GET    /api/finance/transactions/{id}
PUT    /api/finance/transactions/{id}

GET    /api/finance/invoices?page=0&size=50
GET    /api/finance/invoices/{invoiceNo}
POST   /api/finance/invoices/create
POST   /api/finance/invoices/generate?enterpriseId=1&period=MONTHLY
PUT    /api/finance/invoices/{id}

GET    /api/finance/balance?enterpriseName=ABC%20Corp
GET    /api/finance/balance/{enterpriseName}
PUT    /api/finance/balance/{enterpriseName}?amount=1000&type=credit
GET    /api/finance/balance/outstanding

GET    /api/finance/billing-cycles
GET    /api/finance/billing-cycles/{id}
POST   /api/finance/billing-cycles/create
```

### Rate Module Endpoints

```
GET    /api/rate/mccmnc?page=0&size=50
GET    /api/rate/mccmnc/{id}
GET    /api/rate/mccmnc?iso=US
GET    /api/rate/mccmnc?search=310410

GET    /api/rate/mo-reference?page=0&size=50&trunk=TRUNK_001
GET    /api/rate/mo-reference/{id}
GET    /api/rate/mo-reference/lookup?destination=USA&mccmnc=310410
GET    /api/rate/mo-reference/highest?limit=10
GET    /api/rate/mo-reference/analytics?startDate=2024-01-01&endDate=2024-01-31
POST   /api/rate/mo-reference/create
PUT    /api/rate/mo-reference/{id}
DELETE /api/rate/mo-reference/{id}

GET    /api/rate/wholesale?page=0&size=50
POST   /api/rate/wholesale/create

GET    /api/rate/countries
GET    /api/rate/countries/{isoCode}
GET    /api/rate/countries?search=India
```

### Product Module Endpoints

```
GET    /api/product/categories
GET    /api/product/categories/{id}
POST   /api/product/categories/create
PUT    /api/product/categories/{id}
DELETE /api/product/categories/{id}

GET    /api/product/list?page=0&size=50&search=SMS
GET    /api/product/{id}
POST   /api/product/create
PUT    /api/product/{id}
DELETE /api/product/{id}
GET    /api/product/list?categoryId=1
GET    /api/product/list?status=ACTIVE
```

### SMS Services Module Endpoints

```
GET    /api/sms-services/translation-rules?page=0&size=50&type=INGRESS
GET    /api/sms-services/translation-rules/{id}
GET    /api/sms-services/translation-rules?mccmnc=310410
POST   /api/sms-services/translation-rules/create
PUT    /api/sms-services/translation-rules/{id}
DELETE /api/sms-services/translation-rules/{id}

GET    /api/sms-services/auto-upload-rules?page=0&size=50
GET    /api/sms-services/auto-upload-rules/{id}
GET    /api/sms-services/auto-upload-rules?enterprise=ABC%20Corp
POST   /api/sms-services/auto-upload-rules/create
PUT    /api/sms-services/auto-upload-rules/{id}
DELETE /api/sms-services/auto-upload-rules/{id}
PUT    /api/sms-services/auto-upload-rules/{id}/toggle?enabled=true

GET    /api/sms-services/business-companies
GET    /api/sms-services/business-companies/{id}
GET    /api/sms-services/business-companies/{id}/config
POST   /api/sms-services/business-companies/create
PUT    /api/sms-services/business-companies/{id}
PUT    /api/sms-services/business-companies/{id}/config
```

### Report Module Endpoints

```
GET    /api/report/daily?page=0&size=50&date=2024-01-20
GET    /api/report/daily/{id}
GET    /api/report/daily?enterpriseId=1&startDate=2024-01-01&endDate=2024-01-31

GET    /api/report/summary?page=0&size=50&period=MONTHLY
GET    /api/report/summary/{id}
GET    /api/report/summary/monthly?month=January&year=2024
GET    /api/report/summary/quarterly?quarter=1&year=2024
GET    /api/report/summary/annual?year=2024

POST   /api/report/custom
GET    /api/report/custom?page=0&size=50
GET    /api/report/custom/{id}
POST   /api/report/custom/save

POST   /api/report/export/{reportId}?format=PDF
POST   /api/report/export/daily?startDate=2024-01-01&endDate=2024-01-31&format=PDF
POST   /api/report/export/summary?period=MONTHLY&format=EXCEL

GET    /api/report/tps?startDate=2024-01-01&endDate=2024-01-31
GET    /api/report/traffic?startDate=2024-01-01&endDate=2024-01-31
GET    /api/report/supplier?startDate=2024-01-01&endDate=2024-01-31
GET    /api/report/revenue?startDate=2024-01-01&endDate=2024-01-31

POST   /api/report/schedule
GET    /api/report/scheduled
```

### Admin Module Endpoints

```
GET    /api/admin/users?page=0&size=50&search=john
GET    /api/admin/users/{id}
POST   /api/admin/users/create
PUT    /api/admin/users/{id}
DELETE /api/admin/users/{id}
PUT    /api/admin/users/{id}/activate
PUT    /api/admin/users/{id}/deactivate
POST   /api/admin/users/{id}/reset-password

GET    /api/admin/roles
GET    /api/admin/roles/{id}
POST   /api/admin/roles/create
PUT    /api/admin/roles/{id}
DELETE /api/admin/roles/{id}
PUT    /api/admin/roles/{id}/permissions

GET    /api/admin/permissions
GET    /api/admin/permissions/{id}
GET    /api/admin/permissions/role/{roleId}
POST   /api/admin/permissions/create
PUT    /api/admin/permissions/{id}
DELETE /api/admin/permissions/{id}

GET    /api/admin/audit-log?page=0&size=50
GET    /api/admin/audit-log/{id}
GET    /api/admin/audit-log?userId=1&startDate=2024-01-01&endDate=2024-01-31
GET    /api/admin/audit-log?action=CREATE&startDate=2024-01-01
POST   /api/admin/audit-log/export?startDate=2024-01-01&endDate=2024-01-31&format=PDF

GET    /api/admin/system-config
PUT    /api/admin/system-config
GET    /api/admin/dashboard
GET    /api/admin/system-health
```

---

## 💻 Frontend Services

### Enterprise Service Methods

```typescript
enterpriseService.getList(page, size, search)
enterpriseService.getDetail(id)
enterpriseService.create(data)
enterpriseService.update(id, data)
enterpriseService.delete(id)
enterpriseService.getByType(type)
enterpriseService.search(query)
enterpriseService.getActive()
```

### Finance Service Methods

```typescript
financeService.getTransactions(page, size, filters)
financeService.getTransactionDetail(id)
financeService.createTransaction(data)
financeService.updateTransaction(id, data)

financeService.getInvoices(page, size, filters)
financeService.getInvoiceDetail(invoiceNo)
financeService.createInvoice(data)
financeService.generateInvoice(enterpriseId, period)

financeService.getBalance(enterpriseName)
financeService.getEnterpriseBalance(enterpriseName)
financeService.updateBalance(enterpriseName, amount, type)

financeService.getBillingCycles()
financeService.getBillingCycleDetail(id)
financeService.createBillingCycle(data)

financeService.getFinancialSummary(startDate, endDate)
financeService.getPaymentStatusReport()
financeService.getOutstandingAmount()
```

### Rate Service Methods

```typescript
rateService.getMCCMNC(page, size, filters)
rateService.getMCCMNCDetail(id)
rateService.searchMCCMNC(mccmnc)
rateService.getMCCMNCByCountry(countryCode)

rateService.getMOReference(page, size, filters)
rateService.getMOReferenceDetail(id)
rateService.createMOReference(data)
rateService.updateMOReference(id, data)
rateService.deleteMOReference(id)
rateService.getMOReferenceByTrunk(trunk)

rateService.getWholesaleRates(page, size)
rateService.createWholesaleRate(data)

rateService.getCountries()
rateService.getCountryDetail(isoCode)
rateService.searchCountries(query)

rateService.lookupRate(destination, mccmnc)
rateService.getRateAnalytics(startDate, endDate)
rateService.getHighestRates(limit)
```

### Product Service Methods

```typescript
productService.getCategories()
productService.getCategoryDetail(id)
productService.createCategory(data)
productService.updateCategory(id, data)
productService.deleteCategory(id)

productService.getProducts(page, size, filters)
productService.getProductDetail(id)
productService.createProduct(data)
productService.updateProduct(id, data)
productService.deleteProduct(id)
productService.getProductsByCategory(categoryId)
productService.searchProducts(query)
productService.getActiveProducts()
productService.getProductsByEnterprise(enterpriseId)
```

### SMS Services Methods

```typescript
smsService.getTranslationRules(page, size, filters)
smsService.getTranslationRuleDetail(id)
smsService.createTranslationRule(data)
smsService.updateTranslationRule(id, data)
smsService.deleteTranslationRule(id)
smsService.getTranslationRulesByType(type)
smsService.getTranslationRulesByMCCMNC(mccmnc)

smsService.getAutoUploadRules(page, size, filters)
smsService.getAutoUploadRuleDetail(id)
smsService.createAutoUploadRule(data)
smsService.updateAutoUploadRule(id, data)
smsService.deleteAutoUploadRule(id)
smsService.getAutoUploadRulesByEnterprise(enterpriseName)
smsService.toggleAutoUploadRule(id, enabled)

smsService.getBusinessCompanies()
smsService.getBusinessCompanyDetail(id)
smsService.createBusinessCompany(data)
smsService.updateBusinessCompany(id, data)
smsService.getSMSConfiguration(companyId)
smsService.updateSMSConfiguration(companyId, config)
```

### Report Service Methods

```typescript
reportService.getDailyReports(page, size, filters)
reportService.getDailyReportDetail(id)
reportService.getDailyReportByDate(date)
reportService.getDailyReportByEnterprise(enterpriseId, startDate, endDate)

reportService.getSummaryReports(page, size, filters)
reportService.getSummaryReportDetail(id)
reportService.getSummaryReportByPeriod(period, startDate, endDate)
reportService.getMonthlySummary(month, year)
reportService.getQuarterlySummary(quarter, year)
reportService.getAnnualSummary(year)

reportService.generateCustomReport(config)
reportService.getCustomReports(page, size)
reportService.getCustomReportDetail(id)
reportService.saveCustomReport(config)

reportService.exportReport(reportId, format)
reportService.exportDailyReports(startDate, endDate, format)
reportService.exportSummaryReport(period, format)

reportService.getTPSReport(startDate, endDate)
reportService.getTrafficReport(startDate, endDate)
reportService.getSupplierReport(startDate, endDate)
reportService.getRevenueReport(startDate, endDate)
reportService.getComplianceReport(startDate, endDate)

reportService.scheduleReport(config)
reportService.getScheduledReports()
```

### Admin Service Methods

```typescript
adminService.getUsers(page, size, filters)
adminService.getUserDetail(id)
adminService.createUser(data)
adminService.updateUser(id, data)
adminService.deleteUser(id)
adminService.activateUser(id)
adminService.deactivateUser(id)
adminService.resetPassword(userId)
adminService.searchUsers(query)
adminService.getUsersByRole(roleId)

adminService.getRoles()
adminService.getRoleDetail(id)
adminService.createRole(data)
adminService.updateRole(id, data)
adminService.deleteRole(id)
adminService.assignPermissionToRole(roleId, permissionIds)

adminService.getPermissions()
adminService.getPermissionDetail(id)
adminService.createPermission(data)
adminService.updatePermission(id, data)
adminService.deletePermission(id)
adminService.getPermissionsByRole(roleId)

adminService.getAuditLogs(page, size, filters)
adminService.getAuditLogDetail(id)
adminService.getAuditLogsByUser(userId, startDate, endDate)
adminService.getAuditLogsByAction(action, startDate, endDate)
adminService.exportAuditLogs(startDate, endDate, format)

adminService.getSystemConfig()
adminService.updateSystemConfig(config)
adminService.getAdminDashboard()
adminService.getSystemHealth()
```

---

## ⚙️ Configuration Reference

### Database Configuration (config.ts)

```typescript
export const DB_CONFIG = {
  baseUrl: 'http://localhost:8080/api',
  
  // Change these table names for your database
  enterprise: {
    tableName: 'enterprise',
    fields: {
      id: 'enterprise_id',
      name: 'enterprise_name',
      type: 'enterprise_type',
      status: 'status',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    endpoints: { /* ... */ }
  },
  
  finance: {
    tables: {
      transaction: 'transactions',
      invoice: 'invoices',
      balance: 'enterprise_balance',
      billingCycle: 'billing_cycle',
    },
    // ... more config
  },
  // ... other modules
};

export const PAGINATION = {
  pageSize: 50,
  maxPageSize: 500,
};

export const QUERY_CONFIG = {
  timeout: 30000,
  cache: true,
  cacheTime: 5 * 60 * 1000, // 5 minutes
  retries: 2,
};
```

---

## 🔍 Performance Queries

```sql
-- Add indexes for faster queries
CREATE INDEX idx_enterprise_status ON enterprise(status);
CREATE INDEX idx_enterprise_type ON enterprise(enterprise_type);
CREATE INDEX idx_transaction_status ON transactions(payment_status);
CREATE INDEX idx_transaction_date ON transactions(payment_date);
CREATE INDEX idx_invoice_date ON invoices(invoice_date);
CREATE INDEX idx_invoice_status ON invoices(status);
CREATE INDEX idx_invoice_enterprise ON invoices(enterprise_name);
CREATE INDEX idx_mccmnc_code ON mccmnc_unique_codes(mccmnc);
CREATE INDEX idx_mccmnc_country ON mccmnc_unique_codes(country);
CREATE INDEX idx_mo_trunk ON mo_reference_book(customer_trunk);
CREATE INDEX idx_mo_mccmnc ON mo_reference_book(mccmnc);
CREATE INDEX idx_mo_number ON mo_reference_book(number);
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_status ON products(status);
CREATE INDEX idx_rule_type ON translation_rule(type);
CREATE INDEX idx_rule_mccmnc ON translation_rule(mccmnc);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_date ON audit_log(created_at);

-- Check query performance
EXPLAIN SELECT * FROM enterprise WHERE status = 'ACTIVE';
EXPLAIN SELECT * FROM transactions WHERE payment_date BETWEEN '2024-01-01' AND '2024-01-31';

-- Find slow queries
SHOW VARIABLES LIKE 'long_query_time';
SET GLOBAL long_query_time = 0.5;

-- Check index usage
SHOW INDEX FROM enterprise;
SHOW INDEX FROM transactions;
SHOW INDEX FROM invoices;
```

---

## 🐛 Troubleshooting Queries

```sql
-- Check database integrity
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'teleoss';

-- Verify table structure
DESC enterprise;
DESC transactions;
DESC invoices;

-- Check for missing data
SELECT * FROM enterprise WHERE enterprise_name IS NULL;
SELECT * FROM transactions WHERE amount IS NULL;
SELECT * FROM invoices WHERE invoice_no IS NULL;

-- Find orphaned records
SELECT * FROM products WHERE category_id NOT IN (SELECT info_id FROM product_category);

-- Check for duplicates
SELECT enterprise_name, COUNT(*) FROM enterprise GROUP BY enterprise_name HAVING COUNT(*) > 1;
SELECT invoice_no, COUNT(*) FROM invoices GROUP BY invoice_no HAVING COUNT(*) > 1;

-- Verify constraint integrity
SELECT * FROM invoices WHERE enterprise_name NOT IN (SELECT enterprise_name FROM enterprise);

-- Data consistency checks
SELECT COUNT(*) FROM transactions WHERE amount < 0;
SELECT COUNT(*) FROM invoices WHERE due_date < invoice_date;

-- Storage analysis
SELECT 
  TABLE_NAME,
  ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) as size_mb
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'teleoss'
ORDER BY size_mb DESC;

-- Backup command
mysqldump -u root -p teleoss > teleoss_backup.sql

-- Restore command
mysql -u root -p teleoss < teleoss_backup.sql
```

---

## 📖 Example Usage Patterns

### Pattern 1: Fetch and Display List
```typescript
const result = await enterpriseService.getList(0, 50);
if (result.success) {
  const { content, totalElements, totalPages } = result.data;
  // Display content in table/list
}
```

### Pattern 2: Create with Validation
```typescript
const result = await enterpriseService.create({
  enterprise_name: 'New Corp',
  enterprise_type: 'CUSTOMER',
  status: 'ACTIVE'
});
if (result.success) {
  // Show success message
} else {
  // Show error: result.error
}
```

### Pattern 3: Update Record
```typescript
const result = await enterpriseService.update(1, {
  enterprise_name: 'Updated Name',
  status: 'INACTIVE'
});
```

### Pattern 4: Delete Record
```typescript
const result = await enterpriseService.delete(1);
if (result.success) {
  // Record deleted
}
```

### Pattern 5: Search and Filter
```typescript
const results = await enterpriseService.search('ABC');
const byType = await enterpriseService.getByType('CUSTOMER');
```

---

**All configurations, queries, APIs, and services are now documented and ready to use!** 🎉
