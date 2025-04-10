import { useState } from "react";

const Preview = ({ products, handleSubmit, setShowPreview }) => {
  const [personDetails, setPersonDetails] = useState({
    customerName: "",
    customerPhnNo: "",
    customerAddress: "",
    salesmenName: "",
    salesmenPhnNo: "",
    salesmenAddress: "",
  });
  const [discount, setDiscount] = useState(0);

  const handleChange = (e, values) => {
    setPersonDetails({ ...personDetails, [e.target.name]: e.target.value });
    // setErrors({ ...errors, [e.target.name]: "" });
    // if (e.target.name === "name") {
    // const personDetails = await window.api.product("getSuggestions", e.target.value);
    // setValues(personDetails);
    // autofill(e, personDetails);
    // }
  };

  let total = 0;
  for (let i = 0; i < products.length; i++) {
    total += products[i].items * products[i].sellingPrice;
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
        {/* customer details */}
        <div className="row">
          <div className="col-4">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="cutomerName"
                placeholder="name"
                onChange={handleChange}
                value={personDetails.customerName}
                name="customerName"
              />
              <label htmlFor="cutomerName">Customer name</label>
            </div>
          </div>
          <div className="col-4">
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                id="cutomerPhnNo"
                placeholder="phone number"
                onChange={handleChange}
                value={personDetails.customerPhnNo}
                name="customerPhnNo"
              />
              <label htmlFor="cutomerPhnNo">Phone No.</label>
            </div>
          </div>
          <div className="col-4">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="cutomerName"
                placeholder="Address"
                onChange={handleChange}
                value={personDetails.customerAddress}
                name="customerAddress"
              />
              <label htmlFor="cutomerAddress">Address</label>
            </div>
          </div>
          {/* <div className="col-6">
            <div className="form-floating">
              <input
                type="number"
                className="form-control"
                id="discount"
                placeholder="Password"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                name="discount"
              />
              <label htmlFor="discount">Discount(&#x20B9;)</label>
            </div>
          </div> */}
        </div>
        <div className="row">
          <div className="col-4">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="salesmenName"
                placeholder="name"
                onChange={handleChange}
                value={personDetails.salesmenName}
                name="salesmenName"
              />
              <label htmlFor="salesmenName">salesmen name</label>
            </div>
          </div>
          <div className="col-4">
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                id="salesmenPhnNo"
                placeholder="phone number"
                onChange={handleChange}
                value={personDetails.salesmenPhnNo}
                name="salesmenPhnNo"
              />
              <label htmlFor="salesmenPhnNo">Phone No.</label>
            </div>
          </div>
          <div className="col-4">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="salesmenName"
                placeholder="Address"
                onChange={handleChange}
                value={personDetails.salesmenAddress}
                name="salesmenAddress"
              />
              <label htmlFor="salesmenAddress">Address</label>
            </div>
          </div>
          {/* <div className="col-6">
            <div className="form-floating">
              <input
                type="number"
                className="form-control"
                id="discount"
                placeholder="Password"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                name="discount"
              />
              <label htmlFor="discount">Discount(&#x20B9;)</label>
            </div>
          </div> */}
        </div>

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
              console.log(personDetails);
              handleSubmit(e, personDetails, discount);
            }}
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
