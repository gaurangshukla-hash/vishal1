// ============================================
// COMPLETE SPRING BOOT BACKEND CODE
// TeleOSS Full-Stack Application
// ============================================

// ============================================
// 1. ENTITIES (JPA)
// ============================================

package com.teleoss.entity;

import lombok.*;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

// Enterprise Entity
@Entity
@Table(name = "enterprise", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_type", columnList = "enterprise_type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enterprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enterprise_id")
    private Long id;
    
    @Column(name = "enterprise_name", nullable = false, unique = true)
    private String name;
    
    @Column(name = "enterprise_type")
    @Enumerated(EnumType.STRING)
    private EnterpriseType type; // CUSTOMER, VENDOR, SUPPLIER
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status; // ACTIVE, INACTIVE, SUSPENDED
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = Status.ACTIVE;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// Transaction Entity
@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_payment_status", columnList = "payment_status"),
    @Index(name = "idx_payment_date", columnList = "payment_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "info_id")
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    @Column(name = "mode_of_payment")
    private String modeOfPayment;
    
    @Column(name = "payment_type")
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType; // CREDIT, DEBIT
    
    @Column(name = "amount", nullable = false)
    private BigDecimal amount;
    
    @Column(name = "currency")
    private String currency;
    
    @Column(name = "payment_status")
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus; // FULL, PARTIAL, PENDING
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (paymentStatus == null) paymentStatus = PaymentStatus.PENDING;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// Invoice Entity
@Entity
@Table(name = "invoices", indexes = {
    @Index(name = "idx_invoice_date", columnList = "invoice_date"),
    @Index(name = "idx_invoice_status", columnList = "status"),
    @Index(name = "idx_enterprise_name", columnList = "enterprise_name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Long id;
    
    @Column(name = "invoice_no", nullable = false, unique = true)
    private String invoiceNo;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status; // DRAFT, SENT, PAID, OVERDUE, CANCELLED
    
    @Column(name = "enterprise_name")
    private String enterpriseName;
    
    @Column(name = "amount", nullable = false)
    private BigDecimal amount;
    
    @Column(name = "paid_amount")
    private BigDecimal paidAmount;
    
    @Column(name = "invoice_date")
    private LocalDateTime invoiceDate;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = InvoiceStatus.DRAFT;
        if (paidAmount == null) paidAmount = BigDecimal.ZERO;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// EnterpriseBalance Entity
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
    
    @Column(name = "customer_balance")
    private BigDecimal customerBalance;
    
    @Column(name = "vendor_balance")
    private BigDecimal vendorBalance;
    
    @Column(name = "net_balance")
    private BigDecimal netBalance;
    
    @Column(name = "account_manager")
    private String accountManager;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        // Recalculate net balance
        if (customerBalance != null && vendorBalance != null) {
            netBalance = customerBalance.subtract(vendorBalance);
        }
    }
}

// MCCMNC Entity
@Entity
@Table(name = "mccmnc_unique_codes", indexes = {
    @Index(name = "idx_mccmnc", columnList = "mccmnc"),
    @Index(name = "idx_country", columnList = "country")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MCCMNC {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "info_id")
    private Long id;
    
    @Column(name = "mccmnc", unique = true)
    private String code;
    
    @Column(name = "mcc")
    private String mcc;
    
    @Column(name = "mnc")
    private String mnc;
    
    @Column(name = "country")
    private String country;
    
    @Column(name = "iso")
    private String iso;
    
    @Column(name = "code_network")
    private String network;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// MOReference Entity
@Entity
@Table(name = "mo_reference_book", indexes = {
    @Index(name = "idx_mo_trunk", columnList = "customer_trunk"),
    @Index(name = "idx_mo_mccmnc", columnList = "mccmnc"),
    @Index(name = "idx_mo_number", columnList = "number")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MOReference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "info_id")
    private Long id;
    
    @Column(name = "customer_trunk")
    private String customerTrunk;
    
    @Column(name = "number")
    private String number;
    
    @Column(name = "keyword")
    private String keyword;
    
    @Column(name = "rate")
    private BigDecimal rate;
    
    @Column(name = "vendor_rate")
    private BigDecimal vendorRate;
    
    @Column(name = "mccmnc")
    private String mccmnc;
    
    @Column(name = "destination")
    private String destination;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// Country Entity
@Entity
@Table(name = "country")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "country_id")
    private Long id;
    
    @Column(name = "name", unique = true)
    private String name;
    
    @Column(name = "iso_code", unique = true)
    private String isoCode;
    
    @Column(name = "dial_code")
    private String dialCode;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// Product Entity
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_category", columnList = "category_id"),
    @Index(name = "idx_product_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;
    
    @Column(name = "product_name")
    private String name;
    
    @Column(name = "category_id")
    private Long categoryId;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = Status.ACTIVE;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// ProductCategory Entity
@Entity
@Table(name = "product_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "info_id")
    private Long id;
    
    @Column(name = "category_name", unique = true)
    private String name;
    
    @Column(name = "updated_by")
    private String updatedBy;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// TranslationRule Entity
@Entity
@Table(name = "translation_rule", indexes = {
    @Index(name = "idx_rule_type", columnList = "type"),
    @Index(name = "idx_rule_mccmnc", columnList = "mccmnc")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslationRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "info_id")
    private Long id;
    
    @Column(name = "translation_rule_name")
    private String name;
    
    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private RuleType type; // INGRESS, EGRESS
    
    @Column(name = "action")
    private String action;
    
    @Column(name = "mccmnc")
    private String mccmnc;
    
    @Column(name = "updated_by")
    private String updatedBy;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// AutoUploadRule Entity
@Entity
@Table(name = "auto_upload_rules", indexes = {
    @Index(name = "idx_auto_status", columnList = "status"),
    @Index(name = "idx_auto_enterprise", columnList = "enterprise_name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutoUploadRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "info_id")
    private Long id;
    
    @Column(name = "auto_upload_rules_name")
    private String name;
    
    @Column(name = "enterprise_name")
    private String enterpriseName;
    
    @Column(name = "vendor_trunk")
    private String vendorTrunk;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Column(name = "updated_by")
    private String updatedBy;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
        if (status == null) status = Status.ACTIVE;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// DailyReport Entity
@Entity
@Table(name = "daily_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long id;
    
    @Column(name = "enterprise_id")
    private Long enterpriseId;
    
    @Column(name = "report_date")
    private LocalDateTime reportDate;
    
    @Column(name = "total_messages")
    private Long totalMessages;
    
    @Column(name = "successful_messages")
    private Long successfulMessages;
    
    @Column(name = "failed_messages")
    private Long failedMessages;
    
    @Column(name = "total_revenue")
    private BigDecimal totalRevenue;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

// User Entity
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_status", columnList = "status"),
    @Index(name = "idx_user_role", columnList = "role_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;
    
    @Column(name = "username", unique = true)
    private String username;
    
    @Column(name = "email", unique = true)
    private String email;
    
    @Column(name = "password_hash")
    private String passwordHash;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "role_id")
    private Long roleId;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = Status.ACTIVE;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

// AuditLog Entity
@Entity
@Table(name = "audit_log", indexes = {
    @Index(name = "idx_audit_user", columnList = "user_id"),
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_date", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "action")
    private String action; // CREATE, READ, UPDATE, DELETE
    
    @Column(name = "module")
    private String module; // ENTERPRISE, FINANCE, etc.
    
    @Column(name = "entity_type")
    private String entityType;
    
    @Column(name = "entity_id")
    private Long entityId;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

// ============================================
// 2. ENUMS
// ============================================

public enum Status {
    ACTIVE, INACTIVE, SUSPENDED
}

public enum EnterpriseType {
    CUSTOMER, VENDOR, SUPPLIER
}

public enum PaymentType {
    CREDIT, DEBIT
}

public enum PaymentStatus {
    FULL, PARTIAL, PENDING
}

public enum InvoiceStatus {
    DRAFT, SENT, PAID, OVERDUE, CANCELLED
}

public enum RuleType {
    INGRESS, EGRESS
}

// ============================================
// 3. DTOs (Data Transfer Objects)
// ============================================

package com.teleoss.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnterpriseDTO {
    private Long id;
    private String name;
    private String type;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private Long id;
    private String name;
    private LocalDateTime paymentDate;
    private BigDecimal amount;
    private String paymentStatus;
    private String description;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceDTO {
    private Long id;
    private String invoiceNo;
    private String status;
    private String enterpriseName;
    private BigDecimal amount;
    private BigDecimal paidAmount;
    private LocalDateTime invoiceDate;
    private LocalDateTime dueDate;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String status;
    private LocalDateTime lastLogin;
}

// ============================================
// 4. REPOSITORIES (Data Access Layer)
// ============================================

package com.teleoss.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {
    Page<Enterprise> findByStatus(Status status, Pageable pageable);
    Page<Enterprise> findByType(EnterpriseType type, Pageable pageable);
    Page<Enterprise> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Optional<Enterprise> findByName(String name);
}

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByPaymentStatus(PaymentStatus status, Pageable pageable);
    Page<Transaction> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    List<Transaction> findByName(String name);
}

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Page<Invoice> findByStatus(InvoiceStatus status, Pageable pageable);
    Page<Invoice> findByEnterpriseName(String enterpriseName, Pageable pageable);
    Optional<Invoice> findByInvoiceNo(String invoiceNo);
}

@Repository
public interface EnterpriseBalanceRepository extends JpaRepository<EnterpriseBalance, Long> {
    Optional<EnterpriseBalance> findByEnterpriseName(String enterpriseName);
}

@Repository
public interface MCCMNCRepository extends JpaRepository<MCCMNC, Long> {
    Optional<MCCMNC> findByCode(String code);
    Page<MCCMNC> findByCountry(String country, Pageable pageable);
    Page<MCCMNC> findByIso(String iso, Pageable pageable);
}

@Repository
public interface MOReferenceRepository extends JpaRepository<MOReference, Long> {
    Page<MOReference> findByCustomerTrunk(String trunk, Pageable pageable);
    Page<MOReference> findByMccmnc(String mccmnc, Pageable pageable);
    List<MOReference> findByNumber(String number);
}

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {
    Optional<Country> findByName(String name);
    Optional<Country> findByIsoCode(String isoCode);
    Page<Country> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByStatus(Status status, Pageable pageable);
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    Optional<ProductCategory> findByName(String name);
}

@Repository
public interface TranslationRuleRepository extends JpaRepository<TranslationRule, Long> {
    Page<TranslationRule> findByType(RuleType type, Pageable pageable);
    Page<TranslationRule> findByMccmnc(String mccmnc, Pageable pageable);
}

@Repository
public interface AutoUploadRuleRepository extends JpaRepository<AutoUploadRule, Long> {
    Page<AutoUploadRule> findByStatus(Status status, Pageable pageable);
    Page<AutoUploadRule> findByEnterpriseName(String enterpriseName, Pageable pageable);
}

@Repository
public interface DailyReportRepository extends JpaRepository<DailyReport, Long> {
    Page<DailyReport> findByReportDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    Optional<DailyReport> findByEnterpriseIdAndReportDate(Long enterpriseId, LocalDateTime date);
}

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Page<User> findByStatus(Status status, Pageable pageable);
}

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findByUserId(Long userId, Pageable pageable);
    Page<AuditLog> findByAction(String action, Pageable pageable);
    Page<AuditLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
}

// ============================================
// 5. SERVICES (Business Logic Layer)
// ============================================

package com.teleoss.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class EnterpriseService {
    @Autowired
    private EnterpriseRepository repository;
    
    public Page<Enterprise> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public Enterprise getById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Enterprise not found: " + id));
    }
    
    public Enterprise create(EnterpriseDTO dto) {
        Enterprise enterprise = Enterprise.builder()
            .name(dto.getName())
            .type(EnterpriseType.valueOf(dto.getType()))
            .status(Status.ACTIVE)
            .build();
        return repository.save(enterprise);
    }
    
    public Enterprise update(Long id, EnterpriseDTO dto) {
        Enterprise enterprise = getById(id);
        enterprise.setName(dto.getName());
        enterprise.setType(EnterpriseType.valueOf(dto.getType()));
        enterprise.setStatus(Status.valueOf(dto.getStatus()));
        return repository.save(enterprise);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
    
    public Page<Enterprise> search(String query, Pageable pageable) {
        return repository.findByNameContainingIgnoreCase(query, pageable);
    }
    
    public Page<Enterprise> getByType(EnterpriseType type, Pageable pageable) {
        return repository.findByType(type, pageable);
    }
    
    public Page<Enterprise> getByStatus(Status status, Pageable pageable) {
        return repository.findByStatus(status, pageable);
    }
}

@Service
@Transactional
@Slf4j
public class TransactionService {
    @Autowired
    private TransactionRepository repository;
    
    public Page<Transaction> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public Transaction getById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
    }
    
    public Transaction create(TransactionDTO dto) {
        Transaction transaction = Transaction.builder()
            .name(dto.getName())
            .paymentDate(dto.getPaymentDate())
            .amount(dto.getAmount())
            .paymentStatus(PaymentStatus.valueOf(dto.getPaymentStatus()))
            .description(dto.getDescription())
            .build();
        return repository.save(transaction);
    }
    
    public Transaction update(Long id, TransactionDTO dto) {
        Transaction transaction = getById(id);
        transaction.setName(dto.getName());
        transaction.setPaymentDate(dto.getPaymentDate());
        transaction.setAmount(dto.getAmount());
        transaction.setPaymentStatus(PaymentStatus.valueOf(dto.getPaymentStatus()));
        return repository.save(transaction);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
    
    public Page<Transaction> getByStatus(PaymentStatus status, Pageable pageable) {
        return repository.findByPaymentStatus(status, pageable);
    }
}

@Service
@Transactional
@Slf4j
public class InvoiceService {
    @Autowired
    private InvoiceRepository repository;
    
    @Autowired
    private EnterpriseRepository enterpriseRepository;
    
    public Page<Invoice> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public Invoice getById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));
    }
    
    public Invoice create(InvoiceDTO dto) {
        Invoice invoice = Invoice.builder()
            .invoiceNo(dto.getInvoiceNo())
            .status(InvoiceStatus.DRAFT)
            .enterpriseName(dto.getEnterpriseName())
            .amount(dto.getAmount())
            .invoiceDate(dto.getInvoiceDate())
            .dueDate(dto.getDueDate())
            .paidAmount(BigDecimal.ZERO)
            .build();
        return repository.save(invoice);
    }
    
    public Invoice update(Long id, InvoiceDTO dto) {
        Invoice invoice = getById(id);
        invoice.setStatus(InvoiceStatus.valueOf(dto.getStatus()));
        invoice.setAmount(dto.getAmount());
        invoice.setPaidAmount(dto.getPaidAmount());
        return repository.save(invoice);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
    
    public Page<Invoice> getByStatus(InvoiceStatus status, Pageable pageable) {
        return repository.findByStatus(status, pageable);
    }
}

@Service
@Transactional
@Slf4j
public class UserService {
    @Autowired
    private UserRepository repository;
    
    public Page<User> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public User getById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
    
    public User create(UserDTO dto) {
        User user = User.builder()
            .username(dto.getUsername())
            .email(dto.getEmail())
            .firstName(dto.getFirstName())
            .lastName(dto.getLastName())
            .status(Status.ACTIVE)
            .build();
        return repository.save(user);
    }
    
    public User update(Long id, UserDTO dto) {
        User user = getById(id);
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        return repository.save(user);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
    
    public Optional<User> findByUsername(String username) {
        return repository.findByUsername(username);
    }
    
    public void updateLastLogin(Long userId) {
        User user = getById(userId);
        user.setLastLogin(LocalDateTime.now());
        repository.save(user);
    }
}

// ============================================
// 6. CONTROLLERS (REST API Layer)
// ============================================

package com.teleoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/enterprise")
@CrossOrigin(origins = "*")
@Tag(name = "Enterprise Management")
@Slf4j
public class EnterpriseController {
    @Autowired
    private EnterpriseService service;
    
    @GetMapping
    @Operation(summary = "Get all enterprises")
    public ResponseEntity<Page<EnterpriseDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Enterprise> result = service.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get enterprise by ID")
    public ResponseEntity<EnterpriseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(toDTO(service.getById(id)));
    }
    
    @PostMapping
    @Operation(summary = "Create new enterprise")
    public ResponseEntity<EnterpriseDTO> create(@RequestBody EnterpriseDTO dto) {
        Enterprise enterprise = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(enterprise));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update enterprise")
    public ResponseEntity<EnterpriseDTO> update(
            @PathVariable Long id,
            @RequestBody EnterpriseDTO dto) {
        Enterprise enterprise = service.update(id, dto);
        return ResponseEntity.ok(toDTO(enterprise));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete enterprise")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search enterprises")
    public ResponseEntity<Page<EnterpriseDTO>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Enterprise> result = service.search(query, PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    private EnterpriseDTO toDTO(Enterprise entity) {
        return EnterpriseDTO.builder()
            .id(entity.getId())
            .name(entity.getName())
            .type(entity.getType().toString())
            .status(entity.getStatus().toString())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }
}

@RestController
@RequestMapping("/api/transaction")
@CrossOrigin(origins = "*")
@Tag(name = "Transaction Management")
@Slf4j
public class TransactionController {
    @Autowired
    private TransactionService service;
    
    @GetMapping
    @Operation(summary = "Get all transactions")
    public ResponseEntity<Page<TransactionDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Transaction> result = service.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get transaction by ID")
    public ResponseEntity<TransactionDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(toDTO(service.getById(id)));
    }
    
    @PostMapping
    @Operation(summary = "Create transaction")
    public ResponseEntity<TransactionDTO> create(@RequestBody TransactionDTO dto) {
        Transaction transaction = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(transaction));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update transaction")
    public ResponseEntity<TransactionDTO> update(
            @PathVariable Long id,
            @RequestBody TransactionDTO dto) {
        Transaction transaction = service.update(id, dto);
        return ResponseEntity.ok(toDTO(transaction));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete transaction")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    private TransactionDTO toDTO(Transaction entity) {
        return TransactionDTO.builder()
            .id(entity.getId())
            .name(entity.getName())
            .paymentDate(entity.getPaymentDate())
            .amount(entity.getAmount())
            .paymentStatus(entity.getPaymentStatus().toString())
            .description(entity.getDescription())
            .build();
    }
}

// ============================================
// 7. EXCEPTION HANDLING
// ============================================

package com.teleoss.exception;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String message) {
        super(message);
    }
}

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .message(ex.getMessage())
            .status(HttpStatus.NOT_FOUND.value())
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error", ex);
        ErrorResponse error = ErrorResponse.builder()
            .message("An unexpected error occurred")
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

@Data
@Builder
public class ErrorResponse {
    private String message;
    private int status;
    private LocalDateTime timestamp;
}

// ============================================
// 8. MAIN APPLICATION
// ============================================

package com.teleoss;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class TeleossApplication {
    public static void main(String[] args) {
        SpringApplication.run(TeleossApplication.class, args);
    }
}

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}

// ============================================
// 9. POM.XML DEPENDENCIES
// ============================================

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.teleoss</groupId>
    <artifactId>teleoss-api</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>TeleOSS API</name>
    <description>TeleOSS Backend API</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
    </parent>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Database -->
        <dependency>
            <groupId>org.mariadb.jdbc</groupId>
            <artifactId>mariadb-java-client</artifactId>
            <version>3.1.0</version>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>

        <!-- Swagger/OpenAPI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.0.0</version>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
