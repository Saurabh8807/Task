import React from 'react'
import { useNavigate } from 'react-router-dom'


const Dashboard = () => {
  const navigate = useNavigate()
  const handleclick = ()=>{
    navigate("../manage")
  }
  return (
    <>
    <div>Dashboard</div>
    <button onClick={handleclick}>btn</button>
    </>
  )
}

export default Dashboard