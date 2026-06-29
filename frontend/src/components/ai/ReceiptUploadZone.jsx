import { useState } from "react";
import { Upload, ImageIcon, Sparkles } from "lucide-react";

const ReceiptUploadZone = ({ preview, onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={`receipt-upload-zone ${isDragging ? "receipt-upload-zone--drag" : ""} ${
        disabled ? "receipt-upload-zone--disabled" : ""
      }`}
    >
      <div className="receipt-upload-zone__glow" aria-hidden="true" />

      {preview ? (
        <div className="receipt-upload-zone__preview">
          <img
            src={preview}
            alt="Receipt preview"
            className="receipt-upload-zone__image"
          />
          <p className="receipt-upload-zone__hint">Drop a new image to replace</p>
        </div>
      ) : (
        <div className="receipt-upload-zone__empty">
          <div className="receipt-upload-zone__icon-wrap" aria-hidden="true">
            <ImageIcon className="receipt-upload-zone__icon" strokeWidth={2} />
          </div>
          <div>
            <p className="receipt-upload-zone__title">Drag & drop your receipt</p>
            <p className="receipt-upload-zone__subtitle">
              or click to browse · JPEG, PNG, WebP
            </p>
          </div>
          <span className="receipt-upload-zone__badge">
            <Sparkles size={11} />
            AI extraction
          </span>
        </div>
      )}

      <label
        className={`receipt-upload-zone__btn ${disabled ? "receipt-upload-zone__btn--disabled" : ""}`}
      >
        <Upload size={16} strokeWidth={2.25} />
        Choose Image
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="sr-only"
          onChange={handleChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default ReceiptUploadZone;
