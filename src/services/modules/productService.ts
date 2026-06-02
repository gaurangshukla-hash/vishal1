import { apiService } from '../api/apiService';
import { DB_CONFIG } from '../api/config';

export interface ProductCategory {
  [key: string]: any;
}

export interface Product {
  [key: string]: any;
}

class ProductService {
  // Category APIs
  async getCategories() {
    return apiService.get<ProductCategory[]>(
      DB_CONFIG.product.endpoints.categories
    );
  }

  async getCategoryDetail(id: string | number) {
    return apiService.get<ProductCategory>(
      `${DB_CONFIG.product.endpoints.categories}/${id}`
    );
  }

  async createCategory(data: Partial<ProductCategory>) {
    return apiService.post<ProductCategory>(
      `${DB_CONFIG.product.endpoints.categories}/create`,
      data
    );
  }

  async updateCategory(id: string | number, data: Partial<ProductCategory>) {
    return apiService.put<ProductCategory>(
      `${DB_CONFIG.product.endpoints.categories}/${id}`,
      data
    );
  }

  async deleteCategory(id: string | number) {
    return apiService.delete(
      `${DB_CONFIG.product.endpoints.categories}/${id}`
    );
  }

  // Product APIs
  async getProducts(page: number = 0, size: number = 50, filters?: any) {
    const params = { page, size, ...filters };
    return apiService.get<any>(
      DB_CONFIG.product.endpoints.list,
      params
    );
  }

  async getProductDetail(id: string | number) {
    return apiService.get<Product>(
      DB_CONFIG.product.endpoints.detail.replace('{id}', String(id))
    );
  }

  async createProduct(data: Partial<Product>) {
    return apiService.post<Product>(
      DB_CONFIG.product.endpoints.create,
      data
    );
  }

  async updateProduct(id: string | number, data: Partial<Product>) {
    return apiService.put<Product>(
      `${DB_CONFIG.product.endpoints.list}/${id}`,
      data
    );
  }

  async deleteProduct(id: string | number) {
    return apiService.delete(
      `${DB_CONFIG.product.endpoints.list}/${id}`
    );
  }

  async getProductsByCategory(categoryId: string | number) {
    return apiService.get<Product[]>(
      DB_CONFIG.product.endpoints.list,
      { categoryId }
    );
  }

  async searchProducts(query: string) {
    return apiService.get<Product[]>(
      DB_CONFIG.product.endpoints.list,
      { search: query }
    );
  }

  async getActiveProducts() {
    return apiService.get<Product[]>(
      DB_CONFIG.product.endpoints.list,
      { status: 'ACTIVE' }
    );
  }

  async getProductsByEnterprise(enterpriseId: string | number) {
    return apiService.get<Product[]>(
      DB_CONFIG.product.endpoints.list,
      { enterpriseId }
    );
  }
}

export const productService = new ProductService();
