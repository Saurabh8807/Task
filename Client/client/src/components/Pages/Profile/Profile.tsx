import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store'; 
import { FaUserEdit } from 'react-icons/fa';
import axios from '../../../axios'; 
import { updateUserProfile, User } from '../../../redux/slices/authSlice'; 
import TaskShimmer from '../../Shimmer/Shimmer'

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const user: User | any  = useSelector((state: RootState) => state.auth.user);
  const [errorMessage, setErrorMessage] = useState(''); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    contact: user?.contact || '',
    profilePic: user?.profilePic || null as File | null,
  });

  const toggleModal = () => {
    setErrorMessage('')
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setFormData({
        username: user.username,
        email: user.email,
        contact: user.contact,
        profilePic: user.profilePic,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        profilePic: file,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedProfile = {
      username: formData.username,
      email: formData.email,
      contact: formData.contact,
    };

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', updatedProfile.username);
      formDataToSend.append('email', updatedProfile.email);
      formDataToSend.append('contact', updatedProfile.contact);
      if (formData.profilePic) {
        formDataToSend.append('profilePic', formData.profilePic); 
      }

      const response = await axios.put(`/user/${user?.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      if (response.status === 200) {
        dispatch(updateUserProfile({
          id: response.data.user._id,
          username: response.data.user.username,
          email: response.data.user.email,
          contact: response.data.user.contact,
          profilePic: response.data.user.profilePicUrl,
        }));
        toggleModal(); 
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message || 'Error updating profile');
      } else {
        setErrorMessage('An error occurred while updating the profile. Please try again.');
      }    }
  };

  if (!user) {
    return <div className="text-center text-lg font-semibold"><TaskShimmer/></div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r bg-gray-400 p-6">
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-xl p-8 relative">
        {/* Profile Picture */}
        <div className="flex justify-center -mt-16">
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-8 border-white shadow-lg transition duration-200 hover:scale-105 hover:shadow-2xl"
          />
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
          <p className="text-lg text-gray-500">{user.email}</p>
          <p className="mt-2 text-sm text-gray-600">Contact: {user.contact}</p>
        </div>

        <div className="my-6 border-t border-gray-200"></div>

        <div className="flex justify-center mt-6">
          <button
            onClick={toggleModal}
            className="flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-3 rounded-full hover:bg-gradient-to-l hover:from-purple-500 hover:to-blue-400 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <FaUserEdit className="mr-2" />
            Edit Profile
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Edit Profile</h2>

              <form onSubmit={handleSubmit}>
                {/* Profile Picture Upload */}
                <div className="flex justify-center mb-4">
                  {formData.profilePic && (
                    <img
                      src={formData.profilePic}
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
                    />
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Change Profile Picture</label>
                  <input
                    type="file"
                    name="profilePic"
                    onChange={handleFileChange}
                    className="mt-1 block w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                {errorMessage && (
                <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-center">
                  {errorMessage}
                </div>
              )}
                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
