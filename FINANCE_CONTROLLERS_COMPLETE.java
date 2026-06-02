// ============================================
// FINANCE MODULE REST CONTROLLERS
// Complete API Endpoints for Finance Management
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
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDate;
import java.math.BigDecimal;

// ============================================
// PAYMENT CONTROLLER
// ============================================

@RestController
@RequestMapping("/api/finance/payment")
@CrossOrigin(origins = "*")
@Tag(name = "Payment Management")
@Slf4j
public class PaymentController {
    @Autowired
    private PaymentService service;
    
    @GetMapping
    @Operation(summary = "Get all payments")
    public ResponseEntity<Page<PaymentDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Payment> result = service.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get payments by status")
    public ResponseEntity<Page<PaymentDTO>> getByStatus(
            @PathVariable PaymentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Payment> result = service.getByStatus(status, PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/enterprise/{enterpriseName}")
    @Operation(summary = "Get payments by enterprise and date range")
    public ResponseEntity<Page<PaymentDTO>> getByEnterprise(
            @PathVariable String enterpriseName,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Payment> result = service.getByEnterprise(
            enterpriseName, startDate, endDate, PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @PostMapping
    @Operation(summary = "Create new payment")
    public ResponseEntity<PaymentDTO> create(@RequestBody PaymentDTO dto) {
        Payment payment = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(payment));
    }
    
    @PutMapping("/{id}/status")
    @Operation(summary = "Update payment status")
    public ResponseEntity<PaymentDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam PaymentStatus status) {
        Payment payment = service.updateStatus(id, status);
        return ResponseEntity.ok(toDTO(payment));
    }
    
    @GetMapping("/summary")
    @Operation(summary = "Get payment summary")
    public ResponseEntity<?> getSummary(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        // Return payment summary: total, by method, by status
        return ResponseEntity.ok("{}");
    }
    
    private PaymentDTO toDTO(Payment entity) {
        return PaymentDTO.builder()
            .id(entity.getId())
            .paymentNumber(entity.getPaymentNumber())
            .enterpriseName(entity.getEnterpriseName())
            .enterpriseType(entity.getEnterpriseType().toString())
            .paymentDate(entity.getPaymentDate())
            .paymentMethod(entity.getPaymentMethod().toString())
            .amount(entity.getAmount())
            .referenceNumber(entity.getReferenceNumber())
            .status(entity.getStatus().toString())
            .build();
    }
}

// ============================================
// CUSTOMER INVOICE CONTROLLER
// ============================================

@RestController
@RequestMapping("/api/finance/customer-invoice")
@CrossOrigin(origins = "*")
@Tag(name = "Customer Invoice Management")
@Slf4j
public class CustomerInvoiceController {
    @Autowired
    private CustomerInvoiceService service;
    
    @GetMapping
    @Operation(summary = "Get all customer invoices")
    public ResponseEntity<Page<CustomerInvoiceDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<CustomerInvoice> result = service.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get customer invoice by ID")
    public ResponseEntity<CustomerInvoiceDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(toDTO(service.getById(id)));
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get invoices by status")
    public ResponseEntity<Page<CustomerInvoiceDTO>> getByStatus(
            @PathVariable InvoiceStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<CustomerInvoice> result = service.getByStatus(status, PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/customer/{customerName}")
    @Operation(summary = "Get invoices by customer")
    public ResponseEntity<Page<CustomerInvoiceDTO>> getByCustomer(
            @PathVariable String customerName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<CustomerInvoice> result = service.getByCustomer(customerName, PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/overdue")
    @Operation(summary = "Get overdue invoices")
    public ResponseEntity<Page<CustomerInvoiceDTO>> getOverdue(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<CustomerInvoice> result = service.getOverdueInvoices(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @PostMapping
    @Operation(summary = "Create new customer invoice")
    public ResponseEntity<CustomerInvoiceDTO> create(@RequestBody CustomerInvoiceDTO dto) {
        CustomerInvoice invoice = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(invoice));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update customer invoice")
    public ResponseEntity<CustomerInvoiceDTO> update(
            @PathVariable Long id,
            @RequestBody CustomerInvoiceDTO dto) {
        CustomerInvoice invoice = service.update(id, dto);
        return ResponseEntity.ok(toDTO(invoice));
    }
    
    @PostMapping("/{id}/payment")
    @Operation(summary = "Record payment against invoice")
    public ResponseEntity<CustomerInvoiceDTO> recordPayment(
            @PathVariable Long id,
            @RequestParam BigDecimal amount) {
        CustomerInvoice invoice = service.recordPayment(id, amount);
        return ResponseEntity.ok(toDTO(invoice));
    }
    
    @GetMapping("/summary")
    @Operation(summary = "Get invoice summary")
    public ResponseEntity<?> getSummary(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        // Return summary: total invoiced, paid, outstanding
        return ResponseEntity.ok("{}");
    }
    
    private CustomerInvoiceDTO toDTO(CustomerInvoice entity) {
        return CustomerInvoiceDTO.builder()
            .id(entity.getId())
            .invoiceNumber(entity.getInvoiceNumber())
            .customerName(entity.getCustomerName())
            .invoiceDate(entity.getInvoiceDate())
            .dueDate(entity.getDueDate())
            .totalAmount(entity.getTotalAmount())
            .netAmount(entity.getNetAmount())
            .paidAmount(entity.getPaidAmount())
            .outstandingAmount(entity.getOutstandingAmount())
            .status(entity.getStatus().toString())
            .build();
    }
}

// ============================================
// VENDOR INVOICE CONTROLLER
// ============================================

@RestController
@RequestMapping("/api/finance/vendor-invoice")
@CrossOrigin(origins = "*")
@Tag(name = "Vendor Invoice Management")
@Slf4j
public class VendorInvoiceController {
    @Autowired
    private VendorInvoiceService service;
    
    @GetMapping
    @Operation(summary = "Get all vendor invoices")
    public ResponseEntity<Page<VendorInvoiceDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<VendorInvoice> result = service.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get vendor invoice by ID")
    public ResponseEntity<VendorInvoiceDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(toDTO(service.getById(id)));
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get invoices by status")
    public ResponseEntity<Page<VendorInvoiceDTO>> getByStatus(
            @PathVariable VendorInvoiceStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<VendorInvoice> result = service.getByStatus(status, PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/vendor/{vendorName}")
    @Operation(summary = "Get invoices by vendor")
    public ResponseEntity<Page<VendorInvoiceDTO>> getByVendor(
            @PathVariable String vendorName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<VendorInvoice> result = service.getByVendor(vendorName, PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @PostMapping
    @Operation(summary = "Create new vendor invoice")
    public ResponseEntity<VendorInvoiceDTO> create(@RequestBody VendorInvoiceDTO dto) {
        VendorInvoice invoice = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(invoice));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update vendor invoice")
    public ResponseEntity<VendorInvoiceDTO> update(
            @PathVariable Long id,
            @RequestBody VendorInvoiceDTO dto) {
        VendorInvoice invoice = service.update(id, dto);
        return ResponseEntity.ok(toDTO(invoice));
    }
    
    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve vendor invoice")
    public ResponseEntity<VendorInvoiceDTO> approve(@PathVariable Long id) {
        VendorInvoice invoice = service.approve(id);
        return ResponseEntity.ok(toDTO(invoice));
    }
    
    @PostMapping("/{id}/payment")
    @Operation(summary = "Record payment against invoice")
    public ResponseEntity<VendorInvoiceDTO> recordPayment(
            @PathVariable Long id,
            @RequestParam BigDecimal amount) {
        VendorInvoice invoice = service.recordPayment(id, amount);
        return ResponseEntity.ok(toDTO(invoice));
    }
    
    private VendorInvoiceDTO toDTO(VendorInvoice entity) {
        return VendorInvoiceDTO.builder()
            .id(entity.getId())
            .invoiceNumber(entity.getInvoiceNumber())
            .vendorName(entity.getVendorName())
            .invoiceDate(entity.getInvoiceDate())
            .dueDate(entity.getDueDate())
            .totalAmount(entity.getTotalAmount())
            .netAmount(entity.getNetAmount())
            .paidAmount(entity.getPaidAmount())
            .outstandingAmount(entity.getOutstandingAmount())
            .poNumber(entity.getPoNumber())
            .status(entity.getStatus().toString())
            .build();
    }
}

// ============================================
// STATEMENT OF ACCOUNT CONTROLLER
// ============================================

@RestController
@RequestMapping("/api/finance/soa")
@CrossOrigin(origins = "*")
@Tag(name = "Statement of Account Management")
@Slf4j
public class StatementOfAccountController {
    @Autowired
    private StatementOfAccountService service;
    
    @GetMapping
    @Operation(summary = "Get all SOAs")
    public ResponseEntity<Page<StatementOfAccountDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<StatementOfAccount> result = service.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get SOA by ID with line items")
    public ResponseEntity<StatementOfAccountDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(toDTO(service.getById(id)));
    }
    
    @GetMapping("/enterprise/{enterpriseName}")
    @Operation(summary = "Get SOAs by enterprise")
    public ResponseEntity<Page<StatementOfAccountDTO>> getByEnterprise(
            @PathVariable String enterpriseName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<StatementOfAccount> result = service.getByEnterprise(
            enterpriseName, PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @PostMapping("/generate")
    @Operation(summary = "Generate new SOA")
    public ResponseEntity<StatementOfAccountDTO> generate(
            @RequestParam String enterpriseName,
            @RequestParam LocalDate periodStart,
            @RequestParam LocalDate periodEnd) {
        StatementOfAccount soa = service.generateSOA(enterpriseName, periodStart, periodEnd);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(soa));
    }
    
    @PutMapping("/{id}/finalize")
    @Operation(summary = "Finalize SOA")
    public ResponseEntity<StatementOfAccountDTO> finalize(@PathVariable Long id) {
        StatementOfAccount soa = service.finalize(id);
        return ResponseEntity.ok(toDTO(soa));
    }
    
    @GetMapping("/{id}/download")
    @Operation(summary = "Download SOA as PDF")
    public ResponseEntity<?> downloadSOA(@PathVariable Long id) {
        // Return PDF file
        return ResponseEntity.ok("PDF download");
    }
    
    private StatementOfAccountDTO toDTO(StatementOfAccount entity) {
        return StatementOfAccountDTO.builder()
            .id(entity.getId())
            .soaNumber(entity.getSoaNumber())
            .enterpriseName(entity.getEnterpriseName())
            .periodStart(entity.getPeriodStart())
            .periodEnd(entity.getPeriodEnd())
            .openingBalance(entity.getOpeningBalance())
            .totalDebit(entity.getTotalDebit())
            .totalCredit(entity.getTotalCredit())
            .closingBalance(entity.getClosingBalance())
            .status(entity.getStatus().toString())
            .build();
    }
}

// ============================================
// CURRENCY CONTROLLER
// ============================================

@RestController
@RequestMapping("/api/finance/currency")
@CrossOrigin(origins = "*")
@Tag(name = "Currency Management")
@Slf4j
public class CurrencyController {
    @Autowired
    private CurrencyService service;
    
    @GetMapping
    @Operation(summary = "Get all currencies")
    public ResponseEntity<Page<CurrencyDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Currency> result = service.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get active currencies")
    public ResponseEntity<Page<CurrencyDTO>> getActive(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<Currency> result = service.getActive(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/{code}")
    @Operation(summary = "Get currency by code")
    public ResponseEntity<CurrencyDTO> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(toDTO(service.getByCode(code)));
    }
    
    @PostMapping
    @Operation(summary = "Create new currency")
    public ResponseEntity<CurrencyDTO> create(@RequestBody CurrencyDTO dto) {
        Currency currency = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(currency));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update currency")
    public ResponseEntity<CurrencyDTO> update(
            @PathVariable Long id,
            @RequestBody CurrencyDTO dto) {
        Currency currency = service.update(id, dto);
        return ResponseEntity.ok(toDTO(currency));
    }
    
    @PostMapping("/convert")
    @Operation(summary = "Convert currency")
    public ResponseEntity<BigDecimal> convert(
            @RequestParam String fromCurrency,
            @RequestParam String toCurrency,
            @RequestParam BigDecimal amount) {
        BigDecimal result = service.convertCurrency(fromCurrency, toCurrency, amount);
        return ResponseEntity.ok(result);
    }
    
    private CurrencyDTO toDTO(Currency entity) {
        return CurrencyDTO.builder()
            .id(entity.getId())
            .code(entity.getCode())
            .name(entity.getName())
            .symbol(entity.getSymbol())
            .isActive(entity.getIsActive())
            .build();
    }
}

// ============================================
// CURRENCY EXCHANGE RATE CONTROLLER
// ============================================

@RestController
@RequestMapping("/api/finance/exchange-rate")
@CrossOrigin(origins = "*")
@Tag(name = "Currency Exchange Rate Management")
@Slf4j
public class CurrencyExchangeRateController {
    @Autowired
    private CurrencyExchangeRateService service;
    
    @GetMapping
    @Operation(summary = "Get all exchange rates")
    public ResponseEntity<Page<ExchangeRateDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<CurrencyExchangeRate> result = service.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/pair/{from}/{to}")
    @Operation(summary = "Get latest rate for currency pair")
    public ResponseEntity<ExchangeRateDTO> getLatestRate(
            @PathVariable String from,
            @PathVariable String to) {
        return ResponseEntity.ok(toDTO(service.getLatestRate(from, to)));
    }
    
    @GetMapping("/history/{from}/{to}")
    @Operation(summary = "Get rate history for currency pair")
    public ResponseEntity<Page<ExchangeRateDTO>> getHistory(
            @PathVariable String from,
            @PathVariable String to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<CurrencyExchangeRate> result = service.getHistory(from, to, PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @PostMapping
    @Operation(summary = "Add new exchange rate")
    public ResponseEntity<ExchangeRateDTO> create(@RequestBody ExchangeRateDTO dto) {
        CurrencyExchangeRate rate = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(rate));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update exchange rate")
    public ResponseEntity<ExchangeRateDTO> update(
            @PathVariable Long id,
            @RequestBody ExchangeRateDTO dto) {
        CurrencyExchangeRate rate = service.update(id, dto);
        return ResponseEntity.ok(toDTO(rate));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete exchange rate")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    private ExchangeRateDTO toDTO(CurrencyExchangeRate entity) {
        return ExchangeRateDTO.builder()
            .id(entity.getId())
            .fromCurrency(entity.getFromCurrency())
            .toCurrency(entity.getToCurrency())
            .exchangeRate(entity.getExchangeRate())
            .rateDate(entity.getRateDate())
            .source(entity.getSource())
            .status(entity.getStatus().toString())
            .build();
    }
}

// ============================================
// ENTERPRISE BALANCE CONTROLLER
// ============================================

@RestController
@RequestMapping("/api/finance/balance")
@CrossOrigin(origins = "*")
@Tag(name = "Enterprise Balance Management")
@Slf4j
public class EnterpriseBalanceController {
    @Autowired
    private EnterpriseBalanceService service;
    
    @GetMapping
    @Operation(summary = "Get all balances")
    public ResponseEntity<Page<EnterpriseBalanceDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<EnterpriseBalance> result = service.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/{enterpriseName}")
    @Operation(summary = "Get balance by enterprise name")
    public ResponseEntity<EnterpriseBalanceDTO> getByName(@PathVariable String enterpriseName) {
        return ResponseEntity.ok(toDTO(service.getByName(enterpriseName)));
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get balances by status")
    public ResponseEntity<Page<EnterpriseBalanceDTO>> getByStatus(
            @PathVariable AccountStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<EnterpriseBalance> result = service.getByStatus(status, PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @PutMapping("/{enterpriseName}/update")
    @Operation(summary = "Update balance amount")
    public ResponseEntity<EnterpriseBalanceDTO> updateBalance(
            @PathVariable String enterpriseName,
            @RequestParam BigDecimal amount) {
        EnterpriseBalance balance = service.updateBalance(enterpriseName, amount);
        return ResponseEntity.ok(toDTO(balance));
    }
    
    @PutMapping("/{enterpriseName}/credit")
    @Operation(summary = "Adjust credit limit")
    public ResponseEntity<EnterpriseBalanceDTO> addCredit(
            @PathVariable String enterpriseName,
            @RequestParam BigDecimal creditLimit) {
        EnterpriseBalance balance = service.addCredit(enterpriseName, creditLimit);
        return ResponseEntity.ok(toDTO(balance));
    }
    
    @PutMapping("/{enterpriseName}/status")
    @Operation(summary = "Change account status")
    public ResponseEntity<EnterpriseBalanceDTO> changeStatus(
            @PathVariable String enterpriseName,
            @RequestParam AccountStatus status) {
        EnterpriseBalance balance = service.changeStatus(enterpriseName, status);
        return ResponseEntity.ok(toDTO(balance));
    }
    
    private EnterpriseBalanceDTO toDTO(EnterpriseBalance entity) {
        return EnterpriseBalanceDTO.builder()
            .id(entity.getId())
            .enterpriseName(entity.getEnterpriseName())
            .currentBalance(entity.getCurrentBalance())
            .creditLimit(entity.getCreditLimit())
            .availableCredit(entity.getAvailableCredit())
            .totalReceivable(entity.getTotalReceivable())
            .totalPayable(entity.getTotalPayable())
            .accountStatus(entity.getAccountStatus().toString())
            .build();
    }
}

// ============================================
// BILLING CYCLE CONTROLLER
// ============================================

@RestController
@RequestMapping("/api/finance/billing-cycle")
@CrossOrigin(origins = "*")
@Tag(name = "Billing Cycle Management")
@Slf4j
public class BillingCycleController {
    @Autowired
    private BillingCycleService service;
    
    @GetMapping
    @Operation(summary = "Get all billing cycles")
    public ResponseEntity<Page<BillingCycleDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<BillingCycle> result = service.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get active billing cycles")
    public ResponseEntity<Page<BillingCycleDTO>> getActive(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Page<BillingCycle> result = service.getActive(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(this::toDTO));
    }
    
    @GetMapping("/default")
    @Operation(summary = "Get default billing cycle")
    public ResponseEntity<BillingCycleDTO> getDefault() {
        return ResponseEntity.ok(toDTO(service.getDefault()));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get billing cycle by ID")
    public ResponseEntity<BillingCycleDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(toDTO(service.getById(id)));
    }
    
    @PostMapping
    @Operation(summary = "Create new billing cycle")
    public ResponseEntity<BillingCycleDTO> create(@RequestBody BillingCycleDTO dto) {
        BillingCycle cycle = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(cycle));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update billing cycle")
    public ResponseEntity<BillingCycleDTO> update(
            @PathVariable Long id,
            @RequestBody BillingCycleDTO dto) {
        BillingCycle cycle = service.update(id, dto);
        return ResponseEntity.ok(toDTO(cycle));
    }
    
    @PutMapping("/{id}/set-default")
    @Operation(summary = "Set as default billing cycle")
    public ResponseEntity<BillingCycleDTO> setDefault(@PathVariable Long id) {
        BillingCycle cycle = service.setAsDefault(id);
        return ResponseEntity.ok(toDTO(cycle));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete billing cycle")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    private BillingCycleDTO toDTO(BillingCycle entity) {
        return BillingCycleDTO.builder()
            .id(entity.getId())
            .cycleName(entity.getCycleName())
            .cycleType(entity.getCycleType().toString())
            .billingType(entity.getBillingType().toString())
            .usageDays(entity.getUsageDays())
            .dueDays(entity.getDueDays())
            .graceDays(entity.getGraceDays())
            .reminderDays(entity.getReminderDays())
            .latePaymentCharge(entity.getLatePaymentCharge())
            .isDefault(entity.getIsDefault())
            .isActive(entity.getIsActive())
            .build();
    }
}

// ============================================
// DTO CLASSES
// ============================================

@Data
@Builder
public class PaymentDTO {
    private Long id;
    private String paymentNumber;
    private String enterpriseName;
    private String enterpriseType;
    private LocalDate paymentDate;
    private String paymentMethod;
    private BigDecimal amount;
    private String referenceNumber;
    private String description;
    private String status;
}

@Data
@Builder
public class CustomerInvoiceDTO {
    private Long id;
    private String invoiceNumber;
    private String customerName;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal netAmount;
    private BigDecimal paidAmount;
    private BigDecimal outstandingAmount;
    private String paymentTerms;
    private String status;
    private String billingType;
}

@Data
@Builder
public class VendorInvoiceDTO {
    private Long id;
    private String invoiceNumber;
    private String vendorName;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private BigDecimal totalAmount;
    private BigDecimal netAmount;
    private BigDecimal paidAmount;
    private BigDecimal outstandingAmount;
    private String poNumber;
    private String status;
}

@Data
@Builder
public class StatementOfAccountDTO {
    private Long id;
    private String soaNumber;
    private String enterpriseName;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal openingBalance;
    private BigDecimal totalDebit;
    private BigDecimal totalCredit;
    private BigDecimal closingBalance;
    private String status;
}

@Data
@Builder
public class CurrencyDTO {
    private Long id;
    private String code;
    private String name;
    private String symbol;
    private Boolean isActive;
}

@Data
@Builder
public class ExchangeRateDTO {
    private Long id;
    private String fromCurrency;
    private String toCurrency;
    private BigDecimal exchangeRate;
    private LocalDate rateDate;
    private String source;
    private String status;
}

@Data
@Builder
public class EnterpriseBalanceDTO {
    private Long id;
    private String enterpriseName;
    private BigDecimal currentBalance;
    private BigDecimal creditLimit;
    private BigDecimal availableCredit;
    private BigDecimal totalReceivable;
    private BigDecimal totalPayable;
    private String accountStatus;
}

@Data
@Builder
public class BillingCycleDTO {
    private Long id;
    private String cycleName;
    private String cycleType;
    private String billingType;
    private Integer usageDays;
    private Integer dueDays;
    private Integer graceDays;
    private Integer reminderDays;
    private BigDecimal latePaymentCharge;
    private Boolean isDefault;
    private Boolean isActive;
}
