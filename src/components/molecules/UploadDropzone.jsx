import { useRef, useState } from "react";
import { UploadIcon } from "../atoms/UploadIcon";

function isJsonFile(file) {
  if (!file) return false;
  const hasJsonExtension = file.name.toLowerCase().endsWith(".json");
  const isJsonType = file.type === "application/json" || file.type === "text/json";
  return hasJsonExtension || isJsonType;
}

export function UploadDropzone({
  hint,
  fileName,
  successMessage,
  onFileSelected,
  onInvalidFile,
  resetKey,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const [file] = files;
    if (!file || !isJsonFile(file)) {
      onInvalidFile?.();
      return;
    }
    onFileSelected?.(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      className={`dropzone ${isDragging ? "dropzone-active" : ""} ${
        fileName ? "dropzone-filled" : ""
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        key={resetKey}
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="dropzone-input"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <span className="dropzone-icon">
        <UploadIcon />
      </span>
      {fileName ? (
        <div className="dropzone-text">
          <p className="upload-file">{fileName}</p>
          {successMessage ? (
            <p className="upload-success">{successMessage}</p>
          ) : null}
        </div>
      ) : (
        <div className="dropzone-text">
          <p className="dropzone-hint">{hint}</p>
        </div>
      )}
    </div>
  );
}
