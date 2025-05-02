import { Link } from "react-router-dom";
import SearchBox from "../components/searchBox";
import { FaShoppingCart, FaPlus, FaSync } from "react-icons/fa";
import Stats from "../components/stats";
import SmInventory from "../components/smInventory";
import SmSales from "../components/smSales";
import { useState } from "react";
import ReportPreview from "../components/reportPreview";

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

      {/* <div className="row justify-content-center">
        <div className="col col-lg-3 col-md-4">
          <Link to="/sellProduct" type="button" className="shadow btn btn-lg btn-outline-primary m-3">
            <span style={{ fontSize: "1.6rem" }}>
              <FaShoppingCart />{" "}
            </span>{" "}
            Sell Items
          </Link>
        </div>
        <div className="col col-lg-3 col-md-4">
          <Link to="/reStock" type="button" className="shadow btn btn-lg btn-outline-success m-3">
            <span style={{ fontSize: "1.4rem" }}>
              <FaSync />{" "}
            </span>{" "}
            Re-Stock
          </Link>
        </div>
        <div className="col col-lg-3 col-md-4">
          <Link to="/newProduct" type="button" className="shadow btn btn-lg btn-primary m-3">
            <span style={{ fontSize: "1.4rem" }}>
              <FaPlus />
            </span>{" "}
            New Item
          </Link>
        </div>
      </div> */}

      <div className="row justify-content-around mt-3">
        <div className="col  d-flex justify-content-center">
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
        <div className="col">
          <SmInventory />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <SmSales />
        </div>
      </div>
    </div>
  );
}

export default Home;
