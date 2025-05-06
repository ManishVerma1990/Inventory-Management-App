import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function SmSales() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const result = await window.api.logs("get", 6);
      setTransactions(result || 0);
    };
    fetchTransactions();
  }, []);

  let totalPrices = [];
  for (let j = 0; j < transactions.length; j++) {
    const sales = transactions[j].sales;
    let totalPrice = 0;
    for (let i = 0; i < sales.length; i++) {
      totalPrice += sales[i].price;
    }
    totalPrices.push(totalPrice);
  }
  return (
    <>
      <div className="card shadow text-start px-3">
        <div style={{ cursor: "pointer" }}>
          <NavLink to={"/sales"} style={{ all: "unset" }}>
            <h5 className="card-title d-flex pt-2 pb-2" style={{ marginBottom: "0" }}>
              Sales <span className="ms-auto more-btn">more {">"}</span>
            </h5>
          </NavLink>
        </div>
        <div className="row">
          {transactions.map((transaction, index) => (
            <div key={index} className="col-lg-4 col-sm-6 mb-4 d-flex">
              <div className="card p-2 text-start w-100 h-100">
                <h5 className="card-title">{transaction?.customer?.name ? transaction.customer.name : "Restock"}</h5>
                <span className="card-subtitle mb-2 text-body-secondary">{`${new Date(transaction.date_time).toLocaleString()}`}</span>
                <div className="card-body" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {transaction.sales.map((sale, idx) => (
                    <div key={idx} className="row">
                      <div className="col">
                        {sale.product.name} ({sale.product.product_quantity}
                        {sale.product.measuring_unit})
                      </div>
                      <div className="col">x{sale.items}</div>
                      <div className="col">&#x20B9;{sale.price}</div>
                    </div>
                  ))}
                </div>
                <div className="row mt-2 px-2">
                  <div className="col">
                    <strong>Total:</strong>
                  </div>
                  <div className="col"></div>
                  <div className="col text-success">
                    &#x20B9;<strong>{totalPrices[index]}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SmSales;

// {
//   "transaction_id": "97ce2d10-3590-4a04-8e0a-c1bbcff9c183",
//   "transaction_type": "sale",
//   "customer_id": "70a3f90f-fb7b-4a78-9e63-58e78830bd86",
//   "salesmen_id": "ce0679ce-ae8c-4c0d-b03c-c496b6b0278a",
//   "discount": 0,
//   "date_time": "4/16/2025, 12:05:15 AM",
//   "sales": [
//       {
//           "sale_id": 4,
//           "transaction_id": "97ce2d10-3590-4a04-8e0a-c1bbcff9c183",
//           "product_id": 1,
//           "items": 1,
//           "price": 0,
//           "product": {
//               "id": 1,
//               "name": "p",
//               "description": "",
//               "category": "",
//               "product_quantity": 1,
//               "measuring_unit": "kg",
//               "stock_quantity": 91,
//               "cost_price": 111,
//               "selling_price": 1111,
//               "commission": 11,
//               "min_stock": 11,
//               "created_at": "4/15/2025, 7:38:54 PM"
//           }
//       },
//       {
//           "sale_id": 5,
//           "transaction_id": "97ce2d10-3590-4a04-8e0a-c1bbcff9c183",
//           "product_id": 1,
//           "items": 2,
//           "price": 1111,
//           "product": {
//               "id": 1,
//               "name": "p",
//               "description": "",
//               "category": "",
//               "product_quantity": 1,
//               "measuring_unit": "kg",
//               "stock_quantity": 91,
//               "cost_price": 111,
//               "selling_price": 1111,
//               "commission": 11,
//               "min_stock": 11,
//               "created_at": "4/15/2025, 7:38:54 PM"
//           }
//       },
//       {
//           "sale_id": 6,
//           "transaction_id": "97ce2d10-3590-4a04-8e0a-c1bbcff9c183",
//           "product_id": 1,
//           "items": 5,
//           "price": 1111,
//           "product": {
//               "id": 1,
//               "name": "p",
//               "description": "",
//               "category": "",
//               "product_quantity": 1,
//               "measuring_unit": "kg",
//               "stock_quantity": 91,
//               "cost_price": 111,
//               "selling_price": 1111,
//               "commission": 11,
//               "min_stock": 11,
//               "created_at": "4/15/2025, 7:38:54 PM"
//           }
//       }
//   ],
//   "customer": {
//       "customer_id": "70a3f90f-fb7b-4a78-9e63-58e78830bd86",
//       "name": "cust",
//       "phn_no": 113,
//       "address": "nnn"
//   },
//   "salesmen": [
//       {
//           "salesmen_id": "ce0679ce-ae8c-4c0d-b03c-c496b6b0278a",
//           "name": "s",
//           "phn_no": 1,
//           "address": "1"
//       }
//   ]
// }
