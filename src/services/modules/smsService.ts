import { apiService } from '../api/apiService';
import { DB_CONFIG } from '../api/config';

export interface TranslationRule {
  [key: string]: any;
}

export interface AutoUploadRule {
  [key: string]: any;
}

export interface BusinessCompany {
  [key: string]: any;
}

class SMSService {
  // Translation Rule APIs
  async getTranslationRules(page: number = 0, size: number = 50, filters?: any) {
    const params = { page, size, ...filters };
    return apiService.get<any>(
      DB_CONFIG.smsServices.endpoints.translationRules,
      params
    );
  }

  async getTranslationRuleDetail(id: string | number) {
    return apiService.get<TranslationRule>(
      `${DB_CONFIG.smsServices.endpoints.translationRules}/${id}`
    );
  }

  async createTranslationRule(data: Partial<TranslationRule>) {
    return apiService.post<TranslationRule>(
      `${DB_CONFIG.smsServices.endpoints.translationRules}/create`,
      data
    );
  }

  async updateTranslationRule(id: string | number, data: Partial<TranslationRule>) {
    return apiService.put<TranslationRule>(
      `${DB_CONFIG.smsServices.endpoints.translationRules}/${id}`,
      data
    );
  }

  async deleteTranslationRule(id: string | number) {
    return apiService.delete(
      `${DB_CONFIG.smsServices.endpoints.translationRules}/${id}`
    );
  }

  async getTranslationRulesByType(type: 'INGRESS' | 'EGRESS') {
    return apiService.get<TranslationRule[]>(
      DB_CONFIG.smsServices.endpoints.translationRules,
      { type }
    );
  }

  async getTranslationRulesByMCCMNC(mccmnc: string) {
    return apiService.get<TranslationRule[]>(
      DB_CONFIG.smsServices.endpoints.translationRules,
      { mccmnc }
    );
  }

  // Auto Upload Rule APIs
  async getAutoUploadRules(page: number = 0, size: number = 50, filters?: any) {
    const params = { page, size, ...filters };
    return apiService.get<any>(
      DB_CONFIG.smsServices.endpoints.autoUploadRules,
      params
    );
  }

  async getAutoUploadRuleDetail(id: string | number) {
    return apiService.get<AutoUploadRule>(
      `${DB_CONFIG.smsServices.endpoints.autoUploadRules}/${id}`
    );
  }

  async createAutoUploadRule(data: Partial<AutoUploadRule>) {
    return apiService.post<AutoUploadRule>(
      `${DB_CONFIG.smsServices.endpoints.autoUploadRules}/create`,
      data
    );
  }

  async updateAutoUploadRule(id: string | number, data: Partial<AutoUploadRule>) {
    return apiService.put<AutoUploadRule>(
      `${DB_CONFIG.smsServices.endpoints.autoUploadRules}/${id}`,
      data
    );
  }

  async deleteAutoUploadRule(id: string | number) {
    return apiService.delete(
      `${DB_CONFIG.smsServices.endpoints.autoUploadRules}/${id}`
    );
  }

  async getAutoUploadRulesByEnterprise(enterpriseName: string) {
    return apiService.get<AutoUploadRule[]>(
      DB_CONFIG.smsServices.endpoints.autoUploadRules,
      { enterprise: enterpriseName }
    );
  }

  async toggleAutoUploadRule(id: string | number, enabled: boolean) {
    return apiService.put<AutoUploadRule>(
      `${DB_CONFIG.smsServices.endpoints.autoUploadRules}/${id}/toggle`,
      { enabled }
    );
  }

  // Business Company APIs
  async getBusinessCompanies() {
    return apiService.get<BusinessCompany[]>(
      DB_CONFIG.smsServices.endpoints.businessCompanies
    );
  }

  async getBusinessCompanyDetail(id: string | number) {
    return apiService.get<BusinessCompany>(
      `${DB_CONFIG.smsServices.endpoints.businessCompanies}/${id}`
    );
  }

  async createBusinessCompany(data: Partial<BusinessCompany>) {
    return apiService.post<BusinessCompany>(
      `${DB_CONFIG.smsServices.endpoints.businessCompanies}/create`,
      data
    );
  }

  async updateBusinessCompany(id: string | number, data: Partial<BusinessCompany>) {
    return apiService.put<BusinessCompany>(
      `${DB_CONFIG.smsServices.endpoints.businessCompanies}/${id}`,
      data
    );
  }

  // SMS Configuration
  async getSMSConfiguration(companyId: string | number) {
    return apiService.get<any>(
      `${DB_CONFIG.smsServices.endpoints.businessCompanies}/${companyId}/config`
    );
  }

  async updateSMSConfiguration(companyId: string | number, config: any) {
    return apiService.put<any>(
      `${DB_CONFIG.smsServices.endpoints.businessCompanies}/${companyId}/config`,
      config
    );
  }
}

export const smsService = new SMSService();
