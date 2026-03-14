const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const databaseName = process.env.MYSQL_DATABASE || "little_paws";
const baseConfig = {
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
};

let pool;

async function columnExists(tableName, columnName) {
  const escapedColumnName = String(columnName).replace(/'/g, "\\'");
  const rows = await query(`SHOW COLUMNS FROM \`${tableName}\` LIKE '${escapedColumnName}'`);
  return rows.length > 0;
}

async function ensureColumn(tableName, columnName, definition) {
  if (await columnExists(tableName, columnName)) {
    return;
  }

  await pool.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`);
}

async function createDatabaseIfNeeded() {
  const connection = await mysql.createConnection(baseConfig);
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await connection.end();
  }
}

async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      userName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(100) NOT NULL DEFAULT 'user',
      city VARCHAR(255) NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      UNIQUE KEY users_userName_unique (userName),
      UNIQUE KEY users_email_unique (email)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS shelters (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      shelterAdmin BIGINT UNSIGNED NULL,
      contact VARCHAR(255) NULL,
      address TEXT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      UNIQUE KEY shelters_city_unique (city)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pets (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      pictures LONGTEXT NULL,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(255) NOT NULL,
      breed VARCHAR(255) NOT NULL,
      description TEXT NULL,
      age INT NOT NULL,
      region VARCHAR(255) NOT NULL,
      distanceFromChandigarhKm DECIMAL(10, 2) NULL,
      pickupEligible TINYINT(1) NOT NULL DEFAULT 0,
      pickupMessage TEXT NULL,
      foster BIGINT UNSIGNED NULL,
      shelter BIGINT UNSIGNED NULL,
      reportStatus VARCHAR(100) NOT NULL DEFAULT 'pending',
      reportSeenAt DATETIME NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS adoption_forms (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user BIGINT UNSIGNED NULL,
      pet BIGINT UNSIGNED NULL,
      city VARCHAR(255) NULL,
      personalInfo LONGTEXT NOT NULL,
      livingConditions LONGTEXT NOT NULL,
      petExperience LONGTEXT NOT NULL,
      adoptionDetails LONGTEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      submissionDate DATETIME NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      image TEXT NULL,
      title VARCHAR(255) NULL,
      description TEXT NULL,
      category VARCHAR(255) NULL,
      brand VARCHAR(255) NULL,
      price DECIMAL(10, 2) NOT NULL DEFAULT 0,
      salePrice DECIMAL(10, 2) NOT NULL DEFAULT 0,
      totalStock INT NOT NULL DEFAULT 0,
      averageReview DECIMAL(10, 2) NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS carts (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      userId BIGINT UNSIGNED NOT NULL,
      items LONGTEXT NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      UNIQUE KEY carts_userId_unique (userId)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS addresses (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      userId BIGINT UNSIGNED NOT NULL,
      address TEXT NULL,
      city VARCHAR(255) NULL,
      pincode VARCHAR(50) NULL,
      phone VARCHAR(50) NULL,
      notes TEXT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      userId BIGINT UNSIGNED NULL,
      cartId BIGINT UNSIGNED NULL,
      cartItems LONGTEXT NOT NULL,
      addressInfo LONGTEXT NOT NULL,
      orderStatus VARCHAR(100) NULL,
      paymentMethod VARCHAR(100) NULL,
      paymentStatus VARCHAR(100) NULL,
      totalAmount DECIMAL(10, 2) NOT NULL DEFAULT 0,
      orderDate DATETIME NULL,
      orderUpdateDate DATETIME NULL,
      paymentId VARCHAR(255) NULL,
      payerId VARCHAR(255) NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS donations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(100) NULL,
      amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
      message TEXT NULL,
      userId BIGINT UNSIGNED NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);

  await ensureColumn("shelters", "address", "TEXT NULL");
  await ensureColumn("pets", "distanceFromChandigarhKm", "DECIMAL(10, 2) NULL");
  await ensureColumn("pets", "pickupEligible", "TINYINT(1) NOT NULL DEFAULT 0");
  await ensureColumn("pets", "pickupMessage", "TEXT NULL");
  await ensureColumn("pets", "reportStatus", "VARCHAR(100) NOT NULL DEFAULT 'pending'");
  await ensureColumn("pets", "reportSeenAt", "DATETIME NULL");
}

async function ensureSeedData() {
  const [userCountRow] = await query("SELECT COUNT(*) AS count FROM users LIMIT 1");
  if (!userCountRow.count) {
    const password = await bcrypt.hash("Password@123", 12);
    const now = new Date();

    await query(
      `INSERT INTO users (userName, email, password, role, city, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "shelterdemo",
        "shelter@littlepaws.com",
        password,
        "shelterAdmin",
        "Chandigarh",
        now,
        now,
      ]
    );
  }

  const shelterAdmins = await query(
    "SELECT id, role, city FROM users WHERE role = 'shelterAdmin' ORDER BY id ASC"
  );
  const shelterAdmin = shelterAdmins[0];

  const [shelterCountRow] = await query("SELECT COUNT(*) AS count FROM shelters LIMIT 1");
  if (!shelterCountRow.count) {
    const now = new Date();
    await query(
      `INSERT INTO shelters (name, city, shelterAdmin, contact, address, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`,
      [
        "Little Paws Chandigarh Shelter",
        "Chandigarh",
        shelterAdmin ? shelterAdmin.id : null,
        "+91-9876500001",
        "Sector 17, Chandigarh",
        now,
        now,
        "Little Paws Mohali Shelter",
        "Mohali",
        shelterAdmin ? shelterAdmin.id : null,
        "+91-9876500002",
        "Phase 5, Mohali",
        now,
        now,
        "Little Paws Panchkula Shelter",
        "Panchkula",
        shelterAdmin ? shelterAdmin.id : null,
        "+91-9876500003",
        "Sector 10, Panchkula",
        now,
        now,
      ]
    );
  }

  const shelters = await query("SELECT id, city FROM shelters ORDER BY id ASC");
  const shelterByCity = new Map(shelters.map((shelter) => [shelter.city, shelter.id]));

  await query(
    `UPDATE shelters
     SET address = CASE city
       WHEN 'Chandigarh' THEN 'Sector 17, Chandigarh'
       WHEN 'Mohali' THEN 'Phase 5, Mohali'
       WHEN 'Panchkula' THEN 'Sector 10, Panchkula'
       ELSE address
     END
     WHERE address IS NULL OR address = ''`
  );

  const [petCountRow] = await query("SELECT COUNT(*) AS count FROM pets LIMIT 1");
  if (!petCountRow.count) {
    const now = new Date();
    const petRows = [
      {
        pictures: JSON.stringify([
          "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
        ]),
        name: "Bruno",
        type: "Dog",
        breed: "Labrador Retriever",
        description: "Friendly, playful, and good with families.",
        age: 3,
        region: "Chandigarh",
      },
      {
        pictures: JSON.stringify([
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
        ]),
        name: "Milo",
        type: "Dog",
        breed: "Golden Retriever",
        description: "Energetic dog who loves walks and attention.",
        age: 2,
        region: "Mohali",
      },
      {
        pictures: JSON.stringify([
          "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80",
        ]),
        name: "Luna",
        type: "Cat",
        breed: "Siamese",
        description: "Calm indoor cat with a gentle temperament.",
        age: 2,
        region: "Chandigarh",
      },
      {
        pictures: JSON.stringify([
          "https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=900&q=80",
        ]),
        name: "Bella",
        type: "Cat",
        breed: "Persian",
        description: "Soft, affectionate, and easy to handle.",
        age: 4,
        region: "Panchkula",
      },
      {
        pictures: JSON.stringify([
          "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=900&q=80",
        ]),
        name: "Kiwi",
        type: "Bird",
        breed: "Parrot",
        description: "Bright, social bird that enjoys interaction.",
        age: 1,
        region: "Mohali",
      },
      {
        pictures: JSON.stringify([
          "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=900&q=80",
        ]),
        name: "Nibbles",
        type: "Hamster",
        breed: "Syrian",
        description: "Small and playful companion for a calm home.",
        age: 1,
        region: "Panchkula",
      },
    ];

    for (const pet of petRows) {
      await query(
        `INSERT INTO pets (pictures, name, type, breed, description, age, region, foster, shelter, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pet.pictures,
          pet.name,
          pet.type,
          pet.breed,
          pet.description,
          pet.age,
          pet.region,
          shelterAdmin ? shelterAdmin.id : null,
          shelterByCity.get(pet.region) || null,
          now,
          now,
        ]
      );
    }
  }

  const [productCountRow] = await query("SELECT COUNT(*) AS count FROM products LIMIT 1");
  if (!productCountRow.count) {
    const now = new Date();
    const productRows = [
      [
        "https://images.unsplash.com/photo-1583511655826-05700442b31b?auto=format&fit=crop&w=900&q=80",
        "Royal Canin Dog Food",
        "Balanced nutrition for adult dogs.",
        "dog",
        "royal-canin",
        1999,
        1799,
        25,
      ],
      [
        "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=900&q=80",
        "Purina Cat Food",
        "Complete meal for indoor cats.",
        "cat",
        "purina",
        1499,
        1299,
        30,
      ],
      [
        "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80",
        "Bird Seed Mix",
        "Nutritious daily blend for birds.",
        "bird",
        "blue-buffalo",
        599,
        499,
        40,
      ],
      [
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
        "Hamster Treat Pack",
        "Healthy snack pack for hamsters.",
        "hamster",
        "orijen",
        399,
        349,
        50,
      ],
      [
        "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=900&q=80",
        "Fish Nutrition Pellets",
        "Floating pellets for aquarium fish.",
        "fish",
        "hill's",
        299,
        249,
        60,
      ],
    ];

    for (const product of productRows) {
      await query(
        `INSERT INTO products (image, title, description, category, brand, price, salePrice, totalStock, averageReview, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [...product, 4.5, now, now]
      );
    }
  }
}

async function initDatabase() {
  if (pool) {
    return pool;
  }

  try {
    pool = mysql.createPool({
      ...baseConfig,
      database: databaseName,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: false,
    });
    await pool.query("SELECT 1");
  } catch (error) {
    if (error.code !== "ER_BAD_DB_ERROR") {
      throw error;
    }

    await createDatabaseIfNeeded();
    pool = mysql.createPool({
      ...baseConfig,
      database: databaseName,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: false,
    });
  }

  await ensureTables();
  await ensureSeedData();
  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error("MySQL pool has not been initialized yet.");
  }

  return pool;
}

async function query(sql, params = []) {
  const activePool = getPool();
  const [rows] = await activePool.execute(sql, params);
  return rows;
}

module.exports = {
  databaseName,
  getPool,
  initDatabase,
  query,
};
