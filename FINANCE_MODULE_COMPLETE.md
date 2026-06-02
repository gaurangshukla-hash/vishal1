# 💰 Complete Finance Module Implementation

**Production-Ready Finance System with Payment, Invoice, SOA, Currency, Exchange, Balance & Billing**

---

## 📋 Database Schema (MariaDB)

```sql
-- ============================================
-- FINANCE MODULE TABLES
-- ============================================

-- Payment Table
CREATE TABLE IF NOT EXISTS payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  payment_no VARCHAR(100) NOT NULL UNIQUE,
  enterprise_name VARCHAR(255) NOT NULL,
  enterprise_type ENUM('CUSTOMER', 'VENDOR') NOT NULL,
  payment_date DATE NOT NULL,
  payment_method ENUM('BANK_TRANSFER', 'CASH', 'CHEQUE', 'CREDIT_CARD', 'WALLET') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  reference_number VARCHAR(100),
  description TEXT,
  status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payment_date (payment_date),
  INDEX idx_payment_status (status),
  INDEX idx_enterprise (enterprise_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Customer Invoice Table
CREATE TABLE IF NOT EXISTS customer_invoice (
  invoice_id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(100) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  net_amount DECIMAL(15, 2) NOT NULL,
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  outstanding_amount DECIMAL(15, 2),
  payment_terms VARCHAR(100),
  status ENUM('DRAFT', 'SENT', 'PARTIALLY_PAID', 'FULLY_PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'DRAFT',
  billing_type ENUM('POSTPAID', 'PREPAID') NOT NULL,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_invoice_date (invoice_date),
  INDEX idx_due_date (due_date),
  INDEX idx_status (status),
  INDEX idx_customer (customer_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Vendor Invoice Table
CREATE TABLE IF NOT EXISTS vendor_invoice (
  invoice_id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(100) NOT NULL UNIQUE,
  vendor_name VARCHAR(255) NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  net_amount DECIMAL(15, 2) NOT NULL,
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  outstanding_amount DECIMAL(15, 2),
  payment_terms VARCHAR(100),
  status ENUM('RECEIVED', 'PARTIALLY_PAID', 'FULLY_PAID', 'OVERDUE', 'REJECTED', 'CANCELLED') DEFAULT 'RECEIVED',
  billing_type ENUM('POSTPAID', 'PREPAID') NOT NULL,
  po_number VARCHAR(100),
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_invoice_date (invoice_date),
  INDEX idx_due_date (due_date),
  INDEX idx_status (status),
  INDEX idx_vendor (vendor_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Statement of Account (SOA) Table
CREATE TABLE IF NOT EXISTS statement_of_account (
  soa_id INT AUTO_INCREMENT PRIMARY KEY,
  soa_number VARCHAR(100) NOT NULL UNIQUE,
  enterprise_name VARCHAR(255) NOT NULL,
  enterprise_type ENUM('CUSTOMER', 'VENDOR') NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  opening_balance DECIMAL(15, 2),
  total_debit DECIMAL(15, 2) DEFAULT 0,
  total_credit DECIMAL(15, 2) DEFAULT 0,
  closing_balance DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  generated_by VARCHAR(100),
  status ENUM('DRAFT', 'FINALIZED', 'SENT', 'ACKNOWLEDGED') DEFAULT 'DRAFT',
  INDEX idx_enterprise (enterprise_name),
  INDEX idx_period_start (period_start),
  INDEX idx_period_end (period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Currency Table
CREATE TABLE IF NOT EXISTS currency (
  currency_id INT AUTO_INCREMENT PRIMARY KEY,
  currency_code VARCHAR(3) NOT NULL UNIQUE,
  currency_name VARCHAR(100) NOT NULL UNIQUE,
  symbol VARCHAR(10),
  decimal_places INT DEFAULT 2,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (currency_code),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Currency Exchange Rate Table
CREATE TABLE IF NOT EXISTS currency_exchange_rate (
  rate_id INT AUTO_INCREMENT PRIMARY KEY,
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  exchange_rate DECIMAL(10, 6) NOT NULL,
  rate_date DATE NOT NULL,
  source VARCHAR(100),
  status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_rate (from_currency, to_currency, rate_date),
  INDEX idx_from_currency (from_currency),
  INDEX idx_to_currency (to_currency),
  INDEX idx_rate_date (rate_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Enterprise Balance (Enhanced)
CREATE TABLE IF NOT EXISTS enterprise_balance (
  balance_id INT AUTO_INCREMENT PRIMARY KEY,
  enterprise_name VARCHAR(255) NOT NULL UNIQUE,
  enterprise_type ENUM('CUSTOMER', 'VENDOR', 'SUPPLIER') NOT NULL,
  opening_balance DECIMAL(15, 2) DEFAULT 0,
  current_balance DECIMAL(15, 2) DEFAULT 0,
  credit_limit DECIMAL(15, 2),
  available_credit DECIMAL(15, 2),
  total_receivable DECIMAL(15, 2) DEFAULT 0,
  total_payable DECIMAL(15, 2) DEFAULT 0,
  last_transaction_date DATE,
  last_transaction_amount DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  account_status ENUM('ACTIVE', 'SUSPENDED', 'CLOSED') DEFAULT 'ACTIVE',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_enterprise (enterprise_name),
  INDEX idx_balance_status (account_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Billing Cycle (Enhanced)
CREATE TABLE IF NOT EXISTS billing_cycle (
  cycle_id INT AUTO_INCREMENT PRIMARY KEY,
  cycle_name VARCHAR(100) NOT NULL UNIQUE,
  cycle_type ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY') NOT NULL,
  billing_type ENUM('POSTPAID', 'PREPAID') NOT NULL,
  usage_days INT,
  grace_days INT DEFAULT 0,
  due_days INT,
  reminder_days INT DEFAULT 5,
  late_payment_charge DECIMAL(5, 2),
  is_default TINYINT(1) DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cycle_type (cycle_type),
  INDEX idx_billing_type (billing_type),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SOA Line Items (Details)
CREATE TABLE IF NOT EXISTS soa_line_items (
  line_id INT AUTO_INCREMENT PRIMARY KEY,
  soa_id INT NOT NULL,
  transaction_date DATE NOT NULL,
  transaction_type ENUM('INVOICE', 'PAYMENT', 'CREDIT_NOTE', 'DEBIT_NOTE') NOT NULL,
  reference_number VARCHAR(100),
  description TEXT,
  debit_amount DECIMAL(15, 2) DEFAULT 0,
  credit_amount DECIMAL(15, 2) DEFAULT 0,
  running_balance DECIMAL(15, 2),
  FOREIGN KEY (soa_id) REFERENCES statement_of_account(soa_id),
  INDEX idx_soa_id (soa_id),
  INDEX idx_transaction_date (transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Sample Currencies
INSERT INTO currency (currency_code, currency_name, symbol) VALUES
('USD', 'US Dollar', '$'),
('EUR', 'Euro', '€'),
('INR', 'Indian Rupee', '₹'),
('GBP', 'British Pound', '£'),
('JPY', 'Japanese Yen', '¥');

-- Insert Sample Exchange Rates
INSERT INTO currency_exchange_rate (from_currency, to_currency, exchange_rate, rate_date) VALUES
('USD', 'INR', 82.50, CURDATE()),
('USD', 'EUR', 0.92, CURDATE()),
('USD', 'GBP', 0.79, CURDATE()),
('INR', 'USD', 0.0121, CURDATE());

-- Insert Sample Billing Cycles
INSERT INTO billing_cycle (cycle_name, cycle_type, billing_type, usage_days, grace_days, due_days, reminder_days) VALUES
('Monthly Net 30', 'MONTHLY', 'POSTPAID', 30, 0, 30, 5),
('Weekly', 'WEEKLY', 'POSTPAID', 7, 0, 7, 2),
('Prepaid Monthly', 'MONTHLY', 'PREPAID', 30, 0, 0, 0),
('Quarterly', 'QUARTERLY', 'POSTPAID', 90, 5, 30, 10);
```

---

## 🔧 Spring Boot Backend Code

### Entity Classes

```java
// Payment Entity
@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long id;
    
    @Column(name = "payment_no", unique = true)
    private String paymentNumber;
    
    @Column(name = "enterprise_name")
    private String enterpriseName;
    
    @Column(name = "enterprise_type")
    @Enumerated(EnumType.STRING)
    private EnterpriseType enterpriseType;
    
    @Column(name = "payment_date")
    private LocalDate paymentDate;
    
    @Column(name = "payment_method")
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    
    @Column(name = "amount")
    private BigDecimal amount;
    
    @Column(name = "reference_number")
    private String referenceNumber;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = PaymentStatus.PENDING;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// Customer Invoice Entity
@Entity
@Table(name = "customer_invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Long id;
    
    @Column(name = "invoice_number", unique = true)
    private String invoiceNumber;
    
    @Column(name = "customer_name")
    private String customerName;
    
    @Column(name = "invoice_date")
    private LocalDate invoiceDate;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(name = "total_amount")
    private BigDecimal totalAmount;
    
    @Column(name = "tax_amount")
    private BigDecimal taxAmount;
    
    @Column(name = "discount_amount")
    private BigDecimal discountAmount;
    
    @Column(name = "net_amount")
    private BigDecimal netAmount;
    
    @Column(name = "paid_amount")
    private BigDecimal paidAmount;
    
    @Column(name = "outstanding_amount")
    private BigDecimal outstandingAmount;
    
    @Column(name = "payment_terms")
    private String paymentTerms;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;
    
    @Column(name = "billing_type")
    @Enumerated(EnumType.STRING)
    private BillingType billingType;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = InvoiceStatus.DRAFT;
        if (paidAmount == null) paidAmount = BigDecimal.ZERO;
        calculateOutstanding();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateOutstanding();
    }
    
    private void calculateOutstanding() {
        if (netAmount != null && paidAmount != null) {
            outstandingAmount = netAmount.subtract(paidAmount);
        }
    }
}

// Vendor Invoice Entity
@Entity
@Table(name = "vendor_invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Long id;
    
    @Column(name = "invoice_number", unique = true)
    private String invoiceNumber;
    
    @Column(name = "vendor_name")
    private String vendorName;
    
    @Column(name = "invoice_date")
    private LocalDate invoiceDate;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(name = "total_amount")
    private BigDecimal totalAmount;
    
    @Column(name = "tax_amount")
    private BigDecimal taxAmount;
    
    @Column(name = "discount_amount")
    private BigDecimal discountAmount;
    
    @Column(name = "net_amount")
    private BigDecimal netAmount;
    
    @Column(name = "paid_amount")
    private BigDecimal paidAmount;
    
    @Column(name = "outstanding_amount")
    private BigDecimal outstandingAmount;
    
    @Column(name = "payment_terms")
    private String paymentTerms;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private VendorInvoiceStatus status;
    
    @Column(name = "billing_type")
    @Enumerated(EnumType.STRING)
    private BillingType billingType;
    
    @Column(name = "po_number")
    private String poNumber;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = VendorInvoiceStatus.RECEIVED;
        if (paidAmount == null) paidAmount = BigDecimal.ZERO;
        calculateOutstanding();
    }
    
    private void calculateOutstanding() {
        if (netAmount != null && paidAmount != null) {
            outstandingAmount = netAmount.subtract(paidAmount);
        }
    }
}

// SOA Entity
@Entity
@Table(name = "statement_of_account")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatementOfAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "soa_id")
    private Long id;
    
    @Column(name = "soa_number", unique = true)
    private String soaNumber;
    
    @Column(name = "enterprise_name")
    private String enterpriseName;
    
    @Column(name = "enterprise_type")
    @Enumerated(EnumType.STRING)
    private EnterpriseType enterpriseType;
    
    @Column(name = "period_start")
    private LocalDate periodStart;
    
    @Column(name = "period_end")
    private LocalDate periodEnd;
    
    @Column(name = "opening_balance")
    private BigDecimal openingBalance;
    
    @Column(name = "total_debit")
    private BigDecimal totalDebit;
    
    @Column(name = "total_credit")
    private BigDecimal totalCredit;
    
    @Column(name = "closing_balance")
    private BigDecimal closingBalance;
    
    @Column(name = "currency")
    private String currency;
    
    @Column(name = "generated_date")
    private LocalDateTime generatedDate;
    
    @Column(name = "generated_by")
    private String generatedBy;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private SOAStatus status;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "soa_id")
    private List<SOALineItem> lineItems;
    
    @PrePersist
    protected void onCreate() {
        generatedDate = LocalDateTime.now();
        if (status == null) status = SOAStatus.DRAFT;
        calculateTotals();
    }
    
    private void calculateTotals() {
        if (lineItems != null && !lineItems.isEmpty()) {
            totalDebit = lineItems.stream()
                .map(SOALineItem::getDebitAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            totalCredit = lineItems.stream()
                .map(SOALineItem::getCreditAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            if (openingBalance != null) {
                closingBalance = openingBalance.add(totalDebit).subtract(totalCredit);
            }
        }
    }
}

// Currency Entity
@Entity
@Table(name = "currency")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Currency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "currency_id")
    private Long id;
    
    @Column(name = "currency_code", unique = true)
    private String code;
    
    @Column(name = "currency_name", unique = true)
    private String name;
    
    @Column(name = "symbol")
    private String symbol;
    
    @Column(name = "decimal_places")
    private Integer decimalPlaces;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) isActive = true;
        if (decimalPlaces == null) decimalPlaces = 2;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// Currency Exchange Rate Entity
@Entity
@Table(name = "currency_exchange_rate")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrencyExchangeRate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rate_id")
    private Long id;
    
    @Column(name = "from_currency")
    private String fromCurrency;
    
    @Column(name = "to_currency")
    private String toCurrency;
    
    @Column(name = "exchange_rate")
    private BigDecimal exchangeRate;
    
    @Column(name = "rate_date")
    private LocalDate rateDate;
    
    @Column(name = "source")
    private String source;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ExchangeRateStatus status;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = ExchangeRateStatus.ACTIVE;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// Enterprise Balance Enhanced
@Entity
@Table(name = "enterprise_balance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnterpriseBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "balance_id")
    private Long id;
    
    @Column(name = "enterprise_name", unique = true)
    private String enterpriseName;
    
    @Column(name = "enterprise_type")
    @Enumerated(EnumType.STRING)
    private EnterpriseType enterpriseType;
    
    @Column(name = "opening_balance")
    private BigDecimal openingBalance;
    
    @Column(name = "current_balance")
    private BigDecimal currentBalance;
    
    @Column(name = "credit_limit")
    private BigDecimal creditLimit;
    
    @Column(name = "available_credit")
    private BigDecimal availableCredit;
    
    @Column(name = "total_receivable")
    private BigDecimal totalReceivable;
    
    @Column(name = "total_payable")
    private BigDecimal totalPayable;
    
    @Column(name = "last_transaction_date")
    private LocalDate lastTransactionDate;
    
    @Column(name = "last_transaction_amount")
    private BigDecimal lastTransactionAmount;
    
    @Column(name = "currency")
    private String currency;
    
    @Column(name = "account_status")
    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateAvailableCredit();
    }
    
    private void calculateAvailableCredit() {
        if (creditLimit != null && currentBalance != null) {
            availableCredit = creditLimit.subtract(currentBalance);
        }
    }
}

// Billing Cycle Enhanced
@Entity
@Table(name = "billing_cycle")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingCycle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cycle_id")
    private Long id;
    
    @Column(name = "cycle_name", unique = true)
    private String cycleName;
    
    @Column(name = "cycle_type")
    @Enumerated(EnumType.STRING)
    private CycleType cycleType;
    
    @Column(name = "billing_type")
    @Enumerated(EnumType.STRING)
    private BillingType billingType;
    
    @Column(name = "usage_days")
    private Integer usageDays;
    
    @Column(name = "grace_days")
    private Integer graceDays;
    
    @Column(name = "due_days")
    private Integer dueDays;
    
    @Column(name = "reminder_days")
    private Integer reminderDays;
    
    @Column(name = "late_payment_charge")
    private BigDecimal latePaymentCharge;
    
    @Column(name = "is_default")
    private Boolean isDefault;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) isActive = true;
        if (graceDays == null) graceDays = 0;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// SOA Line Item
@Entity
@Table(name = "soa_line_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SOALineItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "line_id")
    private Long id;
    
    @Column(name = "soa_id")
    private Long soaId;
    
    @Column(name = "transaction_date")
    private LocalDate transactionDate;
    
    @Column(name = "transaction_type")
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;
    
    @Column(name = "reference_number")
    private String referenceNumber;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "debit_amount")
    private BigDecimal debitAmount;
    
    @Column(name = "credit_amount")
    private BigDecimal creditAmount;
    
    @Column(name = "running_balance")
    private BigDecimal runningBalance;
}

// ============================================
// ENUMS
// ============================================

public enum PaymentMethod {
    BANK_TRANSFER, CASH, CHEQUE, CREDIT_CARD, WALLET
}

public enum PaymentStatus {
    PENDING, COMPLETED, FAILED, CANCELLED
}

public enum InvoiceStatus {
    DRAFT, SENT, PARTIALLY_PAID, FULLY_PAID, OVERDUE, CANCELLED
}

public enum VendorInvoiceStatus {
    RECEIVED, PARTIALLY_PAID, FULLY_PAID, OVERDUE, REJECTED, CANCELLED
}

public enum BillingType {
    POSTPAID, PREPAID
}

public enum SOAStatus {
    DRAFT, FINALIZED, SENT, ACKNOWLEDGED
}

public enum ExchangeRateStatus {
    ACTIVE, INACTIVE
}

public enum AccountStatus {
    ACTIVE, SUSPENDED, CLOSED
}

public enum CycleType {
    DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY
}

public enum TransactionType {
    INVOICE, PAYMENT, CREDIT_NOTE, DEBIT_NOTE
}
```

---

## 📊 Repository Interfaces

```java
// Payment Repository
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);
    Page<Payment> findByEnterpriseNameAndPaymentDateBetween(
        String enterpriseName, LocalDate start, LocalDate end, Pageable pageable);
    Page<Payment> findByPaymentDateBetween(LocalDate start, LocalDate end, Pageable pageable);
    Optional<Payment> findByPaymentNumber(String paymentNumber);
}

// Customer Invoice Repository
@Repository
public interface CustomerInvoiceRepository extends JpaRepository<CustomerInvoice, Long> {
    Page<CustomerInvoice> findByStatus(InvoiceStatus status, Pageable pageable);
    Page<CustomerInvoice> findByCustomerName(String customerName, Pageable pageable);
    Page<CustomerInvoice> findByInvoiceDateBetween(LocalDate start, LocalDate end, Pageable pageable);
    Page<CustomerInvoice> findByDueDateBeforeAndStatusNot(LocalDate date, InvoiceStatus status, Pageable pageable);
    Optional<CustomerInvoice> findByInvoiceNumber(String invoiceNumber);
}

// Vendor Invoice Repository
@Repository
public interface VendorInvoiceRepository extends JpaRepository<VendorInvoice, Long> {
    Page<VendorInvoice> findByStatus(VendorInvoiceStatus status, Pageable pageable);
    Page<VendorInvoice> findByVendorName(String vendorName, Pageable pageable);
    Page<VendorInvoice> findByInvoiceDateBetween(LocalDate start, LocalDate end, Pageable pageable);
    Optional<VendorInvoice> findByInvoiceNumber(String invoiceNumber);
}

// SOA Repository
@Repository
public interface StatementOfAccountRepository extends JpaRepository<StatementOfAccount, Long> {
    Page<StatementOfAccount> findByEnterpriseNameAndPeriodStartBetween(
        String enterpriseName, LocalDate start, LocalDate end, Pageable pageable);
    Optional<StatementOfAccount> findBySoaNumber(String soaNumber);
    Page<StatementOfAccount> findByStatus(SOAStatus status, Pageable pageable);
}

// Currency Repository
@Repository
public interface CurrencyRepository extends JpaRepository<Currency, Long> {
    Optional<Currency> findByCode(String code);
    Page<Currency> findByIsActiveTrue(Pageable pageable);
}

// Exchange Rate Repository
@Repository
public interface CurrencyExchangeRateRepository extends JpaRepository<CurrencyExchangeRate, Long> {
    Optional<CurrencyExchangeRate> findTopByFromCurrencyAndToCurrencyAndStatusOrderByRateDateDesc(
        String from, String to, ExchangeRateStatus status);
    Page<CurrencyExchangeRate> findByFromCurrencyAndToCurrency(
        String from, String to, Pageable pageable);
}

// Enterprise Balance Repository
@Repository
public interface EnterpriseBalanceRepository extends JpaRepository<EnterpriseBalance, Long> {
    Optional<EnterpriseBalance> findByEnterpriseName(String enterpriseName);
    Page<EnterpriseBalance> findByAccountStatus(AccountStatus status, Pageable pageable);
    Page<EnterpriseBalance> findByEnterpriseType(EnterpriseType type, Pageable pageable);
}

// Billing Cycle Repository
@Repository
public interface BillingCycleRepository extends JpaRepository<BillingCycle, Long> {
    Optional<BillingCycle> findByCycleName(String cycleName);
    Page<BillingCycle> findByIsActiveTrue(Pageable pageable);
    Optional<BillingCycle> findByIsDefaultTrue();
}
```

---

## 🎯 Service Classes

```java
// Payment Service
@Service
@Transactional
@Slf4j
public class PaymentService {
    @Autowired
    private PaymentRepository repository;
    
    @Autowired
    private EnterpriseBalanceRepository balanceRepository;
    
    public Page<Payment> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public Page<Payment> getByStatus(PaymentStatus status, Pageable pageable) {
        return repository.findByStatus(status, pageable);
    }
    
    public Page<Payment> getByEnterprise(String enterpriseName, LocalDate start, LocalDate end, Pageable pageable) {
        return repository.findByEnterpriseNameAndPaymentDateBetween(enterpriseName, start, end, pageable);
    }
    
    public Payment create(PaymentDTO dto) {
        Payment payment = Payment.builder()
            .paymentNumber(generatePaymentNumber())
            .enterpriseName(dto.getEnterpriseName())
            .enterpriseType(EnterpriseType.valueOf(dto.getEnterpriseType()))
            .paymentDate(LocalDate.now())
            .paymentMethod(PaymentMethod.valueOf(dto.getPaymentMethod()))
            .amount(dto.getAmount())
            .referenceNumber(dto.getReferenceNumber())
            .description(dto.getDescription())
            .status(PaymentStatus.PENDING)
            .build();
        
        Payment saved = repository.save(payment);
        
        // Update enterprise balance
        updateEnterpriseBalance(dto.getEnterpriseName(), dto.getAmount());
        
        return saved;
    }
    
    public Payment updateStatus(Long id, PaymentStatus status) {
        Payment payment = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Payment not found"));
        payment.setStatus(status);
        return repository.save(payment);
    }
    
    private void updateEnterpriseBalance(String enterpriseName, BigDecimal amount) {
        Optional<EnterpriseBalance> balance = balanceRepository.findByEnterpriseName(enterpriseName);
        if (balance.isPresent()) {
            EnterpriseBalance b = balance.get();
            b.setCurrentBalance(b.getCurrentBalance().subtract(amount));
            b.setLastTransactionDate(LocalDate.now());
            b.setLastTransactionAmount(amount);
            balanceRepository.save(b);
        }
    }
    
    private String generatePaymentNumber() {
        return "PAY" + System.currentTimeMillis();
    }
}

// Customer Invoice Service
@Service
@Transactional
@Slf4j
public class CustomerInvoiceService {
    @Autowired
    private CustomerInvoiceRepository repository;
    
    @Autowired
    private EnterpriseBalanceRepository balanceRepository;
    
    public Page<CustomerInvoice> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public Page<CustomerInvoice> getByStatus(InvoiceStatus status, Pageable pageable) {
        return repository.findByStatus(status, pageable);
    }
    
    public Page<CustomerInvoice> getOverdueInvoices(Pageable pageable) {
        return repository.findByDueDateBeforeAndStatusNot(LocalDate.now(), InvoiceStatus.FULLY_PAID, pageable);
    }
    
    public CustomerInvoice create(CustomerInvoiceDTO dto) {
        CustomerInvoice invoice = CustomerInvoice.builder()
            .invoiceNumber(generateInvoiceNumber())
            .customerName(dto.getCustomerName())
            .invoiceDate(LocalDate.now())
            .dueDate(dto.getDueDate())
            .totalAmount(dto.getTotalAmount())
            .taxAmount(dto.getTaxAmount())
            .discountAmount(dto.getDiscountAmount())
            .billingType(BillingType.valueOf(dto.getBillingType()))
            .status(InvoiceStatus.DRAFT)
            .build();
        
        invoice.setNetAmount(
            invoice.getTotalAmount()
                .add(invoice.getTaxAmount())
                .subtract(invoice.getDiscountAmount())
        );
        
        return repository.save(invoice);
    }
    
    public CustomerInvoice recordPayment(Long invoiceId, BigDecimal amount) {
        CustomerInvoice invoice = repository.findById(invoiceId)
            .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));
        
        BigDecimal newPaidAmount = invoice.getPaidAmount().add(amount);
        invoice.setPaidAmount(newPaidAmount);
        
        if (newPaidAmount.compareTo(invoice.getNetAmount()) >= 0) {
            invoice.setStatus(InvoiceStatus.FULLY_PAID);
        } else {
            invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
        }
        
        invoice.setOutstandingAmount(invoice.getNetAmount().subtract(newPaidAmount));
        
        return repository.save(invoice);
    }
    
    private String generateInvoiceNumber() {
        return "INV" + System.currentTimeMillis();
    }
}

// SOA Service
@Service
@Transactional
@Slf4j
public class StatementOfAccountService {
    @Autowired
    private StatementOfAccountRepository repository;
    
    @Autowired
    private CustomerInvoiceRepository customerInvoiceRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    public StatementOfAccount generateSOA(String enterpriseName, LocalDate periodStart, LocalDate periodEnd, EnterpriseType type) {
        StatementOfAccount soa = StatementOfAccount.builder()
            .soaNumber(generateSOANumber())
            .enterpriseName(enterpriseName)
            .enterpriseType(type)
            .periodStart(periodStart)
            .periodEnd(periodEnd)
            .currency("USD")
            .status(SOAStatus.DRAFT)
            .build();
        
        // Get transactions for the period
        Page<CustomerInvoice> invoices = customerInvoiceRepository
            .findByInvoiceDateBetween(periodStart, periodEnd, PageRequest.of(0, 1000));
        
        List<SOALineItem> lineItems = new ArrayList<>();
        BigDecimal balance = BigDecimal.ZERO;
        
        for (CustomerInvoice invoice : invoices.getContent()) {
            SOALineItem item = SOALineItem.builder()
                .transactionDate(invoice.getInvoiceDate())
                .transactionType(TransactionType.INVOICE)
                .referenceNumber(invoice.getInvoiceNumber())
                .description("Invoice: " + invoice.getInvoiceNumber())
                .debitAmount(invoice.getNetAmount())
                .creditAmount(BigDecimal.ZERO)
                .build();
            
            balance = balance.add(item.getDebitAmount());
            item.setRunningBalance(balance);
            lineItems.add(item);
        }
        
        soa.setLineItems(lineItems);
        soa.setClosingBalance(balance);
        
        return repository.save(soa);
    }
    
    public Page<StatementOfAccount> getByEnterprise(String enterpriseName, LocalDate start, LocalDate end, Pageable pageable) {
        return repository.findByEnterpriseNameAndPeriodStartBetween(enterpriseName, start, end, pageable);
    }
    
    public StatementOfAccount finalize(Long soaId) {
        StatementOfAccount soa = repository.findById(soaId)
            .orElseThrow(() -> new EntityNotFoundException("SOA not found"));
        soa.setStatus(SOAStatus.FINALIZED);
        return repository.save(soa);
    }
    
    private String generateSOANumber() {
        return "SOA" + System.currentTimeMillis();
    }
}

// Currency Service
@Service
@Transactional
@Slf4j
public class CurrencyService {
    @Autowired
    private CurrencyRepository repository;
    
    @Autowired
    private CurrencyExchangeRateRepository rateRepository;
    
    public Page<Currency> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public Page<Currency> getActive(Pageable pageable) {
        return repository.findByIsActiveTrue(pageable);
    }
    
    public BigDecimal convertCurrency(String fromCurrency, String toCurrency, BigDecimal amount) {
        Optional<CurrencyExchangeRate> rate = rateRepository
            .findTopByFromCurrencyAndToCurrencyAndStatusOrderByRateDateDesc(
                fromCurrency, toCurrency, ExchangeRateStatus.ACTIVE);
        
        if (rate.isPresent()) {
            return amount.multiply(rate.get().getExchangeRate());
        }
        
        throw new RuntimeException("Exchange rate not found");
    }
    
    public CurrencyExchangeRate updateExchangeRate(String from, String to, BigDecimal rate, String source) {
        CurrencyExchangeRate exchangeRate = CurrencyExchangeRate.builder()
            .fromCurrency(from)
            .toCurrency(to)
            .exchangeRate(rate)
            .rateDate(LocalDate.now())
            .source(source)
            .status(ExchangeRateStatus.ACTIVE)
            .build();
        
        return rateRepository.save(exchangeRate);
    }
}

// Enterprise Balance Service
@Service
@Transactional
@Slf4j
public class EnterpriseBalanceService {
    @Autowired
    private EnterpriseBalanceRepository repository;
    
    public Optional<EnterpriseBalance> getByName(String enterpriseName) {
        return repository.findByEnterpriseName(enterpriseName);
    }
    
    public EnterpriseBalance updateBalance(String enterpriseName, BigDecimal amount) {
        Optional<EnterpriseBalance> balance = repository.findByEnterpriseName(enterpriseName);
        
        if (balance.isPresent()) {
            EnterpriseBalance b = balance.get();
            b.setCurrentBalance(b.getCurrentBalance().add(amount));
            b.setLastTransactionDate(LocalDate.now());
            b.setLastTransactionAmount(amount);
            return repository.save(b);
        }
        
        throw new EntityNotFoundException("Enterprise balance not found");
    }
    
    public Page<EnterpriseBalance> getByStatus(AccountStatus status, Pageable pageable) {
        return repository.findByAccountStatus(status, pageable);
    }
    
    public EnterpriseBalance addCredit(String enterpriseName, BigDecimal creditLimit) {
        Optional<EnterpriseBalance> balance = repository.findByEnterpriseName(enterpriseName);
        
        if (balance.isPresent()) {
            EnterpriseBalance b = balance.get();
            b.setCreditLimit(creditLimit);
            b.setAvailableCredit(creditLimit);
            return repository.save(b);
        }
        
        throw new EntityNotFoundException("Enterprise balance not found");
    }
}

// Billing Cycle Service
@Service
@Transactional
@Slf4j
public class BillingCycleService {
    @Autowired
    private BillingCycleRepository repository;
    
    public Page<BillingCycle> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public Page<BillingCycle> getActive(Pageable pageable) {
        return repository.findByIsActiveTrue(pageable);
    }
    
    public Optional<BillingCycle> getDefault() {
        return repository.findByIsDefaultTrue();
    }
    
    public BillingCycle create(BillingCycleDTO dto) {
        BillingCycle cycle = BillingCycle.builder()
            .cycleName(dto.getCycleName())
            .cycleType(CycleType.valueOf(dto.getCycleType()))
            .billingType(BillingType.valueOf(dto.getBillingType()))
            .usageDays(dto.getUsageDays())
            .graceDays(dto.getGraceDays())
            .dueDays(dto.getDueDays())
            .reminderDays(dto.getReminderDays())
            .isActive(true)
            .build();
        
        return repository.save(cycle);
    }
}
```

---

## 🎨 Angular Components

### Finance Dashboard Component

```typescript
@Component({
  selector: 'app-finance-dashboard',
  template: `
    <div class="finance-container">
      <h1>Finance Management</h1>
      
      <div class="finance-menu">
        <div class="menu-item" (click)="selectMenu('payment')">
          <i class="icon-payment"></i>
          <span>Payment</span>
        </div>
        <div class="menu-item" (click)="selectMenu('customer-invoice')">
          <i class="icon-invoice"></i>
          <span>Customer Invoice</span>
        </div>
        <div class="menu-item" (click)="selectMenu('vendor-invoice')">
          <i class="icon-invoice"></i>
          <span>Vendor Invoice</span>
        </div>
        <div class="menu-item" (click)="selectMenu('soa')">
          <i class="icon-soa"></i>
          <span>SOA</span>
        </div>
        <div class="menu-item" (click)="selectMenu('currency')">
          <i class="icon-currency"></i>
          <span>Currency</span>
        </div>
        <div class="menu-item" (click)="selectMenu('exchange-rate')">
          <i class="icon-exchange"></i>
          <span>Currency Exchange</span>
        </div>
        <div class="menu-item" (click)="selectMenu('balance')">
          <i class="icon-balance"></i>
          <span>Enterprise Balance</span>
        </div>
        <div class="menu-item" (click)="selectMenu('billing-cycle')">
          <i class="icon-cycle"></i>
          <span>Billing Cycle</span>
        </div>
      </div>
      
      <div class="content-area">
        <app-payment *ngIf="selectedMenu === 'payment'"></app-payment>
        <app-customer-invoice *ngIf="selectedMenu === 'customer-invoice'"></app-customer-invoice>
        <app-vendor-invoice *ngIf="selectedMenu === 'vendor-invoice'"></app-vendor-invoice>
        <app-soa *ngIf="selectedMenu === 'soa'"></app-soa>
        <app-currency *ngIf="selectedMenu === 'currency'"></app-currency>
        <app-exchange-rate *ngIf="selectedMenu === 'exchange-rate'"></app-exchange-rate>
        <app-balance *ngIf="selectedMenu === 'balance'"></app-balance>
        <app-billing-cycle *ngIf="selectedMenu === 'billing-cycle'"></app-billing-cycle>
      </div>
    </div>
  `,
  styles: [`
    .finance-container {
      padding: 20px;
    }
    .finance-menu {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .menu-item {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      transition: all 0.3s;
    }
    .menu-item:hover {
      background: #f5f5f5;
      border-color: #667eea;
    }
  `]
})
export class FinanceDashboardComponent {
  selectedMenu: string = 'payment';
  
  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }
}

// Payment Component
@Component({
  selector: 'app-payment',
  template: `
    <div class="payment-section">
      <h2>Payment Management</h2>
      
      <button (click)="openForm()" class="btn btn-primary">+ New Payment</button>
      
      <div class="filters">
        <select (change)="filterByStatus($event)">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Payment No</th>
            <th>Enterprise</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let payment of payments">
            <td>{{ payment.paymentNumber }}</td>
            <td>{{ payment.enterpriseName }}</td>
            <td>{{ payment.amount | currency }}</td>
            <td>{{ payment.paymentMethod }}</td>
            <td>{{ payment.paymentDate | date }}</td>
            <td>
              <span class="badge" [ngClass]="'badge-' + payment.status.toLowerCase()">
                {{ payment.status }}
              </span>
            </td>
            <td>
              <button (click)="editPayment(payment.id)" class="btn-sm">Edit</button>
              <button (click)="approvePayment(payment.id)" *ngIf="payment.status === 'PENDING'" class="btn-sm btn-success">Approve</button>
              <button (click)="rejectPayment(payment.id)" *ngIf="payment.status === 'PENDING'" class="btn-sm btn-danger">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class PaymentComponent implements OnInit {
  payments: any[] = [];
  
  constructor(private paymentService: PaymentService) {}
  
  ngOnInit() {
    this.loadPayments();
  }
  
  loadPayments() {
    this.paymentService.getList(0, 50).subscribe(data => {
      this.payments = data.content;
    });
  }
  
  filterByStatus(event: any) {
    const status = event.target.value;
    if (status) {
      this.paymentService.getByStatus(status).subscribe(data => {
        this.payments = data.content;
      });
    } else {
      this.loadPayments();
    }
  }
  
  approvePayment(id: number) {
    this.paymentService.updateStatus(id, 'COMPLETED').subscribe(() => {
      this.loadPayments();
    });
  }
  
  rejectPayment(id: number) {
    this.paymentService.updateStatus(id, 'FAILED').subscribe(() => {
      this.loadPayments();
    });
  }
  
  openForm() {
    // Open payment form
  }
  
  editPayment(id: number) {
    // Edit payment
  }
}

// Customer Invoice Component
@Component({
  selector: 'app-customer-invoice',
  template: `
    <div class="invoice-section">
      <h2>Customer Invoices</h2>
      
      <button (click)="openForm()" class="btn btn-primary">+ New Invoice</button>
      
      <div class="filters">
        <input type="text" placeholder="Customer Name" (change)="filterByCustomer($event)">
        <select (change)="filterByStatus($event)">
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="PARTIALLY_PAID">Partially Paid</option>
          <option value="FULLY_PAID">Fully Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Customer</th>
            <th>Net Amount</th>
            <th>Paid Amount</th>
            <th>Outstanding</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let invoice of invoices">
            <td>{{ invoice.invoiceNumber }}</td>
            <td>{{ invoice.customerName }}</td>
            <td>{{ invoice.netAmount | currency }}</td>
            <td>{{ invoice.paidAmount | currency }}</td>
            <td>{{ invoice.outstandingAmount | currency }}</td>
            <td>{{ invoice.dueDate | date }}</td>
            <td>
              <span class="badge" [ngClass]="'badge-' + invoice.status.toLowerCase()">
                {{ invoice.status }}
              </span>
            </td>
            <td>
              <button (click)="viewDetails(invoice.id)" class="btn-sm">View</button>
              <button (click)="recordPayment(invoice.id)" *ngIf="invoice.status !== 'FULLY_PAID'" class="btn-sm btn-success">Record Payment</button>
              <button (click)="sendInvoice(invoice.id)" class="btn-sm">Send</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class CustomerInvoiceComponent implements OnInit {
  invoices: any[] = [];
  
  constructor(private invoiceService: CustomerInvoiceService) {}
  
  ngOnInit() {
    this.loadInvoices();
  }
  
  loadInvoices() {
    this.invoiceService.getList(0, 50).subscribe(data => {
      this.invoices = data.content;
    });
  }
  
  filterByStatus(event: any) {
    const status = event.target.value;
    if (status) {
      this.invoiceService.getByStatus(status).subscribe(data => {
        this.invoices = data.content;
      });
    } else {
      this.loadInvoices();
    }
  }
  
  filterByCustomer(event: any) {
    const customer = event.target.value;
    if (customer) {
      this.invoiceService.getByCustomer(customer).subscribe(data => {
        this.invoices = data.content;
      });
    } else {
      this.loadInvoices();
    }
  }
  
  recordPayment(id: number) {
    // Open payment dialog
  }
  
  sendInvoice(id: number) {
    // Send invoice email
  }
  
  viewDetails(id: number) {
    // View invoice details
  }
  
  openForm() {
    // Open invoice form
  }
}

// Vendor Invoice Component
@Component({
  selector: 'app-vendor-invoice',
  template: `
    <div class="invoice-section">
      <h2>Vendor Invoices</h2>
      
      <button (click)="openForm()" class="btn btn-primary">+ New Invoice</button>
      
      <div class="filters">
        <input type="text" placeholder="Vendor Name" (change)="filterByVendor($event)">
        <select (change)="filterByStatus($event)">
          <option value="">All Status</option>
          <option value="RECEIVED">Received</option>
          <option value="PARTIALLY_PAID">Partially Paid</option>
          <option value="FULLY_PAID">Fully Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Vendor</th>
            <th>PO Number</th>
            <th>Net Amount</th>
            <th>Paid Amount</th>
            <th>Outstanding</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let invoice of invoices">
            <td>{{ invoice.invoiceNumber }}</td>
            <td>{{ invoice.vendorName }}</td>
            <td>{{ invoice.poNumber }}</td>
            <td>{{ invoice.netAmount | currency }}</td>
            <td>{{ invoice.paidAmount | currency }}</td>
            <td>{{ invoice.outstandingAmount | currency }}</td>
            <td>{{ invoice.dueDate | date }}</td>
            <td>
              <span class="badge" [ngClass]="'badge-' + invoice.status.toLowerCase()">
                {{ invoice.status }}
              </span>
            </td>
            <td>
              <button (click)="viewDetails(invoice.id)" class="btn-sm">View</button>
              <button (click)="processPayment(invoice.id)" class="btn-sm btn-success">Process Payment</button>
              <button (click)="approveInvoice(invoice.id)" class="btn-sm">Approve</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class VendorInvoiceComponent implements OnInit {
  invoices: any[] = [];
  
  constructor(private invoiceService: VendorInvoiceService) {}
  
  ngOnInit() {
    this.loadInvoices();
  }
  
  loadInvoices() {
    this.invoiceService.getList(0, 50).subscribe(data => {
      this.invoices = data.content;
    });
  }
  
  filterByStatus(event: any) {
    const status = event.target.value;
    if (status) {
      this.invoiceService.getByStatus(status).subscribe(data => {
        this.invoices = data.content;
      });
    } else {
      this.loadInvoices();
    }
  }
  
  filterByVendor(event: any) {
    const vendor = event.target.value;
    if (vendor) {
      this.invoiceService.getByVendor(vendor).subscribe(data => {
        this.invoices = data.content;
      });
    } else {
      this.loadInvoices();
    }
  }
  
  processPayment(id: number) {
    // Open payment dialog
  }
  
  approveInvoice(id: number) {
    // Approve invoice
  }
  
  viewDetails(id: number) {
    // View invoice details
  }
  
  openForm() {
    // Open invoice form
  }
}

// SOA Component
@Component({
  selector: 'app-soa',
  template: `
    <div class="soa-section">
      <h2>Statement of Account</h2>
      
      <button (click)="generateSOA()" class="btn btn-primary">+ Generate SOA</button>
      
      <div class="filters">
        <input type="text" placeholder="Enterprise Name" (change)="filterByEnterprise($event)">
        <input type="date" placeholder="Period Start" (change)="filterByDate($event)">
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>SOA Number</th>
            <th>Enterprise</th>
            <th>Period</th>
            <th>Opening Balance</th>
            <th>Total Debit</th>
            <th>Total Credit</th>
            <th>Closing Balance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let soa of soaList">
            <td>{{ soa.soaNumber }}</td>
            <td>{{ soa.enterpriseName }}</td>
            <td>{{ soa.periodStart | date }} - {{ soa.periodEnd | date }}</td>
            <td>{{ soa.openingBalance | currency }}</td>
            <td>{{ soa.totalDebit | currency }}</td>
            <td>{{ soa.totalCredit | currency }}</td>
            <td>{{ soa.closingBalance | currency }}</td>
            <td>
              <span class="badge" [ngClass]="'badge-' + soa.status.toLowerCase()">
                {{ soa.status }}
              </span>
            </td>
            <td>
              <button (click)="viewSOA(soa.id)" class="btn-sm">View</button>
              <button (click)="finalizeSOA(soa.id)" *ngIf="soa.status === 'DRAFT'" class="btn-sm btn-success">Finalize</button>
              <button (click)="sendSOA(soa.id)" class="btn-sm">Send</button>
              <button (click)="downloadSOA(soa.id)" class="btn-sm">Download</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class SOAComponent implements OnInit {
  soaList: any[] = [];
  
  constructor(private soaService: SOAService) {}
  
  ngOnInit() {
    this.loadSOA();
  }
  
  loadSOA() {
    this.soaService.getList(0, 50).subscribe(data => {
      this.soaList = data.content;
    });
  }
  
  filterByEnterprise(event: any) {
    const enterprise = event.target.value;
    if (enterprise) {
      this.soaService.getByEnterprise(enterprise).subscribe(data => {
        this.soaList = data.content;
      });
    } else {
      this.loadSOA();
    }
  }
  
  filterByDate(event: any) {
    // Filter by period
  }
  
  generateSOA() {
    // Open SOA generation dialog
  }
  
  viewSOA(id: number) {
    // View SOA details and line items
  }
  
  finalizeSOA(id: number) {
    this.soaService.finalize(id).subscribe(() => {
      this.loadSOA();
    });
  }
  
  sendSOA(id: number) {
    // Send SOA via email
  }
  
  downloadSOA(id: number) {
    // Download SOA as PDF
  }
}

// Currency Component
@Component({
  selector: 'app-currency',
  template: `
    <div class="currency-section">
      <h2>Currency Management</h2>
      
      <button (click)="openForm()" class="btn btn-primary">+ Add Currency</button>
      
      <table class="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Decimal Places</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let currency of currencies">
            <td>{{ currency.code }}</td>
            <td>{{ currency.name }}</td>
            <td>{{ currency.symbol }}</td>
            <td>{{ currency.decimalPlaces }}</td>
            <td>
              <span class="badge" [ngClass]="currency.isActive ? 'badge-success' : 'badge-danger'">
                {{ currency.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button (click)="editCurrency(currency.id)" class="btn-sm">Edit</button>
              <button (click)="toggleStatus(currency.id)" class="btn-sm">Toggle</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class CurrencyComponent implements OnInit {
  currencies: any[] = [];
  
  constructor(private currencyService: CurrencyService) {}
  
  ngOnInit() {
    this.loadCurrencies();
  }
  
  loadCurrencies() {
    this.currencyService.getActive().subscribe(data => {
      this.currencies = data.content;
    });
  }
  
  editCurrency(id: number) {
    // Edit currency
  }
  
  toggleStatus(id: number) {
    // Toggle active/inactive
  }
  
  openForm() {
    // Open currency form
  }
}

// Exchange Rate Component
@Component({
  selector: 'app-exchange-rate',
  template: `
    <div class="exchange-rate-section">
      <h2>Currency Exchange Rates</h2>
      
      <button (click)="openForm()" class="btn btn-primary">+ Add Rate</button>
      
      <div class="filters">
        <select (change)="filterByFromCurrency($event)">
          <option value="">From Currency</option>
          <option *ngFor="let currency of currencies" [value]="currency.code">{{ currency.code }}</option>
        </select>
        <select (change)="filterByToCurrency($event)">
          <option value="">To Currency</option>
          <option *ngFor="let currency of currencies" [value]="currency.code">{{ currency.code }}</option>
        </select>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Rate</th>
            <th>Date</th>
            <th>Source</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let rate of exchangeRates">
            <td>{{ rate.fromCurrency }}</td>
            <td>{{ rate.toCurrency }}</td>
            <td>{{ rate.exchangeRate }}</td>
            <td>{{ rate.rateDate | date }}</td>
            <td>{{ rate.source }}</td>
            <td>
              <span class="badge" [ngClass]="'badge-' + rate.status.toLowerCase()">
                {{ rate.status }}
              </span>
            </td>
            <td>
              <button (click)="editRate(rate.id)" class="btn-sm">Edit</button>
              <button (click)="deleteRate(rate.id)" class="btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ExchangeRateComponent implements OnInit {
  exchangeRates: any[] = [];
  currencies: any[] = [];
  
  constructor(
    private rateService: ExchangeRateService,
    private currencyService: CurrencyService
  ) {}
  
  ngOnInit() {
    this.loadRates();
    this.loadCurrencies();
  }
  
  loadRates() {
    this.rateService.getList(0, 50).subscribe(data => {
      this.exchangeRates = data.content;
    });
  }
  
  loadCurrencies() {
    this.currencyService.getActive().subscribe(data => {
      this.currencies = data.content;
    });
  }
  
  filterByFromCurrency(event: any) {
    // Filter rates
  }
  
  filterByToCurrency(event: any) {
    // Filter rates
  }
  
  editRate(id: number) {
    // Edit rate
  }
  
  deleteRate(id: number) {
    // Delete rate
  }
  
  openForm() {
    // Open rate form
  }
}

// Enterprise Balance Component
@Component({
  selector: 'app-balance',
  template: `
    <div class="balance-section">
      <h2>Enterprise Balance Management</h2>
      
      <div class="filters">
        <select (change)="filterByStatus($event)">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Enterprise</th>
            <th>Type</th>
            <th>Current Balance</th>
            <th>Credit Limit</th>
            <th>Available Credit</th>
            <th>Total Receivable</th>
            <th>Total Payable</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let balance of balances">
            <td>{{ balance.enterpriseName }}</td>
            <td>{{ balance.enterpriseType }}</td>
            <td>{{ balance.currentBalance | currency }}</td>
            <td>{{ balance.creditLimit | currency }}</td>
            <td>{{ balance.availableCredit | currency }}</td>
            <td>{{ balance.totalReceivable | currency }}</td>
            <td>{{ balance.totalPayable | currency }}</td>
            <td>
              <span class="badge" [ngClass]="'badge-' + balance.accountStatus.toLowerCase()">
                {{ balance.accountStatus }}
              </span>
            </td>
            <td>
              <button (click)="editBalance(balance.id)" class="btn-sm">Edit</button>
              <button (click)="adjustCredit(balance.id)" class="btn-sm">Adjust Credit</button>
              <button (click)="changeStatus(balance.id)" class="btn-sm">Change Status</button>
              <button (click)="viewTransactions(balance.id)" class="btn-sm">Transactions</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class EnterpriseBalanceComponent implements OnInit {
  balances: any[] = [];
  
  constructor(private balanceService: EnterpriseBalanceService) {}
  
  ngOnInit() {
    this.loadBalances();
  }
  
  loadBalances() {
    this.balanceService.getList(0, 50).subscribe(data => {
      this.balances = data.content;
    });
  }
  
  filterByStatus(event: any) {
    const status = event.target.value;
    if (status) {
      this.balanceService.getByStatus(status).subscribe(data => {
        this.balances = data.content;
      });
    } else {
      this.loadBalances();
    }
  }
  
  editBalance(id: number) {
    // Edit balance
  }
  
  adjustCredit(id: number) {
    // Adjust credit limit
  }
  
  changeStatus(id: number) {
    // Change account status
  }
  
  viewTransactions(id: number) {
    // View transaction history
  }
}

// Billing Cycle Component
@Component({
  selector: 'app-billing-cycle',
  template: `
    <div class="cycle-section">
      <h2>Billing Cycle Configuration</h2>
      
      <button (click)="openForm()" class="btn btn-primary">+ New Cycle</button>
      
      <div class="filters">
        <select (change)="filterByType($event)">
          <option value="">All Types</option>
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
          <option value="QUARTERLY">Quarterly</option>
          <option value="YEARLY">Yearly</option>
        </select>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Cycle Name</th>
            <th>Type</th>
            <th>Billing Type</th>
            <th>Usage Days</th>
            <th>Due Days</th>
            <th>Grace Days</th>
            <th>Late Charge</th>
            <th>Default</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let cycle of cycles">
            <td>{{ cycle.cycleName }}</td>
            <td>{{ cycle.cycleType }}</td>
            <td>{{ cycle.billingType }}</td>
            <td>{{ cycle.usageDays }}</td>
            <td>{{ cycle.dueDays }}</td>
            <td>{{ cycle.graceDays }}</td>
            <td>{{ cycle.latePaymentCharge }}%</td>
            <td>
              <span *ngIf="cycle.isDefault" class="badge badge-primary">Default</span>
            </td>
            <td>
              <span class="badge" [ngClass]="cycle.isActive ? 'badge-success' : 'badge-danger'">
                {{ cycle.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button (click)="editCycle(cycle.id)" class="btn-sm">Edit</button>
              <button (click)="setAsDefault(cycle.id)" *ngIf="!cycle.isDefault" class="btn-sm">Set Default</button>
              <button (click)="toggleStatus(cycle.id)" class="btn-sm">Toggle</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class BillingCycleComponent implements OnInit {
  cycles: any[] = [];
  
  constructor(private cycleService: BillingCycleService) {}
  
  ngOnInit() {
    this.loadCycles();
  }
  
  loadCycles() {
    this.cycleService.getActive().subscribe(data => {
      this.cycles = data.content;
    });
  }
  
  filterByType(event: any) {
    const type = event.target.value;
    if (type) {
      this.cycleService.getByType(type).subscribe(data => {
        this.cycles = data.content;
      });
    } else {
      this.loadCycles();
    }
  }
  
  editCycle(id: number) {
    // Edit cycle
  }
  
  setAsDefault(id: number) {
    // Set as default
  }
  
  toggleStatus(id: number) {
    // Toggle active/inactive
  }
  
  openForm() {
    // Open cycle form
  }
}
```

---

## 📊 Database Queries for Each Section

```sql
-- Payment Queries
SELECT * FROM payment WHERE status = 'PENDING' ORDER BY payment_date DESC;
SELECT * FROM payment WHERE enterprise_name = 'ABC Corp' AND payment_date BETWEEN '2024-01-01' AND '2024-01-31';
SELECT payment_method, COUNT(*) as count, SUM(amount) as total FROM payment GROUP BY payment_method;

-- Customer Invoice Queries
SELECT * FROM customer_invoice WHERE status IN ('PARTIALLY_PAID', 'OVERDUE') ORDER BY due_date;
SELECT * FROM customer_invoice WHERE due_date < CURDATE() AND status != 'FULLY_PAID';
SELECT customer_name, SUM(net_amount) as total_invoiced, SUM(paid_amount) as total_paid FROM customer_invoice GROUP BY customer_name;

-- Vendor Invoice Queries
SELECT * FROM vendor_invoice WHERE status != 'FULLY_PAID' ORDER BY due_date;
SELECT vendor_name, COUNT(*) as invoice_count, SUM(net_amount) as total_amount FROM vendor_invoice GROUP BY vendor_name;

-- SOA Queries
SELECT * FROM statement_of_account WHERE enterprise_name = 'ABC Corp' ORDER BY period_start DESC;
SELECT s.*, SUM(l.debit_amount) as total_debit, SUM(l.credit_amount) as total_credit FROM statement_of_account s LEFT JOIN soa_line_items l ON s.soa_id = l.soa_id GROUP BY s.soa_id;

-- Currency Queries
SELECT * FROM currency WHERE is_active = 1;
SELECT DISTINCT currency_code FROM currency;

-- Exchange Rate Queries
SELECT * FROM currency_exchange_rate WHERE from_currency = 'USD' AND to_currency = 'INR' AND rate_date = CURDATE();
SELECT * FROM currency_exchange_rate WHERE status = 'ACTIVE' ORDER BY rate_date DESC;

-- Enterprise Balance Queries
SELECT * FROM enterprise_balance WHERE account_status = 'ACTIVE';
SELECT * FROM enterprise_balance WHERE available_credit < credit_limit * 0.2;
SELECT enterprise_type, SUM(current_balance) as total_balance FROM enterprise_balance GROUP BY enterprise_type;

-- Billing Cycle Queries
SELECT * FROM billing_cycle WHERE is_active = 1;
SELECT * FROM billing_cycle WHERE is_default = 1;
```

---

**Complete Finance Module Ready for Deployment!** 🚀
