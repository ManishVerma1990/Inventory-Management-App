const styles1 = { border: "1px solid green" };
const styles2 = { border: "1px solid orange" };

function Transaction({ index, transaction }) {
  return (
    <>
      <div style={transaction.transaction_type === "restock" ? styles2 : styles1} className="card mb-3 p-2 shadow-sm">
        <div className="row">
          <div className="col">
            <strong>Customer:</strong> {transaction.customer_name}
          </div>
          <div className="col text-end">{transaction.date_time}</div>
        </div>
        <ul className="list-group list-group-flush">
          {transaction.sales.map((sale, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between">
              <span>
                {sale.product.name}({sale.product.product_quantity}
                {sale.product.measuring_unit}) &nbsp;&nbsp;&nbsp; X{sale.quantity}
              </span>
              <span>₹{sale.price}</span>
            </li>
          ))}
        </ul>
        <div className="row p-3">
          <div className="col">
            <strong>Total: </strong>
          </div>
          <div className="col text-end">
            <strong style={{ color: `${transaction.transaction_type === "restock" ? "darkred" : "green"}` }}>
              {transaction.transaction_type === "restock" ? "-" : "+"} ₹{transaction.total_price - transaction.discount}
            </strong>
          </div>
        </div>
      </div>
    </>
  );
}

export default Transaction;
