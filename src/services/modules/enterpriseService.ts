import { apiService } from '../api/apiService';
import { DB_CONFIG } from '../api/config';

export interface Enterprise {
  [key: string]: any;
}

export interface PaginatedEnterprise {
  content: Enterprise[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

class EnterpriseService {
  async getList(page: number = 0, size: number = 50, search?: string) {
    const params: any = { page, size };
    if (search) params.search = search;
    
    return apiService.get<PaginatedEnterprise>(
      DB_CONFIG.enterprise.endpoints.list,
      params
    );
  }

  async getDetail(id: string | number) {
    return apiService.get<Enterprise>(
      DB_CONFIG.enterprise.endpoints.detail.replace('{id}', String(id))
    );
  }

  async create(data: Partial<Enterprise>) {
    return apiService.post<Enterprise>(
      DB_CONFIG.enterprise.endpoints.create,
      data
    );
  }

  async update(id: string | number, data: Partial<Enterprise>) {
    return apiService.put<Enterprise>(
      DB_CONFIG.enterprise.endpoints.update.replace('{id}', String(id)),
      data
    );
  }

  async delete(id: string | number) {
    return apiService.delete(
      DB_CONFIG.enterprise.endpoints.delete.replace('{id}', String(id))
    );
  }

  async getByType(type: 'CUSTOMER' | 'VENDOR' | 'SUPPLIER') {
    return apiService.get<Enterprise[]>(
      DB_CONFIG.enterprise.endpoints.list,
      { type }
    );
  }

  async search(query: string) {
    return this.getList(0, 50, query);
  }

  async getActive() {
    return apiService.get<Enterprise[]>(
      DB_CONFIG.enterprise.endpoints.list,
      { status: 'ACTIVE' }
    );
  }
}

export const enterpriseService = new EnterpriseService();
