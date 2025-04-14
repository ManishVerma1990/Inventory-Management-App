import { useState } from "react";
import Alert from "./alert";
import { useAsyncError } from "react-router-dom";

function NewSalesmen() {
  const [name, setName] = useState("");
  const [phnNo, setPhnNo] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({});

  const handleChange = (e) => {
    switch (e.target.name) {
      case "name":
        setName(e.target.value);
        break;
      case "phnNo":
        setPhnNo(e.target.value);
        break;
      case "address":
        setAddress(e.target.value);
        break;
    }
  };

  const sendFormData = async () => {
    const result = await window.api.logs("newSalesmen", { name, phnNo, address });
    console.log(result);

    setShowAlert(true);
    setAlert(result);
    setTimeout(() => setShowAlert(false), 3000);

    setName("");
    setPhnNo("");
    setAddress("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!String(phnNo).trim()) newErrors.phnNo = "Phone no. is required";
    if (!address.trim()) newErrors.address = "Address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    sendFormData();
  };

  return (
    <>
      {showAlert ? <Alert alert={alert} showAlert={showAlert} /> : ""}
      <form>
        <div className="row mb-3">
          <div className="form-floating">
            <input
              onChange={handleChange}
              value={name}
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : name ? "is-valid" : ""}`}
              id="name"
              placeholder="product name"
              name="name"
            />
            <label htmlFor="name">Name</label>
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="form-floating">
            <input
              onChange={handleChange}
              value={phnNo}
              type="number"
              className={`form-control ${errors.phnNo ? "is-invalid" : phnNo ? "is-valid" : ""}`}
              id="phnNo"
              placeholder="product name"
              name="phnNo"
            />
            <label htmlFor="phnNo">Phone number</label>
            {errors.phnNo && <div className="invalid-feedback">{errors.phnNo}</div>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="form-floating">
            <textarea
              onChange={handleChange}
              value={address}
              type="text"
              className={`form-control ${errors.address ? "is-invalid" : address ? "is-valid" : ""}`}
              id="address"
              placeholder="product name"
              name="address"
            />
            <label htmlFor="address">Address</label>
            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </>
  );
}

export default NewSalesmen;
