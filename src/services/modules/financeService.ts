import { apiService } from '../api/apiService';
import { DB_CONFIG } from '../api/config';

export interface Transaction {
  [key: string]: any;
}

export interface Invoice {
  [key: string]: any;
}

export interface Balance {
  [key: string]: any;
}

export interface BillingCycle {
  [key: string]: any;
}

class FinanceService {
  // Transaction APIs
  async getTransactions(page: number = 0, size: number = 50, filters?: any) {
    const params = { page, size, ...filters };
    return apiService.get<any>(
      DB_CONFIG.finance.endpoints.transactions,
      params
    );
  }

  async getTransactionDetail(id: string | number) {
    return apiService.get<Transaction>(
      `${DB_CONFIG.finance.endpoints.transactions}/${id}`
    );
  }

  async createTransaction(data: Partial<Transaction>) {
    return apiService.post<Transaction>(
      `${DB_CONFIG.finance.endpoints.transactions}/create`,
      data
    );
  }

  async updateTransaction(id: string | number, data: Partial<Transaction>) {
    return apiService.put<Transaction>(
      `${DB_CONFIG.finance.endpoints.transactions}/${id}`,
      data
    );
  }

  // Invoice APIs
  async getInvoices(page: number = 0, size: number = 50, filters?: any) {
    const params = { page, size, ...filters };
    return apiService.get<any>(
      DB_CONFIG.finance.endpoints.invoices,
      params
    );
  }

  async getInvoiceDetail(invoiceNo: string) {
    return apiService.get<Invoice>(
      `${DB_CONFIG.finance.endpoints.invoices}/${invoiceNo}`
    );
  }

  async createInvoice(data: Partial<Invoice>) {
    return apiService.post<Invoice>(
      `${DB_CONFIG.finance.endpoints.invoices}/create`,
      data
    );
  }

  async generateInvoice(enterpriseId: string | number, period: string) {
    return apiService.post<Invoice>(
      `${DB_CONFIG.finance.endpoints.invoices}/generate`,
      { enterpriseId, period }
    );
  }

  // Balance APIs
  async getBalance(enterpriseName?: string) {
    const params = enterpriseName ? { enterpriseName } : {};
    return apiService.get<any>(
      DB_CONFIG.finance.endpoints.balance,
      params
    );
  }

  async getEnterpriseBalance(enterpriseName: string) {
    return apiService.get<Balance>(
      `${DB_CONFIG.finance.endpoints.balance}/${enterpriseName}`
    );
  }

  async updateBalance(enterpriseName: string, amount: number, type: 'credit' | 'debit') {
    return apiService.put<Balance>(
      `${DB_CONFIG.finance.endpoints.balance}/${enterpriseName}`,
      { amount, type }
    );
  }

  // Billing Cycle APIs
  async getBillingCycles() {
    return apiService.get<BillingCycle[]>(
      DB_CONFIG.finance.endpoints.billingCycles
    );
  }

  async getBillingCycleDetail(id: string | number) {
    return apiService.get<BillingCycle>(
      `${DB_CONFIG.finance.endpoints.billingCycles}/${id}`
    );
  }

  async createBillingCycle(data: Partial<BillingCycle>) {
    return apiService.post<BillingCycle>(
      `${DB_CONFIG.finance.endpoints.billingCycles}/create`,
      data
    );
  }

  // Summary Reports
  async getFinancialSummary(startDate: string, endDate: string) {
    return apiService.get<any>(
      `${DB_CONFIG.finance.endpoints.transactions}/summary`,
      { startDate, endDate }
    );
  }

  async getPaymentStatusReport() {
    return apiService.get<any>(
      `${DB_CONFIG.finance.endpoints.invoices}/status-report`
    );
  }

  async getOutstandingAmount() {
    return apiService.get<any>(
      `${DB_CONFIG.finance.endpoints.balance}/outstanding`
    );
  }
}

export const financeService = new FinanceService();
