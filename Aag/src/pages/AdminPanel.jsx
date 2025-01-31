import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import axios from 'axios'
import Admin from '../components/Admin'

const AdminPanel = () => {
  return (
   <>
    <Header
      navItems={[
        { name: "Home", path: "/" },
        { name: "Help", path: "/help" },
      ]}
      downloadButton={{
        text: "Log Out",
        onClick: () => navigate("/admin/logout"),
      }}
    />
    <Admin />
    <Footer />
   
   </>
  )
}

export default AdminPanel