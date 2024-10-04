import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store'; 
import { clearUser } from '../../redux/slices/authSlice'; 

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const user = useSelector((state: RootState) => state.auth.user);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(clearUser()); 
    navigate('/'); 
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-white text-2xl font-bold hover:text-gray-300">
              Task Management
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:space-x-8">
            <Link to="/dashboard"  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-lg font-medium transition duration-200">
              Dashboard
            </Link>
            <Link to="/manage"className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-lg font-medium transition duration-200">
              ManageTask
            </Link>
          </div>

          {/* Mobile Menu Toggle and Profile Picture */}
          <div className="flex items-center md:hidden">
            {user && (
              <Link to="/profile">
              <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
              </Link>

            )}
            <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {/* User Profile & Logout (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center text-white">
                <Link to="/profile" onClick={toggleMenu} className='flex'>
                  <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                  <span className="font-medium">{user.username}</span>
                </Link>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-lg font-medium ml-4 transition duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/dashboard" onClick={toggleMenu} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-200">
            Dashboard
          </Link>
          <Link to="/manage" onClick={toggleMenu} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-200">
            ManageTask
          </Link>
          {user && (
            <div className="flex items-center text-white">

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-lg font-medium ml-4 transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
