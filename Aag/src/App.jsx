import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage'
import StudentPanel from './pages/StudentPanel'
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import StudentProtectedRoute from './pages/StudentProtectedRoute';
import StudentLogout from './components/StudentLogout';

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
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/register" element={<RegisterForm/>} />
        </Routes>
      </div>
  );
};

export default App;
