const ViewProduct = ({ product, setProduct }) => {
  
  return (
    <div className="modal-overlay">
      <div className="preview-box" style={{ position: "relative" }}>
        <h5>Product Info </h5>
        <button
          type="button"
          className="btn-close close-btn"
          style={{ position: "absolute", top: "1.1rem", right: "1.1rem" }}
          aria-label="Close"
          onClick={() => {
            setProduct({ show: false });
          }}
        ></button>
        <hr />
        <div className="container mt-2" style={{ textAlign: "start", fontSize: "1.2rem" }}>
          <div className="row mb-2">
            <div className="col-6">
              <strong>Name: </strong>
              {product.data.name}
            </div>
            <div className="col-6">
              <strong>Quantity: </strong>
              {product.data.product_quantity} {product.data.measuring_unit}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col">
              <strong>Description: </strong>
              {product.data.description}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <strong>Category: </strong>
              {product.data.category}
            </div>
            <div className="col-6">
              <strong>InStock: </strong>
              {product.data.stock_quantity}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <strong>Price: </strong>
              {product.data.selling_price}
            </div>
            <div className="col-6">
              <strong>GST: </strong>
              {product.data.tax} %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
