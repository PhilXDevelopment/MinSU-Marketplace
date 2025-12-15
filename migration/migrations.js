// migration/migrations.js
import mysql from "mysql2/promise";

// ------------------ DATABASE CONNECTION ------------------
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

// Create database if not exists
await connection.query(`CREATE DATABASE IF NOT EXISTS marketplace`);
await connection.query(`USE marketplace`);
console.log("Database ready!");

// ------------------ TABLE DEFINITIONS ------------------

// USERS
const users = `
CREATE TABLE IF NOT EXISTS users (
  userid VARCHAR(255) PRIMARY KEY,
  avatar TEXT NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  middlename VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  birthday DATE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  schoolid VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

// KYC
const kyc = `
CREATE TABLE IF NOT EXISTS kyc (
  kycid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  usertype VARCHAR(255) NOT NULL,
  idno VARCHAR(255) NOT NULL,
  idtype VARCHAR(255) NOT NULL,
  front VARCHAR(255) NOT NULL,
  back VARCHAR(255) NOT NULL,
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_kyc_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// ROLES
const roles = `
CREATE TABLE IF NOT EXISTS roles (
  roleid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  CONSTRAINT fk_roles_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// SESSIONS
const sessions = `
CREATE TABLE IF NOT EXISTS sessions (
  sessionid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  datetime DATETIME NOT NULL,
  CONSTRAINT fk_sessions_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// TERMS POLICY
const terms_policy = `
CREATE TABLE IF NOT EXISTS terms_policy (
  terms_policyid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_terms_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// TOKENS
const tokens = `
CREATE TABLE IF NOT EXISTS tokens (
  tokenid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  code VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tokens_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// ADDRESS
const address = `
CREATE TABLE IF NOT EXISTS address (
  addressid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  barangay VARCHAR(255) NOT NULL,
  municipality VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_address_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// VERIFY
const verify = `
CREATE TABLE IF NOT EXISTS verify (
  verifyid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  adminid VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_verify_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE,
  CONSTRAINT fk_verify_admin FOREIGN KEY (adminid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// PRODUCTS
const products = `
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
  category VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// PRODUCT IMAGES
const product_images = `
CREATE TABLE IF NOT EXISTS product_images (
  product_imagesid VARCHAR(255) PRIMARY KEY,
  productid VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_images FOREIGN KEY (productid)
    REFERENCES products(productid)
    ON DELETE CASCADE
)
`;

// ORDERS
const orders = `
CREATE TABLE IF NOT EXISTS orders (
  orderid VARCHAR(255) PRIMARY KEY,
  productid VARCHAR(255) NOT NULL,
  buyerid VARCHAR(255) NOT NULL,
  addressid VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  ref_no VARCHAR(255) NOT NULL,
  payment_method VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_buyer FOREIGN KEY (buyerid)
    REFERENCES users(userid)
    ON DELETE CASCADE,
  CONSTRAINT fk_orders_address FOREIGN KEY (addressid)
    REFERENCES address(addressid)
    ON DELETE CASCADE,
  CONSTRAINT fk_orders_product FOREIGN KEY (productid)
    REFERENCES products(productid)
    ON DELETE CASCADE
)
`;

// CARRIERS
const carriers = `
CREATE TABLE IF NOT EXISTS carriers (
  carrierid VARCHAR(255) PRIMARY KEY,
  avatar TEXT NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  middlename VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  idtype VARCHAR(255) NOT NULL,
  frontid VARCHAR(255) NOT NULL,
  backid VARCHAR(255) NOT NULL,
  service VARCHAR(255) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  birthday DATE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  schoolid VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

// DELIVERY
const delivery = `
CREATE TABLE IF NOT EXISTS delivery (
  deliveryid VARCHAR(255) PRIMARY KEY,
  orderid VARCHAR(255) NOT NULL,
  riderid VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_delivery_order FOREIGN KEY (orderid)
    REFERENCES orders(orderid)
    ON DELETE CASCADE,
  CONSTRAINT fk_delivery_rider FOREIGN KEY (riderid)
    REFERENCES carriers(carrierid)
    ON DELETE CASCADE
)
`;

// DELIVERY TRACKER
const delivery_tracker = `
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
)
`;

// ORDER STATUS
const order_status = `
CREATE TABLE IF NOT EXISTS order_status (
  order_statusid VARCHAR(255) PRIMARY KEY,
  orderid VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_status_order FOREIGN KEY (orderid)
    REFERENCES orders(orderid)
    ON DELETE CASCADE
)
`;

// REVIEWS
const reviews = `
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
)
`;

// CARTS
const carts = `
CREATE TABLE IF NOT EXISTS carts (
  cartid VARCHAR(255) PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  productid VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_carts_product FOREIGN KEY (productid)
    REFERENCES products(productid)
    ON DELETE CASCADE,
  CONSTRAINT fk_user_carts FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// LIKES
const likes = `
CREATE TABLE IF NOT EXISTS likes (
  likesid VARCHAR(255) PRIMARY KEY,
  productid VARCHAR(255) NOT NULL,
  userid VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_likes_product FOREIGN KEY (productid)
    REFERENCES products(productid)
    ON DELETE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// FOLLOWS
const follows = `
CREATE TABLE IF NOT EXISTS follows (
  followid VARCHAR(255) PRIMARY KEY,
  followingid VARCHAR(255) NOT NULL,
  userid VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_follows_user FOREIGN KEY (userid)
    REFERENCES users(userid)
    ON DELETE CASCADE,
  CONSTRAINT fk_following_user FOREIGN KEY (followingid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// REPORTS
const reports = `
CREATE TABLE IF NOT EXISTS reports (
  reportid VARCHAR(255) PRIMARY KEY,
  reporterid VARCHAR(255) NOT NULL,
  reportedid VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reports_reporter FOREIGN KEY (reporterid)
    REFERENCES users(userid)
    ON DELETE CASCADE,
  CONSTRAINT fk_reports_reported FOREIGN KEY (reportedid)
    REFERENCES users(userid)
    ON DELETE CASCADE
)
`;

// ------------------ MIGRATION ORDER ------------------
const tables = [
  users,
  kyc,
  roles,
  sessions,
  terms_policy,
  tokens,
  address,
  verify,
  products,
  product_images,
  orders,
  carriers,
  delivery,
  delivery_tracker,
  order_status,
  reviews,
  carts,
  likes,
  follows,
  reports,
];

// ------------------ RUN MIGRATION ------------------
export async function migrate() {
  try {
    await connection.query("SET FOREIGN_KEY_CHECKS=0");
    for (const table of tables) {
      const name = table.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)[1];
      await connection.query(table);
      console.log(`Table created: ${name}`);
    }
    await connection.query("SET FOREIGN_KEY_CHECKS=1");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await connection.end();
  }
}

// ------------------ ROLLBACK ------------------
export async function rollback() {
  try {
    await connection.query("SET FOREIGN_KEY_CHECKS=0");
    for (const table of [...tables].reverse()) {
      const name = table.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)[1];
      await connection.query(`DROP TABLE IF EXISTS ${name}`);
      console.log(`Dropped table: ${name}`);
    }
    await connection.query("SET FOREIGN_KEY_CHECKS=1");
  } catch (err) {
    console.error("Rollback error:", err);
  } finally {
    await connection.end();
  }
}

// ------------------ EXECUTE ------------------
await migrate();
// await rollback();
