import { apiService } from '../api/apiService';
import { DB_CONFIG } from '../api/config';

export interface User {
  [key: string]: any;
}

export interface Role {
  [key: string]: any;
}

export interface Permission {
  [key: string]: any;
}

export interface AuditLog {
  [key: string]: any;
}

class AdminService {
  // User Management APIs
  async getUsers(page: number = 0, size: number = 50, filters?: any) {
    const params = { page, size, ...filters };
    return apiService.get<any>(
      DB_CONFIG.admin.endpoints.users,
      params
    );
  }

  async getUserDetail(id: string | number) {
    return apiService.get<User>(
      `${DB_CONFIG.admin.endpoints.users}/${id}`
    );
  }

  async createUser(data: Partial<User>) {
    return apiService.post<User>(
      `${DB_CONFIG.admin.endpoints.users}/create`,
      data
    );
  }

  async updateUser(id: string | number, data: Partial<User>) {
    return apiService.put<User>(
      `${DB_CONFIG.admin.endpoints.users}/${id}`,
      data
    );
  }

  async deleteUser(id: string | number) {
    return apiService.delete(
      `${DB_CONFIG.admin.endpoints.users}/${id}`
    );
  }

  async activateUser(id: string | number) {
    return apiService.put<User>(
      `${DB_CONFIG.admin.endpoints.users}/${id}/activate`,
      {}
    );
  }

  async deactivateUser(id: string | number) {
    return apiService.put<User>(
      `${DB_CONFIG.admin.endpoints.users}/${id}/deactivate`,
      {}
    );
  }

  async resetPassword(userId: string | number) {
    return apiService.post<any>(
      `${DB_CONFIG.admin.endpoints.users}/${userId}/reset-password`,
      {}
    );
  }

  async searchUsers(query: string) {
    return apiService.get<User[]>(
      DB_CONFIG.admin.endpoints.users,
      { search: query }
    );
  }

  async getUsersByRole(roleId: string | number) {
    return apiService.get<User[]>(
      DB_CONFIG.admin.endpoints.users,
      { roleId }
    );
  }

  // Role Management APIs
  async getRoles() {
    return apiService.get<Role[]>(
      DB_CONFIG.admin.endpoints.roles
    );
  }

  async getRoleDetail(id: string | number) {
    return apiService.get<Role>(
      `${DB_CONFIG.admin.endpoints.roles}/${id}`
    );
  }

  async createRole(data: Partial<Role>) {
    return apiService.post<Role>(
      `${DB_CONFIG.admin.endpoints.roles}/create`,
      data
    );
  }

  async updateRole(id: string | number, data: Partial<Role>) {
    return apiService.put<Role>(
      `${DB_CONFIG.admin.endpoints.roles}/${id}`,
      data
    );
  }

  async deleteRole(id: string | number) {
    return apiService.delete(
      `${DB_CONFIG.admin.endpoints.roles}/${id}`
    );
  }

  async assignPermissionToRole(roleId: string | number, permissionIds: (string | number)[]) {
    return apiService.put<Role>(
      `${DB_CONFIG.admin.endpoints.roles}/${roleId}/permissions`,
      { permissionIds }
    );
  }

  // Permission Management APIs
  async getPermissions() {
    return apiService.get<Permission[]>(
      DB_CONFIG.admin.endpoints.permissions
    );
  }

  async getPermissionDetail(id: string | number) {
    return apiService.get<Permission>(
      `${DB_CONFIG.admin.endpoints.permissions}/${id}`
    );
  }

  async createPermission(data: Partial<Permission>) {
    return apiService.post<Permission>(
      `${DB_CONFIG.admin.endpoints.permissions}/create`,
      data
    );
  }

  async updatePermission(id: string | number, data: Partial<Permission>) {
    return apiService.put<Permission>(
      `${DB_CONFIG.admin.endpoints.permissions}/${id}`,
      data
    );
  }

  async deletePermission(id: string | number) {
    return apiService.delete(
      `${DB_CONFIG.admin.endpoints.permissions}/${id}`
    );
  }

  async getPermissionsByRole(roleId: string | number) {
    return apiService.get<Permission[]>(
      `${DB_CONFIG.admin.endpoints.permissions}/role/${roleId}`
    );
  }

  // Audit Log APIs
  async getAuditLogs(page: number = 0, size: number = 50, filters?: any) {
    const params = { page, size, ...filters };
    return apiService.get<any>(
      DB_CONFIG.admin.endpoints.audit,
      params
    );
  }

  async getAuditLogDetail(id: string | number) {
    return apiService.get<AuditLog>(
      `${DB_CONFIG.admin.endpoints.audit}/${id}`
    );
  }

  async getAuditLogsByUser(userId: string | number, startDate?: string, endDate?: string) {
    const params: any = { userId };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    return apiService.get<AuditLog[]>(
      DB_CONFIG.admin.endpoints.audit,
      params
    );
  }

  async getAuditLogsByAction(action: string, startDate?: string, endDate?: string) {
    const params: any = { action };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    return apiService.get<AuditLog[]>(
      DB_CONFIG.admin.endpoints.audit,
      params
    );
  }

  async exportAuditLogs(startDate: string, endDate: string, format: 'PDF' | 'EXCEL') {
    return apiService.post<any>(
      `${DB_CONFIG.admin.endpoints.audit}/export`,
      { startDate, endDate, format }
    );
  }

  // System Configuration
  async getSystemConfig() {
    return apiService.get<any>('/admin/system-config');
  }

  async updateSystemConfig(config: any) {
    return apiService.put<any>('/admin/system-config', config);
  }

  // Dashboard Statistics
  async getAdminDashboard() {
    return apiService.get<any>('/admin/dashboard');
  }

  async getSystemHealth() {
    return apiService.get<any>('/admin/system-health');
  }
}

export const adminService = new AdminService();
