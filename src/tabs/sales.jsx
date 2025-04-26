import { useEffect, useState } from "react";
import Transaction from "../components/transaction";
import Return from "../components/return";

function Sales({ type = "all" }) {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState(type);
  const [showReturn, setShowReturn] = useState(false);
  const [key, setKey] = useState(0);
  const [currentTransaction, setCurrentTransaction] = useState({});

  const forceRerender = () => {
    console.log("force rerender");
    setKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const result = await window.api.logs("get", 10000000);
      setTransactions(result);
    };
    fetchTransactions();
  }, [key]);

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
      {showReturn ? <Return transaction={currentTransaction} setShowReturn={setShowReturn} forceRerender={forceRerender} /> : ""}
      <div className="row py-3">
        {filteredTransactions.map((transaction, index) => (
          <Transaction
            key={index}
            index={index}
            transaction={transaction}
            setShowReturn={setShowReturn}
            setCurrentTransaction={setCurrentTransaction}
          />
        ))}
      </div>
    </div>
  );
}

export default Sales;
