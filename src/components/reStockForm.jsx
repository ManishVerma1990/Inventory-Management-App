import { useState } from "react";
import Alert from "./alert";
import Suggestions from "./suggestions";
import Preview2 from "./preview2";

function ReStockForm() {
  const [products, setProducts] = useState([
    {
      name: "",
      quantity: "",
      measuringUnit: "",
      items: "",
      sellingPrice: "",
      commission: "",
      stock_quantity: "",
      showSuggestions: false,
      showStock: false,
      type: "restock",
    },
  ]);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const sendFormData = async (personDetails, discount) => {
    setProducts([
      {
        name: "",
        quantity: "",
        measuringUnit: "",
        items: "",
        sellingPrice: "",
        commission: "",
        stock_quantity: "",
        showSuggestions: false,
        type: "restock",
      },
    ]);
    const updatedProducts = products.map((product) => ({
      ...product,
      items: Math.abs(Number(product.items)).toString(),
      price: Math.abs(Number(product.sellingPrice)).toString(),
    }));

    const result = await window.api.product("put", updatedProducts);
    setShowAlert(true);
    setAlert(result);
    setTimeout(() => setShowAlert(false), 3000);
    await window.api.logs("post", products, { type: "restock" });
  };

  const handleChange = async (index, e) => {
    const { name, value } = e.target;
    if (Number(value) < 0) return;

    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index
          ? {
              ...product,
              [name]: value,
            }
          : product
      )
    );

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    if (name === "name") {
      const data = await window.api.product("getSuggestions", value);
      setValues(data);

      setProducts((prevProducts) =>
        prevProducts.map((product, i) =>
          i === index
            ? {
                ...product,
                showSuggestions: value.trim() !== "" && data.length > 0, //true or false
              }
            : product
        )
      );
    }
  };

  const handleListClick = async (index, value) => {
    const data = await window.api.product("getOne", value.id);

    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index
          ? {
              ...product,
              id: data.id,
              name: data.name,
              quantity: data.product_quantity,
              measuringUnit: data.measuring_unit,
              items: 0,
              sellingPrice: data.selling_price,
              commission: data.commission,
              stock_quantity: data.stock_quantity,
              showSuggestions: false,
              showStock: true,
              type: "restock",
            }
          : product
      )
    );
  };

  const handleSubmit = (e, personDetails = {}, discount = 0) => {
    e.preventDefault();
    let newErrors = {};
    let hasStockError = false;

    products.forEach((product, index) => {
      if (!product.name.trim()) newErrors[`name-${index}`] = "Name is required";
      if (!String(product.quantity).trim()) newErrors[`quantity-${index}`] = "Quantity is required";
      if (!String(product.items).trim()) newErrors[`items-${index}`] = "Items is required";
      if (!String(product.sellingPrice).trim()) newErrors[`price-${index}`] = "Price is required";
      if (!String(product.commission).trim()) newErrors[`price-${index}`] = "Commission is required";
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!hasStockError) {
      sendFormData(personDetails, discount);
    }
  };

  const addProductField = () => {
    setProducts([
      ...products,
      {
        name: "",
        quantity: "",
        measuringUnit: "",
        items: "",
        sellingPrice: "",
        commission: "",
        stock_quantity: "",
        showSuggestions: false,
        showStock: false,
      },
    ]);
  };

  return (
    <div className="container pt-3">
      <div className="card shadow p-3">
        {showAlert ? <Alert alert={alert} showAlert={showAlert} /> : ""}
        {showPreview ? <Preview2 products={products} handleSubmit={handleSubmit} setShowPreview={setShowPreview} /> : ""}
        <form className={`needs-validation ${showPreview ? "blur-background" : ""}`} noValidate>
          {products.map((product, index) => (
            <div key={index}>
              <div className="row mb-3">
                <div className="col">
                  <div className="form-floating">
                    <input
                      onChange={(e) => handleChange(index, e)}
                      value={product.name}
                      type="text"
                      className={`form-control ${errors[`name-${index}`] ? "is-invalid" : product.name ? "is-valid" : ""}`}
                      id={`name-${index}`}
                      placeholder="Product Name"
                      name="name"
                      onBlur={() =>
                        setTimeout(() => {
                          setProducts((prevProducts) =>
                            prevProducts.map((product, i) => (i === index ? { ...product, showSuggestions: false } : product))
                          );
                        }, 300)
                      }
                      required
                    />
                    <label htmlFor={`name-${index}`}>Product name</label>
                    {product.showSuggestions && <Suggestions values={values} callback={(value) => handleListClick(index, value)} />}
                    {errors[`name-${index}`] && <div className="invalid-feedback">{errors[`name-${index}`]}</div>}
                  </div>
                </div>
                <div className="col">
                  <div className="row g-0">
                    <div className="col">
                      <div className="form-floating">
                        <input
                          onChange={(e) => handleChange(index, e)}
                          value={product.quantity}
                          type="number"
                          className={`form-control ${errors[`quantity-${index}`] ? "is-invalid" : product.quantity ? "is-valid" : ""}`}
                          id={`quantity-${index}`}
                          placeholder="Quantity"
                          name="quantity"
                          disabled
                          readOnly
                        />
                        <label htmlFor={`quantity-${index}`}>product quantity</label>
                        {errors[`quantity-${index}`] && <div className="invalid-feedback">{errors[`quantity-${index}`]}</div>}
                      </div>
                    </div>
                    <div className="col">
                      <select
                        onChange={(e) => handleChange(index, e)}
                        value={product.measuringUnit}
                        style={{ height: "3.6rem" }}
                        className={`form-select ${
                          errors[`measuringUnit-${index}`] ? "is-invalid" : product.measuringUnit ? "is-valid" : ""
                        }`}
                        name="measuringUnit"
                        disabled
                        readOnly
                      >
                        <option defaultValue={"measuringUnit"}>Unit</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">l</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pcs</option>
                      </select>
                      {errors[`measuringUnit-${index}`] && <div className="invalid-feedback">{errors[`measuringUnit-${index}`]}</div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <div className="form-floating">
                    <input
                      onChange={(e) => handleChange(index, e)}
                      value={product.items}
                      type="number"
                      min={"0"}
                      className={`form-control ${errors[`items-${index}`] ? "is-invalid" : product.items ? "is-valid" : ""}`}
                      id={`items-${index}`}
                      placeholder="No of Items"
                      name="items"
                      required
                    />
                    <label htmlFor={`items-${index}`}>Number of items</label>
                    {errors[`items-${index}`] && <div className="invalid-feedback">{errors[`items-${index}`]}</div>}
                  </div>
                </div>
                <div className="col">
                  <div className="input-group">
                    <span className="input-group-text" style={{ maxHeight: "3.6rem" }}>
                      &nbsp; &#x20B9; &nbsp;{" "}
                    </span>
                    <div className="form-floating">
                      <input
                        onChange={(e) => handleChange(index, e)}
                        value={product.sellingPrice}
                        type="number"
                        className={`form-control ${errors[`price-${index}`] ? "is-invalid" : product.price ? "is-valid" : ""}`}
                        id={`price-${index}`}
                        placeholder="Price"
                        name="sellingPrice"
                        required
                      />
                      <label htmlFor={`price-${index}`}>Selling price</label>
                      {errors[`price-${index}`] && <div className="invalid-feedback">{errors[`price-${index}`]}</div>}
                    </div>
                  </div>
                </div>
              </div>
              {product.showStock && (
                <div className="mb-3 row">
                  <span className="col">
                    Items in stock: <b>{product?.stock_quantity}</b>
                  </span>
                </div>
              )}
              {products.length > 1 && <hr />}
            </div>
          ))}
        </form>
        <div>
          <button type="button" className="btn btn-primary" onClick={addProductField}>
            Add More
          </button>
          <button
            type="button"
            className={`btn btn-outline-primary mx-2 ${products[0].quantity === "" ? "disabled" : ""}`}
            onClick={() => setShowPreview(true)}
          >
            Re-stock
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReStockForm;
