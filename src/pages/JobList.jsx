import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const JobList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    datePosted: 'all',
    salary: 1.5,
    workMode: { home: false, office: false, field: false },
    workType: { fullTime: false, partTime: false },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(VITE_JOB_API_URL);
        setJobs(response.data || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const filteredJobsWithFilters = jobs.filter((job) => {
    const postedDate = new Date(job.postedAt);
    const today = new Date('2025-05-31');
    const diffDays = Math.ceil((today - postedDate) / (1000 * 60 * 60 * 24));
    if (filters.datePosted === 'last24hours' && diffDays > 1) return false;
    if (filters.datePosted === 'last3days' && diffDays > 3) return false;
    if (filters.datePosted === 'last7days' && diffDays > 7) return false;

    const minSalary = parseFloat(job.salary?.match(/₹\s*([\d.]+)-[\d.]+\s*Lakhs P\.A\./)?.[1] || 0);
    if (minSalary < filters.salary) return false;

    if (filters.workMode.home && job.type !== 'Work from home') return false;
    if (filters.workMode.office && job.type !== 'Work from office') return false;
    if (filters.workMode.field && job.type !== 'Work from field') return false;

    if (filters.workType.fullTime && job.workType !== 'Full-Time') return false;
    if (filters.workType.partTime && job.workType !== 'Part time') return false;

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
    const today = new Date('2025-05-31');
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const handleJobClick = (job) => {
    navigate('/jobdetails', { state: { jobData: job } });
  };

  return (
    <div>
      <Navbar />
      <div className="w-full mx-auto max-w-[1250px] p-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {filteredJobsWithFilters.length} Explore and Find Latest Jobs
          </h1>
        </div>

        <div className="mt-5 flex gap-6">
          <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-black">Date posted</h3>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="date-posted"
                    value="all"
                    checked={filters.datePosted === 'all'}
                    onChange={() => handleFilterChange('datePosted', 'all')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">All</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="date-posted"
                    value="last24hours"
                    checked={filters.datePosted === 'last24hours'}
                    onChange={() => handleFilterChange('datePosted', 'last24hours')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Last 24 hours</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="date-posted"
                    value="last3days"
                    checked={filters.datePosted === 'last3days'}
                    onChange={() => handleFilterChange('datePosted', 'last3days')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Last 3 days</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="date-posted"
                    value="last7days"
                    checked={filters.datePosted === 'last7days'}
                    onChange={() => handleFilterChange('datePosted', 'last7days')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Last 7 days</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-black">Salary</h3>
              <div className="mt-2">
                <label className="block text-sm text-gray-600 mb-1">Minimum monthly salary</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">₹0</span>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={filters.salary}
                    onChange={(e) => handleFilterChange('salary', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{filters.salary} Lakhs</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-black">Work Mode</h3>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.workMode.home}
                    onChange={() => handleFilterChange('workMode', { ...filters.workMode, home: !filters.workMode.home })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Work from home</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.workMode.office}
                    onChange={() => handleFilterChange('workMode', { ...filters.workMode, office: !filters.workMode.office })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Work from office</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.workMode.field}
                    onChange={() => handleFilterChange('workMode', { ...filters.workMode, field: !filters.workMode.field })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Work from field</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black">Work Type</h3>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.workType.fullTime}
                    onChange={() => handleFilterChange('workType', { ...filters.workType, fullTime: !filters.workType.fullTime })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Full-Time</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.workType.partTime}
                    onChange={() => handleFilterChange('workType', { ...filters.workType, partTime: !filters.workType.partTime })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Part-Time</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : filteredJobsWithFilters.length === 0 ? (
              <p className="text-gray-600">No jobs found.</p>
            ) : (
              <>
                <div className="grid gap-4">
                  {currentJobs.map((job) => (
                    <div
                      key={job.id || job._id}
                      className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleJobClick(job)}
                    >
                      <div className="flex items-center space-y-2 justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-black">{job.designation || job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                        <img
                          src={job.img || 'https://via.placeholder.com/64'}
                          alt={`${job.company} Logo`}
                          className="w-16 h-16 object-contain rounded"
                        />
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757M13.414 12H21m-9 9V13.414m0-4.828V3m-9 9h7.586" />
                          </svg>
                          {job.location}
                        </span>
                        <span>{job.salary}</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a2 2 0 00-2-2h-1m-2 0H7a2 2 0 00-2 2v2h5m-2-8h8m-4 4v-8m-6 4h12" />
                          </svg>
                          {job.experience}
                        </span>
                      </div>

                      <div className="mt-2 flex gap-2 text-sm text-gray-600">
                        {job.skills?.slice(0, 3).map((skill, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <p className="mt-2 text-sm text-gray-600">Posted: {calculateDaysAgo(job.postedAt || job.posted)}</p>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Know more about Freshers Jobs</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Track your applications, connect with HRs & a lot more on the app
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://via.placeholder.com/24"
                      alt="Swiggy Logo"
                      className="w-6 h-6"
                    />
                    <p className="text-sm text-gray-600">Swiggy • Delivery Br</p>
                  </div>
                  <button className="text-blue-600 text-sm">Your application wed by HR</button>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://via.placeholder.com/24"
                      alt="Reliance Logo"
                      className="w-6 h-6"
                    />
                    <p className="text-sm text-gray-600">Reliance Jio • Telecaller executive by</p>
                  </div>
                  <button className="text-blue-600 text-sm">Your application wed by HR</button>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600">Download the Apna app now</p>
                  <img
                    src="https://via.placeholder.com/100x30?text=Google+Play"
                    alt="Google Play Badge"
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobList;