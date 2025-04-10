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
    customer_id TEXT ,
    salesmen_id TEXT ,
    discount REAL DEFAULT 0,
    date_time TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (salesmen_id) REFERENCES salesmen(salesmen_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
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
    `CREATE TABLE IF NOT EXISTS salesmen (
    salesmen_id TEXT PRIMARY KEY,
    name TEXT NOT NULL ,
    phn_no INTEGER NOT NULL default 0,
    address TEXT
);`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS customers (
    customer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL ,
    phn_no INTEGER NOT NULL default 0,
    address TEXT
);`
  );
};
createTable();

const customerExists = (name) => {
  return new Promise((resolve, reject) => {
    createTable();
    const query = "SELECT id FROM customers WHERE name = ? LIMIT 1;";

    db.get(query, [product.name, product.quantity, product.measuringUnit], (err, row) => {
      if (err) {
        console.error(" Error:", err.message);
        reject(err);
      } else {
        resolve(row); // Returns true if row exists, else false
      }
    });
  });
};
const salesmenExists = () => {};

const insertData = (product, log) => {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const transactionId = v4();
    let customerId = v4();
    let salesmenId = v4();

    db.serialize(() => {
      // Insert transaction record
      const date = new Date();

      db.run("BEGIN TRANSACTION;");
      if (log.type != "restock") {
        const sql1 = "INSERT INTO salesmen (salesmen_id, name, phn_no, address) VALUES(?, ?, ?, ?)";
        db.run(
          sql1,
          [salesmenId, log.personDetails.salesmenName, log.personDetails.salesmenPhnNo, log.personDetails.salesmenAddress],
          function (err) {
            if (err) {
              console.log(err);
              db.run("ROLLBACK;");
              return reject({ success: false, message: "Transaction not inserted: " + err.message });
            }
          }
        );

        const sql2 = "INSERT INTO customers (customer_id, name, phn_no, address) VALUES(?, ?, ?, ?)";
        db.run(
          sql2,
          [customerId, log.personDetails.customerName, log.personDetails.customerPhnNo, log.personDetails.customerAddress],
          function (err) {
            if (err) {
              console.log(err);
              db.run("ROLLBACK;");
              return reject({ success: false, message: "Transaction not inserted: " + err.message });
            }
          }
        );

        const sql3 = `INSERT INTO transactions (transaction_id, transaction_type, customer_id, salesmen_id, discount, date_time) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql3, [transactionId, log.type, customerId, salesmenId, log?.discount ?? 0, date.toLocaleString()], function (err) {
          if (err) {
            console.log(err);
            db.run("ROLLBACK;");
            return reject({ success: false, message: "Transaction not inserted: " + err.message });
          }
        });
      } else {
        const sql3 = `INSERT INTO transactions (transaction_id, transaction_type, date_time) VALUES (?, ?, ?)`;
        db.run(sql3, [transactionId, log.type, date.toLocaleString()], function (err) {
          if (err) {
            console.log(err);
            db.run("ROLLBACK;");
            return reject({ success: false, message: "Transaction not inserted: " + err.message });
          }
        });
      }

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
