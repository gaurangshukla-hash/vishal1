# Product, Rate & Enterprise Modules - Integration Guide

## Overview

This document provides the integration points, implementation checklist, and deployment guide for the three completed modules:

1. **Product Module**: Category creation, SMS product management
2. **Rate Module**: IMAP mail, file templates, auto-upload rules, rate tables, re-rating, analytics
3. **Enterprise Module**: Customer trunks, vendor trunks, routing, monitoring

## Module-wise Database Tables & API Endpoints

### Product Module
**Tables**: `product_category`, `sms_product`, `product_pricing`, `product_attribute`, `product_audit_log`

**REST Endpoints**:
```
POST   /api/product/category              - Create product category
GET    /api/product/category              - List categories (paginated)
GET    /api/product/category/{id}         - Get category details
PUT    /api/product/category/{id}         - Update category
DELETE /api/product/category/{id}         - Delete category
GET    /api/product/category/{id}/products - Get products in category

POST   /api/product/sms                   - Create SMS product
GET    /api/product/sms                   - List products (paginated, searchable)
GET    /api/product/sms/{id}              - Get product with pricing
PUT    /api/product/sms/{id}              - Update product
DELETE /api/product/sms/{id}              - Delete product
GET    /api/product/sms/{id}/pricing      - Get pricing tiers
POST   /api/product/sms/{id}/pricing      - Add pricing tier
```

### Rate Module
**Tables**: `imap_mail_account`, `file_template`, `auto_upload_rules`, `auto_upload_execution`, `auto_upload_failed_record`, `customer_rate_table`, `customer_rate_detail`, `vendor_rate_table`, `vendor_rate_detail`, `re_rating_request`, `rate_analytics_daily`

**REST Endpoints**:
```
POST   /api/rate/imap-account             - Create IMAP account
GET    /api/rate/imap-account             - List accounts
GET    /api/rate/imap-account/{id}        - Get account details
PUT    /api/rate/imap-account/{id}        - Update account
DELETE /api/rate/imap-account/{id}        - Delete account
POST   /api/rate/imap-account/{id}/sync   - Trigger manual sync

POST   /api/rate/file-template            - Create file template
GET    /api/rate/file-template            - List templates
GET    /api/rate/file-template/{id}       - Get template details
PUT    /api/rate/file-template/{id}       - Update template
DELETE /api/rate/file-template/{id}       - Delete template

POST   /api/rate/auto-upload-rule         - Create auto-upload rule
GET    /api/rate/auto-upload-rule         - List rules
GET    /api/rate/auto-upload-rule/{id}    - Get rule details
PUT    /api/rate/auto-upload-rule/{id}    - Update rule
DELETE /api/rate/auto-upload-rule/{id}    - Delete rule
POST   /api/rate/auto-upload-rule/{id}/test - Test rule execution

GET    /api/rate/auto-upload-execution    - Execution history
GET    /api/rate/auto-upload-execution/{ruleId} - History for specific rule
GET    /api/rate/auto-upload-failed       - Failed records
PUT    /api/rate/auto-upload-failed/{id}  - Update failed record status

POST   /api/rate/customer-rate-table      - Create customer rate table
GET    /api/rate/customer-rate-table      - List rate tables
GET    /api/rate/customer-rate-table/{id} - Get rate table with details
PUT    /api/rate/customer-rate-table/{id} - Update rate table
DELETE /api/rate/customer-rate-table/{id} - Delete rate table
POST   /api/rate/customer-rate-table/{id}/details - Add rate detail
PUT    /api/rate/customer-rate-table/{id}/details/{detailId} - Update detail
DELETE /api/rate/customer-rate-table/{id}/details/{detailId} - Delete detail

POST   /api/rate/vendor-rate-table        - Create vendor rate table
GET    /api/rate/vendor-rate-table        - List vendor rate tables
GET    /api/rate/vendor-rate-table/{id}   - Get vendor rate table details
PUT    /api/rate/vendor-rate-table/{id}   - Update vendor rate table
DELETE /api/rate/vendor-rate-table/{id}   - Delete vendor rate table
POST   /api/rate/vendor-rate-table/{id}/details - Add vendor rate detail

POST   /api/rate/re-rating                - Create re-rating request
GET    /api/rate/re-rating                - List re-rating requests
GET    /api/rate/re-rating/{id}           - Get re-rating status
PUT    /api/rate/re-rating/{id}           - Update re-rating status
POST   /api/rate/re-rating/{id}/approve   - Approve re-rating
POST   /api/rate/re-rating/{id}/cancel    - Cancel re-rating

GET    /api/rate/analytics                - Analytics dashboard data
GET    /api/rate/analytics/revenue-trend  - Revenue trend (last 30 days)
GET    /api/rate/analytics/top-destinations - Top destinations by revenue
GET    /api/rate/analytics/by-date        - Analytics for specific date range
```

### Enterprise Module
**Tables**: `trunk_type`, `customer_trunk`, `vendor_trunk`, `customer_trunk_stats`, `vendor_trunk_stats`, `customer_trunk_routing`, `customer_trunk_alert`, `vendor_trunk_connection_log`

**REST Endpoints**:
```
POST   /api/enterprise/customer-trunk     - Create customer trunk
GET    /api/enterprise/customer-trunk     - List customer trunks
GET    /api/enterprise/customer-trunk/{id} - Get customer trunk details
PUT    /api/enterprise/customer-trunk/{id} - Update customer trunk
DELETE /api/enterprise/customer-trunk/{id} - Delete customer trunk
GET    /api/enterprise/customer-trunk/{id}/stats - Get trunk statistics
POST   /api/enterprise/customer-trunk/{id}/stats - Add/update daily stats
GET    /api/enterprise/customer-trunk/{id}/routing - Get routing rules
POST   /api/enterprise/customer-trunk/{id}/routing - Add routing rule
PUT    /api/enterprise/customer-trunk/{id}/routing/{ruleId} - Update routing
DELETE /api/enterprise/customer-trunk/{id}/routing/{ruleId} - Delete routing
GET    /api/enterprise/customer-trunk/{id}/alerts - Get active alerts
POST   /api/enterprise/customer-trunk/{id}/alerts - Create alert

POST   /api/enterprise/vendor-trunk       - Create vendor trunk
GET    /api/enterprise/vendor-trunk       - List vendor trunks
GET    /api/enterprise/vendor-trunk/{id}  - Get vendor trunk details
PUT    /api/enterprise/vendor-trunk/{id}  - Update vendor trunk
DELETE /api/enterprise/vendor-trunk/{id}  - Delete vendor trunk
GET    /api/enterprise/vendor-trunk/{id}/health - Get health status
POST   /api/enterprise/vendor-trunk/{id}/health-check - Trigger health check
GET    /api/enterprise/vendor-trunk/{id}/stats - Get vendor statistics
GET    /api/enterprise/vendor-trunk/{id}/connection-logs - Connection history
```

## Frontend Components Structure

### For SectionView.tsx additions:

```typescript
// Add menu routing
if (menu === 'Product Category') {
  return <ProductCategoryView theme={theme} />;
}
if (menu === 'SMS Product') {
  return <SMSProductView theme={theme} />;
}

if (menu === 'IMAP Mail Account') {
  return <IMAPMailAccountView theme={theme} />;
}
if (menu === 'File Template') {
  return <FileTemplateView theme={theme} />;
}
if (menu === 'Auto Upload Rules') {
  return <AutoUploadRulesView theme={theme} />;
}
if (menu === 'Auto Upload Failed Report') {
  return <AutoUploadFailedView theme={theme} />;
}
if (menu === 'Customer Rate Table') {
  return <CustomerRateTableView theme={theme} />;
}
if (menu === 'Vendor Rate Table') {
  return <VendorRateTableView theme={theme} />;
}
if (menu === 'Re-Rating') {
  return <ReRatingView theme={theme} />;
}
if (menu === 'Rate Analytics') {
  return <RateAnalyticsView theme={theme} />;
}

if (menu === 'Enterprise') {
  return <EnterpriseView theme={theme} />;
}
// For sub-menus under Enterprise
if (menu === 'Customer Trunk' || menu === 'Vendor Trunk') {
  return <TrunkView theme={theme} trunkType={menu} />;
}
```

## Implementation Checklist

### Phase 1: Backend Setup
- [ ] Create MariaDB database and run all three schema SQL files
- [ ] Create Spring Boot project with proper dependencies (JPA, Spring Web, MySQL Driver)
- [ ] Create entity classes for all three modules
- [ ] Create repository interfaces extending JpaRepository with Specification support
- [ ] Create service classes with business logic
- [ ] Create controllers with REST endpoints
- [ ] Create DTOs for request/response
- [ ] Implement pagination, filtering, and search functionality
- [ ] Add error handling and validation
- [ ] Implement JWT authentication & authorization
- [ ] Create database indexes for fast queries

### Phase 2: Frontend Components
- [ ] Create ProductCategoryForm & ProductCategoryView components
- [ ] Create SMSProductForm & SMSProductView components
- [ ] Create IMAP account management components
- [ ] Create file template components
- [ ] Create auto-upload rules components with execution history
- [ ] Create failed records viewer with resolution tracking
- [ ] Create customer rate table management (with detail rows)
- [ ] Create vendor rate table management (with detail rows)
- [ ] Create re-rating request interface
- [ ] Create rate analytics dashboard
- [ ] Create customer trunk management with stats & routing
- [ ] Create vendor trunk management with health check
- [ ] Integrate all components into SectionView.tsx

### Phase 3: Integration Testing
- [ ] Test create, read, update, delete for each module
- [ ] Test search and pagination
- [ ] Test file upload/processing for auto-upload
- [ ] Test rate table detail calculations
- [ ] Test re-rating workflows
- [ ] Test trunk routing
- [ ] Test statistics aggregation
- [ ] Test alerts triggering
- [ ] Load testing with sample data

### Phase 4: Deployment
- [ ] Database backup and migration plan
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Environment configuration (dev, staging, prod)
- [ ] CI/CD pipeline setup
- [ ] Monitoring and logging
- [ ] Health check endpoints
- [ ] Rate limiting and throttling

## Data Flow Examples

### Product to Rate to Enterprise Flow
```
1. Create Product Category (Product Module)
2. Create SMS Product in that category (Product Module)
3. Create Customer Rate Table with SMS Product pricing (Rate Module)
4. Create Customer Trunk and assign rate table (Enterprise Module)
5. Create Vendor Trunk with cost rates (Enterprise Module)
6. Create Routing Rules: Customer Trunk → Vendor Trunk (Enterprise Module)
7. Monitor daily statistics and revenue (Enterprise & Rate Analytics)
```

### Auto-Upload Workflow
```
1. Create IMAP Mail Account (Rate Module)
2. Create File Template with column mapping (Rate Module)
3. Create Auto-Upload Rule linking IMAP + Template + Vendor Trunk (Rate Module)
4. Rule automatically processes incoming emails
5. Failed records go to auto_upload_failed_record table
6. Analytics show upload statistics
```

### Rate Management Workflow
```
1. Create Customer Rate Table with rates per destination (Rate Module)
2. Create Vendor Rate Table with cost per destination (Rate Module)
3. Track usage in customer_trunk_stats and vendor_trunk_stats (Enterprise Module)
4. Re-rate historical transactions if rates change (Rate Module)
5. Generate revenue/cost analytics
```

## Configuration & Secrets

Ensure the following are configured in application.properties or application.yml:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/teleoss_db
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=validate

# API Base URL
app.api.base-url=http://localhost:8080/api

# Security
app.security.jwt.secret=your-jwt-secret
app.security.jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
app.upload.dir=/var/uploads

# IMAP Configuration
app.imap.connection-timeout=30
app.imap.read-timeout=60

# Email Notifications
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=noreply@company.com
spring.mail.password=app-password
```

## Going Live Checklist

- [ ] Database schema validated with real data volumes
- [ ] API load testing (target: 1000 requests/second)
- [ ] Frontend UI/UX testing across browsers
- [ ] Security audit (OWASP top 10)
- [ ] Backup and disaster recovery plan
- [ ] Monitoring dashboards set up
- [ ] On-call support documentation
- [ ] User training and documentation
- [ ] Gradual rollout plan (canary deployment)
- [ ] Rollback plan if issues arise
- [ ] Performance baselines established

## Quick Reference: Key Tables & Relationships

```
Product Module:
  product_category (one) ──→ (many) sms_product
  sms_product (one) ──→ (many) product_pricing
  sms_product (one) ──→ (many) product_attribute

Rate Module:
  imap_mail_account (one) ──→ (many) auto_upload_rules
  file_template (one) ──→ (many) auto_upload_rules
  auto_upload_rules (one) ──→ (many) auto_upload_execution
  auto_upload_execution (one) ──→ (many) auto_upload_failed_record
  customer_rate_table (one) ──→ (many) customer_rate_detail
  vendor_rate_table (one) ──→ (many) vendor_rate_detail
  rate_analytics_daily (aggregated from transaction logs)

Enterprise Module:
  customer_trunk (one) ──→ (many) customer_trunk_stats
  customer_trunk (one) ──→ (many) customer_trunk_routing
  customer_trunk_routing (many) ──→ (one) vendor_trunk
  customer_trunk (one) ──→ (many) customer_trunk_alert
  vendor_trunk (one) ──→ (many) vendor_trunk_stats
  vendor_trunk (one) ──→ (many) vendor_trunk_connection_log
```

