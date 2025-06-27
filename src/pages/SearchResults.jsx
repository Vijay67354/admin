import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const jobs = [
  {
    id: 1,
    designation: "Frontend Developer",
    experience: "2 years",
    location: "Delhi",
    type: "Full-Time",
    postedAt: "2025-05-20",
    description: "Seeking a skilled frontend developer with experience in HTML, CSS, and JavaScript.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    company: "Tech Innovations Ltd.",
    salary: "₹ 5-7 Lakhs P.A.",
    rating: "4.2",
    reviews: "150 reviews",
    role: "Develop and maintain user-facing features using modern frontend technologies.",
    openings: 1,
    applicants: 50,
    requirements: [
      "We are seeking a highly skilled and experienced FrontEnd Developer to join our team.",
      "The ideal candidate will be responsible for developing and maintaining dynamic web applications while ensuring high performance and responsiveness to requests from the front end.",
      "1+ years of full stack development experience",
      "The ideal candidate should be able to build and maintain web applications, write clean code, and work well with a team.",
      "Know about the internet and can-do email, WhatsApp, browse website."
    ],
    img: "https://apna-organization-logos.gumlet.io/production/logos/093948dc-1513-4182-8bd9-3ec5bee3797e/67e5b7667ade36697fa81973.jpg?w=128"
  },
  {
    id: 2,
    designation: "Frontend Developer",
    experience: "4 years",
    location: "Delhi",
    type: "Full-Time",
    postedAt: "2025-05-20",
    description: "Seeking a skilled frontend developer with experience in HTML, CSS, and JavaScript.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    company: "Tech Innovations Ltd.",
    salary: "₹ 5-7 Lakhs P.A.",
    rating: "4.2",
    reviews: "150 reviews",
    role: "Develop and maintain user-facing features using modern frontend technologies.",
    openings: 1,
    applicants: 50,
  },
  {
    id: 3,
    designation: "Backend Developer",
    experience: "3 years",
    location: "Mumbai",
    type: "Full-Time",
    postedAt: "2025-05-19",
    description: "Responsible for server-side logic and database management.",
    skills: ["Node.js", "Express", "MongoDB", "REST API"],
    company: "CodeCrafters Inc.",
    salary: "₹ 8-10 Lakhs P.A.",
    rating: "4.0",
    reviews: "200 reviews",
    role: "Build and maintain server-side applications and APIs.",
    openings: 2,
    applicants: 75,
  },
  {
    id: 4,
    designation: "Backend Developer",
    experience: "1 year",
    location: "Mumbai",
    type: "Full-Time",
    postedAt: "2025-05-19",
    description: "Responsible for server-side logic and database management.",
    skills: ["Node.js", "Express", "MongoDB", "REST API"],
    company: "CodeCrafters Inc.",
    salary: "₹ 8-10 Lakhs P.A.",
    rating: "4.0",
    reviews: "200 reviews",
    role: "Build and maintain server-side applications and APIs.",
    openings: 2,
    applicants: 75,
  },
  {
    id: 5,
    designation: "Full Stack Developer",
    experience: "4 years",
    location: "Bangalore",
    type: "Full-Time",
    postedAt: "2025-05-18",
    description: "Work on both frontend and backend technologies.",
    skills: ["React", "Node.js", "MongoDB", "HTML", "CSS"],
    company: "NextGen Solutions",
    salary: "₹ 10-15 Lakhs P.A.",
    rating: "4.5",
    reviews: "300 reviews",
    role: "Develop full-stack applications, integrating frontend and backend technologies.",
    openings: 3,
    applicants: 100,
  },
  {
    id: 6,
    designation: "Full Stack Developer",
    experience: "1 year",
    location: "Bangalore",
    type: "Full-Time",
    postedAt: "2025-05-18",
    description: "Work on both frontend and backend technologies.",
    skills: ["React", "Node.js", "MongoDB", "HTML", "CSS"],
    company: "NextGen Solutions",
    salary: "₹ 10-15 Lakhs P.A.",
    rating: "4.5",
    reviews: "300 reviews",
    role: "Develop full-stack applications, integrating frontend and backend technologies.",
    openings: 3,
    applicants: 100,
  },
  {
    id: 7,
    designation: "UI/UX Designer",
    experience: "1 year",
    location: "Pune",
    type: "Full-Time",
    postedAt: "2025-05-17",
    description: "Design intuitive user interfaces and improve user experience.",
    skills: ["Figma", "Sketch", "Adobe XD", "User Research"],
    company: "Creative Designs Pvt. Ltd.",
    salary: "₹ 3-5 Lakhs P.A.",
    rating: "3.8",
    reviews: "80 reviews",
    role: "Create wireframes, prototypes, and design user interfaces.",
    img: 'https://apna-organization-logos.gumlet.io/production/logos/d5501838-8576-415d-8a46-48f63f973042/IMG_2636.png?w=128',
    requirements: [
      "1+ years of experience in UI/UX design with a focus on websites, SaaS platforms, or dashboards.",
      "A portfolio that showcases both platform/interface design and creative marketing work (image posts, reels, etc.).",
      "Strong command of Figma, Adobe Creative Suite, Canva, and similar tools.",
      "Understanding of responsive design, accessibility, and basic HTML/CSS principles (coding not required but a plus).",
      "Ability to switch contexts between B2B structure and B2C emotion seamlessly."
    ],
    openings: 1,
    applicants: 40,
  },
  {
    id: 8,
    designation: "UI/UX Designer",
    experience: "4 years",
    location: "Pune",
    type: "Part-Time",
    postedAt: "2025-05-17",
    description: "Design intuitive user interfaces and improve user experience.",
    skills: ["Figma", "Sketch", "Adobe XD", "User Research"],
    company: "Creative Designs Pvt. Ltd.",
    salary: "₹ 3-5 Lakhs P.A.",
    rating: "3.8",
    reviews: "80 reviews",
    role: "Create wireframes, prototypes, and design user interfaces.",
    openings: 1,
    applicants: 40,
  },
  {
    id: 9,
    designation: "DevOps Engineer",
    experience: "4 years",
    location: "Hyderabad",
    type: "Full-Time",
    postedAt: "2025-05-16",
    description: "Implement CI/CD pipelines and manage cloud infrastructure.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    company: "CloudMasters Inc.",
    salary: "₹ 12-18 Lakhs P.A.",
    rating: "4.3",
    reviews: "250 reviews",
    role: "Manage infrastructure and automate deployment processes.",
    openings: 2,
    applicants: 90,
  },
  {
    id: 10,
    designation: "QA Engineer",
    experience: "2 years",
    location: "Noida",
    type: "Full-Time",
    postedAt: "2025-05-15",
    description: "Responsible for ensuring software quality and reliability.",
    skills: ["Selenium", "Manual Testing", "Postman", "JIRA"],
    company: "QualityAssure Ltd.",
    salary: "₹ 4-6 Lakhs P.A.",
    rating: "3.9",
    reviews: "120 reviews",
    role: "Perform manual and automated testing to ensure software quality.",
    openings: 1,
    applicants: 60,
  },
  {
    id: 11,
    designation: "Project Manager",
    experience: "4 years",
    location: "Chennai",
    type: "Full-Time",
    postedAt: "2025-05-14",
    description: "Oversee software projects from planning to execution.",
    skills: ["Agile", "Scrum", "Project Planning", "Leadership"],
    company: "ProManage Solutions",
    salary: "₹ 15-20 Lakhs P.A.",
    rating: "4.1",
    reviews: "180 reviews",
    role: "Basic Computer Knowledge. Typing Speed and Accuracy. Basic knowledge of Digital Marketing will be added advantage.",
    openings: 1,
    applicants: 30,
  },
  {
    id: 12,
    designation: "Data Scientist",
    experience: "2 years",
    location: "Kolkata",
    type: "Full-Time",
    postedAt: "2025-05-13",
    description: "Analyze data and build predictive models.",
    skills: ["Python", "Machine Learning", "Pandas", "Scikit-learn"],
    company: "DataInsights Pvt. Ltd.",
    salary: "₹ 9-12 Lakhs P.A.",
    rating: "4.0",
    reviews: "160 reviews",
    role: "Analyze data and develop machine learning models.",
    openings: 2,
    applicants: 85,
  },
];

const SearchResults = () => {
  const { state } = useLocation();
  const { searchParams = {}, filteredJobs: initialJobs = [] } = state || {};
  const [jobsState, setJobsState] = useState([]);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    datePosted: 'all',
    salary: 1.5,
    workMode: { home: false, office: false, field: false },
    workType: { fullTime: false, partTime: false },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [currentJobId, setCurrentJobId] = useState(null);
  const navigate = useNavigate();

  const mapExperienceRange = (range) => {
    switch (range) {
      case '0-1':
        return ['0 years', '1 year'];
      case '1-3':
        return ['1 year', '2 years', '3 years'];
      case '3-5':
        return ['3 years', '4 years', '5 years'];
      case '5+':
        return ['5 years', '6 years', '7 years', '8 years', '9 years', '10 years'];
      default:
        return [];
    }
  };

  useEffect(() => {
    const filteredBySearchParams = jobs.filter((job) => {
      const matchesDesignation = searchParams.designation
        ? job.designation.toLowerCase().includes(searchParams.designation.toLowerCase())
        : true;
      const matchesExperience = searchParams.experience
        ? mapExperienceRange(searchParams.experience).includes(job.experience)
        : true;
      const matchesLocation = searchParams.location
        ? job.location.toLowerCase().includes(searchParams.location.toLowerCase())
        : true;

      return matchesDesignation && matchesExperience && matchesLocation;
    });

    setJobsState(filteredBySearchParams.length > 0 ? filteredBySearchParams : jobs);
    setSuggestedJobs(jobs.slice(0, 5));
    setLoading(false);
  }, [searchParams]);

  const handleApply = (jobId) => {
    setCurrentJobId(jobId);
    setShowEmailPopup(true);
  };

  const handleEmailNext = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    // Simulate application success
    setJobsState((prevJobs) =>
      prevJobs.map((job) =>
        job.id === currentJobId ? { ...job, applicants: (job.applicants || 0) + 1 } : job
      )
    );
    toast.success('Applied successfully!');
    setShowEmailPopup(false);
    setEmail('');
    setCurrentJobId(null);
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const fetchJobDetails = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJob(job);
    } else {
      toast.error('This job is no longer available.');
      setJobsState((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const filteredJobsWithFilters = useMemo(() => {
    return jobsState.filter((job) => {
      const postedDate = new Date(job.postedAt);
      const today = new Date();
      const diffDays = Math.ceil((today - postedDate) / (1000 * 60 * 60 * 24));

      if (filters.datePosted === 'last24hours' && diffDays > 1) return false;
      if (filters.datePosted === 'last3days' && diffDays > 3) return false;
      if (filters.datePosted === 'last7days' && diffDays > 7) return false;

      const salaryString = typeof job.salary === 'string' ? job.salary : '0';
      const salaryRange = salaryString.match(/(\d+(\.\d+)?)-(\d+(\.\d+)?)/);
      const minSalary = salaryRange ? parseFloat(salaryRange[1]) : parseFloat(salaryString) || 0;
      if (minSalary < filters.salary) return false;

      const jobWorkMode = job.type?.toLowerCase().includes('work from') ? job.type.toLowerCase() : '';
      if (filters.workMode.home && !jobWorkMode.includes('work from home')) return false;
      if (filters.workMode.office && !jobWorkMode.includes('work from office')) return false;
      if (filters.workMode.field && !jobWorkMode.includes('work from field')) return false;

      const jobWorkType = job.type?.toLowerCase();
      if (filters.workType.fullTime && jobWorkType !== 'full-time') return false;
      if (filters.workType.partTime && jobWorkType !== 'part-time') return false;

      return true;
    });
  }, [jobsState, filters]);

  const totalPages = Math.ceil(filteredJobsWithFilters.length / itemsPerPage);
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobsWithFilters.slice(indexOfFirstJob, indexOfLastJob);

  const calculateDaysAgo = (postedAt) => {
    const postedDate = new Date(postedAt);
    const today = new Date();
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex flex-col bg-gray-50">
      <div className="w-full mx-auto max-w-[1250px] flex-grow">
        <div className="p-4">
          {(searchParams.designation || searchParams.experience || searchParams.location) && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Showing results for: 
                {searchParams.designation && ` "${searchParams.designation}"`}
                {searchParams.experience && `, ${searchParams.experience} experience`}
                {searchParams.location && ` in ${searchParams.location}`}
              </h2>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {filteredJobsWithFilters.length} Explore and Find Latest Jobs
            </h1>
          </div>
          <div className="mt-5 flex gap-6">
            <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 uppercase">Filters</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    setFilters({
                      datePosted: 'all',
                      salary: 1.5,
                      workMode: { home: false, office: false, field: false },
                      workType: { fullTime: false, partTime: false },
                    })
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 uppercase mb-2">Date Posted</h3>
                <div className="space-y-2">
                  {['all', 'last24hours', 'last3days', 'last7days'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="date-posted"
                        value={option}
                        checked={filters.datePosted === option}
                        onChange={() => handleFilterChange('datePosted', option)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        {option === 'all'
                          ? 'All'
                          : option === 'last24hours'
                          ? 'Last 24 Hours'
                          : option === 'last3days'
                          ? 'Last 3 Days'
                          : 'Last 7 Days'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 uppercase mb-2">Salary</h3>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 uppercase">Minimum yearly salary</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">₹0</span>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={filters.salary}
                      onChange={(e) => handleFilterChange('salary', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 ${(filters.salary / 15) * 100}%, #e5e7eb ${(filters.salary / 15) * 100}%)`,
                      }}
                    />
                    <span className="text-sm text-gray-600">{filters.salary} Lakhs</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 uppercase mb-2">Work Mode</h3>
                <div className="space-y-2">
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
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        {mode === 'home' ? 'Work from Home' : mode === 'office' ? 'Work from Office' : 'Work from Field'}
                      </span>
                    </label>
                  ))}
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
                        key={job.id}
                        className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => fetchJobDetails(job.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{job.designation}</h3>
                            <p className="text-sm text-gray-600">{job.company}</p>
                          </div>
                          <img
                            src={job.img || 'https://via.placeholder.com/64'}
                            alt={`${job.company} Logo`}
                            className="w-12 h-12 object-contain rounded"
                          />
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757M13.414 12H21m-9 9V13.414m0-4.828V3m-9 9h7.586"
                              />
                            </svg>
                            {job.location}
                          </span>
                          <span>₹{job.salary}</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 20h5v-2a2 2 0 00-2-2h-1m-2 0H7a2 2 0 00-2 2v2h5m-2-8h8m-4 4v-8m-6 4h12"
                              />
                            </svg>
                            {job.experience}
                          </span>
                        </div>
                        <div className="mt-2 flex gap-2 text-xs text-gray-600">
                          {job.skills?.slice(0, 3).map((skill, index) => (
                            <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">Posted: {calculateDaysAgo(job.postedAt)}</p>
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
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
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
              <div>
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Know more about Freshers Jobs</h3>
                  <img
                    src="https://storage.googleapis.com/mumbai_apnatime_prod/jobs_page/TrackForDesktop.webp"
                    alt="Phone Mockup"
                    className="mt-4 w-full"
                  />
                </div>
              </div>
            </div>
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
              role="dialog"
              aria-labelledby="job-details-title"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm mr-2">
                      {selectedJob.company?.slice(0, 6).toUpperCase()}
                    </span>
                    <h2 id="job-details-title" className="text-xl font-semibold">
                      {selectedJob.designation}
                    </h2>
                  </div>
                  <p className="text-gray-600">{selectedJob.company}</p>
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
                      {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0 6c-2.21 0-4-1.79-4-4s1.79-4 4 4-1.79 4-4 4zm0 2c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"
                        />
                      </svg>
                      ₹{selectedJob.salary}
                    </span>
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
                    <p className="font-semibold">₹{selectedJob.salary}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Earning Potential</p>
                    <p className="font-semibold">
                      ₹
                      {(() => {
                        const salaryRange = selectedJob.salary?.match(/(\d+(\.\d+)?)-(\d+(\.\d+)?)/);
                        const maxSalary = salaryRange ? parseFloat(salaryRange[3]) : parseFloat(selectedJob.salary) || 0;
                        return (maxSalary + 2).toFixed(1);
                      })()}{' '}
                      Lakhs P.A.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white text-gray-700 px-2 py-1 rounded text-sm">{selectedJob.type}</span>
                  <span className="bg-white text-gray-700 px-2 py-1 rounded text-sm">
                    {selectedJob.experience === '0 years' ? 'Freshers only' : selectedJob.experience}
                  </span>
                  {selectedJob.skills?.slice(0, 1).map((skill, index) => (
                    <span key={index} className="bg-white text-gray-700 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-96 flex justify-between items-center mb-4">
                <button
                  onClick={() => handleApply(selectedJob.id)}
                  className="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 flex-1 mr-2"
                >
                  Apply for Job
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
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    {selectedJob.type || 'Flexible'}
                  </span>
                  <span className="flex items-center text-orange-600 text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l4.5 4.5M12 8V4m0 8H7.5m9 0h4.5"
                      />
                    </svg>
                    {selectedJob.experience}
                  </span>
                  <span className="flex items-center text-orange-600 text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    {selectedJob.skills?.join(', ') || 'No skills listed'}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Job Description</h3>
                <p className="text-gray-600 mt-2">{selectedJob.description || 'No description available.'}</p>
              </div>
              {selectedJob.requirements && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Requirements</h3>
                  <ul className="list-disc pl-5 text-gray-600 mt-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
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
                className="bg-gray-200 w-full text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300"
                aria-label="Submit"
              >
                Submit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};

export default SearchResults;