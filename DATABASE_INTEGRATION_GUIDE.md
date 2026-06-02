# TeleOSS Database Integration Guide

Complete guide to integrate your MySQL database with Spring Boot backend and React frontend.

## 📋 Table of Contents
1. [Database Setup](#database-setup)
2. [Spring Boot Configuration](#spring-boot-configuration)
3. [React Frontend Integration](#react-frontend-integration)
4. [API Endpoints Documentation](#api-endpoints-documentation)
5. [Performance Optimization](#performance-optimization)
6. [Troubleshooting](#troubleshooting)

---

## 🗄️ Database Setup

### Step 1: Create Database and Tables

```bash
# Login to MySQL
mysql -u root -p

# Execute the schema
source DATABASE_SCHEMA.sql
```

### Step 2: Verify Tables Created

```sql
USE teleoss;
SHOW TABLES;

-- Should show:
-- enterprise, transactions, invoices, enterprise_balance, billing_cycle
-- country, mccmnc_unique_codes, mo_reference_book, wholesale_rates
-- product_category, products
-- translation_rule, auto_upload_rules, business_company
-- daily_reports, summary_reports
-- users, roles, permissions, role_permissions, audit_log
```

### Step 3: Customize Database Names (If Needed)

If you want to use different names:

```sql
-- Rename database
ALTER DATABASE teleoss RENAME TO your_db_name;

-- Rename table
RENAME TABLE enterprise TO enterprises;

-- Check current structure
DESC enterprise;
```

---

## 🚀 Spring Boot Configuration

### Step 1: Create Spring Boot Project

```bash
# Using Spring Initializr or Maven
mvn archetype:generate -DgroupId=com.teleoss -DartifactId=teleoss-api
```

### Step 2: Add Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>3.0.0</version>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
        <version>3.0.0</version>
    </dependency>
    
    <!-- MySQL Driver -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.33</version>
    </dependency>
    
    <!-- Lombok (for getters/setters) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

### Step 3: Configure application.properties

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/teleoss
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Logging
logging.level.root=INFO
logging.level.com.teleoss=DEBUG
```

### Step 4: Create Entity Classes

```java
package com.teleoss.entities;

import lombok.Data;
import javax.persistence.*;

@Entity
@Table(name = "enterprise")
@Data
public class Enterprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enterprise_id")
    private Long enterpriseId;
    
    @Column(name = "enterprise_name", nullable = false)
    private String enterpriseName;
    
    @Column(name = "enterprise_type")
    private String enterpriseType; // CUSTOMER, VENDOR, SUPPLIER
    
    @Column(name = "status")
    private String status; // ACTIVE, INACTIVE, SUSPENDED
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### Step 5: Create Repository Interfaces

```java
package com.teleoss.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.teleoss.entities.Enterprise;

public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {
    Enterprise findByEnterpriseName(String name);
    List<Enterprise> findByEnterpriseType(String type);
    Page<Enterprise> findByStatus(String status, Pageable pageable);
}
```

### Step 6: Create Service Classes

```java
package com.teleoss.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.teleoss.repositories.EnterpriseRepository;
import com.teleoss.entities.Enterprise;

@Service
public class EnterpriseService {
    
    @Autowired
    private EnterpriseRepository repository;
    
    public Page<Enterprise> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public Enterprise findById(Long id) {
        return repository.findById(id).orElse(null);
    }
    
    public Enterprise save(Enterprise enterprise) {
        return repository.save(enterprise);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
```

### Step 7: Test API Endpoints

```bash
# Get all enterprises
curl -X GET http://localhost:8080/api/enterprise/list

# Create enterprise
curl -X POST http://localhost:8080/api/enterprise/create \
  -H "Content-Type: application/json" \
  -d '{"enterpriseName":"ABC Corp","enterpriseType":"CUSTOMER","status":"ACTIVE"}'
```

---

## 💻 React Frontend Integration

### Step 1: Update API Config (Already Done)

File: `src/services/api/config.ts`

Change the baseUrl to match your Spring Boot server:

```typescript
export const DB_CONFIG = {
  baseUrl: 'http://localhost:8080/api', // Change this to your server
  // ... rest of config
};
```

### Step 2: Use Services in Components

Example in a React component:

```typescript
import { enterpriseService } from './services/modules/enterpriseService';
import { useState, useEffect } from 'react';

export function EnterpriseList() {
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await enterpriseService.getList(0, 50);
      if (response.success) {
        setEnterprises(response.data.content);
      }
      setLoading(false);
    };
    
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {enterprises.map(e => (
        <div key={e.enterprise_id}>{e.enterprise_name}</div>
      ))}
    </div>
  );
}
```

### Step 3: Handle Authentication

```typescript
// Add token to localStorage after login
localStorage.setItem('authToken', token);

// API Service automatically includes token in headers
// See src/services/api/apiService.ts getHeaders() method
```

---

## 📡 API Endpoints Documentation

### Enterprise Module

```
GET    /api/enterprise/list?page=0&size=50&search=query&type=CUSTOMER
GET    /api/enterprise/{id}
POST   /api/enterprise/create
PUT    /api/enterprise/update/{id}
DELETE /api/enterprise/delete/{id}
```

### Finance Module

```
GET    /api/finance/transactions?page=0&size=50&status=PENDING
POST   /api/finance/transactions/create
GET    /api/finance/invoices?page=0&size=50
POST   /api/finance/invoices/generate
GET    /api/finance/balance?enterpriseName=ABC%20Corp
PUT    /api/finance/balance/{enterpriseName}
```

### Rate Module

```
GET    /api/rate/mccmnc?page=0&size=50
GET    /api/rate/mo-reference?page=0&size=50&trunk=TRUNK_001
POST   /api/rate/mo-reference/create
GET    /api/rate/mo-reference/lookup?destination=USA&mccmnc=310410
GET    /api/rate/countries
```

### Product Module

```
GET    /api/product/categories
POST   /api/product/categories/create
GET    /api/product/list?page=0&size=50&search=SMS
GET    /api/product/{id}
POST   /api/product/create
```

### SMS Services Module

```
GET    /api/sms-services/translation-rules?page=0&size=50&type=INGRESS
POST   /api/sms-services/translation-rules/create
GET    /api/sms-services/auto-upload-rules?page=0&size=50
POST   /api/sms-services/auto-upload-rules/create
```

### Report Module

```
GET    /api/report/daily?page=0&size=50&date=2024-01-20
GET    /api/report/summary?page=0&size=50
POST   /api/report/export/{reportId}
GET    /api/report/tps?startDate=2024-01-01&endDate=2024-01-31
```

### Admin Module

```
GET    /api/admin/users?page=0&size=50
POST   /api/admin/users/create
PUT    /api/admin/users/{id}
GET    /api/admin/roles
POST   /api/admin/roles/create
GET    /api/admin/audit-log?page=0&size=50
```

---

## ⚡ Performance Optimization

### Database Level

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_enterprise_type ON enterprise(enterprise_type);
CREATE INDEX idx_payment_status ON transactions(payment_status);
CREATE INDEX idx_invoice_date ON invoices(invoice_date);
CREATE INDEX idx_mccmnc ON mccmnc_unique_codes(mccmnc);

-- Check query performance
EXPLAIN SELECT * FROM enterprise WHERE status = 'ACTIVE';
```

### Spring Boot Level

```properties
# Connection Pooling
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000

# Query Optimization
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.fetch_size=50

# Caching
spring.cache.type=redis
```

### React Level

Already implemented in `src/services/api/apiService.ts`:
- Response caching with 5-minute TTL
- Retry mechanism for failed requests
- Request timeout of 30 seconds

---

## 🔧 Troubleshooting

### Issue: Connection Refused

```properties
# Check if MySQL is running
# Verify database URL
spring.datasource.url=jdbc:mysql://localhost:3306/teleoss

# Check credentials
spring.datasource.username=root
spring.datasource.password=your_password
```

### Issue: Table Not Found

```bash
# Verify database name
SELECT DATABASE();

# Check tables
SHOW TABLES;

# If tables missing, run schema again
source DATABASE_SCHEMA.sql
```

### Issue: CORS Errors

Add CORS configuration in Spring Boot:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("*")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowCredentials(false);
            }
        };
    }
}
```

### Issue: Slow Queries

```sql
-- Enable query logging
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';
SELECT * FROM mysql.general_log LIMIT 10;

-- Check slow queries
SHOW VARIABLES LIKE 'long_query_time';
SET GLOBAL long_query_time = 0.5;
```

---

## 📝 Example: Complete Data Flow

1. **User Action in React**: Click "Get Enterprises"
2. **Service Call**: `enterpriseService.getList(0, 50)`
3. **API Request**: `GET /api/enterprise/list?page=0&size=50`
4. **Spring Boot**: Route to `EnterpriseController.getList()`
5. **Service Layer**: `EnterpriseService.findAll(pageable)`
6. **Repository**: `EnterpriseRepository.findAll(pageable)`
7. **Database Query**: 
   ```sql
   SELECT * FROM enterprise LIMIT 0, 50;
   ```
8. **Response**: Return paginated data
9. **React Component**: Display in table/list

---

## ✅ Checklist

- [ ] Database created with all tables
- [ ] Spring Boot project configured
- [ ] All dependencies added
- [ ] Database credentials in application.properties
- [ ] Entity classes created
- [ ] Repository interfaces created
- [ ] Service classes created
- [ ] Controllers implemented
- [ ] CORS configured
- [ ] React API config updated
- [ ] Services tested with actual data
- [ ] Performance indexes created
- [ ] Error handling implemented
- [ ] JWT authentication added

---

## 📞 Support

For issues or questions, refer to:
- Spring Boot Docs: https://spring.io/projects/spring-boot
- Hibernate Docs: https://hibernate.org/orm/documentation/
- MySQL Docs: https://dev.mysql.com/doc/
