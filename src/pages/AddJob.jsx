


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddJob = () => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    experience: '',
    skills: [],
    postedAt: new Date().toISOString().split('T')[0],
    type: 'Work from office',
    workType: 'Full-Time',
    level: 'Junior',
    role: '',
    description: '',
    responsibilities: '',
    openings: 1,
    requirements: [],
    urgent: false,
    img: 'https://via.placeholder.com/64',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const userData = localStorage.getItem('user');
  if (!userData) {
    navigate('/candidatelogin', { replace: true });
    return;
  }
  try {
    const parsedUser = JSON.parse(userData);
    if (!parsedUser || !parsedUser._id || !/^[0-9a-fA-F]{24}$/.test(parsedUser._id)) {
      localStorage.removeItem('user');
      navigate('/candidatelogin', { replace: true });
      return;
    }
    setUser(parsedUser);
  } catch (err) {
    console.error('Error parsing user data:', err);
    localStorage.removeItem('user');
    navigate('/candidatelogin', { replace: true });
  }
}, [navigate]);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user || !user._id || !/^[0-9a-fA-F]{24}$/.test(user._id)) {
    setError('Invalid user data. Please log in again.');
    navigate('/candidatelogin', { replace: true });
    return;
  }

  // Basic validation
  if (!jobData.title.trim() || !jobData.company.trim() || !jobData.location.trim() || !jobData.salary || !jobData.role.trim() || !jobData.description.trim() || !jobData.responsibilities.trim()) {
    setError('Please fill in all required fields');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    // const token = localStorage.getItem('authToken');
 const response = await axios.get(VITE_JOB_API_URL, {
      ...jobData,
      postedBy: user._id,
    }
    // {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // }
  
  );

    navigate('/dashboard', { replace: true });
  } catch (err) {
    console.error('Error adding job:', err);
    if (err.response && err.response.data) {
      setError(err.response.data.message || 'Failed to add job. Please try again.');
    } else {
      setError('Failed to add job. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'skills') {
      setJobData((prev) => ({ ...prev, skills: value.split(',').map((skill) => skill.trim()).filter(skill => skill) }));
    } else if (name === 'requirements') {
      setJobData((prev) => ({ ...prev, requirements: value.split(',').map((req) => req.trim()).filter(req => req) }));
    } else if (type === 'checkbox') {
      setJobData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setJobData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else if (name === 'salary') {
      setJobData((prev) => ({ ...prev, [name]: parseFloat(value) || '' }));
    } else {
      setJobData((prev) => ({ ...prev, [name]: value }));
    }
  };



  if (!user) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Job</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
            <input type="text" id="title" name="title" value={jobData.title} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., Telecaller Executive" required />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
            <input type="text" id="company" name="company" value={jobData.company} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., Reliance Jio" required />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" id="location" name="location" value={jobData.location} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., Mumbai" required />
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary (in Lakhs P.A.)</label>
            <input type="number" id="salary" name="salary" value={jobData.salary} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., 2.5" step="0.1" min="0" required />
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
            <input type="text" id="experience" name="experience" value={jobData.experience} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., 0-2 years" />
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
            <input type="text" id="skills" name="skills" value={jobData.skills.join(',')} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., Communication,Sales,Customer Service" />
          </div>
          <div>
            <label htmlFor="postedAt" className="block text-sm font-medium text-gray-700">Posted At</label>
            <input type="date" id="postedAt" name="postedAt" value={jobData.postedAt} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Work Mode</label>
            <select id="type" name="type" value={jobData.type} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required>
              <option value="Work from office">Work from Office</option>
              <option value="Work from home">Work from Home</option>
              <option value="Work from field">Work from Field</option>
            </select>
          </div>
          <div>
            <label htmlFor="workType" className="block text-sm font-medium text-gray-700">Work Type</label>
            <select id="workType" name="workType" value={jobData.workType} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
            </select>
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
            <select id="level" name="level" value={jobData.level} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <input type="text" id="role" name="role" value={jobData.role} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., Telecaller" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea id="description" name="description" value={jobData.description} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., Responsible for making outbound calls..." required />
          </div>
          <div>
            <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">Job Responsibilities</label>
            <textarea id="responsibilities" name="responsibilities" value={jobData.responsibilities} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., Handle customer inquiries, maintain call logs..." required />
          </div>
          <div>
            <label htmlFor="openings" className="block text-sm font-medium text-gray-700">Number of Openings</label>
            <input type="number" id="openings" name="openings" value={jobData.openings} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" min="1" required />
          </div>
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Job Requirements (comma-separated)</label>
            <input type="text" id="requirements" name="requirements" value={jobData.requirements.join(',')} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., Good communication skills,Basic computer knowledge" />
          </div>
          <div>
            <label className="flex items-center">
              <input type="checkbox" name="urgent" checked={jobData.urgent} onChange={handleInputChange} className="mr-2" />
              <span className="text-sm font-medium text-gray-700">Urgently Hiring</span>
            </label>
          </div>
          <div>
            <label htmlFor="img" className="block text-sm font-medium text-gray-700">Company Logo URL (optional)</label>
            <input type="text" id="img" name="img" value={jobData.img} onChange={handleInputChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., https://via.placeholder.com/64" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={isLoading} className={`w-full bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isLoading ? 'Adding...' : 'Add Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;