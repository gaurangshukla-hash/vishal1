# Admin Module - Complete Implementation

## 1. MariaDB Schema

```sql
-- Business Company Table
CREATE TABLE `business_company` (
  `company_id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL UNIQUE,
  `company_type` ENUM('Telecom', 'MVNO', 'Reseller', 'Enterprise', 'Service Provider') DEFAULT 'Telecom',
  `registration_number` VARCHAR(100) UNIQUE,
  `tax_id` VARCHAR(100) UNIQUE,
  `country` VARCHAR(100),
  `state_province` VARCHAR(100),
  `city` VARCHAR(100),
  `postal_code` VARCHAR(20),
  `street_address` VARCHAR(255),
  `phone_number` VARCHAR(20),
  `email_address` VARCHAR(255),
  `website_url` VARCHAR(500),
  `primary_contact_name` VARCHAR(255),
  `primary_contact_email` VARCHAR(255),
  `primary_contact_phone` VARCHAR(20),
  `billing_contact_name` VARCHAR(255),
  `billing_contact_email` VARCHAR(255),
  `technical_contact_name` VARCHAR(255),
  `technical_contact_phone` VARCHAR(20),
  `company_logo_url` VARCHAR(500),
  `bank_account_holder_name` VARCHAR(255),
  `bank_name` VARCHAR(255),
  `bank_account_number` VARCHAR(100),
  `bank_routing_number` VARCHAR(50),
  `swift_code` VARCHAR(20),
  `iban` VARCHAR(100),
  `credit_limit` DECIMAL(15, 2),
  `payment_terms_days` INT DEFAULT 30,
  `contract_start_date` DATE,
  `contract_end_date` DATE,
  `status` ENUM('Active', 'Inactive', 'Suspended', 'Terminated', 'Prospective') DEFAULT 'Prospective',
  `account_manager_id` INT,
  `notes` TEXT,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_company_name (company_name),
  INDEX idx_status (status),
  INDEX idx_country (country),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email Template Table
CREATE TABLE `email_template` (
  `template_id` INT AUTO_INCREMENT PRIMARY KEY,
  `template_name` VARCHAR(255) NOT NULL UNIQUE,
  `template_category` ENUM('Invoice', 'Payment Receipt', 'Notification', 'Report', 'Alert', 'Welcome', 'Support') DEFAULT 'Notification',
  `template_subject` VARCHAR(500) NOT NULL,
  `template_body` LONGTEXT NOT NULL,
  `template_footer` TEXT,
  `variable_placeholders` JSON,
  `html_template` BOOLEAN DEFAULT TRUE,
  `company_id` INT,
  `available_for_all_companies` BOOLEAN DEFAULT FALSE,
  `uses_company_logo` BOOLEAN DEFAULT TRUE,
  `uses_company_branding` BOOLEAN DEFAULT TRUE,
  `status` ENUM('Active', 'Inactive', 'Draft', 'Archived') DEFAULT 'Draft',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES business_company(company_id) ON DELETE SET NULL,
  INDEX idx_template_name (template_name),
  INDEX idx_category (template_category),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Portal Configuration
CREATE TABLE `customer_portal_config` (
  `portal_id` INT AUTO_INCREMENT PRIMARY KEY,
  `portal_name` VARCHAR(255) NOT NULL UNIQUE,
  `company_id` INT NOT NULL,
  `portal_url` VARCHAR(500),
  `portal_version` VARCHAR(20) DEFAULT '1.0.0',
  `theme_color_primary` VARCHAR(7),
  `theme_color_secondary` VARCHAR(7),
  `logo_url` VARCHAR(500),
  `favicon_url` VARCHAR(500),
  `allow_customer_registration` BOOLEAN DEFAULT TRUE,
  `allow_self_service_reset_password` BOOLEAN DEFAULT TRUE,
  `allow_api_access` BOOLEAN DEFAULT TRUE,
  `allow_bulk_operations` BOOLEAN DEFAULT FALSE,
  `default_language` VARCHAR(10) DEFAULT 'en',
  `supported_languages` JSON,
  `max_inactivity_timeout_minutes` INT DEFAULT 30,
  `two_factor_authentication_enabled` BOOLEAN DEFAULT FALSE,
  `sso_enabled` BOOLEAN DEFAULT FALSE,
  `sso_provider_type` ENUM('LDAP', 'OAuth2', 'SAML', 'Custom') DEFAULT 'LDAP',
  `sso_provider_url` VARCHAR(500),
  `features_enabled` JSON,
  `custom_css_url` VARCHAR(500),
  `status` ENUM('Active', 'Maintenance', 'Disabled') DEFAULT 'Active',
  `notes` TEXT,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES business_company(company_id),
  INDEX idx_company_id (company_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Report Template Table
CREATE TABLE `report_template` (
  `template_id` INT AUTO_INCREMENT PRIMARY KEY,
  `template_name` VARCHAR(255) NOT NULL UNIQUE,
  `report_type` ENUM('Traffic', 'Financial', 'Performance', 'Diagnostic', 'Custom') DEFAULT 'Custom',
  `company_id` INT,
  `sql_query_template` LONGTEXT,
  `report_columns` JSON,
  `sorting_configuration` JSON,
  `filtering_options` JSON,
  `aggregation_rules` JSON,
  `chart_configuration` JSON,
  `export_formats` JSON,
  `scheduled_delivery` BOOLEAN DEFAULT FALSE,
  `scheduled_frequency` ENUM('Daily', 'Weekly', 'Monthly', 'Quarterly') DEFAULT 'Monthly',
  `scheduled_recipients` JSON,
  `locale_format` VARCHAR(10) DEFAULT 'en_US',
  `timezone` VARCHAR(50),
  `status` ENUM('Active', 'Inactive', 'Draft', 'Archived') DEFAULT 'Draft',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES business_company(company_id) ON DELETE SET NULL,
  INDEX idx_template_name (template_name),
  INDEX idx_report_type (report_type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Manager Table
CREATE TABLE `task` (
  `task_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `task_title` VARCHAR(255) NOT NULL,
  `task_type` ENUM('System Task', 'Manual Task', 'Scheduled Task', 'Alert Task') DEFAULT 'Manual Task',
  `task_category` ENUM('Database Migration', 'Report Generation', 'Data Cleanup', 'Maintenance', 'Security', 'Backup', 'Support Ticket', 'Other') DEFAULT 'Other',
  `description` LONGTEXT,
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
  `assigned_to_user_id` INT,
  `assigned_to_user_name` VARCHAR(255),
  `created_by_user_id` INT,
  `created_by_user_name` VARCHAR(255),
  `start_date` DATE,
  `due_date` DATE NOT NULL,
  `estimated_hours` DECIMAL(10, 2),
  `actual_hours_spent` DECIMAL(10, 2) DEFAULT 0,
  `status` ENUM('Open', 'In Progress', 'On Hold', 'Completed', 'Cancelled', 'Blocked') DEFAULT 'Open',
  `progress_percentage` INT DEFAULT 0,
  `subtasks` JSON,
  `attachments` JSON,
  `comments` JSON,
  `related_enterprise_id` INT,
  `related_report_id` INT,
  `completion_date` TIMESTAMP NULL,
  `completion_notes` TEXT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_assigned_to (assigned_to_user_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_due_date (due_date),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Audit Log Table
CREATE TABLE `activity_audit_log` (
  `log_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `user_name` VARCHAR(255),
  `action_type` ENUM('Create', 'Update', 'Delete', 'Login', 'Logout', 'Export', 'Download', 'Configuration Change') DEFAULT 'Update',
  `module_name` VARCHAR(100),
  `entity_type` VARCHAR(100),
  `entity_id` INT,
  `old_values` JSON,
  `new_values` JSON,
  `ip_address` VARCHAR(45),
  `user_agent` VARCHAR(500),
  `status` ENUM('Success', 'Failed', 'Warning') DEFAULT 'Success',
  `error_message` TEXT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_action_type (action_type),
  INDEX idx_module_name (module_name),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- System Configuration Table
CREATE TABLE `system_config` (
  `config_id` INT AUTO_INCREMENT PRIMARY KEY,
  `config_key` VARCHAR(255) NOT NULL UNIQUE,
  `config_value` TEXT NOT NULL,
  `config_type` ENUM('String', 'Number', 'Boolean', 'JSON', 'List') DEFAULT 'String',
  `description` TEXT,
  `is_system_critical` BOOLEAN DEFAULT FALSE,
  `can_user_modify` BOOLEAN DEFAULT FALSE,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 2. Fast & Effective Queries

```sql
-- Get all business companies
SELECT company_id, company_name, company_type, status, contract_start_date, 
  contract_end_date, credit_limit, created_time
FROM business_company
WHERE status != 'Terminated'
ORDER BY company_name
LIMIT ? OFFSET ?;

-- Get company with contacts
SELECT bc.*, 
  COUNT(DISTINCT ct.customer_trunk_id) as customer_trunk_count,
  COUNT(DISTINCT vt.vendor_trunk_id) as vendor_trunk_count
FROM business_company bc
LEFT JOIN customer_trunk ct ON bc.company_id = ct.enterprise_id
LEFT JOIN vendor_trunk vt ON bc.company_id = vt.vendor_id
WHERE bc.company_id = ?
GROUP BY bc.company_id;

-- Search companies
SELECT company_id, company_name, company_type, status
FROM business_company
WHERE company_name LIKE CONCAT('%', ?, '%')
  OR email_address LIKE CONCAT('%', ?, '%')
ORDER BY company_name;

-- Get email templates
SELECT template_id, template_name, template_category, status
FROM email_template
WHERE status = 'Active'
  AND (company_id = ? OR available_for_all_companies = TRUE)
ORDER BY template_name;

-- Get customer portal config
SELECT * FROM customer_portal_config
WHERE company_id = ?
LIMIT 1;

-- Get report templates by company
SELECT template_id, template_name, report_type, status
FROM report_template
WHERE company_id = ? OR company_id IS NULL
  AND status != 'Archived'
ORDER BY template_name;

-- Get active tasks
SELECT task_id, task_title, status, priority, due_date, assigned_to_user_name
FROM task
WHERE status != 'Completed' AND status != 'Cancelled'
  AND due_date >= CURDATE()
ORDER BY priority DESC, due_date ASC;

-- Get overdue tasks
SELECT task_id, task_title, priority, due_date, assigned_to_user_name
FROM task
WHERE status != 'Completed' AND status != 'Cancelled'
  AND due_date < CURDATE()
ORDER BY due_date ASC;

-- Get task completion statistics
SELECT 
  DATE(created_time) as date,
  COUNT(*) as total_created,
  SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
  SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open
FROM task
WHERE created_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_time)
ORDER BY date DESC;

-- Get activity audit by user
SELECT log_id, user_name, action_type, module_name, entity_type, status, created_time
FROM activity_audit_log
WHERE user_id = ?
  AND created_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY created_time DESC
LIMIT ? OFFSET ?;

-- Get system config
SELECT config_key, config_value, config_type
FROM system_config
WHERE can_user_modify = FALSE OR config_key = ?
ORDER BY config_key;
```

## 3. Spring Boot Controllers & Services

```java
@RestController
@RequestMapping("/api/admin/company")
@CrossOrigin(origins = "*")
public class BusinessCompanyController {

  @Autowired
  private BusinessCompanyService companyService;

  @GetMapping
  public ResponseEntity<PagedResponse<BusinessCompanyDTO>> getAllCompanies(
    @RequestParam(required = false) String search,
    @RequestParam(required = false) String status,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<BusinessCompanyDTO> companies = companyService.getAllCompanies(search, status, pageable);
    return ResponseEntity.ok(new PagedResponse<>(companies));
  }

  @GetMapping("/{id}")
  public ResponseEntity<BusinessCompanyDetailDTO> getCompany(@PathVariable Integer id) {
    BusinessCompanyDetailDTO company = companyService.getCompany(id);
    return ResponseEntity.ok(company);
  }

  @PostMapping
  public ResponseEntity<BusinessCompanyDTO> createCompany(@RequestBody CreateCompanyRequest request) {
    BusinessCompanyDTO company = companyService.createCompany(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(company);
  }

  @PutMapping("/{id}")
  public ResponseEntity<BusinessCompanyDTO> updateCompany(
    @PathVariable Integer id,
    @RequestBody UpdateCompanyRequest request) {
    BusinessCompanyDTO company = companyService.updateCompany(id, request);
    return ResponseEntity.ok(company);
  }
}

@RestController
@RequestMapping("/api/admin/email-template")
@CrossOrigin(origins = "*")
public class EmailTemplateController {

  @Autowired
  private EmailTemplateService templateService;

  @GetMapping
  public ResponseEntity<PagedResponse<EmailTemplateDTO>> getAllTemplates(
    @RequestParam(required = false) String category,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<EmailTemplateDTO> templates = templateService.getAllTemplates(category, pageable);
    return ResponseEntity.ok(new PagedResponse<>(templates));
  }

  @PostMapping
  public ResponseEntity<EmailTemplateDTO> createTemplate(@RequestBody CreateTemplateRequest request) {
    EmailTemplateDTO template = templateService.createTemplate(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(template);
  }

  @PostMapping("/{id}/preview")
  public ResponseEntity<EmailPreviewDTO> previewTemplate(
    @PathVariable Integer id,
    @RequestBody Map<String, String> variables) {
    
    EmailPreviewDTO preview = templateService.previewTemplate(id, variables);
    return ResponseEntity.ok(preview);
  }
}

@RestController
@RequestMapping("/api/admin/customer-portal")
@CrossOrigin(origins = "*")
public class CustomerPortalController {

  @Autowired
  private CustomerPortalService portalService;

  @GetMapping("/{companyId}")
  public ResponseEntity<CustomerPortalConfigDTO> getPortalConfig(@PathVariable Integer companyId) {
    CustomerPortalConfigDTO config = portalService.getPortalConfig(companyId);
    return ResponseEntity.ok(config);
  }

  @PutMapping("/{companyId}")
  public ResponseEntity<CustomerPortalConfigDTO> updatePortalConfig(
    @PathVariable Integer companyId,
    @RequestBody UpdatePortalConfigRequest request) {
    
    CustomerPortalConfigDTO config = portalService.updatePortalConfig(companyId, request);
    return ResponseEntity.ok(config);
  }
}

@RestController
@RequestMapping("/api/admin/task")
@CrossOrigin(origins = "*")
public class TaskController {

  @Autowired
  private TaskService taskService;

  @GetMapping
  public ResponseEntity<PagedResponse<TaskDTO>> getAllTasks(
    @RequestParam(required = false) String status,
    @RequestParam(required = false) String priority,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("dueDate").ascending());
    Page<TaskDTO> tasks = taskService.getAllTasks(status, priority, pageable);
    return ResponseEntity.ok(new PagedResponse<>(tasks));
  }

  @PostMapping
  public ResponseEntity<TaskDTO> createTask(@RequestBody CreateTaskRequest request) {
    TaskDTO task = taskService.createTask(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(task);
  }

  @PutMapping("/{id}")
  public ResponseEntity<TaskDTO> updateTask(
    @PathVariable Long id,
    @RequestBody UpdateTaskRequest request) {
    
    TaskDTO task = taskService.updateTask(id, request);
    return ResponseEntity.ok(task);
  }

  @PutMapping("/{id}/complete")
  public ResponseEntity<TaskDTO> completeTask(
    @PathVariable Long id,
    @RequestBody CompleteTaskRequest request) {
    
    TaskDTO task = taskService.completeTask(id, request);
    return ResponseEntity.ok(task);
  }

  @GetMapping("/dashboard")
  public ResponseEntity<TaskDashboardDTO> getTaskDashboard() {
    TaskDashboardDTO dashboard = taskService.getDashboard();
    return ResponseEntity.ok(dashboard);
  }
}

@RestController
@RequestMapping("/api/admin/audit-log")
@CrossOrigin(origins = "*")
public class AuditLogController {

  @Autowired
  private AuditLogService auditService;

  @GetMapping
  public ResponseEntity<PagedResponse<AuditLogDTO>> getAuditLogs(
    @RequestParam(required = false) String actionType,
    @RequestParam(required = false) String moduleName,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "50") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("createdTime").descending());
    Page<AuditLogDTO> logs = auditService.getAuditLogs(actionType, moduleName, pageable);
    return ResponseEntity.ok(new PagedResponse<>(logs));
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<PagedResponse<AuditLogDTO>> getUserActivityLog(
    @PathVariable Integer userId,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "50") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("createdTime").descending());
    Page<AuditLogDTO> logs = auditService.getUserActivityLog(userId, pageable);
    return ResponseEntity.ok(new PagedResponse<>(logs));
  }
}
```

## 4. Frontend Integration

Tables shown in SectionView.tsx:
- `'Business Company'`: Company list with status, credit limits, contract dates, action buttons
- `'Email Template'`: Email templates with category, preview functionality, test send
- `'Customer Portal'`: Portal config per company with branding, SSO settings
- `'Report Template'`: Custom report templates with query builder
- `'Task Manager'`: Task dashboard with status tracking, assignment, due dates, overdue alerts

