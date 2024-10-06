import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError } from '../../../redux/slices/authSlice';
import axios from '../../../axios'; 
import { RootState } from '../../../redux/store';
import backgroundImage from '../../../assets/bg.jpg'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    profilePic: null as File | null,
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        profilePic: e.target.files[0],
      });
      setImagePreview(URL.createObjectURL(e.target.files[0])); // Set image preview
    }
  };

  const validateForm = () => {
    const { username, email, contact, password, confirmPassword } = formData;
    let errors = {
      username: "",
      email: "",
      contact: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    // Username validation (only letters and numbers, no special characters)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!username) {
      errors.username = "Username is required.";
      isValid = false;
    } else if (!usernameRegex.test(username)) {
      errors.username = "Username must contain only letters and numbers.";
      isValid = false;
    }

    // Email validation (simple pattern check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "Enter a valid email.";
      isValid = false;
    }

    // Contact validation (exactly 10 digits)
    const contactRegex = /^\d{10}$/;
    if (!contact) {
      errors.contact = "Contact number is required.";
      isValid = false;
    } else if (!contactRegex.test(contact)) {
      errors.contact = "Contact number must be exactly 10 digits.";
      isValid = false;
    }

    // Password validation (password and confirm password must match)
    if (!password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
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
    registrationData.append("username", formData.username);
    registrationData.append("email", formData.email);
    registrationData.append("contact", formData.contact);
    registrationData.append("password", formData.password);

    if (formData.profilePic) {
      registrationData.append("profilePic", formData.profilePic);
    }

    try {
      const response = await axios.post("/auth/register", registrationData);
      // dispatch(setUser({ user: response.data.user }));
      // navigate("../dashboard");
      if (response.status === 201) {
        toast.success("Registered successfully");
        window.alert("Registered successfully");
        navigate("../");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "An error occurred during registration.";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      className="flex items-center py-4 justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <ToastContainer /> {/* Add ToastContainer here */}
      <div className="bg-gray-300 p-8 md:w-1/3 rounded-lg shadow-lg w-96 opacity-90">
        <h1 className="text-3xl font-bold text-center mb-4 text-blue-600">
          Task Management App
        </h1>
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Your Account
        </h2>
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
            {formErrors.username && (
              <span className="text-red-500">{formErrors.username}</span>
            )}
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
            {formErrors.email && (
              <span className="text-red-500">{formErrors.email}</span>
            )}
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
            {formErrors.contact && (
              <span className="text-red-500">{formErrors.contact}</span>
            )}
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
            {formErrors.password && (
              <span className="text-red-500">{formErrors.password}</span>
            )}
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
            {formErrors.confirmPassword && (
              <span className="text-red-500">{formErrors.confirmPassword}</span>
            )}
          </div>
          {imagePreview && (
            <div className="mb-4 flex justify-center">
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}

          <div className="mb-3">
            <input
              type="file"
              name="profilePic"
              onChange={handleFileChange}
              className="mt-1 p-2 border border-gray-900 bg-white rounded-md w-full"
            />
          </div>
          {!imagePreview && (
            <div className="mb-4">
              <span className="text-red-500 mb-4">
                Please upload a profile picture in either JPG or PNG format.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <div className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
