import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from './adminVerifyDoc.module.css';

const AdminStudentVerification = () => {
  const navigate = useNavigate();
  const { rollNumber } = useParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFileType, setProcessingFileType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    phoneNumber: "",
    companyCity: "",
    companyName: "",
    semesterType: "",
    classSubgroup: "",
    trainingArrangedBy: "",
    trainingLetter: "",
    feeReceipt: ""
  });
  const [loading, setLoading] = useState(true);
  const [rejectionModal, setRejectionModal] = useState({
    show: false,
    fileType: null,
    reason: "",
    customMessage: "",
    contactPerson: ""
  });

  const trainingReasons = [
    "Stipend less than 10000, take approval from Dr. Anupam Garg",
    "Duration less than 4.5 months",
    "Training not allowed. Non-tech profile, take approval from head CSED",
    "Training duration not mentioned in training letter",
    "Job profile not clear in training letter",
    "Other"
  ];

  const feeReasons = [
    "Bank receipt uploaded. Upload fee receipt from web kiosk",
    "Full fee not paid. Upload approvals",
    "Other"
  ];

  const contactPersons = [
    "Finance Department",
    "CSED Head",
    "Training Coordinator"
  ];

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const AdminToken = localStorage.getItem("admin-token");
        if (!AdminToken) throw new Error("No authentication token found!");

        const response = await axios.get(
          `http://localhost:4000/students/verifyStudentDocument/${rollNumber}`,
          { headers: { Authorization: `Bearer ${AdminToken}` } }
        );

        if (response.data?.student) {
          setFormData({
            name: response.data.student.name,
            rollNo: response.data.student.rollNo,
            email: response.data.student.email,
            phoneNumber: response.data.student.phoneNumber,
            companyCity: response.data.student.companyDetails?.companyCity || "",
            companyName: response.data.student.companyDetails?.companyName || "",
            semesterType: response.data.student.semesterType,
            classSubgroup: response.data.student.classSubgroup,
            trainingArrangedBy: response.data.student.trainingArrangedBy,
            trainingLetter: response.data.student.trainingLetter,
            feeReceipt: response.data.student.feeReceipt,
          });
        }
      } catch (err) {
        console.log(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [rollNumber]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownload = async (file) => {
    if (!file) {
        alert("No document available");
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/students/downloadfile/${file}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` },
        });

        if (!response.ok) {
            throw new Error("Failed to download file");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        window.open(url, "_blank");
    } catch (error) {
        console.error("Download error:", error);
    }
  };

  const handleRejectionSubmit = async () => {
    setIsProcessing(true);
    setProcessingFileType(rejectionModal.fileType);
    
    try {
      const response = await axios.post(
        `http://localhost:4000/students/sendEmail/${formData.rollNo}`,
        {
          fileType: rejectionModal.fileType,
          reason: rejectionModal.reason,
          customMessage: rejectionModal.customMessage,
          contactPerson: rejectionModal.contactPerson
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` } }
      );

      alert(`✅ Email sent to ${response.data.student.email}`);
      setRejectionModal({ show: false, fileType: null, reason: "", customMessage: "", contactPerson: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      alert("❌ Failed to send email");
    } finally {
      setIsProcessing(false);
      setProcessingFileType(null);
    }
  };

  const handleVerify = async (rollNo) => {
    setIsVerifying(true);

    try {
        const AdminToken = localStorage.getItem("admin-token");
        if (!AdminToken) throw new Error("No authentication token found!");

        const response = await axios.post(
            `http://localhost:4000/students/completeverify/${rollNo}`,
            formData, // ✅ Send formData in request body
            {
                headers: {
                    Authorization: `Bearer ${AdminToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.data.success) {
            alert("✅ Student verified successfully!");
            navigate("/admin"); // Redirect to admin panel
        } else {
            throw new Error(response.data.message || "Verification failed");
        }
    } catch (error) {
        console.error("❌ Verification error:", error);
        alert(error.response?.data?.message || "❌ Verification failed. Please try again.");
    } finally {
        setIsVerifying(false);
    }
};

  return (
    <>
      <Navbar
      navLinks={[
      {name:"Students Under Document Verification",path:"/underdocumentverification"},
        {name:"Students In Phase 2",path:"/phase2verification"},
        { name: "Verify Student", path: "/admin" },
        {name:"Delete Student",path:"/deletestudent"},
        {name: "Generate Excel", path: "/generateexcel" },
        { name: "Verify Faculty", path: "/verifyfaculty" },
        { name: "Verify Mentor", path: "/mentor" },
        {name:"Change Password",path:"/adminchangepassword"}
      ]}
      downloadButton={{
        text: "Log Out",
        onClick: () => navigate("/adminlogout"),
      }}
    />
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.card}>
              <div className={styles.content}>
                <h2 className={styles.heading}>
                  Verify Student Details
                </h2>
                {loading ? (
                  <p className={styles.textCenter}>Loading...</p>
                ) : (
                <form className={styles.formContainer}>
                <div className={styles.gridContainer}>
                  {Object.keys(formData).map((key) => (
                    key !== "trainingLetter" && key !== "feeReceipt" && (
                      <div key={key} className={styles.inputContainer}>
                        <label className={styles.label}>
                          {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                        </label>
                        <input
                          type="text" name={key} value={formData[key] || ""} onChange={ key === "name" || key === "rollNo" || key === "email" || key === "phoneNumber" ? () => {} : handleInputChange} disabled={key === "name" || key === "rollNo" || key === "email" || key === "phoneNumber"} className={`${styles.inputField} ${key === "name" || key === "rollNo" || key === "email" || key === "phoneNumber" ? styles.disabledInput: "" }`}/>
                      </div>
                    )
                  ))}
                </div>
                <div className={styles.section}>
                  {/* Training Letter Section */}
                  <div>
                    <div className={styles.flexBetween}>
                      <label className={styles.label}>Training Letter</label>
                      <div className={styles.spaceX2}>
                      <button type="button" onClick={() => handleDownload(formData.trainingLetter)} className={styles.downloadButton}>
                        Download
                      </button>
                      <button type="button" onClick={() => setRejectionModal({show: true, fileType: "trainingLetter", reason: "", customMessage: "", contactPerson: "",}) } className={styles.removeButton} disabled={isProcessing}>
                       Remove & Email
                      </button>
                    </div>
                  </div>
                </div>
                    {/* Fee Receipt Section */}
                    <div className={styles.spaceY2}>
                      <div className={styles.flexBetween}>
                        <label className={styles.labelText}>Fee Receipt</label>
                        <div className={styles.spaceX2}>
                        <button type="button" onClick={() => handleDownload(formData.feeReceipt)} className={styles.downloadButton}>
                          Download
                        </button>
                        <button type="button" onClick={() => setRejectionModal({
                          show: true,
                          fileType: "feeReceipt",
                          reason: "",
                          customMessage: "",
                          contactPerson: "",
                        }) } className={styles.removeButton} disabled={isProcessing}>
                           Remove & Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.verifyContainer}>
                  <button type="button" onClick={() => handleVerify(formData.rollNo)} disabled={isVerifying} className={styles.verifyButton}>
                    {isVerifying ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </form>)}
            </div>
          </div>
        </div>
      </div>
      {/* Rejection Reason Modal */}
      {rejectionModal.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Select Rejection Details</h3>
              <div className={styles.dropdownContainer}>
                <select value={rejectionModal.reason} onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))} className={styles.dropdown} >
                  <option value="">Select Reason</option>
                    {(rejectionModal.fileType === "trainingLetter" ? trainingReasons : feeReasons).map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
                </select>
              {rejectionModal.reason === "Other" && (
                <textarea value={rejectionModal.customMessage} onChange={(e) => setRejectionModal(prev => ({ ...prev, customMessage: e.target.value }))} placeholder="Enter custom message" className={styles.textarea} rows="3"/>
              )}
                <select value={rejectionModal.contactPerson} onChange={(e) => setRejectionModal(prev => ({ ...prev, contactPerson: e.target.value }))} className={styles.selectarea}>
                  <option value="">Select Contact Person (optional)</option>
                    {contactPersons.map((person) => (
                  <option key={person} value={person}>{person}</option>
                ))}
                </select>
              <div className={styles.buttonContainer}>
                <button onClick={() => setRejectionModal(prev => ({ ...prev, show: false }))} className={styles.cancelButton}>
                  Cancel
                </button>
                <button onClick={handleRejectionSubmit} disabled={isProcessing} className={styles.submitButton}>
                  {isProcessing ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminStudentVerification;