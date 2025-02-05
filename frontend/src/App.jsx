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



      </Routes>
    </div>
  );
};

export default App;
