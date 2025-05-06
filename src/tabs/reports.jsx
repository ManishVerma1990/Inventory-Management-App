import ReportForm from "../components/reportForm";
import Stats from "../components/stats";
import { useState } from "react";
import ReportPreview from "../components/reportPreview";

function Reports() {
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [reportResult, setReportResult] = useState([]);
  const [previewType, setPreviewType] = useState({ type: "1", name: "Top Selling Products" });

  const handleStatsClick = async (obj) => {
    const result = await window.api.fetch(obj.req, from, to);
    console.log(result);
    setReportResult(result);
    setPreviewType({ type: obj.type, name: obj.name });
    setShowReportPreview(true);
  };

  const statsList = [
    { title: "Total Stocks", req: "getStocksCount", obj: { req: "getStocks", from: "", to: "", type: "1", name: "Total Stocks" } },
    { title: "Sales today", req: "getTodaySalesCount", obj: { req: "getStocks", from: "", to: "", type: "1", name: "Total Stocks" } },
    {
      title: "Today's revenue",
      req: "getTodaysRevenue",
      obj: { req: "getStocks", from: "", to: "", type: "1", name: "Total Stocks" },
    },
    { title: "Low stock", req: "getLowStockCount", obj: { req: "getStocks", from: "", to: "", type: "1", name: "Total Stocks" } },
  ];

  return (
    <>
      {showReportPreview ? (
        <ReportPreview previewType={previewType} data={reportResult} setShowReportPreview={setShowReportPreview} />
      ) : (
        ""
      )}
      <div className={`container ${showReportPreview ? "blur-background" : ""}`}>
        <div className="row ">
          <div className="col">
            <ReportForm />
          </div>
        </div>
        <div className="row text-center justify-content-around mt-3">
          {statsList.map((stat, index) => (
            <div key={index} className="col d-flex justify-content-center" onClick={() => handleStatsClick(stat.obj)}>
              <Stats title={stat.title} req={stat.req} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Reports;
