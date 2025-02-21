import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../../../components/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rollNumber: "",
    branch: "",
    semesterType: "",
    classSubgroup: "",
    trainingArrangedBy: "",
    studentName: "",
    phoneNumber: "",
    email: "",
    companyName: "",
    companyCity: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Function to determine branch from roll number
  const getBranchFromRollNumber = (rollNumber) => {
    if (rollNumber.length === 9) {
      const branchCode = rollNumber.slice(4, 6);

      const branchMap = {
        "Computer Engineering": ["03", "53", "83"],  
        "Computer Science And Engineering": ["16", "17", "66", "67", "96", "97"],  
        "Computer Science And Business System": ["18"],  
      };

      for (const [branch, codes] of Object.entries(branchMap)) {
        if (codes.includes(branchCode)) return branch;
      }

      return "ME Computer Science And Engineering";
    }
    return "";
  };

  const generateSubgroupOptions = () => {
    if (formData.branch === "Computer Engineering") {
      return Array.from({ length: 35 }, (_, i) => `CO${i + 1}`);
    } else if (formData.branch === "Computer Science And Engineering") {
      return Array.from({ length: 15 }, (_, i) => `CS${i + 1}`);
    } else if (formData.branch === "Computer Science And Business System") {
      return Array.from({ length: 15 }, (_, i) => `BS${i + 1}`);
    }
    return [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };
  
      if (name === "rollNumber") {
        const branch = getBranchFromRollNumber(value);
        updatedData.branch = branch;
      }
  
      if (name === "semesterType" && value === "Alternate Semester") {
        updatedData.companyCity = "Patiala";
        updatedData.companyName = "Alternate Semester";
      } else if (name === "semesterType") {
        updatedData.companyCity = "";
        updatedData.companyName = "";
      }
  
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/students/register", {
        email: formData.email,
        name: formData.studentName,
        phoneNumber: formData.phoneNumber,
        rollNo: formData.rollNumber,
        semesterType: formData.semesterType,
        classSubgroup: formData.classSubgroup,
        password: formData.password,
        branch: formData.branch,
        trainingArrangedBy: formData.trainingArrangedBy,
        companyName: formData.companyName,
        companyCity: formData.companyCity,
      });

      if (response.status === 201) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        navigate('/student');
      }
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response.data.error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2">Create New Account</h1>
            <p className="text-gray-600">Please fill in your details to register</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 text-red-600 border border-red-300 rounded-lg">
                <p>{errorMessage}</p>
              </div>
            )}
            
            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 text-green-600 border border-green-300 rounded-lg">
                <p>{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="Student's Roll Number"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  required
                />

                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  readOnly
                  placeholder="Branch"
                  required
                />

                <select
                  name="semesterType"
                  value={formData.semesterType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Semester Type</option>
                  <option value="Project Semester-Research">Project Semester-Research</option>
                  <option value="Project Semester-Company">Project Semester-Company</option>
                  <option value="Start-Up Semester">Start-Up Semester</option>
                  <option value="Alternate Semester">Alternate Semester</option>
                </select>

                {formData.branch === "ME Computer Science And Engineering" ? (
                  <input
                    type="text"
                    name="classSubgroup"
                    placeholder="Class Subgroup"
                    value={formData.classSubgroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <select
                    name="classSubgroup"
                    value={formData.classSubgroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Class Subgroup</option>
                    {generateSubgroupOptions().map((subgroup) => (
                      <option key={subgroup} value={subgroup}>
                        {subgroup}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  name="trainingArrangedBy"
                  value={formData.trainingArrangedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Training Arranged By</option>
                  <option value="college">College</option>
                  <option value="self">Self</option>
                </select>

                <input
                  type="text"
                  name="studentName"
                  placeholder="Student Name"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  required
                />

                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  required
                />

                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  required
                />

                <input
                  type="text"
                  name="companyCity"
                  placeholder="Company City"
                  value={formData.companyCity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  required
                />

                {/* Password fields with eye icons */}
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Register
              </button>

              <div className="text-center space-x-4">
                <Link to="/login" className="text-purple-600 hover:text-purple-700">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
