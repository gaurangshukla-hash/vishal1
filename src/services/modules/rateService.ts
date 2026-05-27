import { apiService } from '../api/apiService';
import { DB_CONFIG } from '../api/config';

export interface MCCMNC {
  [key: string]: any;
}

export interface MOReference {
  [key: string]: any;
}

export interface WholesaleRate {
  [key: string]: any;
}

export interface Country {
  [key: string]: any;
}

class RateService {
  // MCCMNC APIs
  async getMCCMNC(page: number = 0, size: number = 50, filters?: any) {
    const params = { page, size, ...filters };
    return apiService.get<any>(
      DB_CONFIG.rate.endpoints.mccmnc,
      params
    );
  }

  async getMCCMNCDetail(id: string | number) {
    return apiService.get<MCCMNC>(
      `${DB_CONFIG.rate.endpoints.mccmnc}/${id}`
    );
  }

  async searchMCCMNC(mccmnc: string) {
    return apiService.get<MCCMNC>(
      DB_CONFIG.rate.endpoints.mccmnc,
      { mccmnc }
    );
  }

  async getMCCMNCByCountry(countryCode: string) {
    return apiService.get<MCCMNC[]>(
      DB_CONFIG.rate.endpoints.mccmnc,
      { iso: countryCode }
    );
  }

  // MO Reference APIs
  async getMOReference(page: number = 0, size: number = 50, filters?: any) {
    const params = { page, size, ...filters };
    return apiService.get<any>(
      DB_CONFIG.rate.endpoints.moReference,
      params
    );
  }

  async getMOReferenceDetail(id: string | number) {
    return apiService.get<MOReference>(
      `${DB_CONFIG.rate.endpoints.moReference}/${id}`
    );
  }

  async createMOReference(data: Partial<MOReference>) {
    return apiService.post<MOReference>(
      `${DB_CONFIG.rate.endpoints.moReference}/create`,
      data
    );
  }

  async updateMOReference(id: string | number, data: Partial<MOReference>) {
    return apiService.put<MOReference>(
      `${DB_CONFIG.rate.endpoints.moReference}/${id}`,
      data
    );
  }

  async deleteMOReference(id: string | number) {
    return apiService.delete(
      `${DB_CONFIG.rate.endpoints.moReference}/${id}`
    );
  }

  async getMOReferenceByTrunk(trunk: string) {
    return apiService.get<MOReference[]>(
      DB_CONFIG.rate.endpoints.moReference,
      { trunk }
    );
  }

  // Wholesale Rate APIs
  async getWholesaleRates(page: number = 0, size: number = 50) {
    return apiService.get<any>(
      DB_CONFIG.rate.endpoints.wholesale,
      { page, size }
    );
  }

  async getWholesaleRateDetail(id: string | number) {
    return apiService.get<WholesaleRate>(
      `${DB_CONFIG.rate.endpoints.wholesale}/${id}`
    );
  }

  async createWholesaleRate(data: Partial<WholesaleRate>) {
    return apiService.post<WholesaleRate>(
      `${DB_CONFIG.rate.endpoints.wholesale}/create`,
      data
    );
  }

  // Country APIs
  async getCountries() {
    return apiService.get<Country[]>(
      DB_CONFIG.rate.endpoints.countries
    );
  }

  async getCountryDetail(isoCode: string) {
    return apiService.get<Country>(
      `${DB_CONFIG.rate.endpoints.countries}/${isoCode}`
    );
  }

  async searchCountries(query: string) {
    return apiService.get<Country[]>(
      DB_CONFIG.rate.endpoints.countries,
      { search: query }
    );
  }

  // Rate Lookup
  async lookupRate(destination: string, mccmnc?: string) {
    return apiService.get<any>(
      `${DB_CONFIG.rate.endpoints.moReference}/lookup`,
      { destination, mccmnc }
    );
  }

  // Rate Analytics
  async getRateAnalytics(startDate: string, endDate: string) {
    return apiService.get<any>(
      `${DB_CONFIG.rate.endpoints.moReference}/analytics`,
      { startDate, endDate }
    );
  }

  async getHighestRates(limit: number = 10) {
    return apiService.get<MOReference[]>(
      `${DB_CONFIG.rate.endpoints.moReference}/highest`,
      { limit }
    );
  }
}

export const rateService = new RateService();
