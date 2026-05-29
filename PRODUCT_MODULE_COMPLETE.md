# Product Module - Complete Implementation

## 1. MariaDB Schema

```sql
-- Product Category Table
CREATE TABLE `product_category` (
  `info_id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category_name (category_name),
  INDEX idx_status (status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SMS Product Table
CREATE TABLE `sms_product` (
  `product_id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_name` VARCHAR(255) NOT NULL UNIQUE,
  `product_category_id` INT NOT NULL,
  `product_type` ENUM('Voice', 'SMS', 'Data', 'SIM', 'USSD', 'IVR') DEFAULT 'SMS',
  `currency_id` INT,
  `status` ENUM('Active', 'Inactive', 'Discontinued') DEFAULT 'Active',
  `description` TEXT,
  `features` JSON,
  `pricing_model` ENUM('Per Unit', 'Volume', 'Subscription') DEFAULT 'Per Unit',
  `min_volume` INT DEFAULT 0,
  `max_volume` INT DEFAULT 999999,
  `base_price` DECIMAL(10, 6),
  `markup_percentage` DECIMAL(5, 2) DEFAULT 0.00,
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(100),
  `updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_category_id) REFERENCES product_category(info_id) ON DELETE RESTRICT,
  FOREIGN KEY (currency_id) REFERENCES currency(currency_id) ON DELETE SET NULL,
  INDEX idx_product_name (product_name),
  INDEX idx_category_id (product_category_id),
  INDEX idx_status (status),
  INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Pricing Table (for volume-based pricing)
CREATE TABLE `product_pricing` (
  `pricing_id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `min_volume` INT NOT NULL,
  `max_volume` INT NOT NULL,
  `price_per_unit` DECIMAL(10, 6) NOT NULL,
  `currency_id` INT,
  `effective_from` DATE NOT NULL,
  `effective_to` DATE,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_by` VARCHAR(100),
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES sms_product(product_id) ON DELETE CASCADE,
  FOREIGN KEY (currency_id) REFERENCES currency(currency_id) ON DELETE SET NULL,
  INDEX idx_product_id (product_id),
  INDEX idx_effective_from (effective_from),
  UNIQUE KEY unique_volume_range (product_id, min_volume, max_volume)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Features/Attributes Table
CREATE TABLE `product_attribute` (
  `attribute_id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `attribute_name` VARCHAR(100) NOT NULL,
  `attribute_value` VARCHAR(255) NOT NULL,
  `attribute_type` ENUM('Text', 'Number', 'Boolean', 'Date') DEFAULT 'Text',
  `created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES sms_product(product_id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_attribute_name (attribute_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Change Log
CREATE TABLE `product_audit_log` (
  `audit_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT,
  `category_id` INT,
  `action` ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  `old_values` JSON,
  `new_values` JSON,
  `changed_by` VARCHAR(100),
  `changed_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product_id (product_id),
  INDEX idx_category_id (category_id),
  INDEX idx_changed_time (changed_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 2. Fast & Effective Queries

### Product Category Queries

```sql
-- Get all active categories with count of products
SELECT 
  pc.info_id,
  pc.category_name,
  pc.description,
  COUNT(sp.product_id) as product_count,
  pc.status,
  pc.updated_time
FROM product_category pc
LEFT JOIN sms_product sp ON sp.product_category_id = pc.info_id AND sp.status = 'Active'
WHERE pc.status = 'Active'
GROUP BY pc.info_id
ORDER BY pc.updated_time DESC;

-- Get category by name (for validation)
SELECT info_id, category_name, status
FROM product_category
WHERE LOWER(category_name) = LOWER(?)
LIMIT 1;

-- Search categories
SELECT *
FROM product_category
WHERE category_name LIKE CONCAT('%', ?, '%')
  OR description LIKE CONCAT('%', ?, '%')
ORDER BY updated_time DESC
LIMIT ? OFFSET ?;
```

### SMS Product Queries

```sql
-- Get all products with category info
SELECT 
  sp.product_id,
  sp.product_name,
  pc.category_name,
  sp.product_type,
  c.iso_code as currency,
  sp.base_price,
  sp.markup_percentage,
  (sp.base_price * (1 + sp.markup_percentage / 100)) as final_price,
  sp.status,
  sp.updated_time
FROM sms_product sp
LEFT JOIN product_category pc ON sp.product_category_id = pc.info_id
LEFT JOIN currency c ON sp.currency_id = c.currency_id
WHERE sp.status != 'Discontinued'
ORDER BY sp.updated_time DESC
LIMIT ? OFFSET ?;

-- Get pricing for volume
SELECT 
  sp.product_id,
  sp.product_name,
  pp.price_per_unit,
  c.iso_code as currency,
  pp.min_volume,
  pp.max_volume,
  pp.effective_from,
  pp.effective_to
FROM sms_product sp
LEFT JOIN product_pricing pp ON sp.product_id = pp.product_id
LEFT JOIN currency c ON pp.currency_id = c.currency_id
WHERE sp.product_id = ?
  AND pp.status = 'Active'
  AND pp.effective_from <= CURDATE()
  AND (pp.effective_to IS NULL OR pp.effective_to >= CURDATE())
ORDER BY pp.min_volume ASC;

-- Search products by name or category
SELECT 
  sp.product_id,
  sp.product_name,
  pc.category_name,
  sp.status
FROM sms_product sp
LEFT JOIN product_category pc ON sp.product_category_id = pc.info_id
WHERE (sp.product_name LIKE CONCAT('%', ?, '%')
   OR pc.category_name LIKE CONCAT('%', ?, '%'))
  AND sp.status = 'Active'
ORDER BY sp.product_name ASC
LIMIT ? OFFSET ?;

-- Get product with all attributes
SELECT 
  sp.*,
  c.iso_code as currency,
  pc.category_name,
  GROUP_CONCAT(
    JSON_OBJECT('name', pa.attribute_name, 'value', pa.attribute_value)
  ) as attributes
FROM sms_product sp
LEFT JOIN currency c ON sp.currency_id = c.currency_id
LEFT JOIN product_category pc ON sp.product_category_id = pc.info_id
LEFT JOIN product_attribute pa ON sp.product_id = pa.product_id
WHERE sp.product_id = ?
GROUP BY sp.product_id;

-- Validate category exists before assignment
SELECT COUNT(*) as count
FROM product_category
WHERE info_id = ? AND status = 'Active';

-- Get products by category
SELECT product_id, product_name, status
FROM sms_product
WHERE product_category_id = ?
  AND status = 'Active'
ORDER BY product_name;
```

## 3. Spring Boot Controllers & Services

### ProductCategoryController

```java
@RestController
@RequestMapping("/api/product/category")
@CrossOrigin(origins = "*")
public class ProductCategoryController {

  @Autowired
  private ProductCategoryService categoryService;

  @GetMapping
  public ResponseEntity<PagedResponse<ProductCategoryDTO>> getAllCategories(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int pageSize,
    @RequestParam(required = false) String search,
    @RequestParam(required = false) String status) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("updatedTime").descending());
    Page<ProductCategoryDTO> categories = categoryService.getCategories(search, status, pageable);
    return ResponseEntity.ok(new PagedResponse<>(categories));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductCategoryDTO> getCategoryById(@PathVariable Integer id) {
    ProductCategoryDTO category = categoryService.getCategoryById(id);
    return ResponseEntity.ok(category);
  }

  @PostMapping
  public ResponseEntity<ProductCategoryDTO> createCategory(@RequestBody CreateCategoryRequest request) {
    ProductCategoryDTO category = categoryService.createCategory(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(category);
  }

  @PutMapping("/{id}")
  public ResponseEntity<ProductCategoryDTO> updateCategory(
    @PathVariable Integer id,
    @RequestBody UpdateCategoryRequest request) {
    ProductCategoryDTO category = categoryService.updateCategory(id, request);
    return ResponseEntity.ok(category);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
    categoryService.deleteCategory(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}/products")
  public ResponseEntity<List<ProductSummaryDTO>> getCategoryProducts(@PathVariable Integer id) {
    List<ProductSummaryDTO> products = categoryService.getProductsByCategory(id);
    return ResponseEntity.ok(products);
  }
}
```

### SMSProductController

```java
@RestController
@RequestMapping("/api/product/sms")
@CrossOrigin(origins = "*")
public class SMSProductController {

  @Autowired
  private SMSProductService productService;

  @GetMapping
  public ResponseEntity<PagedResponse<SMSProductDTO>> getAllProducts(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int pageSize,
    @RequestParam(required = false) String search,
    @RequestParam(required = false) String categoryId,
    @RequestParam(required = false) String status) {
    
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("updatedTime").descending());
    Page<SMSProductDTO> products = productService.getProducts(search, categoryId, status, pageable);
    return ResponseEntity.ok(new PagedResponse<>(products));
  }

  @GetMapping("/{id}")
  public ResponseEntity<SMSProductDetailDTO> getProductById(@PathVariable Integer id) {
    SMSProductDetailDTO product = productService.getProductById(id);
    return ResponseEntity.ok(product);
  }

  @PostMapping
  public ResponseEntity<SMSProductDTO> createProduct(@RequestBody CreateProductRequest request) {
    SMSProductDTO product = productService.createProduct(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(product);
  }

  @PutMapping("/{id}")
  public ResponseEntity<SMSProductDTO> updateProduct(
    @PathVariable Integer id,
    @RequestBody UpdateProductRequest request) {
    SMSProductDTO product = productService.updateProduct(id, request);
    return ResponseEntity.ok(product);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
    productService.deleteProduct(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}/pricing")
  public ResponseEntity<List<ProductPricingDTO>> getProductPricing(@PathVariable Integer id) {
    List<ProductPricingDTO> pricing = productService.getProductPricing(id);
    return ResponseEntity.ok(pricing);
  }

  @PostMapping("/{id}/pricing")
  public ResponseEntity<ProductPricingDTO> addPricing(
    @PathVariable Integer id,
    @RequestBody CreatePricingRequest request) {
    ProductPricingDTO pricing = productService.addPricing(id, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(pricing);
  }
}
```

### ProductCategoryService

```java
@Service
public class ProductCategoryService {

  @Autowired
  private ProductCategoryRepository categoryRepository;

  public Page<ProductCategoryDTO> getCategories(String search, String status, Pageable pageable) {
    Specification<ProductCategory> spec = Specification.where(null);
    
    if (search != null && !search.isEmpty()) {
      spec = spec.and((root, query, cb) -> 
        cb.like(cb.lower(root.get("categoryName")), "%" + search.toLowerCase() + "%"));
    }
    
    if (status != null && !status.isEmpty()) {
      spec = spec.and((root, query, cb) -> 
        cb.equal(root.get("status"), status));
    }
    
    return categoryRepository.findAll(spec, pageable)
      .map(ProductCategoryDTO::fromEntity);
  }

  public ProductCategoryDTO getCategoryById(Integer id) {
    return categoryRepository.findById(id)
      .map(ProductCategoryDTO::fromEntity)
      .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
  }

  public ProductCategoryDTO createCategory(CreateCategoryRequest request) {
    // Check if category name already exists
    if (categoryRepository.existsByCategoryNameIgnoreCase(request.getCategoryName())) {
      throw new BusinessException("Category with this name already exists");
    }

    ProductCategory category = new ProductCategory();
    category.setCategoryName(request.getCategoryName());
    category.setDescription(request.getDescription());
    category.setStatus(request.getStatus() != null ? request.getStatus() : "Active");
    category.setCreatedBy(getCurrentUser());
    category.setCreatedTime(LocalDateTime.now());
    
    ProductCategory saved = categoryRepository.save(category);
    return ProductCategoryDTO.fromEntity(saved);
  }

  public ProductCategoryDTO updateCategory(Integer id, UpdateCategoryRequest request) {
    ProductCategory category = categoryRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

    if (request.getCategoryName() != null) {
      category.setCategoryName(request.getCategoryName());
    }
    if (request.getDescription() != null) {
      category.setDescription(request.getDescription());
    }
    if (request.getStatus() != null) {
      category.setStatus(request.getStatus());
    }
    
    category.setUpdatedBy(getCurrentUser());
    category.setUpdatedTime(LocalDateTime.now());
    
    ProductCategory updated = categoryRepository.save(category);
    return ProductCategoryDTO.fromEntity(updated);
  }

  public void deleteCategory(Integer id) {
    ProductCategory category = categoryRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    
    // Check if any products are using this category
    if (productRepository.countByCategoryId(id) > 0) {
      throw new BusinessException("Cannot delete category with active products");
    }
    
    categoryRepository.deleteById(id);
  }

  public List<ProductSummaryDTO> getProductsByCategory(Integer categoryId) {
    return productRepository.findByCategoryIdAndStatus(categoryId, "Active")
      .stream()
      .map(ProductSummaryDTO::fromEntity)
      .collect(Collectors.toList());
  }
}
```

### SMSProductService

```java
@Service
public class SMSProductService {

  @Autowired
  private SMSProductRepository productRepository;
  
  @Autowired
  private ProductCategoryRepository categoryRepository;
  
  @Autowired
  private ProductPricingRepository pricingRepository;

  public Page<SMSProductDTO> getProducts(String search, String categoryId, String status, Pageable pageable) {
    Specification<SMSProduct> spec = Specification.where(null);
    
    if (search != null && !search.isEmpty()) {
      spec = spec.and((root, query, cb) -> 
        cb.like(cb.lower(root.get("productName")), "%" + search.toLowerCase() + "%"));
    }
    
    if (categoryId != null && !categoryId.isEmpty()) {
      spec = spec.and((root, query, cb) -> 
        cb.equal(root.get("categoryId"), Integer.parseInt(categoryId)));
    }
    
    if (status != null && !status.isEmpty()) {
      spec = spec.and((root, query, cb) -> 
        cb.notEqual(root.get("status"), "Discontinued"));
    }
    
    return productRepository.findAll(spec, pageable)
      .map(SMSProductDTO::fromEntity);
  }

  public SMSProductDetailDTO getProductById(Integer id) {
    SMSProduct product = productRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    
    List<ProductPricingDTO> pricing = pricingRepository.findByProductIdAndStatus(id, "Active")
      .stream()
      .map(ProductPricingDTO::fromEntity)
      .collect(Collectors.toList());
    
    return SMSProductDetailDTO.fromEntity(product, pricing);
  }

  public SMSProductDTO createProduct(CreateProductRequest request) {
    // Validate category exists
    categoryRepository.findById(request.getCategoryId())
      .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

    SMSProduct product = new SMSProduct();
    product.setProductName(request.getProductName());
    product.setCategoryId(request.getCategoryId());
    product.setProductType(request.getProductType());
    product.setBasePrice(request.getBasePrice());
    product.setMarkupPercentage(request.getMarkupPercentage() != null ? request.getMarkupPercentage() : BigDecimal.ZERO);
    product.setStatus(request.getStatus() != null ? request.getStatus() : "Active");
    product.setCreatedBy(getCurrentUser());
    product.setCreatedTime(LocalDateTime.now());
    
    SMSProduct saved = productRepository.save(product);
    return SMSProductDTO.fromEntity(saved);
  }

  public SMSProductDTO updateProduct(Integer id, UpdateProductRequest request) {
    SMSProduct product = productRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

    if (request.getProductName() != null) product.setProductName(request.getProductName());
    if (request.getBasePrice() != null) product.setBasePrice(request.getBasePrice());
    if (request.getMarkupPercentage() != null) product.setMarkupPercentage(request.getMarkupPercentage());
    if (request.getStatus() != null) product.setStatus(request.getStatus());
    
    product.setUpdatedBy(getCurrentUser());
    product.setUpdatedTime(LocalDateTime.now());
    
    SMSProduct updated = productRepository.save(product);
    return SMSProductDTO.fromEntity(updated);
  }

  public void deleteProduct(Integer id) {
    productRepository.deleteById(id);
  }

  public List<ProductPricingDTO> getProductPricing(Integer productId) {
    return pricingRepository.findByProductIdAndStatus(productId, "Active")
      .stream()
      .map(ProductPricingDTO::fromEntity)
      .collect(Collectors.toList());
  }

  public ProductPricingDTO addPricing(Integer productId, CreatePricingRequest request) {
    productRepository.findById(productId)
      .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

    ProductPricing pricing = new ProductPricing();
    pricing.setProductId(productId);
    pricing.setMinVolume(request.getMinVolume());
    pricing.setMaxVolume(request.getMaxVolume());
    pricing.setPricePerUnit(request.getPricePerUnit());
    pricing.setEffectiveFrom(request.getEffectiveFrom());
    pricing.setStatus("Active");
    pricing.setCreatedBy(getCurrentUser());
    pricing.setCreatedTime(LocalDateTime.now());
    
    ProductPricing saved = pricingRepository.save(pricing);
    return ProductPricingDTO.fromEntity(saved);
  }
}
```

## 4. Frontend Component Patterns

### ProductCategoryForm Component

```typescript
export function ProductCategoryForm({ onClose, theme, isEdit, data }: {
  onClose: () => void;
  theme: 'light' | 'dark';
  isEdit?: boolean;
  data?: any;
}) {
  const [formData, setFormData] = useState({
    categoryName: data?.categoryName || '',
    description: data?.description || '',
    status: data?.status || 'Active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.categoryName.trim()) newErrors.categoryName = 'Category name required';
    if (formData.categoryName.length > 255) newErrors.categoryName = 'Max 255 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const endpoint = isEdit 
        ? `/api/product/category/${data?.infoId}`
        : `/api/product/category`;
      
      const response = await fetch(endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save category');
      onClose();
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Error saving category' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 w-full max-w-xl font-sans">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">
          {isEdit ? 'EDIT' : 'ADD'} PRODUCT CATEGORY
        </h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {errors.submit && (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.submit}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.categoryName}
            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
            className={cn(
              "w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold",
              errors.categoryName ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
            )}
            placeholder="Enter category name"
          />
          {errors.categoryName && <p className="text-red-500 text-[10px]">{errors.categoryName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold"
            placeholder="Enter description"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-[#428bca] hover:bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
```

### SMSProductForm Component

```typescript
export function SMSProductForm({ onClose, theme, isEdit, data, categories }: {
  onClose: () => void;
  theme: 'light' | 'dark';
  isEdit?: boolean;
  data?: any;
  categories: any[];
}) {
  const [formData, setFormData] = useState({
    productName: data?.productName || '',
    categoryId: data?.categoryId || '',
    productType: data?.productType || 'SMS',
    basePrice: data?.basePrice || '',
    markupPercentage: data?.markupPercentage || '0',
    status: data?.status || 'Active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.productName.trim()) newErrors.productName = 'Product name required';
    if (!formData.categoryId) newErrors.categoryId = 'Category required';
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) newErrors.basePrice = 'Valid price required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const endpoint = isEdit
        ? `/api/product/sms/${data?.productId}`
        : `/api/product/sms`;

      const response = await fetch(endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save product');
      onClose();
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Error saving product' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 w-full max-w-2xl font-sans">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">
          {isEdit ? 'EDIT' : 'ADD'} SMS PRODUCT
        </h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold"
            placeholder="Enter product name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold"
          >
            <option value="">Select Category...</option>
            {categories.map(cat => <option key={cat.infoId} value={cat.infoId}>{cat.categoryName}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            Product Type
          </label>
          <select
            value={formData.productType}
            onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold"
          >
            <option>Voice</option>
            <option>SMS</option>
            <option>Data</option>
            <option>SIM</option>
            <option>USSD</option>
            <option>IVR</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            Base Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.000001"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold"
            placeholder="0.000000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            Markup %
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.markupPercentage}
            onChange={(e) => setFormData({ ...formData, markupPercentage: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold"
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Discontinued</option>
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-[#428bca] hover:bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
```

## 5. Integration Points

- **Navigation**: Already mapped in `src/lib/navigation.ts` under Product menu
- **API Base URL**: Use `/api/product/category` and `/api/product/sms` endpoints
- **State Management**: Use React hooks for form state, fetch API for data operations
- **Pagination**: Support offset/limit for large datasets
- **Validation**: Client-side + Server-side validation on category uniqueness and product requirements
