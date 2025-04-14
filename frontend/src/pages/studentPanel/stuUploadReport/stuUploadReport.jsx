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
    const [studentProfile, setStudentProfile] = useState(null);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch student profile first to check for training letter
                const profileResponse = await axios.get('http://localhost:4000/students/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setStudentProfile(profileResponse.data);

                // Then fetch upload status for other documents
                const statusResponse = await axios.get('http://localhost:4000/students/getFileUploadInfo', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setUploadStatus({
                    ...statusResponse.data,
                    trainingLetter: !!profileResponse.data.trainingLetter
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleFileChange = (fileType, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (fileType === 'ProjectPresentation' && !file.name.match(/\.(ppt|pptx)$/)) {
            setError('Only PPT/PPTX files are allowed');
            return;
        }
        if (!file.name.match(/\.pdf$/) && fileType !== 'ProjectPresentation') {
            setError('Only PDF files are allowed');
            return;
        }

        setSelectedFiles({
            ...selectedFiles,
            [fileType]: file
        });
        setError('');
    };

    const handleUpload = async (fileType) => {
        if (!selectedFiles[fileType]) {
            setError('Please select a file first');
            return;
        }

        setIsLoading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append(fileType, selectedFiles[fileType]);

        try {
            let endpoint;
            switch (fileType) {
                case 'GoalReport':
                    endpoint = 'http://localhost:4000/students/uploadgoalreport';
                    break;
                case 'MidwayReport':
                    endpoint = 'http://localhost:4000/students/uploadmidwayreport';
                    break;
                case 'ReportFile':
                    endpoint = 'http://localhost:4000/students/uploadreportfile';
                    break;
                case 'ProjectPresentation':
                    endpoint = 'http://localhost:4000/students/uploadprojectpresentation';
                    break;
                case 'FinalTraining':
                    endpoint = 'http://localhost:4000/students/uploadfinaltraining';
                    break;
                default:
                    throw new Error('Invalid file type');
            }

            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                }
            });

            if (response.status === 200) {
                setUploadStatus(prev => ({
                    ...prev,
                    [fileType]: true
                }));
                setSelectedFiles(prev => ({
                    ...prev,
                    [fileType]: null
                }));
            }
        } catch (error) {
            console.error(`Error uploading ${fileType}:`, error);
            setError(`Failed to upload ${fileType}: ${error.message}`);
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };

    const renderUploadSection = (title, fileType, deadline, allowedTypes, maxSizeMB) => {
        const isTrainingLetter = fileType === 'trainingLetter';
        const file = selectedFiles[fileType];
        
        return (
            <div className={styles.uploadSection}>
                <h3>{title}</h3>
                <p>Deadline: {deadline}</p>
                <p>Allowed: {allowedTypes} (Max {maxSizeMB}MB)</p>
                <p>Status: {uploadStatus[fileType] ? '✅ Uploaded' : '❌ Not Uploaded'}</p>
                
                {!isTrainingLetter && !uploadStatus[fileType] && (
                    <>
                        <div className={styles.fileInputContainer}>
                            <input
                                type="file"
                                id={fileType}
                                accept={allowedTypes}
                                onChange={(e) => handleFileChange(fileType, e)}
                                disabled={isLoading}
                                className={styles.fileInput}
                            />
                            <label htmlFor={fileType} className={styles.fileInputLabel}>
                                {file ? file.name : 'Choose File'}
                            </label>
                        </div>
                        
                        {progress > 0 && progress < 100 && (
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                                <span>{progress}%</span>
                            </div>
                        )}

                        <button
                            onClick={() => handleUpload(fileType)}
                            disabled={!file || isLoading}
                            className={styles.uploadButton}
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </button>
                    </>
                )}

                {isTrainingLetter && (
                    <div className={styles.trainingLetterInfo}>
                        {uploadStatus.trainingLetter ? (
                            <>
                                <p className={styles.uploadedNotice}>
                                    This document was automatically uploaded during registration
                                </p>
                                {studentProfile?.trainingLetter && (
                                    <a
                                        href={`http://localhost:4000/students/downloadfile/${studentProfile.trainingLetter}`}
                                        className={styles.downloadLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download Training Letter
                                    </a>
                                )}
                            </>
                        ) : (
                            <p className={styles.notice}>
                                Training letter not found. Please contact administration.
                            </p>
                        )}
                    </div>
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
                {error && <div className={styles.errorAlert}>{error}</div>}
                
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