import { Navigate } from 'react-router-dom';

export const MentorProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('mentor-token');
  
  if (!token) {
    return <Navigate to="/mentors/login" replace />;
  }

  return children;
}; 