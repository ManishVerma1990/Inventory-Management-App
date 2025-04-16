import { useState } from "react";
import { FaXmark } from "react-icons/fa6";

function Return({ transaction, setShowReturn, forceRerender }) {
  const [inputs, setInputs] = useState(
    transaction.sales.map((sale) => ({ id: sale.sale_id, prevItems: sale.items, items: 0, priceOfOne: sale.product.selling_price }))
  );

  const handleSubmit = async () => {
    for (let input of inputs) {
      for (let sale of transaction.sales) {
        if (input.id === sale.sale_id && input.items > sale.items) {
          console.log(input.id);
          return;
        }
      }
    }
    await window.api.logs("updateSales", inputs);
    setShowReturn(false);
    forceRerender();
  };

  let totalPrice = 0;
  for (let i = 0; i < transaction.sales.length; i++) {
    totalPrice += transaction.sales[i].price * transaction.sales[i].items;
  }
  return (
    <div className="modal-overlay">
      <div className="preview-box" style={{ minWidth: "35rem", position: "relative" }}>
        <span
          onClick={() => setShowReturn(false)}
          style={{ position: "absolute", cursor: "pointer", color: "gray", right: "1rem", top: "0.15rem", fontSize: "2rem" }}
        >
          <FaXmark />
        </span>
        <h5>Return</h5>

        <div className="px-3">
          <div className="row ">
            <div className="col text-start">
              <strong>Customer:</strong> {transaction.customer.name}
            </div>
            <div className="col text-end">{transaction.date_time}</div>
          </div>
          <hr />

          <div className="row text-start" style={{ fontWeight: "bold" }}>
            <div className="col-4">Name</div>
            <div className="col-2">Items</div>
            <div className="col-3">Price</div>
            <div className="col-3">Return</div>
          </div>

          <ul className="list-group list-group-flush">
            {transaction.sales.map((sale, index) => (
              <div key={index}>
                <div className="row text-start " style={{ alignItems: "center" }}>
                  <div className="col-4">
                    {sale.product.name}({sale.product.product_quantity}
                    {sale.product.measuring_unit})
                  </div>
                  <div className="col-2">X{sale.items}</div>
                  <div className="col-3">₹{sale.price}</div>
                  <div className="col-3">
                    <input
                      onChange={(e) => {
                        const newInputs = [...inputs];
                        newInputs[index].items = e.target.value;
                        setInputs(newInputs);
                      }}
                      value={inputs[index].items}
                      type="number"
                      className="form-control"
                      name={`returnItem${index}`}
                    />
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </ul>

          <div className="row">
            <div className="col">
              <strong>Total: </strong>
            </div>
            <div className="col text-end">
              <strong style={{ color: `${transaction.transaction_type === "restock" ? "darkred" : "green"}` }}>
                {transaction.transaction_type === "restock" ? "-" : "+"} ₹{totalPrice}
              </strong>
            </div>
          </div>
        </div>
        <button className="col m-2 col-4 btn btn-success" onClick={handleSubmit}>
          Return
        </button>
      </div>
    </div>
  );
}

export default Return;
