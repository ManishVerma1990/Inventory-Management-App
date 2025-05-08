import { useState } from "react";
import Suggestions from "./suggestions";
import { FaXmark } from "react-icons/fa6";
import jsPDF from "jspdf";

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
  const [showSalesmenSuggestions, setShowSalesmenSuggestions] = useState(false);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [values, setValues] = useState([]);

  const handleChange = async (e, values) => {
    setPersonDetails({ ...personDetails, [e.target.name]: e.target.value });
    // setErrors({ ...errors, [e.target.name]: "" });
    if (e.target.name === "salesmenName") {
      const data = await window.api.logs("getSalesmenSuggestions", e.target.value);
      setValues(data);
      autofill1(e, data);
    }
    if (e.target.name === "customerName") {
      const data = await window.api.logs("getCustomerSuggestions", e.target.value);
      setValues(data);
      autofill2(e, data);
    }
  };

  const autofill1 = (e, data) => {
    if (e.target.value.trim() === "" || !data.length) {
      setShowSalesmenSuggestions(false);
    } else {
      setShowSalesmenSuggestions(true);
    }
  };
  const handleListClick1 = async (value) => {
    setPersonDetails({
      ...personDetails,
      salesmenName: value.name,
    });
    setShowSalesmenSuggestions(false);
  };

  const autofill2 = (e, data) => {
    if (e.target.value.trim() === "" || !data.length) {
      setShowCustomerSuggestions(false);
    } else {
      setShowCustomerSuggestions(true);
    }
  };

  const handleListClick2 = async (value) => {
    setPersonDetails({
      ...personDetails,
      customerName: value.name,
      customerPhnNo: value.phn_no,
      customerAddress: value.address,
    });
    setShowCustomerSuggestions(false);
  };

  let total = 0;
  for (let i = 0; i < products.length; i++) {
    total += products[i].items * products[i].sellingPrice;
  }

  return (
    <div className="modal-overlay">
      <div className="preview-box" style={{ minWidth: "35rem", position: "relative" }}>
        <span
          onClick={() => setShowPreview(false)}
          style={{ position: "absolute", cursor: "pointer", color: "gray", right: "1rem", top: "0.15rem", fontSize: "2rem" }}
        >
          <FaXmark />
        </span>
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
              {showCustomerSuggestions ? <Suggestions values={values} callback={handleListClick2} /> : ""}
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
        </div>
        <div className="row">
          <div className="col">
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
              {showSalesmenSuggestions ? <Suggestions values={values} callback={handleListClick1} /> : ""}
            </div>
          </div>
        </div>

        <div className="row justify-content-md-center">
          <button
            className="col m-2 col-4 btn btn-success"
            onClick={(e) => {
              setShowPreview(false);
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
