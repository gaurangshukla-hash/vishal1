# Reports Module - Complete Implementation

## 1. MariaDB Schema

```sql
-- Report Master Table
CREATE TABLE `report_master` (
  `report_id` INT AUTO_INCREMENT PRIMARY KEY,
  `report_name` VARCHAR(255) NOT NULL UNIQUE,
  `report_type` ENUM('Traffic', 'Financial', 'Performance', 'Diagnostic', 'Billing') DEFAULT 'Traffic',
  `description` TEXT,
  `sql_query` LONGTEXT,
  `query_parameters` JSON,
  `report_template_id` INT,
  `schedule_frequency` ENUM('OnDemand', 'Daily', 'Weekly', 'Monthly', 'Quarterly') DEFAULT 'OnDemand',
  `schedule_time` VARCHAR(20),
  `last_generated_time` TIMESTAMP NULL,
  `next_generation_time` TIMESTAMP NULL,
  `auto_email_enabled` BOOLEAN DEFAULT FALSE,
  `email_recipients` JSON,
  `format_options` ENUM('PDF', 'Excel', 'CSV', 'JSON') DEFAULT 'PDF',
  `retention_days` INT DEFAULT 90,
  `status` ENUM('Active', 'Inactive', 'Archived') DEFAULT 'Active',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_report_type (report_type),
  INDEX idx_status (status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Report Execution History
CREATE TABLE `report_execution` (
  `execution_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `report_id` INT NOT NULL,
  `report_name` VARCHAR(255),
  `execution_type` ENUM('OnDemand', 'Scheduled') DEFAULT 'OnDemand',
  `execution_start_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `execution_end_time` TIMESTAMP NULL,
  `execution_status` ENUM('Pending', 'Running', 'Completed', 'Failed', 'Cancelled') DEFAULT 'Pending',
  `total_records` BIGINT DEFAULT 0,
  `file_path` VARCHAR(500),
  `file_name` VARCHAR(255),
  `file_size_bytes` BIGINT,
  `error_message` TEXT,
  `execution_time_seconds` DECIMAL(10, 2),
  `requested_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES report_master(report_id),
  INDEX idx_report_id (report_id),
  INDEX idx_execution_status (execution_status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bilateral Report Table (Customer to Vendor settlement)
CREATE TABLE `bilateral_report` (
  `report_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `report_date` DATE NOT NULL,
  `customer_enterprise_id` INT,
  `customer_enterprise_name` VARCHAR(255),
  `vendor_enterprise_id` INT,
  `vendor_enterprise_name` VARCHAR(255),
  `customer_trunk_id` INT,
  `vendor_trunk_id` INT,
  `total_messages_sent_to_vendor` BIGINT DEFAULT 0,
  `total_messages_delivered_from_vendor` BIGINT DEFAULT 0,
  `total_messages_failed` BIGINT DEFAULT 0,
  `delivery_rate_pct` DECIMAL(5, 2),
  `total_amount_charged_to_customer` DECIMAL(15, 2),
  `total_amount_paid_to_vendor` DECIMAL(15, 2),
  `margin_pct` DECIMAL(5, 2),
  `status` ENUM('Draft', 'Final', 'Disputed', 'Settled') DEFAULT 'Draft',
  `settlement_status` ENUM('Pending', 'Invoiced', 'Paid') DEFAULT 'Pending',
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_bilateral (report_date, customer_enterprise_id, vendor_enterprise_id),
  INDEX idx_report_date (report_date),
  INDEX idx_customer_enterprise (customer_enterprise_id),
  INDEX idx_vendor_enterprise (vendor_enterprise_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Negative Margin Report
CREATE TABLE `negative_margin_report` (
  `report_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `report_date` DATE NOT NULL,
  `customer_trunk_id` INT,
  `customer_trunk_name` VARCHAR(255),
  `customer_enterprise_name` VARCHAR(255),
  `destination_code` VARCHAR(50),
  `destination_name` VARCHAR(255),
  `total_messages` BIGINT DEFAULT 0,
  `customer_rate_per_unit` DECIMAL(10, 6),
  `vendor_rate_per_unit` DECIMAL(10, 6),
  `total_customer_revenue` DECIMAL(15, 2),
  `total_vendor_cost` DECIMAL(15, 2),
  `margin_amount` DECIMAL(15, 2),
  `margin_pct` DECIMAL(5, 2),
  `is_negative_margin` BOOLEAN DEFAULT FALSE,
  `loss_amount` DECIMAL(15, 2),
  `route_used` VARCHAR(255),
  `notes` TEXT,
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_report_date (report_date),
  INDEX idx_is_negative (is_negative_margin),
  INDEX idx_customer_trunk (customer_trunk_id),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Route Simulator Table
CREATE TABLE `route_simulation` (
  `simulation_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `simulation_name` VARCHAR(255),
  `test_destination` VARCHAR(50) NOT NULL,
  `test_msisdn` VARCHAR(20),
  `test_message_content` TEXT,
  `test_message_length` INT,
  `simulated_routing_rules` JSON,
  `primary_route_selected` VARCHAR(255),
  `fallback_route_selected` VARCHAR(255),
  `estimated_delivery_time_seconds` DECIMAL(10, 2),
  `estimated_cost` DECIMAL(15, 2),
  `success_probability_pct` DECIMAL(5, 2),
  `simulation_notes` TEXT,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TCP Dump/Network Analysis Table
CREATE TABLE `tcp_dump_file` (
  `dump_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `dump_file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500),
  `file_size_bytes` BIGINT,
  `start_capture_time` TIMESTAMP,
  `end_capture_time` TIMESTAMP,
  `capture_duration_seconds` INT,
  `packet_count` BIGINT DEFAULT 0,
  `protocol_breakdown` JSON,
  `source_ip_addresses` JSON,
  `destination_ip_addresses` JSON,
  `smpp_connections` INT DEFAULT 0,
  `http_requests` INT DEFAULT 0,
  `sip_calls` INT DEFAULT 0,
  `dns_queries` INT DEFAULT 0,
  `anomalies_detected` BOOLEAN DEFAULT FALSE,
  `anomaly_description` TEXT,
  `analysis_status` ENUM('Raw Capture', 'Analyzing', 'Analyzed', 'Archived') DEFAULT 'Raw Capture',
  `compression_status` ENUM('Uncompressed', 'Gzip', 'Bzip2') DEFAULT 'Uncompressed',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_time (created_time),
  INDEX idx_analysis_status (analysis_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Network Diagnosis Results
CREATE TABLE `network_diagnosis` (
  `diagnosis_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `diagnosis_name` VARCHAR(255),
  `test_type` ENUM('Ping', 'Traceroute', 'DNS', 'SMPP Connection', 'SIP Connection', 'HTTP API', 'Performance Test') DEFAULT 'Ping',
  `target_ip_or_domain` VARCHAR(255) NOT NULL,
  `target_port` INT,
  `vendor_trunk_id` INT,
  `diagnosis_start_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `diagnosis_end_time` TIMESTAMP NULL,
  `status_code` INT,
  `status_message` VARCHAR(500),
  `latency_ms` DECIMAL(10, 2),
  `min_latency_ms` DECIMAL(10, 2),
  `max_latency_ms` DECIMAL(10, 2),
  `avg_latency_ms` DECIMAL(10, 2),
  `packet_loss_pct` DECIMAL(5, 2),
  `hops_count` INT,
  `ttl` INT,
  `dns_resolution_time_ms` DECIMAL(10, 2),
  `resolved_ip_address` VARCHAR(45),
  `connection_status` ENUM('Success', 'Failed', 'Timeout', 'Unreachable') DEFAULT 'Failed',
  `error_details` TEXT,
  `detailed_trace_data` LONGTEXT,
  `recommendations` TEXT,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_test_type (test_type),
  INDEX idx_created_time (created_time),
  INDEX idx_status_code (status_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 2. Fast & Effective Queries

```sql
-- Get all reports
SELECT report_id, report_name, report_type, schedule_frequency, status, last_generated_time
FROM report_master
WHERE status = 'Active'
ORDER BY created_time DESC
LIMIT ? OFFSET ?;

-- Get report execution history
SELECT execution_id, report_name, execution_start_time, execution_end_time, execution_status, 
  total_records, execution_time_seconds
FROM report_execution
WHERE report_id = ?
ORDER BY execution_start_time DESC
LIMIT ? OFFSET ?;

-- Bilateral Report Summary
SELECT 
  br.report_date,
  br.customer_enterprise_name,
  br.vendor_enterprise_name,
  br.total_messages_sent_to_vendor,
  br.total_messages_delivered_from_vendor,
  br.delivery_rate_pct,
  br.total_amount_charged_to_customer,
  br.total_amount_paid_to_vendor,
  br.margin_pct,
  br.status
FROM bilateral_report br
WHERE br.report_date BETWEEN ? AND ?
  AND br.status = 'Final'
ORDER BY br.report_date DESC
LIMIT ? OFFSET ?;

-- Bilateral Report Detail
SELECT *
FROM bilateral_report
WHERE report_date = ?
  AND customer_enterprise_id = ?
  AND vendor_enterprise_id = ?
LIMIT 1;

-- Negative Margin Analysis (last 30 days)
SELECT 
  nmr.report_date,
  nmr.customer_trunk_name,
  nmr.destination_code,
  nmr.destination_name,
  nmr.total_messages,
  nmr.customer_rate_per_unit,
  nmr.vendor_rate_per_unit,
  nmr.total_customer_revenue,
  nmr.total_vendor_cost,
  nmr.margin_amount,
  nmr.margin_pct,
  nmr.loss_amount
FROM negative_margin_report nmr
WHERE nmr.report_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND nmr.is_negative_margin = TRUE
ORDER BY nmr.loss_amount DESC, nmr.report_date DESC
LIMIT ? OFFSET ?;

-- Negative Margin Summary by destination
SELECT 
  nmr.destination_code,
  nmr.destination_name,
  COUNT(*) as occurrence_count,
  SUM(nmr.loss_amount) as total_loss,
  AVG(nmr.margin_pct) as avg_margin_pct
FROM negative_margin_report nmr
WHERE nmr.report_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
  AND nmr.is_negative_margin = TRUE
GROUP BY nmr.destination_code
ORDER BY total_loss DESC
LIMIT 20;

-- Route Simulations
SELECT simulation_id, simulation_name, test_destination, primary_route_selected,
  estimated_delivery_time_seconds, estimated_cost, success_probability_pct
FROM route_simulation
ORDER BY created_time DESC
LIMIT ? OFFSET ?;

-- TCP Dump Files
SELECT dump_id, dump_file_name, file_size_bytes, start_capture_time, 
  end_capture_time, capture_duration_seconds, packet_count, 
  analysis_status, anomalies_detected
FROM tcp_dump_file
WHERE analysis_status != 'Archived'
ORDER BY created_time DESC
LIMIT ? OFFSET ?;

-- Network Diagnosis Results
SELECT diagnosis_id, diagnosis_name, test_type, target_ip_or_domain,
  diagnosis_start_time, status_message, connection_status,
  latency_ms, packet_loss_pct
FROM network_diagnosis
ORDER BY diagnosis_start_time DESC
LIMIT ? OFFSET ?;

-- Network Diagnosis by vendor trunk
SELECT diagnosis_id, test_type, target_ip_or_domain, status_message, 
  connection_status, avg_latency_ms, packet_loss_pct
FROM network_diagnosis
WHERE vendor_trunk_id = ?
  AND diagnosis_start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY diagnosis_start_time DESC;
```

## 3. Spring Boot Controllers & Services

```java
@RestController
@RequestMapping("/api/report")
@CrossOrigin(origins = "*")
public class ReportController {

  @Autowired
  private ReportService reportService;

  @GetMapping
  public ResponseEntity<PagedResponse<ReportMasterDTO>> getAllReports(
    @RequestParam(required = false) String reportType,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<ReportMasterDTO> reports = reportService.getAllReports(reportType, pageable);
    return ResponseEntity.ok(new PagedResponse<>(reports));
  }

  @GetMapping("/{id}/execute")
  public ResponseEntity<ReportExecutionDTO> executeReport(
    @PathVariable Integer id,
    @RequestParam(required = false) LocalDate fromDate,
    @RequestParam(required = false) LocalDate toDate) {
    
    ReportExecutionDTO execution = reportService.executeReport(id, fromDate, toDate);
    return ResponseEntity.ok(execution);
  }

  @GetMapping("/{id}/history")
  public ResponseEntity<PagedResponse<ReportExecutionDTO>> getExecutionHistory(
    @PathVariable Integer id,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<ReportExecutionDTO> history = reportService.getExecutionHistory(id, pageable);
    return ResponseEntity.ok(new PagedResponse<>(history));
  }
}

@RestController
@RequestMapping("/api/report/bilateral")
@CrossOrigin(origins = "*")
public class BilateralReportController {

  @Autowired
  private BilateralReportService bilateralService;

  @GetMapping
  public ResponseEntity<PagedResponse<BilateralReportDTO>> getBilateralReports(
    @RequestParam(required = false) LocalDate fromDate,
    @RequestParam(required = false) LocalDate toDate,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<BilateralReportDTO> reports = bilateralService.getBilateralReports(fromDate, toDate, pageable);
    return ResponseEntity.ok(new PagedResponse<>(reports));
  }

  @PostMapping("/generate")
  public ResponseEntity<BilateralReportDTO> generateBilateralReport(
    @RequestBody GenerateBilateralRequest request) {
    
    BilateralReportDTO report = bilateralService.generateReport(request);
    return ResponseEntity.ok(report);
  }
}

@RestController
@RequestMapping("/api/report/negative-margin")
@CrossOrigin(origins = "*")
public class NegativeMarginReportController {

  @Autowired
  private NegativeMarginReportService negativeMarginService;

  @GetMapping
  public ResponseEntity<PagedResponse<NegativeMarginDTO>> getNegativeMarginReports(
    @RequestParam(required = false) LocalDate fromDate,
    @RequestParam(required = false) LocalDate toDate,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("lossAmount").descending());
    Page<NegativeMarginDTO> reports = negativeMarginService.getNegativeMarginReports(fromDate, toDate, pageable);
    return ResponseEntity.ok(new PagedResponse<>(reports));
  }

  @GetMapping("/summary")
  public ResponseEntity<NegativeMarginSummaryDTO> getNegativeMarginSummary(
    @RequestParam(required = false) LocalDate fromDate,
    @RequestParam(required = false) LocalDate toDate) {
    
    NegativeMarginSummaryDTO summary = negativeMarginService.getSummary(fromDate, toDate);
    return ResponseEntity.ok(summary);
  }
}

@RestController
@RequestMapping("/api/report/route-simulator")
@CrossOrigin(origins = "*")
public class RouteSimulatorController {

  @Autowired
  private RouteSimulatorService simulatorService;

  @PostMapping("/simulate")
  public ResponseEntity<SimulationResultDTO> simulateRoute(
    @RequestBody RouteSimulationRequest request) {
    
    SimulationResultDTO result = simulatorService.simulateRoute(request);
    return ResponseEntity.ok(result);
  }

  @GetMapping("/history")
  public ResponseEntity<PagedResponse<SimulationHistoryDTO>> getSimulationHistory(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<SimulationHistoryDTO> history = simulatorService.getHistory(pageable);
    return ResponseEntity.ok(new PagedResponse<>(history));
  }
}

@RestController
@RequestMapping("/api/report/tcp-dump")
@CrossOrigin(origins = "*")
public class TCPDumpController {

  @Autowired
  private TCPDumpService tcpDumpService;

  @GetMapping
  public ResponseEntity<PagedResponse<TCPDumpDTO>> getTCPDumps(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<TCPDumpDTO> dumps = tcpDumpService.getTCPDumps(pageable);
    return ResponseEntity.ok(new PagedResponse<>(dumps));
  }

  @PostMapping("/upload")
  public ResponseEntity<TCPDumpDTO> uploadTCPDump(
    @RequestParam("file") MultipartFile file,
    @RequestParam(required = false) String description) {
    
    TCPDumpDTO dump = tcpDumpService.uploadDump(file, description);
    return ResponseEntity.status(HttpStatus.CREATED).body(dump);
  }

  @PostMapping("/{id}/analyze")
  public ResponseEntity<TCPDumpAnalysisDTO> analyzeDump(@PathVariable Long id) {
    TCPDumpAnalysisDTO analysis = tcpDumpService.analyzeDump(id);
    return ResponseEntity.ok(analysis);
  }

  @GetMapping("/{id}/download")
  public ResponseEntity<Resource> downloadDump(@PathVariable Long id) throws IOException {
    Resource resource = tcpDumpService.downloadDump(id);
    return ResponseEntity.ok()
      .contentType(MediaType.APPLICATION_OCTET_STREAM)
      .body(resource);
  }
}

@RestController
@RequestMapping("/api/report/network-diagnosis")
@CrossOrigin(origins = "*")
public class NetworkDiagnosisController {

  @Autowired
  private NetworkDiagnosisService diagnosisService;

  @PostMapping("/run")
  public ResponseEntity<NetworkDiagnosisDTO> runDiagnosis(
    @RequestBody DiagnosisRequest request) {
    
    NetworkDiagnosisDTO diagnosis = diagnosisService.runDiagnosis(request);
    return ResponseEntity.ok(diagnosis);
  }

  @GetMapping
  public ResponseEntity<PagedResponse<NetworkDiagnosisDTO>> getDiagnosisResults(
    @RequestParam(required = false) String testType,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int pageSize) {
    
    Pageable pageable = PageRequest.of(page, pageSize);
    Page<NetworkDiagnosisDTO> results = diagnosisService.getDiagnosisResults(testType, pageable);
    return ResponseEntity.ok(new PagedResponse<>(results));
  }

  @GetMapping("/{vendorTrunkId}/vendor-health")
  public ResponseEntity<VendorHealthDTO> getVendorHealth(@PathVariable Integer vendorTrunkId) {
    VendorHealthDTO health = diagnosisService.getVendorHealth(vendorTrunkId);
    return ResponseEntity.ok(health);
  }
}
```

## 4. Frontend Integration

Tables shown in SectionView.tsx:
- `'All Reports'`: List of available reports with last execution date, status
- `'Bilateral Report'`: Customer-vendor settlement reports with margin percentages
- `'Negative Margin Report'`: Red flag reports showing loss-making routes
- `'Route Simulator'`: Test routing decisions before deployment
- `'TCP Dump'`: Network capture files with analysis results
- `'Network Diagnosis'`: Vendor trunk health checks and connectivity tests

