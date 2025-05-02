import { FaXmark } from "react-icons/fa6";
import RPreview1 from "./rPreview1";
import RPreview2 from "./rPreview2";
import RPreview3 from "./rPreview3";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function downloadReportAsPDF() {
  const input = document.getElementById("reportToBePrinted");

  html2canvas(input, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let remainingHeight = imgHeight;

    // Add pages if content overflows
    while (remainingHeight > 0) {
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      remainingHeight -= pageHeight;
      position -= pageHeight;
      if (remainingHeight > 0) pdf.addPage();
    }

    pdf.save("report.pdf");
  });
}

function ReportPreview({ previewType, data, setShowReportPreview }) {
  return (
    <div className="modal-overlay">
      <div
        className="preview-box"
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
          minWidth: "35rem",
          width: "auto",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <div id="reportToBePrinted">
          <h5>{previewType.name}</h5>
          <span
            onClick={() => setShowReportPreview(false)}
            style={{ position: "absolute", cursor: "pointer", color: "gray", right: "1rem", top: "0.15rem", fontSize: "2rem" }}
          >
            <FaXmark />
          </span>
          <div>
            {previewType.type === "1" && <RPreview1 data={data} />}
            {previewType.type === "2" && <RPreview2 data={data} />}
            {previewType.type === "3" && <RPreview3 data={data} />}
          </div>
        </div>
        <button onClick={downloadReportAsPDF} className="btn btn-secondary">
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default ReportPreview;
