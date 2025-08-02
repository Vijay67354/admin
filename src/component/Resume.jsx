import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, X, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import
import Navbar from './Navbar';
import 'react-toastify/dist/ReactToastify.css';

import { toast, ToastContainer } from 'react-toastify';
const Resume = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Add this line to use navigation

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only PDF, JPG, or PNG files');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setUploadedFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else if (fileType.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    }
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

const handleSubmit = async () => {
 
  if (!uploadedFile) {
    alert('Please upload a resume first');
    return;
  }

  const formData = new FormData();
  formData.append('resume', uploadedFile);

  try {
    const response = await fetch('https://adminsite-1-l247.onrender.com/api/upload-resume', {
      method: 'POST',
      body: formData,
    });
   toast.success("Resume submitted successfully!");
    const data = await response.json();

    if (response.ok) {
  
      console.log('Uploaded file details:', data.file);
      // Set resume uploaded flag in localStorage
      localStorage.setItem('resumeUploaded', 'true');
      // Navigate to /dashboard after 5 seconds
      setTimeout(() => {
        navigate('/');
      }, 4500);
    } else {
      throw new Error(data.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Upload failed. Please try again.');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Your Resume
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume to get started with job applications. We support PDF, JPG, and PNG formats.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragging
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInputChange}
            />

            <div className="flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`w-12 h-12 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isDragging ? 'Drop your resume here' : 'Drag & drop your resume'}
                </h3>
                <p className="text-gray-600 mb-4">
                  or <span className="text-blue-600 font-medium cursor-pointer hover:underline">browse files</span>
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, JPG, PNG • Max size 5MB
                </p>
              </div>
            </div>
          </div>

          {uploadedFile && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getFileIcon(uploadedFile.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900 truncate">
                      {uploadedFile.name}
                    </h4>
                    <button
                      onClick={removeFile}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span>{formatFileSize(uploadedFile.size)}</span>
                    <span>•</span>
                    <span>{uploadedFile.type.split('/')[1].toUpperCase()}</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">Ready to upload</span>
                  </div>

                  {previewUrl && (
                    <div className="mt-4">
                      <img
                        src={previewUrl}
                        alt="Resume preview"
                        className="max-w-full h-48 object-contain rounded-lg border bg-white"
                      />
                    </div>
                  )}

                  {uploadedFile.type === 'application/pdf' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 text-sm">
                        PDF uploaded successfully. Preview will be available after submission.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!uploadedFile}
              className={`px-8 py-3 rounded-xl bg-green-800 font-semibold text-white transition-all duration-300 ${
                uploadedFile
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {uploadedFile ? 'Submit Resume' : 'Upload Resume First'}
            </button>
             <ToastContainer position="top-center" autoClose={2000} />
          </div>
        </div>

       
      </main>
    </div>
  );
};

export default Resume;