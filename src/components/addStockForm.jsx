import { useEffect, useState } from "react";
import Suggestions from "./suggestions";
import Alert from "./alert";

function AddStockForm() {
  const initialFormData = {
    name: "",
    quantity: "",
    measuringUnit: "",
    description: "",
    category: "",
    items: "",
    costPrice: "",
    sellingPrice: "",
    commission: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({});

  const sendFormData = async () => {
    setFormData(initialFormData);
    const result = await window.api.product("post", formData);
    setShowAlert(true);
    setAlert(result);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const autofill = (e, data) => {
    if (e.target.value.trim() === "" || !data.length) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  };

  const handleChange = async (e, data) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    if (e.target.name === "name") {
      const data = await window.api.product("getSuggestions", e.target.value);
      setValues(data);
      autofill(e, data);
    }
  };
  const handleListClick = async (value) => {
    const data = await window.api.product("getOne", value.id);
    setFormData({
      ...formData,
      id: data.id,
      name: data.name,
      quantity: data.product_quantity,
      measuringUnit: data.measuring_unit,
      description: data.description,
      category: data.category,
      items: 0,
      costPrice: data.cost_price,
      sellingPrice: data.selling_price,
      commission: data.commission,
    });
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!String(formData.quantity).trim()) newErrors.quantity = "Quantity is required";
    if (!formData.measuringUnit.trim()) newErrors.measuringUnit = "unit is required";
    if (!String(formData.items).trim()) newErrors.items = "Items is required";
    if (!String(formData.costPrice).trim()) newErrors.costPrice = "Cost price is required";
    if (!String(formData.sellingPrice).trim()) newErrors.sellingPrice = "selling price is required";
    if (!String(formData.commission).trim()) newErrors.tax = "Commission is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    sendFormData();
  };

  return (
    <div className="contianer px-5 pt-3">
      {showAlert ? <Alert alert={alert} showAlert={showAlert} /> : ""}
      <form className="needs-validation " noValidate>
        <div className="row mb-3">
          <div className="col ">
            <div className="form-floating" style={{ position: "relative" }}>
              <input
                onChange={(e) => handleChange(e, values)}
                value={formData.name}
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : formData.name ? "is-valid" : ""}`}
                id="name"
                placeholder="product name"
                name="name"
                onBlur={() =>
                  setTimeout(() => {
                    setShowSuggestions(false);
                  }, 300)
                }
              />
              <label htmlFor="name">Name</label>
              {showSuggestions ? <Suggestions values={values} callback={handleListClick} /> : ""}
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
          </div>
          <div className="col">
            <div className="row g-0">
              <div className="col">
                <div className="form-floating">
                  <input
                    onChange={handleChange}
                    value={formData.quantity}
                    type="number"
                    className={`form-control ${errors.quantity ? "is-invalid" : formData.quantity ? "is-valid" : ""}`}
                    id="quantity"
                    placeholder="quantity of 1 item"
                    name="quantity"
                  />
                  <label htmlFor="quantity">quantity</label>
                  {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                </div>
              </div>
              <div className="col">
                <select
                  onChange={handleChange}
                  value={formData.measuringUnit}
                  style={{ height: "3.6rem" }}
                  className={`form-select form-select ${
                    errors.measuringUnit ? "is-invalid" : formData.measuringUnit ? "is-valid" : ""
                  }`}
                  aria-label="Default select example"
                  name="measuringUnit"
                >
                  <option defaultValue={"measuringUnit"}>unit</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="l">l</option>
                  <option value="ml">ml</option>
                  <option value="cs">pcs</option>
                </select>
                {errors.measuringUnit && <div className="invalid-feedback">{errors.unit}</div>}
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <div className="form-floating">
              <textarea
                onChange={handleChange}
                value={formData.description}
                className="form-control"
                placeholder="description"
                id="description"
                name="description"
              ></textarea>
              <label htmlFor="description">Description</label>
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <input
                onChange={handleChange}
                value={formData.category}
                type="text"
                className="form-control"
                id="category"
                placeholder="category"
                name="category"
              />
              <label htmlFor="category">category</label>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <div className="form-floating">
              <input
                onChange={handleChange}
                value={formData.items}
                type="number"
                className={`form-control ${errors.items ? "is-invalid" : formData.items ? "is-valid" : ""}`}
                id="items"
                placeholder="items to be added"
                name="items"
              />
              <label htmlFor="items">items</label>
              {errors.items && <div className="invalid-feedback">{errors.items}</div>}
            </div>
          </div>
          <div className="col">
            <div className="input-group">
              <div className=" col ">
                <select
                  onChange={handleChange}
                  value={formData.commission}
                  style={{ height: "3.6rem" }}
                  className={`form-select form-select ${errors.commission ? "is-invalid" : formData.commission ? "is-valid" : ""}`}
                  aria-label="Default select example"
                  name="commission"
                >
                  <option defaultValue={"commission"}>gst</option>
                  <option value="18">18</option>
                  <option value="12">12</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
                {errors.commission && <div className="invalid-feedback">{errors.commission}</div>}
              </div>
              <span className="input-group-text" style={{ maxHeight: "3.6rem" }}>
                &nbsp; % &nbsp;{" "}
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="input-group">
              <span className="input-group-text" style={{ maxHeight: "3.6rem" }}>
                &nbsp; &#x20B9; &nbsp;{" "}
              </span>
              <div className="form-floating ">
                <input
                  onChange={handleChange}
                  value={formData.costPrice}
                  type="number"
                  className={`form-control ${errors.costPrice ? "is-invalid" : formData.costPrice ? "is-valid" : ""}`}
                  id="costPrice"
                  placeholder="costPrice"
                  name="costPrice"
                />
                <label htmlFor="costPrice">cost price</label>
                {errors.costPrice && <div className="invalid-feedback">{errors.costPrice}</div>}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="input-group">
              <span className="input-group-text" style={{ maxHeight: "3.6rem" }}>
                &nbsp; &#x20B9; &nbsp;{" "}
              </span>
              <div className="form-floating ">
                <input
                  onChange={handleChange}
                  value={formData.sellingPrice}
                  type="number"
                  className={`form-control ${errors.sellingPrice ? "is-invalid" : formData.sellingPrice ? "is-valid" : ""}`}
                  id="sellingPrice"
                  placeholder="sellingPrice"
                  name="sellingPrice"
                />
                <label htmlFor="sellingPrice">selling price</label>
                {errors.sellingPrice && <div className="invalid-feedback">{errors.sellingPrice}</div>}
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="mt-3">
        <button onClick={handleSubmit} className="btn btn-primary ">
          Add stock
        </button>
      </div>
    </div>
  );
}
export default AddStockForm;
// products -> id, name,description, category, product_quantity(1 unit), stock_quantity, price, created_at, updated_at
