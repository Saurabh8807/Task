import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store'; 
const AppLayout: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn); 

  return (
    <div className="app">
      { isLoggedIn&& <Navbar />} 
      <Outlet />  
      {isLoggedIn && <Footer />}
    </div>
  );
};

export default AppLayout;
