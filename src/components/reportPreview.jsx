import { FaXmark } from "react-icons/fa6";

function ReportPreview({ data, setShowReportPreview }) {
  console.log(data);

  return (
    <div className="modal-overlay">
      <div className="preview-box" style={{ minWidth: "35rem", position: "relative" }}>
        <span
          onClick={() => setShowReportPreview(false)}
          style={{ position: "absolute", cursor: "pointer", color: "gray", right: "1rem", top: "0.15rem", fontSize: "2rem" }}
        >
          <FaXmark />
        </span>
        <div style={{ overflowY: "auto" }}></div>
      </div>
    </div>
  );
}

export default ReportPreview;
