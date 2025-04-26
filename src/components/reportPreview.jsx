import { FaXmark } from "react-icons/fa6";

function ReportPreview({ data, setShowReportPreview }) {
  console.log(data);

  const RenderNestedData = ({ data }) => {
    if (Array.isArray(data)) {
      return (
        <ul className="list-disc ml-6">
          {data.map((item, index) => (
            <li key={index}>
              <RenderNestedData data={item} />
            </li>
          ))}
        </ul>
      );
    } else if (typeof data === "object" && data !== null) {
      return (
        <div className="pl-4 border-l-2 border-gray-300 mb-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-1">
              <strong className="text-gray-800">{key}:</strong> <RenderNestedData data={value} />
            </div>
          ))}
        </div>
      );
    } else {
      return <span className="text-gray-700">{String(data)}</span>;
    }
  };

  const ReportViewer = ({ report }) => {
    return (
      <div className="p-4 max-w-3xl mx-auto bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Report</h2>
        <RenderNestedData data={report} />
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="preview-box" style={{ minWidth: "35rem", position: "relative" }}>
        <span
          onClick={() => setShowReportPreview(false)}
          style={{ position: "absolute", cursor: "pointer", color: "gray", right: "1rem", top: "0.15rem", fontSize: "2rem" }}
        >
          <FaXmark />
        </span>
        <div style={{ overflowY: "auto" }}>
          {/* {data.map((report, index) => (
            <ReportViewer key={index} report={report} />
          ))} */}
          he
        </div>
      </div>
    </div>
  );
}

export default ReportPreview;
