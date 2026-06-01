# AI Error Code Tracking Module - Complete Implementation

## 1. MariaDB Schema

```sql
-- Error Code Master Table (Carrier/Vendor specific)
CREATE TABLE `error_code_master` (
  `error_code_id` INT AUTO_INCREMENT PRIMARY KEY,
  `carrier_code` VARCHAR(50) NOT NULL,
  `error_description` VARCHAR(500),
  `error_type` ENUM('Invalid Number', 'Network Error', 'Message Rejection', 'Delivery Failure', 'Timeout', 'Authentication', 'Rate Limit', 'Content Filter', 'Unknown') DEFAULT 'Unknown',
  `severity_level` ENUM('Info', 'Warning', 'Error', 'Critical') DEFAULT 'Error',
  `typical_cause` TEXT,
  `resolution_steps` TEXT,
  `carrier_name` VARCHAR(100),
  `status` ENUM('Active', 'Obsolete', 'Deprecated') DEFAULT 'Active',
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_carrier_code (carrier_code),
  INDEX idx_error_type (error_type),
  INDEX idx_carrier_name (carrier_name),
  INDEX idx_severity_level (severity_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Error Code Mapping Table
CREATE TABLE `customer_error_code_mapping` (
  `mapping_id` INT AUTO_INCREMENT PRIMARY KEY,
  `enterprise_id` INT,
  `enterprise_name` VARCHAR(255),
  `customer_error_code` VARCHAR(50),
  `customer_error_description` VARCHAR(500),
  `mapped_carrier_error_code_id` INT NOT NULL,
  `mapping_confidence_pct` DECIMAL(5, 2) DEFAULT 100.00,
  `mapping_status` ENUM('Active', 'Inactive', 'Pending Review') DEFAULT 'Pending Review',
  `notes` TEXT,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mapped_carrier_error_code_id) REFERENCES error_code_master(error_code_id),
  UNIQUE KEY unique_customer_mapping (enterprise_id, customer_error_code),
  INDEX idx_enterprise_id (enterprise_id),
  INDEX idx_mapping_status (mapping_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Error Code Translation Rules
CREATE TABLE `error_code_translation_rule` (
  `rule_id` INT AUTO_INCREMENT PRIMARY KEY,
  `rule_name` VARCHAR(255) NOT NULL,
  `source_error_code` VARCHAR(50),
  `target_error_code` VARCHAR(50),
  `translation_type` ENUM('Direct Map', 'Regex Pattern', 'Conditional', 'AI Inference') DEFAULT 'Direct Map',
  `translation_logic` TEXT,
  `regex_pattern` VARCHAR(500),
  `condition_expression` VARCHAR(500),
  `priority` INT DEFAULT 0,
  `success_rate_pct` DECIMAL(5, 2),
  `last_used_time` TIMESTAMP NULL,
  `usage_count` BIGINT DEFAULT 0,
  `status` ENUM('Active', 'Inactive', 'Testing') DEFAULT 'Testing',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rule_name (rule_name),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Error Code Mapping Port Configuration
CREATE TABLE `error_code_mapping_port` (
  `port_id` INT AUTO_INCREMENT PRIMARY KEY,
  `port_name` VARCHAR(255) NOT NULL UNIQUE,
  `port_number` INT UNIQUE,
  `listening_ip` VARCHAR(45),
  `protocol_type` ENUM('TCP', 'UDP', 'HTTP', 'Custom') DEFAULT 'TCP',
  `message_format` ENUM('Raw Text', 'JSON', 'XML', 'Binary') DEFAULT 'Raw Text',
  `accepts_connection_from` JSON,
  `max_connections` INT DEFAULT 100,
  `connection_timeout_seconds` INT DEFAULT 30,
  `retry_mechanism_enabled` BOOLEAN DEFAULT TRUE,
  `retry_count` INT DEFAULT 3,
  `retry_delay_seconds` INT DEFAULT 5,
  `translation_rules_active` INT DEFAULT 0,
  `last_message_received_time` TIMESTAMP NULL,
  `total_messages_processed` BIGINT DEFAULT 0,
  `successful_translations` BIGINT DEFAULT 0,
  `failed_translations` BIGINT DEFAULT 0,
  `status` ENUM('Active', 'Inactive', 'Error', 'Maintenance') DEFAULT 'Inactive',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_port_number (port_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Error Code Mapping Log (Real-time translations)
CREATE TABLE `error_code_translation_log` (
  `log_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `mapping_port_id` INT,
  `source_carrier_error_code` VARCHAR(50),
  `target_customer_error_code` VARCHAR(50),
  `enterprise_id` INT,
  `message_id` VARCHAR(255),
  `transaction_reference` VARCHAR(255),
  `translation_rule_id` INT,
  `translation_method` ENUM('Direct Lookup', 'Rule Based', 'AI Model', 'Manual') DEFAULT 'Direct Lookup',
  `translation_confidence_score` DECIMAL(5, 2),
  `translation_status` ENUM('Success', 'Partial Match', 'No Match', 'Manual Review', 'Failed') DEFAULT 'Success',
  `processing_time_ms` DECIMAL(10, 2),
  `source_system_info` TEXT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_source_error (source_carrier_error_code),
  INDEX idx_enterprise_id (enterprise_id),
  INDEX idx_translation_status (translation_status),
  INDEX idx_created_time (created_time),
  INDEX idx_message_id (message_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI Error Code Learning Model Feedback
CREATE TABLE `error_code_ai_feedback` (
  `feedback_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `translation_log_id` BIGINT,
  `original_ai_suggestion` VARCHAR(50),
  `human_corrected_code` VARCHAR(50),
  `feedback_type` ENUM('Correction', 'Confirmation', 'Rejection', 'Alternative Suggestion') DEFAULT 'Correction',
  `feedback_confidence_score` INT,
  `feedback_notes` TEXT,
  `is_learning_applied` BOOLEAN DEFAULT FALSE,
  `feedback_user_id` INT,
  `feedback_user_name` VARCHAR(255),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (translation_log_id) REFERENCES error_code_translation_log(log_id),
  INDEX idx_translation_log_id (translation_log_id),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Error Code Supplier/Trunk Mapping
CREATE TABLE `error_code_supplier_mapping` (
  `mapping_id` INT AUTO_INCREMENT PRIMARY KEY,
  `supplier_trunk_id` INT,
  `supplier_trunk_name` VARCHAR(255),
  `error_code_master_id` INT NOT NULL,
  `carrier_specific_format` VARCHAR(255),
  `data_encoding` VARCHAR(50),
  `timestamp_format` VARCHAR(50),
  `additional_context_fields` JSON,
  `mapping_priority` INT DEFAULT 0,
  `is_primary_source` BOOLEAN DEFAULT FALSE,
  `confidence_threshold_pct` DECIMAL(5, 2) DEFAULT 90.00,
  `status` ENUM('Active', 'Inactive', 'Testing') DEFAULT 'Testing',
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (error_code_master_id) REFERENCES error_code_master(error_code_id),
  INDEX idx_supplier_trunk_id (supplier_trunk_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Error Code Statistics & Analytics
CREATE TABLE `error_code_analytics` (
  `analytics_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `analytics_date` DATE NOT NULL,
  `error_code` VARCHAR(50),
  `error_type` ENUM('Invalid Number', 'Network Error', 'Message Rejection', 'Delivery Failure', 'Timeout', 'Authentication', 'Rate Limit', 'Content Filter', 'Unknown'),
  `enterprise_id` INT,
  `supplier_trunk_id` INT,
  `total_occurrences` BIGINT DEFAULT 0,
  `percentage_of_total_errors` DECIMAL(5, 2),
  `trend_direction` ENUM('Increasing', 'Decreasing', 'Stable') DEFAULT 'Stable',
  `affected_message_count` BIGINT DEFAULT 0,
  `affected_revenue_loss` DECIMAL(15, 2),
  `primary_cause_identified` VARCHAR(255),
  `resolution_recommended` TEXT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_daily_analytics (analytics_date, error_code, enterprise_id),
  INDEX idx_analytics_date (analytics_date),
  INDEX idx_error_code (error_code),
  INDEX idx_enterprise_id (enterprise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 2. Fast & Effective Queries

```sql
-- Get error code master with stats
SELECT 
  ecm.error_code_id,
  ecm.carrier_code,
  ecm.error_description,
  ecm.error_type,
  ecm.severity_level,
  COUNT(DISTINCT ectl.log_id) as total_occurrences_30days,
  SUM(CASE WHEN ectl.created_time >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 ELSE 0 END) as today_occurrences
FROM error_code_master ecm
LEFT JOIN error_code_translation_log ectl ON ecm.error_code_id = (
  SELECT error_code_master_id FROM customer_error_code_mapping 
  WHERE customer_error_code = ectl.source_carrier_error_code LIMIT 1
)
WHERE ecm.status = 'Active'
GROUP BY ecm.error_code_id
ORDER BY total_occurrences_30days DESC
LIMIT ? OFFSET ?;

-- Get customer error code mappings
SELECT cemc.*, ecm.carrier_code, ecm.error_description
FROM customer_error_code_mapping cemc
LEFT JOIN error_code_master ecm ON cemc.mapped_carrier_error_code_id = ecm.error_code_id
WHERE cemc.enterprise_id = ?
  AND cemc.mapping_status = 'Active'
ORDER BY cemc.customer_error_code;

-- Get active translation rules
SELECT rule_id, rule_name, source_error_code, target_error_code, 
  translation_type, priority, success_rate_pct, usage_count
FROM error_code_translation_rule
WHERE status = 'Active'
ORDER BY priority DESC, success_rate_pct DESC;

-- Get mapping port status
SELECT port_id, port_name, port_number, status, total_messages_processed,
  successful_translations, failed_translations, last_message_received_time
FROM error_code_mapping_port
WHERE status != 'Inactive'
ORDER BY port_number;

-- Get translation log with details
SELECT 
  ectl.log_id,
  ectl.source_carrier_error_code,
  ectl.target_customer_error_code,
  ectl.translation_method,
  ectl.translation_confidence_score,
  ectl.translation_status,
  ectl.processing_time_ms,
  ectl.created_time
FROM error_code_translation_log ectl
WHERE ectl.created_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
ORDER BY ectl.created_time DESC
LIMIT ? OFFSET ?;

-- Get error code analytics
SELECT 
  eca.analytics_date,
  eca.error_code,
  eca.error_type,
  eca.total_occurrences,
  eca.percentage_of_total_errors,
  eca.trend_direction,
  eca.affected_message_count,
  eca.affected_revenue_loss,
  eca.primary_cause_identified
FROM error_code_analytics eca
WHERE eca.analytics_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND eca.enterprise_id = ?
ORDER BY eca.analytics_date DESC, eca.total_occurrences DESC;

-- Get mapping failures needing review
SELECT 
  ectl.log_id,
  ectl.source_carrier_error_code,
  ectl.target_customer_error_code,
  ectl.translation_status,
  COUNT(*) as failure_count
FROM error_code_translation_log ectl
WHERE ectl.translation_status IN ('No Match', 'Partial Match', 'Failed')
  AND ectl.created_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY ectl.source_carrier_error_code
ORDER BY failure_count DESC;

-- Get AI feedback for learning
SELECT 
  ecaf.feedback_id,
  ecaf.original_ai_suggestion,
  ecaf.human_corrected_code,
  ecaf.feedback_type,
  COUNT(*) as feedback_count
FROM error_code_ai_feedback ecaf
WHERE ecaf.is_learning_applied = FALSE
  AND ecaf.created_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY ecaf.original_ai_suggestion, ecaf.human_corrected_code
ORDER BY feedback_count DESC;

-- Get supplier trunk error code mapping
SELECT 
  ecsm.*,
  ecm.carrier_code,
  ecm.error_description,
  ecm.error_type
FROM error_code_supplier_mapping ecsm
LEFT JOIN error_code_master ecm ON ecsm.error_code_master_id = ecm.error_code_id
WHERE ecsm.supplier_trunk_id = ?
  AND ecsm.status = 'Active'
ORDER BY ecsm.mapping_priority DESC;
```

## 3. Spring Boot Controllers & Services

```java
@RestController
@RequestMapping("/api/ai-error-tracking")
@CrossOrigin(origins = "*")
public class AIErrorTrackingController {

  @Autowired
  private AIErrorTrackingService errorService;

  @GetMapping("/error-codes")
  public ResponseEntity<PagedResponse<ErrorCodeMasterDTO>> getErrorCodes(
    @RequestParam(required = false) String errorType,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<ErrorCodeMasterDTO> codes = errorService.getErrorCodes(errorType, pageable);
    return ResponseEntity.ok(new PagedResponse<>(codes));
  }

  @GetMapping("/mappings/{enterpriseId}")
  public ResponseEntity<List<ErrorCodeMappingDTO>> getEnterpriseMappings(
    @PathVariable Integer enterpriseId) {
    
    List<ErrorCodeMappingDTO> mappings = errorService.getEnterpriseMappings(enterpriseId);
    return ResponseEntity.ok(mappings);
  }

  @PostMapping("/map-error")
  public ResponseEntity<MappingResultDTO> mapErrorCode(
    @RequestBody ErrorCodeMappingRequest request) {
    
    MappingResultDTO result = errorService.mapErrorCode(request);
    return ResponseEntity.ok(result);
  }

  @GetMapping("/translation-rules")
  public ResponseEntity<PagedResponse<TranslationRuleDTO>> getTranslationRules(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<TranslationRuleDTO> rules = errorService.getTranslationRules(pageable);
    return ResponseEntity.ok(new PagedResponse<>(rules));
  }

  @PostMapping("/translation-rules")
  public ResponseEntity<TranslationRuleDTO> createTranslationRule(
    @RequestBody CreateTranslationRuleRequest request) {
    
    TranslationRuleDTO rule = errorService.createTranslationRule(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(rule);
  }

  @GetMapping("/mapping-ports")
  public ResponseEntity<List<MappingPortDTO>> getMappingPorts() {
    List<MappingPortDTO> ports = errorService.getMappingPorts();
    return ResponseEntity.ok(ports);
  }

  @PostMapping("/mapping-ports")
  public ResponseEntity<MappingPortDTO> createMappingPort(
    @RequestBody CreateMappingPortRequest request) {
    
    MappingPortDTO port = errorService.createMappingPort(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(port);
  }

  @PostMapping("/mapping-ports/{id}/start")
  public ResponseEntity<Void> startMappingPort(@PathVariable Integer id) {
    errorService.startMappingPort(id);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/mapping-ports/{id}/stop")
  public ResponseEntity<Void> stopMappingPort(@PathVariable Integer id) {
    errorService.stopMappingPort(id);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/translation-log")
  public ResponseEntity<PagedResponse<TranslationLogDTO>> getTranslationLog(
    @RequestParam(required = false) String translationStatus,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "50") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("createdTime").descending());
    Page<TranslationLogDTO> logs = errorService.getTranslationLog(translationStatus, pageable);
    return ResponseEntity.ok(new PagedResponse<>(logs));
  }

  @PostMapping("/ai-feedback")
  public ResponseEntity<Void> submitAIFeedback(@RequestBody AIFeedbackRequest request) {
    errorService.submitAIFeedback(request);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/analytics")
  public ResponseEntity<ErrorCodeAnalyticsDTO> getAnalytics(
    @RequestParam(required = false) Integer enterpriseId,
    @RequestParam(required = false) LocalDate fromDate,
    @RequestParam(required = false) LocalDate toDate) {
    
    ErrorCodeAnalyticsDTO analytics = errorService.getAnalytics(enterpriseId, fromDate, toDate);
    return ResponseEntity.ok(analytics);
  }

  @GetMapping("/health-check")
  public ResponseEntity<SystemHealthDTO> getSystemHealth() {
    SystemHealthDTO health = errorService.getSystemHealth();
    return ResponseEntity.ok(health);
  }
}

@Service
public class AIErrorTrackingService {

  @Autowired
  private ErrorCodeMasterRepository errorCodeRepository;
  
  @Autowired
  private ErrorCodeTranslationLogRepository translationLogRepository;
  
  @Autowired
  private MappingPortRepository portRepository;

  public MappingResultDTO mapErrorCode(ErrorCodeMappingRequest request) {
    // 1. Check direct mapping in customer error code mapping table
    // 2. If not found, try translation rules with regex/conditional logic
    // 3. If still not found, use AI model for inference
    // 4. Log the translation and confidence score
    // 5. Return result with suggestion for manual review if low confidence

    return mapErrorCodeWithInference(request);
  }

  public void startMappingPort(Integer portId) {
    // Start listening on configured port/protocol
    // Initialize message parser based on format
    // Begin accepting and translating error codes
    // Log all translations in real-time
  }

  public void submitAIFeedback(AIFeedbackRequest request) {
    // Store feedback for this translation
    // Use feedback to improve AI model
    // Update mapping confidence scores
    // Flag for retraining if pattern emerges
  }

  public ErrorCodeAnalyticsDTO getAnalytics(Integer enterpriseId, LocalDate from, LocalDate to) {
    // Aggregate translation log data
    // Calculate error trends
    // Identify common patterns
    // Suggest improvements
    return buildAnalyticsResponse(enterpriseId, from, to);
  }
}
```

## 4. Key Features

- **Real-time Error Code Translation**: Listen on configured port, translate carrier codes to customer codes
- **Multi-level Mapping**: Direct lookup → Rule-based → AI inference
- **Confidence Scoring**: Each translation includes confidence percentage
- **Manual Review Queue**: Low-confidence translations flagged for review
- **AI Learning**: Feedback loop to improve model accuracy
- **Analytics**: Track error trends, identify problematic routes/destinations
- **Supplier Mapping**: Different carrier formats and encodings per supplier
- **Translation Rules**: Regex, conditional logic, priority-based execution
- **Audit Trail**: Log all translations for compliance and troubleshooting

## 5. Integration with Existing Modules

- **Vendor Trunks**: Error codes mapped from vendor responses
- **Customer Trunks**: Translated to customer's expected format
- **Rate Analytics**: Track revenue loss from specific error types
- **Reports**: Error trend analysis and recommendations
- **Admin Tasks**: Create tasks for unresolved mapping issues

