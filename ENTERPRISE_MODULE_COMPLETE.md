# Enterprise Module - Complete Implementation

## 1. MariaDB Schema

```sql
-- Trunk Type (Base table for both vendor and customer trunks)
CREATE TABLE `trunk_type` (
  `trunk_type_id` INT AUTO_INCREMENT PRIMARY KEY,
  `trunk_type_name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_trunk_type_name (trunk_type_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Trunk Table
CREATE TABLE `customer_trunk` (
  `customer_trunk_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_trunk_name` VARCHAR(255) NOT NULL,
  `enterprise_id` INT NOT NULL,
  `enterprise_name` VARCHAR(255),
  `trunk_type_id` INT,
  `trunk_type_name` VARCHAR(100),
  `description` TEXT,
  `sms_enabled` BOOLEAN DEFAULT TRUE,
  `voice_enabled` BOOLEAN DEFAULT FALSE,
  `data_enabled` BOOLEAN DEFAULT FALSE,
  `routing_prefix` VARCHAR(50),
  `concurrent_calls_limit` INT,
  `daily_volume_limit` BIGINT,
  `monthly_volume_limit` BIGINT,
  `rate_limit_per_second` INT DEFAULT 100,
  `fail_over_trunk_id` INT,
  `priority` INT DEFAULT 0,
  `cli_format` ENUM('E.164', 'National', 'MSISDN') DEFAULT 'E.164',
  `status` ENUM('Active', 'Inactive', 'Suspended', 'Testing') DEFAULT 'Testing',
  `activation_date` DATE,
  `deactivation_date` DATE,
  `notes` TEXT,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trunk_type_id) REFERENCES trunk_type(trunk_type_id),
  FOREIGN KEY (fail_over_trunk_id) REFERENCES customer_trunk(customer_trunk_id),
  INDEX idx_customer_trunk_name (customer_trunk_name),
  INDEX idx_enterprise_id (enterprise_id),
  INDEX idx_status (status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendor Trunk Table
CREATE TABLE `vendor_trunk` (
  `vendor_trunk_id` INT AUTO_INCREMENT PRIMARY KEY,
  `vendor_trunk_name` VARCHAR(255) NOT NULL,
  `vendor_id` INT NOT NULL,
  `vendor_name` VARCHAR(255),
  `trunk_type_id` INT,
  `trunk_type_name` VARCHAR(100),
  `description` TEXT,
  `sms_enabled` BOOLEAN DEFAULT TRUE,
  `voice_enabled` BOOLEAN DEFAULT FALSE,
  `data_enabled` BOOLEAN DEFAULT FALSE,
  `connection_type` ENUM('SMPP', 'SIP', 'HTTP API', 'TELECOM API', 'CUSTOM') DEFAULT 'SMPP',
  `endpoint_url` VARCHAR(500),
  `endpoint_port` INT,
  `username` VARCHAR(255),
  `password` VARCHAR(500),
  `api_key` VARCHAR(500),
  `authentication_type` ENUM('Basic', 'OAuth2', 'API Key', 'Custom') DEFAULT 'Basic',
  `ssl_enabled` BOOLEAN DEFAULT TRUE,
  `connection_timeout_seconds` INT DEFAULT 30,
  `read_timeout_seconds` INT DEFAULT 60,
  `concurrent_connections_limit` INT DEFAULT 10,
  `max_message_length` INT DEFAULT 160,
  `supports_unicode` BOOLEAN DEFAULT TRUE,
  `supports_long_sms` BOOLEAN DEFAULT FALSE,
  `rate_limit_per_second` INT DEFAULT 100,
  `daily_volume_limit` BIGINT,
  `monthly_volume_limit` BIGINT,
  `status` ENUM('Active', 'Inactive', 'Maintenance', 'Error', 'Suspended') DEFAULT 'Inactive',
  `health_check_enabled` BOOLEAN DEFAULT TRUE,
  `health_check_interval_seconds` INT DEFAULT 300,
  `last_health_check` TIMESTAMP NULL,
  `last_health_check_status` ENUM('Success', 'Failed', 'Timeout') NULL,
  `notes` TEXT,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trunk_type_id) REFERENCES trunk_type(trunk_type_id),
  INDEX idx_vendor_trunk_name (vendor_trunk_name),
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_status (status),
  INDEX idx_connection_type (connection_type),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Trunk Traffic/Statistics
CREATE TABLE `customer_trunk_stats` (
  `stats_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `customer_trunk_id` INT NOT NULL,
  `stats_date` DATE NOT NULL,
  `total_messages_sent` BIGINT DEFAULT 0,
  `total_messages_delivered` BIGINT DEFAULT 0,
  `total_messages_failed` BIGINT DEFAULT 0,
  `delivery_rate_pct` DECIMAL(5, 2),
  `total_calls` BIGINT DEFAULT 0,
  `total_call_duration_seconds` BIGINT DEFAULT 0,
  `total_data_volume_mb` DECIMAL(15, 2) DEFAULT 0,
  `total_revenue` DECIMAL(15, 2),
  `total_cost` DECIMAL(15, 2),
  `profit` DECIMAL(15, 2),
  `peak_concurrent_usage` INT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_trunk_id) REFERENCES customer_trunk(customer_trunk_id) ON DELETE CASCADE,
  UNIQUE KEY unique_daily_stats (customer_trunk_id, stats_date),
  INDEX idx_customer_trunk_id (customer_trunk_id),
  INDEX idx_stats_date (stats_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendor Trunk Traffic/Statistics
CREATE TABLE `vendor_trunk_stats` (
  `stats_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `vendor_trunk_id` INT NOT NULL,
  `stats_date` DATE NOT NULL,
  `total_messages_received` BIGINT DEFAULT 0,
  `total_messages_sent` BIGINT DEFAULT 0,
  `successful_sends` BIGINT DEFAULT 0,
  `failed_sends` BIGINT DEFAULT 0,
  `delivery_rate_pct` DECIMAL(5, 2),
  `average_latency_ms` DECIMAL(10, 2),
  `connection_uptime_pct` DECIMAL(5, 2),
  `total_calls_received` BIGINT DEFAULT 0,
  `total_call_duration_seconds` BIGINT DEFAULT 0,
  `total_data_volume_mb` DECIMAL(15, 2) DEFAULT 0,
  `total_cost_paid` DECIMAL(15, 2),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_trunk_id) REFERENCES vendor_trunk(vendor_trunk_id) ON DELETE CASCADE,
  UNIQUE KEY unique_daily_stats (vendor_trunk_id, stats_date),
  INDEX idx_vendor_trunk_id (vendor_trunk_id),
  INDEX idx_stats_date (stats_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Trunk Routing Rules
CREATE TABLE `customer_trunk_routing` (
  `routing_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_trunk_id` INT NOT NULL,
  `rule_priority` INT,
  `destination_code` VARCHAR(50),
  `destination_name` VARCHAR(255),
  `route_to_vendor_trunk_id` INT,
  `vendor_trunk_name` VARCHAR(255),
  `condition_type` ENUM('Destination', 'Time', 'Volume', 'Load', 'Any') DEFAULT 'Destination',
  `condition_value` VARCHAR(255),
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_trunk_id) REFERENCES customer_trunk(customer_trunk_id) ON DELETE CASCADE,
  FOREIGN KEY (route_to_vendor_trunk_id) REFERENCES vendor_trunk(vendor_trunk_id),
  INDEX idx_customer_trunk_id (customer_trunk_id),
  INDEX idx_rule_priority (rule_priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Trunk Alerts & Monitoring
CREATE TABLE `customer_trunk_alert` (
  `alert_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `customer_trunk_id` INT NOT NULL,
  `alert_type` ENUM('Volume Limit', 'Rate Limit', 'Delivery Rate', 'Cost Limit', 'Connection Error', 'Other') DEFAULT 'Other',
  `alert_message` TEXT NOT NULL,
  `severity` ENUM('Info', 'Warning', 'Critical') DEFAULT 'Warning',
  `alert_value` VARCHAR(255),
  `threshold_value` VARCHAR(255),
  `status` ENUM('Active', 'Acknowledged', 'Resolved') DEFAULT 'Active',
  `acknowledged_by` VARCHAR(100),
  `acknowledged_time` TIMESTAMP NULL,
  `resolved_by` VARCHAR(100),
  `resolved_time` TIMESTAMP NULL,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_trunk_id) REFERENCES customer_trunk(customer_trunk_id) ON DELETE CASCADE,
  INDEX idx_customer_trunk_id (customer_trunk_id),
  INDEX idx_status (status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendor Trunk Connection Logs
CREATE TABLE `vendor_trunk_connection_log` (
  `log_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `vendor_trunk_id` INT NOT NULL,
  `connection_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `disconnection_time` TIMESTAMP NULL,
  `duration_seconds` INT,
  `connection_status` ENUM('Success', 'Failed', 'Timeout', 'Authentication Error', 'Network Error') DEFAULT 'Failed',
  `error_message` TEXT,
  `ip_address` VARCHAR(45),
  `messages_sent` BIGINT DEFAULT 0,
  `messages_failed` BIGINT DEFAULT 0,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_trunk_id) REFERENCES vendor_trunk(vendor_trunk_id) ON DELETE CASCADE,
  INDEX idx_vendor_trunk_id (vendor_trunk_id),
  INDEX idx_connection_time (connection_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 2. Fast & Effective Queries

### Customer Trunk Queries

```sql
-- Get all customer trunks with stats and status
SELECT 
  ct.customer_trunk_id,
  ct.customer_trunk_name,
  ct.enterprise_name,
  ct.trunk_type_name,
  ct.status,
  CASE 
    WHEN ct.status = 'Active' AND cts.stats_date = CURDATE() THEN 'Running'
    WHEN ct.status = 'Testing' THEN 'Testing'
    WHEN ct.status = 'Inactive' THEN 'Inactive'
    ELSE ct.status
  END as operational_status,
  COALESCE(cts.total_messages_sent, 0) as today_messages,
  COALESCE(cts.delivery_rate_pct, 0) as delivery_rate,
  COALESCE(cts.total_revenue, 0) as today_revenue,
  ct.daily_volume_limit,
  COALESCE(cts.total_messages_sent, 0) as current_volume,
  ROUND(COALESCE(cts.total_messages_sent, 0) / ct.daily_volume_limit * 100, 2) as volume_usage_pct,
  ct.rate_limit_per_second,
  ct.updated_time
FROM customer_trunk ct
LEFT JOIN customer_trunk_stats cts ON ct.customer_trunk_id = cts.customer_trunk_id 
  AND cts.stats_date = CURDATE()
WHERE ct.status != 'Inactive'
ORDER BY ct.updated_time DESC
LIMIT ? OFFSET ?;

-- Get customer trunk details
SELECT 
  ct.*,
  COALESCE(ft.customer_trunk_name, 'None') as fail_over_trunk_name,
  COUNT(DISTINCT ctr.routing_id) as routing_rules_count
FROM customer_trunk ct
LEFT JOIN customer_trunk cft ON ct.fail_over_trunk_id = cft.customer_trunk_id
LEFT JOIN customer_trunk_routing ctr ON ct.customer_trunk_id = ctr.customer_trunk_id
WHERE ct.customer_trunk_id = ?
GROUP BY ct.customer_trunk_id;

-- Search customer trunks
SELECT customer_trunk_id, customer_trunk_name, enterprise_name, status
FROM customer_trunk
WHERE customer_trunk_name LIKE CONCAT('%', ?, '%')
  OR enterprise_name LIKE CONCAT('%', ?, '%')
ORDER BY customer_trunk_name;

-- Get customer trunk statistics for date range
SELECT 
  cts.stats_date,
  cts.total_messages_sent,
  cts.total_messages_delivered,
  cts.total_messages_failed,
  cts.delivery_rate_pct,
  cts.total_revenue,
  cts.total_cost,
  cts.profit,
  cts.peak_concurrent_usage
FROM customer_trunk_stats cts
WHERE cts.customer_trunk_id = ?
  AND cts.stats_date BETWEEN ? AND ?
ORDER BY cts.stats_date DESC
LIMIT ? OFFSET ?;

-- Get customer trunk volume usage trend (last 30 days)
SELECT 
  cts.stats_date,
  cts.total_messages_sent,
  ct.daily_volume_limit,
  ROUND(cts.total_messages_sent / ct.daily_volume_limit * 100, 2) as usage_pct,
  cts.delivery_rate_pct,
  cts.total_revenue
FROM customer_trunk_stats cts
JOIN customer_trunk ct ON cts.customer_trunk_id = ct.customer_trunk_id
WHERE cts.customer_trunk_id = ?
  AND cts.stats_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY cts.stats_date DESC;
```

### Vendor Trunk Queries

```sql
-- Get all vendor trunks with health status
SELECT 
  vt.vendor_trunk_id,
  vt.vendor_trunk_name,
  vt.vendor_name,
  vt.connection_type,
  vt.status,
  CASE 
    WHEN vt.last_health_check_status = 'Success' THEN 'Healthy'
    WHEN vt.last_health_check_status = 'Failed' THEN 'Error'
    WHEN vt.last_health_check_status IS NULL THEN 'Never Checked'
    ELSE 'Unknown'
  END as health_status,
  vt.last_health_check,
  COALESCE(vts.delivery_rate_pct, 0) as delivery_rate,
  COALESCE(vts.average_latency_ms, 0) as avg_latency_ms,
  COALESCE(vts.connection_uptime_pct, 0) as uptime_pct,
  vt.rate_limit_per_second,
  vt.updated_time
FROM vendor_trunk vt
LEFT JOIN vendor_trunk_stats vts ON vt.vendor_trunk_id = vts.vendor_trunk_id 
  AND vts.stats_date = CURDATE()
WHERE vt.status != 'Inactive'
ORDER BY vt.updated_time DESC
LIMIT ? OFFSET ?;

-- Get vendor trunk with connection configuration
SELECT 
  vt.vendor_trunk_id,
  vt.vendor_trunk_name,
  vt.vendor_name,
  vt.connection_type,
  vt.endpoint_url,
  vt.endpoint_port,
  vt.authentication_type,
  vt.ssl_enabled,
  vt.concurrent_connections_limit,
  vt.rate_limit_per_second,
  vt.status,
  vt.health_check_enabled,
  vt.health_check_interval_seconds
FROM vendor_trunk vt
WHERE vt.vendor_trunk_id = ?;

-- Search vendor trunks
SELECT vendor_trunk_id, vendor_trunk_name, vendor_name, connection_type, status
FROM vendor_trunk
WHERE vendor_trunk_name LIKE CONCAT('%', ?, '%')
  OR vendor_name LIKE CONCAT('%', ?, '%')
ORDER BY vendor_trunk_name;

-- Get vendor trunk statistics for date range
SELECT 
  vts.stats_date,
  vts.total_messages_received,
  vts.total_messages_sent,
  vts.successful_sends,
  vts.failed_sends,
  vts.delivery_rate_pct,
  vts.average_latency_ms,
  vts.connection_uptime_pct,
  vts.total_cost_paid
FROM vendor_trunk_stats vts
WHERE vts.vendor_trunk_id = ?
  AND vts.stats_date BETWEEN ? AND ?
ORDER BY vts.stats_date DESC
LIMIT ? OFFSET ?;

-- Get vendor trunk health history
SELECT 
  vtcl.connection_time,
  vtcl.disconnection_time,
  vtcl.duration_seconds,
  vtcl.connection_status,
  vtcl.messages_sent,
  vtcl.messages_failed,
  CASE 
    WHEN vtcl.messages_sent = 0 THEN 0
    ELSE ROUND((vtcl.successful_sends / vtcl.messages_sent) * 100, 2)
  END as success_rate_pct
FROM vendor_trunk_connection_log vtcl
WHERE vtcl.vendor_trunk_id = ?
  AND vtcl.connection_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY vtcl.connection_time DESC
LIMIT 100;

-- Get vendor trunks by connection type (for monitoring)
SELECT 
  vt.vendor_trunk_id,
  vt.vendor_trunk_name,
  vt.connection_type,
  COUNT(DISTINCT vtcl.log_id) as connection_attempts,
  SUM(CASE WHEN vtcl.connection_status = 'Success' THEN 1 ELSE 0 END) as successful_connections,
  ROUND(SUM(CASE WHEN vtcl.connection_status = 'Success' THEN 1 ELSE 0 END) / 
    COUNT(DISTINCT vtcl.log_id) * 100, 2) as success_rate_pct
FROM vendor_trunk vt
LEFT JOIN vendor_trunk_connection_log vtcl ON vt.vendor_trunk_id = vtcl.vendor_trunk_id
  AND vtcl.connection_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY vt.vendor_trunk_id
ORDER BY vt.vendor_trunk_name;
```

### Customer Trunk Routing & Alerts Queries

```sql
-- Get routing rules for customer trunk
SELECT 
  ctr.routing_id,
  ctr.rule_priority,
  ctr.destination_code,
  ctr.destination_name,
  ctr.condition_type,
  ctr.condition_value,
  ctr.route_to_vendor_trunk_id,
  vt.vendor_trunk_name,
  ctr.status
FROM customer_trunk_routing ctr
LEFT JOIN vendor_trunk vt ON ctr.route_to_vendor_trunk_id = vt.vendor_trunk_id
WHERE ctr.customer_trunk_id = ?
ORDER BY ctr.rule_priority ASC;

-- Get active alerts for customer trunk
SELECT 
  alert_id,
  alert_type,
  alert_message,
  severity,
  alert_value,
  threshold_value,
  status,
  created_time
FROM customer_trunk_alert
WHERE customer_trunk_id = ?
  AND status != 'Resolved'
ORDER BY severity DESC, created_time DESC;

-- Get alert summary
SELECT 
  alert_type,
  severity,
  COUNT(*) as count
FROM customer_trunk_alert
WHERE customer_trunk_id = ?
  AND status = 'Active'
GROUP BY alert_type, severity
ORDER BY severity DESC;
```

## 3. Spring Boot Controllers & Services

### CustomerTrunkController

```java
@RestController
@RequestMapping("/api/enterprise/customer-trunk")
@CrossOrigin(origins = "*")
public class CustomerTrunkController {

  @Autowired
  private CustomerTrunkService trunkService;

  @GetMapping
  public ResponseEntity<PagedResponse<CustomerTrunkDTO>> getAllTrunks(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int pageSize,
    @RequestParam(required = false) String search,
    @RequestParam(required = false) String status,
    @RequestParam(required = false) Integer enterpriseId) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("updatedTime").descending());
    Page<CustomerTrunkDTO> trunks = trunkService.getTrunks(search, status, enterpriseId, pageable);
    return ResponseEntity.ok(new PagedResponse<>(trunks));
  }

  @GetMapping("/{id}")
  public ResponseEntity<CustomerTrunkDetailDTO> getTrunkById(@PathVariable Integer id) {
    CustomerTrunkDetailDTO trunk = trunkService.getTrunkById(id);
    return ResponseEntity.ok(trunk);
  }

  @PostMapping
  public ResponseEntity<CustomerTrunkDTO> createTrunk(@RequestBody CreateTrunkRequest request) {
    CustomerTrunkDTO trunk = trunkService.createTrunk(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(trunk);
  }

  @PutMapping("/{id}")
  public ResponseEntity<CustomerTrunkDTO> updateTrunk(
    @PathVariable Integer id,
    @RequestBody UpdateTrunkRequest request) {
    CustomerTrunkDTO trunk = trunkService.updateTrunk(id, request);
    return ResponseEntity.ok(trunk);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTrunk(@PathVariable Integer id) {
    trunkService.deleteTrunk(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}/stats")
  public ResponseEntity<List<CustomerTrunkStatsDTO>> getTrunkStats(
    @PathVariable Integer id,
    @RequestParam(required = false) LocalDate fromDate,
    @RequestParam(required = false) LocalDate toDate) {
    
    List<CustomerTrunkStatsDTO> stats = trunkService.getTrunkStats(id, fromDate, toDate);
    return ResponseEntity.ok(stats);
  }

  @GetMapping("/{id}/routing")
  public ResponseEntity<List<CustomerTrunkRoutingDTO>> getTrunkRouting(@PathVariable Integer id) {
    List<CustomerTrunkRoutingDTO> routing = trunkService.getTrunkRouting(id);
    return ResponseEntity.ok(routing);
  }

  @PostMapping("/{id}/routing")
  public ResponseEntity<CustomerTrunkRoutingDTO> addRoutingRule(
    @PathVariable Integer id,
    @RequestBody CreateRoutingRequest request) {
    CustomerTrunkRoutingDTO routing = trunkService.addRoutingRule(id, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(routing);
  }

  @GetMapping("/{id}/alerts")
  public ResponseEntity<List<CustomerTrunkAlertDTO>> getTrunkAlerts(@PathVariable Integer id) {
    List<CustomerTrunkAlertDTO> alerts = trunkService.getTrunkAlerts(id);
    return ResponseEntity.ok(alerts);
  }
}
```

### VendorTrunkController

```java
@RestController
@RequestMapping("/api/enterprise/vendor-trunk")
@CrossOrigin(origins = "*")
public class VendorTrunkController {

  @Autowired
  private VendorTrunkService trunkService;

  @GetMapping
  public ResponseEntity<PagedResponse<VendorTrunkDTO>> getAllTrunks(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int pageSize,
    @RequestParam(required = false) String search,
    @RequestParam(required = false) String status,
    @RequestParam(required = false) String connectionType) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("updatedTime").descending());
    Page<VendorTrunkDTO> trunks = trunkService.getTrunks(search, status, connectionType, pageable);
    return ResponseEntity.ok(new PagedResponse<>(trunks));
  }

  @GetMapping("/{id}")
  public ResponseEntity<VendorTrunkDetailDTO> getTrunkById(@PathVariable Integer id) {
    VendorTrunkDetailDTO trunk = trunkService.getTrunkById(id);
    return ResponseEntity.ok(trunk);
  }

  @PostMapping
  public ResponseEntity<VendorTrunkDTO> createTrunk(@RequestBody CreateVendorTrunkRequest request) {
    VendorTrunkDTO trunk = trunkService.createTrunk(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(trunk);
  }

  @PutMapping("/{id}")
  public ResponseEntity<VendorTrunkDTO> updateTrunk(
    @PathVariable Integer id,
    @RequestBody UpdateVendorTrunkRequest request) {
    VendorTrunkDTO trunk = trunkService.updateTrunk(id, request);
    return ResponseEntity.ok(trunk);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTrunk(@PathVariable Integer id) {
    trunkService.deleteTrunk(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}/health")
  public ResponseEntity<HealthStatusDTO> getHealth(@PathVariable Integer id) {
    HealthStatusDTO health = trunkService.checkHealth(id);
    return ResponseEntity.ok(health);
  }

  @PostMapping("/{id}/health-check")
  public ResponseEntity<HealthStatusDTO> triggerHealthCheck(@PathVariable Integer id) {
    HealthStatusDTO health = trunkService.triggerHealthCheck(id);
    return ResponseEntity.ok(health);
  }

  @GetMapping("/{id}/stats")
  public ResponseEntity<List<VendorTrunkStatsDTO>> getTrunkStats(
    @PathVariable Integer id,
    @RequestParam(required = false) LocalDate fromDate,
    @RequestParam(required = false) LocalDate toDate) {
    
    List<VendorTrunkStatsDTO> stats = trunkService.getTrunkStats(id, fromDate, toDate);
    return ResponseEntity.ok(stats);
  }

  @GetMapping("/{id}/connection-logs")
  public ResponseEntity<List<VendorTrunkConnectionLogDTO>> getConnectionLogs(
    @PathVariable Integer id,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "50") int pageSize) {
    
    List<VendorTrunkConnectionLogDTO> logs = trunkService.getConnectionLogs(id, page, pageSize);
    return ResponseEntity.ok(logs);
  }
}
```

### CustomerTrunkService

```java
@Service
public class CustomerTrunkService {

  @Autowired
  private CustomerTrunkRepository trunkRepository;
  
  @Autowired
  private CustomerTrunkStatsRepository statsRepository;
  
  @Autowired
  private CustomerTrunkRoutingRepository routingRepository;
  
  @Autowired
  private CustomerTrunkAlertRepository alertRepository;

  public Page<CustomerTrunkDTO> getTrunks(String search, String status, Integer enterpriseId, Pageable pageable) {
    Specification<CustomerTrunk> spec = Specification.where(null);
    
    if (search != null && !search.isEmpty()) {
      spec = spec.and((root, query, cb) -> 
        cb.or(
          cb.like(cb.lower(root.get("trunkName")), "%" + search.toLowerCase() + "%"),
          cb.like(cb.lower(root.get("enterpriseName")), "%" + search.toLowerCase() + "%")
        ));
    }
    
    if (status != null && !status.isEmpty()) {
      spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
    }
    
    if (enterpriseId != null) {
      spec = spec.and((root, query, cb) -> cb.equal(root.get("enterpriseId"), enterpriseId));
    }
    
    return trunkRepository.findAll(spec, pageable)
      .map(CustomerTrunkDTO::fromEntity);
  }

  public CustomerTrunkDetailDTO getTrunkById(Integer id) {
    CustomerTrunk trunk = trunkRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Customer trunk not found"));
    
    List<CustomerTrunkRoutingDTO> routing = routingRepository
      .findByCustomerTrunkIdOrderByRulePriority(id)
      .stream()
      .map(CustomerTrunkRoutingDTO::fromEntity)
      .collect(Collectors.toList());
    
    List<CustomerTrunkAlertDTO> alerts = alertRepository
      .findByCustomerTrunkIdAndStatusOrderByCreatedTimeDesc(id, "Active")
      .stream()
      .map(CustomerTrunkAlertDTO::fromEntity)
      .collect(Collectors.toList());
    
    return CustomerTrunkDetailDTO.fromEntity(trunk, routing, alerts);
  }

  public CustomerTrunkDTO createTrunk(CreateTrunkRequest request) {
    CustomerTrunk trunk = new CustomerTrunk();
    trunk.setTrunkName(request.getTrunkName());
    trunk.setEnterpriseId(request.getEnterpriseId());
    trunk.setTrunkTypeId(request.getTrunkTypeId());
    trunk.setStatus(request.getStatus() != null ? request.getStatus() : "Testing");
    trunk.setCreatedBy(getCurrentUser());
    trunk.setCreatedTime(LocalDateTime.now());
    
    CustomerTrunk saved = trunkRepository.save(trunk);
    return CustomerTrunkDTO.fromEntity(saved);
  }

  public CustomerTrunkDTO updateTrunk(Integer id, UpdateTrunkRequest request) {
    CustomerTrunk trunk = trunkRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Customer trunk not found"));

    if (request.getTrunkName() != null) trunk.setTrunkName(request.getTrunkName());
    if (request.getStatus() != null) trunk.setStatus(request.getStatus());
    if (request.getDailyVolumeLimit() != null) trunk.setDailyVolumeLimit(request.getDailyVolumeLimit());
    if (request.getRateLimitPerSecond() != null) trunk.setRateLimitPerSecond(request.getRateLimitPerSecond());
    
    trunk.setUpdatedBy(getCurrentUser());
    trunk.setUpdatedTime(LocalDateTime.now());
    
    CustomerTrunk updated = trunkRepository.save(trunk);
    return CustomerTrunkDTO.fromEntity(updated);
  }

  public void deleteTrunk(Integer id) {
    trunkRepository.deleteById(id);
  }

  public List<CustomerTrunkStatsDTO> getTrunkStats(Integer trunkId, LocalDate fromDate, LocalDate toDate) {
    LocalDate from = fromDate != null ? fromDate : LocalDate.now().minusDays(30);
    LocalDate to = toDate != null ? toDate : LocalDate.now();
    
    return statsRepository.findByCustomerTrunkIdAndStateDateBetween(trunkId, from, to)
      .stream()
      .map(CustomerTrunkStatsDTO::fromEntity)
      .collect(Collectors.toList());
  }

  public List<CustomerTrunkRoutingDTO> getTrunkRouting(Integer trunkId) {
    return routingRepository.findByCustomerTrunkIdOrderByRulePriority(trunkId)
      .stream()
      .map(CustomerTrunkRoutingDTO::fromEntity)
      .collect(Collectors.toList());
  }

  public CustomerTrunkRoutingDTO addRoutingRule(Integer trunkId, CreateRoutingRequest request) {
    CustomerTrunk trunk = trunkRepository.findById(trunkId)
      .orElseThrow(() -> new ResourceNotFoundException("Customer trunk not found"));

    CustomerTrunkRouting routing = new CustomerTrunkRouting();
    routing.setCustomerTrunkId(trunkId);
    routing.setRulePriority(request.getRulePriority());
    routing.setDestinationCode(request.getDestinationCode());
    routing.setRouteToVendorTrunkId(request.getRouteToVendorTrunkId());
    routing.setStatus("Active");
    
    CustomerTrunkRouting saved = routingRepository.save(routing);
    return CustomerTrunkRoutingDTO.fromEntity(saved);
  }

  public List<CustomerTrunkAlertDTO> getTrunkAlerts(Integer trunkId) {
    return alertRepository.findByCustomerTrunkIdAndStatusOrderByCreatedTimeDesc(trunkId, "Active")
      .stream()
      .map(CustomerTrunkAlertDTO::fromEntity)
      .collect(Collectors.toList());
  }
}
```

## 4. Frontend Display Tables

The SectionView will display:

- **Customer Trunk Table**: Columns for trunk name, enterprise, status, daily messages, delivery rate, revenue, volume usage %, last update
- **Vendor Trunk Table**: Columns for trunk name, vendor, connection type, health status, delivery rate, latency, uptime %, last health check
- **Alerts**: Severity-based display with acknowledgment functionality
- **Statistics**: Daily stats with charts for traffic, revenue, cost, delivery rates

## 5. Key Features & Integration

- **Connection Pooling**: Vendor trunk connection management with health checks
- **Routing Rules**: Customer trunks can route to multiple vendor trunks based on priority/conditions
- **Load Monitoring**: Real-time volume and rate limit tracking
- **Health Checks**: Automated vendor trunk health monitoring
- **Alerts**: Automatic alerts for volume/rate limit breaches
- **Statistics**: Daily aggregation of traffic and financial metrics

