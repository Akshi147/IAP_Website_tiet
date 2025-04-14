import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './stuUploadReport.module.css';
import Navbar from '../../../components/navbar/navbar';
import axios from 'axios';

const StudentUploadReportStatus = () => {
    const navigate = useNavigate();
    const [uploadStatus, setUploadStatus] = useState({
        trainingLetter: false,
        GoalReport: false,
        MidwayReport: false,
        ReportFile: false,
        ProjectPresentation: false,
        FinalTraining: false
    });
    const [selectedFiles, setSelectedFiles] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const fetchUploadStatus = async () => {
            try {
                // First check training letter status specifically
                const trainingLetterResponse = await axios.get('/students/verifyStudentDocument/trainingLetter', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('studentToken')}`
                    }
                });

                // Then get all other document statuses
                const uploadStatusResponse = await axios.get('/students/getFileUploadInfo', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('studentToken')}`
                    }
                });

                setUploadStatus({
                    ...uploadStatusResponse.data,
                    trainingLetter: trainingLetterResponse.data.exists || false
                });
            } catch (error) {
                console.error('Error fetching upload status:', error);
                // If verification fails, assume training letter isn't uploaded
                setUploadStatus(prev => ({
                    ...prev,
                    trainingLetter: false
                }));
            } finally {
                setIsInitialLoad(false);
            }
        };

        fetchUploadStatus();
    }, []);

    const handleFileChange = (fileType, e) => {
        setSelectedFiles({
            ...selectedFiles,
            [fileType]: e.target.files[0]
        });
    };

    const handleUpload = async (fileType) => {
        if (!selectedFiles[fileType]) {
            alert('Please select a file first');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append(fileType, selectedFiles[fileType]);

            let endpoint;
            switch (fileType) {
                case 'GoalReport':
                    endpoint = '/students/uploadgoalreport';
                    break;
                case 'MidwayReport':
                    endpoint = '/students/uploadmidwayreport';
                    break;
                case 'ReportFile':
                    endpoint = '/students/uploadreportfile';
                    break;
                case 'ProjectPresentation':
                    endpoint = '/students/uploadprojectpresentation';
                    break;
                case 'FinalTraining':
                    endpoint = '/students/uploadfinaltraining';
                    break;
                default:
                    throw new Error('Invalid file type');
            }

            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('studentToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setUploadStatus(prev => ({
                    ...prev,
                    [fileType]: true
                }));
                alert(`${fileType.replace(/([A-Z])/g, ' $1')} uploaded successfully!`);
            } else {
                throw new Error(response.data.message || 'Upload failed');
            }
        } catch (error) {
            console.error(`Error uploading ${fileType}:`, error);
            alert(`Error uploading file: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderUploadSection = (title, fileType, deadline, allowedTypes, maxSizeMB) => {
        const isTrainingLetter = fileType === 'trainingLetter';
        
        if (isInitialLoad) {
            return (
                <div className={styles.uploadSection}>
                    <h3>{title}</h3>
                    <p>Loading status...</p>
                </div>
            );
        }

        return (
            <div className={styles.uploadSection}>
                <h3>{title}</h3>
                <p>Deadline: {deadline}</p>
                <p>Allowed: {allowedTypes} (Max {maxSizeMB}MB)</p>
                <p>Status: {uploadStatus[fileType] ? '✅ Uploaded' : '❌ Not Uploaded'}</p>
                
                {!isTrainingLetter ? (
                    <div className={styles.fileInputContainer}>
                        <input
                            type="file"
                            id={fileType}
                            accept={allowedTypes}
                            onChange={(e) => handleFileChange(fileType, e)}
                            disabled={uploadStatus[fileType] || isLoading}
                            className={styles.fileInput}
                        />
                        <label htmlFor={fileType} className={styles.fileInputLabel}>
                            {selectedFiles[fileType] ? selectedFiles[fileType].name : 'Choose File'}
                        </label>
                        <button
                            onClick={() => handleUpload(fileType)}
                            disabled={uploadStatus[fileType] || isLoading || !selectedFiles[fileType]}
                            className={styles.uploadButton}
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                ) : (
                    <p className={styles.notice}>
                        {uploadStatus.trainingLetter
                            ? 'This document was automatically uploaded during registration'
                            : 'Training letter not found. Please contact administration.'}
                    </p>
                )}
                
                <p className={styles.warning}>
                    Once saved, file cannot be changed. Verify before submission.
                </p>
            </div>
        );
    };

    return (
        <>
            <Navbar
                navItems={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Phase 2", path: "/student" },
                    { name: "Faculty Assigned", path: "faculty-assigned" },
                    { name: "Upload Report and PPT", path: "/getFileUploadInfo" },
                    { name: "Stu Input Form", path: "/student-input" },
                    { name: "Evaluation Schedule", path: "/evaluation-schedule" },
                    { name: "Feedback", path: "/feedback" },
                    { name: "Fortinightly Reflection", path: "/fortnightly" },
                    { name: "Feedback(ABET)", path: "/abet-feedback" },
                    { name: "Future Plans", path: "/future-plans" },
                    { name: "Overall progress", path: "/overall-progress" },
                    { name: "Change Password", path: "/reset-password" },
                ]}
                downloadButton={{
                    text: "Log Out",
                    onClick: () => navigate("/student/logout"),
                }}
            />

            <div className={styles.container}>
                <h1>Upload Reports</h1>
                
                {renderUploadSection(
                    "Initial Training Letter",
                    "trainingLetter",
                    "Before Beginning of Training",
                    ".pdf",
                    10
                )}
                
                {renderUploadSection(
                    "Goal Report",
                    "GoalReport",
                    "End of 4 weeks",
                    ".pdf",
                    20
                )}
                
                {renderUploadSection(
                    "Midway Report",
                    "MidwayReport",
                    "End of 10 Weeks",
                    ".pdf",
                    20
                )}
                
                {renderUploadSection(
                    "Report File",
                    "ReportFile",
                    "1 Week Before Final Evaluation",
                    ".pdf",
                    50
                )}
                
                {renderUploadSection(
                    "Project Presentation",
                    "ProjectPresentation",
                    "1 Week Before Final Evaluation",
                    ".ppt,.pptx",
                    30
                )}

                {renderUploadSection(
                    "Final Training Document",
                    "FinalTraining",
                    "End of Training",
                    ".pdf",
                    10
                )}
            </div>
        </>
    );
};

export default StudentUploadReportStatus;