import { useState } from "react";
import Alert from "./alert";
import Suggestions from "./suggestions";
import Preview from "./preview";
import jsPDF from "jspdf";
import { FaXmark } from "react-icons/fa6";

function SellProductForm() {
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
    },
  ]);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const sendFormData = async (personDetails, discount) => {
    const updatedProducts = products.map((product) => ({
      ...product,
      items: (-Math.abs(Number(product.items))).toString(), // Convert items to negative
    }));
    const result = await window.api.product("put", updatedProducts, personDetails.salesmenName /* sending this to check if exists */);

    if (result.success) {
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
        },
      ]);
      await window.api.logs("post", products, { type: "sale", personDetails: personDetails, discount: discount });
    }

    setShowAlert(true);
    setAlert(result);
    setTimeout(() => setShowAlert(false), 3000);
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
            }
          : product
      )
    );
  };

  const generatePDF = (products, personDetails) => {
    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(20);
    let text = "KHETI KISANI";
    const pageWidth = doc.internal.pageSize.getWidth();
    let textWidth = doc.getTextWidth(text);
    let x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
    y += 5;

    doc.setFontSize(12);
    doc.setFont("helvetica", "thin");
    text = "Address, of the, Shop";
    textWidth = doc.getTextWidth(text);
    x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Bill Date: ${new Date().toLocaleString()}`, 10, y);
    y += 5;
    doc.text(`Customer name: ${personDetails.customerName}`, 10, y);
    y += 5;
    doc.text(`Phone no: ${personDetails.customerPhnNo}`, 10, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Name", 10, y);
    doc.text("Qty", 60, y);
    doc.text("Price", 100, y);
    doc.text("Total", 140, y);
    y += 5;

    doc.setFont("helvetica", "normal");

    let grandTotal = 0;
    products.forEach((item) => {
      const total = item.items * item.sellingPrice;
      grandTotal += total;

      doc.text(`${item.name} (${item.quantity.toString()} ${item.measuringUnit})`, 10, y);
      doc.text(item.items.toString(), 60, y);
      doc.text(`${item.sellingPrice}`, 100, y);
      doc.text(`${total}`, 140, y);
      y += 8;
    });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: ₹${grandTotal}`, 100, y);

    doc.save("receipt.pdf");
  };

  const stockError = (products) => {
    for (let product of products) {
      if (Number(product.items) > Number(product.stock_quantity)) {
        setAlert({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock_quantity}, Requested: ${product.items}`,
        });
        setShowAlert(true);
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (e, personDetails = {}, discount = 0) => {
    e.preventDefault();
    let newErrors = {};
    let hasStockError = false;

    products.forEach((product, index) => {
      if (!product.name.trim()) newErrors[`name-${index}`] = "Name is required";
      if (!String(product.quantity).trim()) newErrors[`quantity-${index}`] = "Quantity is required";
      if (!String(product.items).trim()) newErrors[`items-${index}`] = "Items is required";
      if (!String(product.sellingPrice).trim()) newErrors[`price-${index}`] = "Price is required";
      if (!String(product.commission).trim()) newErrors[`price-${index}`] = "Commission is required";

      // Check if stock is less than requested items
      hasStockError = stockError(products);
      console.log(hasStockError);
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!hasStockError) {
      sendFormData(personDetails, discount);
      // generatePDF(products, personDetails);
      await window.api.generateReceipt(products);
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

  const removeProduct = (index) => {
    if (products.length <= 1) {
      return;
    } // Prevent removing the last product
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      Object.keys(newErrors).forEach((key) => {
        if (
          key.startsWith(`name-${index}`) ||
          key.startsWith(`quantity-${index}`) ||
          key.startsWith(`items-${index}`) ||
          key.startsWith(`price-${index}`)
        ) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  return (
    <div className="container  pt-3">
      <div className="card shadow p-3">
        {showAlert ? <Alert alert={alert} showAlert={showAlert} /> : ""}
        {showPreview ? <Preview products={products} handleSubmit={handleSubmit} setShowPreview={setShowPreview} /> : ""}
        <form className={`needs-validation ${showPreview ? "blur-background" : ""}`} noValidate>
          {products.map((product, index) => (
            <div key={index} style={{ position: "relative" }} className="pt-3">
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  color: "gray",
                  right: "-0.25rem",
                  top: "-1.75rem",
                  fontSize: "2rem",
                }}
                onClick={() => removeProduct(index)}
              >
                <FaXmark />
              </span>

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
                        <label htmlFor={`quantity-${index}`}>Product quantity</label>
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
                      className={`form-control ${errors[`items-${index}`] ? "is-invalid" : product.items ? "is-valid" : ""}`}
                      id={`items-${index}`}
                      placeholder="No of Items"
                      name="items"
                      min="0"
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
                        name="price"
                        required
                        disabled
                        readOnly
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
            onClick={() => {
              if (stockError(products)) return;
              setShowPreview(true);
            }}
          >
            Sell Items
          </button>
        </div>
      </div>
    </div>
  );
}

export default SellProductForm;
