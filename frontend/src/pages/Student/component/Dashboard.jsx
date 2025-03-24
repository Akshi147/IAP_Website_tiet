import { useEffect, useState } from 'react';
import { CheckCircleIcon, DocumentTextIcon, UserCircleIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Header } from '../../../components/header';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Handle redirect to login
          return;
        }

        const response = await fetch('http://localhost:4000/students/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        setStudentData(data.student);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!studentData) {
    return <div className="text-center mt-8 text-red-500">Error loading student data</div>;
  }

  // Checkpoints configuration
  const checkpoints = [
    {
      title: 'Email Verification',
      completed: studentData.verified,
      icon: <CheckCircleIcon className="w-6 h-6" />,
      description: 'Verify your email address to continue'
    },
    {
      title: 'Document Submission',
      completed: studentData.trainingLetter && studentData.feeReceipt,
      icon: <DocumentTextIcon className="w-6 h-6" />,
      description: 'Submit Training Letter and Fee Receipt'
    },
    {
      title: 'Document Verification',
      completed: studentData.mentorverified,
      icon: <UserCircleIcon className="w-6 h-6" />,
      description: 'Waiting for Admin approval'
    },
    {
      title: 'Phase 2 Verification',
      completed: studentData.phase3verified,
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      description: 'Final phase verification'
    }
  ];

  const allVerified = studentData.verified && 
                     studentData.mentorverified && 
                     studentData.phase3verified &&
                     studentData.trainingLetter && 
                     studentData.feeReceipt;

  return (
    <>
    <Header
                navItems={[
                  { name: "Continue on Process", path: "/student" },
                ]}
                downloadButton={{
                  text: "Log Out",
                  onClick: () => navigate("/student/logout"),
                }}
              />
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <UserCircleIcon className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{studentData.name}</h1>
              <p className="text-gray-600">{studentData.branch}</p>
              <p className="text-gray-600">{studentData.email}</p>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Academic Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Academic Information</h2>
            <div className="space-y-3">
              <DetailItem label="Roll No" value={studentData.rollNo} />
              <DetailItem label="Semester" value={studentData.semesterType} />
              <DetailItem label="Subgroup" value={studentData.classSubgroup} />
              <DetailItem label="Mentor" value={studentData.mentorName} />
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Company Details</h2>
            <div className="space-y-3">
              <DetailItem label="Company Name" value={studentData.companyDetails?.companyName} />
              <DetailItem label="Location" value={`${studentData.companyDetails?.companyCity}, ${studentData.companyDetails?.companyCountry}`} />
              <DetailItem label="Address" value={studentData.companyDetails?.completeAddress} />
              <DetailItem label="Stipend" value={`₹${studentData.stipend}/month`} />
            </div>
          </div>
        </div>

        {/* Verification Progress */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Verification Status</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {checkpoints.map((checkpoint, index) => (
              <div key={index} className={`p-4 rounded-lg border ${checkpoint.completed ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${checkpoint.completed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {checkpoint.icon}
                  </div>
                  <h3 className="font-medium text-gray-700">{checkpoint.title}</h3>
                </div>
                <p className={`text-sm ${checkpoint.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {checkpoint.completed ? 'Completed' : checkpoint.description}
                </p>
              </div>
            ))}
          </div>

          {allVerified && (
            <div className="mt-8 bg-indigo-50 p-6 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-4">
                <ClockIcon className="w-8 h-8 text-indigo-600" />
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700">Fortnightly Reports</h3>
                  <p className="text-indigo-600">Submit your fortnightly training reports</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
    
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-700 font-medium">{value || 'N/A'}</span>
  </div>
);

export default StudentDashboard;