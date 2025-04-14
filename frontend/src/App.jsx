import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/Home/WelcomePage'
import StudentPanel from './pages/Student/StudentPanel'
import { LoginForm } from './pages/Student/component/LoginForm';
import { RegisterForm } from './pages/Student/component/RegisterForm';
import StudentProtectedRoute from './pages/Student/StudentProtectedRoute';
import FacultyProtectedRoute from './pages/Faculty/FacultyProtectedRoute';
import AdminProtectedRoute from './pages/Admin/AdminProtected';
import StudentLogout from './pages/Student/component/StudentLogout';
import ForgotStudentPassword from './pages/Student/component/ForgotPassword';
import AdminLogout from './pages/Admin/component/AdminLogout';
import { LoginFormFaculty } from './pages/Faculty/component/LoginFaculty';
import FacultyLogout from './pages/Faculty/component/FacultyLogout';
import { FacultyRegister } from './pages/Faculty/component/RegisterFaculty';
import FacultyPanel from './pages/Faculty/FacultyPanel';
import StudentVerification from './pages/Admin/component/VerifyDocument';
import { AdminLogin } from './pages/Admin/component/AdminLogin';
import AdminPanel from './pages/Admin/AdminPanel';
import ForgotAdminPassword from './pages/Admin/component/ForgotAdminPassword';
import ChangeAdminPassword from './pages/Admin/component/ChangeAdminPassword';
import ResetPassword from './pages/Student/component/ResetPassword';
import UnderDocumentVerification from './pages/Admin/component/Underdocumentverification';
import UnderPhase2Verification from './pages/Admin/component/UnderPhase2Verification';
import DeleteStudent from './pages/Admin/component/DeleteStudent';
import GenerateExcel from './pages/Admin/component/GenerateExcel';
import {MentorLogin} from './pages/Mentor/MentorLogin';
import {MentorProtectedRoute} from './pages/Mentor/MentorProtectedRoute';
import MentorPanel from './pages/Mentor/MentorPanel';
import { MentorRegister } from './pages/Mentor/MentorRegister';
import BriefProgressReport  from './pages/Mentor/SeeForm1';
import { MentorSetPassword } from './pages/Mentor/MentorSetPassword';
import ForgotMentorPassword from './pages/Mentor/ForgotMentorPassword.jsx';
import ResetMentorPassword from './pages/Mentor/ResetMentorPassword.jsx';
import FreezeAndUnfreeze from './pages/Admin/component/freezeforms.jsx';
import StudentDashboard from './pages/Student/component/Dashboard.jsx';
import Fortnightly from './pages/Student/component/Fortnightly.jsx';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/student" element={
          <StudentProtectedRoute>
            <StudentPanel />
          </StudentProtectedRoute>
        } />
        <Route path="/fortnightly" element={
          <StudentProtectedRoute>
            <Fortnightly />
          </StudentProtectedRoute>
        } />
        <Route path="/student/logout" element={
          <StudentProtectedRoute>
            <StudentLogout />
          </StudentProtectedRoute>
        } />
        <Route path="/faculty/logout" element={
          <FacultyProtectedRoute>
            <FacultyLogout />
          </FacultyProtectedRoute>
        } />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/facultylogin" element={<LoginFormFaculty />} />
        <Route path="/facultyregister" element={<FacultyRegister />} />
        <Route path="/faculty" element={

          <FacultyProtectedRoute>
            <FacultyPanel />
          </FacultyProtectedRoute>
        } />
        <Route path="/admin/verifyStudentDocument/:rollNumber" element={
          <AdminProtectedRoute>
            <StudentVerification />
          </AdminProtectedRoute>
        } />
        <Route path="/generateExcel" element={
          <AdminProtectedRoute>
            <GenerateExcel />
          </AdminProtectedRoute>
        } />
        <Route path="/freezeforms" element={
          <AdminProtectedRoute>
            <FreezeAndUnfreeze />
          </AdminProtectedRoute>
        } />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminPanel />
          </AdminProtectedRoute>
        } />
        <Route path="/adminlogout" element={
          <AdminProtectedRoute>
            <AdminLogout />
          </AdminProtectedRoute>
        } />
        <Route path="/forgotadminpassword" element={<ForgotAdminPassword/>} />
        <Route path="/adminchangepassword" element={
          <AdminProtectedRoute>
            <ChangeAdminPassword />
          </AdminProtectedRoute>
          
          } />
        <Route path="/forgotstudentpassword" element={<ForgotStudentPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/underdocumentverification" element={
          <AdminProtectedRoute>
            <UnderDocumentVerification />
          </AdminProtectedRoute>
        } />
        <Route path="/phase2verification" element={
          <AdminProtectedRoute>
            <UnderPhase2Verification />
          </AdminProtectedRoute>
        } />
        <Route path="/deletestudent" element=
        {
          <AdminProtectedRoute>
            <DeleteStudent/>
          </AdminProtectedRoute>
        
      
      } 
      
      
      
      />
      <Route path="/mentorlogin" element={<MentorLogin/>} />
      <Route path="/mentor" element={
        <MentorProtectedRoute>
          <MentorPanel/>
        </MentorProtectedRoute>
      } />
      <Route path='/seeform1/:id' element={
        <MentorProtectedRoute>
          <BriefProgressReport/>
        </MentorProtectedRoute>
      } />
      <Route path="/mentorregister" element={<MentorRegister />} />
      <Route path="/mentor/setPassword" element={<MentorSetPassword />} />
      <Route path='/mentor/forgot-password' element={<ForgotMentorPassword />} />
      <Route path='/reset-mentorpassword' element={<ResetMentorPassword />} />
      <Route path='/dashboard' element={
          <StudentProtectedRoute>
            <StudentDashboard />
          </StudentProtectedRoute>
        } />

      </Routes>
      

    </div>
  );
};

export default App;
