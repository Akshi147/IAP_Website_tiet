import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import styles from "./studentDocUpload.module.css";  // Import the module CSS

const StudentDocUpload = ({ uploadedDocs }) => {
  const [trainingLetter, setTrainingLetter] = useState(null);
  const [feeReceipt, setFeeReceipt] = useState(null);
  const [error, setError] = useState({ trainingLetter: "", feeReceipt: "" });
  const [success, setSuccess] = useState({ trainingLetter: "", feeReceipt: "" });
  const [uploadProgress, setUploadProgress] = useState({ trainingLetter: 0, feeReceipt: 0 });

  const validateFile = (file, type) => {
    if (file.type !== "application/pdf") {
      setError((prev) => ({ ...prev, [type]: "Please upload a PDF file." }));
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError((prev) => ({ ...prev, [type]: "File size should be less than 10MB." }));
      return false;
    }
    setError((prev) => ({ ...prev, [type]: "" }));
    return true;
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file && validateFile(file, type)) {
      if (type === "trainingLetter") {
        setTrainingLetter(file);
      } else {
        setFeeReceipt(file);
      }
      setSuccess((prev) => ({ ...prev, [type]: "" }));
    } else {
      event.target.value = null;
      if (type === "trainingLetter") {
        setTrainingLetter(null);
      } else {
        setFeeReceipt(null);
      }
    }
  };

  const handleSubmit = async (type) => {
    const file = type === "trainingLetter" ? trainingLetter : feeReceipt;
    if (!file) {
      setError((prev) => ({ ...prev, [type]: "Please upload a file before submitting." }));
      return;
    }

    const formData = new FormData();
    formData.append(type, file);

    try {
      const endpoint = type === "trainingLetter" 
        ? "http://localhost:4000/students/uploadfile"
        : "http://localhost:4000/students/uploadfiles";

      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress((prev) => ({ ...prev, [type]: percent }));
        },
      });

      if (response.status === 200) {
        setSuccess((prev) => ({ ...prev, [type]: "File uploaded successfully!" }));
        setError((prev) => ({ ...prev, [type]: "" }));
        if (type === "trainingLetter") {
          setTrainingLetter(null);
        } else {
          setFeeReceipt(null);
        }
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError((prev) => ({ ...prev, [type]: "Upload failed. Please try again." }));
      setSuccess((prev) => ({ ...prev, [type]: "" }));
    }
  };

  const renderUploadSection = (title, type) => {
    const file = type === "trainingLetter" ? trainingLetter : feeReceipt;
    const progress = uploadProgress[type];
    const isUploaded = uploadedDocs?.[type]; // Correctly check if uploadedDocs contains this document
  
    return (
      <div className={styles.uploadSection}>
        <h3 className={styles.title}>{title}</h3>
        
        {isUploaded ? (
          <p className={styles.uploadedText}>✔ {title} Uploaded</p>
        ) : (
          <>
            <div className={styles.uploadArea}>
              <div className={styles.textCenter}>
                <svg
                  className={styles.icon}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className={styles.fileUploadArea}>
                  <label
                    htmlFor={`${type}-upload`}
                    className={styles.uploadButton}
                  >
                    <span>Upload a file</span>
                    <input
                      id={`${type}-upload`}
                      name="file"
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, type)}
                    />
                  </label>
                  <p className={styles.dragText}>or drag and drop</p>
                </div>
                <p className={styles.fileSizeText}>PDF up to 10MB</p>
              </div>
            </div>
            {error[type] && <p className={styles.errorText}>{error[type]}</p>}
            {file && <p className={styles.fileSelectedText}>File selected: {file.name}</p>}
            {success[type] && <p className={styles.successText}>{success[type]}</p>}

            {/* Progress bar */}
            {progress > 0 && progress < 100 && (
              <div className={styles.progressBar}>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className={styles.progressText}>{progress}%</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleSubmit(type)}
              className={styles.submitButton}
            >
              Submit {title}
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Document Upload</h2>
      <div className={styles.uploadWrapper}>
        {renderUploadSection("Initial Training Letter", "trainingLetter")}
        {renderUploadSection("Fee Receipt", "feeReceipt")}
      </div>
    </div>
  );
};

StudentDocUpload.propTypes = {
  uploadedDocs: PropTypes.object,
};

export default StudentDocUpload;