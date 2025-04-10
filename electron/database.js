const { app, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const dbTest = require("./dbTest");
const productsModel = require("./models/productsModel");
const transactionModel = require("./models/transactionModel");
// const controller = require("./controller");
dbTest();

// Define database path
const dbPath = path.join(app.getPath("userData"), "inventory_encrypted.db");
const db = new sqlite3.Database(dbPath);

// Ensure data is in lowercase
function toLowerCaseObject(obj) {
  return obj && typeof obj === "object"
    ? Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, typeof value === "string" ? value.toLowerCase() : value]))
    : {};
}

// IPC Handler for "product"
ipcMain.handle("product", async (event, action, data = {}, salsemenData = {}) => {
  try {
    productsModel.createTable();
    let product = {};
    if (!Array.isArray(data)) {
      product = toLowerCaseObject(data);
    }

    switch (action) {
      //returns all rows, limit can also be given
      case "get":
        return await productsModel.fetchAllData();

      //filters rows on given input
      case "getSuggestions":
        return await productsModel.fetchFilteredData(data);

      // returns row by id
      case "getOne":
        return await productsModel.fetchData(data);

      // new product and restock
      case "post":
        const id = await productsModel.productExists(product);
        if (id) {
          // for restocking exiting product
          try {
            const result = await productsModel.update.quantity(id, product.items);
            const result2 = await transactionModel.insertData(product, { id: product.id, type: "restock", customerName: "restock" });
            if (result && result.success) {
              return result;
            } else {
              throw new Error("Failed to update quantity");
            }
          } catch (error) {
            return { success: false, msg: error.message };
          }
        } else {
          // for creating and stocking new product
          try {
            let result = await productsModel.insertData(product);
            const result2 = await transactionModel.insertData(product, {
              type: "restock",
              id: await result.id,
              customerId: "0",
              salesmenId: "0",
            });

            if (result && result.success) {
              return result;
            } else {
              throw new Error("Failed to insert product");
            }
          } catch (error) {
            console.log(error);
            return { success: false, msg: error.message };
          }
        }

      // used to update rows when product is sold
      case "put":
        let failedProducts = [];
        let successCount = 0;

        for (let i = 0; i < data.length; i++) {
          let product = toLowerCaseObject(data[i]);
          try {
            const id_ = await productsModel.productExists(product);
            if (!id_) {
              failedProducts.push({ name: product.name, msg: "Product not found" });
              continue;
            }

            const result1 = await productsModel.update.quantity(id_, product.items);

            if (result1?.success) {
              successCount++;
            } else {
              failedProducts.push({ name: product.name, message: "Failed to update product" });
            }
          } catch (error) {
            failedProducts.push({ name: product.name, message: error.message });
          }
        }

        if (failedProducts.length > 0) {
          return { success: false, message: `Some products failed: ${JSON.stringify(failedProducts)}` };
        } else {
          return { success: true, message: `${successCount} items sold successfully` };
        }
        break;
      default:
        throw new Error(`Invalid action: ${action}`);
    }
  } catch (error) {
    console.error("Error in 'product' handler:", error);
    return { success: false, error: error.message };
  }
});

// for transactions
ipcMain.handle("logs", async (event, action, data = {}, log) => {
  try {
    transactionModel.createTable();

    let product = {};
    if (!Array.isArray(data)) {
      product = toLowerCaseObject(data);
    }
    switch (action) {
      case "get":
        // returns transactions and sales associated with that, limit can be given
        const transactions = await transactionModel.fetchAllTransactions();
        const groupedTransactions = [];
        for (let i = 0; i < transactions.length; i++) {
          // if (transactions[i].transaction_type === "stocked") continue;
          const sales = await transactionModel.fetchLogsByTransacton(transactions[i].transaction_id);
          let groupedSales = [];
          for (let j = 0; j < sales.length; j++) {
            const product = await productsModel.fetchData(sales[j].product_id);
            groupedSales.push({ ...sales[j], product: product });
          }
          groupedTransactions.push({ ...transactions[i], sales: groupedSales });
        }
        return groupedTransactions;
        // Group logs by transaction_id
        break;

      //log transaction
      case "post":
        const result = await transactionModel.insertData(data, log);
        break;
      default:
        throw new Error(`Invalid action: ${action}`);
    }
  } catch (error) {
    console.error("Error in 'logs' handler:", error);
    return { success: false, error: error.message };
  }
});

module.exports = { db };
