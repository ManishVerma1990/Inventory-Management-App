function ProfitLossPreview({ data = [], from, to }) {
  let totalCostPrice = 0;
  let totalSellingPrice = 0;
  for (let item of data) {
    totalCostPrice += item.totalCostPrice;
    totalSellingPrice += item.totalSellingPrice;
  }
  return (
    <>
      <div className="mb-3 ">
        Date: {from} to {to}{" "}
      </div>
      <div className="row py-3">
        <div className="col">
          Total Revenue: <strong>&#8377;{totalSellingPrice}</strong>
        </div>
        <div className="col">
          Total Profit: <strong>&#8377;{totalSellingPrice - totalCostPrice}</strong>
        </div>
      </div>
      <div className="row">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Margin</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.name} ({item.productQuantity}
                  {item.measuringUnit})
                </td>
                <td>{item.totalItems}</td>
                <td>{item.costPrice} </td>
                <td>{item.sellingPrice}</td>
                <td>{item.sellingPrice - item.costPrice}</td>
                <td>{item.totalSellingPrice - item.totalCostPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ProfitLossPreview;
