const { app } = require("electron");
const path = require("path");
const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const dbPath = path.join(app.getPath("userData"), "inventory_encrypted.db");
const db = new sqlite3.Database(dbPath);

function getProductsCount() {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const query = "SELECT COUNT(*) AS count FROM products";
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getStocksCount() {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const query = "SELECT SUM(stock_quantity) AS count FROM products";
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getTodayTransactionsCount() {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const query = "SELECT Count(stock_quantity) AS count FROM products";
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getTodaySalesCount() {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    const query = `SELECT COUNT(*) AS count FROM sales_log s JOIN transactions t ON s.transaction_id = t.transaction_id WHERE t.date_time LIKE ?;`;
    db.all(query, [`${formattedDate}%`], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getProducsSoldTodayCount() {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    const query = `SELECT SUM(s.items) AS count FROM sales_log s JOIN transactions t ON s.transaction_id = t.transaction_id WHERE t.date_time LIKE ?;`;
    db.all(query, [`${formattedDate}%`], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getLowStockCount() {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const query = " SELECT COUNT(*) AS count FROM products WHERE stock_quantity < min_stock";
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getTodaysRevenue() {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    const query =
      "SELECT SUM(s.price) AS count FROM sales_log s JOIN transactions t ON s.transaction_id=t.transaction_id WHERE t.transaction_type=? AND t.date_time LIKE ?;";
    db.all(query, ["sale", `${formattedDate}%`], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  getLowStockCount,
  getProducsSoldTodayCount,
  getProductsCount,
  getStocksCount,
  getTodaySalesCount,
  getTodayTransactionsCount,
  getTodaysRevenue,
};
