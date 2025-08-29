import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Navbar from "../../../components/navbar/navbar";
import styles from "./mentorStuForm2UI.module.css";

import DetailsTable from "./detailsTable";


const mentorStuForm2 = () => {
    const navigate = useNavigate();
    const { id: studentId } = useParams();
    const [data, setData] = useState(null);
    const token = localStorage.getItem("mentor-token");

    const [evaluationData, setEvaluationData] = useState([
        {
            "parameter": "Parameter-1",
            "title": "1. Job Knowledge(Refers to knowledge clarity of fundamentals, and latest development.)",
            "details": [
                { "label": "A) Comprehensive knowledge about the job at hand.", "marks": "4" },
                { "label": "B) Satisfactory knowledge about the job at hand.", "marks": "2-3" },
                { "label": "C) Little or no knowledge about the job.", "marks": "0-1" }
            ],
            "marksObtained": ""
        },
        {
            "parameter": "Parameter-2",
            "title": "2. Management Skills(Planning, organizing and application skills during the course of training/interaction.)",
            "details": [
                { "label": "A) High management skills: appropriate planning with proper organization and application of plan.", "marks": "4" },
                { "label": "B) Satisfactory management skills: lacking in one or more field.", "marks": "2-3" },
                { "label": "C) Poor management skills.", "marks": "0-1" }
            ],
            "marksObtained": ""
        },
        {
            "parameter": "Parameter-3",
            "title": "3. Technical Skills(knowledge about techniques/tools used at various phases/stages in project.)",
            "details": [
                { "label": "A) Through knowledge about the tools and techniques used at various stages of development.", "marks": "4" },
                { "label": "B) Satisfactory knowledge about the tools and techniques used at various stages of development.", "marks": "2-3" },
                { "label": "C) Little or no knowledge about the tools and techniques used at various stages of development. (may lead to project failure)", "marks": "0-1" }
            ],
            "marksObtained": ""
        },
        {
            "parameter": "Parameter-4",
            "title": "4. Communication Skills(Refers to written/oral expression and presentation skills.)",
            "details": [
                { "label": "A) Good communication skills. Able to express views clearly.", "marks": "4" },
                { "label": "B) Satisfactory communication skills. Need help of native tongue to express some views.", "marks": "2-3" },
                { "label": "C) Not able to express views clearly.", "marks": "0-1" }
            ],
            "marksObtained": ""
        },
        {
            "parameter": "Parameter-5",
            "title": "5. Regularity and Punctuality(Refers to Sanctioned authorized leave, absence without permission and late coming & leaving work place early.)",
            "details": [
                { "label": "A) High: was regular and punctual throughout the entire training period.", "marks": "4" },
                { "label": "B) Medium: took frequent leaves and/or lack of punctuality.", "marks": "2-3" },
                { "label": "C) Not Regular/Not available most of the time.", "marks": "0-1" }
            ],
            "marksObtained": ""
        }]);

    const [permanentPlacementInfo, setPermanentPlacementInfo] = useState("Choose one...");
    const [moreStudentsInfo, setMoreStudentsInfo] = useState("Choose one...");
    
    const [isFilled, setIsFilled] = useState(false);

    useEffect(() => {
        const fetchForm = async () => {
            const res = await axios.get(`http://localhost:4000/mentors/getMentorStuForm2/${studentId}`, {
                headers: {Authorization: `Bearer ${token}`}
            })

            if(res.data.isFilled){
                setEvaluationData(res.data.data.evaluationData);
                setPermanentPlacementInfo(res.data.data.permanentPlacementInfo);
                setMoreStudentsInfo(res.data.data.moreStudentsInfo);
                setIsFilled(true);
            }else{
                setIsFilled(false);
            }
        }

        if(studentId && token)
            fetchForm();
    }, []);

    const fetchdata = async () => {
        try {
            const res = await axios.get(
                `http://localhost:4000/mentors/breifProgressReport/${studentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.data.success) {
                setData(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching student data:", err);
        }
    }

    useEffect(() => {
        if (studentId && token) {
            fetchdata();
        }
    }, [studentId, token])

    if (!data) return <div>Loading...</div>;

    const rollNumber = data?.rollNumber;
    const studentName = data?.studentName;

    const permanentPlacementOptions = [
        "Choose one",
        "Already Placed in our Company",
        "Yes, Considering for Permanent Placement",
        "No, not Considering for Permanent Placement",
        "Student Joined our Organization only for Training",
        "Decision will be made after training gets over",
        "Decision will be made by upper management",
        "No comments",
        "Not applicable",
        "Considering this question as non mandatory, I am not filling it."
    ];

    const moreStudentsOptions = [
        "Choose one...",
        "Yes",
        "No",
        "Decision will be made after training gets over",
        "Decision will be made by upper management",
        "No comments",
        "Not applicable",
        "Considering this question as non mandatory, I am not filling it."
    ];

    const handleMarksChange = (parameter, marks) => {
        setEvaluationData((prev) => (
            prev.map((item) => item.parameter === parameter ? { ...item, marksObtained: marks } : item)
        ))
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                studentId,
                evaluationData,
                permanentPlacementInfo,
                moreStudentsInfo
            }

            const res = await axios.post(
                `http://localhost:4000/mentors/submitMentorStuForm2/${studentId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            )

            if (res.data.success) {
                alert("Form submitted successfully!");
                setIsFilled(true)
            } else {
                alert("Submission failed. Please try again.");
            }
        }catch(err){
            alert("Something went wrong while submitting.");
        }
    }

    return (
        <>
            <Navbar
                navItems={[
                    { name: "Students Doing Project Under You", path: "/mentors/getAssignedStudents" },
                    { name: "Feedback", path: "/mentors/feedback" },
                    { name: "Feedback (for ABET)", path: "/mentors/feedback-abet" },
                    { name: "Change Password", path: "/reset-mentorpassword" },
                ]}
                downloadButton={{
                    text: "Log Out",
                    onClick: () => navigate("/mentors/logout"),
                }}
            />


            <p>Welcome</p>

            <div className={styles.formContainer}>
                <h1>IAP 2nd Visit Form</h1>
                <div className={styles.studentInfo}>
                    <div>
                        <label>Roll Number:</label>
                        <input value={rollNumber || ""} readOnly />
                    </div>
                    <div>
                        <label>Student Name:</label>
                        <input value={studentName || ""} readOnly />
                    </div>
                </div>
                <div>
                    {evaluationData.map((item) => (
                        <DetailsTable key={item.parameter} data={item} handleMarksChange={handleMarksChange} readOnly={isFilled}/>
                    ))}
                </div>
                <div>
                    <label htmlFor="permanent-placement-info">*Are you going to consider Dummy for Permanent Placement   </label>
                    <select disabled={isFilled} id="permanent-placement-info" value={permanentPlacementInfo} onChange={(e) => setPermanentPlacementInfo(e.target.value)} required>
                        {permanentPlacementOptions.map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="more-students-info">*Will you consider more number of students for next Project Semester from Thapar University?   </label>
                    <select disabled={isFilled} id="more-students-info" value={moreStudentsInfo} onChange={(e) => setMoreStudentsInfo(e.target.value)} required>
                        {moreStudentsOptions.map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    {!isFilled && (
                        <>
                            <button onClick={handleSubmit}>Submit</button>
                            <p>(marks once submitted cannot be changed or amended, please make sure while submission)</p>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default mentorStuForm2;