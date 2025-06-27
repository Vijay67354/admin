import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const JobOpeningDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Job data with valid ObjectId-like _id values
  const initialJobs = [
    {
      _id: '507f1f77bcf86cd799439011', // Example valid ObjectId
      title: 'home',
      company: 'home',
      location: 'home',
      salary: '100',
      type: 'Work from office',
      level: 'Freshers only',
      experience: '0-1 years',
      workType: 'Full-Time',
      role: 'home',
      postedAt: '2025-06-01',
      openings: 5,
      applicants: 14,
      description: 'home',
      responsibilities: 'home',
      skills: ['JavaScript'],
      requirements: ['B.Tech in Computer Science', 'Basic understanding of JavaScript'],
      urgent: true,
    },
  ];

  const { jobs: stateJobs = initialJobs, company = 'home', jobType = 'fresher' } = state || {};

  const [jobs, setJobs] = useState(stateJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    datePosted: 'all',
    salary: 0,
    workMode: { home: false, office: false, field: false },
  });
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [currentJobId, setCurrentJobId] = useState(null);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const filteredJobs = jobs.filter((job) => {
    const postedDate = new Date(job.postedAt);
    const today = new Date('2025-06-07');
    const diffDays = Math.ceil((today - postedDate) / (1000 * 60 * 60 * 24));

    if (filters.datePosted === 'last24hours' && diffDays > 1) return false;
    if (filters.datePosted === 'last3days' && diffDays > 3) return false;
    if (filters.datePosted === 'last7days' && diffDays > 7) return false;

    const jobSalary = typeof job.salary === 'string'
      ? parseFloat(job.salary.match(/([\d.]+)/)?.[1]) || 0
      : job.salary || 0;
    if (jobSalary < filters.salary) return false;

    if (filters.workMode.home && job.type !== 'Work from home') return false;
    if (filters.workMode.office && job.type !== 'Work from office') return false;
    if (filters.workMode.field && job.type !== 'Work from field') return false;

    return true;
  });

  const calculateDaysAgo = (postedAt) => {
    const postedDate = new Date(postedAt);
    const today = new Date('2025-06-07');
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const handleApplyJob = (jobId) => {
    setCurrentJobId(jobId);
    setShowEmailPopup(true);
  };

  const sendEmail = async (jobDetails) => {
    try {
      const emailData = {
        email,
        jobDetails: {
          title: jobDetails.title || 'Unknown',
          company: jobDetails.company || 'Unknown',
          location: jobDetails.location || 'Unknown',
          salary: jobDetails.salary || 'N/A',
          type: jobDetails.type || 'N/A',
          workType: jobDetails.workType || 'N/A',
          experience: jobDetails.experience || 'N/A',
          skills: jobDetails.skills || [],
          description: jobDetails.description || 'No description available',
          responsibilities: jobDetails.responsibilities || 'No responsibilities listed',
          requirements: jobDetails.requirements || [],
          openings: jobDetails.openings || 'N/A',
          postedAt: jobDetails.postedAt || new Date().toISOString(),
        },
      };

      await axios.post(REACT_APP_SEND_EMAIL, emailData);
      toast.success('Email sent successfully! You can now apply.');
      setShowEmailPopup(false);

      await axios.post(
        `http://localhost:5006/api/jobs/${jobDetails._id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } }
      );

      toast.success('Applied successfully!');

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobDetails._id ? { ...job, applicants: (job.applicants || 0) + 1 } : job
        )
      );

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Error sending email:', err.response ? err.response.data : err.message);
      toast.error('Failed to send email. Please try again.');
    }
  };

  const handleEmailNext = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    const jobDetails = jobs.find((job) => job._id === currentJobId);
    if (jobDetails) {
      await sendEmail(jobDetails);
    }
  };

  const closePopup = () => {
    setSelectedJob(null);
  };

  if (!jobs.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">No jobs found for {company || jobType}.</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-[1250px] p-4">
      {/* Back button */}
      <Link to="/">
        <img src='/images/right-arrow.png' className='w-4 h-4 mt-4 mb-3 rotate-[90deg]' />
      </Link>

      {/* Job count and title */}
      <div>
        <h1 className="text-2xl font-bold text-black">
          {filteredJobs.length}{' '}
          {jobType === 'fresher'
            ? 'Fresher Jobs'
            : jobType === 'workFromHome'
            ? 'Work from Home Jobs'
            : `Job${filteredJobs.length !== 1 ? 's' : ''} at ${company}`}
        </h1>
      </div>

      {/* Main layout: Filters, Job List */}
      <div className="mt-5 flex gap-6">
        {/* Filters Section */}
        <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <button
              onClick={() =>
                setFilters({
                  datePosted: 'all',
                  salary: 0,
                  workMode: { home: false, office: false, field: false },
                })
              }
              aria-label="Clear all filters"
            >
              <svg className="w-5 h-5 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Date Posted Filter */}
          <div className="mb-4">
            <h3 className="text-lg text-black font-semibold text-black mb-1">Date Posted</h3>
            <div className="mt-2 space-y-2">
              {['all', 'last24hours', 'last3days', 'last7days'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="date-posted"
                    value={option}
                    checked={filters.datePosted === option}
                    onChange={() => handleFilterChange('datePosted', option)}
                    className="mr-2"
                  />
                  <span className="text-sm text-black">
                    {option === 'all'
                      ? 'All'
                      : `Last ${option.replace('last', '').replace(/hours$/, ' hours').replace('days', ' days')}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Salary Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-black mb-2">Salary</h3>
            <div className="mt-2">
              <label className="block text-sm text-gray-600 mb-1">Minimum yearly salary</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">₹0</span>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={filters.salary || 0}
                  onChange={(e) => handleFilterChange('salary', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{filters.salary || 0} Lakhs</span>
              </div>
            </div>
          </div>

          {/* Work Mode Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-black mb-2">Work Mode</h3>
            <div className="mt-2 space-y-2">
              {['home', 'office', 'field'].map((mode) => (
                <label key={mode} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.workMode[mode]}
                    onChange={(e) =>
                      handleFilterChange('workMode', {
                        ...filters.workMode,
                        [mode]: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">
                    {mode === 'home' ? 'Work from home' : mode === 'office' ? 'Work from office' : 'Work from field'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Job List Section */}
        <div className="flex-1">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div
                key={job._id}
                className={`p-4 mb-4 rounded-lg shadow-md cursor-pointer transition-colors ${
                  selectedJob && selectedJob._id === job._id ? 'bg-teal-50' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setSelectedJob(job)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 uppercase">{job.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{job.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-600 text-sm">📍 {job.location}</span>
                      <span className="text-gray-600 text-sm">₹ {job.salary} Lakhs P.A.</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-600 text-sm">{job.type}</span>
                      <span className="text-gray-600 text-sm">{job.level}</span>
                      <span className="text-gray-600 text-sm">{job.workType}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{calculateDaysAgo(job.postedAt)}</p>
                  </div>
                  {job.urgent && (
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full">Urgent</span>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">No jobs match your filters.</div>
          )}
        </div>
              <div className="w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Know more about Job
            </h3>
            <img
              src={
                jobType === 'fresher'
                  ? 'https://storage.googleapis.com/mumbai_apnatime_prod/jobs_page/TrackForDesktop.webp'
                  : 'https://apna.co/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fmumbai_apnatime_prod%2Fapna-home%2Fwork-from-home-jobs.png&w=3840&q=50'
              }
              alt={jobType === 'fresher' ? 'Fresher Jobs' : 'Work from Home Jobs'}
              className="mt-4 w-full"
            />
          </div>
        </div>
      </div>

      {/* Popup (Modal) for Job Details */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg max-w-7xl h-[700px] w-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm mr-2">
                      {selectedJob.company?.slice(0, 6).toUpperCase() || 'N/A'}
                    </span>
                    <h2 className="text-xl font-semibold">{selectedJob.title || 'N/A'}</h2>
                  </div>
                  <p className="text-gray-600 text-sm">{selectedJob.company || 'N/A'}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757M13.414 12H21m-9 9V13.414m0-4.828V3m-9 9h7.586"
                        />
                      </svg>
                      {selectedJob.location || 'N/A'}
                    </span>
                    <span>₹{selectedJob.salary || 'N/A'} Lakhs P.A.</span>
                  </div>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedJob(null)}
                  aria-label="Close job details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-gray-600 text-sm">Fixed</p>
                    <p className="font-semibold">₹{selectedJob.salary || 'N/A'} Lakhs P.A.</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Earning Potential</p>
                    <p className="font-semibold">
                      ₹{(selectedJob.salary ? parseFloat(selectedJob.salary) + 0.5 : 'N/A')} Lakhs P.A.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                    {selectedJob.type || 'N/A'}
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                    {selectedJob.workType || 'N/A'}
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                    {selectedJob.experience === '0 years' ? 'Freshers only' : selectedJob.level || 'N/A'}
                  </span>
                  {selectedJob.skills?.slice(0, 1).map((skill, idx) => (
                    <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                      {skill || 'N/A'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-[470px] flex justify-between items-center mb-4">
                <button
                  onClick={() => handleApplyJob(selectedJob._id)}
                  className="bg-green-600 w-[470px] text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
                  aria-label={`Apply for ${selectedJob.title || 'job'}`}
                >
                  Apply for job
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Job Highlights</h3>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center text-orange-600 text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 12c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z"
                      />
                    </svg>
                    {selectedJob?.urgent ? 'Urgently hiring' : 'Hiring'}
                  </span>
                  <span className="flex items-center text-blue-600 text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v-1zm0 0h6v-1a6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    {selectedJob.applicants || 0}+ applicants
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white shadow-md rounded-lg">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Role</h3>
                  <p className="text-gray-600 mt-2">{selectedJob.role || 'N/A'}</p>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Job Description</h3>
                  <p className="text-gray-600 mt-2">{selectedJob.description || 'No description available'}</p>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Job Responsibilities</h3>
                  <p className="text-gray-600 mt-2">{selectedJob.responsibilities || 'No responsibilities listed'}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Popup */}
      <AnimatePresence>
        {showEmailPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowEmailPopup(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Enter your email address</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowEmailPopup(false)}
                  aria-label="Close email popup"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <p className="text-gray-600 text-sm mb-4">
                By continuing, you agree to the Apna’s{' '}
                <a href="#" className="text-green-600 hover:underline">Terms of service</a> and{' '}
                <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
              </p>

    <button
  onClick={handleEmailNext}
  className="bg-gray-200 hover:text-white hover:bg-green-700 active:text-white active:bg-green-800 w-full text-gray-800 font-semibold py-2 px-4 rounded-lg"
  aria-label="Submit"
>
  Submit
</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default JobOpeningDetail;