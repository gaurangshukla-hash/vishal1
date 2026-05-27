// Centralized Database Configuration
// Change these to match your actual database, table names, and fields

export const DB_CONFIG = {
  // Database Connection
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  
  // Dashboard Module
  dashboard: {
    endpoints: {
      metrics: '/dashboard/metrics',
      tps: '/dashboard/tps',
      alerts: '/dashboard/alerts',
      suppliers: '/dashboard/suppliers',
    }
  },

  // Enterprise Module
  enterprise: {
    tableName: 'enterprise', // Change your actual table name here
    fields: {
      id: 'enterprise_id',
      name: 'enterprise_name',
      type: 'enterprise_type', // CUSTOMER, VENDOR, SUPPLIER
      status: 'status',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    endpoints: {
      list: '/enterprise/list',
      detail: '/enterprise/{id}',
      create: '/enterprise/create',
      update: '/enterprise/update/{id}',
      delete: '/enterprise/delete/{id}',
    }
  },

  // Finance Module
  finance: {
    tables: {
      transaction: 'transactions',
      invoice: 'invoices',
      balance: 'enterprise_balance',
      billingCycle: 'billing_cycle',
    },
    fields: {
      transaction: {
        id: 'info_id',
        name: 'name',
        amount: 'amount',
        paymentDate: 'payment_date',
        status: 'payment_status',
      },
      invoice: {
        number: 'invoice_no',
        enterprise: 'enterprise_name',
        amount: 'amount',
        status: 'status',
        dueDate: 'due_date',
      },
      balance: {
        enterpriseName: 'enterprise_name',
        customerBalance: 'customer_balance',
        vendorBalance: 'vendor_balance',
        netBalance: 'net_balance',
      }
    },
    endpoints: {
      transactions: '/finance/transactions',
      invoices: '/finance/invoices',
      balance: '/finance/balance',
      billingCycles: '/finance/billing-cycles',
    }
  },

  // Rate Module
  rate: {
    tables: {
      mccmnc: 'mccmnc_unique_codes',
      moReference: 'mo_reference_book',
      wholesale: 'wholesale_rates',
      country: 'country',
    },
    fields: {
      mccmnc: {
        id: 'info_id',
        mcc: 'mcc',
        mnc: 'mnc',
        iso: 'iso',
        country: 'country',
        network: 'code_network',
      },
      moReference: {
        id: 'info_id',
        trunk: 'customer_trunk',
        number: 'number',
        keyword: 'keyword',
        rate: 'rate',
        vendorRate: 'vendor_rate',
        mccmnc: 'mccmnc',
      },
      country: {
        name: 'name',
        isoCode: 'iso_code',
        dialCode: 'dial_code',
      }
    },
    endpoints: {
      mccmnc: '/rate/mccmnc',
      moReference: '/rate/mo-reference',
      wholesale: '/rate/wholesale',
      countries: '/rate/countries',
    }
  },

  // Product Module
  product: {
    tables: {
      category: 'product_category',
      product: 'products',
    },
    fields: {
      category: {
        id: 'info_id',
        name: 'category_name',
        updatedBy: 'updated_by',
      },
      product: {
        id: 'product_id',
        name: 'product_name',
        category: 'category_id',
        status: 'status',
      }
    },
    endpoints: {
      categories: '/product/categories',
      list: '/product/list',
      detail: '/product/{id}',
      create: '/product/create',
    }
  },

  // SMS Services Module
  smsServices: {
    tables: {
      translationRule: 'translation_rule',
      autoUpload: 'auto_upload_rules',
      businessCompany: 'business_company',
    },
    fields: {
      translationRule: {
        id: 'info_id',
        name: 'translation_rule_name',
        type: 'type', // INGRESS, EGRESS
        action: 'action',
        mccmnc: 'mccmnc',
      },
      autoUpload: {
        id: 'info_id',
        name: 'auto_upload_rules_name',
        enterprise: 'enterprise_name',
        vendor: 'vendor_trunk',
        status: 'status',
      }
    },
    endpoints: {
      translationRules: '/sms-services/translation-rules',
      autoUploadRules: '/sms-services/auto-upload-rules',
      businessCompanies: '/sms-services/business-companies',
    }
  },

  // Report Module
  report: {
    tables: {
      dailyReport: 'daily_reports',
      summaryReport: 'summary_reports',
    },
    endpoints: {
      daily: '/report/daily',
      summary: '/report/summary',
      custom: '/report/custom',
      export: '/report/export',
    }
  },

  // Admin Module
  admin: {
    tables: {
      users: 'users',
      roles: 'roles',
      permissions: 'permissions',
      auditLog: 'audit_log',
    },
    endpoints: {
      users: '/admin/users',
      roles: '/admin/roles',
      permissions: '/admin/permissions',
      audit: '/admin/audit-log',
    }
  },
};

// Pagination defaults
export const PAGINATION = {
  pageSize: 50,
  maxPageSize: 500,
};

// Query performance settings
export const QUERY_CONFIG = {
  timeout: 30000, // 30 seconds
  cache: true,
  cacheTime: 5 * 60 * 1000, // 5 minutes
  retries: 2,
};
