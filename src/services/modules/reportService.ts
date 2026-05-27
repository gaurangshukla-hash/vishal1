import { apiService } from '../api/apiService';
import { DB_CONFIG } from '../api/config';

export interface DailyReport {
  [key: string]: any;
}

export interface SummaryReport {
  [key: string]: any;
}

export interface CustomReport {
  [key: string]: any;
}

class ReportService {
  // Daily Report APIs
  async getDailyReports(page: number = 0, size: number = 50, filters?: any) {
    const params = { page, size, ...filters };
    return apiService.get<any>(
      DB_CONFIG.report.endpoints.daily,
      params
    );
  }

  async getDailyReportDetail(id: string | number) {
    return apiService.get<DailyReport>(
      `${DB_CONFIG.report.endpoints.daily}/${id}`
    );
  }

  async getDailyReportByDate(date: string) {
    return apiService.get<DailyReport>(
      DB_CONFIG.report.endpoints.daily,
      { date }
    );
  }

  async getDailyReportByEnterprise(enterpriseId: string | number, startDate: string, endDate: string) {
    return apiService.get<DailyReport[]>(
      DB_CONFIG.report.endpoints.daily,
      { enterpriseId, startDate, endDate }
    );
  }

  // Summary Report APIs
  async getSummaryReports(page: number = 0, size: number = 50, filters?: any) {
    const params = { page, size, ...filters };
    return apiService.get<any>(
      DB_CONFIG.report.endpoints.summary,
      params
    );
  }

  async getSummaryReportDetail(id: string | number) {
    return apiService.get<SummaryReport>(
      `${DB_CONFIG.report.endpoints.summary}/${id}`
    );
  }

  async getSummaryReportByPeriod(period: string, startDate: string, endDate: string) {
    return apiService.get<SummaryReport>(
      DB_CONFIG.report.endpoints.summary,
      { period, startDate, endDate }
    );
  }

  async getMonthlySummary(month: string, year: number) {
    return apiService.get<SummaryReport>(
      `${DB_CONFIG.report.endpoints.summary}/monthly`,
      { month, year }
    );
  }

  async getQuarterlySummary(quarter: number, year: number) {
    return apiService.get<SummaryReport>(
      `${DB_CONFIG.report.endpoints.summary}/quarterly`,
      { quarter, year }
    );
  }

  async getAnnualSummary(year: number) {
    return apiService.get<SummaryReport>(
      `${DB_CONFIG.report.endpoints.summary}/annual`,
      { year }
    );
  }

  // Custom Report APIs
  async generateCustomReport(config: {
    name: string;
    type: string;
    filters: any;
    columns: string[];
  }) {
    return apiService.post<CustomReport>(
      DB_CONFIG.report.endpoints.custom,
      config
    );
  }

  async getCustomReports(page: number = 0, size: number = 50) {
    return apiService.get<any>(
      DB_CONFIG.report.endpoints.custom,
      { page, size }
    );
  }

  async getCustomReportDetail(id: string | number) {
    return apiService.get<CustomReport>(
      `${DB_CONFIG.report.endpoints.custom}/${id}`
    );
  }

  async saveCustomReport(config: CustomReport) {
    return apiService.post<CustomReport>(
      `${DB_CONFIG.report.endpoints.custom}/save`,
      config
    );
  }

  // Report Export
  async exportReport(reportId: string | number, format: 'PDF' | 'EXCEL' | 'CSV') {
    return apiService.post<any>(
      `${DB_CONFIG.report.endpoints.export}/${reportId}`,
      { format }
    );
  }

  async exportDailyReports(startDate: string, endDate: string, format: 'PDF' | 'EXCEL') {
    return apiService.post<any>(
      `${DB_CONFIG.report.endpoints.export}/daily`,
      { startDate, endDate, format }
    );
  }

  async exportSummaryReport(period: string, format: 'PDF' | 'EXCEL') {
    return apiService.post<any>(
      `${DB_CONFIG.report.endpoints.export}/summary`,
      { period, format }
    );
  }

  // Specialized Reports
  async getTPSReport(startDate: string, endDate: string) {
    return apiService.get<any>(
      '/report/tps',
      { startDate, endDate }
    );
  }

  async getTrafficReport(startDate: string, endDate: string) {
    return apiService.get<any>(
      '/report/traffic',
      { startDate, endDate }
    );
  }

  async getSupplierReport(startDate: string, endDate: string) {
    return apiService.get<any>(
      '/report/supplier',
      { startDate, endDate }
    );
  }

  async getRevenueReport(startDate: string, endDate: string) {
    return apiService.get<any>(
      '/report/revenue',
      { startDate, endDate }
    );
  }

  async getComplianceReport(startDate: string, endDate: string) {
    return apiService.get<any>(
      '/report/compliance',
      { startDate, endDate }
    );
  }

  // Scheduled Reports
  async scheduleReport(config: {
    reportType: string;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    recipients: string[];
    format: string;
  }) {
    return apiService.post<any>(
      '/report/schedule',
      config
    );
  }

  async getScheduledReports() {
    return apiService.get<any>('/report/scheduled');
  }
}

export const reportService = new ReportService();
