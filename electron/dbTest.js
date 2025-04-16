const { create } = require("domain");

module.exports = () => {
  const { app } = require("electron");
  const path = require("path");
  const sqlite3 = require("@journeyapps/sqlcipher").verbose();
  const { createTable, fetchData, fetchAllData } = require("./models/productsModel");
  // const createTable = require("./transactionModel");
  const closeConn = () => {
    // Close the database connection properly
    db.close((err) => {
      if (err) {
        console.error(" Error closing database:", err.message);
      } else {
        console.log(" Database connection closed.");
      }
    });
  };

  const dbPath = path.join(app.getPath("userData"), "inventory_encrypted.db");
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Database connection error:", err.message);
      return;
    }
    console.log("Connected to the encrypted database.");
  });

  const tableInfo = () => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    db.all("PRAGMA table_info(products);", [], (err, rows) => {
      if (err) {
        console.error(" Error fetching table structure:", err.message);
        closeConn();
        return;
      }
      const names = rows.map((u) => u.name);
      console.log(" Table Structure (transactions):", rows);
      closeConn();
    });
    db.all("PRAGMA table_info(transactions);", [], (err, rows) => {
      if (err) {
        console.error(" Error fetching table structure:", err.message);
        closeConn();
        return;
      }
      const names = rows.map((u) => u.name);
      console.log(" Table Structure (transactions):", rows);
      closeConn();
    });
    db.all("PRAGMA table_info(sales_log);", [], (err, rows) => {
      if (err) {
        console.error(" Error fetching table structure:", err.message);
        closeConn();
        return;
      }
      const names = rows.map((u) => u.name);
      console.log(" Table Structure:(sales_log)", rows);
      closeConn();
    });
    db.all("PRAGMA table_info(salesmen);", [], (err, rows) => {
      if (err) {
        console.error(" Error fetching table structure:", err.message);
        closeConn();
        return;
      }
      const names = rows.map((u) => u.name);
      console.log(" Table Structure:(salesmen)", rows);
      closeConn();
    });
    db.all("PRAGMA table_info(customers);", [], (err, rows) => {
      if (err) {
        console.error(" Error fetching table structure:", err.message);
        closeConn();
        return;
      }
      const names = rows.map((u) => u.name);
      console.log(" Table Structure:(customers)", rows);
      closeConn();
    });
  };

  db.serialize(async () => {
    // Set encryption key
    db.run("PRAGMA key = 'Ma@7974561017';", (err) => {
      if (err) {
        console.error(" Failed to set encryption key:", err.message);
        return;
      }
      console.log(" Encryption key set.");
    });
    let limit = 100;
    db.all("SELECT * FROM customers LIMIT ?", [limit], (err, rows) => {
      if (err) throw err;
      console.log(rows);
    });
    // tableInfo();
  });
};
