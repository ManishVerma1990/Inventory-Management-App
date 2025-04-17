const { app } = require("electron");
const path = require("path");
const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const dbPath = path.join(app.getPath("userData"), "inventory_encrypted.db");
const db = new sqlite3.Database(dbPath);

const createTable = () => {
  db.run("PRAGMA key = 'Ma@7974561017';");
  db.run(
    `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT DEFAULT 'none',
        category TEXT DEFAULT 'all',
        product_quantity INTEGER NOT NULL,
        measuring_unit TEXT NOT NULL,
        stock_quantity INTEGER NOT NULL,
        cost_price INTEGER NOT NULL,
        selling_price INTEGER NOT NULL ,
        commission INTEGER NOT NULL,
        min_stock INTEGER DEFAULT 20,
        created_at TEXT NOT NULL
      );`
  );
};
createTable();

// products -> id, name, description, category, product_quantity(1 unit), measuring_unit, stock_quantity, cost_price, selling_price, tax, created_at
const insertData = (product) => {
  createTable();
  return new Promise((resolve, reject) => {
    // Set encryption key for reading data
    db.run("PRAGMA key = 'Ma@7974561017';");
    const sql = `INSERT INTO products (name, description, category, product_quantity, measuring_unit, stock_quantity, cost_price, selling_price, commission, min_stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const date = new Date();
    db.run(
      sql,
      [
        product.name,
        product.description,
        product.category,
        product.quantity,
        product.measuringUnit,
        product.items,
        product.costPrice,
        product.sellingPrice,
        product.commission,
        product.minStock,
        date.toLocaleString(),
      ],
      function (err) {
        if (err) {
          reject({ success: false, message: "error inserting data: " + err.message });
        } else {
          resolve({ success: true, message: `Inserted product ${product.name} and stocked ${product.items} items`, id: this.lastID });
        }
      }
    );
  });
};

const update = {
  quantity: async ({ id }, quantity) => {
    return new Promise(async (resolve, reject) => {
      try {
        db.run("PRAGMA key = 'Ma@7974561017';");
        createTable();

        const sql = `UPDATE products SET stock_quantity = ? WHERE id = ?;`;
        let data = await fetchData(id);

        db.run(sql, [Number(quantity) + Number(data.stock_quantity), id], function (err) {
          if (err) {
            reject({ success: false, message: "Error updating product: " + err.message });
          } else if (this.changes === 0) {
            reject({ success: false, message: "No product updated" });
          } else {
            resolve({ success: true, message: `${data.name} restocked: ${quantity}` });
          }
        });
      } catch (error) {
        reject({ success: false, message: "Unexpected error: " + error.message });
      }
    });
  },

  // sold: async ({ id }, quantity) => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       db.run("PRAGMA key = 'Ma@7974561017';");
  //       createTable();

  //       const sql = `UPDATE products SET product_sold = ? WHERE id = ?;`;
  //       let data = await fetchData(id);

  //       db.run(sql, [Math.abs(Number(quantity)) + Number(data.product_sold), id], function (err) {
  //         if (err) {
  //           reject({ success: false, message: "Error selling product: " + err.message });
  //         } else if (this.changes === 0) {
  //           reject({ success: false, message: "No product sold" });
  //         } else {
  //           resolve({ success: true, message: "Product sold: " + data.name + ", Items: " + quantity });
  //         }
  //       });
  //     } catch (error) {
  //       reject({ success: false, message: "Unexpected error: " + error.message });
  //     }
  //   });
  // },

  // price: (data) => {
  //   // Set encryption key for reading data
  //   db.run("PRAGMA key = 'Ma@7974561017';");
  //   createTable();

  //   const sql = `UPDATE products SET quantity = ? WHERE name = ?;`;
  //   db.run(sql, [data.quantity, data.name], function (err) {
  //     if (err) {
  //       console.error("Error updating data:", err.message);
  //     } else if (this.changes === 0) {
  //       console.log("No product found with the given ID.");
  //     } else {
  //       console.log(`Updated product with name: ${data.name}`);
  //     }
  //   });
  // },
};

const fetchData = (id) => {
  return new Promise((resolve, reject) => {
    // Set encryption key for reading data
    db.run("PRAGMA key = 'Ma@7974561017';");
    createTable();

    db.all("SELECT * FROM products WHERE id = ? LIMIT 1", [id], (err, row) => {
      if (err) throw err;
      resolve(row[0]);
    });
  });
};

const fetchFilteredData = (value, limit = 8) => {
  return new Promise((resolve, reject) => {
    // Set encryption key for reading data
    db.run("PRAGMA key = 'Ma@7974561017';");
    createTable();

    const safeLimit = Number.isInteger(limit) ? limit : 8;
    const query = `SELECT id, name, product_quantity, measuring_unit FROM products WHERE name LIKE ? LIMIT ${safeLimit}`;

    db.all(query, [`%${value}%`], (err, rows) => {
      if (err) {
        reject(err); // Reject promise if error occurs
      } else {
        resolve(rows);
      }
    });
  });
};

const fetchAllData = (limit) => {
  return new Promise((resolve, reject) => {
    // Set encryption key for reading data
    db.run("PRAGMA key = 'Ma@7974561017';");
    db.all("SELECT * FROM products LIMIT ?", [limit], (err, rows) => {
      if (err) throw err;
      resolve(rows);
    });
    // });
  });
};

const productExists = (product) => {
  return new Promise((resolve, reject) => {
    createTable();
    const query = "SELECT id FROM products WHERE name = ? AND product_quantity = ? AND measuring_unit = ? LIMIT 1;";

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

module.exports = {
  createTable,
  insertData,
  fetchData,
  fetchFilteredData,
  fetchAllData,
  update,
  productExists,
};
