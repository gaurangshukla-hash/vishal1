// ============================================
// Example Usage of Database Services
// ============================================
// Copy these patterns to use in your actual components

import { enterpriseService } from './enterpriseService';
import { financeService } from './financeService';
import { rateService } from './rateService';
import { productService } from './productService';
import { smsService } from './smsService';
import { reportService } from './reportService';
import { adminService } from './adminService';

// ============================================
// EXAMPLE 1: Enterprise Module Usage
// ============================================
export async function exampleEnterpriseUsage() {
  // Get paginated list
  const result = await enterpriseService.getList(0, 50);
  if (result.success) {
    console.log('Enterprises:', result.data?.content);
    console.log('Total:', result.data?.totalElements);
  } else {
    console.error('Error:', result.error);
  }

  // Get single enterprise
  const detail = await enterpriseService.getDetail(1);
  if (detail.success) {
    console.log('Enterprise:', detail.data);
  }

  // Create new enterprise
  const create = await enterpriseService.create({
    enterprise_name: 'New Corp',
    enterprise_type: 'CUSTOMER',
    status: 'ACTIVE'
  });

  // Update enterprise
  const update = await enterpriseService.update(1, {
    enterprise_name: 'Updated Corp'
  });

  // Search enterprises
  const search = await enterpriseService.search('ABC');

  // Get by type
  const customers = await enterpriseService.getByType('CUSTOMER');

  // Get active only
  const active = await enterpriseService.getActive();
}

// ============================================
// EXAMPLE 2: Finance Module Usage
// ============================================
export async function exampleFinanceUsage() {
  // Get transactions
  const transactions = await financeService.getTransactions(0, 50, {
    status: 'PENDING'
  });

  // Create transaction
  const newTxn = await financeService.createTransaction({
    name: 'Payment',
    amount: 5000,
    paymentDate: new Date().toISOString(),
    paymentStatus: 'PENDING'
  });

  // Get invoices
  const invoices = await financeService.getInvoices(0, 50);

  // Generate invoice
  const generated = await financeService.generateInvoice(1, 'MONTHLY');

  // Get enterprise balance
  const balance = await financeService.getEnterpriseBalance('ABC Corp');

  // Update balance (add 1000 credit)
  const updated = await financeService.updateBalance('ABC Corp', 1000, 'credit');

  // Get financial summary
  const summary = await financeService.getFinancialSummary(
    '2024-01-01',
    '2024-01-31'
  );

  // Get outstanding amount
  const outstanding = await financeService.getOutstandingAmount();
}

// ============================================
// EXAMPLE 3: Rate Module Usage
// ============================================
export async function exampleRateUsage() {
  // Get MCCMNC codes
  const mccmnc = await rateService.getMCCMNC(0, 50);

  // Search specific MCCMNC
  const searched = await rateService.searchMCCMNC('310410');

  // Get by country
  const usRates = await rateService.getMCCMNCByCountry('US');

  // Get MO Reference Book
  const moRef = await rateService.getMOReference(0, 50);

  // Create MO Reference
  const newMO = await rateService.createMOReference({
    customer_trunk: 'TRUNK_001',
    number: '1712284',
    keyword: 'SALE',
    rate: 0.015,
    vendor_rate: 0.012,
    mccmnc: '310410'
  });

  // Lookup rate
  const rate = await rateService.lookupRate('USA', '310410');

  // Get highest rates
  const highest = await rateService.getHighestRates(10);

  // Get countries
  const countries = await rateService.getCountries();
}

// ============================================
// EXAMPLE 4: Product Module Usage
// ============================================
export async function exampleProductUsage() {
  // Get categories
  const categories = await productService.getCategories();

  // Create category
  const newCat = await productService.createCategory({
    category_name: 'International'
  });

  // Get products
  const products = await productService.getProducts(0, 50);

  // Create product
  const newProduct = await productService.createProduct({
    product_name: 'SMS Bulk',
    category_id: 1,
    status: 'ACTIVE'
  });

  // Search products
  const searched = await productService.searchProducts('OTP');

  // Get active products
  const active = await productService.getActiveProducts();

  // Get by category
  const intl = await productService.getProductsByCategory(1);
}

// ============================================
// EXAMPLE 5: SMS Services Module Usage
// ============================================
export async function exampleSMSServicesUsage() {
  // Get translation rules
  const rules = await smsService.getTranslationRules(0, 50);

  // Get ingress rules only
  const ingressRules = await smsService.getTranslationRulesByType('INGRESS');

  // Create translation rule
  const newRule = await smsService.createTranslationRule({
    translation_rule_name: 'Strip Prefix',
    type: 'INGRESS',
    action: 'MODIFY',
    mccmnc: '310410'
  });

  // Get auto upload rules
  const autoRules = await smsService.getAutoUploadRules(0, 50);

  // Toggle auto upload rule
  const toggled = await smsService.toggleAutoUploadRule(1, true);

  // Get business companies
  const companies = await smsService.getBusinessCompanies();

  // Get SMS configuration
  const config = await smsService.getSMSConfiguration(1);
}

// ============================================
// EXAMPLE 6: Report Module Usage
// ============================================
export async function exampleReportUsage() {
  // Get daily reports
  const daily = await reportService.getDailyReports(0, 50);

  // Get report by date
  const byDate = await reportService.getDailyReportByDate('2024-01-20');

  // Get summary reports
  const summary = await reportService.getSummaryReports(0, 50);

  // Get monthly summary
  const monthly = await reportService.getMonthlySummary('January', 2024);

  // Get quarterly summary
  const quarterly = await reportService.getQuarterlySummary(1, 2024);

  // Generate custom report
  const custom = await reportService.generateCustomReport({
    name: 'Traffic Report',
    type: 'TRAFFIC',
    filters: {
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    columns: ['date', 'total_messages', 'successful', 'failed']
  });

  // Export report
  const exported = await reportService.exportReport(1, 'PDF');

  // Get TPS report
  const tps = await reportService.getTPSReport('2024-01-01', '2024-01-31');

  // Schedule report
  const scheduled = await reportService.scheduleReport({
    reportType: 'DAILY',
    frequency: 'DAILY',
    recipients: ['admin@example.com'],
    format: 'PDF'
  });
}

// ============================================
// EXAMPLE 7: Admin Module Usage
// ============================================
export async function exampleAdminUsage() {
  // Get users
  const users = await adminService.getUsers(0, 50);

  // Create user
  const newUser = await adminService.createUser({
    username: 'john_doe',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    role_id: 1
  });

  // Reset user password
  const reset = await adminService.resetPassword(1);

  // Get roles
  const roles = await adminService.getRoles();

  // Create role
  const newRole = await adminService.createRole({
    role_name: 'Finance Manager',
    description: 'Manages financial operations'
  });

  // Assign permissions to role
  const assigned = await adminService.assignPermissionToRole(1, [1, 2, 3]);

  // Get audit logs
  const logs = await adminService.getAuditLogs(0, 50);

  // Get logs by user
  const userLogs = await adminService.getAuditLogsByUser(1, '2024-01-01', '2024-01-31');

  // Export audit logs
  const exported = await adminService.exportAuditLogs(
    '2024-01-01',
    '2024-01-31',
    'PDF'
  );
}

// ============================================
// EXAMPLE 8: Error Handling Pattern
// ============================================
export async function exampleErrorHandling() {
  try {
    const result = await enterpriseService.getList(0, 50);
    
    if (!result.success) {
      console.error('API Error:', result.error);
      throw new Error(result.error);
    } else {
      const { content, totalElements } = result.data;
      console.log(`Got ${content.length} of ${totalElements} enterprises`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ============================================
// EXAMPLE 9: Advanced Filtering Pattern
// ============================================
export async function exampleAdvancedFiltering() {
  // Complex filters for transactions
  const transactions = await financeService.getTransactions(0, 50, {
    status: 'PENDING',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });

  // Chained operations for rates
  const filtered = await rateService.getMOReference(0, 50, {
    trunk: 'TRUNK_001',
    mccmnc: '310410'
  });

  return { transactions, filtered };
}

// ============================================
// EXAMPLE 10: Batch Operations
// ============================================
export async function exampleBatchOperations() {
  // Create multiple enterprises
  const enterprises = ['Corp A', 'Corp B', 'Corp C'];
  
  const results = await Promise.all(
    enterprises.map(name =>
      enterpriseService.create({
        enterprise_name: name,
        enterprise_type: 'CUSTOMER',
        status: 'ACTIVE'
      })
    )
  );

  return results;
}

// ============================================
// EXAMPLE 11: Pagination Pattern
// ============================================
export async function examplePagination() {
  let allEnterprises = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const result = await enterpriseService.getList(page, 50);
    
    if (result.success) {
      allEnterprises = [...allEnterprises, ...result.data.content];
      hasMore = page < result.data.totalPages - 1;
      page++;
    } else {
      hasMore = false;
    }
  }

  return allEnterprises;
}

// ============================================
// EXAMPLE 12: Data Transformation
// ============================================
export async function exampleDataTransformation() {
  const result = await enterpriseService.getList(0, 100);
  
  if (result.success) {
    // Transform API response to UI format
    const uiData = result.data.content.map(e => ({
      id: e.enterprise_id,
      name: e.enterprise_name,
      type: e.enterprise_type,
      isActive: e.status === 'ACTIVE'
    }));

    return uiData;
  }

  return [];
}
