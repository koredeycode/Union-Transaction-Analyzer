import React from "react";
import html2canvas from "html2canvas";

interface Props {
  targetRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

const DownloadCaptureButton: React.FC<Props> = ({
  targetRef,
  filename = "chainstory-analysis.png",
}) => {
  const handleDownload = async () => {
    if (!targetRef?.current) return;

    console.log(targetRef.current.offsetHeight);

    const isDarkMode = document.documentElement.classList.contains("dark");

    const canvas = await html2canvas(targetRef.current, {
      background: isDarkMode ? "#0d1117" : "#ffffff",
      useCORS: true,
    });

    const image = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.download = filename;
    link.href = image;
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      title="Download"
    >
      <span className="material-icons-outlined">download</span>
    </button>
  );
};

export default DownloadCaptureButton;
