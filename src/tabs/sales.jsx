import { useEffect, useState } from "react";
import Transaction from "../components/transaction";

function Sales() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      const result = await window.api.logs("get");
      setTransactions(result);
    };
    fetchTransactions();
  }, []);

  // Filter transactions based on the selected filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.transaction_type === filter; // Ensure `transaction.type` matches "sold" or "stocked"
  });

  return (
    <div className="container">
      {/* Filter buttons */}
      <div className="mb-3">
        <button style={{ backgroundColor: `${filter === "all" ? "gray" : ""}` }} onClick={() => setFilter("all")} className="btn mx-1">
          All
        </button>
        <button
          style={{ backgroundColor: `${filter === "sale" ? "gray" : ""}` }}
          onClick={() => setFilter("sale")}
          className="btn  mx-1"
        >
          Sold
        </button>
        <button
          style={{ backgroundColor: `${filter === "restock" ? "gray" : ""}` }}
          onClick={() => setFilter("restock")}
          className="btn mx-1"
        >
          Stocked
        </button>
      </div>

      {/* Render filtered transactions */}
      {filteredTransactions.map((transaction, index) => (
        <Transaction key={index} index={index} transaction={transaction} />
      ))}
    </div>
  );
}

export default Sales;
