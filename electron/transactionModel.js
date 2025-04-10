const { app } = require("electron");
const path = require("path");
const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const { v4 } = require("uuid");

const dbPath = path.join(app.getPath("userData"), "inventory_encrypted.db");
const db = new sqlite3.Database(dbPath);

//create both transactions and sales_log
const createTable = () => {
  db.run("PRAGMA key = 'Ma@7974561017';");
  db.run(
    `CREATE TABLE IF NOT EXISTS transactions (
    transaction_id TEXT PRIMARY KEY,
    transaction_type TEXT NOT NULL,
    customer_name TEXT NOT NULL ,
    total_price REAL NOT NULL,
    discount REAL DEFAULT 0,
    date_time TEXT DEFAULT CURRENT_TIMESTAMP
);`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS sales_log (
    sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    items INTEGER NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS transactions (
    transaction_id TEXT PRIMARY KEY,
    transaction_type TEXT NOT NULL,
    customer_name TEXT NOT NULL ,
    total_price REAL NOT NULL,
    discount REAL DEFAULT 0,
    date_time TEXT DEFAULT CURRENT_TIMESTAMP
);`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS transactions (
    transaction_id TEXT PRIMARY KEY,
    transaction_type TEXT NOT NULL,
    customer_name TEXT NOT NULL ,
    total_price REAL NOT NULL,
    discount REAL DEFAULT 0,
    date_time TEXT DEFAULT CURRENT_TIMESTAMP
);`
  );
};
createTable();

const insertData = (product, log) => {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const transactionId = v4();

    db.serialize(() => {
      // Insert transaction record
      const date = new Date();
      let totalPrice = 0;
      if (Array.isArray(product)) {
        for (let i = 0; i < product.length; i++) {
          totalPrice += Number(product[i].items) * product[i].sellingPrice;
        }
      } else {
        totalPrice += Number(product.items) * product.sellingPrice;
      }
      const sql1 = `INSERT INTO transactions (transaction_id, transaction_type, customer_name, total_price, discount, date_time) VALUES (?, ?, ?, ?, ?, ?)`;

      db.run("BEGIN TRANSACTION;");
      db.run(sql1, [transactionId, log.type, log.customerName, totalPrice, log?.discount ?? 0, date.toLocaleString()], function (err) {
        if (err) {
          console.log(err);
          db.run("ROLLBACK;");
          return reject({ success: false, message: "Transaction not inserted: " + err.message });
        }
      });

      // Insert sales log
      if (Array.isArray(product)) {
        for (let i = 0; i < product.length; i++) {
          const sql2 = `INSERT INTO sales_log (transaction_id, product_id, items, price) VALUES ( ?, ?, ?, ?)`;
          db.run(sql2, [transactionId, product[i].id, product[i].items, product[i].items * product[i].sellingPrice], function (err) {
            if (err) {
              return reject({ success: false, message: "Sales log not inserted: " + err.message });
            }
          });
        }
      } else {
        const sql2 = `INSERT INTO sales_log (transaction_id, product_id, items, price) VALUES (?, ?, ?, ?)`;
        db.run(sql2, [transactionId, log.id, product.items, product.items * product.sellingPrice], function (err) {
          if (err) {
            return reject({ success: false, message: "Sales log not inserted: " + err.message });
          }
        });
      }
      // Commit transaction after successful execution
      db.run("COMMIT;", (err) => {
        if (err) {
          return reject({ success: false, message: "Transaction commit failed: " + err.message });
        }
        resolve({ success: true, message: `Transaction inserted successfully with ID: ${transactionId}` });
      });
    });
  });
};

const fetchAllTransactions = (limit = -1) => {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const sql = `SELECT * FROM transactions ORDER BY date_time DESC LIMIT ? `;
    db.all(sql, [limit], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
};

const fetchAllLogs = (limit = -1) => {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const sql = `SELECT * FROM sales_log LIMIT ?`;
    db.all(sql, [limit], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
};

const fetchLogsByTransacton = (transaction_id) => {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const sql = `SELECT * FROM sales_log WHERE transaction_id = ? `;
    db.all(sql, [String(transaction_id)], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = { createTable, insertData, fetchAllTransactions, fetchAllLogs, fetchLogsByTransacton };
