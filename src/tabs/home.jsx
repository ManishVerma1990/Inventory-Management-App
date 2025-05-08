import SearchBox from "../components/searchBox";
import Stats from "../components/stats";
// import SmInventory from "../components/smInventory";
import SmSales from "../components/smSales";
import { useState } from "react";
import ReportPreview from "../components/reportPreview";
import { FaShoppingCart, FaSync, FaPlus, FaFileAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

// import escpos from "escpos";

async function generateReceipt() {
  // await window.api.generateReceipt();
}

function Home() {
  // Send IPC request to main process
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [reportResult, setReportResult] = useState([]);
  const [previewType, setPreviewType] = useState({ type: "1", name: "Top Selling Products" });

  const getTodaysRevenue = async () => {};
  const getLowStock = async () => {
    const result = await window.api.fetch("getLowStocks", {});
    setReportResult(result);
    setShowReportPreview(true);
    setPreviewType({ type: "1", name: "Low Stocks" });
    return;
  };

  return (
    <div className="container text-center">
      {showReportPreview ? (
        <ReportPreview previewType={previewType} data={reportResult} setShowReportPreview={setShowReportPreview} />
      ) : (
        ""
      )}
      <div className="mt-2">
        <SearchBox />
      </div>

      <div className="row justify-content-around mt-3">
        <div className="col d-flex justify-content-center">
          <Stats title={"Total stock"} req={"getStocksCount"} to={"/stocks"} />
        </div>
        <div className="col  d-flex justify-content-center">
          <Stats title={"Sales today"} req={"getTodaySalesCount"} to={"/sales"} />
        </div>
        <div onClick={getTodaysRevenue} className="col  d-flex justify-content-center">
          <Stats color={"green"} currency={true} title={"Today's revenue"} req={"getTodaysRevenue"} />
        </div>
        <div onClick={getLowStock} className="col  d-flex justify-content-center">
          <Stats color={"orange"} title={"Low stock"} req={"getLowStockCount"} />
        </div>
      </div>

      <div className="row mb-3">
        <span className="m-3 shadow col p-0" style={{ backgroundColor: "white", borderRadius: "9px" }}>
          <NavLink to={"/sellProduct"}>
            <button className=" btn btn-outline-dark w-100 h-100" style={{ fontSize: "1.2rem" }}>
              <span className="me-3" style={{ fontSize: "1.375rem" }}>
                <FaShoppingCart />
              </span>
              Sell Items
            </button>
          </NavLink>
        </span>
        <span className="m-3 shadow col p-0" style={{ backgroundColor: "white", borderRadius: "9px" }}>
          <NavLink to={"/reStock"}>
            <button className=" btn btn-outline-dark w-100 h-100" style={{ fontSize: "1.2rem" }}>
              <span className="me-3" style={{ fontSize: "1.375rem" }}>
                <FaSync />
              </span>
              Restock Items
            </button>
          </NavLink>
        </span>
        <span className="m-3 shadow col p-0" style={{ backgroundColor: "white", borderRadius: "9px" }}>
          <NavLink to={"/newProduct"}>
            <button className=" btn btn-outline-dark w-100 h-100" style={{ fontSize: "1.2rem" }}>
              <span className="me-3" style={{ fontSize: "1.375rem" }}>
                <FaPlus />
              </span>
              New Item
            </button>
          </NavLink>
        </span>
        <span className="m-3 shadow col p-0" style={{ backgroundColor: "white", borderRadius: "9px" }}>
          <NavLink to={"/reports"}>
            <button className=" btn btn-outline-dark w-100 h-100" style={{ fontSize: "1.2rem" }}>
              <span className="me-3" style={{ fontSize: "1.375rem" }}>
                <FaFileAlt />
              </span>
              Genereate Report
            </button>
          </NavLink>
        </span>
      </div>

      {/* <div className="row mb-3">
        <div className="col">
          <SmInventory />
        </div>
      </div> */}

      <div className="row mb-3">
        <div className="col">
          <SmSales />
        </div>
      </div>
      {/* <button onClick={generatePDF}>Recipt</button> */}
    </div>
  );
}

export default Home;
