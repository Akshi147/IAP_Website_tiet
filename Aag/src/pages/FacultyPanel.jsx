import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useNavigate } from "react-router-dom";
import Verify from "../components/Verify";
import Faculty from "../components/Faculty";
import PendingApproval from "../components/PendingApproval";

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
                <Header
                    navItems={[
                        { name: "Home", path: "/" },
                        { name: "Help", path: "/help" },
                    ]}
                    downloadButton={{
                        text: "Log Out",
                        onClick: () => navigate("/faculty/logout"),
                    }}
                />
                <Verify />
                <Footer />
            </>
        );
    }

    // Case 2: Email verified but waiting for admin approval → Show PendingApproval Component
    if (facultyData && facultyData.emailverified && !facultyData.facultyverified) {
        return (
            <>
                <Header
                    navItems={[
                        { name: "Home", path: "/" },
                        { name: "Contact Admin", path: "/contact" },
                    ]}
                    downloadButton={{
                        text: "Log Out",
                        onClick: () => navigate("/faculty/logout"),
                    }}
                />
                <PendingApproval />
                <Footer />
            </>
        );
    }

    // Case 3: Both email and faculty verification complete → Show Faculty Panel
    return (
        <>
            <Header
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
            <Faculty />
            <Footer />
        </>
    );
};

export default FacultyPanel;
