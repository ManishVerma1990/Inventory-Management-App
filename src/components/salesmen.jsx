import SalesmenTable from "./salesmenTable";
import NewSalesmen from "./newSalesmen";
import { useState } from "react";

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
