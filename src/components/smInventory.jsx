import Table from "../components/table";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function SmInventory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      let fetchedData = await window.api.product("get", 8);
      setData(fetchedData);
    };

    getData();
  }, []);

  return (
    <div className="card shadow text-start px-3">
      <div style={{ cursor: "pointer" }}>
        <NavLink to={"/stocks"} style={{ all: "unset" }}>
          <h5 className="card-title d-flex pt-2 pb-2" style={{ marginBottom: "0" }}>
            Stocks <span className="ms-auto more-btn">more {">"}</span>
          </h5>
        </NavLink>
      </div>
      <Table data={data} />
    </div>
  );
}

export default SmInventory;
