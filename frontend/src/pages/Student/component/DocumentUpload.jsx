import { useState } from "react";
import axios from "axios";

const DocumentUpload = ({ uploadedDocs }) => {
  const [trainingLetter, setTrainingLetter] = useState(null);
  const [feeReceipt, setFeeReceipt] = useState(null);
  const [error, setError] = useState({ trainingLetter: "", feeReceipt: "" });
  const [success, setSuccess] = useState({ trainingLetter: "", feeReceipt: "" });
  const [uploadProgress, setUploadProgress] = useState({ trainingLetter: 0, feeReceipt: 0 });
  const [isUploading, setIsUploading] = useState({ trainingLetter: false, feeReceipt: false });

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

    setIsUploading(prev => ({ ...prev, [type]: true }));

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
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
      setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
    }
  };

  const renderUploadSection = (title, type) => {
    const file = type === "trainingLetter" ? trainingLetter : feeReceipt;
    const progress = uploadProgress[type];
    const isUploaded = uploadedDocs?.[type];
    const isCurrentlyUploading = isUploading[type];
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex-1">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        
        {isUploaded ? (
          <p className="text-green-600 font-semibold">✔ {title} Uploaded</p>
        ) : (
          <>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor={`${type}-upload`}
                    className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
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
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
              </div>
            </div>
            {error[type] && <p className="mt-2 text-sm text-red-600">{error[type]}</p>}
            {file && <p className="mt-2 text-sm text-green-600">File selected: {file.name}</p>}
            {success[type] && <p className="mt-2 text-sm text-green-600">{success[type]}</p>}

            {/* Progress bar */}
            {progress > 0 && progress < 100 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-gray-600">{progress}%</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleSubmit(type)}
              disabled={isCurrentlyUploading}
              className={`mt-4 w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white 
                ${isCurrentlyUploading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                flex items-center justify-center`}
            >
              {isCurrentlyUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                `Submit ${title}`
              )}
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Document Upload</h2>
      <div className="flex w-full max-w-4xl space-x-4">
        {renderUploadSection("Initial Training Letter", "trainingLetter")}
        {renderUploadSection("Fee Receipt", "feeReceipt")}
      </div>
    </div>
  );
};

export default DocumentUpload;
