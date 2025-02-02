import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import FacultyVerify from "./facultyVerify/facultyVerify";
import FacultyDashboard from './facultyDashboard/facultyDashboard';
import FacultyPendingApproval from "./facultyPendingApproval/facultyPendingApproval";

const FacultyPanel = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [facultyData, setFacultyData] = useState(null);

    useEffect(() => {
        const fetchFacultyProfile = async () => {
            try {
                const token = localStorage.getItem("faculty-token");
                if (!token) {
                    navigate("/faculty/login");
                    return;
                }

                const response = await axios.get("http://localhost:4000/faculty/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Faculty Profile:", response.data);
                setFacultyData(response.data.faculty);
            } catch (error) {
                console.error("Error fetching faculty profile:", error);
                navigate("/faculty/login");
            } finally {
                setLoading(false);
            }
        };

        fetchFacultyProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    // Case 1: Email not verified → Show Verify Component
    if (facultyData && !facultyData.emailverified) {
        return (
            <>
                <Navbar
                    navItems={[
                        { name: "Home", path: "/" },
                        { name: "Help", path: "/help" },
                    ]}
                    downloadButton={{
                        text: "Log Out",
                        onClick: () => navigate("/faculty/logout"),
                    }}
                />
                <FacultyVerify />
            </>
        );
    }

    // Case 2: Email verified but waiting for admin approval → Show PendingApproval Component
    if (facultyData && facultyData.emailverified && !facultyData.facultyverified) {
        return (
            <>
                <Navbar
                    navItems={[
                        { name: "Home", path: "/" },
                        { name: "Contact Admin", path: "/contact" },
                    ]}
                    downloadButton={{
                        text: "Log Out",
                        onClick: () => navigate("/faculty/logout"),
                    }}
                />
                <FacultyPendingApproval />
            </>
        );
    }

    // Case 3: Both email and faculty verification complete → Show Faculty Panel
    return (
        <>
            <Navbar
                navItems={[
                    { name: "Upload Marks", path: "/uploadmarks" },
                    { name: "Search Student", path: "/searchstudent" },
                    { name: "Profile", path: "/faculty/profile" },
                ]}
                downloadButton={{
                    text: "Log Out",
                    onClick: () => {
                        localStorage.removeItem("faculty-token");
                        navigate("/faculty/logout");
                    },
                }}
            />
            <FacultyDashboard />
        </>
    );
};

export default FacultyPanel;