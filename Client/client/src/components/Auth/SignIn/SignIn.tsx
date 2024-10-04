import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError } from '../../../redux/slices/authSlice';
import axios from '../../../axios'; 
import { RootState } from '../../../redux/store'; 
import { useNavigate, Link } from 'react-router-dom'; 
import backgroundImage from '../../../assets/bg.jpg'; 

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const validateForm = () => {
    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));
    setFormError('');

    if (!validateForm()) {
      dispatch(setLoading(false));
      return; 
    }

    try {
      const response = await axios.post('/auth/login', { email, password });
      navigate('./dashboard');
      dispatch(setUser({ user: response.data.user }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred during login. Please try again.';
      dispatch(setError(errorMessage));
      setFormError(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: `url(${backgroundImage})` }} 
    >
      <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-96 opacity-90">
      <h1 className="text-3xl font-bold text-center mb-4 text-blue-600">Task Management App</h1>

        <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email" 
              className="mt-1 p-2 border border-gray-900 bg-white rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" 
              className="mt-1 p-2 border border-gray-900 bg-white rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition duration-200`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {!error && formError && <div className="mt-4 text-red-500 text-center">{formError}</div>}
          {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-700">Don't have an account? </span>
          <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
