CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

INSERT IGNORE INTO users (username, password, email, role, created_at, updated_at)
VALUES ('admin', '$2a$10$eE.l1j9.b.r1e.x.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z', 'admin@teleoss.com', 'ADMIN', NOW(), NOW());
