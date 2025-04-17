import Table from "../components/table";
import { useEffect, useState } from "react";

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
    <div className="card shadow text-start p-3">
      <h5 className="card-title ">Stocks</h5>
      <Table data={data} />
    </div>
  );
}

export default SmInventory;
