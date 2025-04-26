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
    date_time TEXT ,
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
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
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
    const query = "SELECT customer_id FROM customers WHERE name = ? LIMIT 1;";

    db.get(query, [name], (err, row) => {
      if (err) {
        console.error(" Error:", err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const salesmenExists = (name) => {
  return new Promise((resolve, reject) => {
    createTable();
    const query = "SELECT salesmen_id FROM salesmen WHERE name = ? LIMIT 1;";

    db.get(query, [name], (err, row) => {
      if (err) {
        console.error(" Error:", err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const insertData = async (product, log) => {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const transactionId = v4();

    db.serialize(async () => {
      // Insert transaction record
      const date = new Date();
      db.run("BEGIN TRANSACTION;");
      if (log.type != "restock") {
        let customerId = {};
        let salesmenId = {};
        try {
          //does exist check
          customerId = await customerExists(log.personDetails.customerName);
          if (customerId === undefined) customerId = {};
          salesmenId = await salesmenExists(log.personDetails.salesmenName);
        } catch (err) {
          console.log(err);
        }

        if (!salesmenId.salesmen_id)
          return reject({ success: false, message: "Salesmen doesn't exist with name: " + log.personDetails.salesmenName });

        if (!customerId.customer_id) {
          //if doesnt exist create new id
          customerId.customer_id = v4();
          const sql2 = "INSERT INTO customers (customer_id, name, phn_no, address) VALUES(?, ?, ?, ?)";
          db.run(
            sql2,
            [
              customerId.customer_id,
              log.personDetails.customerName,
              log.personDetails.customerPhnNo,
              log.personDetails.customerAddress,
            ],
            function (err) {
              if (err) {
                console.log(err);
                db.run("ROLLBACK;");
                return reject({ success: false, message: "Transaction not inserted: " + err.message });
              }
            }
          );
        }

        const sql3 = `INSERT INTO transactions (transaction_id, transaction_type, customer_id, salesmen_id, discount, date_time) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(
          sql3,
          [transactionId, log.type, customerId.customer_id, salesmenId.salesmen_id, log?.discount ?? 0, date.toLocaleString()],
          function (err) {
            if (err) {
              console.log(err);
              db.run("ROLLBACK;");
              return reject({ success: false, message: "Transaction not inserted: " + err.message });
            }
          }
        );
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

//for suggestion
const fetchCustomerData = (value, limit = 8) => {
  return new Promise((resolve, reject) => {
    // Set encryption key for reading data
    db.run("PRAGMA key = 'Ma@7974561017';");
    createTable();

    const safeLimit = Number.isInteger(limit) ? limit : 8;
    const query = `SELECT customer_id, name, phn_no, address FROM customers WHERE name LIKE ? LIMIT ${safeLimit}`;

    db.all(query, [`%${value}%`], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
};
const fetchCustomerDataById = (id) => {
  return new Promise((resolve, reject) => {
    // Set encryption key for reading data
    db.run("PRAGMA key = 'Ma@7974561017';");
    createTable();

    const query = `SELECT customer_id, name, phn_no, address FROM customers WHERE customer_id= ?`;

    db.all(query, [id], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
};

//for suggestions
const fetchSalesmenData = (value, limit = 8) => {
  return new Promise((resolve, reject) => {
    // Set encryption key for reading data
    db.run("PRAGMA key = 'Ma@7974561017';");
    createTable();

    const safeLimit = Number.isInteger(limit) ? limit : 8;
    const query = `SELECT salesmen_id, name, phn_no, address FROM salesmen WHERE name LIKE ? LIMIT ${safeLimit}`;

    db.all(query, [`%${value}%`], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
};

const fetchAllSalesmen = (limit = -1) => {
  return new Promise((resolve, reject) => {
    // Set encryption key for reading data
    db.run("PRAGMA key = 'Ma@7974561017';");
    createTable();

    const safeLimit = Number.isInteger(limit) ? limit : 8;
    const query = `SELECT salesmen_id, name, phn_no, address FROM salesmen LIMIT ?`;

    db.all(query, [safeLimit], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
};

const fetchSalesmenDataById = (id) => {
  return new Promise((resolve, reject) => {
    // Set encryption key for reading data
    db.run("PRAGMA key = 'Ma@7974561017';");
    createTable();

    const query = `SELECT salesmen_id, name, phn_no, address FROM salesmen WHERE salesmen_id=?`;

    db.all(query, [id], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
};

const newSalesmen = (data) => {
  return new Promise(async (resolve, reject) => {
    // Set encryption key for reading data
    db.run("PRAGMA key = 'Ma@7974561017';");
    createTable();

    if (await salesmenExists(data.name)) {
      reject({ success: false, message: "Salesmen alerady exists! " });
    }
    const query = `INSERT INTO salesmen (salesmen_id, name, phn_no, address) VALUES (?, ?, ?, ?);`;
    const id = v4();
    db.run(query, [id, data.name, data.phnNo, data.address], (err, rows) => {
      if (err) {
        reject({ success: false, message: "Salesmen not inserted: " + err.message }); // Reject promise if error occurs
      } else {
        resolve({ success: true, message: `Salesmen inserted successfully: : ${data.name}` });
      }
    });
  });
};

const updateSale = (sale) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.run("PRAGMA key = 'Ma@7974561017';");
      createTable();

      const sql = `UPDATE sales_log SET items = ?, price = ? WHERE sale_id = ?;`;

      const items = Number(sale.prevItems) - Number(sale.items);
      const price = Number(items) * Number(sale.priceOfOne);

      db.run(sql, [items, price, sale.id], function (err) {
        if (err) {
          reject({ success: false, message: "Error updating sale: " + err.message });
        } else if (this.changes === 0) {
          reject({ success: false, message: "No sale updated" });
        } else {
          resolve({ success: false, message: "sale updated" });
        }
      });
    } catch (error) {
      reject({ success: false, message: "Unexpected error: " + error.message });
    }
  });
};

module.exports = {
  createTable,
  insertData,
  fetchAllTransactions,
  fetchAllLogs,
  fetchLogsByTransacton,
  fetchCustomerData,
  fetchCustomerDataById,
  fetchSalesmenData,
  fetchAllSalesmen,
  fetchSalesmenDataById,
  newSalesmen,
  salesmenExists,
  updateSale,
};
