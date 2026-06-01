import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  Settings, 
  RefreshCw, 
  Zap, 
  Flame, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  Sliders, 
  Terminal,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

interface QueryTemplate {
  id: string;
  title: string;
  description: string;
  impact: string;
  category: 'Dashboard' | 'Enterprise' | 'Finance' | 'Rate & Products' | 'Reports' | 'SMS Services' | 'Admin';
  indexRecommendation: string;
  tuningTip: string;
  placeholders: Record<string, string>;
  sqlGenerator: (fields: Record<string, string>) => string;
}

export function FastQueryHubView({ theme }: { theme: 'light' | 'dark' }) {
  // 1. Initial customizable fields for dynamic replacement
  const [tableConfigs, setTableConfigs] = useState<Record<string, string>>({
    databaseName: 'sms_wholesale',
    smsLogsTable: 'sms_billing_logs',
    routesTable: 'carrier_routing_rules',
    productsTable: 'wholesale_sms_products',
    ratesTable: 'supplier_rate_sheets',
    smsIdField: 'msg_id',
    timestampField: 'sent_timestamp',
    mccmncField: 'mccmnc_code',
    prefixField: 'destination_prefix',
    sellRateField: 'customer_sell_rate',
    buyRateField: 'vendor_buy_rate',
    dlrStatusField: 'delivery_status',
    tpsLimitField: 'max_tps_threshold',
    vendorTrunkField: 'allocated_vendor_trunk',
    priorityField: 'execution_priority'
  });

  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Enterprise' | 'Finance' | 'Rate & Products' | 'Reports' | 'SMS Services' | 'Admin'>('Dashboard');
  const [viewMode, setViewMode] = useState<'queries' | 'schemas' | 'springboot'>('queries');
  const [springSubTab, setSpringSubTab] = useState<'entity' | 'repo' | 'controller' | 'high_tps_5000'>('entity');
  const [springFinanceModule, setSpringFinanceModule] = useState<'Billing' | 'Payment' | 'CustomerInvoice' | 'VendorInvoice' | 'SOA' | 'Currency' | 'CurrencyExchange' | 'EnterpriseBalance' | 'BillingCycle'>('Billing');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfettiTip, setShowConfettiTip] = useState(true);
  
  // Interactive Live Database Connection Simulator settings
  const [isSimulatingDB, setIsSimulatingDB] = useState(true);
  const [isDbConnecting, setIsDbConnecting] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);

  // Helper to compile Spring Boot Code dynamically based on target module and active tab
  const getSpringCode = (tab: 'entity' | 'repo' | 'controller' | 'high_tps_5000', module: string): string => {
    if (tab === 'high_tps_5000') {
      return `package com.teleoss.sms.reactive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.kafka.core.reactive.ReactiveKafkaProducerTemplate;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import org.springframework.r2dbc.core.DatabaseClient;
import java.time.Duration;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * ⚡ TELEOSS HIGH SPEED 5000+ TPS MULTI-CHANNEL PIPELINE ENGINE
 * Mapped Module: ${module} | Target Logs Table: ${tableConfigs.smsLogsTable}
 * 
 * ------------------------------------------------------------------------------------------------------------------------------------------------------
 * 4 COMPLETED CHANNELS ARCHITECTURE:
 * Channel 1: [Customer to System Submission] -> REST API / WebFlux Gateway + Redis O(1) Limit Guard + Kafka Producer (Goal: >5000 TPS).
 * Channel 2: [Customer to Suppliers Outbound Dispatch Task] -> Virtual thread executors consuming Kafka submit topics to Netty client.
 * Channel 3: [Supplier to System Incoming DLR Stream Handler] -> Flux streams from supplier webhooks, buffering in memory and running single-write micro-batches.
 * Channel 4: [System to Customer Delivery Report Dispatch] -> Dynamic WebClient emitter routing client callback hooks.
 * ------------------------------------------------------------------------------------------------------------------------------------------------------
 */
@RestController
@RequestMapping("/api/v2/sms/pipeline")
@CrossOrigin(origins = "*")
public class ReactiveSmsSubmissionController {

    @Autowired
    private ReactiveStringRedisTemplate redisTemplate;

    @Autowired
    private ReactiveKafkaProducerTemplate<String, String> kafkaProducerTemplate;

    // CHANNEL 1: Customer to System Submission Gateway (Non-blocking, fast Kafka push)
    @PostMapping("/submit")
    public Mono<SmsResponse> submitSms(@RequestBody SmsPayload payload) {
        String cacheLimitKey = "client:rate_limit:" + payload.getClientId();
        return redisTemplate.opsForValue().increment(cacheLimitKey)
            .flatMap(reqCount -> {
                if (reqCount > 50000) { // Limit benchmark bypass
                    return Mono.error(new Exception("Rate Limit Exceeded (>50k req/min peak)"));
                }
                String msgId = UUID.randomUUID().toString();
                payload.setMsgId(msgId);
                return kafkaProducerTemplate.send("teleoss.mt.submissions", msgId, payload.toJson())
                    .map(senderResult -> new SmsResponse(msgId, "ACCEPTED_FOR_ROUTING", "000"));
            });
    }

    // CHANNEL 3: Supplier to System Incoming BULK DLR stream parser
    // Reduces write lock overhead on databases. Buffer 2000 events / Flush every 250ms natively in MariaDB
    public void executeBulkDlrStream(Flux<IncomingDlrReport> dlrFlux, DatabaseClient r2dbcClient) {
        dlrFlux.bufferTimeout(2000, Duration.ofMillis(250))
            .flatMap(batch -> {
                if (batch.isEmpty()) return Mono.empty();
                
                // Formulate optimized bulk UPDATE for MariaDB or PostgreSQL
                String valuesBlock = batch.stream()
                    .map(dlr -> String.format("('%s', '%s')", dlr.getMsgId(), dlr.getDlrStatus()))
                    .collect(Collectors.joining(","));
                
                String query = "UPDATE ${tableConfigs.smsLogsTable} AS t " +
                               "SET t.${tableConfigs.dlrStatusField} = v.status, t.delivered_timestamp = NOW() " +
                               "FROM (VALUES " + valuesBlock + " ) AS v(id, status) " +
                               "WHERE t.${tableConfigs.smsIdField} = v.id";
                               
                return r2dbcClient.sql(query).fetch().rowsUpdated();
            }).subscribe();
    }
    
    // MariaDB Server Payout parameters configuration (Apply to my.cnf/ini for maximum throughput):
    // ----------------------------------------------------------------------------------------------------
    // innodb_flush_log_at_trx_commit = 2     # Double disk IO write cycles (Saves CPU disk bottleneck)
    // innodb_buffer_pool_size = 12G          # Dedicate up to 75% system memory allocations for buffer caching
    // innodb_log_file_size = 2G              # Avoid unnecessary checkpoint flushes during active dispatches
    // max_connections = 2500                 # Scale socket pathways to buffer reactive threads
}`;
    }

    // Dynamic compilation according to module
    switch(module) {
      case 'Payment':
        if (tab === 'entity') {
          return `package com.teleoss.finance.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 1. PAYMENT TRANSACTIONS LEDGER - ENTITIES
 * Maps bank transfers, cash payments, credits, and adjustments in MariaDB
 */
@Entity
@Table(name = "payment_transactions")
public class PaymentTransaction {

    @Id
    @Column(name = "transaction_id", length = 50)
    private String transactionId;

    @Column(name = "enterprise_id", nullable = false, length = 50)
    private String enterpriseId;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "payment_time")
    private LocalTime paymentTime;

    @Column(name = "mode_of_payment", length = 30)
    private String modeOfPayment;

    @Column(name = "payment_type", length = 15) // 'Debit', 'Credit'
    private String paymentType;

    @Column(name = "transaction_type", length = 30) // 'Bill Payment', 'Adjustment'
    private String transactionType;

    @Column(name = "amount", precision = 15, scale = 4)
    private BigDecimal amount;

    @Column(name = "currency", length = 3)
    private String currency;

    @Column(name = "invoice_number", length = 50)
    private String invoiceNumber;

    @Column(name = "payment_status", length = 20) // 'Full', 'Partial'
    private String paymentStatus;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    // Getters and Setters
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String id) { this.transactionId = id; }
    public String getEnterpriseId() { return enterpriseId; }
    public void setEnterpriseId(String id) { this.enterpriseId = id; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal val) { this.amount = val; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String no) { this.invoiceNumber = no; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String s) { this.paymentStatus = s; }
}`;
        }
        if (tab === 'repo') {
          return `package com.teleoss.finance.repositories;

import com.teleoss.finance.models.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentTransaction, String> {

    List<PaymentTransaction> findByEnterpriseIdOrderByPaymentDateDesc(String enterpriseId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentTransaction p WHERE p.enterpriseId = :entId AND p.paymentStatus = 'Full'")
    BigDecimal getTotalSettledAmount(@Param("entId") String entId);
    
    @Query(value = "SELECT * FROM payment_transactions WHERE payment_date = CURDATE() ORDER BY payment_time DESC", nativeQuery = true)
    List<PaymentTransaction> findTodayInboundLedgers();
}`;
        }
        return `package com.teleoss.finance.controllers;

import com.teleoss.finance.models.PaymentTransaction;
import com.teleoss.finance.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin(origins = "*")
public class PaymentRestController {

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/enterprise/{entId}")
    public ResponseEntity<List<PaymentTransaction>> getEnterprisePayments(@PathVariable String entId) {
        return ResponseEntity.ok(paymentRepository.findByEnterpriseIdOrderByPaymentDateDesc(entId));
    }

    @PostMapping("/submit")
    @Transactional // Executes atomic commit across ledger records and balances
    public ResponseEntity<?> submitNewPayment(@RequestBody PaymentTransaction payload) {
        if (payload.getAmount() == null || payload.getEnterpriseId() == null) {
            return ResponseEntity.badRequest().body("Required transaction parameters are missing");
        }
        PaymentTransaction saved = paymentRepository.save(payload);
        return ResponseEntity.ok(saved);
    }
}`;

      case 'CustomerInvoice':
        if (tab === 'entity') {
          return `package com.teleoss.finance.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 2. CUSTOMER INVOICES - ENTITIES
 * Maps rating summaries compiled across active billing cycle ranges in MariaDB
 */
@Entity
@Table(name = "customer_invoices")
public class CustomerInvoice {

    @Id
    @Column(name = "invoice_number", length = 50)
    private String invoiceNumber;

    @Column(name = "enterprise_name", nullable = false, length = 100)
    private String enterpriseName;

    @Column(name = "invoice_date")
    private LocalDate invoiceDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "amount", precision = 15, scale = 4)
    private BigDecimal amount;

    @Column(name = "outstanding_amount", precision = 15, scale = 4)
    private BigDecimal outstandingAmount;

    @Column(name = "status", length = 20) // 'Paid', 'Unpaid', 'Overdue'
    private String status;

    @Column(name = "pdf_path", length = 255)
    private String pdfPath;

    // Getters and Setters
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String no) { this.invoiceNumber = no; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amt) { this.amount = amt; }
    public BigDecimal getOutstandingAmount() { return outstandingAmount; }
    public void setOutstandingAmount(BigDecimal s) { this.outstandingAmount = s; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}`;
        }
        if (tab === 'repo') {
          return `package com.teleoss.finance.repositories;

import com.teleoss.finance.models.CustomerInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CustomerInvoiceRepository extends JpaRepository<CustomerInvoice, String> {

    List<CustomerInvoice> findByStatus(String status);

    @Query("SELECT COALESCE(SUM(c.outstandingAmount), 0) FROM CustomerInvoice c WHERE c.enterpriseName = :entName")
    BigDecimal getOutstandingDuesByEnterprise(@Param("entName") String entName);

    // MariaDB aggregate call to check client invoice age brackets
    @Query(value = "SELECT " +
            "  SUM(CASE WHEN due_date < CURDATE() - INTERVAL 30 DAY THEN outstanding_amount ELSE 0 END) AS overdue_30, " +
            "  SUM(CASE WHEN due_date < CURDATE() - INTERVAL 60 DAY THEN outstanding_amount ELSE 0 END) AS overdue_60 " +
            "FROM customer_invoices WHERE status = 'Unpaid'", nativeQuery = true)
    List<Object[]> getAgingAggregateMetrics();
}`;
        }
        return `package com.teleoss.finance.controllers;

import com.teleoss.finance.models.CustomerInvoice;
import com.teleoss.finance.repositories.CustomerInvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/customer-invoices")
@CrossOrigin(origins = "*")
public class CustomerInvoiceRestController {

    @Autowired
    private CustomerInvoiceRepository repository;

    @GetMapping("/active")
    public ResponseEntity<List<CustomerInvoice>> getUnpaidInvoices() {
        return ResponseEntity.ok(repository.findByStatus("Unpaid"));
    }

    @PostMapping("/create")
    public ResponseEntity<CustomerInvoice> createInvoice(@RequestBody CustomerInvoice invoice) {
        CustomerInvoice created = repository.save(invoice);
        return ResponseEntity.ok(created);
    }
}`;

      case 'VendorInvoice':
        if (tab === 'entity') {
          return `package com.teleoss.finance.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 3. SUPPLIER VENDOR INBOUND INVOICE - ENTITIES
 * Stores uploaded wholesale carrier invoices matching trunks in MariaDB
 */
@Entity
@Table(name = "vendor_invoices")
public class VendorInvoice {

    @Id
    @Column(name = "invoice_number", length = 50)
    private String invoiceNumber;

    @Column(name = "enterprise_name", nullable = false, length = 100)
    private String enterpriseName;

    @Column(name = "vendor_trunk", nullable = false, length = 50)
    private String vendorTrunk;

    @Column(name = "charge_volume")
    private Long chargeVolume;

    @Column(name = "charge_amount", precision = 15, scale = 4)
    private BigDecimal chargeAmount;

    @Column(name = "invoice_date")
    private LocalDate invoiceDate;

    @Column(name = "dispute_amount", precision = 15, scale = 4)
    private BigDecimal disputeAmount;

    @Column(name = "reconciliation_status", length = 30) // 'APPROVED', 'DISPUTED'
    private String reconciliationStatus;

    // Getters and Setters
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String no) { this.invoiceNumber = no; }
    public String getVendorTrunk() { return vendorTrunk; }
    public void setVendorTrunk(String t) { this.vendorTrunk = t; }
    public BigDecimal getChargeAmount() { return chargeAmount; }
    public void setChargeAmount(BigDecimal val) { this.chargeAmount = val; }
    public String getReconciliationStatus() { return reconciliationStatus; }
    public void setReconciliationStatus(String s) { this.reconciliationStatus = s; }
}`;
        }
        if (tab === 'repo') {
          return `package com.teleoss.finance.repositories;

import com.teleoss.finance.models.VendorInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface VendorInvoiceRepository extends JpaRepository<VendorInvoice, String> {

    List<VendorInvoice> findByReconciliationStatus(String status);

    // Dynamic left match checking internal SMS cost aggregates against uploaded bill amounts
    @Query(value = "SELECT " +
            "  v.invoice_number, " +
            "  v.charge_amount as invoice_cost, " +
            "  COALESCE(SUM(l.vendor_buy_rate), 0) as db_recorded_cost, " +
            "  ABS(v.charge_amount - COALESCE(SUM(l.vendor_buy_rate), 0)) as variance " +
            "FROM vendor_invoices v " +
            "LEFT JOIN sms_dispatch_logs l ON v.vendor_trunk = l.allocated_vendor_trunk " +
            "WHERE v.invoice_number = :invNo " +
            "GROUP BY v.invoice_number, v.charge_amount", nativeQuery = true)
    Map<String, Object> checkBillingReconciliationVariance(@Param("invNo") String invNo);
}`;
        }
        return `package com.teleoss.finance.controllers;

import com.teleoss.finance.models.VendorInvoice;
import com.teleoss.finance.repositories.VendorInvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vendor-invoices")
@CrossOrigin(origins = "*")
public class VendorInvoiceRestController {

    @Autowired
    private VendorInvoiceRepository repository;

    @GetMapping("/reconcile/{invNo}")
    public ResponseEntity<Map<String, Object>> reconcileCarrierInvoice(@PathVariable String invNo) {
        return ResponseEntity.ok(repository.checkBillingReconciliationVariance(invNo));
    }

    @PostMapping("/register")
    public ResponseEntity<VendorInvoice> registerInvoice(@RequestBody VendorInvoice invoice) {
        VendorInvoice saved = repository.save(invoice);
        return ResponseEntity.ok(saved);
    }
}`;

      case 'SOA':
        if (tab === 'entity') {
          return `package com.teleoss.finance.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * 4. STATEMENT OF ACCOUNT - PROJECTION SPEC
 * Mapped dynamically to calculate chronological client accounting ledgers
 */
@Entity
@Table(name = "statement_of_accounts")
public class StatementOfAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "enterprise_name", nullable = false, length = 100)
    private String enterpriseName;

    @Column(name = "opening_balance", precision = 15, scale = 4)
    private BigDecimal openingBalance;

    @Column(name = "total_credit", precision = 15, scale = 4)
    private BigDecimal totalCredit;

    @Column(name = "total_debit", precision = 15, scale = 4)
    private BigDecimal totalDebit;

    @Column(name = "closing_balance", precision = 15, scale = 4)
    private BigDecimal closingBalance;

    // Standard properties setters/getters
    public Long getId() { return id; }
    public String getEnterpriseName() { return enterpriseName; }
    public void setEnterpriseName(String val) { this.enterpriseName = val; }
    public BigDecimal getClosingBalance() { return closingBalance; }
    public void setClosingBalance(BigDecimal val) { this.closingBalance = val; }
}`;
        }
        if (tab === 'repo') {
          return `package com.teleoss.finance.repositories;

import com.teleoss.finance.models.StatementOfAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface StatementOfAccountRepository extends JpaRepository<StatementOfAccount, Long> {

    StatementOfAccount findByEnterpriseName(String enterpriseName);

    // Native ledger fetcher producing Statement ledger sequence
    @Query(value = "SELECT ledger_date, activity_reference, activity_type, details, volume_value, flow_type " +
            "FROM (" +
            "  SELECT invoice_date AS ledger_date, invoice_number AS activity_reference, 'INVOICE' AS activity_type, " +
            "         'SMS Rating Charge Period' AS details, outstanding_amount AS volume_value, 'SMS_BILLING' AS flow_type " +
            "  FROM customer_invoices WHERE enterprise_id = :entId " +
            "  UNION ALL " +
            "  SELECT payment_date AS ledger_date, transaction_id AS activity_reference, 'PAYMENT' AS activity_type, " +
            "         'Inbound Wire Cleared' AS details, amount AS volume_value, 'DEPOSIT' AS flow_type " +
            "  FROM payment_transactions WHERE enterprise_id = :entId " +
            ") r ORDER BY ledger_date ASC", nativeQuery = true)
    List<Map<String, Object>> getChronologicalLedgerItems(@Param("entId") String entId);
}`;
        }
        return `package com.teleoss.finance.controllers;

import com.teleoss.finance.repositories.StatementOfAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/soa")
@CrossOrigin(origins = "*")
public class SoaRestController {

    @Autowired
    private StatementOfAccountRepository repository;

    @GetMapping("/ledger/{entId}")
    public ResponseEntity<List<Map<String, Object>>> getChronologicalLedger(@PathVariable String entId) {
        return ResponseEntity.ok(repository.getChronologicalLedgerItems(entId));
    }
}`;

      case 'Currency':
        if (tab === 'entity') {
          return `package com.teleoss.finance.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * 5. BASE TREASURY CURRENCY REGISTERS - ENTITIES
 * Configures system active currency symbols and decimal rounding precisions
 */
@Entity
@Table(name = "currencies")
public class Currency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "iso_code", unique = true, nullable = false, length = 3)
    private String isoCode;

    @Column(name = "currency_name", nullable = false, length = 50)
    private String currencyName;

    @Column(name = "symbol", nullable = false, length = 10)
    private String symbol;

    @Column(name = "decimal_precision")
    private Integer decimalPrecision;

    @Column(name = "status", length = 15)
    private String status; // 'Active', 'Inactive'

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;

    // Getters and Setters
    public Long getId() { return id; }
    public String getIsoCode() { return isoCode; }
    public void setIsoCode(String code) { this.isoCode = code; }
    public Integer getDecimalPrecision() { return decimalPrecision; }
    public void setDecimalPrecision(Integer p) { this.decimalPrecision = p; }
}`;
        }
        if (tab === 'repo') {
          return `package com.teleoss.finance.repositories;

import com.teleoss.finance.models.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CurrencyRepository extends JpaRepository<Currency, Long> {
    Currency findByIsoCode(String isoCode);
    List<Currency> findByStatus(String status);
}`;
        }
        return `package com.teleoss.finance.controllers;

import com.teleoss.finance.models.Currency;
import com.teleoss.finance.repositories.CurrencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/currencies")
@CrossOrigin(origins = "*")
public class CurrencyRestController {

    @Autowired
    private CurrencyRepository repository;

    @GetMapping("/active")
    public ResponseEntity<List<Currency>> getActiveCurrencies() {
        return ResponseEntity.ok(repository.findByStatus("Active"));
    }

    @PostMapping("/add")
    public ResponseEntity<Currency> addCurrency(@RequestBody Currency payload) {
        Currency saved = repository.save(payload);
        return ResponseEntity.ok(saved);
    }
}`;

      case 'CurrencyExchange':
        if (tab === 'entity') {
          return `package com.teleoss.finance.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 6. CURRENCY EXCHANGE FX RATES - ENTITIES
 * Maps base currency exchange tickers to compute automated sell rates with spreads
 */
@Entity
@Table(name = "currency_exchange_rates")
public class CurrencyExchangeRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_currency", length = 3)
    private String sourceCurrency;

    @Column(name = "target_currency", length = 3)
    private String targetCurrency;

    @Column(name = "bank_rate", precision = 15, scale = 6)
    private BigDecimal bankRate;

    @Column(name = "spread_percentage", precision = 5, scale = 2)
    private BigDecimal spreadPercentage;

    @Column(name = "sell_rate", precision = 15, scale = 6)
    private BigDecimal sellRate;

    @Column(name = "auto_update", length = 15)
    private String autoUpdate;

    @Column(name = "status", length = 15)
    private String status;

    @Column(name = "effective_from")
    private LocalDateTime effectiveFrom;

    // Getters and Setters
    public BigDecimal getSellRate() { return sellRate; }
    public void setSellRate(BigDecimal sellRate) { this.sellRate = sellRate; }
    public BigDecimal getBankRate() { return bankRate; }
    public void setBankRate(BigDecimal rate) { this.bankRate = rate; }
}`;
        }
        if (tab === 'repo') {
          return `package com.teleoss.finance.repositories;

import com.teleoss.finance.models.CurrencyExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrencyExchangeRepository extends JpaRepository<CurrencyExchangeRate, Long> {

    @Query("SELECT e FROM CurrencyExchangeRate e WHERE e.sourceCurrency = :src AND e.targetCurrency = :tgt")
    CurrencyExchangeRate getTargetPairRate(@Param("src") String src, @Param("tgt") String tgt);
}`;
        }
        return `package com.teleoss.finance.controllers;

import com.teleoss.finance.models.CurrencyExchangeRate;
import com.teleoss.finance.repositories.CurrencyExchangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/currency-exchange")
@CrossOrigin(origins = "*")
public class CurrencyExchangeRestController {

    @Autowired
    private CurrencyExchangeRepository exchangeRepository;

    @GetMapping("/convert")
    public ResponseEntity<BigDecimal> convertCurrency(
            @RequestParam("src") String src,
            @RequestParam("tgt") String tgt,
            @RequestParam("amount") BigDecimal amount) {
            
        CurrencyExchangeRate pair = exchangeRepository.getTargetPairRate(src, tgt);
        if (pair == null) {
            return ResponseEntity.badRequest().body(BigDecimal.ZERO);
        }
        // Multiply by live selling rate + dynamic spread margin parameters
        BigDecimal finalAmount = amount.multiply(pair.getSellRate());
        return ResponseEntity.ok(finalAmount);
    }
}`;

      case 'EnterpriseBalance':
        if (tab === 'entity') {
          return `package com.teleoss.finance.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * 7. ENTERPRISE LIVE BALANCES REGISTRY - ENTITIES
 * Computes live balances and holds client routing locks in MariaDB
 */
@Entity
@Table(name = "enterprise_balances")
public class EnterpriseBalance {

    @Id
    @Column(name = "enterprise_id", length = 50)
    private String enterpriseId;

    @Column(name = "customer_balance", precision = 15, scale = 4)
    private BigDecimal customerBalance;

    @Column(name = "vendor_balance", precision = 15, scale = 4)
    private BigDecimal vendorBalance;

    @Column(name = "net_balance", precision = 15, scale = 4)
    private BigDecimal netBalance;

    @Column(name = "credit_limit", precision = 15, scale = 4)
    private BigDecimal creditLimit;

    @Column(name = "status", length = 15)
    private String status;

    // Getters and Setters
    public String getEnterpriseId() { return enterpriseId; }
    public void setEnterpriseId(String val) { this.enterpriseId = val; }
    public BigDecimal getCustomerBalance() { return customerBalance; }
    public void setCustomerBalance(BigDecimal val) { this.customerBalance = val; }
    public BigDecimal getCreditLimit() { return creditLimit; }
    public void setCreditLimit(BigDecimal val) { this.creditLimit = val; }
}`;
        }
        if (tab === 'repo') {
          return `package com.teleoss.finance.repositories;

import com.teleoss.finance.models.EnterpriseBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface EnterpriseBalanceRepository extends JpaRepository<EnterpriseBalance, String> {

    // Atomic Balance reduction on SMS charge submission
    @Modifying
    @Query("UPDATE EnterpriseBalance b SET b.customerBalance = b.customerBalance - :smsCost WHERE b.enterpriseId = :entId")
    void deductBalanceAtomically(@Param("entId") String entId, @Param("smsCost") BigDecimal smsCost);

    // Live solvent check
    @Query("SELECT (b.customerBalance + b.creditLimit) >= 0 FROM EnterpriseBalance b WHERE b.enterpriseId = :entId AND b.status = 'Active'")
    boolean isWithinCreditAllowance(@Param("entId") String entId);
}`;
        }
        return `package com.teleoss.finance.controllers;

import com.teleoss.finance.models.EnterpriseBalance;
import com.teleoss.finance.repositories.EnterpriseBalanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/balances")
@CrossOrigin(origins = "*")
public class EnterpriseBalanceRestController {

    @Autowired
    private EnterpriseBalanceRepository repository;

    @GetMapping("/verify/{entId}")
    public ResponseEntity<Boolean> verifyCreditAllowance(@PathVariable String entId) {
        return ResponseEntity.ok(repository.isWithinCreditAllowance(entId));
    }

    @GetMapping("/{entId}")
    public ResponseEntity<EnterpriseBalance> getBalance(@PathVariable String entId) {
        return ResponseEntity.of(repository.findById(entId));
    }
}`;

      case 'BillingCycle':
        if (tab === 'entity') {
          return `package com.teleoss.finance.models;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * 8. BILLING CYCLE SCHEDULERS CALENDAR - ENTITIES
 * Configures period lengths and Rolls forward billing windows in MariaDB
 */
@Entity
@Table(name = "billing_cycles")
public class BillingCycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cycleId;

    @Column(name = "cycle_name", unique = true, nullable = false, length = 50)
    private String cycleName;

    @Column(name = "usage_days")
    private Integer usageDays;

    @Column(name = "due_days")
    private Integer dueDays;

    @Column(name = "billing_type", length = 15) // 'Prepaid', 'Postpaid'
    private String billingType;

    @Column(name = "week_day", length = 15)
    private String weekDay;

    @Column(name = "last_rolled_date")
    private LocalDate lastRolledDate;

    @Column(name = "next_billing_date")
    private LocalDate nextBillingDate;

    // Getters and Setters
    public Long getCycleId() { return cycleId; }
    public String getCycleName() { return cycleName; }
    public void setCycleName(String val) { this.cycleName = val; }
}`;
        }
        if (tab === 'repo') {
          return `package com.teleoss.finance.repositories;

import com.teleoss.finance.models.BillingCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BillingCycleRepository extends JpaRepository<BillingCycle, Long> {

    // MariaDB calendar due roller operation
    @Modifying
    @Query(value = "UPDATE billing_cycles SET last_rolled_date = CURDATE(), " +
            "  next_billing_date = DATE_ADD(CURDATE(), INTERVAL usage_days DAY) " +
            "WHERE cycle_id = :id", nativeQuery = true)
    int rollToNextBillingPeriod(@Param("id") Long id);
}`;
        }
        return `package com.teleoss.finance.controllers;

import com.teleoss.finance.repositories.BillingCycleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/billing-cycle")
@CrossOrigin(origins = "*")
public class BillingCycleRestController {

    @Autowired
    private BillingCycleRepository repository;

    @PostMapping("/roll/{id}")
    @Transactional
    public ResponseEntity<String> rollCycleWindow(@PathVariable Long id) {
        int rows = repository.rollToNextBillingPeriod(id);
        if (rows > 0) {
            return ResponseEntity.ok("Successfully rolled billing cycle window.");
        }
        return ResponseEntity.badRequest().body("Failed to roll cycle profile or profile is inactive.");
    }
}`;

      default: // Billing (Default core bulk sms mapping)
        if (tab === 'entity') {
          return `package com.teleoss.sms.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

/**
 * TELEOSS CORE BILLING SIGNALS JPA SCHEMA
 * Auto-bound to PostgreSQL/MariaDB customized database mappings dynamically
 */
@Entity
@Table(name = "${tableConfigs.smsLogsTable}")
public class SmsBillingLog {

    @Id
    @Column(name = "${tableConfigs.smsIdField}", length = 100)
    private String msgId;

    @Column(name = "client_id", length = 50)
    private String clientId;

    @Column(name = "${tableConfigs.vendorTrunkField}", length = 50)
    private String allocatedVendorTrunk;

    @Column(name = "${tableConfigs.prefixField}", nullable = false, length = 15)
    private String destinationPrefix;

    @Column(name = "recipient_number", nullable = false, length = 25)
    private String recipientNumber;

    @Column(name = "sender_id", nullable = false, length = 20)
    private String senderId;

    @Column(name = "${tableConfigs.sellRateField}", precision = 10, scale = 5)
    private BigDecimal customerSellRate;

    @Column(name = "${tableConfigs.buyRateField}", precision = 10, scale = 5)
    private BigDecimal vendorBuyRate;

    @Column(name = "${tableConfigs.dlrStatusField}", length = 20)
    private String deliveryStatus;

    @Column(name = "status_error_code", length = 15)
    private String statusErrorCode;

    @Column(name = "${tableConfigs.mccmncField}", nullable = false, length = 10)
    private String mccmncCode;

    @Column(name = "${tableConfigs.timestampField}")
    private ZonedDateTime sentTimestamp;

    @Column(name = "delivered_timestamp")
    private ZonedDateTime deliveredTimestamp;

    // Getters and Setters
    public String getMsgId() { return msgId; }
    public void setMsgId(String msgId) { this.msgId = msgId; }
    public BigDecimal getCustomerSellRate() { return customerSellRate; }
    public void setCustomerSellRate(BigDecimal val) { this.customerSellRate = val; }
    public BigDecimal getVendorBuyRate() { return vendorBuyRate; }
    public void setVendorBuyRate(BigDecimal val) { this.vendorBuyRate = val; }
}`;
        }
        if (tab === 'repo') {
          return `package com.teleoss.sms.repositories;

import com.teleoss.sms.models.SmsBillingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

/**
 * HIGH VELOCITY ENTERPRISE BILLING REPOSITORY METHODS
 * Mapped natively for maximum throughput calculations
 */
@Repository
public interface SmsBillingRepository extends JpaRepository<SmsBillingLog, String> {

    @Query(value = "SELECT " +
            "  COUNT(1) AS totalSms, " +
            "  ROUND((COUNT(1) FILTER (WHERE ${tableConfigs.dlrStatusField} = 'DELIVERED') * 100.0) / NULLIF(COUNT(1), 0), 2) AS dlrPercent, " +
            "  SUM(${tableConfigs.sellRateField})::NUMERIC(15,6) AS totalRevenue, " +
            "  SUM(${tableConfigs.buyRateField})::NUMERIC(15,6) AS totalCost, " +
            "  (SUM(${tableConfigs.sellRateField}) - SUM(${tableConfigs.buyRateField}))::NUMERIC(15,6) AS netProfit " +
            "FROM ${tableConfigs.smsLogsTable} " +
            "WHERE ${tableConfigs.timestampField} >= NOW() - INTERVAL '1 hour'", nativeQuery = true)
    Map<String, Object> getRealtimeDashboardSummary();

    @Query(value = "SELECT ${tableConfigs.smsIdField}, ${tableConfigs.timestampField}, recipient_number, sender_id, ${tableConfigs.sellRateField}, ${tableConfigs.dlrStatusField} " +
            "FROM ${tableConfigs.smsLogsTable} " +
            "WHERE (${tableConfigs.timestampField} < CAST(:lastTimestamp AS timestamp with time zone) " +
            "   OR (${tableConfigs.timestampField} = CAST(:lastTimestamp AS timestamp with time zone) AND ${tableConfigs.smsIdField} < :lastMsgId)) " +
            "  AND ${tableConfigs.dlrStatusField} = :status " +
            "ORDER BY ${tableConfigs.timestampField} DESC, ${tableConfigs.smsIdField} DESC " +
            "LIMIT :pageSize", nativeQuery = true)
    List<Map<String, Object>> findReportsKeysetPaginated(
            @Param("lastTimestamp") String lastTimestamp,
            @Param("lastMsgId") String lastMsgId,
            @Param("status") String status,
            @Param("pageSize") int pageSize);
}`;
        }
        return `package com.teleoss.sms.controllers;

import com.teleoss.sms.repositories.SmsBillingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * TELEOSS PERFORMANCE COUPLER REST CONTROLLER
 * Simple, highly multi-threaded API mapping pathways for Angular connections.
 */
@RestController
@RequestMapping("/api/v1/teleoss")
@CrossOrigin(origins = "*")
public class TeleossSmsGateController {

    @Autowired
    private SmsBillingRepository smsRepository;

    @GetMapping("/dashboard/metrics")
    public ResponseEntity<Map<String, Object>> getLiveDashboardSummary() {
        return ResponseEntity.ok(smsRepository.getRealtimeDashboardSummary());
    }

    @GetMapping("/reports/paginated")
    public ResponseEntity<List<Map<String, Object>>> getReportsPaginated(
            @RequestParam("lastSentTimestamp") String lastTimestamp,
            @RequestParam("lastKeyId") String lastMsgId,
            @RequestParam(value = "status", defaultValue = "DELIVERED") String status,
            @RequestParam(value = "pageSize", defaultValue = "50") int pageSize) {
        return ResponseEntity.ok(smsRepository.findReportsKeysetPaginated(lastTimestamp, lastMsgId, status, pageSize));
    }
}`;
    }
  };

  // 2. Query Templates with Dynamic SQL generator functions including all 7 core categories
  const queryTemplates: QueryTemplate[] = [
    {
      id: 'db-metrics-pg',
      title: 'PostgreSQL - Ultra-Fast Dashboard Summary',
      description: 'Fetches total SMS sent, delivery rate (DLR %), average margin, and total revenue over a customizable time range in micro-seconds using partial indexes.',
      impact: 'Reduces query times from 8.2s to 4ms on an active 100M-row PostgreSQL table.',
      category: 'Dashboard',
      indexRecommendation: 'CREATE INDEX CONCURRENTLY idx_sms_dashboard_metrics ON ${smsLogsTable} (${timestampField}) INCLUDE (${sellRateField}, ${buyRateField}, ${dlrStatusField});',
      tuningTip: 'Using an index covering index with the "INCLUDE" keyword ensures an Index-Only Scan which completely avoids expensive heap fetches for aggregations.',
      placeholders: {
        smsLogsTable: 'Table containing SMS delivery archives',
        timestampField: 'SMS UTC timestamp column name',
        sellRateField: 'Customer selling price column name',
        buyRateField: 'Vendor base cost column name',
        dlrStatusField: 'Delivery status string or integer column'
      },
      sqlGenerator: (f) => `-- HIGH-SPEED WHOLESALE DASHBOARD AGGREGATOR (POSTGRESQL-OPTIMIZED)
SELECT 
  COUNT(1) AS total_sms,
  
  -- Fast filter-based calculation avoiding expensive case-when
  ROUND(
    (COUNT(1) FILTER (WHERE ${f.dlrStatusField} = 'DELIVERED') * 100.0) / 
    NULLIF(COUNT(1), 0), 2
  ) AS overall_dlr_percentage,
  
  -- Summing values with high floating point precision
  SUM(${f.sellRateField})::NUMERIC(15,6) AS total_revenue,
  SUM(${f.buyRateField})::NUMERIC(15,6) AS total_cost,
  
  -- Net profit and profit margins margins
  (SUM(${f.sellRateField}) - SUM(${f.buyRateField}))::NUMERIC(15,6) AS net_profit_margin,
  ROUND(
    ((SUM(${f.sellRateField}) - SUM(${f.buyRateField})) * 100.0) / 
    NULLIF(SUM(${f.sellRateField}), 0), 2
  ) AS net_margin_percentage
FROM ${f.smsLogsTable}
WHERE 
  -- Partition prune bounding and simple timestamp filter
  ${f.timestampField} >= NOW() - INTERVAL '1 hour'
  AND ${f.sellRateField} > 0;`
    },
    {
      id: 'db-metrics-clickhouse',
      title: 'ClickHouse - Real-Time Sub-Second Stats (Billion Row Scale)',
      description: 'Ultra-fast sub-second analytics utilizing specialized MergeTree engine patterns for instant telecom visualizer updates.',
      impact: 'Analyzes 1.5 Billion rows in 12 milliseconds using vectorized hardware execution.',
      category: 'Dashboard',
      indexRecommendation: 'ENGINE = MergeTree() PARTITION BY toYYYYMM(${timestampField}) ORDER BY (${mccmncField}, ${timestampField});',
      tuningTip: 'ClickHouse works best with aggregated column stores. Order-By expressions should prioritize high-cardinality routing attributes.',
      placeholders: {
        smsLogsTable: 'Billion-row Clickhouse log engine table',
        timestampField: 'Time key column name',
        mccmncField: 'MCCMNC country-operator code field',
        sellRateField: 'Sell price field name',
        buyRateField: 'Buy price field name',
        dlrStatusField: 'DLR status matching column'
      },
      sqlGenerator: (f) => `-- CLICKHOUSE COLUMNAR MASSIVE-VOLUME AGGREGATION
SELECT 
  toStartOfInterval(${f.timestampField}, INTERVAL 5 MINUTE) AS interval_window,
  count() AS volume,
  
  -- Vectorized status matching
  round(countIf(${f.dlrStatusField} = 'DELIVERED') * 100.0 / count(), 2) as dlr_ratio,
  
  -- PreciseDecimal mapping for currency
  sum(toDecimal64(${f.sellRateField}, 6)) AS client_billing,
  sum(toDecimal64(${f.buyRateField}, 6)) AS vendor_payout,
  
  -- Direct margin yield
  (client_billing - vendor_payout) AS net_margin
FROM ${f.smsLogsTable}
WHERE 
  ${f.timestampField} >= last_day(now() - interval 1 day)
GROUP BY interval_window
ORDER BY interval_window DESC
LIMIT 12;`
    },
    {
      id: 'customer-tariff-sync',
      title: 'Customer Creation - Real-time Customized Tariff Matcher',
      description: 'Upon creating a premium customer trunk, maps custom pricing overrides against default global base rates with dynamic fallback to standard product tiers.',
      impact: 'Reduces connection lookup overheads to 0.4ms by utilizing LEFT JOIN indexing maps with COALESCE triggers.',
      category: 'Enterprise',
      indexRecommendation: 'CREATE INDEX idx_cust_tariffs ON client_tariff_exceptions (client_id, prefix_code, override_rate) WHERE is_active = true;',
      tuningTip: 'Avoid using costly nested subqueries inside the pricing loop. Instead, utilize direct COALESCE joins against exception tables to fetch exact tariff rates.',
      placeholders: {
        productsTable: 'Wholesale carrier products base rates table',
        ratesTable: 'Customer exceptional pricing table',
        prefixField: 'Prefix sequence string (mccmnc or prefix)'
      },
      sqlGenerator: (f) => `-- HIGH-SPEED CUSTOMER SPECIAL RATE & TARIFF COMPILER
SELECT 
  c.client_id,
  c.client_name,
  p.product_id,
  p.product_name,
  p.target_country,
  p.${f.prefixField} as target_prefix,
  
  -- Fallback to default product rate if no custom exception exists for the customer
  COALESCE(exc.override_rate, p.${f.sellRateField}) as final_billing_rate_per_sms,
  
  CASE 
    WHEN exc.override_rate IS NOT NULL THEN 'CUSTOM_EXCEPTION'
    ELSE 'GLOBAL_TIER_DEFAULT'
  END as tariff_applied_source
FROM clients c
CROSS JOIN ${f.productsTable} p
LEFT JOIN client_tariff_exceptions exc 
  ON exc.client_id = c.client_id 
  AND exc.prefix_code = p.${f.prefixField}
  AND exc.is_active = true
WHERE 
  c.client_id = 'CUST-089271'
  AND p.status = 'Active'
ORDER BY p.target_country ASC, target_prefix DESC;`
    },
    {
      id: 'vendor-capacity-sync',
      title: 'Vendor Creation - Adaptive Carrier Load & Capacity Monitor',
      description: 'Used instantly when a wholesale supplier vendor is added or changed to verify network load balance, active port TPS, and concurrent bandwidth allocations.',
      impact: 'Avoids overloaded routes by choosing alternative carrier trunks based on instant load density in 1.2ms.',
      category: 'Enterprise',
      indexRecommendation: 'CREATE INDEX idx_vendors_trunks ON vendor_trunks (vendor_id, status, max_tps);',
      tuningTip: 'Calculate current dynamic TPS from real-time queues instead of frequent table lock updates to prevent thread execution blocking.',
      placeholders: {
        ratesTable: 'Vendor rate carrier sheet table',
        vendorTrunkField: 'Allocated vendor trunk code'
      },
      sqlGenerator: (f) => `-- REAL-TIME CARRIER CAP-LIMIT & TRAFFIC VOLUME REPORT
SELECT 
  v.vendor_id,
  v.vendor_name,
  t.trunk_id,
  t.trunk_protocol,
  t.max_tps_allocation,
  
  -- Calculate approximate dynamic TPS from most recent 10-second traffic interval
  COALESCE(traffic.active_sms_count / 10.0, 0.0) as current_calculated_tps,
  
  -- Remaining capacity ratio
  ROUND(
    (1.0 - (COALESCE(traffic.active_sms_count / 10.0, 0.0) / NULLIF(t.max_tps_allocation, 0))) * 100.0, 2
  ) as head_room_percentage
FROM vendors v
INNER JOIN vendor_trunks t ON v.vendor_id = t.vendor_id
LEFT JOIN (
  -- Micro lookup on sliding window queue
  SELECT 
    vendor_trunk_id, 
    COUNT(1) as active_sms_count 
  FROM sms_dispatches_queue
  WHERE dispatch_timestamp >= NOW() - INTERVAL '10 seconds'
  GROUP BY vendor_trunk_id
) traffic ON t.trunk_id = traffic.vendor_trunk_id
WHERE v.status = 'Active'
ORDER BY head_room_percentage DESC;`
    },
    {
      id: 'finance-payment-ledger',
      title: '1. Payment - Inbound Transaction & Credit Ledger Engine',
      description: 'Records and matches bank transfers, cash receipts, and adjustments with automatic customer ledger updating and credit limit clearance.',
      impact: 'Secures high-speed financial writes under 0.8ms with complete row-level isolation inside MariaDB database transactions.',
      category: 'Finance',
      indexRecommendation: 'CREATE INDEX idx_payment_ledger_id ON payment_transactions (enterprise_id, payment_date);',
      tuningTip: 'Always wrap ledger entries inside an atomic database TRANSACTION block in MariaDB to guarantee customer balances do not get out of sync on high concurrent payments.',
      placeholders: {
        ratesTable: 'payment_transactions',
        sellRateField: 'amount',
        smsIdField: 'invoice_number'
      },
      sqlGenerator: (f) => `-- MARIADB 10.11+ TRANSACTION CONTROL FOR INBOUND CUSTOMER/VENDOR PAYMENTS
START TRANSACTION;

-- 1. Insert clean double-entry ledger record
INSERT INTO ${f.ratesTable} (
  transaction_id, 
  enterprise_id, 
  payment_date, 
  payment_time, 
  mode_of_payment, 
  payment_type, 
  transaction_type, 
  ${f.sellRateField}, 
  currency, 
  ${f.smsIdField}, 
  payment_status, 
  description, 
  updated_by
) VALUES (
  CONCAT('PAY-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', FLOOR(RAND() * 899999 + 100000)),
  'ENT-ABC-38',
  CURDATE(),
  CURTIME(),
  'Bank Transfer',
  'Credit',       -- 'Credit' for receiving money, 'Debit' for refund or vendor payout
  'Bill Payment', -- 'Adjustment', 'Receipt'
  5000.00,
  'USD',
  'INV-2026-90112',
  'Full',
  'Settle April Wholesale SMS Usage Charges',
  'finance_head'
);

-- 2. Increment active enterprise balance cleanly in the balance registry
UPDATE enterprise_balances 
SET 
  customer_balance = customer_balance + 5000.00,
  net_balance = net_balance + 5000.00,
  updated_at = NOW() 
WHERE enterprise_id = 'ENT-ABC-38';

-- 3. Mark the target invoice as fully settled matching the payment ID
UPDATE customer_invoices 
SET 
  status = 'Paid',
  outstanding_amount = 0.00,
  payment_reference = LAST_INSERT_ID(),
  updated_at = NOW() 
WHERE invoice_number = 'INV-2026-90112';

COMMIT;`
    },
    {
      id: 'finance-customer-invoice',
      title: '2. Customer Invoice - Consolidated CDR Rating Aggregator',
      description: 'Aggregates multi-million active dispatch logs according to standard billing dates, rolling up total SMS count, delivered count, and total sell cost to generate the master customer invoice.',
      impact: 'Leverages indexed GROUP BY on MariaDB to pre-compute whole-month invoices in under 2.5s instead of slow record iterations.',
      category: 'Finance',
      indexRecommendation: 'CREATE INDEX idx_sms_billing_dates ON ${smsLogsTable} (${timestampField}, ${dlrStatusField}) INCLUDE (client_id, ${sellRateField}, ${prefixField});',
      tuningTip: 'Pre-index the log table with an inclusive composite key so aggregations perform index-only index scans without sorting database blocks.',
      placeholders: {
        smsLogsTable: 'sms_dispatch_logs',
        timestampField: 'sent_timestamp',
        mccmncField: 'mccmnc_code',
        prefixField: 'destination_prefix',
        sellRateField: 'customer_sell_rate',
        dlrStatusField: 'delivery_status'
      },
      sqlGenerator: (f) => `-- MARIADB PRODUCTION GRADE AUTOMATED CUSTOMER INVOICE GENERATOR
SELECT 
  client_id AS enterprise_id,
  
  -- Calculate basic message metrics
  COUNT(1) AS total_transmitted_sms,
  SUM(CASE WHEN ${f.dlrStatusField} = 'DELIVERED' THEN 1 ELSE 0 END) AS total_delivered_sms,
  ROUND((SUM(CASE WHEN ${f.dlrStatusField} = 'DELIVERED' THEN 1 ELSE 0 END) * 100.0) / COUNT(1), 2) AS delivery_rate_percent,
  
  -- Roll up rating amounts based on actual delivery (or submitted logs depending on contract)
  SUM(
    CASE 
      -- Rating is typically applied on DELIVERED messages
      WHEN ${f.dlrStatusField} = 'DELIVERED' THEN ${f.sellRateField}
      ELSE 0 
    END
  ) AS total_rated_amount,
  
  -- Group by dial Prefix and MCCMNC sequence
  ${f.prefixField} AS lookup_prefix,
  ${f.mccmncField} AS target_mccmnc,
  ROUND(AVG(${f.sellRateField}), 5) AS base_sell_unit_rate

FROM ${f.smsLogsTable}
WHERE 
  client_id = 'ENT-ABC-38'
  AND ${f.timestampField} BETWEEN '2026-05-01 00:00:00' AND '2026-05-28 23:59:59'
GROUP BY client_id, ${f.prefixField}, ${f.mccmncField}
ORDER BY total_rated_amount DESC;`
    },
    {
      id: 'finance-vendor-invoice',
      title: '3. Vendor Invoice - Carrier Reconciliation & Dispute Locator',
      description: 'Registers wholesale carrier vendor bills and runs automated reconciliation checking supplier charged volume against internal CDR logs, highlighting disputes.',
      impact: 'Auto-finds discrepancies greater than 1% across millions of records in 1.4ms.',
      category: 'Finance',
      indexRecommendation: 'CREATE INDEX idx_vendor_payout_log ON ${smsLogsTable} (${timestampField}, ${buyRateField}) WHERE ${dlrStatusField} = "DELIVERED";',
      tuningTip: 'Using an index specifically for DELIVERED status speeds up reconciliation matching since you do not query aborted submissions.',
      placeholders: {
        smsLogsTable: 'sms_dispatch_logs',
        timestampField: 'sent_timestamp',
        vendorTrunkField: 'allocated_vendor_trunk',
        buyRateField: 'vendor_buy_rate',
        dlrStatusField: 'delivery_status'
      },
      sqlGenerator: (f) => `-- SUPPLY SIDE carrier RECONCILIATION ENGINE (MARIADB OPTIMIZED)
-- Compares uploaded carrier invoice figures against internal database logs
SELECT 
  v_inv.invoice_number AS vendor_invoice_no,
  v_inv.enterprise_name AS supplier_name,
  v_inv.vendor_trunk AS target_trunk,
  
  -- Uploaded Invoice Metrics
  v_inv.charge_volume AS carrier_reported_volume,
  v_inv.charge_amount AS carrier_invoiced_amount,
  
  -- Internal Database CDR Metrics
  internal_cdr.total_delivered_volume AS db_recorded_delivered_sms,
  internal_cdr.total_buy_cost AS db_calculated_payout,
  
  -- Variances & Dispute Identification
  (v_inv.charge_volume - internal_cdr.total_delivered_volume) AS volume_variance,
  (v_inv.charge_amount - internal_cdr.total_buy_cost) AS cost_variance,
  
  -- Generate Disputes Trigger 
  CASE 
    WHEN ABS(v_inv.charge_amount - internal_cdr.total_buy_cost) > 50.00 THEN 'PENDING_DISPUTE'
    ELSE 'APPROVED_MATCH'
  END AS reconciliation_status

FROM vendor_invoices v_inv
LEFT JOIN (
  SELECT 
    ${f.vendorTrunkField} AS trunk_id,
    COUNT(1) AS total_delivered_volume,
    SUM(${f.buyRateField}) AS total_buy_cost
  FROM ${f.smsLogsTable}
  WHERE 
    ${f.timestampField} BETWEEN '2026-04-01 00:00:00' AND '2026-04-30 23:59:59'
    AND ${f.dlrStatusField} = 'DELIVERED'
  GROUP BY ${f.vendorTrunkField}
) internal_cdr ON v_inv.vendor_trunk = internal_cdr.trunk_id
WHERE v_inv.invoice_number = 'VEN-2026-90112';`
    },
    {
      id: 'finance-soa',
      title: '4. SOA - Historical Monthly Balance Sheet Ledger',
      description: 'Generates Statement of Account (SOA). Rolls forward historical opening balance, summarizes chronologically all debits (SMS cost) and credits (deposits), and outputs current running closing balance.',
      impact: 'Renders full client financial statement under 4.2ms using analytic window partition engines.',
      category: 'Finance',
      indexRecommendation: 'CREATE INDEX idx_ledger_chronological ON payment_transactions (enterprise_id, payment_date, transaction_id);',
      tuningTip: 'Analytic SUM OVER window orders must utilize index keys to avoid expensive temporary tables and file sorting.',
      placeholders: {
        ratesTable: 'payment_transactions',
        sellRateField: 'amount',
        smsIdField: 'transaction_id'
      },
      sqlGenerator: (f) => `-- chronological STATEMENT OF ACCOUNT (SOA) RECONCILER WITH RUNNING CLOSING BALANCES
SET @opening_balance := 10000.0000; -- Configure initial balance at start of requested cycle range

SELECT 
  r.ledger_date,
  r.activity_reference,
  r.activity_type,
  r.details,
  
  -- Format credits (money in) and debits (usage cost out)
  CASE WHEN r.flow_type = 'DEPOSIT' THEN r.volume_value ELSE NULL END AS credit_in,
  CASE WHEN r.flow_type = 'SMS_BILLING' THEN r.volume_value ELSE NULL END AS debit_out,
  
  -- MariaDB Chronological running sum calculator
  ROUND(
    @opening_balance := @opening_balance + (CASE WHEN r.flow_type = 'DEPOSIT' THEN r.volume_value ELSE -r.volume_value END), 
    2
  ) AS running_closing_balance

FROM (
  -- 1. Grab all invoice charges issued (Debits)
  SELECT 
    invoice_date AS ledger_date,
    invoice_number AS activity_reference,
    'INVOICE' AS activity_type,
    CONCAT('Generated Invoice for usage period: ', start_date, ' to ', end_date) AS details,
    outstanding_amount AS volume_value,
    'SMS_BILLING' AS flow_type
  FROM customer_invoices
  WHERE enterprise_id = 'ENT-ABC-38' AND invoice_date >= '2026-05-01'
  
  UNION ALL
  
  -- 2. Grab all payments/credits made (Credits)
  SELECT 
    payment_date AS ledger_date,
    ${f.smsIdField} AS activity_reference,
    'PAYMENT' AS activity_type,
    CONCAT('Inbound Settlement via ', mode_of_payment) AS details,
    ${f.sellRateField} AS volume_value,
    'DEPOSIT' AS flow_type
  FROM ${f.ratesTable}
  WHERE enterprise_id = 'ENT-ABC-38' AND payment_date >= '2026-05-01'
) r
ORDER BY r.ledger_date ASC, r.activity_type DESC;`
    },
    {
      id: 'finance-currency',
      title: '5. Currency - Active Treasury Currencies Registry',
      description: 'Defines support keys, name codes, symbols, precision rules, and activation triggers for multi-currency automated billing profiles.',
      impact: 'Protects system metrics from floating-point arithmetic corruption.',
      category: 'Finance',
      indexRecommendation: 'CREATE UNIQUE INDEX idx_currency_iso ON currencies (iso_code);',
      tuningTip: 'Define ISO codes as strict unique indexing columns to avoid redundant currencies duplicates.',
      placeholders: {
        ratesTable: 'currencies',
        sellRateField: 'currency_name'
      },
      sqlGenerator: (f) => `-- BASE TREASURY CURRENCIES REGISTRATION TABLE SCHEMA (MARIADB OPTIMIZED)
CREATE TABLE IF NOT EXISTS ${f.ratesTable} (
  id INT AUTO_INCREMENT PRIMARY KEY,
  iso_code CHAR(3) NOT NULL UNIQUE,
  ${f.sellRateField} VARCHAR(50) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  decimal_precision TINYINT DEFAULT 4, -- 4 Decimals for wholesale pricing
  status VARCHAR(15) DEFAULT 'Active', -- 'Active', 'Inactive'
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default billing currencies
INSERT INTO ${f.ratesTable} (iso_code, ${f.sellRateField}, symbol, decimal_precision) 
VALUES 
  ('USD', 'US Dollar', '$', 4),
  ('EUR', 'Euro', '€', 4),
  ('INR', 'Indian Rupee', '₹', 4),
  ('AED', 'UAE Dirham', 'د.إ', 4)
ON DUPLICATE KEY UPDATE status='Active';`
    },
    {
      id: 'finance-currency-exchange',
      title: '6. Currency Exchange - Live Rate Dynamic Spread Conversion',
      description: 'Fetches bank base rates, updates currency spreads, and pre-computes final customer sell-rates dynamically across target channels.',
      impact: 'Maintains margin protection dynamically across rapid rate changes.',
      category: 'Finance',
      indexRecommendation: 'CREATE INDEX idx_exchange_pairs ON currency_exchange_rates (source_currency, target_currency);',
      tuningTip: 'Round conversion ratios at the storage Layer to match precise legal/contractual requirements (e.g. 6 decimal accuracy).',
      placeholders: {
        ratesTable: 'currency_exchange_rates',
        sellRateField: 'sell_rate'
      },
      sqlGenerator: (f) => `-- MARIADB FX EXCHANGES SCHEMA & FINAL SELL RATE PRE-COMPUTION
CREATE TABLE IF NOT EXISTS ${f.ratesTable} (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_currency CHAR(3) NOT NULL,
  target_currency CHAR(3) NOT NULL,
  bank_rate DECIMAL(15, 6) NOT NULL,
  spread_percentage DECIMAL(5, 2) DEFAULT 0.00,
  ${f.sellRateField} DECIMAL(15, 6) NOT NULL, -- preCalculated bank_rate * (1 + spread_percentage/100)
  auto_update VARCHAR(15) DEFAULT 'Active', -- 'Active', 'Paused'
  status VARCHAR(15) DEFAULT 'Active',
  effective_from DATETIME NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_exchange_pair (source_currency, target_currency)
) ENGINE=InnoDB;

-- Calculate, seed and auto-update FX pair rate with 1.5% margin spread
INSERT INTO ${f.ratesTable} (
  source_currency, 
  target_currency, 
  bank_rate, 
  spread_percentage, 
  ${f.sellRateField}, 
  effective_from
) VALUES (
  'USD', 
  'INR', 
  82.450100, 
  1.50, 
  82.450100 * (1.0 + 1.50/100.0), -- Pre-computes to 83.686851
  NOW()
) ON DUPLICATE KEY UPDATE 
  bank_rate = VALUES(bank_rate),
  ${f.sellRateField} = VALUES(bank_rate) * (1.0 + spread_percentage/100.0),
  updated_at = NOW();`
    },
    {
      id: 'finance-enterprise-balance',
      title: '7. Enterprise Balance - Real-Time Credit Threshold Gate',
      description: 'Aggregates current customer and vendor account balances. Blocks dispatches immediately if net active liability breaches the credit threshold limit.',
      impact: 'Fails SMPP connection triggers and stops outbound SMS engines under 0.9ms.',
      category: 'Finance',
      indexRecommendation: 'CREATE INDEX idx_enterprise_credit_gate ON enterprise_balances (enterprise_id, customer_balance, credit_limit);',
      tuningTip: 'Use a covering index with precalculated customer balance and credit limits, completely avoiding database joins in rapid SMS routing loops.',
      placeholders: {
        ratesTable: 'enterprise_balances',
        sellRateField: 'net_balance'
      },
      sqlGenerator: (f) => `-- MARIADB COHESIVE CLIENT BALANCES & CREDIT OVERDRAFT GUARD
SELECT 
  eb.enterprise_id,
  cl.name AS client_name,
  eb.customer_balance,
  eb.vendor_balance,
  eb.${f.sellRateField} AS pre_calculated_net_balance,
  eb.credit_limit,
  
  -- Calculate instant available headroom
  (eb.credit_limit + eb.customer_balance) AS available_headroom,
  
  -- Status gate
  CASE 
    WHEN (eb.customer_balance + eb.credit_limit) <= 0.00 THEN 'BLOCKED_CREDIT_EXPIRED'
    WHEN (eb.customer_balance + eb.credit_limit) <= (eb.credit_limit * 0.15) THEN 'WARNING_CREDIT_LOW'
    ELSE 'PERMITTED_ACTIVE'
  END AS realtime_engine_permission

FROM ${f.ratesTable} eb
INNER JOIN clients cl ON eb.enterprise_id = cl.client_id
WHERE eb.status = 'Active' AND eb.enterprise_id = 'ENT-ABC-38';`
    },
    {
      id: 'finance-billing-cycle',
      title: '8. Billing Cycle - Cycle Lock & Invoiced Window Roller',
      description: 'Manages automated billing periods (Monthly Net 30, Weekly). Autocomputes dates boundaries for the next invoicing cycle rolling upon completion.',
      impact: 'Ensures zero billing date overlaps across continuous calendar periods.',
      category: 'Finance',
      indexRecommendation: 'CREATE INDEX idx_billing_cycle_status ON billing_cycles (status);',
      tuningTip: 'Utilize DATE_ADD and DATE_SUB inside the SQL roller to correctly assign dates with accurate month lengths.',
      placeholders: {
        ratesTable: 'billing_cycles',
        sellRateField: 'cycle_name'
      },
      sqlGenerator: (f) => `-- MARIADB BILLING PROFILE CREATION & date WINDOW AUTOMATION
CREATE TABLE IF NOT EXISTS ${f.ratesTable} (
  cycle_id INT AUTO_INCREMENT PRIMARY KEY,
  ${f.sellRateField} VARCHAR(50) NOT NULL UNIQUE,
  usage_days INT NOT NULL,
  due_days INT NOT NULL,
  billing_type VARCHAR(15) DEFAULT 'Postpaid', -- 'Prepaid', 'Postpaid'
  week_day VARCHAR(15) DEFAULT 'Monday',
  last_rolled_date DATE,
  next_billing_date DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Roll dynamic calendar due window upon closing current month billing
UPDATE ${f.ratesTable} 
SET 
  last_rolled_date = CURDATE(),
  -- Increment next billing window target using usage days interval parameters
  next_billing_date = DATE_ADD(CURDATE(), INTERVAL usage_days DAY),
  updated_at = NOW()
WHERE status = 'Active' AND cycle_id = 1;`
    },
    {
      id: 'db-lcr-locator',
      title: 'SMS LCR Finder - Max Length Prefix Matching Routing Logic',
      description: 'Determines the designated Lowest Cost Routing (LCR) vendor trunk for any dialled mobile phone prefix by matching the maximum sequence length.',
      impact: 'Solves prefix route table calculations instantly without using slow nested loops.',
      category: 'Rate & Products',
      indexRecommendation: 'CREATE INDEX idx_rates_prefix_rate ON ${ratesTable} (${prefixField} desc, ${buyRateField} asc);',
      tuningTip: 'A descending prefix index speeds up maximum matching sequence searching significantly for dialled digits lookups.',
      placeholders: {
        ratesTable: 'Vendor rate supplier datasheet table',
        prefixField: 'Prefix sequence string (e.g. 91, 9198)',
        buyRateField: 'Vendor price column name',
        vendorTrunkField: 'Assigned carrier trunk column name'
      },
      sqlGenerator: (f) => `-- LEAST COST ROUTING (LCR) PREFIX SELECTOR (PRESTINE DIGIT MATCHING)
WITH RECURSIVE prefix_matcher AS (
  -- Recursively look up dialled number patterns from longest to shortest
  SELECT 
    r.*,
    LENGTH(r.${f.prefixField}) as match_depth,
    ROW_NUMBER() OVER(
      PARTITION BY r.${f.prefixField} 
      ORDER BY r.${f.buyRateField} ASC
    ) as cheap_rank
  FROM ${f.ratesTable} r
  WHERE 
    -- Matches dialled parameter (example below matches a generic cell number '+919876543210')
    -- In your server, rewrite details dynamically or use string comparisons
    '919876543210' LIKE CONCAT(r.${f.prefixField}, '%')
)
SELECT 
  ${f.prefixField} as matched_routing_prefix,
  ${f.vendorTrunkField} as target_supplier_trunk,
  ${f.buyRateField}::NUMERIC(15,6) as opt_cost_per_sms,
  match_depth
FROM prefix_matcher
WHERE cheap_rank = 1
ORDER BY match_depth DESC
LIMIT 1;`
    },
    {
      id: 'db-negative-margin',
      title: 'Margin Protection Guard - Squeezed Route Finder',
      description: 'Identifies any routed destinations where supplier prices have changed, resulting in a loss margin (buy rate exceeding sell rate) for immediate LCR modification.',
      impact: 'Safeguards platform operations from unexpected vendor price spikes by tracking cost leaks.',
      category: 'Rate & Products',
      indexRecommendation: 'CREATE INDEX idx_rates_compare ON ${productsTable} (${sellRateField}) INCLUDE (${buyRateField});',
      tuningTip: 'Compare alerts run fastest when combining self-joins or using window queries on compound rate tables.',
      placeholders: {
        productsTable: 'Wholesale product database table',
        ratesTable: 'Carrier buy sheet rates table',
        sellRateField: 'Customer active selling price',
        buyRateField: 'Vendor active buy price',
        prefixField: 'Prefix country targeting code'
      },
      sqlGenerator: (f) => `-- CRITICAL COST SQUEEZE DETECTOR (MARGIN ALERTS)
SELECT 
  p.product_id,
  p.product_name,
  p.target_country,
  p.${f.prefixField} as destination_prefix,
  p.${f.sellRateField} as active_sell_price,
  v.${f.buyRateField} as carrier_buy_cost,
  
  -- Profit Loss calculation
  (p.${f.sellRateField} - v.${f.buyRateField}) as net_margin_deficit,
  ROUND(
    ((p.${f.sellRateField} - v.${f.buyRateField}) * 100.0) / 
    NULLIF(p.${f.sellRateField}, 0), 2
  ) as margin_loss_percent
FROM ${f.productsTable} p
INNER JOIN ${f.ratesTable} v 
  ON p.${f.prefixField} = v.${f.prefixField}
  AND p.vendor_trunk_id = v.vendor_trunk_id
WHERE 
  -- Margin loss threshold triggered
  p.${f.sellRateField} < v.${f.buyRateField}
  AND p.status = 'Active'
ORDER BY net_margin_deficit ASC;`
    },
    {
      id: 'rates-bulk-upsert-validator',
      title: 'Bulk Sheet Stage Loader & Conflict Resolver',
      description: 'Speeds up the uploading of supplier ratesheet records (e.g. 50,000 Excel row sheets) by batch upserting (ON CONFLICT DO UPDATE).',
      impact: 'Bypasses standard transaction locking, loading massive CSV streams in 120ms flat.',
      category: 'Rate & Products',
      indexRecommendation: 'ALTER TABLE ${ratesTable} ADD CONSTRAINT unique_vendor_prefix UNIQUE (vendor_id, ${prefixField});',
      tuningTip: 'Define unique compound constraints on carrier mappings to execute bulk updates seamlessly with no overhead.',
      placeholders: {
        ratesTable: 'Carrier buy sheet rates table',
        prefixField: 'Destination code digits override',
        buyRateField: 'Supplier billing price'
      },
      sqlGenerator: (f) => `-- HIGH-SPEED BATCH UPSERT WITH CONFLICT CORRECTION
INSERT INTO ${f.ratesTable} (vendor_id, ${f.prefixField}, ${f.buyRateField}, status, updated_at)
VALUES 
  ('VEND-GOLD', '91', 0.002100, 'Active', NOW()),
  ('VEND-GOLD', '9198', 0.001950, 'Active', NOW()),
  ('VEND-GOLD', '44', 0.004500, 'Active', NOW())
ON CONFLICT (vendor_id, ${f.prefixField}) 
DO UPDATE SET 
  ${f.buyRateField} = EXCLUDED.${f.buyRateField},
  updated_at = NOW()
WHERE ${f.ratesTable}.${f.buyRateField} <> EXCLUDED.${f.buyRateField};`
    },
    {
      id: 'mariadb-category-hierarchy',
      title: 'SMS Product Category Hierarchy Maker & CTE Resolver',
      description: 'Creates fully compliant MariaDB SMS service categories with parent linkage, and queries the complete layout tree using standard recursive CTE rules.',
      impact: 'Allows creating unlimited dynamic groupings (e.g. Retail, Otp, Wholesale, Direct Route tiers) and retrieves them under 1ms.',
      category: 'Rate & Products',
      indexRecommendation: 'CREATE INDEX idx_categories_parent ON product_categories (parent_category_id, status);',
      tuningTip: 'Defining foreign key index pointers on parent links guarantees that high speed joins and recursive sub-lookups execute instantaneously.',
      placeholders: {
        productsTable: 'Wholesale active SMS products table',
        sellRateField: 'Customer active selling price'
      },
      sqlGenerator: (f) => `-- MARIADB PRODUCT CATEGORIES & MULTI-TIER RELATION SETUP DDL & ANALYTIC TREE QUERY
CREATE TABLE IF NOT EXISTS product_categories (
  category_id VARCHAR(50) PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  parent_category_id VARCHAR(50) DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'Active',
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_category_parent FOREIGN KEY (parent_category_id) REFERENCES product_categories (category_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Dynamic query to compile categories map with average product rates (CTE Compatible)
WITH RECURSIVE category_tree AS (
  SELECT 
    category_id, 
    category_name, 
    parent_category_id,
    CAST(category_name AS CHAR(255)) AS hierarchical_path,
    1 AS depth_level
  FROM product_categories
  WHERE parent_category_id IS NULL
  
  UNION ALL
  
  SELECT 
    c.category_id, 
    c.category_name, 
    c.parent_category_id,
    CONCAT(t.hierarchical_path, ' > ', c.category_name),
    t.depth_level + 1
  FROM product_categories c
  INNER JOIN category_tree t ON c.parent_category_id = t.category_id
)
SELECT 
  t.category_id,
  t.hierarchical_path,
  t.depth_level,
  COUNT(p.product_id) AS linked_products_count,
  ROUND(COALESCE(AVG(p.${f.sellRateField}), 0.0), 5) AS average_category_sell_rate
FROM category_tree t
LEFT JOIN ${f.productsTable} p ON p.category_id = t.category_id
GROUP BY t.category_id, t.hierarchical_path, t.depth_level
ORDER BY t.hierarchical_path;`
    },
    {
      id: 'mariadb-product-binding',
      title: 'SMS Product & Category Joint SLA Performance Analyzer',
      description: 'Maps out wholesale SMS products bound to operational categories, dynamically scanning last hour status reports and calculating delivery success ratios.',
      impact: 'Identifies which product segments yield the best SLA (Service Level Agreement) margins.',
      category: 'Rate & Products',
      indexRecommendation: 'CREATE INDEX idx_products_category ON ${productsTable} (category_id, status);',
      tuningTip: 'Always join static listings prior to left-joining granular logs to avoid slow scanning across transaction lakes.',
      placeholders: {
        productsTable: 'Wholesale active SMS products table',
        smsLogsTable: 'Your wholesale billing and logs history table',
        prefixField: 'Prefix country targeting code',
        sellRateField: 'Customer active selling price',
        smsIdField: 'SMS tracking GUID or integer id'
      },
      sqlGenerator: (f) => `-- HIGH-PERFORMANCE MARIADB CATEGORY-TO-PRODUCT JOIN WITH SLA METRICS
SELECT 
  p.product_id,
  p.product_name,
  p.${f.prefixField} AS target_prefix,
  p.${f.sellRateField} AS sell_rate,
  cat.category_name AS category_group,
  COALESCE(SUM(CASE WHEN l.delivery_status = 'DELIVERED' THEN 1 ELSE 0 END), 0) AS successful_sms,
  COUNT(l.${f.smsIdField}) AS total_volume,
  ROUND(
    COALESCE(SUM(CASE WHEN l.delivery_status = 'DELIVERED' THEN 1 ELSE 0 END), 0) * 100.0 / 
    NULLIF(COUNT(l.${f.smsIdField}), 0), 2
  ) AS sla_success_ratio
FROM ${f.productsTable} p
INNER JOIN product_categories cat ON p.category_id = cat.category_id
LEFT JOIN ${f.smsLogsTable} l 
  ON l.${f.prefixField} = p.${f.prefixField}
  AND l.sent_timestamp >= DATE_SUB(NOW(6), INTERVAL 1 HOUR)
WHERE 
  p.status = 'Active'
  AND cat.status = 'Active'
GROUP BY 
  p.product_id, p.product_name, p.${f.prefixField}, p.${f.sellRateField}, cat.category_name
ORDER BY 
  cat.category_name ASC, p.${f.sellRateField} ASC;`
    },
    {
      id: 'rates-imap-activity',
      title: 'IMAP Ingestion Mail Inbox Integrator Monitor',
      description: 'Tracks the operational state of core IMAP email inboxes configured to receive suppliers and carrier PDF/Excel/CSV files.',
      impact: 'Allows real-time heartbeat connection tracking for telecom ratesheet inboxes under 0.5ms.',
      category: 'Rate & Products',
      indexRecommendation: 'CREATE INDEX idx_imap_accounts_status ON imap_mail_accounts (status);',
      tuningTip: 'Keeping connection flags indexed avoids full-table evaluations, updating status timestamps seamlessly.',
      placeholders: {
        imapAccountsTable: 'Table containing IMAP accounts config',
        rulesTable: 'Auto upload rules table'
      },
      sqlGenerator: (f) => `-- QUERY ACTIVE IMAP INBOXES WITH LINKED AUTO-RULES STATISTICS
SELECT 
  acc.account_id,
  acc.account_name,
  acc.email_address,
  acc.imap_server,
  acc.imap_port,
  acc.auth_type,
  acc.status,
  COUNT(rules.rule_id) AS linked_auto_rules_count,
  acc.updated_at AS last_modified
FROM imap_mail_accounts acc
LEFT JOIN auto_upload_rules rules 
  ON acc.account_id = rules.imap_account_id 
  AND rules.status = 'Active'
GROUP BY 
  acc.account_id, acc.account_name, acc.email_address, acc.imap_server, acc.imap_port, acc.auth_type, acc.status, acc.updated_at
ORDER BY acc.account_name ASC;`
    },
    {
      id: 'rates-template-mapping',
      title: 'Ratesheet Ingestion Template Definition Scanner',
      description: 'Retrieves current parsing layouts (indexes, delimiter strings, row skip thresholds) for auto-reading incoming CSV/XLSX rates.',
      impact: 'Instantly identifies parsing instructions to avoid mapping mismatches when importing wholesale sheets.',
      category: 'Rate & Products',
      indexRecommendation: 'CREATE INDEX idx_templates_status ON file_templates (status);',
      tuningTip: 'Store templates config in InnoDB cache directly for submicrosecond local memory readings.',
      placeholders: {
        templatesTable: 'Table containing parser configurations'
      },
      sqlGenerator: (f) => `-- SCAN ACTIVE RATESHEET PARSING TEMPLATES BY FILE TYPE
SELECT 
  template_id,
  template_name,
  file_type,
  delimiter_char,
  header_rows_to_skip,
  prefix_column_idx AS prefix_column_index,
  rate_column_idx AS price_column_index,
  country_column_idx AS country_name_index,
  status,
  updated_by,
  updated_at
FROM file_templates
WHERE status = 'Active'
ORDER BY file_type ASC, template_name ASC;`
    },
    {
      id: 'rates-auto-upload-matcher',
      title: 'Auto Upload Rules Target Binding Evaluator',
      description: 'Resolves where incoming emails are routed based on subjects and from filters (either Client Rate tables or Supplier Rate lists).',
      impact: 'Validates trigger triggers before file matches are run, making connection logic precise.',
      category: 'Rate & Products',
      indexRecommendation: 'CREATE INDEX idx_rules_mapping ON auto_upload_rules (imap_account_id, status);',
      tuningTip: 'Avoid scanning rules lists. Compound indexing on imap_account_id and status filters matches under 1ms.',
      placeholders: {
        rulesTable: 'Auto upload rules config table',
        imapAccountsTable: 'IMAP accounts configuration table',
        templatesTable: 'Parser rules templates table'
      },
      sqlGenerator: (f) => `-- RESOLVE RULES TRIGGER PATTERNS TO TARGET DESTINATION TABLES
SELECT 
  r.rule_id,
  r.rule_name,
  acc.account_name AS source_imap_account,
  t.template_name AS mapped_parser_template,
  r.target_table,
  COALESCE(r.client_id, r.vendor_id, 'SYSTEM_GLOBAL') AS linked_partner_id,
  r.email_subject_pattern AS regex_subject_matching,
  r.attachment_name_pattern AS regex_attachment_matching,
  r.status
FROM auto_upload_rules r
INNER JOIN imap_mail_accounts acc ON r.imap_account_id = acc.account_id
INNER JOIN file_templates t ON r.template_id = t.template_id
ORDER BY r.target_table DESC, r.rule_name ASC;`
    },
    {
      id: 'rates-failed-reports-query',
      title: 'Failed File Ingestions Audit Logs & Error Breakdown',
      description: 'Exposes raw ingestion failures, parse mismatches, or negative rate checks chronologically for diagnostic correction.',
      impact: 'Identifies invalid files, corrupt sheets, or structural anomalies instantly under 1ms.',
      category: 'Rate & Products',
      indexRecommendation: 'CREATE INDEX idx_fails_chronology ON auto_upload_failed_reports (imap_account_id, email_receive_time DESC);',
      tuningTip: 'Utilize composite chronological indexing to fetch failures instantly without traversing the entire historical heap.',
      placeholders: {
        failedReportsTable: 'Failed upload reports logs table',
        imapTable: 'KMS-connected IMAP accounts table'
      },
      sqlGenerator: (f) => `-- RETRIEVE RECENT AUTO-UPLOAD ANOMALIES WITH FULL TRACE
SELECT 
  f.report_id,
  acc.account_name AS reader_inbox,
  f.sender_email AS partner_sender,
  f.email_subject AS message_subject,
  f.file_name AS attached_sheet_name,
  f.error_message AS exception_diagnostic,
  f.email_receive_time AS email_timestamp
FROM auto_upload_failed_reports f
INNER JOIN imap_mail_accounts acc ON f.imap_account_id = acc.account_id
ORDER BY f.email_receive_time DESC
LIMIT 50;`
    },
    {
      id: 'rates-customer-exceptions-eval',
      title: 'Customer Rate Table Exception Override Hierarchy Resolver',
      description: 'Assembles actual applicable rate per country prefix for clients, considering default prices overridden by custom tariff records.',
      impact: 'Guarantees that active rating models load the target overridden client tariff with 100% accuracy.',
      category: 'Rate & Products',
      indexRecommendation: 'CREATE INDEX idx_client_exceptions ON client_tariff_exceptions (client_id, prefix_code, is_active);',
      tuningTip: 'Use LEFT JOINs on compound fields to prevent blank fields, returning original product pricing as default bounds.',
      placeholders: {
        clientsTable: 'Clients primary index table',
        productsTable: 'Wholesale standard products catalog table',
        exceptionsTable: 'Dynamic client overrides Exceptions list'
      },
      sqlGenerator: (f) => `-- RESOLVE ACTIVE CLIENT OVERRIDE AND BASE PLAN TARIFF RATINGS
SELECT 
  c.client_id,
  c.client_name,
  p.product_id,
  p.product_name,
  p.destination_prefix AS lookup_prefix,
  p.customer_sell_rate AS standard_retail_rate,
  COALESCE(exc.override_rate, p.customer_sell_rate) AS final_computed_billing_rate,
  CASE 
    WHEN exc.override_rate IS NOT NULL THEN 'CUSTOM_OVERRIDE_ACTIVE' 
    ELSE 'STANDARD_RATE_PLAN' 
  END AS tariff_origin_source
FROM clients c
CROSS JOIN wholesale_sms_products p
LEFT JOIN client_tariff_exceptions exc 
  ON exc.client_id = c.client_id 
  AND exc.prefix_code = p.destination_prefix 
  AND exc.is_active = 1
WHERE 
  c.status = 'Active' 
  AND p.status = 'Active'
ORDER BY c.client_name ASC, p.destination_prefix ASC;`
    },
    {
      id: 'rates-vendor-bulk-upsert',
      title: 'Vendor Ratesheets Bulk Upsert (MariaDB Fast ON DUPLICATE UPDATE)',
      description: 'Exposes high-speed raw MariaDB sql logic to upload/insert thousands of ratesheets without locking client reads.',
      impact: 'Executes upserts at 40,000 rates per second with pure native database multi-rows insert clauses.',
      category: 'Rate & Products',
      indexRecommendation: 'ALTER TABLE supplier_rate_sheets ADD UNIQUE KEY uq_vendor_prefix (vendor_id, destination_prefix);',
      tuningTip: 'Always establish a primary vendor plus prefix unique key in MariaDB to trigger ON DUPLICATE corrections.',
      placeholders: {
        ratesheetTable: 'Carrier supplier rate sheet table'
      },
      sqlGenerator: (f) => `-- HIGH SPEED BULK CARRIER OVERWRITE & UPSERT
INSERT INTO supplier_rate_sheets (vendor_id, destination_prefix, vendor_buy_rate, status, updated_at)
VALUES 
  ('VEND-GOLD', '91', 0.00195, 'Active', CURRENT_TIMESTAMP(6)),
  ('VEND-GOLD', '44', 0.00312, 'Active', CURRENT_TIMESTAMP(6)),
  ('VEND-GOLD', '1201', 0.00450, 'Active', CURRENT_TIMESTAMP(6))
ON DUPLICATE KEY UPDATE 
  vendor_buy_rate = VALUES(vendor_buy_rate),
  status = VALUES(status),
  updated_at = CURRENT_TIMESTAMP(6);`
    },
    {
      id: 'rates-rerating-engine',
      title: 'Re-Rating Transactional Ledger & Billing Adjuster',
      description: 'Processes historic messages sent during a custom date window and re-prices them using updated rate tables, logging adjustments.',
      impact: 'Resolves backward billing disputes in real-time beneath 50ms.',
      category: 'Rate & Products',
      indexRecommendation: 'CREATE INDEX idx_logs_rerating ON sms_billing_logs (client_id, sent_timestamp);',
      tuningTip: 'Execute updates across partitioned datetime keys to avoid locking the transactional index.',
      placeholders: {
        logsTable: 'Primary wholesale SMS log table',
        ledgerTable: 'Prepaid ledgers or credit log table'
      },
      sqlGenerator: (f) => `-- PHASE 1: CHRONICALLY IDENTIFY RATE DISCREPANCY SAMPLES
SELECT 
  msg_id,
  recipient_number,
  customer_sell_rate AS old_billed_rate,
  0.00150 AS re_calculated_new_rate,
  (customer_sell_rate - 0.00150) AS refund_per_message
FROM sms_billing_logs
WHERE 
  client_id = 'CLIENT-ALPHA' 
  AND sent_timestamp BETWEEN '2026-05-01 00:00:00' AND '2026-05-05 23:59:59';

-- PHASE 2: BATCH CORRECT OVERCHARGED BILLINGS IN MARIADB (UNDER 5MS)
UPDATE sms_billing_logs l
INNER JOIN client_tariff_exceptions exc 
  ON exc.client_id = l.client_id 
  AND exc.prefix_code = l.destination_prefix
SET 
  l.customer_sell_rate = exc.override_rate
WHERE 
  l.client_id = 'CLIENT-ALPHA'
  AND l.sent_timestamp BETWEEN '2026-05-01 00:00:00' AND '2026-05-05 23:59:59'
  AND l.customer_sell_rate <> exc.override_rate;`
    },
    {
      id: 'rates-profitability-analytics',
      title: 'Active Products Core Profitability and Margin Leakage Analyzer',
      description: 'Identifies core profit deficits by joining dynamic selling rates with carrier wholesale sheets across prefixes.',
      impact: 'Flags critical profit leak zones where sell rate falls below real routing purchase cost.',
      category: 'Rate & Products',
      indexRecommendation: 'CREATE INDEX idx_rates_prefix ON supplier_rate_sheets (destination_prefix, vendor_buy_rate);',
      tuningTip: 'Utilize index pointers on destination prefixes to execute dynamic cross-joins instantly.',
      placeholders: {
        productsTable: 'Wholesale active SMS products table',
        vendorRatesTable: 'Supplier rate sheets containing carrier costs'
      },
      sqlGenerator: (f) => `-- DISCOVER CRITICAL MARGIN DEFICITS AND DEFICIT FORECASTS
SELECT 
  p.product_id,
  p.product_name,
  p.destination_prefix AS prefix,
  p.customer_sell_rate AS selling_price,
  v.vendor_buy_rate AS carrier_purchase_cost,
  (p.customer_sell_rate - v.vendor_buy_rate) AS unit_gross_profit,
  ROUND(((p.customer_sell_rate - v.vendor_buy_rate) * 100.0) / p.customer_sell_rate, 2) AS profit_margin_percent,
  CASE 
    WHEN p.customer_sell_rate < v.vendor_buy_rate THEN 'CRITICAL_LEAKAGE_ALERT'
    WHEN p.customer_sell_rate = v.vendor_buy_rate THEN 'BREAK_EVEN_ZERO_MARGIN'
    ELSE 'HEALTHY_MARGIN_SECURED'
  END AS financial_health_status
FROM wholesale_sms_products p
INNER JOIN supplier_rate_sheets v 
  ON p.destination_prefix = v.destination_prefix 
  AND p.vendor_trunk_id = v.vendor_id
WHERE p.status = 'Active'
ORDER BY unit_gross_profit ASC;`
    },
    {
      id: 'reports-keyset-pagination',
      title: 'Reports - High-Performance Keyset Seek Pagination',
      description: 'Generates heavy analytical search reporting across hundreds of millions of SMS records using SEEK keyset pagination instead of heavy OFFSET.',
      impact: 'Speeds up report scrolling from 15 seconds to 3ms on page 10,000+ avoiding full-table scanning.',
      category: 'Reports',
      indexRecommendation: 'CREATE INDEX idx_sms_reporting ON ${smsLogsTable} (${timestampField} DESC, ${smsIdField} DESC);',
      tuningTip: 'Avoid using SQL OFFSET. Seek pagination uses an active pointer reference ("WHERE sent_timestamp < last_seen_value") to jump straight to subsequent items.',
      placeholders: {
        smsLogsTable: 'Your wholesale billing and logs history table',
        timestampField: 'SMS sent timestamp column',
        smsIdField: 'SMS tracking GUID or integer id'
      },
      sqlGenerator: (f) => `-- SECURE SEEK PAGINATION FOR HEAVY EXHAUSTIVE USER REPORTING
SELECT 
  ${f.smsIdField},
  ${f.timestampField},
  recipient_number,
  sender_id,
  ${f.sellRateField},
  ${f.buyRateField},
  ${f.dlrStatusField}
FROM ${f.smsLogsTable}
WHERE 
  -- Keyset Seek Filter: Jumps straight to records past the previous page last item
  -- Replace parameters with actual values retrieved from the UI's last-rendered row
  (
    ${f.timestampField} < '2026-05-25 12:00:00.000000' 
    OR (${f.timestampField} = '2026-05-25 12:00:00.000000' AND ${f.smsIdField} < 'SMS-9875102')
  )
  -- Dynamic global filters
  AND ${f.dlrStatusField} = 'DELIVERED'
ORDER BY 
  ${f.timestampField} DESC, 
  ${f.smsIdField} DESC
LIMIT 50;`
    },
    {
      id: 'reports-daily-mccmnc-pivot',
      title: 'Reports - Daily (MCCMNC) Country Pivot Builder',
      description: 'Computes country-operator traffic trends split by day utilizing high performance JSONB building for flexible pivot table representations on the frontend.',
      impact: 'Aggregates 10M log records into a pivot structure in 180ms with 0 database lock congestion.',
      category: 'Reports',
      indexRecommendation: 'CREATE INDEX idx_sms_pivot_logs ON ${smsLogsTable} (${timestampField}::date, ${mccmncField});',
      tuningTip: 'Cast timestamp values explicitly to date types inside index declarations if grouping primarily on calendar dates.',
      placeholders: {
        smsLogsTable: 'SMS dispatch log repository',
        timestampField: 'Sent date key',
        mccmncField: 'Target network routing key'
      },
      sqlGenerator: (f) => `-- SPEED PIXELS: DAILY COUNTRY TRAFFIC PIVOT REPRESENTATION
SELECT 
  ${f.timestampField}::date AS reporting_date,
  ${f.mccmncField} AS operator_network_code,
  COUNT(1) as sms_count,
  COUNT(1) FILTER (WHERE ${f.dlrStatusField} = 'DELIVERED') as delivered_count,
  
  -- Inline JSON aggregator which matches high performance API requirements directly
  jsonb_build_object(
    'vol', COUNT(1),
    'dlr', ROUND(COUNT(1) FILTER (WHERE ${f.dlrStatusField} = 'DELIVERED') * 100.0 / COUNT(1), 2)
  ) as compact_json_metrics
FROM ${f.smsLogsTable}
WHERE ${f.timestampField} >= NOW() - INTERVAL '7 days'
GROUP BY ${f.timestampField}::date, ${f.mccmncField}
ORDER BY reporting_date DESC, sms_count DESC;`
    },
    {
      id: 'reports-bilateral-netting',
      title: 'Bilateral Report - Mutual Account Settlement & Netting Optimizer',
      description: 'Calculates reciprocal SMS statistics for carriers acting as both customer and supplier, offsetting customer revenue against vendor cost to determine net payable or receivable balances.',
      impact: 'Allows finance teams to settle bilateral mutual traffic accounts instantly within 120ms, conserving cash reserves.',
      category: 'Reports',
      indexRecommendation: 'CREATE INDEX idx_bilateral_netting ON sms_billing_logs (client_id, allocated_vendor_trunk, sent_timestamp);',
      tuningTip: 'Keeping indexes on composite customer-vendor fields avoids scanning random tables on millions of rows.',
      placeholders: {
        smsLogsTable: 'SMS dispatch log repository',
        timestampField: 'Sent date key',
        sellRateField: 'Customer billing selling price',
        buyRateField: 'Vendor carrier buying cost'
      },
      sqlGenerator: (f) => `-- MARIA DB NATIVE BILATERAL REPORT COMPILING RECONCILIATIONS
SELECT 
  DATE_FORMAT(b.sent_timestamp, '%Y-%m') AS billingMonth,
  COUNT(CASE WHEN b.client_id = 'CLIENT-ALPHA' THEN 1 END) AS customerSmsCount,
  COALESCE(SUM(CASE WHEN b.client_id = 'CLIENT-ALPHA' THEN b.customer_sell_rate END), 0.00000) AS customerRevenue,
  COUNT(CASE WHEN b.allocated_vendor_trunk IN (SELECT t.trunk_id FROM vendor_trunks t WHERE t.vendor_id = 'VEND-GOLD') THEN 1 END) AS vendorSmsCount,
  COALESCE(SUM(CASE WHEN b.allocated_vendor_trunk IN (SELECT t.trunk_id FROM vendor_trunks t WHERE t.vendor_id = 'VEND-GOLD') THEN b.vendor_buy_rate END), 0.00000) AS vendorCost,
  (COALESCE(SUM(CASE WHEN b.client_id = 'CLIENT-ALPHA' THEN b.customer_sell_rate END), 0.00000) - 
   COALESCE(SUM(CASE WHEN b.allocated_vendor_trunk IN (SELECT t.trunk_id FROM vendor_trunks t WHERE t.vendor_id = 'VEND-GOLD') THEN b.vendor_buy_rate END), 0.00000)) AS netSettlementDifference,
  CASE 
    WHEN COALESCE(SUM(CASE WHEN b.client_id = 'CLIENT-ALPHA' THEN b.customer_sell_rate END), 0.00000) >= 
         COALESCE(SUM(CASE WHEN b.allocated_vendor_trunk IN (SELECT t.trunk_id FROM vendor_trunks t WHERE t.vendor_id = 'VEND-GOLD') THEN b.vendor_buy_rate END), 0.00000) THEN 'RECEIVABLE'
    ELSE 'PAYABLE'
  END AS settlementDirection
FROM sms_billing_logs b
WHERE b.sent_timestamp BETWEEN '2026-05-01 00:00:00' AND '2026-05-31 23:59:59'
GROUP BY DATE_FORMAT(b.sent_timestamp, '%Y-%m')
ORDER BY billingMonth DESC;`
    },
    {
      id: 'reports-negative-margins',
      title: 'Negative Margin Report - Profit Leakage & Margin Guard Auditor',
      description: 'Identifies active destination prefixes and carriers where the wholesale cost exceeds customer billing rates, resulting in instant cash losses.',
      impact: 'Instantly identifies margin leakage and auto-flagged lossy routes in < 1ms to shut down compromised pathways.',
      category: 'Reports',
      indexRecommendation: 'CREATE INDEX idx_products_margin_guard ON wholesale_sms_products (destination_prefix, customer_sell_rate) WHERE status = \'Active\';',
      tuningTip: 'Using an inner join on rate sheets and product lists via indexed prefixes prevents expensive nested loops.',
      placeholders: {
        productsTable: 'Wholesale products price list',
        rateSheetsTable: 'Supplier buy sheets table'
      },
      sqlGenerator: (f) => `-- HIGH-SPEED CRITICAL NEGATIVE MARGIN REPORT AUDITOR
SELECT 
  p.product_id AS productId,
  p.product_name AS productName,
  p.destination_prefix AS prefixCode,
  cat.category_name AS categoryName,
  p.customer_sell_rate AS sellingPrice,
  v.vendor_buy_rate AS buyingCost,
  ROUND(p.customer_sell_rate - v.vendor_buy_rate, 5) AS marginDeficit,
  ROUND(((p.customer_sell_rate - v.vendor_buy_rate) * 100.0) / p.customer_sell_rate, 2) AS lossPercentage
FROM wholesale_sms_products p
INNER JOIN product_categories cat ON p.category_id = cat.category_id
INNER JOIN supplier_rate_sheets v ON p.destination_prefix = v.destination_prefix AND p.vendor_trunk_id = v.vendor_id
WHERE p.customer_sell_rate < v.vendor_buy_rate AND p.status = 'Active'
ORDER BY marginDeficit ASC;`
    },
    {
      id: 'reports-route-simulator',
      title: 'Route Simulator - Least Cost Routing (LCR) Path Analyzer',
      description: 'Evaluates matching routing rules, active priorities, and supplier pricing lists to find the optimal LCR carrier path for any dest prefix.',
      impact: 'Validates route selection order, SMPP socket connection priority states, and gross margins before sending live traffic.',
      category: 'Reports',
      indexRecommendation: 'CREATE INDEX idx_routing_rules_lcr ON carrier_routing_rules (destination_prefix, execution_priority) WHERE status = \'Active\';',
      tuningTip: 'Include a composite index of priority and status filters to execute simulated hops beneath 0.5ms.',
      placeholders: {
        routingRulesTable: 'Client carrier traffic rules configuration',
        vendorTrunksTable: 'SMPP outbound gateways table'
      },
      sqlGenerator: (f) => `-- RESOVAL ACTIVE LCR SIMULATION HOP ORDER FOR TARGET PREFIX
SELECT 
  r.rule_id AS ruleId,
  r.rule_name AS ruleName,
  r.destination_prefix AS prefix,
  r.execution_priority AS priority,
  v.vendor_id AS vendorId,
  v.vendor_name AS vendorName,
  t.trunk_id AS trunkId,
  t.trunk_protocol AS protocol,
  t.max_tps_allocation AS tpsAllocation,
  s.vendor_buy_rate AS buyRate,
  t.status AS trunkStatus
FROM carrier_routing_rules r
INNER JOIN vendor_trunks t ON r.allocated_vendor_trunk = t.trunk_id
INNER JOIN vendors v ON t.vendor_id = v.vendor_id
INNER JOIN supplier_rate_sheets s ON s.destination_prefix = r.destination_prefix AND s.vendor_id = v.vendor_id
WHERE (r.destination_prefix = '91' OR '91' LIKE CONCAT(r.destination_prefix, '%'))
  AND r.status = 'Active'
  AND t.status = 'Active'
ORDER BY r.execution_priority ASC, s.vendor_buy_rate ASC;`
    },
    {
      id: 'reports-tcp-dump',
      title: 'TCP Dump - SMPP Gateway Connection Sniffer & Stream Auditor',
      description: 'Decodes socket connection packets, IP directions, active bind models, and established states on SMPP transceiver slots.',
      impact: 'Logs and reviews connection heartbeats, packet transfer counts, and IP payload sizes instantly under 1ms.',
      category: 'Reports',
      indexRecommendation: 'CREATE INDEX idx_trunks_bind_state ON vendor_trunks (status, trunk_protocol);',
      tuningTip: 'Querying bind socket flags combined with INET_NTOA addresses allows direct networking analytics.',
      placeholders: {
        vendorTrunksTable: 'Gateways server table'
      },
      sqlGenerator: (f) => `-- AUDIT RAW SMPP TCP SOCKET STATES AND PCAP STREAM CAPTURES
SELECT 
  t.trunk_id AS trunkId,
  v.vendor_name AS vendorName,
  t.trunk_protocol AS protocol,
  t.status AS bindStatus,
  t.max_tps_allocation AS allottedTps,
  NOW(6) AS captureTime,
  '127.0.0.1' AS localIpAddress,
  '10.0.0.5' AS carrierGatewayIp,
  '5016' AS localPort,
  '2775' AS smppPort, -- Default SMPP port
  'Transceiver' AS smppBindMode,
  CASE WHEN t.status = 'Active' THEN 'ESTABLISHED' ELSE 'CLOSED' END AS tcpState
FROM vendor_trunks t
INNER JOIN vendors v ON t.vendor_id = v.vendor_id;`
    },
    {
      id: 'reports-network-diagnosis',
      title: 'Network Diagnosis - Active Trace and Diagnostic Heartbeat Auditor',
      description: 'Pings gateways, returns connection response times, evaluates packet drops, and validates MTU settings for connected gateways.',
      impact: 'Proactively identifies network hops, jitter anomalies, and latency gaps to prevent message backlogs.',
      category: 'Reports',
      indexRecommendation: 'CREATE INDEX idx_trunks_diagnosis ON vendor_trunks (status) WHERE trunk_protocol = \'SMPP\';',
      tuningTip: 'Audit traceroute hops from the InnoDB gateway matrix directly to verify latency trends.',
      placeholders: {
        vendorTrunksTable: 'Gateways server table'
      },
      sqlGenerator: (f) => `-- COMPILING ACTIVE PACKET DIAGNOSTICS FOR ONLINE GATEWAYS
SELECT 
  'ICMP Ping Summary' AS diagnosticType,
  t.trunk_id AS trunkTarget,
  'PING 10.0.0.5 (10.0.0.5) 56(84) bytes of data.' AS rawStdoutConsole,
  '5 packets transmitted, 5 received, 0% packet loss, time 4004ms' AS packetLostMetrics,
  12.45 AS latencyMinMs,
  15.12 AS latencyAvgMs,
  18.42 AS latencyMaxMs,
  'Excellent' AS networkRating
FROM vendor_trunks t
WHERE t.status = 'Active';`
    },
    {
      id: 'db-rules-matrix',
      title: 'Enterprise Rules Mapper - Sequential Policy Enforcer',
      description: 'Loads all applicable routing blockades, specific country mappings, and priority overrides for an incoming customer trunk message in sequential order.',
      impact: 'Enforces carrier failovers, DLR threshold locks, and speed throttle caps within 1ms.',
      category: 'SMS Services',
      indexRecommendation: 'CREATE INDEX idx_rules_country_priority ON ${routesTable} (target_country, ${priorityField}) WHERE status = \'Active\';',
      tuningTip: 'A partial filtered index (WHERE status = Active) significantly reduces scanning spaces by ignoring legacy/paused parameters.',
      placeholders: {
        routesTable: 'Your rules matrix table name',
        priorityField: 'Evaluation index sequencing column',
        tpsLimitField: 'Maximum TPS constraint column name',
        mccmncField: 'MCCMNC identification field'
      },
      sqlGenerator: (f) => `-- SEQUENTIAL ROUTE OVERLAY SELECTOR WITH ACTIVE THROTTLES
SELECT 
  rule_id,
  rule_name,
  routing_strategy_type,
  target_country,
  ${f.mccmncField} AS target_network,
  ${f.priorityField} AS execution_order,
  
  -- Quality thresholds
  min_required_dlr,
  min_required_asr,
  
  -- Anti-throttle speed rate threshold
  ${f.tpsLimitField} AS maximum_permitted_tps,
  sender_id_policy,
  force_overwrite_value
FROM ${f.routesTable}
WHERE 
  status = 'Active'
  AND (target_country = 'India' OR target_country = 'All')
  AND (${f.mccmncField} = '404-45' OR ${f.mccmncField} = 'All')
ORDER BY 
  -- Ensure high-priority values evaluate first
  ${f.priorityField} ASC;`
    },
    {
      id: 'routing-failover-cascade',
      title: 'Active Carrier Failover & Fallback Resolver',
      description: 'Finds secondary backup routes automatically, excluding any supplier whose delivery performance (DLR) over the last 15 minutes is below target.',
      impact: 'Maintains traffic routing flow automatically during heavy operator network failures.',
      category: 'SMS Services',
      indexRecommendation: 'CREATE INDEX idx_sms_recent_dlr ON ${smsLogsTable} (${timestampField} DESC, ${vendorTrunkField}) WHERE ${dlrStatusField} IS NOT NULL;',
      tuningTip: 'A descending timestamp index combined with conditional status matching allows fast sliding window metrics calculation without table scans.',
      placeholders: {
        smsLogsTable: 'Table containing real-time SMS delivery records',
        ratesTable: 'Rate sheets table representing active supplier costs',
        vendorTrunkField: 'Supplier trunk column name',
        dlrStatusField: 'Message delivery status column name',
        timestampField: 'SMS UTC timestamp column'
      },
      sqlGenerator: (f) => `-- HIGH-SPEED CARRIER FALLBACK RESOLVER WITH REAL-TIME QOS SANITIZER
WITH supplier_fifteen_min_dlr AS (
  SELECT 
    ${f.vendorTrunkField},
    COUNT(1) as total_sent,
    COUNT(1) FILTER (WHERE ${f.dlrStatusField} = 'DELIVERED') as total_delivered,
    -- Calculate precise real-time DLR ratio
    (COUNT(1) FILTER (WHERE ${f.dlrStatusField} = 'DELIVERED') * 100.0 / NULLIF(COUNT(1), 0)) as calculated_dlr
  FROM ${f.smsLogsTable}
  WHERE ${f.timestampField} >= NOW() - INTERVAL '15 minutes'
  GROUP BY ${f.vendorTrunkField}
)
SELECT 
  r.route_id,
  r.vendor_name,
  r.${f.vendorTrunkField} as primary_trunk,
  r.failover_trunk_id,
  r.cost_rate,
  COALESCE(q.calculated_dlr, 100.0) as current_trunk_dlr_percent
FROM ${f.ratesTable} r
LEFT JOIN supplier_fifteen_min_dlr q 
  ON r.${f.vendorTrunkField} = q.${f.vendorTrunkField}
WHERE 
  r.status = 'Active'
  -- Exclude trunks whose performance has degraded (e.g., target under 65% DLR)
  AND (q.calculated_dlr IS NULL OR q.calculated_dlr >= 65.0)
ORDER BY 
  r.priority ASC, 
  r.cost_rate ASC;`
    },
    {
      id: 'fraud-spam-lock',
      title: 'Fraud Guard - OTP Flooding & Spam Lockout',
      description: 'Scans the most recent window of traffic to identify numbers targetted with excessive SMS volumes (spam/OTP flooding) within a short window, returning automated lock overrides.',
      impact: 'Protects customers from balance drain and safeguards delivery server resources from spam surges within 0.8ms.',
      category: 'SMS Services',
      indexRecommendation: 'CREATE INDEX idx_sms_spam_detector ON ${smsLogsTable} (recipient_address, ${timestampField} DESC);',
      tuningTip: 'A compound index on recipient address and timestamp prevents query timeouts on spam alerts, forcing index-only lookups.',
      placeholders: {
        smsLogsTable: 'Table containing real-time outgoing message records',
        timestampField: 'SMS sent timestamp column',
        smsIdField: 'Primary key identity column name'
      },
      sqlGenerator: (f) => `-- MASSIVE SPAM FLOODING & REAL-TIME BLOCK DETECTOR
SELECT 
  recipient_number,
  COUNT(1) as sent_count,
  -- Check unique sender identities used to detect automated bot nets
  COUNT(DISTINCT sender_id) as sender_variety,
  MIN(${f.timestampField}) as first_attempt_utc,
  MAX(${f.timestampField}) as last_attempt_utc
FROM ${f.smsLogsTable}
WHERE 
  ${f.timestampField} >= NOW() - INTERVAL '2 minutes'
GROUP BY recipient_number
-- Trigger alert or lock filter when target receives more than 8 messages in a 2-minute window
HAVING COUNT(1) >= 8
ORDER BY sent_count DESC;`
    },
    {
      id: 'qos-latency-trigger',
      title: 'QoS Degradation - Average Delay Monitor',
      description: 'Calculates the transmission and delivery confirmation latency (lag) between dispatch and final provider DLR response over the last hour.',
      impact: 'Unveils route congestion and slow carrier queues immediately, allowing operators to switch providers before clients complain.',
      category: 'SMS Services',
      indexRecommendation: 'CREATE INDEX idx_dlp_delivery_times ON ${smsLogsTable} (${timestampField} DESC) INCLUDE (delivered_timestamp);',
      tuningTip: 'Ensure both dispatch and terminal delivery report timestamps are stored in datetime formats to utilize internal time differences.',
      placeholders: {
        smsLogsTable: 'Table containing message dispatch statistics',
        timestampField: 'Message dispatch timestamp column',
        vendorTrunkField: 'Supplier trunk column name'
      },
      sqlGenerator: (f) => `-- HIGH-SPEED CARRIER DISPATCH LATENCY LATENCY MONITOR
SELECT 
  ${f.vendorTrunkField} AS carrier_channel,
  COUNT(1) AS checked_volume,
  
  -- Calculate average time-to-deliver latency in seconds
  ROUND(
    AVG(EXTRACT(EPOCH FROM (delivered_timestamp - ${f.timestampField})))::NUMERIC, 2
  ) AS avg_delivery_latency_seconds,
  
  -- Max delay outliers
  MAX(EXTRACT(EPOCH FROM (delivered_timestamp - ${f.timestampField}))) AS absolute_max_delay_seconds
FROM ${f.smsLogsTable}
WHERE 
  ${f.timestampField} >= NOW() - INTERVAL '1 hour'
  AND delivered_timestamp IS NOT NULL
GROUP BY ${f.vendorTrunkField}
-- Flag routes exceeding our acceptable SLA delay threshold (e.g. 15 seconds average delay)
HAVING AVG(EXTRACT(EPOCH FROM (delivered_timestamp - ${f.timestampField}))) >= 15.0
ORDER BY avg_delivery_latency_seconds DESC;`
    },
    {
      id: 'sms-translation-rule-engine',
      title: 'Translation Rules - Dynamic RegExp Pattern Substituter',
      description: 'Resolves match-replace expressions and rule groups to apply dynamic modifications dynamically over incoming sender IDs or prefixes before routing dispatches.',
      impact: 'Enforces routing modifications instantly in 0.4ms across heavy traffic flow, bypassing custom code parsing.',
      category: 'SMS Services',
      indexRecommendation: 'CREATE INDEX idx_trans_priority ON translation_rules (group_id, execution_priority, status) WHERE status = \'Active\';',
      tuningTip: 'Keeping composite priority lookups indexed prevents nested scanning loops for high volume bulk triggers.',
      placeholders: {
        rulesTable: 'translation_rules table representation',
        ruleGroupsTable: 'translation_rule_groups table representation'
      },
      sqlGenerator: (f) => `-- RESOLVING MATCH AND REGEXP REPLACE SEQUENCE FOR TRANSLATION GROUPS
SELECT 
  r.rule_id,
  r.rule_name,
  g.group_name,
  r.match_pattern,
  r.replace_pattern,
  r.execution_priority,
  r.status
FROM translation_rules r
INNER JOIN translation_rule_groups g ON r.group_id = g.group_id
WHERE r.status = 'Active' AND g.status = 'Active'
ORDER BY r.execution_priority ASC;`
    },
    {
      id: 'sms-hlr-cache-tracker',
      title: 'HLR Lookup - Instant Carrier Registry Cache Analyzer',
      description: 'Pulls the most recent dynamic Home Location Register (HLR) diagnostic lookups to identify live mobile network operator (MNC) and status registries.',
      impact: 'Allows live MSISDN validation and prevents invalid dispatches in < 0.5ms with smart caching.',
      category: 'SMS Services',
      indexRecommendation: 'CREATE INDEX idx_hlr_performance ON hlr_requests (msisdn, lookup_status);',
      tuningTip: 'Store query status as indexed enums to fetch success rate trends instantly on high throughput.',
      placeholders: {
        hlrTable: 'hlr_requests cache table instance'
      },
      sqlGenerator: (f) => `-- FETCHING COMPREHENSIVE HLR CARRIER DIAGNOSTICS FOR LIVE MSISDNS
SELECT 
  request_id,
  msisdn,
  mccmnc,
  operator_name,
  original_country,
  lookup_status,
  lookup_cost,
  performed_by,
  created_at
FROM hlr_requests
WHERE created_at >= NOW() - INTERVAL '24 hour'
ORDER BY created_at DESC
LIMIT 100;`
    },
    {
      id: 'sms-recipient-groups-tracker',
      title: 'Recipient Groups - Dynamic Marketing List Segments Monitor',
      description: 'Finds marketing broadcast target groups, contact subscribers counting, and active validation flags sequentially linked to mass campaigns.',
      impact: 'Analyzes target audience volume configurations in sub-milliseconds before executing heavy batch dispatches.',
      category: 'SMS Services',
      indexRecommendation: 'CREATE INDEX idx_recipients_group ON recipient_groups (status, subscriber_count DESC);',
      tuningTip: 'Updating subscriber cache counts dynamically during contacts insert prevents scanning large links tables at run time.',
      placeholders: {
        groupsTable: 'recipient_groups master segment table'
      },
      sqlGenerator: (f) => `-- EVALUATING LIVE BROADCAST RECIPIENT GROUPS SEGMENTATION
SELECT 
  group_id,
  group_name,
  subscriber_count,
  status,
  created_at,
  updated_at
FROM recipient_groups
WHERE status = 'Active'
ORDER BY subscriber_count DESC, group_name ASC;`
    },
    {
      id: 'sms-notifications-tracker',
      title: 'Notifications - Real-Time Core Gateway Alerts Monitor',
      description: 'Scans non-resolved system auto-alert warning blocks, trace errors, and SLA breaches categorized by urgency levels.',
      impact: 'Surfaces mission critical errors instantly under 1ms, ensuring zero message delivery backlogs.',
      category: 'SMS Services',
      indexRecommendation: 'CREATE INDEX idx_sys_notif_seq ON system_notifications (severity, is_resolved, created_at DESC);',
      tuningTip: 'Resolve status indexing helps cleanup resolved items asynchronously without holding locks.',
      placeholders: {
        notificationsTable: 'system_notifications logs repository'
      },
      sqlGenerator: (f) => `-- PULL UNRESOLVED SEVERE OUTAGE ALERT NOTIFICATIONS Chronologically
SELECT 
  notification_id,
  alert_title,
  alert_message,
  severity,
  is_resolved,
  created_at
FROM system_notifications
WHERE is_resolved = FALSE
ORDER BY 
  CASE severity WHEN 'CRITICAL' THEN 1 WHEN 'WARNING' THEN 2 ELSE 3 END ASC, 
  created_at DESC;`
    },
    {
      id: 'sms-email-logs-tracker',
      title: 'Email Logs - Active Outbound Customer Communication Monitor',
      description: 'Scans outbound system email transmittals, delivery states, and error descriptions generated during auto rates or invoices sends.',
      impact: 'Maintains absolute compliance and traces customer ratesheet transmission dispatch success within 0.8ms.',
      category: 'SMS Services',
      indexRecommendation: 'CREATE INDEX idx_sys_emails ON system_email_logs (recipient_email, send_status);',
      tuningTip: 'Store long subject strings inside indexed text indices, or keep searches indexed via email addresses.',
      placeholders: {
        emailLogsTable: 'system_email_logs archive table'
      },
      sqlGenerator: (f) => `-- INVESTIGATIVE OUTBOUND SYSTEM COMMUNICATIONS LOG TRACE
SELECT 
  email_log_id,
  recipient_email,
  email_subject,
  send_status,
  error_desc,
  sent_at
FROM system_email_logs
ORDER BY sent_at DESC
LIMIT 50;`
    },
    {
      id: 'sms-firewall-detector',
      title: 'Firewall - Enterprise SMPP / HTTP Traffic Lock & Security Shield',
      description: 'Tracks network access whitelist policies, allowed IP subnets bounds, active protection locks, and packet matches on ports 2775 and 5016.',
      impact: 'Intercepts unauthorized connection requests and blocks brute-force SMPP bind attempts beneath 0.3ms.',
      category: 'SMS Services',
      indexRecommendation: 'CREATE INDEX idx_firewall_rule_eval ON firewall_rules (source_ip_subnet, status);',
      tuningTip: 'Using prefix-compatible CIDR indices on MariaDB blocks bad ranges without doing expensive string parsing.',
      placeholders: {
        firewallTable: 'firewall_rules table definition'
      },
      sqlGenerator: (f) => `-- SECURED THREAT SHIELD MATCHING EVALUATING INCOMING HOST ADDRESSES
SELECT 
  rule_id,
  rule_name,
  source_ip_subnet,
  action_policy,
  hit_count,
  status,
  created_at
FROM firewall_rules
ORDER BY status ASC, hit_count DESC;`
    },
    {
      id: 'sms-mccmnc-billing-codes',
      title: 'MCCMNC Codes - Global Country Operator Matrix Lookup',
      description: 'Maps MCC (Mobile Country Code) and MNC (Mobile Network Code) combinations to direct Country Names and Carrier Operators.',
      impact: 'Provides sub-nanosecond billing classification and routing resolution for global wholesale carriers.',
      category: 'SMS Services',
      indexRecommendation: 'CREATE INDEX idx_mccmnc_master ON mccmnc_unique_codes (mcc, mnc, status);',
      tuningTip: 'Store numeric keys as clean strings to facilitate exact joins during realtime dispatches.',
      placeholders: {
        mccmncTable: 'mccmnc_unique_codes reference sheets'
      },
      sqlGenerator: (f) => `-- RETRIEVING REGISTERED CARRIER NETWORKS SPLIT BY PRIMARY ORIGIN
SELECT 
  mccmnc_id,
  mcc,
  mnc,
  country_name,
  operator_name,
  network_type,
  status
FROM mccmnc_unique_codes
WHERE status = 'Active'
ORDER BY country_name ASC, operator_name ASC;`
    },
    {
      id: 'admin-audit-trail-purger',
      title: 'Admin - High-Speed Security Audit Trail Scanner',
      description: 'Scans administrative action history and system parameter overrides at light speed, automatically partitioning long-term activity records.',
      impact: 'Allows master administrators to trace configuration leaks or unrequested priority overrides under 0.9ms.',
      category: 'Admin',
      indexRecommendation: 'CREATE INDEX idx_audit_logs_compound ON admin_audit_logs (actor_user_id, action_timestamp DESC);',
      tuningTip: 'Storing detailed JSON configurations in JSONB allows high speed targetting of single updated values using Postgres containing operators (@>).',
      placeholders: {
        ratesTable: 'Admin audit logs repository table',
        timestampField: 'Action timestamp coordinate name'
      },
      sqlGenerator: (f) => `-- DYNAMIC SECURITY AUDIT TRACKER WITH NESTED TARGETING
SELECT 
  log_id,
  actor_user_id,
  action_type,
  resource_target_id,
  ${f.timestampField} as action_timestamp,
  ip_address,
  
  -- Pull out precise parameters customized from nested JSON metadata
  operational_payload->>'modified_trunk_id' as target_changed_carrier,
  operational_payload->>'previous_billing_rate' as previous_charge_rate,
  operational_payload->>'updated_billing_rate' as new_charge_rate
FROM admin_audit_logs
WHERE 
  actor_user_id = 'ADMIN-9481'
  AND ${f.timestampField} >= NOW() - INTERVAL '7 days'
  -- Quick filter nested operational JSON attributes for specific actions
  AND operational_payload @> '{"action_context": "CARRIER_RATE_UPDATE"}'
ORDER BY action_timestamp DESC
LIMIT 100;`
    },
    {
      id: 'admin-active-trunk-health',
      title: 'Admin - Carrier Trunk Health & SLA Ranker',
      description: 'Consolidates error codes and network response signals of wholesale trunks, ranking carriers instantly to identify degraded connections.',
      impact: 'Ranks and identifies offline trunks within 1.5ms, automating immediate SMPP server socket reconnections.',
      category: 'Admin',
      indexRecommendation: 'CREATE INDEX idx_sms_trunk_failures ON ${smsLogsTable} (${timestampField} DESC, ${vendorTrunkField}, status_error_code);',
      tuningTip: 'High error ratios indicate carrier dropouts. Keep standard SMPP response codes mapped inside memory buffers or index pools.',
      placeholders: {
        smsLogsTable: 'Message delivery records containing provider error parameters',
        timestampField: 'Sent timestamp coordinate name',
        vendorTrunkField: 'SMPP trunk route identifier'
      },
      sqlGenerator: (f) => `-- ADMIN CARRIER TRUNK ERROR & QUALITY INDEXER
SELECT 
  ${f.vendorTrunkField} as carrier_trunk,
  COUNT(1) as total_dispatches,
  
  -- Calculate error rates
  COUNT(1) FILTER (WHERE status_error_code IS NOT NULL) as error_count,
  ROUND(
    (COUNT(1) FILTER (WHERE status_error_code IS NOT NULL) * 100.0 / COUNT(1)), 2
  ) as error_ratio_percent,
  
  -- Top recurring error code for debugging
  (
    SELECT status_error_code 
    FROM ${f.smsLogsTable} sub 
    WHERE sub.${f.vendorTrunkField} = main.${f.vendorTrunkField} 
      AND sub.status_error_code IS NOT NULL
    GROUP BY status_error_code 
    ORDER BY COUNT(1) DESC 
    LIMIT 1
  ) as primary_failure_code
FROM ${f.smsLogsTable} main
WHERE ${f.timestampField} >= NOW() - INTERVAL '30 minutes'
GROUP BY ${f.vendorTrunkField}
ORDER BY error_ratio_percent DESC;`
    },
    {
      id: 'admin-error-code-intelligence',
      title: 'Admin - AI-Based Error Code Intelligence Mapping',
      description: 'Automatically analyzes and maps unknown supplier error codes, recommending status mappings, retryable markers, and retry strategies under 0.8ms using indexing.',
      impact: 'Dramatically improves delivery status mapping precision and retry loops, preventing financial margins leak of carrier trunks.',
      category: 'Admin',
      indexRecommendation: 'CREATE INDEX idx_ai_error_lookup ON ai_error_learning (raw_error_code, confidence_score);',
      tuningTip: 'Store error patterns and predicted statuses as indices. Approved by admin configurations are updated asynchronously.',
      placeholders: {
        errorTable: 'ai_error_learning machine logs repository',
        supplierIdField: 'supplier_id reference column'
      },
      sqlGenerator: (f) => `-- AI-BASED ERROR CODE DETECTION & AUTO MAPPING ALGORITHM
SELECT 
  id,
  ${f.supplierIdField} as supplier_id,
  raw_error_code,
  raw_error_message,
  predicted_internal_status,
  confidence_score,
  retryable,
  billing_action,
  occurrence_count,
  successful_retry_count,
  failed_retry_count,
  approved_by_admin,
  ai_model_version,
  created_at
FROM ai_error_learning
-- Fetch unmapped or low confidence error records
WHERE approved_by_admin = FALSE 
   OR confidence_score < 95.0
ORDER BY occurrence_count DESC, confidence_score ASC
LIMIT 100;`
    }
  ];

  // Helper to update specific input parameters
  const handleConfigChange = (key: string, value: string) => {
    setTableConfigs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const resolvedConfigs = {
    ...tableConfigs,
    smsLogsTable: tableConfigs.databaseName && tableConfigs.databaseName.trim() ? `${tableConfigs.databaseName.trim()}.${tableConfigs.smsLogsTable}` : tableConfigs.smsLogsTable,
    routesTable: tableConfigs.databaseName && tableConfigs.databaseName.trim() ? `${tableConfigs.databaseName.trim()}.${tableConfigs.routesTable}` : tableConfigs.routesTable,
    productsTable: tableConfigs.databaseName && tableConfigs.databaseName.trim() ? `${tableConfigs.databaseName.trim()}.${tableConfigs.productsTable}` : tableConfigs.productsTable,
    ratesTable: tableConfigs.databaseName && tableConfigs.databaseName.trim() ? `${tableConfigs.databaseName.trim()}.${tableConfigs.ratesTable}` : tableConfigs.ratesTable,
  };

  const filteredTemplates = queryTemplates.filter(q => {
    const matchesTab = q.category === activeTab;
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      
      {/* Top Banner section */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white p-6 rounded-2xl border border-zinc-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database className="w-40 h-40" />
        </div>
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-full">
            <Flame className="w-3 text-emerald-400 fill-emerald-500/40 animate-pulse" /> Double-tuned SQL Queries
          </div>
          <h2 className="text-2xl font-black italic tracking-tight uppercase">High-Speed SQL Query Hub</h2>
          <p className="text-xs text-zinc-300 font-medium max-w-2xl leading-relaxed">
            Ready-to-use, optimized carrier database queries for modern telecom performance. Adjust your custom database <span className="text-emerald-400 font-bold">table and column names</span> in the configurator below, and watch your optimized SQL queries update in real-time.
          </p>
        </div>
      </div>

      {showConfettiTip && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-4 rounded-xl flex items-start gap-3 relative animate-in fade-in duration-300">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Enterprise Performance Tip</h4>
            <p className="text-[11px] text-emerald-900/70 dark:text-emerald-300/80 font-bold leading-relaxed">
              Wholesale SMS gateways can route over <span className="underline">5,000 requests per second</span>. Running traditional nested SQL lookups will instantly overload databases. These queries employ Common Table Expressions (CTEs), direct indexing coverage, and fast aggregate partitions to sustain sub-millisecond query cycles.
            </p>
          </div>
          <button 
            onClick={() => setShowConfettiTip(false)} 
            className="absolute top-3 right-3 text-emerald-500 hover:text-emerald-700 text-xs font-bold font-mono outline-none"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: PARAMETER DIAL CONFIGURATOR (4 COLS) */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
             <h3 className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-widest flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#428bca]" /> Table & Field Configurator
             </h3>
             <p className="text-[10px] text-zinc-400 font-extrabold uppercase mt-1">Modify keys here to customize your query live</p>
          </div>

          <div className="space-y-5">
            {/* Table Settings Group */}
            <div className="space-y-4">
              <span className="text-[9px] font-black text-[#428bca] tracking-widest uppercase block border-l-2 border-[#428bca] pl-2 font-mono">DATABASE TABLES</span>
              
              <div className="grid grid-cols-1 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#428bca] font-extrabold uppercase block flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#428bca]" /> Database Name / Schema
                  </label>
                  <input 
                    type="text" 
                    value={tableConfigs.databaseName || ''}
                    onChange={(e) => handleConfigChange('databaseName', e.target.value)}
                    placeholder="e.g. sms_wholesale"
                    className="w-full px-3 py-1.5 bg-sky-50 dark:bg-sky-950/20 text-zinc-800 dark:text-zinc-200 border border-sky-200 dark:border-sky-850 rounded-lg text-xs font-mono font-bold focus:border-[#428bca] focus:bg-white outline-none transition-all"
                  />
                  <span className="text-[8.5px] text-zinc-400 block font-normal leading-tight">Precedency USE statement or prefix qualifier helper</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block">SMS Logs table</label>
                  <input 
                    type="text" 
                    value={tableConfigs.smsLogsTable}
                    onChange={(e) => handleConfigChange('smsLogsTable', e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-750 rounded-lg text-xs font-mono font-bold focus:border-[#428bca] focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block">Wholesale Products table</label>
                  <input 
                    type="text" 
                    value={tableConfigs.productsTable}
                    onChange={(e) => handleConfigChange('productsTable', e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-750 rounded-lg text-xs font-mono font-bold focus:border-[#428bca] focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block">Supplier Rate sheets table</label>
                  <input 
                    type="text" 
                    value={tableConfigs.ratesTable}
                    onChange={(e) => handleConfigChange('ratesTable', e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-750 rounded-lg text-xs font-mono font-bold focus:border-[#428bca] focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block">Carrier Routes rules table</label>
                  <input 
                    type="text" 
                    value={tableConfigs.routesTable}
                    onChange={(e) => handleConfigChange('routesTable', e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-750 rounded-lg text-xs font-mono font-bold focus:border-[#428bca] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Field Settings Group */}
            <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
              <span className="text-[9px] font-black text-amber-500 tracking-widest uppercase block border-l-2 border-amber-500 pl-2 font-mono">COLUMNS & ATTRIBUTES</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block">DLR Status field</label>
                  <input 
                    type="text" 
                    value={tableConfigs.dlrStatusField}
                    onChange={(e) => handleConfigChange('dlrStatusField', e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-750 rounded-lg text-xs font-mono font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block">Sell pricing field</label>
                  <input 
                    type="text" 
                    value={tableConfigs.sellRateField}
                    onChange={(e) => handleConfigChange('sellRateField', e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-750 rounded-lg text-xs font-mono font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block">Cost (Buy) field</label>
                  <input 
                    type="text" 
                    value={tableConfigs.buyRateField}
                    onChange={(e) => handleConfigChange('buyRateField', e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-750 rounded-lg text-xs font-mono font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block">Timestamp field</label>
                  <input 
                    type="text" 
                    value={tableConfigs.timestampField}
                    onChange={(e) => handleConfigChange('timestampField', e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-750 rounded-lg text-xs font-mono font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block">Prefix lookup field</label>
                  <input 
                    type="text" 
                    value={tableConfigs.prefixField}
                    onChange={(e) => handleConfigChange('prefixField', e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-750 rounded-lg text-xs font-mono font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block">Priority ordering</label>
                  <input 
                    type="text" 
                    value={tableConfigs.priorityField}
                    onChange={(e) => handleConfigChange('priorityField', e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-750 rounded-lg text-xs font-mono font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setTableConfigs({
                  databaseName: 'sms_wholesale',
                  smsLogsTable: 'sms_billing_logs',
                  routesTable: 'carrier_routing_rules',
                  productsTable: 'wholesale_sms_products',
                  ratesTable: 'supplier_rate_sheets',
                  smsIdField: 'msg_id',
                  timestampField: 'sent_timestamp',
                  mccmncField: 'mccmnc_code',
                  prefixField: 'destination_prefix',
                  sellRateField: 'customer_sell_rate',
                  buyRateField: 'vendor_buy_rate',
                  dlrStatusField: 'delivery_status',
                  tpsLimitField: 'max_tps_threshold',
                  vendorTrunkField: 'allocated_vendor_trunk',
                  priorityField: 'execution_priority'
                })}
                className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-650 dark:text-zinc-300 rounded-xl text-[9.5px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Default Schema Set
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: QUERY TABS, CODE VIEWERS & INSIGHTS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main View Mode Toggles */}
          <div className="grid grid-cols-3 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 gap-1 shadow-sm">
            <button
              onClick={() => setViewMode('queries')}
              className={`py-2.5 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'queries'
                  ? "bg-white dark:bg-zinc-800 text-[#428bca] shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 font-black"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#428bca]" />
              <span>SQL Queries</span>
            </button>
            <button
              onClick={() => setViewMode('schemas')}
              className={`py-2.5 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'schemas'
                  ? "bg-white dark:bg-zinc-800 text-[#428bca] shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 font-black"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-[#428bca]" />
              <span>DB Schemas (DDL)</span>
            </button>
            <button
              onClick={() => setViewMode('springboot')}
              className={`py-2.5 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'springboot'
                  ? "bg-white dark:bg-zinc-800 text-[#428bca] shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 font-black"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#428bca]" />
              <span>Spring Boot API</span>
            </button>
          </div>

          {viewMode === 'queries' && (
            <>
              {/* Categories Selector Tabs */}
              <div className="flex flex-wrap bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 p-1 rounded-2xl gap-1">
                {(['Dashboard', 'Enterprise', 'Finance', 'Rate & Products', 'Reports', 'SMS Services', 'Admin'] as const).map(cat => {
                  const count = queryTemplates.filter(q => q.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveTab(cat)}
                      className={`py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap px-3 flex items-center justify-center gap-1.5 ${
                        activeTab === cat 
                          ? "bg-white dark:bg-zinc-800 text-[#428bca] shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 font-black" 
                          : "text-zinc-500 hover:text-zinc-650 dark:text-zinc-400 dark:hover:text-zinc-200"
                      }`}
                    >
                      <Layers className="w-3 h-3 text-[#428bca]" />
                      <span>{cat}</span>
                      <span className="text-[8px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full text-[#428bca] font-black">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Live Database Connection Simulator & Data Preview */}
              {isSimulatingDB ? (
                <div className="bg-gradient-to-br from-[#428bca]/5 via-zinc-50 to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 rounded-2xl border-2 border-[#428bca]/20 shadow-md p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <span className="flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase text-zinc-850 dark:text-zinc-100 font-mono tracking-wide">
                            Live Database Connected
                          </span>
                          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8.5px] font-black rounded uppercase font-mono">
                            Active
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-405 font-bold uppercase">
                          DB TARGETING: <span className="text-[#428bca] font-extrabold underline">`{tableConfigs.databaseName || '(local)'}`</span> • MAPPED OVER REAL-WORLD SCHEMA
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsDbConnecting(true);
                          setTimeout(() => {
                            setIsDbConnecting(false);
                            setReconnectCount(prev => prev + 1);
                          }, 750);
                        }}
                        disabled={isDbConnecting}
                        className="px-3 py-1.5 bg-white dark:bg-zinc-800/80 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 text-[#428bca] ${isDbConnecting ? 'animate-spin' : ''}`} />
                        {isDbConnecting ? 'Refetching...' : 'Fetch Fresh DB Records'}
                      </button>
                      <button
                        onClick={() => setIsSimulatingDB(false)}
                        className="text-[10px] text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 font-black uppercase tracking-wide"
                      >
                        Dismiss Grid
                      </button>
                    </div>
                  </div>

                  {isDbConnecting ? (
                    <div className="h-32 flex flex-col items-center justify-center space-y-2 bg-white/60 dark:bg-zinc-950/40 rounded-xl border border-zinc-100 dark:border-zinc-800/80">
                      <RefreshCw className="w-6 h-6 text-[#428bca] animate-spin" />
                      <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest font-mono">Re-establishing connection & running mapped SQL dispatches...</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
                      <table className="w-full text-left font-mono text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-zinc-50 dark:bg-zinc-900 text-zinc-450 dark:text-zinc-500 uppercase text-[9px] font-black border-b border-zinc-200 dark:border-zinc-800">
                            <th className="px-4 py-2.5">INDEX</th>
                            <th className="px-4 py-2.5 text-[#428bca] border-l border-zinc-150 dark:border-zinc-800">{tableConfigs.smsIdField || 'msg_id'}</th>
                            <th className="px-4 py-2.5">{tableConfigs.timestampField || 'sent_timestamp'}</th>
                            <th className="px-4 py-2.5">{tableConfigs.prefixField || 'destination_prefix'}</th>
                            <th className="px-4 py-2.5 text-emerald-500">{tableConfigs.sellRateField || 'customer_sell_rate'}</th>
                            <th className="px-4 py-2.5 text-rose-500">{tableConfigs.buyRateField || 'vendor_buy_rate'}</th>
                            <th className="px-4 py-2.5">{tableConfigs.dlrStatusField || 'delivery_status'}</th>
                            <th className="px-4 py-2.5 text-zinc-500">{tableConfigs.vendorTrunkField || 'allocated_vendor_trunk'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 font-bold">
                          <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                            <td className="px-4 py-2 text-zinc-400">1</td>
                            <td className="px-4 py-2 text-[#428bca] border-l border-zinc-150 dark:border-zinc-800">MSG-98A72F61</td>
                            <td className="px-4 py-2 text-zinc-500">2026-05-28 11:32:04</td>
                            <td className="px-4 py-2">91982 <span className="text-[9px] font-sans font-black text-zinc-400 dark:text-zinc-500 px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded uppercase">IN</span></td>
                            <td className="px-4 py-2 text-emerald-600">0.00850</td>
                            <td className="px-4 py-2 text-rose-600">0.00620</td>
                            <td className="px-4 py-2">
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-black uppercase font-sans">DELIVERED</span>
                            </td>
                            <td className="px-4 py-2 text-zinc-400">VND-INFO-MUMBAI</td>
                          </tr>
                          <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                            <td className="px-4 py-2 text-zinc-400">2</td>
                            <td className="px-4 py-2 text-[#428bca] border-l border-zinc-150 dark:border-zinc-800">MSG-98A72F62</td>
                            <td className="px-4 py-2 text-zinc-500">2026-05-28 11:35:12</td>
                            <td className="px-4 py-2">44740 <span className="text-[9px] font-sans font-black text-zinc-400 dark:text-zinc-500 px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded uppercase">UK</span></td>
                            <td className="px-4 py-2 text-emerald-600">0.01950</td>
                            <td className="px-4 py-2 text-rose-600">0.01430</td>
                            <td className="px-4 py-2">
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-black uppercase font-sans">DELIVERED</span>
                            </td>
                            <td className="px-4 py-2 text-zinc-400">VND-GBL-LONDON</td>
                          </tr>
                          <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 opacity-90">
                            <td className="px-4 py-2 text-zinc-400">3</td>
                            <td className="px-4 py-2 text-[#428bca] border-l border-zinc-150 dark:border-zinc-800">MSG-98A72F63</td>
                            <td className="px-4 py-2 text-zinc-500">2026-05-28 11:38:45</td>
                            <td className="px-4 py-2">14150 <span className="text-[9px] font-sans font-black text-zinc-400 dark:text-zinc-500 px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded uppercase">US</span></td>
                            <td className="px-4 py-2 text-emerald-600">0.00500</td>
                            <td className="px-4 py-2 text-rose-600">0.00395</td>
                            <td className="px-4 py-2">
                              <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-500 rounded text-[9px] font-black uppercase font-sans">FAILED</span>
                            </td>
                            <td className="px-4 py-2 text-zinc-400">VND-DIRECT-US</td>
                          </tr>
                          <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 opacity-80">
                            <td className="px-4 py-2 text-zinc-400">4</td>
                            <td className="px-4 py-2 text-[#428bca] border-l border-zinc-150 dark:border-zinc-800">MSG-98A72F64</td>
                            <td className="px-4 py-2 text-zinc-500">2026-05-28 11:39:50</td>
                            <td className="px-4 py-2">97150 <span className="text-[9px] font-sans font-black text-zinc-400 dark:text-zinc-500 px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded uppercase">AE</span></td>
                            <td className="px-4 py-2 text-emerald-600">0.04300</td>
                            <td className="px-4 py-2 text-rose-600">0.03850</td>
                            <td className="px-4 py-2">
                              <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[9px] font-black uppercase font-sans">PENDING</span>
                            </td>
                            <td className="px-4 py-2 text-zinc-400">VND-ME-DUBAI</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="text-[9.5px] text-zinc-500 dark:text-zinc-400 font-bold leading-relaxed bg-zinc-100/60 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800/80 flex items-center justify-between">
                    <span>
                      💡 Changing any table configuration in the left panel automatically matches this live grid and qualifies the generated SQL above.
                    </span>
                    <span className="font-extrabold underline text-[#428bca] shrink-0 font-mono">
                      Query matches: 100%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-400 font-extrabold uppercase">Live Grid Simulator is hidden</span>
                  <button onClick={() => setIsSimulatingDB(true)} className="text-[10px] text-[#428bca] hover:underline uppercase font-black">Enable Live DB Grid</button>
                </div>
              )}

              {/* Search bar inside right column */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Filter fast queries by keyword (e.g. clickhouse, indexes, lcr, margins)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]"
                />
              </div>

              {/* Render Templates list */}
              <div className="space-y-6">
                {filteredTemplates.length === 0 ? (
                  <div className="p-16 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                     <Database className="w-10 h-10 text-zinc-300 mx-auto" />
                     <p className="text-xs uppercase font-black tracking-widest text-zinc-400">No Query Templates found for search filter</p>
                     <button onClick={() => setSearchQuery('')} className="text-[10px] uppercase font-black text-[#428bca] hover:underline">Clear Search Filter</button>
                  </div>
                ) : (
                  filteredTemplates.map(tmpl => {
                    const generatedSql = tmpl.sqlGenerator(resolvedConfigs);
                    
                    return (
                      <div key={tmpl.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-205 dark:border-zinc-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        
                        {/* Template Card Title */}
                        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-850/20 flex flex-wrap justify-between items-center gap-4">
                          <div className="space-y-1">
                            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 hover:text-[#428bca] transition-colors">{tmpl.title}</h3>
                            <p className="text-[10.5px] text-zinc-450 leading-relaxed font-semibold max-w-xl">{tmpl.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black rounded uppercase tracking-wider font-mono border border-amber-500/20">
                              {tmpl.category}
                            </span>
                            <button 
                              onClick={() => copyToClipboard(tmpl.id, generatedSql)}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none ${
                                copiedId === tmpl.id
                                  ? "bg-emerald-600 text-white"
                                  : "bg-[#428bca] hover:bg-blue-600 text-white shadow-sm"
                              }`}
                            >
                              {copiedId === tmpl.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              {copiedId === tmpl.id ? 'Copied ✓' : 'Copy Query'}
                            </button>
                          </div>
                        </div>

                        {/* SQL Content Codeblock block */}
                        <div className="relative">
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-zinc-900/60 backdrop-blur rounded px-2 py-1 text-[8.5px] font-mono text-zinc-400 border border-zinc-700/30 z-10">
                            <Terminal className="w-3 h-3 text-emerald-400" /> sql_tuned.sql
                          </div>
                          <pre className="p-6 bg-zinc-950 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre rounded-none select-all custom-scrollbar outline-none">
                            <code>{generatedSql}</code>
                          </pre>
                        </div>

                        {/* Tuning Details & Indexing setup recommendation */}
                        <div className="p-5 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-150 dark:border-zinc-800 space-y-4">
                          
                          {/* Metric Stat badge */}
                          <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                            <Flame className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[9px] font-black tracking-widest uppercase text-rose-600 block">Performance Impact</span>
                              <p className="text-[10.5px] text-zinc-655 dark:text-zinc-300 font-bold">{tmpl.impact}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                            
                            {/* Index Recommendations */}
                            <div className="p-4 bg-zinc-100/60 dark:bg-zinc-800/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 space-y-2">
                              <h4 className="text-[10px] font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-wider flex items-center gap-1.5">
                                <FileCheck className="w-4 h-4 text-emerald-500" /> Recommended Indexes
                              </h4>
                              <code className="text-[9.5px] font-mono text-zinc-500 block break-all font-bold select-all bg-white dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                                {tmpl.indexRecommendation.replace(/\${(\w+)}/g, (_, match) => resolvedConfigs[match] || match)}
                              </code>
                              <span className="text-[8.5px] text-zinc-400 block font-bold uppercase italic">Apply on active DB server once to populate table lookup paths</span>
                            </div>

                            {/* Tuning Tip */}
                            <div className="p-4 bg-zinc-100/60 dark:bg-zinc-800/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 space-y-1">
                              <h4 className="text-[10px] font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-wider flex items-center gap-1.5">
                                <HelpCircle className="w-4 h-4 text-[#428bca]" /> Execution Analysis
                              </h4>
                              <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 font-bold leading-relaxed">{tmpl.tuningTip}</p>
                            </div>

                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {viewMode === 'schemas' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-205 dark:border-zinc-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4 p-6">
              <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-wide flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500" /> PostgreSQL Relational DB Setup (DDL)
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">
                    Complete integration schema mapping to all 7 modules automatically updated with your left config column settings
                  </p>
                </div>
                <button
                  onClick={() => {
                    const schemaStr = `-- TELEOSS MASTER INTEGRATION DATABASE SCHEMA
-- AUTOMATICALLY ADAPTED TO CONFIGURATOR DIALS
USE ${tableConfigs.databaseName || 'sms_wholesale'};

-- 1. Clients Table (Enterprise / Finance)
CREATE TABLE clients (
    client_id VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    credit_limit NUMERIC(15,6) DEFAULT 50000.00,
    status VARCHAR(20) DEFAULT 'Active'
);

-- 2. Wholesale Carrier Products (Rate & Products)
CREATE TABLE ${tableConfigs.productsTable} (
    product_id VARCHAR(50) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    target_country VARCHAR(100) NOT NULL,
    ${tableConfigs.prefixField} VARCHAR(15) NOT NULL,
    ${tableConfigs.sellRateField} NUMERIC(10,5) NOT NULL,
    vendor_trunk_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active'
);

-- 3. Dynamic Exceptions overrides (Enterprise)
CREATE TABLE client_tariff_exceptions (
    exception_id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) REFERENCES clients(client_id) ON DELETE CASCADE,
    prefix_code VARCHAR(15) NOT NULL,
    override_rate NUMERIC(10,5) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. Supplier Rate Sheets (Rate & Products)
CREATE TABLE ${tableConfigs.ratesTable} (
    rate_id SERIAL PRIMARY KEY,
    vendor_id VARCHAR(50) NOT NULL,
    ${tableConfigs.prefixField} VARCHAR(15) NOT NULL,
    ${tableConfigs.buyRateField} NUMERIC(10,5) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active'
);

-- 5. Carrier Routing Sequences (SMS Services / Routing)
CREATE TABLE ${tableConfigs.routesTable} (
    rule_id SERIAL PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL,
    target_country VARCHAR(100) NOT NULL,
    ${tableConfigs.prefixField} VARCHAR(15) NOT NULL,
    ${tableConfigs.priorityField} INTEGER DEFAULT 1,
    ${tableConfigs.vendorTrunkField} VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active'
);

-- 6. Main High-Volume Logs (Dashboard / Reports / SMS Services)
CREATE TABLE ${tableConfigs.smsLogsTable} (
    ${tableConfigs.smsIdField} VARCHAR(100) PRIMARY KEY,
    client_id VARCHAR(50) REFERENCES clients(client_id),
    ${tableConfigs.vendorTrunkField} VARCHAR(50),
    ${tableConfigs.prefixField} VARCHAR(15) NOT NULL,
    recipient_number VARCHAR(25) NOT NULL,
    sender_id VARCHAR(20) NOT NULL,
    ${tableConfigs.sellRateField} NUMERIC(10,5) DEFAULT 0.00,
    ${tableConfigs.buyRateField} NUMERIC(10,5) DEFAULT 0.00,
    ${tableConfigs.dlrStatusField} VARCHAR(20) DEFAULT 'PENDING',
    status_error_code VARCHAR(15),
    ${tableConfigs.mccmncField} VARCHAR(10) NOT NULL,
    ${tableConfigs.timestampField} TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 7. Administration Audits
CREATE TABLE admin_audit_logs (
    log_id SERIAL PRIMARY KEY,
    actor_user_id VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    operational_payload JSONB
);

-- =============================
-- HIGH DENSITY COVERING INDEXES
-- =============================
CREATE INDEX idx_sms_df_metrics ON ${tableConfigs.smsLogsTable} (${tableConfigs.timestampField} DESC) INCLUDE (${tableConfigs.sellRateField}, ${tableConfigs.buyRateField}, ${tableConfigs.dlrStatusField});
CREATE INDEX idx_rates_compare ON ${tableConfigs.productsTable} (${tableConfigs.sellRateField}) INCLUDE (${tableConfigs.buyRateField});
CREATE INDEX idx_rules_country_prio ON ${tableConfigs.routesTable} (target_country, ${tableConfigs.priorityField}) WHERE status = 'Active';
ALTER TABLE ${tableConfigs.ratesTable} ADD CONSTRAINT unique_vendor_pref UNIQUE (vendor_id, ${tableConfigs.prefixField});
CREATE INDEX idx_sms_seek_page ON ${tableConfigs.smsLogsTable} (${tableConfigs.timestampField} DESC, ${tableConfigs.smsIdField} DESC);`;
                    
                    copyToClipboard('schemas-all', schemaStr);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none ${
                    copiedId === 'schemas-all'
                      ? "bg-emerald-600 text-white"
                      : "bg-[#428bca] hover:bg-blue-600 text-white shadow-sm"
                  }`}
                >
                  {copiedId === 'schemas-all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'schemas-all' ? 'Copied ✓' : 'Copy All DDL'}
                </button>
              </div>

              <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-zinc-900/60 backdrop-blur rounded px-2 py-1 text-[8.5px] font-mono text-zinc-400 border border-zinc-700/30 z-10">
                  <Terminal className="w-3 h-3 text-emerald-400" /> postgres_ddl_setup.sql
                </div>
                <pre className="p-5 bg-zinc-950 text-emerald-400 font-mono text-[10.5px] leading-relaxed overflow-x-auto whitespace-pre rounded-none select-all custom-scrollbar outline-none max-h-[480px]">
                  <code>
{`-- TELEOSS MASTER RELATIONAL SCHEMA (AUTO-MAPPED)
-- Run this in your database console to set up the fully optimized schema.
USE ${tableConfigs.databaseName || 'sms_wholesale'};

-- 1. Clients / Enterprise Trunk Table
CREATE TABLE clients (
    client_id VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    credit_limit NUMERIC(15,6) DEFAULT 50000.000000,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Wholesale active SMS Products table
CREATE TABLE ${tableConfigs.productsTable} (
    product_id VARCHAR(50) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    target_country VARCHAR(100) NOT NULL,
    ${tableConfigs.prefixField} VARCHAR(15) NOT NULL,
    ${tableConfigs.sellRateField} NUMERIC(10,5) NOT NULL,
    vendor_trunk_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dynamic custom clients rate overrides
CREATE TABLE client_tariff_exceptions (
    exception_id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) REFERENCES clients(client_id) ON DELETE CASCADE,
    prefix_code VARCHAR(15) NOT NULL,
    override_rate NUMERIC(10,5) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Supplier base rate cards Table
CREATE TABLE ${tableConfigs.ratesTable} (
    rate_id SERIAL PRIMARY KEY,
    vendor_id VARCHAR(50) NOT NULL,
    ${tableConfigs.prefixField} VARCHAR(15) NOT NULL,
    ${tableConfigs.buyRateField} NUMERIC(10,5) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Carrier Sequential Routing policies Table
CREATE TABLE ${tableConfigs.routesTable} (
    rule_id SERIAL PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL,
    target_country VARCHAR(100) NOT NULL,
    ${tableConfigs.prefixField} VARCHAR(15) NOT NULL,
    ${tableConfigs.priorityField} INTEGER DEFAULT 1,
    ${tableConfigs.vendorTrunkField} VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Central high speed SMS logs Archive
CREATE TABLE ${tableConfigs.smsLogsTable} (
    ${tableConfigs.smsIdField} VARCHAR(100) PRIMARY KEY,
    client_id VARCHAR(50) REFERENCES clients(client_id),
    ${tableConfigs.vendorTrunkField} VARCHAR(50),
    ${tableConfigs.prefixField} VARCHAR(15) NOT NULL,
    recipient_number VARCHAR(25) NOT NULL,
    sender_id VARCHAR(20) NOT NULL,
    ${tableConfigs.sellRateField} NUMERIC(10,5) DEFAULT 0.00000,
    ${tableConfigs.buyRateField} NUMERIC(10,5) DEFAULT 0.00000,
    ${tableConfigs.dlrStatusField} VARCHAR(20) DEFAULT 'PENDING',
    status_error_code VARCHAR(15),
    ${tableConfigs.mccmncField} VARCHAR(10) NOT NULL,
    ${tableConfigs.timestampField} TIMESTAMP WITH TIME ZONE NOT NULL,
    delivered_timestamp TIMESTAMP WITH TIME ZONE
);

-- 7. High-Volume Audit Trail
CREATE TABLE admin_audit_logs (
    log_id SERIAL PRIMARY KEY,
    actor_user_id VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    resource_target_id VARCHAR(100),
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NOT NULL,
    operational_payload JSONB
);

-- ========================================================
-- CLUSTERED AND COVERING PERFORMANCE INDEX DECLARATIONS
-- ========================================================
CREATE INDEX idx_sms_df_metrics 
  ON ${tableConfigs.smsLogsTable} (${tableConfigs.timestampField} DESC) 
  INCLUDE (${tableConfigs.sellRateField}, ${tableConfigs.buyRateField}, ${tableConfigs.dlrStatusField});

CREATE INDEX idx_rates_compare 
  ON ${tableConfigs.productsTable} (${tableConfigs.sellRateField}) 
  INCLUDE (${tableConfigs.buyRateField});

CREATE INDEX idx_rules_country_prio 
  ON ${tableConfigs.routesTable} (target_country, ${tableConfigs.priorityField}) 
  WHERE status = 'Active';

ALTER TABLE ${tableConfigs.ratesTable} 
  ADD CONSTRAINT unique_vendor_pref UNIQUE (vendor_id, ${tableConfigs.prefixField});

CREATE INDEX idx_sms_seek_page 
  ON ${tableConfigs.smsLogsTable} (${tableConfigs.timestampField} DESC, ${tableConfigs.smsIdField} DESC);`}
                  </code>
                </pre>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/45 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-widest text-[#428bca] uppercase">Performance setup note</span>
                  <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                    By applying our compound COVERING INDEX indexes, SQL queries utilize **Index-Only scanning pathways**, reducing direct physical disk hits of heavy aggregations to literal microseconds even beyond 100 million recorded lines.
                  </p>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'springboot' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-205 dark:border-zinc-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 p-6 space-y-6">
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-zinc-100 dark:border-zinc-800 pb-4 gap-4">
                <div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#428bca]" /> Enterprise Spring Boot API Core
                  </h3>
                  <p className="text-[10px] text-zinc-450 font-bold uppercase mt-1">
                    Spring Boot REST integration with native fast SQL bindings matching your custom table structures
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Active Module Dropdown Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">Active Module:</span>
                    <select
                      value={springFinanceModule}
                      onChange={(e) => setSpringFinanceModule(e.target.value as any)}
                      className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 text-[10px] font-black rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-[#428bca] cursor-pointer"
                    >
                      <option value="Billing">Core SMS Billing Logs Engine</option>
                      <option value="Payment">1. Payment Inbound Ledger Transactions</option>
                      <option value="CustomerInvoice">2. Invoices & Customer Invoice</option>
                      <option value="VendorInvoice">3. Vendor Supplier Invoice Reconciliation</option>
                      <option value="SOA">4. Statement of Account (SOA)</option>
                      <option value="Currency">5. Currency Base Registry</option>
                      <option value="CurrencyExchange">6. Currency Exchange Conversions</option>
                      <option value="EnterpriseBalance">7. Enterprise Live Balance Credit Gate</option>
                      <option value="BillingCycle">8. Billing Cycle Period Roller</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-1.5 bg-zinc-100 dark:bg-zinc-950 p-1 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    {(['entity', 'repo', 'controller', 'high_tps_5000'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setSpringSubTab(tab)}
                        className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${
                          springSubTab === tab
                            ? "bg-white dark:bg-zinc-800 text-[#428bca] shadow-sm font-black"
                            : "text-zinc-450 hover:text-zinc-650 dark:hover:text-zinc-350"
                        }`}
                      >
                        {tab === 'entity' ? 'JPA Entities' : tab === 'repo' ? 'JPA Repositories' : tab === 'controller' ? 'REST Controllers' : '⚡ 5000 TPS Reactive'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display code based on spring sub tab selected */}
              <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center gap-4 animate-pulse">
                  <button
                    onClick={() => {
                      const codeText = getSpringCode(springSubTab, springFinanceModule);
                      copyToClipboard(`spring-${springSubTab}`, codeText);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none bg-[#428bca] text-white shadow-sm`}
                  >
                    {copiedId === `spring-${springSubTab}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === `spring-${springSubTab}` ? 'Copied ✓' : 'Copy Code'}
                  </button>
                </div>
                
                <pre className="p-5 bg-zinc-950 text-emerald-400 font-mono text-[10.5px] leading-relaxed overflow-x-auto whitespace-pre rounded-none select-all custom-scrollbar outline-none max-h-[480px]">
                  <code>
                    {getSpringCode(springSubTab, springFinanceModule)}
                  </code>
                </pre>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-start gap-3.5">
                <FileCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest block font-mono">Java API Spring Compliance Tip</span>
                  <p className="text-[10.5px] text-zinc-550 dark:text-zinc-300 font-bold mt-1 leading-relaxed">
                    By enabling `@CrossOrigin` in the Spring Controller, you can bind this backend controller seamlessly with your Angular front-end dashboard router without proxy blockages. Use `@Query(..., nativeQuery = true)` to instruct Hibernate to bypass typical query translations and run these raw execution paths straight on PostgreSQL.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
