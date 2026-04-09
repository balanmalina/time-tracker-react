import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useState } from "react";

function ExportPDF({ targetId, fileName = "pontaj-raport", isMobile }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const element = document.getElementById(targetId);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      // prima pagina
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // pagini extra daca e prea lung
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${fileName}-${new Date().toLocaleDateString("ro-RO")}.pdf`);
    } catch (error) {
      console.error("Eroare export PDF:", error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: isMobile ? "10px 16px" : "10px 20px",
        background: loading
          ? "#ccc"
          : "linear-gradient(135deg, #667eea, #f093fb)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontWeight: "700",
        fontSize: "14px",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "opacity 0.2s",
      }}
    >
      {loading ? "⏳ Se generează..." : "📄 Export PDF"}
    </button>
  );
}

export default ExportPDF;