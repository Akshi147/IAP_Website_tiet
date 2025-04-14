import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // ⬅️ import this

export default function BriefProgressReport() {
  const { id: studentId } = useParams(); // ⬅️ extract studentId from the URL
  const [data, setData] = useState(null);
  const [editable, setEditable] = useState(true);
  const token = localStorage.getItem("mentor-token"); // ⬅️ get token from localStorage
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/mentors/breifProgressReport/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error("Error fetching progress report:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      progressReport: {
        ...prev.progressReport,
        [name]: value,
      },
    }));
  };

  useEffect(() => {
    if (studentId && token) fetchData();
  }, [studentId, token]);

  useEffect(() => {
    if (data && studentId && token) {
      const payload = data.progressReport;
      axios.post(
        `http://localhost:4000/mentors/submitBriefProgressReport/${studentId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  }, [data, studentId, token]);

  if (!data) return <div>Loading...</div>;

  const { rollNumber, studentName, companyName, companyAddress, dateOfVisit, progressReport } = data;

  return (
    <div className="p-6 max-w-4xl mx-auto text-sm text-gray-800">
      <h2 className="text-center text-purple-500 text-lg font-semibold mb-4">
        PROJECT SEMESTER INFORMATION
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>Roll Number: <input value={rollNumber || ""} disabled className="input" /></div>
        <div>Date of visit: <input type="date" value={dateOfVisit?.split("T")[0] || ""} disabled className="input" /></div>
        <div>Student Name: <input value={studentName || ""} disabled className="input" /></div>
        <div>Company/Organization Name: <input value={companyName || ""} disabled className="input" /></div>
        <div className="col-span-2">Company/Organization Address:
          <textarea value={companyAddress || ""} disabled className="input w-full" />
        </div>
      </div>

      <h3 className="mt-6 mb-2 text-purple-700 font-bold">
        Brief Progress Report <span className="font-normal">(To be filled by Industrial Mentor)</span>
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>Topic/Title of the Project:
          <input
            className="input"
            name="topicOfProject"
            value={progressReport.topicOfProject || ""}
            onChange={handleChange}
            disabled={!editable}
          />
        </div>
        <div>Type of Project:
          <select
            className="input"
            name="typeOfProject"
            value={progressReport.typeOfProject || ""}
            onChange={handleChange}
            disabled={!editable}
          >
            <option value="">Choose One...</option>
            <option value="Software Development">Software Development</option>
            <option value="Research">Research</option>
            <option value="Field Work">Field Work</option>
          </select>
        </div>

        {[1, 2, 3].map((num) => (
          <div key={num} className="col-span-2">
            <label className="block font-medium">Assignment {num}</label>
            <textarea
              className="input w-full"
              name={`assignment${num}Details`}
              value={progressReport[`assignment${num}Details`] || ""}
              onChange={handleChange}
              disabled={!editable}
            />
            <select
              className="input mt-1"
              name={`assignment${num}Status`}
              value={progressReport[`assignment${num}Status`] || ""}
              onChange={handleChange}
              disabled={!editable}
            >
              <option>Choose One...</option>
              <option>On Going</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </div>
        ))}

        <div>HR Name:
          <input
            className="input"
            name="hrName"
            value={progressReport.hrName || ""}
            onChange={handleChange}
            disabled={!editable}
          />
        </div>
        <div>HR Contact No.:
          <input
            className="input"
            name="hrContactNumber"
            value={progressReport.hrContactNumber || ""}
            onChange={handleChange}
            disabled={!editable}
          />
        </div>
        <div className="col-span-2">HR Email Id:
          <input
            className="input w-full"
            name="hrEmailId"
            value={progressReport.hrEmailId || ""}
            onChange={handleChange}
            disabled={!editable}
          />
        </div>

        <div className="col-span-2">Remarks of Industry Coordinator:
          <textarea
            className="input w-full"
            name="remarksByIndustryCoordinator"
            value={progressReport.remarksByIndustryCoordinator || ""}
            onChange={handleChange}
            disabled={!editable}
          />
        </div>
      </div>
    </div>
  );
}
