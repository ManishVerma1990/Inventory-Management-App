import { Link } from "react-router-dom";
import SalesmenTable from "./salesmenTable";
import NewSalesmen from "./newSalesmen";

function Salesmen() {
  return (
    <>
      <div className="conatiner">
        <div className="card shadow p-3">
          <NewSalesmen />
        </div>
        <div className="card shadow p-3 mt-3">
          <SalesmenTable />
        </div>
      </div>
    </>
  );
}

export default Salesmen;
