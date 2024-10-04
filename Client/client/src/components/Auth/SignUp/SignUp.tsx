import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError } from '../../../redux/slices/authSlice';
import axios from '../../../axios'; 
import { RootState } from '../../../redux/store';
import backgroundImage from '../../../assets/bg.jpg'; 
import { useNavigate, Link } from 'react-router-dom'; 

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
    profilePic: null as File | null,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        profilePic: e.target.files[0],
      });
    }
  };

  const validateForm = () => {
    const { username, email, contact, password, confirmPassword } = formData;
    if (!username || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields.'); 
      return false;
    }
  const contactRegex = /^\d{10}$/;
  
  if (!contactRegex.test(contact)) {
    setFormError('Contact number must be exactly 10 digits.');
    return false;
  }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.'); 
      return false;
    }
    setFormError(null); 
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null)); 

    if (!validateForm()) {
      dispatch(setLoading(false)); 
      return; 
    }

    const registrationData = new FormData();
    registrationData.append('username', formData.username);
    registrationData.append('email', formData.email);
    registrationData.append('contact', formData.contact);
    registrationData.append('password', formData.password);

    if (formData.profilePic) {
      registrationData.append('profilePic', formData.profilePic);
    }

    try {
      const response = await axios.post('/auth/register', registrationData);
      console.log(registrationData);
      console.log(response);
      dispatch(setUser({ user: response.data.user }));
      navigate('../dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred during registration.';
      dispatch(setError(errorMessage));
      setFormError(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div 
      className="flex items-center py-4 justify-center min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-gray-300 p-8 md:w-1/3 rounded-lg shadow-lg w-96 opacity-90">
        <h1 className="text-3xl font-bold text-center mb-4 text-blue-600">Task Management App</h1>
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleInputChange} 
              placeholder="Username" 
               
              className="mt-1 p-2 border border-gray-900 bg-white rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              placeholder="Email" 
               
              className="mt-1 p-2 border border-gray-900 bg-white rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input 
              type="text" 
              name="contact" 
              value={formData.contact} 
              onChange={handleInputChange} 
              placeholder="Contact" 
               
              className="mt-1 p-2 border border-gray-900 bg-white rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input 
              type={showPassword ? "text" : "password"}
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              placeholder="Password" 
               
              className="mt-1 p-2 border border-gray-900 bg-white rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="text-black"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="mb-4">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
              placeholder="Confirm Password" 
               
              className="mt-1 p-2 border border-gray-900 bg-white rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className="text-black"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="mb-4">
            <input 
              type="file" 
              name="profilePic" 
              onChange={handleFileChange} 
              className="mt-1 p-2 border border-gray-900 bg-white rounded-md w-full"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition duration-200`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          {!error && formError && <div className="mt-4 text-red-500 text-center">{formError}</div>} 
          {error && <div className="mt-4 text-red-500 text-center">{error}</div>} 
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-700">Already have an account? </span>
          <Link to="/" className="text-blue-500 hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
