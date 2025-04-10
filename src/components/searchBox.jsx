import { useState } from "react";
import Suggestions from "./suggestions";
import ViewProduct from "./viewProduct";

function SearchBox() {
  const [searchBox, setSearchBox] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [values, setValues] = useState([]);
  const [product, setProduct] = useState({ show: false, data: {} });

  const autofill = (e, data) => {
    if (e.target.value.trim() === "" || !data.length) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  };
  const handleChange = async (e) => {
    setSearchBox(e.target.value);
    const data = await window.api.product("getSuggestions", e.target.value);
    setValues(data);
    autofill(e, data);
  };

  const handleListClick = async (value) => {
    const data = await window.api.product("getOne", value.id);
    setSearchBox(data.name);
    setShowSuggestions(false);
    setProduct({ show: true, data: data });
  };

  return (
    <>
      {product.show ? <ViewProduct product={product} setProduct={setProduct} /> : ""}
      <div className={`form-floating ${product.show ? "blur-background" : ""}`}>
        <input
          id="search"
          type="text"
          className="form-control"
          onChange={handleChange}
          value={searchBox}
          placeholder="Search"
          onBlur={() =>
            setTimeout(() => {
              setShowSuggestions(false);
            }, 300)
          }
        />
        <label htmlFor="search">Search here</label>
        {showSuggestions ? <Suggestions values={values} callback={handleListClick} /> : ""}
      </div>
    </>
  );
}
export default SearchBox;
