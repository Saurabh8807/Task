import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { FaUserEdit } from "react-icons/fa";
import axios from "../../../axios";
import { updateUserProfile, User } from "../../../redux/slices/authSlice";
import TaskShimmer from "../../Shimmer/Shimmer";
import backgroundImage from "../../../assets/bg3.jpg";
import EditProfileModal from "./EditProfileModal";
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const user: User | any = useSelector((state: RootState) => state.auth.user);
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    contact: user?.contact || "",
    profilePic: user?.profilePic || (null as File | null),
  });

  const toggleModal = () => {
    setErrorMessage("");
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
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(formData.contact)) {
      setErrorMessage("Please enter a valid 10-digit contact number.");
      return;
    }

    const updatedProfile = {
      username: formData.username,
      email: formData.email,
      contact: formData.contact,
    };

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", updatedProfile.username);
      formDataToSend.append("email", updatedProfile.email);
      formDataToSend.append("contact", updatedProfile.contact);
      if (formData.profilePic) {
        formDataToSend.append("profilePic", formData.profilePic);
      }

      const response = await axios.put(`/user/${user?.id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        dispatch(
          updateUserProfile({
            id: response.data.user._id,
            username: response.data.user.username,
            email: response.data.user.email,
            contact: response.data.user.contact,
            profilePic: response.data.user.profilePicUrl,
          })
        );
        
        toggleModal();
        
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(
          error.response.data.message || "Error updating profile"
        );
      } else {
        setErrorMessage(
          "An error occurred while updating the profile. Please try again."
        );
      }
      
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="text-center text-lg font-semibold">
        <TaskShimmer />
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
      }}
    >
            <ToastContainer />

      <div className="bg-white shadow-2xl rounded-lg w-full max-w-xl p-8 relative">
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

        <div className="absolute top-4 right-4">
          <button
            onClick={toggleModal}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-200 ease-in-out"
          >
            <FaUserEdit size={20} className="mr-2" />
            <span className="text-sm font-medium">Edit Profile</span>
          </button>
        </div>

        {isModalOpen && (
          <EditProfileModal
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            errorMessage={errorMessage}
            toggleModal={toggleModal}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
