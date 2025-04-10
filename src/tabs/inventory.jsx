import Table from "../components/table";
import { useEffect, useState } from "react";
import SearchBox from "../components/searchBox";

function Inventory() {
  const [data, setData] = useState([]);
  const [pName, setPName] = useState("");

  const filteredData = data.filter((product) => product.name.toLowerCase().includes(pName.toLowerCase()));

  useEffect(() => {
    const getData = async () => {
      let fetchedData = await window.api.product("get");
      setData(fetchedData);
    };

    getData();
  }, []); // No need for `gotData`
  return (
    <div className="container pt-2 shadow">
      <div className="mb-3">
        {/* <SearchBox /> */}
        <div className="row">
          <div className="col">
            <div class="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                onChange={(e) => setPName(e.target.value)}
                placeholder="Product name"
                value={pName}
              />
              <label htmlFor="floatingInput">Product name</label>
            </div>
          </div>
          <div className="col-2">
            <select style={{ height: "3.6rem" }} className={`form-select`} aria-label="Default select example" name="category">
              <option defaultValue={"all"}>All</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="l">l</option>
              <option value="ml">ml</option>
              <option value="cs">pcs</option>
            </select>
          </div>
        </div>
      </div>
      <Table data={filteredData} />
    </div>
  );
}

export default Inventory;
