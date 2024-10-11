import React from 'react';

interface EditProfileModalProps {
  formData: {
    username: string;
    email: string;
    contact: string;
    profilePic: File | string | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errorMessage: string;
  toggleModal: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  errorMessage,
  toggleModal
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-4">
            {formData.profilePic && (
              <img
                src={
                  typeof formData.profilePic === 'string'
                    ? formData.profilePic
                    : URL.createObjectURL(formData.profilePic)
                }
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
              />
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Change Profile Picture
            </label>
            <input
              accept="image/*"
              type="file"
              name="profilePic"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Contact
            </label>
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
  );
};

export default EditProfileModal;
