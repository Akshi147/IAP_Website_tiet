import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/header'
import { Footer } from '../../components/footer'
import axios from 'axios'
import Admin from './component/Admin'

const AdminPanel = () => {
  const navigate = useNavigate()
  return (
   <>
    <Header
      navItems={[
        { name: "Verify Student", path: "/admin" },
        { name: "Verify Faculty", path: "/verifyfaculty" },
        { name: "Verify Mentor", path: "/mentor" },
      ]}
      downloadButton={{
        text: "Log Out",
        onClick: () => navigate("/adminlogout"),
      }}
    />
    <Admin />
    <Footer />
   
   </>
  )
}

export default AdminPanel