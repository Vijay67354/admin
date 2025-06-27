
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { searchParams: rawSearchParams = {}, jobType: rawJobType } = state || {};

  const searchParams = useMemo(() => rawSearchParams, [rawSearchParams]);
  const jobType = rawJobType || 'default';

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    datePosted: '',
    salary: 0,
    workMode: {
      home: jobType === 'workFromHome',
      office: false,
      field: false,
    },
    workType: { fullTime: false, partTime: false },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [currentJobId, setCurrentJobId] = useState(null);
  const [currentJobDetails, setCurrentJobDetails] = useState(null); // Added to store job details

  useEffect(() => {
    let isMounted = true;
const API_URL = import.meta.env.VITE_JOB_API_URL_SHY;
    const fetchJobs = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          title: searchParams.title || undefined,
          location: searchParams.location || undefined,
          company: searchParams.company || undefined,
          salary: searchParams.salary || undefined,
          experience: jobType === 'fresher' ? '0 years' : undefined,
          type: jobType === 'workFromHome' ? 'Work from home' : undefined,
          level: jobType === 'fresher' ? 'Junior' : undefined,
        };

        const response = await axios.get(`${API_URL}`, {
          params,
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          if (isMounted) {
            setJobs(response.data.data);
          }
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching jobs:', err);
          setError(err.message || 'Failed to fetch jobs. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [searchParams, jobType]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const filteredJobsWithFilters = jobs.filter((job) => {
    const postedDate = new Date(job.postedAt);
    const today = new Date();
    const diffDays = Math.ceil((today - postedDate) / (1000 * 60 * 60 * 24));

    if (filters.datePosted === 'last24hours' && diffDays > 1) return false;
    if (filters.datePosted === 'last3days' && diffDays > 3) return false;
    if (filters.datePosted === 'last7days' && diffDays > 7) return false;

    let jobSalary = 0;
    if (typeof job.salary === 'string') {
      const match = job.salary.match(/([\d.]+)/);
      jobSalary = match ? parseFloat(match[0]) : 0;
    } else if (typeof job.salary === 'number') {
      jobSalary = job.salary;
    }
    if (jobSalary < filters.salary) return false;

    if (filters.workMode.home && job.type !== 'Work from home') return false;
    if (filters.workMode.office && job.type !== 'Work from office') return false;
    if (filters.workMode.field && job.type !== 'Work from field') return false;

    if (filters.workType.fullTime && job.workType !== 'Full-Time') return false;
    if (filters.workType.partTime && job.workType !== 'Part-Time') return false;

    return true;
  });

  const totalPages = Math.ceil(filteredJobsWithFilters.length / itemsPerPage);
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobsWithFilters.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateDaysAgo = (postedAt) => {
    const postedDate = new Date(postedAt);
    const today = new Date();
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
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

      await axios.post('http://localhost:5006/api/send-email', emailData);
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

  const handleApplyJob = (jobId) => {
    const jobDetails = jobs.find((job) => job._id === jobId);
    if (!jobDetails) {
      console.error('Job not found for ID:', jobId);
      toast.error('Job details not found. Please try again.');
      return;
    }
    setCurrentJobId(jobId);
    setCurrentJobDetails(jobDetails);
    setShowEmailPopup(true);
  };

  const handleEmailNext = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!currentJobDetails) {
      toast.error('Job details not available. Please try again.');
      return;
    }
    sendEmail(currentJobDetails);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">No jobs data available.</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-[1250px] p-4">
      <Link to="/">
        <img src="/images/right-arrow.png" className="w-4 h-4 mt-4 mb-3 rotate-[90deg]" alt="Back to home" />
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {filteredJobsWithFilters.length}{' '}
          {jobType === 'fresher'
            ? 'Fresher Jobs'
            : jobType === 'workFromHome'
            ? 'Work from Home Jobs'
            : 'Latest Jobs'}
        </h1>
      </div>

      <div className="mt-5 flex gap-6">
        <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <button
              onClick={() =>
                setFilters({
                  datePosted: '',
                  salary: 0,
                  workMode: { home: false, office: false, field: false },
                  workType: { fullTime: false, partTime: false },
                })
              }
              aria-label="Clear all filters"
            >
              <svg
                className="w-5 h-5 text-gray-500 hover:text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-black mb-1">Date Posted</h3>
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
                  <span className="text-sm text-gray-600">
                    {option === 'all'
                      ? 'All'
                      : `Last ${option.replace('last', '').replace(/hours$/, ' hours').replace('days', ' days')}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

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

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-black mb-2">Work Mode</h3>
            <div className="mt-2 space-y-2">
              {['home', 'office', 'field'].map((mode) => (
                <label key={mode} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.workMode[mode]}
                    onChange={() =>
                      handleFilterChange('workMode', {
                        ...filters.workMode,
                        [mode]: !filters.workMode[mode],
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">
                    Work from {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-black mb-2">Work Type</h3>
            <div className="mt-2 space-y-2">
              {['fullTime', 'partTime'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.workType[type]}
                    onChange={() =>
                      handleFilterChange('workType', {
                        ...filters.workType,
                        [type]: !filters.workType[type],
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">
                    {type === 'fullTime' ? 'Full-Time' : 'Part-Time'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {filteredJobsWithFilters.length === 0 ? (
            <p className="text-gray-600">No jobs found.</p>
          ) : (
            <>
              <div className="grid">
                {currentJobs.map((job, index) => (
                  <div
                    key={job._id || index}
                    className="mt-4 p-3 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-black">{job.title || 'N/A'}</h3>
                        <p className="text-gray-600">{job.company || 'N/A'}</p>
                      </div>
                      <img
                        src={job.img || 'https://via.placeholder.com/64'}
                        alt={`${job.company || 'Company'} logo`}
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757M13.414 12H21m-9 9V9.414m0-4.828V3H3V3m-9 9h9.586"
                          />
                        </svg>
                        {job.location || 'N/A'}
                      </span>
                      <span>₹{job.salary || 'N/A'} Lakhs P.A.</span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a2 2 0 00-2-2h-1m-2 0H7a2 2 0 00-2 2v2h5m-2-8h8v-8m-4 4v4m-6 4h12v-12"
                          />
                        </svg>
                        {job.experience || 'N/A'}
                      </span>
                    </div>

                    <div className="mt-2 flex gap-2 text-sm text-gray-600">
                      {job.skills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 px-2 py-1 rounded-lg">
                          {skill || 'N/A'}
                        </span>
                      ))}
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      Posted: {job.postedAt ? calculateDaysAgo(job.postedAt) : 'N/A'}
                    </p>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    aria-label="Previous page"
                  >
                    Previous
                  </button>

                  {(() => {
                    const maxPagesToShow = 5;
                    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                    const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);

                    return Array.from(
                      { length: endPage - adjustedStartPage + 1 },
                      (_, index) => adjustedStartPage + index
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        aria-label={`Page ${page}`}
                      >
                        {page}
                      </button>
                    ));
                  })()}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Know more about{' '}
              {jobType === 'fresher' ? 'Fresher Jobs' : 'Work from Home Jobs'}
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
                  <p className="text-gray-600">{selectedJob.company || 'N/A'}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757M13.414 12H21m-9 9V13.414m0-4.828V3m-9 9h7.586"
                        />
                      </svg>
                      {selectedJob.location || 'N/A'}
                    </span>
                    <span>
                      ₹
                      {(typeof selectedJob.salary === 'string' || typeof selectedJob.salary === 'number'
                        ? selectedJob.salary
                        : 'N/A')}
                      Lakhs P.A.
                    </span>
                  </div>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedJob(null)}
                  aria-label="Close job details"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-gray-600 text-sm">Fixed</p>
                    <p className="font-semibold">
                      ₹
                      {(typeof selectedJob.salary === 'string' || typeof selectedJob.salary === 'number'
                        ? selectedJob.salary
                        : 'N/A')}
                      Lakhs P.A.
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Earning Potential</p>
                    <p className="font-semibold">
                      ₹
                      {(typeof selectedJob.salary === 'number'
                        ? selectedJob.salary + 0.5
                        : parseFloat(selectedJob.salary) + 0.5 || 'N/A')}
                      Lakhs P.A.
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
                    {selectedJob.experience === '0 years' ? 'Freshers only' : selectedJob.experience || 'N/A'}
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
              <ToastContainer position="top-center" autoClose={2000} />
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Job Highlights</h3>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center text-orange-600 text-sm">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Job Openings: {selectedJob.openings || 'N/A'}</h3>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Job Applicants: {selectedJob.applicants || 0}</h3>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Job Requirements</h3>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    {Array.isArray(selectedJob.requirements) && selectedJob.requirements.length > 0 ? (
                      selectedJob.requirements.map((req, idx) => <li key={idx}>{req}</li>)
                    ) : (
                      <li>No requirements listed</li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
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
                <a href="#" className="text-green-600 hover:underline">
                  Terms of service
                </a>{' '}
                and{' '}
                <a href="#" className="text-green-600 hover:underline">
                  Privacy Policy
                </a>
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
    </div>
  );
};

export default JobDetails;