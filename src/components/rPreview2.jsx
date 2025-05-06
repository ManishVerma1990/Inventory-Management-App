function RPreview2({ data = [], from, to }) {
  return (
    <>
      <div className="mb-3 ">
        Date: {from} to {to}{" "}
      </div>
      <div className="row py-3">
        {data.map((transaction, index) => {
          let totalPrice = 0;
          for (let i = 0; i < transaction.sales.length; i++) {
            totalPrice += transaction.sales[i].price;
          }
          return (
            <div key={index} className="col-lg-4 col-sm-6 mb-4 d-flex">
              <div className="card shadow py-2 px-3 text-start w-100 h-100" style={{ flex: 1, minHeight: "auto" }}>
                <h5 className="card-title">{transaction.cname}</h5>
                <span className="card-subtitle mb-2 text-body-secondary">{`${new Date(transaction.date_time).toLocaleString()}`}</span>
                <div className="card-body" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {transaction.sales.map((sale, idx) => (
                    <div key={idx} className="row">
                      <div className="col">{sale.pname}</div>
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
                    &#x20B9;<strong>{totalPrice}</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default RPreview2;
