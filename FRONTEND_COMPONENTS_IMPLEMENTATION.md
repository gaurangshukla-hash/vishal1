# Frontend Components - Implementation Examples

## 1. ProductCategoryView Component

```typescript
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, AlertCircle, Loader } from 'lucide-react';
import { cn } from '../lib/utils';
import { ExpandableTable } from './ExpandableTable';
import { ProductCategoryForm } from './ProductForms';

interface CategoryData {
  infoId: number;
  categoryName: string;
  description?: string;
  productCount: number;
  status: string;
  updatedTime: string;
}

export function ProductCategoryView({ theme }: { theme: 'light' | 'dark' }) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [page, search]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '10',
        ...(search && { search }),
      });

      const response = await fetch(`/api/product/category?${params}`);
      if (!response.ok) throw new Error('Failed to load categories');

      const data = await response.json();
      setCategories(data.content || data.data || []);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      const response = await fetch(`/api/product/category/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete category');
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting category');
    }
  };

  const openForm = (category?: CategoryData) => {
    if (category) {
      setSelectedCategory(category);
      setIsEdit(true);
    } else {
      setSelectedCategory(null);
      setIsEdit(false);
    }
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black uppercase tracking-widest text-brand-500">
          Product Categories
        </h2>
        <button
          onClick={() => openForm()}
          className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-black uppercase rounded-lg shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="flex-1 bg-transparent outline-none text-xs"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader className="w-6 h-6 animate-spin text-brand-500" />
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
              <tr>
                <th className="px-4 py-3 text-left font-bold uppercase text-zinc-600 dark:text-zinc-400">
                  Category Name
                </th>
                <th className="px-4 py-3 text-left font-bold uppercase text-zinc-600 dark:text-zinc-400">
                  Products
                </th>
                <th className="px-4 py-3 text-left font-bold uppercase text-zinc-600 dark:text-zinc-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-bold uppercase text-zinc-600 dark:text-zinc-400">
                  Updated
                </th>
                <th className="px-4 py-3 text-center font-bold uppercase text-zinc-600 dark:text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.infoId}
                  className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-black transition-colors"
                >
                  <td className="px-4 py-3 font-bold">{cat.categoryName}</td>
                  <td className="px-4 py-3 text-center">{cat.productCount}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold",
                      cat.status === 'Active'
                        ? "bg-emerald-500/20 text-emerald-600"
                        : "bg-gray-500/20 text-gray-600"
                    )}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(cat.updatedTime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => openForm(cat)}
                      className="p-2 hover:bg-blue-500/20 rounded transition-colors text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.infoId)}
                      className="p-2 hover:bg-red-500/20 rounded transition-colors text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 text-xs font-bold disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs font-bold">Page {page + 1} of {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 text-xs font-bold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ProductCategoryForm
            onClose={() => {
              setIsFormOpen(false);
              fetchCategories();
            }}
            theme={theme}
            isEdit={isEdit}
            data={selectedCategory}
          />
        </div>
      )}
    </div>
  );
}
```

## 2. CustomerRateTableView Component

```typescript
export function CustomerRateTableView({ theme }: { theme: 'light' | 'dark' }) {
  const [rateTables, setRateTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [tableDetails, setTableDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchRateTables();
  }, [page]);

  const fetchRateTables = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rate/customer-rate-table?page=${page}&pageSize=10`);
      const data = await response.json();
      setRateTables(data.content || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableDetails = async (tableId: number) => {
    try {
      const response = await fetch(`/api/rate/customer-rate-table/${tableId}`);
      const data = await response.json();
      setSelectedTable(data);
      setTableDetails(data.details || []);
    } catch (err) {
      console.error('Error fetching table details:', err);
    }
  };

  if (selectedTable) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-widest">
            {selectedTable.rateTableName}
          </h2>
          <button
            onClick={() => setSelectedTable(null)}
            className="text-zinc-500 hover:text-zinc-700"
          >
            Back
          </button>
        </div>

        {/* Rate Details Table */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Destination Code</th>
                <th className="px-4 py-3 text-left font-bold">Destination Name</th>
                <th className="px-4 py-3 text-left font-bold">Operator</th>
                <th className="px-4 py-3 text-right font-bold">Rate Per Unit</th>
                <th className="px-4 py-3 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableDetails.map((detail) => (
                <tr key={detail.detailId} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-black">
                  <td className="px-4 py-3 font-bold">{detail.destinationCode}</td>
                  <td className="px-4 py-3">{detail.destinationName}</td>
                  <td className="px-4 py-3">{detail.operatorName}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold">{detail.ratePerUnit.toFixed(6)}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-blue-600 hover:text-blue-700 font-bold text-[10px]">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Detail Button */}
        <button className="px-4 py-2 bg-brand-500 text-white text-xs font-black rounded-lg">
          <Plus className="w-4 h-4 inline mr-2" />
          Add Destination Rate
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black uppercase tracking-widest text-brand-500">
          Customer Rate Tables
        </h2>
        <button className="px-4 py-2 bg-brand-500 text-white text-xs font-black rounded-lg">
          <Plus className="w-4 h-4 inline mr-2" />
          New Rate Table
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader className="w-6 h-6 animate-spin text-brand-500" />
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Rate Table Name</th>
                <th className="px-4 py-3 text-left font-bold">Category</th>
                <th className="px-4 py-3 text-left font-bold">Destinations</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
                <th className="px-4 py-3 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rateTables.map((table) => (
                <tr key={table.rateTableId} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-black cursor-pointer transition-colors">
                  <td 
                    className="px-4 py-3 font-bold"
                    onClick={() => fetchTableDetails(table.rateTableId)}
                  >
                    {table.rateTableName}
                  </td>
                  <td className="px-4 py-3">{table.productCategory}</td>
                  <td className="px-4 py-3">{table.destinationCount}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold",
                      table.status === 'Active'
                        ? "bg-emerald-500/20 text-emerald-600"
                        : "bg-yellow-500/20 text-yellow-600"
                    )}>
                      {table.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-blue-600 hover:text-blue-700 font-bold text-[10px]">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

## 3. VendorTrunkView Component

```typescript
export function VendorTrunkView({ theme }: { theme: 'light' | 'dark' }) {
  const [trunks, setTrunks] = useState<any[]>([]);
  const [selectedTrunk, setSelectedTrunk] = useState<any | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchTrunks();
  }, [page]);

  const fetchTrunks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/enterprise/vendor-trunk?page=${page}&pageSize=10`);
      const data = await response.json();
      setTrunks(data.content || []);
    } finally {
      setLoading(false);
    }
  };

  const triggerHealthCheck = async (trunkId: number) => {
    try {
      const response = await fetch(`/api/enterprise/vendor-trunk/${trunkId}/health-check`, {
        method: 'POST'
      });
      const data = await response.json();
      setHealthStatus(data);
      
      // Refresh trunk list to show updated health status
      await fetchTrunks();
    } catch (err) {
      console.error('Health check failed:', err);
    }
  };

  if (selectedTrunk) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedTrunk(null)}
          className="text-blue-600 hover:text-blue-700 font-bold text-sm"
        >
          ← Back to List
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Details Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-black uppercase">{selectedTrunk.vendorTrunkName}</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-zinc-600 dark:text-zinc-400">Vendor:</span>
                <span className="ml-2">{selectedTrunk.vendorName}</span>
              </div>
              <div>
                <span className="font-bold text-zinc-600 dark:text-zinc-400">Connection Type:</span>
                <span className="ml-2">{selectedTrunk.connectionType}</span>
              </div>
              <div>
                <span className="font-bold text-zinc-600 dark:text-zinc-400">Endpoint:</span>
                <span className="ml-2 font-mono">{selectedTrunk.endpointUrl}:{selectedTrunk.endpointPort}</span>
              </div>
              <div>
                <span className="font-bold text-zinc-600 dark:text-zinc-400">Rate Limit:</span>
                <span className="ml-2">{selectedTrunk.rateLimitPerSecond} msg/sec</span>
              </div>
              <div>
                <span className="font-bold text-zinc-600 dark:text-zinc-400">Status:</span>
                <span className={cn(
                  "ml-2 px-2 py-1 rounded text-[10px] font-bold",
                  selectedTrunk.status === 'Active'
                    ? "bg-emerald-500/20 text-emerald-600"
                    : "bg-red-500/20 text-red-600"
                )}>
                  {selectedTrunk.status}
                </span>
              </div>
            </div>
          </div>

          {/* Health Status Card */}
          {healthStatus && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4">
              <h3 className="text-sm font-black uppercase">Health Status</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold">Status:</span>
                  <span className={cn(
                    "ml-2 px-2 py-1 rounded font-bold text-[10px]",
                    healthStatus.status === 'Success'
                      ? "bg-emerald-500/20 text-emerald-600"
                      : "bg-red-500/20 text-red-600"
                  )}>
                    {healthStatus.status}
                  </span>
                </div>
                <div>
                  <span className="font-bold">Latency:</span>
                  <span className="ml-2">{healthStatus.latencyMs}ms</span>
                </div>
                <div>
                  <span className="font-bold">Last Check:</span>
                  <span className="ml-2">{new Date(healthStatus.lastCheckTime).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => triggerHealthCheck(selectedTrunk.vendorTrunkId)}
                className="w-full px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-lg transition-all"
              >
                Run Health Check
              </button>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
          <h3 className="text-sm font-black uppercase mb-4">Today's Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded">
              <div className="font-bold text-zinc-600">Messages Received</div>
              <div className="text-lg font-black">0</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded">
              <div className="font-bold text-zinc-600">Delivery Rate</div>
              <div className="text-lg font-black">0%</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded">
              <div className="font-bold text-zinc-600">Avg Latency</div>
              <div className="text-lg font-black">0ms</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded">
              <div className="font-bold text-zinc-600">Uptime</div>
              <div className="text-lg font-black">0%</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black uppercase tracking-widest text-brand-500">
          Vendor Trunks
        </h2>
        <button className="px-4 py-2 bg-brand-500 text-white text-xs font-black rounded-lg">
          <Plus className="w-4 h-4 inline mr-2" />
          New Vendor Trunk
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader className="w-6 h-6 animate-spin text-brand-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {trunks.map((trunk) => (
            <div
              key={trunk.vendorTrunkId}
              onClick={() => setSelectedTrunk(trunk)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
                <div>
                  <div className="font-bold text-zinc-600 dark:text-zinc-400">Trunk Name</div>
                  <div className="font-black">{trunk.vendorTrunkName}</div>
                </div>
                <div>
                  <div className="font-bold text-zinc-600 dark:text-zinc-400">Vendor</div>
                  <div>{trunk.vendorName}</div>
                </div>
                <div>
                  <div className="font-bold text-zinc-600 dark:text-zinc-400">Connection</div>
                  <div>{trunk.connectionType}</div>
                </div>
                <div>
                  <div className="font-bold text-zinc-600 dark:text-zinc-400">Health</div>
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold w-fit",
                    trunk.healthStatus === 'Healthy'
                      ? "bg-emerald-500/20 text-emerald-600"
                      : trunk.healthStatus === 'Error'
                      ? "bg-red-500/20 text-red-600"
                      : "bg-gray-500/20 text-gray-600"
                  )}>
                    {trunk.healthStatus}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-zinc-600 dark:text-zinc-400">Status</div>
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold w-fit",
                    trunk.status === 'Active'
                      ? "bg-emerald-500/20 text-emerald-600"
                      : "bg-gray-500/20 text-gray-600"
                  )}>
                    {trunk.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 4. Integration into SectionView.tsx

Add this to your `SectionView.tsx` switch statement:

```typescript
if (menu === 'Product Category') {
  return <ProductCategoryView theme={theme} />;
}
if (menu === 'SMS Product') {
  return <SMSProductView theme={theme} />;
}
if (menu === 'Customer Rate Table') {
  return <CustomerRateTableView theme={theme} />;
}
if (menu === 'Vendor Rate Table') {
  return <VendorRateTableView theme={theme} />;
}
if (menu === 'Customer Trunk' || menu === 'Vendor Trunk') {
  return <TrunkView theme={theme} trunkType={menu} />;
}
```

These components follow the existing design patterns:
- Dark/light theme support
- Loading states with spinners
- Error handling
- Search and pagination
- Modal forms for create/edit
- Consistent styling with Tailwind & micro-interactions

