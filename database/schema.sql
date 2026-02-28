CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  unit VARCHAR(20) NOT NULL,
  current_quantity DECIMAL(12,3) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  material_id INT NOT NULL,
  quantity_per_unit DECIMAL(12,3) NOT NULL,
  UNIQUE KEY uniq_product_material (product_id, material_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stock_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  txn_type ENUM('PURCHASE','SALE_CONSUMPTION') NOT NULL,
  material_id INT NOT NULL,
  quantity_change DECIMAL(12,3) NOT NULL,
  reference_type VARCHAR(50) NOT NULL,
  reference_id INT NULL,
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materials(id)
);

CREATE TABLE IF NOT EXISTS product_sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  sold_quantity DECIMAL(12,3) NOT NULL,
  sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- default login user: admin / admin123
INSERT INTO users (username, password_hash)
VALUES ('admin', '$2b$10$HFXImA0wYf6D6x8ilK.5GOV1BpsPrbXf6.1BC6wMOLfQoyNE67MOm')
ON DUPLICATE KEY UPDATE username = username;
