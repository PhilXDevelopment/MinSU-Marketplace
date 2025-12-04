// migration/migrations.js
import mysql from "mysql2/promise";

// ------------------ DATABASE CONNECTION ------------------
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "" // add password if needed
});

// Create database if it doesn't exist and select it
await connection.query(`CREATE DATABASE IF NOT EXISTS marketplace`);
await connection.query(`USE marketplace`);
console.log("Database ready!");

// ------------------ TABLE DEFINITIONS ------------------
const usersTable = `
CREATE TABLE IF NOT EXISTS users (
  userid VARCHAR(255) PRIMARY KEY,
  avatar TEXT NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  middlename VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  birthday DATE NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  schoolid VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

const kycsTable = `
CREATE TABLE IF NOT EXISTS kyc (
  kycid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  idno VARCHAR(255) NOT NULL,
  idtype VARCHAR(255) NOT NULL,
  front VARCHAR(255) NOT NULL,
  back VARCHAR(255) NOT NULL,
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_kyc_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const tokensTable = `
CREATE TABLE IF NOT EXISTS tokens (
  tokenid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  token INT NOT NULL,
  type VARCHAR(255) NOT NULL,
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tokens_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const rolesTable = `
CREATE TABLE IF NOT EXISTS roles (
  roleid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  CONSTRAINT fk_roles_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const sessionsTable = `
CREATE TABLE IF NOT EXISTS sessions (
  sessionid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  time TIME NOT NULL,
  CONSTRAINT fk_sessions_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const productsTable = `
CREATE TABLE IF NOT EXISTS products (
  productid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const productImagesTable = `
CREATE TABLE IF NOT EXISTS product_images (
  product_imagesid VARCHAR(255) PRIMARY KEY,
  productid VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_images FOREIGN KEY (productid)
    REFERENCES products(productid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const ordersTable = `
CREATE TABLE IF NOT EXISTS orders (
  orderid VARCHAR(255) PRIMARY KEY,
  productid VARCHAR(255) NOT NULL,
  buyerid VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  ref_no VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (buyerid)
    REFERENCES users(userid)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_orders_product FOREIGN KEY (productid)
    REFERENCES products(productid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const deliveryTable = `
CREATE TABLE IF NOT EXISTS delivery (
  deliveryid VARCHAR(255) PRIMARY KEY,
  orderid VARCHAR(255) NOT NULL,
  description TEXT NULL,
  person_incharge TEXT NOT NULL,
  contact VARCHAR(255) NOT NULL,
  current_location TEXT NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_delivery_order FOREIGN KEY (orderid)
    REFERENCES orders(orderid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const deliveryTrackerTable = `
CREATE TABLE IF NOT EXISTS delivery_tracker (
  trackerid VARCHAR(255) PRIMARY KEY,
  deliveryid VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tracker_delivery FOREIGN KEY (deliveryid)
    REFERENCES delivery(deliveryid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const orderStatusTable = `
CREATE TABLE IF NOT EXISTS order_status (
  order_statusid VARCHAR(255) PRIMARY KEY,
  orderid VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_status_order FOREIGN KEY (orderid)
    REFERENCES orders(orderid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const reviewsTable = `
CREATE TABLE IF NOT EXISTS reviews (
  reviewid VARCHAR(255) PRIMARY KEY,
  productid VARCHAR(255) NOT NULL,
  rating INT NOT NULL,
  comment TEXT NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_product FOREIGN KEY (productid)
    REFERENCES products(productid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const cartsTable = `
CREATE TABLE IF NOT EXISTS carts (
  cartid VARCHAR(255) PRIMARY KEY,
  productid VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_carts_product FOREIGN KEY (productid)
    REFERENCES products(productid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const likesTable = `
CREATE TABLE IF NOT EXISTS likes (
  likesid VARCHAR(255) PRIMARY KEY,
  productid VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_likes_product FOREIGN KEY (productid)
    REFERENCES products(productid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const followsTable = `
CREATE TABLE IF NOT EXISTS follows (
  followid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_follows_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

const reportsTable = `
CREATE TABLE IF NOT EXISTS reports (
  reportid VARCHAR(255) PRIMARY KEY,
  reporterid VARCHAR(255) NOT NULL,
  reportedid VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reports_reporter FOREIGN KEY (reporterid)
    REFERENCES users(userid)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reports_reported FOREIGN KEY (reportedid)
    REFERENCES users(userid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
`;

// ------------------ MIGRATION FUNCTION ------------------
const tables = [
  usersTable, kycsTable, tokensTable, rolesTable, sessionsTable,
  productsTable, productImagesTable, ordersTable, deliveryTable,
  deliveryTrackerTable, orderStatusTable, reviewsTable, cartsTable,
  likesTable, followsTable, reportsTable
];

export async function migrate() {
  for (const table of tables) {
    try {
      await connection.query(table);
      console.log("Table created successfully.");
    } catch (err) {
      console.error("Error creating table:", err);
    }
  }
  await connection.end();
}

// ------------------ ROLLBACK FUNCTION ------------------
const dropOrder = [
  reportsTable, followsTable, likesTable, cartsTable, reviewsTable,
  orderStatusTable, deliveryTrackerTable, deliveryTable, ordersTable,
  productImagesTable, productsTable, sessionsTable, rolesTable, tokensTable,
  kycsTable, usersTable
];

export async function rollback() {
  for (const table of dropOrder) {
    try {
      const tableName = extractTableName(table);
      await connection.query(`DROP TABLE IF EXISTS ${tableName}`);
      console.log(`Dropped table ${tableName}`);
    } catch (err) {
      console.error("Error dropping table:", err);
    }
  }
  await connection.end();
}

// ------------------ HELPER ------------------
function extractTableName(createSql) {
  const match = createSql.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
  return match ? match[1] : "";
}

// ------------------ RUN SCRIPT ------------------

// Uncomment one of these lines to run the migration or rollback:
await migrate();   // Create all tables
// await rollback(); // Drop all tables
