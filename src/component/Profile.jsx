
import React, { useContext, useRef, useState } from 'react';
import { User, Mail, Camera, FileText, Image, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext.jsx';
import Navbar from './Navbar';
import axios from 'axios';

const Profile = () => {
  const { user, logout, isResumeUploaded, updateResumeStatus } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [resumePreview, setResumePreview] = useState(null); // State to hold the preview URL of the resume

  const defaultUser = {
    name: 'Guest User',
    email: 'guest@example.com',
    avatar: 'data:image/jpeg;base64,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', // Placeholder avatar
  };

  const { name, email, avatar } = user || defaultUser;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Error: Only PDF, JPG, and PNG files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Error: File size exceeds 5MB limit.');
      return;
    }

    // Create a preview URL for the uploaded file (for frontend display)
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setResumePreview(url);
    } else {
      setResumePreview(file); // For PDFs, we'll store the file object to create a downloadable link
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/upload-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 200) {
        updateResumeStatus(true);
        alert('Resume uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading resume:', error.response?.data || error.message);
      alert('Failed to upload resume. Please try again.');
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (fileType.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    }
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 transform transition-all duration-300 hover:shadow-2xl">
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#1f8268] shadow-md"
                onError={(e) => {
                  e.target.src = defaultUser.avatar;
                }}
              />
              <div className="absolute bottom-0 right-0 bg-[#1f8268] rounded-full p-2">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-800">{name}</h1>
            <p className="text-gray-500 text-sm">Active User</p>
          </div>

          {/* Profile Details */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-6 h-6 text-[#1f8268]" />
              <div>
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="text-gray-900">{name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-6 h-6 text-[#1f8268]" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-900">{email}</p>
              </div>
            </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
  <div className="w-full">
    
    {isResumeUploaded && (
      <div className="mt-2">
        {typeof resumePreview === 'string' ? (
          <img
            src={resumePreview}
            alt="Resume preview"
            className="max-w-full h-48 object-contain rounded-lg border bg-white"
          />
        ) : null}
      </div>
    )}
  </div>
</div>

          </div>

    

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleLogout}
              className="border border-gray-300 bg-[#1f8268] text-white px-6 py-2 rounded-lg font-semibold hover:text-black hover:bg-gray-400 transition-all duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
        <Link to="/" className="mt-4 text-[#1f8268] hover:text-blue-700 font-medium">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Profile;