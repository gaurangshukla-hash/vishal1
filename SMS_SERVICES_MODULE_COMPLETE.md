# SMS Services Module - Complete Implementation

## 1. MariaDB Schema

```sql
-- Translation Rule Table
CREATE TABLE `translation_rule` (
  `rule_id` INT AUTO_INCREMENT PRIMARY KEY,
  `rule_name` VARCHAR(255) NOT NULL UNIQUE,
  `rule_type` ENUM('Sender ID', 'Message Content', 'DNID Routing', 'Number Rewrite') DEFAULT 'Message Content',
  `action_type` ENUM('Allow', 'Block', 'Modify', 'Route', 'Log') DEFAULT 'Allow',
  `priority` INT DEFAULT 0,
  `sender_id_pattern` VARCHAR(255),
  `dnid_pattern` VARCHAR(255),
  `mccmnc_code` VARCHAR(10),
  `message_pattern` VARCHAR(500),
  `message_replacement` TEXT,
  `condition_logic` JSON,
  `applies_continue` BOOLEAN DEFAULT FALSE,
  `status` ENUM('Active', 'Inactive', 'Testing') DEFAULT 'Testing',
  `description` TEXT,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rule_name (rule_name),
  INDEX idx_priority (priority),
  INDEX idx_status (status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Translation Rule Group Table
CREATE TABLE `translation_rule_group` (
  `group_id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_name` VARCHAR(255) NOT NULL UNIQUE,
  `group_type` ENUM('Sender ID Rules', 'Message Content', 'Routing', 'Security') DEFAULT 'Message Content',
  `description` TEXT,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `rule_order` JSON,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_group_name (group_name),
  INDEX idx_status (status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Translation Rule Group Mapping
CREATE TABLE `translation_rule_group_mapping` (
  `mapping_id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `rule_id` INT NOT NULL,
  `rule_order` INT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES translation_rule_group(group_id) ON DELETE CASCADE,
  FOREIGN KEY (rule_id) REFERENCES translation_rule(rule_id) ON DELETE CASCADE,
  UNIQUE KEY unique_group_rule (group_id, rule_id),
  INDEX idx_group_id (group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- HLR Provider Table
CREATE TABLE `hlr_provider` (
  `provider_id` INT AUTO_INCREMENT PRIMARY KEY,
  `provider_name` VARCHAR(255) NOT NULL UNIQUE,
  `provider_url` VARCHAR(500) NOT NULL,
  `api_endpoint` VARCHAR(500),
  `authentication_type` ENUM('Basic Auth', 'API Key', 'OAuth2', 'Custom') DEFAULT 'API Key',
  `api_key` VARCHAR(500),
  `username` VARCHAR(255),
  `password` VARCHAR(500),
  `timeout_seconds` INT DEFAULT 30,
  `max_concurrent_requests` INT DEFAULT 100,
  `priority` INT DEFAULT 0,
  `supports_batch` BOOLEAN DEFAULT FALSE,
  `batch_size` INT DEFAULT 1,
  `response_format` ENUM('JSON', 'XML', 'CSV') DEFAULT 'JSON',
  `status` ENUM('Active', 'Inactive', 'Testing', 'Error') DEFAULT 'Testing',
  `last_health_check` TIMESTAMP NULL,
  `last_health_status` ENUM('Success', 'Failed', 'Timeout') NULL,
  `notes` TEXT,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_provider_name (provider_name),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- HLR Rule Table
CREATE TABLE `hlr_rule` (
  `rule_id` INT AUTO_INCREMENT PRIMARY KEY,
  `rule_name` VARCHAR(255) NOT NULL UNIQUE,
  `rule_type` ENUM('Pre-routing HLR', 'Post-routing HLR', 'Validity Check') DEFAULT 'Pre-routing HLR',
  `hlr_provider_id` INT NOT NULL,
  `destination_code` VARCHAR(50),
  `operator_filter` VARCHAR(100),
  `subscriber_status_check` VARCHAR(255),
  `roaming_check` BOOLEAN DEFAULT FALSE,
  `mnp_check` BOOLEAN DEFAULT FALSE,
  `check_timeout_seconds` INT DEFAULT 10,
  `cache_result_hours` INT DEFAULT 24,
  `on_hlr_failure_action` ENUM('Allow', 'Block', 'Route to Fallback') DEFAULT 'Allow',
  `fallback_provider_id` INT,
  `apply_to_all_destinations` BOOLEAN DEFAULT FALSE,
  `priority` INT DEFAULT 0,
  `status` ENUM('Active', 'Inactive', 'Testing') DEFAULT 'Testing',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hlr_provider_id) REFERENCES hlr_provider(provider_id),
  FOREIGN KEY (fallback_provider_id) REFERENCES hlr_provider(provider_id),
  INDEX idx_rule_name (rule_name),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- HLR Rule Group Table
CREATE TABLE `hlr_rule_group` (
  `group_id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `apply_order` JSON,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_group_name (group_name),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recipient Groups Table
CREATE TABLE `recipient_group` (
  `group_id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_name` VARCHAR(255) NOT NULL UNIQUE,
  `group_type` ENUM('Distribution List', 'WhiteList', 'BlackList', 'DND List', 'Custom') DEFAULT 'Distribution List',
  `description` TEXT,
  `total_recipients` INT DEFAULT 0,
  `status` ENUM('Active', 'Inactive', 'Archived') DEFAULT 'Active',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_group_name (group_name),
  INDEX idx_group_type (group_type),
  INDEX idx_status (status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recipient Group Members
CREATE TABLE `recipient_group_member` (
  `member_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `phone_number` VARCHAR(20) NOT NULL,
  `country_code` VARCHAR(5),
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `email` VARCHAR(255),
  `status` ENUM('Active', 'Inactive', 'Bounced', 'DND') DEFAULT 'Active',
  `added_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES recipient_group(group_id) ON DELETE CASCADE,
  INDEX idx_group_id (group_id),
  INDEX idx_phone_number (phone_number),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification Template Table
CREATE TABLE `notification_template` (
  `template_id` INT AUTO_INCREMENT PRIMARY KEY,
  `template_name` VARCHAR(255) NOT NULL UNIQUE,
  `notification_type` ENUM('SMS', 'Email', 'Push', 'Webhook') DEFAULT 'SMS',
  `enterprise_id` INT,
  `customer_trunk_id` INT,
  `template_category` ENUM('Transactional', 'Marketing', 'Alert', 'Reminder', 'OTP') DEFAULT 'Transactional',
  `template_content` TEXT NOT NULL,
  `variable_placeholders` JSON,
  `protocol` ENUM('HTTP', 'HTTPS', 'SMTP', 'API') DEFAULT 'HTTP',
  `endpoint_url` VARCHAR(500),
  `webhook_retry_count` INT DEFAULT 3,
  `webhook_timeout_seconds` INT DEFAULT 30,
  `status` ENUM('Active', 'Inactive', 'Draft', 'Archived') DEFAULT 'Draft',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_template_name (template_name),
  INDEX idx_status (status),
  INDEX idx_notification_type (notification_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email Logs Table
CREATE TABLE `email_log` (
  `log_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `email_type` ENUM('Invoice', 'Report', 'Notification', 'Alert', 'Statement') DEFAULT 'Invoice',
  `enterprise_id` INT,
  `customer_trunk_id` INT,
  `vendor_trunk_id` INT,
  `recipient_email` VARCHAR(255),
  `cc_email` VARCHAR(500),
  `bcc_email` VARCHAR(500),
  `subject` VARCHAR(500),
  `email_body` LONGTEXT,
  `attachment_names` JSON,
  `email_status` ENUM('Pending', 'Sent', 'Failed', 'Bounced', 'Read', 'Unread') DEFAULT 'Pending',
  `sent_time` TIMESTAMP NULL,
  `read_time` TIMESTAMP NULL,
  `bounce_time` TIMESTAMP NULL,
  `bounce_reason` TEXT,
  `error_message` TEXT,
  `retry_count` INT DEFAULT 0,
  `file_reference` VARCHAR(255),
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_enterprise_id (enterprise_id),
  INDEX idx_recipient_email (recipient_email),
  INDEX idx_email_status (email_status),
  INDEX idx_created_time (created_time),
  INDEX idx_sent_time (sent_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Firewall Rules Table
CREATE TABLE `firewall_rule` (
  `rule_id` INT AUTO_INCREMENT PRIMARY KEY,
  `rule_name` VARCHAR(255) NOT NULL,
  `rule_type` ENUM('IP Whitelist', 'IP Blacklist', 'Country Block', 'Rate Limit', 'Content Filter') DEFAULT 'IP Whitelist',
  `ip_address` VARCHAR(45),
  `ip_range_start` VARCHAR(45),
  `ip_range_end` VARCHAR(45),
  `cidr_notation` VARCHAR(50),
  `country_code` VARCHAR(2),
  `filter_value` VARCHAR(255),
  `action` ENUM('Allow', 'Block', 'Challenge', 'Rate Limit') DEFAULT 'Block',
  `reason` TEXT,
  `priority` INT DEFAULT 0,
  `status` ENUM('Active', 'Inactive', 'Expired') DEFAULT 'Active',
  `effective_from` TIMESTAMP NULL,
  `effective_to` TIMESTAMP NULL,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rule_type (rule_type),
  INDEX idx_ip_address (ip_address),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- MCCMNC Unique Codes Table
CREATE TABLE `mccmnc_code` (
  `code_id` INT AUTO_INCREMENT PRIMARY KEY,
  `mcc` VARCHAR(3) NOT NULL,
  `mnc` VARCHAR(3) NOT NULL,
  `original_mnc` VARCHAR(3),
  `country_code` VARCHAR(5) NOT NULL,
  `country_name` VARCHAR(100) NOT NULL,
  `iso_code` VARCHAR(2) NOT NULL,
  `network_name` VARCHAR(255) NOT NULL,
  `brand_name` VARCHAR(255),
  `operator_type` ENUM('Mobile', 'Fixed', 'MVNO', 'Virtual') DEFAULT 'Mobile',
  `nri_prefix` VARCHAR(10),
  `country_calling_code` VARCHAR(5),
  `network_code` VARCHAR(50),
  `status` ENUM('Active', 'Inactive', 'Retired') DEFAULT 'Active',
  `notes` TEXT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_mcc_mnc (mcc, mnc),
  INDEX idx_country_code (country_code),
  INDEX idx_iso_code (iso_code),
  INDEX idx_network_name (network_name),
  INDEX idx_mcc (mcc),
  INDEX idx_mnc (mnc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 2. Fast & Effective Queries

```sql
-- Translation Rules
SELECT * FROM translation_rule
WHERE status = 'Active'
ORDER BY priority ASC
LIMIT ? OFFSET ?;

SELECT tr.*, trgm.group_id
FROM translation_rule tr
LEFT JOIN translation_rule_group_mapping trgm ON tr.rule_id = trgm.rule_id
WHERE trgm.group_id = ?
ORDER BY trgm.rule_order;

-- HLR Provider with health status
SELECT hp.*, 
  CASE WHEN hp.last_health_status = 'Success' THEN 'Healthy' 
       WHEN hp.last_health_status IS NULL THEN 'Never Checked' 
       ELSE 'Error' END as health_status
FROM hlr_provider
WHERE status = 'Active'
ORDER BY priority DESC
LIMIT ? OFFSET ?;

-- HLR Rules with provider details
SELECT hr.*, hp.provider_name, hp.provider_url
FROM hlr_rule hr
LEFT JOIN hlr_provider hp ON hr.hlr_provider_id = hp.provider_id
WHERE hr.status = 'Active'
ORDER BY hr.priority ASC;

-- Recipient Group Members
SELECT * FROM recipient_group_member
WHERE group_id = ?
  AND status = 'Active'
ORDER BY added_date DESC
LIMIT ? OFFSET ?;

-- Search recipient groups
SELECT group_id, group_name, group_type, total_recipients, status
FROM recipient_group
WHERE group_name LIKE CONCAT('%', ?, '%')
  AND status != 'Archived'
ORDER BY updated_time DESC;

-- Email logs for enterprise
SELECT log_id, email_type, recipient_email, email_status, sent_time
FROM email_log
WHERE enterprise_id = ?
  AND created_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY created_time DESC
LIMIT ? OFFSET ?;

-- Email status summary
SELECT email_status, COUNT(*) as count
FROM email_log
WHERE enterprise_id = ?
  AND created_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY email_status
ORDER BY count DESC;

-- Active firewall rules
SELECT rule_id, rule_name, rule_type, action, priority, status
FROM firewall_rule
WHERE status = 'Active'
  AND (effective_to IS NULL OR effective_to > NOW())
ORDER BY priority DESC
LIMIT ? OFFSET ?;

-- MCCMNC Lookup by country
SELECT mcc, mnc, country_name, network_name, brand_name, operator_type
FROM mccmnc_code
WHERE country_code = ? OR iso_code = ?
  AND status = 'Active'
ORDER BY network_name;

-- MCCMNC Lookup by MCC/MNC
SELECT * FROM mccmnc_code
WHERE (mcc = ? AND mnc = ?)
  OR (mcc = ? AND original_mnc = ?)
LIMIT 1;

-- Search MCCMNC codes
SELECT * FROM mccmnc_code
WHERE network_name LIKE CONCAT('%', ?, '%')
  OR country_name LIKE CONCAT('%', ?, '%')
  OR iso_code = ?
ORDER BY country_name, network_name
LIMIT ? OFFSET ?;
```

## 3. Spring Boot Controllers & Services

### TranslationRuleController
```java
@RestController
@RequestMapping("/api/sms/translation-rule")
@CrossOrigin(origins = "*")
public class TranslationRuleController {

  @Autowired
  private TranslationRuleService ruleService;

  @GetMapping
  public ResponseEntity<PagedResponse<TranslationRuleDTO>> getAllRules(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int pageSize,
    @RequestParam(required = false) String search) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("priority").ascending());
    Page<TranslationRuleDTO> rules = ruleService.getAllRules(search, pageable);
    return ResponseEntity.ok(new PagedResponse<>(rules));
  }

  @PostMapping
  public ResponseEntity<TranslationRuleDTO> createRule(@RequestBody CreateRuleRequest request) {
    TranslationRuleDTO rule = ruleService.createRule(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(rule);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TranslationRuleDTO> getRule(@PathVariable Integer id) {
    TranslationRuleDTO rule = ruleService.getRule(id);
    return ResponseEntity.ok(rule);
  }

  @PutMapping("/{id}")
  public ResponseEntity<TranslationRuleDTO> updateRule(
    @PathVariable Integer id,
    @RequestBody UpdateRuleRequest request) {
    TranslationRuleDTO rule = ruleService.updateRule(id, request);
    return ResponseEntity.ok(rule);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteRule(@PathVariable Integer id) {
    ruleService.deleteRule(id);
    return ResponseEntity.noContent().build();
  }
}
```

### HLRProviderController
```java
@RestController
@RequestMapping("/api/sms/hlr-provider")
@CrossOrigin(origins = "*")
public class HLRProviderController {

  @Autowired
  private HLRProviderService providerService;

  @GetMapping
  public ResponseEntity<PagedResponse<HLRProviderDTO>> getAllProviders(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<HLRProviderDTO> providers = providerService.getAllProviders(pageable);
    return ResponseEntity.ok(new PagedResponse<>(providers));
  }

  @PostMapping
  public ResponseEntity<HLRProviderDTO> createProvider(@RequestBody CreateProviderRequest request) {
    HLRProviderDTO provider = providerService.createProvider(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(provider);
  }

  @PostMapping("/{id}/health-check")
  public ResponseEntity<HealthCheckDTO> checkHealth(@PathVariable Integer id) {
    HealthCheckDTO health = providerService.checkHealth(id);
    return ResponseEntity.ok(health);
  }
}
```

### RecipientGroupController
```java
@RestController
@RequestMapping("/api/sms/recipient-group")
@CrossOrigin(origins = "*")
public class RecipientGroupController {

  @Autowired
  private RecipientGroupService groupService;

  @GetMapping
  public ResponseEntity<PagedResponse<RecipientGroupDTO>> getAllGroups(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int pageSize,
    @RequestParam(required = false) String search) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<RecipientGroupDTO> groups = groupService.getAllGroups(search, pageable);
    return ResponseEntity.ok(new PagedResponse<>(groups));
  }

  @PostMapping
  public ResponseEntity<RecipientGroupDTO> createGroup(@RequestBody CreateGroupRequest request) {
    RecipientGroupDTO group = groupService.createGroup(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(group);
  }

  @GetMapping("/{id}/members")
  public ResponseEntity<PagedResponse<RecipientMemberDTO>> getMembers(
    @PathVariable Integer id,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "50") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<RecipientMemberDTO> members = groupService.getMembers(id, pageable);
    return ResponseEntity.ok(new PagedResponse<>(members));
  }

  @PostMapping("/{id}/members/bulk-upload")
  public ResponseEntity<BulkUploadResultDTO> bulkUploadMembers(
    @PathVariable Integer id,
    @RequestParam("file") MultipartFile file) {
    
    BulkUploadResultDTO result = groupService.bulkUploadMembers(id, file);
    return ResponseEntity.ok(result);
  }
}
```

### EmailLogController
```java
@RestController
@RequestMapping("/api/sms/email-log")
@CrossOrigin(origins = "*")
public class EmailLogController {

  @Autowired
  private EmailLogService logService;

  @GetMapping
  public ResponseEntity<PagedResponse<EmailLogDTO>> getEmailLogs(
    @RequestParam(required = false) Integer enterpriseId,
    @RequestParam(required = false) String status,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("createdTime").descending());
    Page<EmailLogDTO> logs = logService.getEmailLogs(enterpriseId, status, pageable);
    return ResponseEntity.ok(new PagedResponse<>(logs));
  }

  @GetMapping("/summary")
  public ResponseEntity<EmailLogSummaryDTO> getEmailSummary(@RequestParam Integer enterpriseId) {
    EmailLogSummaryDTO summary = logService.getEmailSummary(enterpriseId);
    return ResponseEntity.ok(summary);
  }

  @PostMapping("/{id}/resend")
  public ResponseEntity<Void> resendEmail(@PathVariable Long id) {
    logService.resendEmail(id);
    return ResponseEntity.ok().build();
  }
}
```

### FirewallRuleController
```java
@RestController
@RequestMapping("/api/sms/firewall")
@CrossOrigin(origins = "*")
public class FirewallRuleController {

  @Autowired
  private FirewallRuleService ruleService;

  @GetMapping
  public ResponseEntity<PagedResponse<FirewallRuleDTO>> getFirewallRules(
    @RequestParam(required = false) String ruleType,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("priority").descending());
    Page<FirewallRuleDTO> rules = ruleService.getFirewallRules(ruleType, pageable);
    return ResponseEntity.ok(new PagedResponse<>(rules));
  }

  @PostMapping
  public ResponseEntity<FirewallRuleDTO> createRule(@RequestBody CreateFirewallRuleRequest request) {
    FirewallRuleDTO rule = ruleService.createRule(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(rule);
  }

  @PostMapping("/ip-check")
  public ResponseEntity<FirewallCheckResultDTO> checkIP(@RequestBody FirewallCheckRequest request) {
    FirewallCheckResultDTO result = ruleService.checkIP(request.getIpAddress());
    return ResponseEntity.ok(result);
  }
}
```

### MCCMNCController
```java
@RestController
@RequestMapping("/api/sms/mccmnc")
@CrossOrigin(origins = "*")
public class MCCMNCController {

  @Autowired
  private MCCMNCService mccmncService;

  @GetMapping
  public ResponseEntity<PagedResponse<MCCMNCDto>> searchMCCMNC(
    @RequestParam(required = false) String search,
    @RequestParam(required = false) String countryCode,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<MCCMNCDto> codes = mccmncService.searchMCCMNC(search, countryCode, pageable);
    return ResponseEntity.ok(new PagedResponse<>(codes));
  }

  @GetMapping("/lookup")
  public ResponseEntity<MCCMNCDto> lookupMCCMNC(
    @RequestParam String mcc,
    @RequestParam String mnc) {
    
    MCCMNCDto code = mccmncService.lookupMCCMNC(mcc, mnc);
    return ResponseEntity.ok(code);
  }

  @GetMapping("/by-country/{countryCode}")
  public ResponseEntity<List<MCCMNCDto>> getByCountry(@PathVariable String countryCode) {
    List<MCCMNCDto> codes = mccmncService.getByCountry(countryCode);
    return ResponseEntity.ok(codes);
  }
}
```

## 4. Frontend Integration Points

Tables align with SectionView.tsx:
- `'Translation Rule'`: Display rules with priority, type, status, action buttons
- `'Translation Rule Group'`: Group management with member rules
- `'HLR Provider'`: Provider list with health status
- `'HLR Rule'`: HLR rules with provider mapping
- `'HLR Rule Group'`: Group management
- `'Recipient Groups'`: Distribution lists with member counts, bulk upload
- `'Notification'`: Notification templates with preview
- `'Email Logs'`: Email delivery status, resend functionality
- `'Firewall'`: IP rules with priority, effective dates
- `'MCCMNC Unique Codes'`: Network code lookup, search by country/operator

