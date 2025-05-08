import { useState } from "react";
import ReportPreview from "./reportPreview";

function ReportForm() {
  const getThisDate = (today = new Date()) => {
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");
    const day = `${today.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({ type: "Sales", subType: "sales", from: getThisDate(), to: getThisDate() });
  const [errors, setErrors] = useState({});
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [reportResult, setReportResult] = useState([]);
  const [previewType, setPreviewType] = useState({ type: "1", name: "Top Selling Products" });

  const reportTypes = ["Sales", "Profit/Loss", "Stocks", "Salesmen", "Customer"];
  const getReportSubTypes = (value = formData.type) => {
    let subTypes = [];
    switch (value) {
      case "Sales":
        subTypes = ["sales", "top selling products", "salesmen wise"];
        break;
      case "Profit/Loss":
        subTypes = ["profit/loss" /* "product wise" */, , "salesmen wise"];
        break;
      case "Stocks":
        subTypes = ["summary", "low stocks", "out of stock", "reStocks"];
        break;
      case "Salesmen":
        subTypes = ["details", "commission" /* "daily sales" */];
        break;
      case "Customer":
        subTypes = ["details", "purchase history" /* "best customers", "frequent customers" */];
        break;
      default:
        subTypes = ["sales", "top selling products", "type3"];
    }
    return subTypes;
  };
  const reportSubTypes = getReportSubTypes();

  const handleChange = (e) => {
    if (e.target.name === "type") {
      setFormData({ ...formData, [e.target.name]: e.target.value, subType: getReportSubTypes(e.target.value)[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const sendFormData = async () => {
    const myObj = { type: formData.type, subType: formData.subType };

    let result;
    switch (myObj.type) {
      case "Sales":
        if (myObj.subType === "sales") {
          result = await window.api.fetch("getSales", { from: formData.from, to: formData.to });
          setPreviewType({ type: "2", name: "Products Sold" });
        } else if (myObj.subType === "top selling products") {
          result = await window.api.fetch("getTopSellingProducts", { from: formData.from, to: formData.to });
          setPreviewType({ type: "1", name: "Top Selling Products" });
        } else if (myObj.subType === "salesmen wise") {
          result = await window.api.fetch("getSalesBySalesmen", { from: formData.from, to: formData.to });
          setPreviewType({ type: "3", name: "Sales by Salesmen" });
        } else {
          console.log("Object does not match");
        }
        break;

      case "Profit/Loss":
        if (myObj.subType === "salesmen wise") {
          result = await window.api.fetch("getSalesBySalesmen", { from: formData.from, to: formData.to });
          setPreviewType({ type: "3", name: "Sales by Salesmen" });
        } else if (myObj.subType === "profit/loss") {
          result = await window.api.fetch("getProfitLoss", { from: formData.from, to: formData.to });
          setPreviewType({ type: "PL1", name: "Profit/Loss" });
        } else if (myObj.subType === "product wise") {
          result = await window.api.fetch("getProfitLossByProduct", { from: formData.from, to: formData.to });
        } else {
          console.log("Object does not match");
        }
        break;

      case "Stocks":
        if (myObj.subType === "summary") {
          result = await window.api.fetch("getStocks", { from: formData.from, to: formData.to });
          setPreviewType({ type: "1", name: "Stocks" });
        } else if (myObj.subType === "low stocks") {
          result = await window.api.fetch("getLowStocks", { from: formData.from, to: formData.to });
          setPreviewType({ type: "1", name: "Low Stocks" });
        } else if (myObj.subType === "out of stock") {
          result = await window.api.fetch("getOutOfStock", { from: formData.from, to: formData.to });
          setPreviewType({ type: "1", name: "Out of Stock" });
        } else if (myObj.subType === "reStocks") {
          result = await window.api.fetch("getReStocks", { from: formData.from, to: formData.to });
          setPreviewType({ type: "2", name: "Re-Stocks" });
        } else {
          console.log("Object does not match");
        }
        break;

      case "Salesmen":
        if (myObj.subType === "details") {
          result = await window.api.fetch("getSalesmen", { from: formData.from, to: formData.to });
          setPreviewType({ type: "1", name: "Salesmen" });
        } else if (myObj.subType === "commission") {
          result = await window.api.fetch("getSalesmenCommission", { from: formData.from, to: formData.to });
          setPreviewType({ type: "1", name: "Salesmen Commission" });
        } else if (myObj.subType === "daily sales") {
          result = await window.api.fetch("getDailySalesBySalesmen", { from: formData.from, to: formData.to });
        } else {
          console.log("Object does not match");
        }
        break;

      case "Customer":
        if (myObj.subType === "details") {
          result = await window.api.fetch("getCustomers", { from: formData.from, to: formData.to });
          setPreviewType({ type: "1", name: "Customers" });
        } else if (myObj.subType === "purchase history") {
          result = await window.api.fetch("getPurchaseHistory", { from: formData.from, to: formData.to });
          setPreviewType({ type: "3", name: "Customers Purchase History" });
        } else if (myObj.subType === "best customers") {
          result = await window.api.fetch("getBestCustomers", { from: formData.from, to: formData.to });
        } else if (myObj.subType === "frequent customers") {
          result = await window.api.fetch("getFrequentCustomers", { from: formData.from, to: formData.to });
        } else {
          console.log("Object does not match");
        }
        break;

      default:
    }
    setShowReportPreview(true);
    setReportResult(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.type.trim()) newErrors.type = "Type is required";
    if (!formData.subType.trim()) newErrors.subType = "SubTyoe is required";
    if (!formData.from.trim()) newErrors.from = "From is required";
    if (!formData.to.trim()) newErrors.to = "To is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    sendFormData();
  };

  const handleDateChange = (e, timeLine) => {
    const today = new Date();
    let formatted, from, to;
    switch (timeLine) {
      case "today":
        formatted = today.toISOString().split("T")[0];
        setFormData({ ...formData, from: formatted, to: formatted });
        break;
      case "month":
        from = new Date(today.getFullYear(), today.getMonth(), 2).toISOString().split("T")[0];
        to = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split("T")[0];
        setFormData({ ...formData, from: from, to: to });
        break;
      case "year":
        from = new Date(today.getFullYear(), 0, 2).toISOString().split("T")[0];
        to = new Date(today.getFullYear() + 1, 0, 1).toISOString().split("T")[0];

        setFormData({ ...formData, from: from, to: to });
        break;
    }
  };

  return (
    <>
      {showReportPreview ? (
        <ReportPreview
          previewType={previewType}
          data={reportResult}
          from={formData.from}
          to={formData.to}
          setShowReportPreview={setShowReportPreview}
        />
      ) : (
        ""
      )}
      <div className={`container card shadow ${showReportPreview ? "blur-background" : ""}`}>
        <form className="needs-validation" noValidate>
          <div className="row my-3 ">
            <h5>create report</h5>
          </div>
          <div className="row mb-3 ">
            <div className="col">
              <div className="form-floating" style={{ position: "relative" }}>
                <select
                  onChange={handleChange}
                  value={formData.type}
                  style={{ height: "3.6rem" }}
                  className={`form-select form-select ${errors.type ? "is-invalid" : formData.type ? "is-valid" : ""}`}
                  aria-label="Default select example"
                  name="type"
                  required
                >
                  {reportTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && <div className="invalid-feedback">{errors.type}</div>}
              </div>
            </div>
            <div className="col">
              <div className="form-floating" style={{ position: "relative" }}>
                <select
                  onChange={handleChange}
                  value={formData.subType}
                  style={{ height: "3.6rem" }}
                  className={`form-select form-select ${errors.subType ? "is-invalid" : formData.subType ? "is-valid" : ""}`}
                  aria-label="Default select example"
                  name="subType"
                  required
                >
                  {reportSubTypes.map((subType, index) => (
                    <option key={index} value={subType}>
                      {subType}
                    </option>
                  ))}
                </select>
                {errors.subType && <div className="invalid-feedback">{errors.subType}</div>}
              </div>
            </div>
          </div>
          <div className="row mb-1">
            <div className="col">
              <div className="form-floating" style={{ position: "relative" }}>
                <input
                  onChange={handleChange}
                  value={formData.from}
                  type="date"
                  className={`form-control ${errors.from ? "is-invalid" : formData.from ? "is-valid" : ""}`}
                  id="from"
                  placeholder="product from"
                  name="from"
                  required
                />
                <label htmlFor="from">from</label>
                {errors.from && <div className="invalid-feedback">{errors.from}</div>}
              </div>
            </div>
            <div className="col">
              <div className="form-floating" style={{ position: "relative" }}>
                <input
                  onChange={handleChange}
                  value={formData.to}
                  type="date"
                  className={`form-control ${errors.to ? "is-invalid" : formData.to ? "is-valid" : ""}`}
                  id="to"
                  placeholder="product to"
                  name="to"
                  required
                />
                <label htmlFor="to">to</label>
                {errors.to && <div className="invalid-feedback">{errors.to}</div>}
              </div>
            </div>
          </div>
        </form>
        <div>
          <button
            className="btn"
            onClick={(e) => {
              handleDateChange(e, "today");
            }}
          >
            This day
          </button>
          <button
            className="btn"
            onClick={(e) => {
              handleDateChange(e, "month");
            }}
          >
            This month
          </button>
          <button
            className="btn"
            onClick={(e) => {
              handleDateChange(e, "year");
            }}
          >
            This year
          </button>
        </div>
        <div className="row mb-3 d-flex justify-content-end">
          <button onClick={handleSubmit} className="btn btn-primary me-4" style={{ width: "100px" }}>
            create
          </button>
        </div>
      </div>
    </>
  );
}

export default ReportForm;
