import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";

const StudentAssignedFaculty = () => {
    const navigate = useNavigate();
    return(
        <>
            <Navbar
                    navItems={[
                      { name: "Dashboard", path: "/dashboard" },
                      {name: "Phase 2", path: "/student"},
                      {name: "Faculty Assigned", path: "faculty-assigned"},
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
        </>
    )
}

export default StudentAssignedFaculty;