import { FaXmark } from "react-icons/fa6";

const ViewProduct = ({ product, setProduct }) => {
  return (
    <div className="modal-overlay">
      <div className="preview-box" style={{ position: "relative" }}>
        <span
          onClick={() => setProduct({ show: false })}
          style={{ position: "absolute", cursor: "pointer", color: "gray", right: "1rem", top: "0.15rem", fontSize: "2rem" }}
        >
          <FaXmark />
        </span>
        <h5>Product Info </h5>

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
