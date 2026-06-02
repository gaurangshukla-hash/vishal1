# 🚀 TeleOSS Database Integration - Quick Start

**Complete setup in 5 minutes** - Fast, effective, and configurable!

---

## ⚡ Quick Summary

You now have:

✅ **MySQL Database Schema** - All tables with proper indexes  
✅ **React Service Layer** - Configurable API clients for all modules  
✅ **Spring Boot Templates** - Controller examples for your backend  
✅ **Environment Configuration** - Easy to change database/table names  
✅ **Example Code** - Copy-paste ready implementations  

---

## 🎯 5-Minute Setup

### Step 1: Create Database (1 min)

```bash
mysql -u root -p
source DATABASE_SCHEMA.sql
```

### Step 2: Configure API URL (30 sec)

Edit `src/services/api/config.ts`:
```typescript
baseUrl: 'http://your-spring-boot-server:8080/api'
```

### Step 3: Setup Spring Boot (2 min)

**application.properties:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/teleoss
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### Step 4: Test API (1.5 min)

```bash
# Test endpoint
curl http://localhost:8080/api/enterprise/list

# Should return paginated enterprises
```

---

## 📁 Files Created

### Frontend Services
```
src/services/
├── api/
│   ├── config.ts                 # Database/table configuration
│   ├── apiService.ts             # HTTP client with caching
│   └── .env.example              # Environment template
└── modules/
    ├── enterpriseService.ts       # Enterprise API
    ├── financeService.ts          # Finance API
    ├── rateService.ts             # Rate API
    ├── productService.ts          # Product API
    ├── smsService.ts              # SMS Services API
    ├── reportService.ts           # Report API
    ├── adminService.ts            # Admin API
    └── exampleUsage.ts            # Copy-paste examples
```

### Backend Files
```
DATABASE_SCHEMA.sql                # MySQL schema (339 lines)
SPRING_BOOT_CONTROLLERS.java       # Controller templates (387 lines)
DATABASE_INTEGRATION_GUIDE.md      # Full documentation (511 lines)
```

---

## 🔧 Customization Guide

### Change Database Name

1. Edit `DATABASE_SCHEMA.sql`:
```sql
CREATE DATABASE IF NOT EXISTS your_db_name;
USE your_db_name;
```

2. Edit `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_db_name
```

### Change Table Names

1. Update `DATABASE_SCHEMA.sql`:
```sql
CREATE TABLE IF NOT EXISTS your_table_name (
    -- columns...
);
```

2. Update Entity class:
```java
@Table(name = "your_table_name")
public class YourEntity { }
```

3. Update `config.ts`:
```typescript
enterprise: {
  tableName: 'your_table_name',
  // ...
}
```

### Change Field Names

1. Update `DATABASE_SCHEMA.sql`:
```sql
ALTER TABLE enterprise RENAME COLUMN enterprise_id TO id;
```

2. Update Entity:
```java
@Column(name = "id")
private Long id;
```

3. Update `config.ts`:
```typescript
fields: {
  id: 'id',  // Changed from 'enterprise_id'
}
```

---

## 📊 Module-wise APIs

### Enterprise Module
```
GET    /api/enterprise/list
GET    /api/enterprise/{id}
POST   /api/enterprise/create
PUT    /api/enterprise/update/{id}
DELETE /api/enterprise/delete/{id}
```

### Finance Module
```
GET    /api/finance/transactions
GET    /api/finance/invoices
GET    /api/finance/balance
POST   /api/finance/invoices/generate
```

### Rate Module
```
GET    /api/rate/mccmnc
GET    /api/rate/mo-reference
GET    /api/rate/countries
GET    /api/rate/mo-reference/lookup
```

### Product Module
```
GET    /api/product/categories
GET    /api/product/list
POST   /api/product/create
```

### SMS Services Module
```
GET    /api/sms-services/translation-rules
GET    /api/sms-services/auto-upload-rules
POST   /api/sms-services/translation-rules/create
```

### Report Module
```
GET    /api/report/daily
GET    /api/report/summary
POST   /api/report/export/{id}
GET    /api/report/tps
```

### Admin Module
```
GET    /api/admin/users
GET    /api/admin/roles
GET    /api/admin/audit-log
POST   /api/admin/users/create
```

---

## 💻 Usage in Components

### Example 1: Simple List

```typescript
import { enterpriseService } from './services/modules/enterpriseService';

async function loadEnterprises() {
  const result = await enterpriseService.getList(0, 50);
  if (result.success) {
    console.log(result.data.content);
  }
}
```

### Example 2: Create with Validation

```typescript
async function createEnterprise(name: string, type: string) {
  try {
    const result = await enterpriseService.create({
      enterprise_name: name,
      enterprise_type: type,
      status: 'ACTIVE'
    });
    
    if (result.success) {
      alert('Enterprise created!');
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert('Network error');
  }
}
```

### Example 3: Search and Filter

```typescript
async function searchEnterprises(query: string) {
  const result = await enterpriseService.search(query);
  return result.data?.content || [];
}

async function filterByType(type: 'CUSTOMER' | 'VENDOR') {
  const result = await enterpriseService.getByType(type);
  return result.data || [];
}
```

---

## 📈 Performance Features

✅ **Automatic Caching** - 5 minute cache for read operations  
✅ **Request Timeout** - 30 second timeout with retry logic  
✅ **Pagination** - Built-in pagination (default 50 per page)  
✅ **Database Indexes** - All primary queries indexed  
✅ **Connection Pooling** - HikariCP for optimal connections  
✅ **Batch Operations** - Support for bulk inserts/updates  

---

## 🔐 Security Checklist

- [ ] Change default MySQL password
- [ ] Implement JWT authentication
- [ ] Add CORS restrictions (not `*`)
- [ ] Hash passwords with bcrypt
- [ ] Add input validation in Spring Boot
- [ ] Implement audit logging
- [ ] Use HTTPS in production
- [ ] Add rate limiting
- [ ] Validate all API inputs

---

## 🐛 Common Issues & Solutions

### Issue: Connection Refused
```bash
# Check MySQL is running
mysql -u root -p

# If not running:
brew services start mysql  # macOS
sudo systemctl start mysql # Linux
```

### Issue: Table Not Found
```sql
-- Check database
USE teleoss;
SHOW TABLES;

-- If empty, run schema again
source DATABASE_SCHEMA.sql;
```

### Issue: CORS Error
```java
// Add to Spring Boot
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
```

### Issue: Slow Queries
```sql
-- Add indexes
CREATE INDEX idx_status ON enterprise(status);
CREATE INDEX idx_date ON transactions(payment_date);

-- Check query performance
EXPLAIN SELECT * FROM enterprise WHERE status = 'ACTIVE';
```

---

## 📚 Documentation Files

1. **DATABASE_INTEGRATION_GUIDE.md** - Complete setup guide (511 lines)
2. **DATABASE_SCHEMA.sql** - MySQL schema (329 lines)
3. **SPRING_BOOT_CONTROLLERS.java** - Controller templates (387 lines)
4. **src/services/modules/exampleUsage.ts** - Copy-paste examples (386 lines)

---

## ✨ What's Included

### Configuration System
- Centralized config in `src/services/api/config.ts`
- Easy to change database/table/field names
- Environment-based configuration support

### API Service Layer
- Generic HTTP client with error handling
- Automatic caching with TTL
- Retry mechanism for failed requests
- Request timeout (30 sec default)

### Service Classes (One for Each Module)
- Pre-built methods for all CRUD operations
- Advanced queries (search, filter, analytics)
- Pagination and sorting support
- Type-safe responses

### Complete Examples
- Simple CRUD operations
- Advanced filtering
- Batch operations
- Error handling
- Data transformation

---

## 🚀 Next Steps

1. **Run Database Schema**
   ```bash
   mysql -u root -p < DATABASE_SCHEMA.sql
   ```

2. **Setup Spring Boot Project**
   - Follow SPRING_BOOT_CONTROLLERS.java patterns
   - Configure application.properties
   - Create Entity and Repository classes

3. **Update React Config**
   - Edit `src/services/api/config.ts` baseUrl
   - Import services in your components
   - Use example code as reference

4. **Test the Integration**
   ```bash
   # Test backend API
   curl http://localhost:8080/api/enterprise/list
   
   # Test from React component
   import { enterpriseService } from './services/modules/enterpriseService';
   ```

---

## 💡 Pro Tips

1. **Fast Data Loading**
   - Use pagination to load data in chunks
   - Cache frequently accessed data
   - Filter at database level, not in UI

2. **Better Performance**
   - Add indexes to frequently queried columns
   - Use batch operations for bulk inserts
   - Implement proper error handling

3. **Easy Customization**
   - Change table/field names in config.ts only
   - No need to modify service code
   - Auto-detect API structure

4. **Development**
   - Use provided example code
   - Test with mock data first
   - Gradual integration with real DB

---

## 📞 Support Resources

- **Spring Boot**: https://spring.io/projects/spring-boot
- **Hibernate/JPA**: https://hibernate.org/orm/
- **MySQL**: https://dev.mysql.com/doc/
- **React**: https://react.dev/

---

## 📋 Checklist

- [ ] Run DATABASE_SCHEMA.sql
- [ ] Configure application.properties
- [ ] Create Spring Boot entities
- [ ] Implement service classes
- [ ] Create REST controllers
- [ ] Update React config.ts
- [ ] Test one API endpoint
- [ ] Import services in components
- [ ] Test data loading in UI
- [ ] Add error handling
- [ ] Implement caching
- [ ] Add authentication

---

**Ready to go!** 🎉 Your entire database integration system is set up and ready to use. Start with the examples and customize as needed!
