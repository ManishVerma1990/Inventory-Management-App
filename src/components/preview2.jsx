function Preview2({ products, handleSubmit, setShowPreview }) {
  let total = 0;
  for (let i = 0; i < products.length; i++) {
    total += products[i].items * products[i].costPrice;
  }
  return (
    <div className="modal-overlay">
      <div className="preview-box">
        <h5>Preview</h5>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Items</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {product.name} ({(product.quantity, product.measuringUnit)})
                  </td>
                  <td>{product.items}</td>
                  <td>{product.sellingPrice * product.items}</td>
                </tr>
              ))}
            <tr>
              <th scope="row">Total</th>
              <td></td>
              <td></td>
              <th>{total}</th>
            </tr>
          </tbody>
        </table>
        <div className="row justify-content-md-center">
          <button
            className="col m-2 col-4 btn btn-warning"
            onClick={() => {
              setShowPreview(false);
            }}
          >
            Edit
          </button>
          <button
            className="col m-2 col-4 btn btn-success"
            onClick={(e) => {
              setShowPreview(false);
              handleSubmit(e);
            }}
          >
            Re-stock
          </button>
        </div>
      </div>
    </div>
  );
}
export default Preview2;
