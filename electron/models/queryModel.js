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

function getSales(fromDate, toDate, limit = -1) {
  let date = new Date(fromDate);
  const from = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, 00:00:00 AM`;
  date = new Date(toDate);
  date.setDate(date.getDate() + 1);
  const to = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} 11:59:59 PM`;

  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");

    const query =
      "SELECT t.transaction_id, t.transaction_type, t.date_time, sl.items, sl.price, s.name AS sname, s.salesmen_id, c.name AS cname, c.customer_id, p.name AS pname FROM transactions t" +
      " JOIN sales_log sl ON t.transaction_id = sl.transaction_id" +
      " JOIN products p ON sl.product_id = p.id " +
      " JOIN customers c ON t.customer_id = c.customer_id " +
      " JOIN salesmen s ON t.salesmen_id = s.salesmen_id" +
      " WHERE t.transaction_type = ? AND t.date_time >= ? AND t.date_time <= ? LIMIT  ?";
    db.all(query, ["sale", `${from}%`, `${to}%`, limit], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getTopSellingProducts(fromDate, toDate, limit = -1) {
  let date = new Date(fromDate);
  const from = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, 00:00:00 AM`;
  date = new Date(toDate);
  date.setDate(date.getDate() + 1);
  const to = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} 11:59:59 PM`;

  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");

    const query =
      "SELECT COUNT(sl.sale_id) AS saleCount, SUM(sl.price) AS totalPrice, p.name, p.selling_price FROM products p " +
      " JOIN sales_log sl ON sl.product_id = p.id" +
      " JOIN transactions t ON sl.transaction_id = t.transaction_id" +
      " WHERE t.transaction_type = ? AND t.date_time >= ? AND t.date_time <= ?" +
      " GROUP BY p.name";
    db.all(query, ["sale", `${from}`, `${to}`], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

// function getSalesBySalesmen(fromDate, toDate, limit = -1) {
//   let date = new Date(fromDate);
//   const from = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, 00:00:00 AM`;
//   date = new Date(toDate);
//   date.setDate(date.getDate() + 1);
//   const to = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} 11:59:59 PM`;

//   return new Promise((resolve, reject) => {
//     db.run("PRAGMA key = 'Ma@7974561017';");

//     const query =
//       "SELECT s.salesmen_id, s.name AS sname, t.transaction_id, t.date_time, sl.items, sl.price, c.name AS cname, p.name AS pname FROM transactions t" +
//       " JOIN sales_log sl ON t.transaction_id = sl.transaction_id" +
//       " JOIN products p ON sl.product_id = p.id " +
//       " JOIN customers c ON t.customer_id = c.customer_id " +
//       " JOIN salesmen s ON t.salesmen_id = s.salesmen_id" +
//       " WHERE t.date_time >= ? AND t.date_time <= ? LIMIT  ?";
//     db.all(query, ["sale", `${from}%`, `${to}%`, limit], (err, rows) => {
//       if (err) {
//         reject(err); // Reject promise if error occurs
//       } else {
//         resolve(rows);
//       }
//     });
//   });
// }

function getProfitLoss(fromDate, toDate, limit = -1) {
  let date = new Date(fromDate);
  const from = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, 00:00:00 AM`;
  date = new Date(toDate);
  date.setDate(date.getDate() + 1);
  const to = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} 11:59:59 PM`;

  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");

    const query = "SELECT ";
    db.all(query, ["sale", `${from}%`, `${to}%`, limit], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getLowStocks(fromDate, toDate, limit = -1) {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");

    const query = "SELECT * FROM products WHERE stock_quantity < min_stock LIMIT ?";
    db.all(query, [limit], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getOutOfStock(fromDate, toDate, limit = -1) {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");

    const query = "SELECT * FROM products WHERE stock_quantity < 1 LIMIT ?";
    db.all(query, [limit], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getReStocks(fromDate, toDate, limit = -1) {
  let date = new Date(fromDate);
  const from = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, 00:00:00 AM`;
  date = new Date(toDate);
  date.setDate(date.getDate() + 1);
  const to = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} 11:59:59 PM`;

  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");

    const query =
      "SELECT t.transaction_id, t.transaction_type, t.date_time, sl.items, sl.price,  p.name AS pname FROM transactions t" +
      " JOIN sales_log sl ON t.transaction_id = sl.transaction_id" +
      " JOIN products p ON sl.product_id = p.id " +
      " WHERE t.transaction_type = ? AND t.date_time >= ? AND t.date_time <= ? LIMIT  ?";
    db.all(query, ["restock", from, to, limit], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getSalesmenCommission(fromDate, toDate, limit = -1) {
  let date = new Date(fromDate);
  const from = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, 00:00:00 AM`;
  date = new Date(toDate);
  date.setDate(date.getDate() + 1);
  const to = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} 11:59:59 PM`;

  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");

    const query =
      "SELECT s.salesmen_id, s.name AS sname, p.commission, p.name, sl.items FROM salesmen s" +
      " JOIN transactions t ON t.salesmen_id = s.salesmen_id" +
      " JOIN sales_log sl ON sl.transaction_id = t.transaction_id" +
      " JOIN products p ON p.id = sl.product_id" +
      " WHERE t.transaction_type = ?";
    db.all(query, ["sale"], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getCustomers(fromDate, toDate, limit = -1) {
  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");

    const query = "SELECT * FROM customers LIMIT ?";
    db.all(query, [limit], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
}

function getCustomerPurchaseHistory(fromDate, toDate, limit = -1) {
  let date = new Date(fromDate);
  const from = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, 00:00:00 AM`;
  date = new Date(toDate);
  date.setDate(date.getDate() + 1);
  const to = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} 11:59:59 PM`;

  return new Promise((resolve, reject) => {
    db.run("PRAGMA key = 'Ma@7974561017';");

    const query = "SELECT * FROM customers LIMIT ?";
    db.all(query, [limit], (err, rows) => {
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
  getSales,
  getTopSellingProducts,
  // getSalesBySalesmen,
  getLowStocks,
  getOutOfStock,
  getReStocks,
  getSalesmenCommission,
  getCustomers,
};
