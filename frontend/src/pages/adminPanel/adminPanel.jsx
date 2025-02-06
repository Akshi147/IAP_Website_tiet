// import React from 'react'
import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
import Navbar from '../../components/navbar/navbar';
import Admin from './adminSearchStudent/admin';

const AdminPanel = () => {
  const navigate = useNavigate()
  return (
   <>
    <Navbar
      navItems={[
        { name: "Verify Student", path: "/admin" },
        { name: "Verify Faculty", path: "/verifyfaculty" },
        { name: "Verify Mentor", path: "/mentor" },
        {name:"Change Password",path:"/adminchangepassword"}
      ]}
      downloadButton={{
        text: "Log Out",
        onClick: () => navigate("/adminlogout"),
      }}
    />
    <Admin />
   </>
  )
}

export default AdminPanel;