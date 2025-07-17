
//   import React, { useState, useEffect } from 'react';
//   import { useNavigate, useLocation } from 'react-router-dom';
//   import { motion, AnimatePresence } from 'framer-motion';
//   import axios from 'axios';
//   import { ChevronLeft, ChevronRight } from 'lucide-react';
//   import Navbar from '../component/Navbar';
//   import { Link } from 'react-router-dom';
//   const Dashboard = () => {
//     const [isLoading, setIsLoading] = useState(true);
//     const [showFresherForm, setShowFresherForm] = useState(false);
//     const [showWfhForm, setShowWfhForm] = useState(false);
//     const [showHomeForm, setShowHomeForm] = useState(false);
//     const [showTopCompaniesForm, setShowTopCompaniesForm] = useState(false);
//     const [activeButton, setActiveButton] = useState('');
//     const [jobData, setJobData] = useState({
//       title: '',
//       company: '',
//       location: '',
//       salary: '',
//       experience: '0 years',
//       skills: [],
//       postedAt: new Date().toISOString().split('T')[0],
//       type: 'Work from office',
//       workType: 'Full-Time',
//       level: 'Junior',
//       role: '',
//       description: '',
//       responsibilities: '',
//       openings: 1,
//       requirements: [],
//       urgent: false,
//       img: 'https://dcassetcdn.com/design_img/2531172/542774/542774_13559578_2531172_d07764e6_image.png',
//     });
//     const [recentJobs, setRecentJobs] = useState([]);
//     const [totalJobs, setTotalJobs] = useState(0);
//     const [totalApplications, setTotalApplications] = useState(0);
//     const [topCompaniesData, setTopCompaniesData] = useState([]);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [slidesToShow, setSlidesToShow] = useState(4);
//     const navigate = useNavigate();
//     const { state } = useLocation();
// const API_URL = import.meta.env.VITE_JOB_API_URL_SHY;
//     useEffect(() => {
//       if (state?.openForm) {
//         if (state.jobType === 'fresher') {
//           setShowFresherForm(true);
//           setJobData((prev) => ({
//             ...prev,
//             company: state.company || '',
//             level: 'Junior',
//             experience: '0 years',
//           }));
//         } else if (state.jobType === 'workFromHome') {
//           setShowWfhForm(true);
//           setJobData((prev) => ({
//             ...prev,
//             company: state.company || '',
//             type: 'Work from home',
//           }));
//         }
//       }
//     }, [state]);

//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`${API_URL}`);
//         const jobs = response.data.data;

//         setRecentJobs(jobs.slice(0, 3));
//         setTotalJobs(jobs.length);
//         setTotalApplications(jobs.reduce((sum, job) => sum + (job.applicants || 0), 0));

//         const topCompaniesResponse = await axios.get(`${API_URL}`);
//         setTopCompaniesData(topCompaniesResponse.data.data || []);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     useEffect(() => {
//       fetchDashboardData();
//     }, []);

//     useEffect(() => {
//       const handleResize = () => {
//         if (window.innerWidth < 480) {
//           setSlidesToShow(1);
//         } else if (window.innerWidth < 600) {
//           setSlidesToShow(2);
//         } else if (window.innerWidth < 1024) {
//           setSlidesToShow(3);
//         } else {
//           setSlidesToShow(4);
//         }
//       };

//       handleResize();
//       window.addEventListener('resize', handleResize);
//       return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     useEffect(() => {
//       const interval = setInterval(() => {
//         setCurrentSlide((prev) => {
//           const maxSlide = Math.max(0, topCompaniesData.length - slidesToShow);
//           return prev >= maxSlide ? 0 : prev + 1;
//         });
//       }, 2000);

//       return () => clearInterval(interval);
//     }, [topCompaniesData.length, slidesToShow]);

//     const nextSlide = () => {
//       const maxSlide = Math.max(0, topCompaniesData.length - slidesToShow);
//       setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
//     };

//     const prevSlide = () => {
//       const maxSlide = Math.max(0, topCompaniesData.length - slidesToShow);
//       setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
//     };

//     const goToSlide = (index) => {
//       setCurrentSlide(index);
//     };

//     const handleInputChange = (e) => {
//       const { name, value, type, checked } = e.target;
//       setJobData((prev) => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value,
//       }));
//     };

//     const handleSkillsChange = (e) => {
//       const skills = e.target.value.split(',').map((skill) => skill.trim()).filter((skill) => skill);
//       setJobData((prev) => ({ ...prev, skills }));
//     };

//     const handleRequirementsChange = (e) => {
//       const requirements = e.target.value
//         .split(',')
//         .map((req) => req.trim())
//         .filter((req) => req);
//       setJobData((prev) => ({ ...prev, requirements }));
//     };

//     const handleFormSubmit = async (e, formType) => {
//       e.preventDefault();
//       try {
//         const submissionData = {
//           ...jobData,
//           salary: parseFloat(jobData.salary),
//           openings: parseInt(jobData.openings, 10),
//         };

//         if (formType === 'topCompanies') {
//           const response = await axios.post(REACT_APP_TOP_COMPANIES_API_URL_FOUR, {
//             title: submissionData.title,
//             company: submissionData.company,
//             location: submissionData.location,
//             salary: submissionData.salary,
//             experience: submissionData.experience,
//             skills: submissionData.skills,
//             postedAt: submissionData.postedAt,
//             type: submissionData.type,
//             workType: submissionData.workType,
//             level: submissionData.level,
//             role: submissionData.role,
//             description: submissionData.description,
//             responsibilities: submissionData.responsibilities,
//             openings: submissionData.openings,
//             requirements: submissionData.requirements,
//             urgent: submissionData.urgent,
//             logo: submissionData.img,
//           });

//           console.log('Top Company Data Submitted:', response.data);
//           setTopCompaniesData((prev) => [...prev, response.data.data]);
//         } else {
//           const response = await axios.post(`${API_URL}`, submissionData);
//           console.log('Job Data Submitted:', response.data);

//           navigate('/', {
//             state:
//               formType === 'fresher'
//                 ? { fresherJobData: response.data.data }
//                 : formType === 'wfh'
//                 ? { workFromHomeJobData: response.data.data }
//                 : { homeJobData: response.data.data },
//           });
//         }

//         await fetchDashboardData();

//         setShowFresherForm(false);
//         setShowWfhForm(false);
//         setShowHomeForm(false);
//         setShowTopCompaniesForm(false);
//         setJobData({
//           title: '',
//           company: '',
//           location: '',
//           salary: '',
//           experience: formType === 'fresher' ? '0 years' : '',
//           skills: [],
//           postedAt: new Date().toISOString().split('T')[0],
//           type: formType === 'wfh' ? 'Work from home' : 'Work from office',
//           workType: 'Full-Time',
//           level: formType === 'fresher' ? 'Junior' : '',
//           role: '',
//           description: '',
//           responsibilities: '',
//           openings: 1,
//           requirements: [],
//           urgent: false,
//           img: 'https://via.placeholder.com/64',
//         });
//       } catch (error) {
//         console.error('Error submitting data:', error);
//         alert('Failed to submit. Please try again.');
//       }
//     };

//     if (isLoading) {
//       return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-50">
//           <motion.div
//             className="text-lg font-semibold text-gray-600"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             Loading dashboard...
//           </motion.div>
//         </div>
//       );
//     }

//     const maxSlide = Math.max(0, topCompaniesData.length - slidesToShow);
//     const totalDots = maxSlide + 1;

//     return (
//    <>
//    <Link to="/">

//      <img src='/images/right-arrow.png' className='w-4 h-4 ml-6 mt-4 rotate-[90deg]' />

//       </Link>

//       <div className="flex min-h-screen bg-gray-50 font-sans">

//         {/* Sidebar */}
//         <motion.div
//           className="w-64 h-screen bg-gradient-to-b from-blue-700 to-blue-500 text-white p-6 flex flex-col shadow-lg"
//           initial={{ x: -100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           {/* <h1 className="text-3xl font-extrabold  tracking-tight">Job Insider</h1> */}
//           <div className=" p-2 bg-[#1f8268] rounded-xl shadow-inner">
//             <p className="text-[13px] opacity-80">Welcome back,</p>
//             <p className="font-semibold text-lg">Admin</p>
//           </div>
//     <div className="flex-1 mt-3">

//         <button
//           onClick={() => {
//             setActiveButton('fresher');
//             setShowFresherForm(true);
//             setJobData((prev) => ({ ...prev, level: 'Junior', experience: '0 years' }));
//           }}
//           className={`w-full py-3 mb-4 ${
//             activeButton === 'fresher' ? 'bg-[#1f8268] text-white' : 'bg-white text-[#1f8268]'
//           } rounded-xl font-medium hover:bg-gray-400 active:bg-gray-300 transition-colors shadow-sm`}
//         >
//           Apply for job
//         </button>

//         {/* <button
//           onClick={() => {
//             setActiveButton('wfh');
//             setShowWfhForm(true);
//             setJobData((prev) => ({ ...prev, type: 'Work from home' }));
//           }}
//           className={`w-full py-3 mb-4 ${
//             activeButton === 'wfh' ? 'bg-[#1f8268] text-white' : 'bg-white text-[#1f8268]'
//           } rounded-xl font-medium hover:bg-gray-400 active:bg-gray-300 transition-colors shadow-sm`}
//         >
//           + Work from Home Job
//         </button> */}
//       </div>

//         </motion.div>

//         {/* Main Content */}
//         <div className="flex-1 p-8 overflow-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Dashboard</h1>
//             <p className="text-gray-500 mb-8 text-lg">Manage your jobs and applications seamlessly.</p>

//             {/* Top Companies Slider */}


//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//               <motion.div
//                 className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100"
//                 whileHover={{ scale: 1.03 }}
//               >
//                 <h2 className="text-lg font-semibold text-gray-700">Total Jobs Posted</h2>
//                 <p className="text-4xl font-bold text-[#1f8268] mt-2">{totalJobs}</p>
//               </motion.div>
//               <motion.div
//                 className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100"
//                 whileHover={{ scale: 1.03 }}
//               >
//                 <h2 className="text-lg font-semibold text-gray-700">Total Applications</h2>
//                 <p className="text-4xl font-bold text-green-600 mt-2">{totalApplications}</p>
//               </motion.div>
//             </div>

//             {/* Recent Jobs */}
//             <motion.div
//               className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Jobs</h2>
//               {recentJobs.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <div className="grid grid-cols-4 gap-4 font-semibold text-gray-600 border-b pb-2 mb-4">
//                     <p>Job Title</p>
//                     <p>Location</p>
//                     <p>Level</p>
//                     <p>Salary</p>
//                   </div>
//                   {recentJobs.map((job, index) => (
//                     <motion.div
//                       key={job._id}
//                       className="grid grid-cols-4 gap-4 py-3 border-b last:border-b-0 hover:bg-gray-50 rounded-lg"
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.3, delay: index * 0.1 }}
//                     >
//                       <p className="font-medium text-gray-800">{job.title}</p>
//                       <p className="text-gray-600">{job.location}</p>
//                       <p className="text-gray-600">{job.level}</p>
//                       <p className="text-gray-600">₹{job.salary} Lakhs P.A.</p>
//                     </motion.div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <p>No recent jobs available.</p>
//                   <button
//                     onClick={() => setShowFresherForm(true)}
//                     className="mt-4 px-6 py-2 bg-[#1f8268]  text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
//                   >
//                     Add Your First Job
//                   </button>
//                 </div>
//               )}
//             </motion.div>
//           </motion.div>
//         </div>

//         {/* Job for Fresher Form Modal */}
//         <AnimatePresence>
//           {showFresherForm && (
//             <motion.div
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.8, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply For Job</h2>
//                 <form onSubmit={(e) => handleFormSubmit(e, 'fresher')}>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Job Title</label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={jobData.title}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Company</label>
//                     <input
//                       type="text"
//                       name="company"
//                       value={jobData.company}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Location</label>
//                     <input
//                       type="text"
//                       name="location"
//                       value={jobData.location}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Salary (in Lakhs P.A.)</label>
//                     <input
//                       type="number"
//                       name="salary"
//                       value={jobData.salary}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       min="0"
//                       step="0.1"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Experience</label>
//                     <input
//                       type="text"
//                       name="experience"
//                       value={jobData.experience}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required

//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Skills (comma-separated)</label>
//                     <input
//                       type="text"
//                       name="skills"
//                       value={jobData.skills.join(', ')}
//                       onChange={handleSkillsChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="e.g., JavaScript, React"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Posted At</label>
//                     <input
//                       type="date"
//                       name="postedAt"
//                       value={jobData.postedAt}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Work Mode</label>
//                     <select
//                       name="type"
//                       value={jobData.type}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="Work from office">Work from office</option>
//                       <option value="Work from home">Work from home</option>
//                       <option value="Work from field">Work from field</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Work Type</label>
//                     <select
//                       name="workType"
//                       value={jobData.workType}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="Full-Time">Full-Time</option>
//                       <option value="Part-Time">Part-Time</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Level</label>
//                     <select
//                       name="level"
//                       value={jobData.level}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required

//                     >
//                       <option value="Junior">Junior</option>
//                       <option value="Mid">Mid</option>
//                       <option value="Senior">Senior</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Role</label>
//                     <input
//                       type="text"
//                       name="role"
//                       value={jobData.role}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Description</label>
//                     <textarea
//                       name="description"
//                       value={jobData.description}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       rows="4"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Responsibilities</label>
//                     <textarea
//                       name="responsibilities"
//                       value={jobData.responsibilities}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       rows="4"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Openings</label>
//                     <input
//                       type="number"
//                       name="openings"
//                       value={jobData.openings}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       min="1"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Requirements (comma-separated)</label>
//                     <input
//                       type="text"
//                       name="requirements"
//                       value={jobData.requirements.join(', ')}
//                       onChange={handleRequirementsChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="e.g., Communication, Teamwork"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Urgent Hiring</label>
//                     <input
//                       type="checkbox"
//                       name="urgent"
//                       checked={jobData.urgent}
//                       onChange={handleInputChange}
//                       className="mr-2"
//                     />
//                     <span>Mark as urgent</span>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Company Logo URL</label>
//                     <input
//                       type="text"
//                       name="img"
//                       value={jobData.img}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="https://dcassetcdn.com/design_img/2531172/542774/542774_13559578_2531172_d07764e6_image.png"
//                     />
//                   </div>
//                   <div className="flex justify-end space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => setShowFresherForm(false)}
//                       className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-gray-200 hover:text-white hover:bg-green-700 active:text-white active:bg-green-800 text-gray-800 font-semibold py-2 px-4 rounded-lg"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Work from Home Form Modal */}
//         <AnimatePresence>
//           {showWfhForm && (
//             <motion.div
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.8, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Work from Home Job</h2>
//                 <form onSubmit={(e) => handleFormSubmit(e, 'wfh')}>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Job Title</label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={jobData.title}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Company</label>
//                     <input
//                       type="text"
//                       name="company"
//                       value={jobData.company}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Location</label>
//                     <input
//                       type="text"
//                       name="location"
//                       value={jobData.location}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Salary (in Lakhs P.A.)</label>
//                     <input
//                       type="number"
//                       name="salary"
//                       value={jobData.salary}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       min="0"
//                       step="0.1"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Experience</label>
//                     <input
//                       type="text"
//                       name="experience"
//                       value={jobData.experience}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Skills (comma-separated)</label>
//                     <input
//                       type="text"
//                       name="skills"
//                       value={jobData.skills.join(', ')}
//                       onChange={handleSkillsChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="e.g., JavaScript, React"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Posted At</label>
//                     <input
//                       type="date"
//                       name="postedAt"
//                       value={jobData.postedAt}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Work Mode</label>
//                     <select
//                       name="type"
//                       value={jobData.type}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required

//                     >
//                       <option value="Work from home">Work from home</option>
//                       <option value="Work from office">Work from office</option>
//                       <option value="Work from field">Work from field</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Work Type</label>
//                     <select
//                       name="workType"
//                       value={jobData.workType}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="Full-Time">Full-Time</option>
//                       <option value="Part-Time">Part-Time</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Level</label>
//                     <select
//                       name="level"
//                       value={jobData.level}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="Junior">Junior</option>
//                       <option value="Mid">Mid</option>
//                       <option value="Senior">Senior</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Role</label>
//                     <input
//                       type="text"
//                       name="role"
//                       value={jobData.role}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Description</label>
//                     <textarea
//                       name="description"
//                       value={jobData.description}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       rows="4"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Responsibilities</label>
//                     <textarea
//                       name="responsibilities"
//                       value={jobData.responsibilities}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       rows="4"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Openings</label>
//                     <input
//                       type="number"
//                       name="openings"
//                       value={jobData.openings}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       min="1"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Requirements (comma-separated)</label>
//                     <input
//                       type="text"
//                       name="requirements"
//                       value={jobData.requirements.join(', ')}
//                       onChange={handleRequirementsChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="e.g., Communication, Teamwork"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Urgent Hiring</label>
//                     <input
//                       type="checkbox"
//                       name="urgent"
//                       checked={jobData.urgent}
//                       onChange={handleInputChange}
//                       className="mr-2"
//                     />
//                     <span>Mark as urgent</span>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Company Logo URL</label>
//                     <input
//                       type="text"
//                       name="img"
//                       value={jobData.img}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="https://dcassetcdn.com/design_img/2531172/542774/542774_13559578_2531172_d07764e6_image.png"
//                     />
//                   </div>
//                   <div className="flex justify-end space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => setShowWfhForm(false)}
//                       className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   <button
//                       type="submit"
//                       className="px-4 py-2 bg-gray-200 hover:text-white hover:bg-green-700 active:text-white active:bg-green-800 text-gray-800 font-semibold py-2 px-4 rounded-lg"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Home Form Modal */}
//         <AnimatePresence>
//           {showHomeForm && (
//             <motion.div
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.8, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Home Job Posting</h2>
//                 <form onSubmit={(e) => handleFormSubmit(e, 'home')}>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Job Title</label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={jobData.title}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Company</label>
//                     <input
//                       type="text"
//                       name="company"
//                       value={jobData.company}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Location</label>
//                     <input
//                       type="text"
//                       name="location"
//                       value={jobData.location}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Salary (in Lakhs P.A.)</label>
//                     <input
//                       type="number"
//                       name="salary"
//                       value={jobData.salary}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       min="0"
//                       step="0.1"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Experience</label>
//                     <input
//                       type="text"
//                       name="experience"
//                       value={jobData.experience}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Skills (comma-separated)</label>
//                     <input
//                       type="text"
//                       name="skills"
//                       value={jobData.skills.join(', ')}
//                       onChange={handleSkillsChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="e.g., JavaScript, React"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Posted At</label>
//                     <input
//                       type="date"
//                       name="postedAt"
//                       value={jobData.postedAt}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Work Mode</label>
//                     <select
//                       name="type"
//                       value={jobData.type}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="Work from office">Work from office</option>
//                       <option value="Work from home">Work from home</option>
//                       <option value="Work from field">Work from field</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Work Type</label>
//                     <select
//                       name="workType"
//                       value={jobData.workType}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="Full-Time">Full-Time</option>
//                       <option value="Part-Time">Part-Time</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Level</label>
//                     <select
//                       name="level"
//                       value={jobData.level}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="Junior">Junior</option>
//                       <option value="Mid">Mid</option>
//                       <option value="Senior">Senior</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Role</label>
//                     <input
//                       type="text"
//                       name="role"
//                       value={jobData.role}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Description</label>
//                     <textarea
//                       name="description"
//                       value={jobData.description}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       rows="4"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Responsibilities</label>
//                     <textarea
//                       name="responsibilities"
//                       value={jobData.responsibilities}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       rows="4"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Openings</label>
//                     <input
//                       type="number"
//                       name="openings"
//                       value={jobData.openings}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       min="1"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Requirements (comma-separated)</label>
//                     <input
//                       type="text"
//                       name="requirements"
//                       value={jobData.requirements.join(', ')}
//                       onChange={handleRequirementsChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="e.g., Communication, Teamwork"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Urgent Hiring</label>
//                     <input
//                       type="checkbox"
//                       name="urgent"
//                       checked={jobData.urgent}
//                       onChange={handleInputChange}
//                       className="mr-2"
//                     />
//                     <span>Mark as urgent</span>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Company Logo URL</label>
//                     <input
//                       type="text"
//                       name="img"
//                       value={jobData.img}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="https://dcassetcdn.com/design_img/2531172/542774/542774_13559578_2531172_d07764e6_image.png"
//                     />
//                   </div>
//                   <div className="flex justify-end space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => setShowHomeForm(false)}
//                       className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-gray-200 hover:text-white hover:bg-green-700 active:text-white active:bg-green-800 text-gray-800 font-semibold py-2 px-4 rounded-lg"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Top Companies Form Modal */}
//         <AnimatePresence>
//           {showTopCompaniesForm && (
//             <motion.div
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.8, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Top Company</h2>
//                 <form onSubmit={(e) => handleFormSubmit(e, 'topCompanies')}>
//                   {/* Title */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Job Title</label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={jobData.title}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                       required
//                     />
//                   </div>

//                   {/* Company Name */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Company Name</label>
//                     <input
//                       type="text"
//                       name="company"
//                       value={jobData.company}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                       required
//                     />
//                   </div>

//                   {/* Location */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Location</label>
//                     <input
//                       type="text"
//                       name="location"
//                       value={jobData.location}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                     />
//                   </div>

//                   {/* Salary */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Salary</label>
//                     <input
//                       type="text"
//                       name="salary"
//                       value={jobData.salary}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                     />
//                   </div>

//                   {/* Experience */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Experience</label>
//                     <input
//                       type="text"
//                       name="experience"
//                       value={jobData.experience}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                     />
//                   </div>

//                   {/* Skills */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Skills (comma-separated)</label>
//                     <input
//                       type="text"
//                       name="skills"
//                       value={jobData.skills.join(', ')}
//                       onChange={handleSkillsChange}
//                       className="w-full p-3 border rounded-lg"
//                       placeholder="e.g., React, Node.js, MongoDB"
//                     />
//                   </div>

//                   {/* Posted At */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Posted Date</label>
//                     <input
//                       type="date"
//                       name="postedAt"
//                       value={jobData.postedAt}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                     />
//                   </div>

//                   {/* Job Type */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Job Type</label>
//                     <select
//                       name="type"
//                       value={jobData.type}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                     >
//                       <option value="Work from office">Work from office</option>
//                       <option value="Work from home">Work from home</option>
//                       <option value="Work from field">Work from field</option>
//                     </select>
//                   </div>

//                   {/* Work Type */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Work Type</label>
//                     <select
//                       name="workType"
//                       value={jobData.workType}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                     >
//                       <option value="Full-Time">Full-Time</option>
//                       <option value="Part-Time">Part-Time</option>
//                       <option value="Contract">Contract</option>
//                     </select>
//                   </div>

//                   {/* Level */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Job Level</label>
//                     <select
//                       name="level"
//                       value={jobData.level}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                     >
//                       <option value="Junior">Junior</option>
//                       <option value="Mid">Mid</option>
//                       <option value="Senior">Senior</option>
//                     </select>
//                   </div>

//                   {/* Role */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Role</label>
//                     <input
//                       type="text"
//                       name="role"
//                       value={jobData.role}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                     />
//                   </div>

//                   {/* Description */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Description</label>
//                     <textarea
//                       name="description"
//                       value={jobData.description}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                       rows="4"
//                       required
//                     />
//                   </div>

//                   {/* Responsibilities */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Responsibilities</label>
//                     <textarea
//                       name="responsibilities"
//                       value={jobData.responsibilities}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                       rows="3"
//                     />
//                   </div>

//                   {/* Openings */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Number of Openings</label>
//                     <input
//                       type="number"
//                       name="openings"
//                       value={jobData.openings}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                       min="1"
//                     />
//                   </div>

//                   {/* Requirements */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Requirements (comma-separated)</label>
//                     <input
//                       type="text"
//                       name="requirements"
//                       value={jobData.requirements.join(', ')}
//                       onChange={handleRequirementsChange}
//                       className="w-full p-3 border rounded-lg"
//                     />
//                   </div>

//                   {/* Urgent */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Is this an urgent role?</label>
//                     <input
//                       type="checkbox"
//                       name="urgent"
//                       checked={jobData.urgent}
//                       onChange={handleInputChange}
//                       className="ml-2"
//                     />
//                   </div>

//                   {/* Company Logo URL */}
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2">Company Logo URL</label>
//                     <input
//                       type="text"
//                       name="img"
//                       value={jobData.img}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border rounded-lg"
//                       placeholder="e.g., https://via.placeholder.com/64"
//                       required
//                     />
//                   </div>

//                   {/* Submit Buttons */}
//                   <div className="flex justify-end space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => setShowTopCompaniesForm(false)}
//                       className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//    </>
//     );
//   };

//   export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showFresherForm, setShowFresherForm] = useState(false);
  const [showWfhForm, setShowWfhForm] = useState(false);
  const [showHomeForm, setShowHomeForm] = useState(false);
  const [showTopCompaniesForm, setShowTopCompaniesForm] = useState(false);
  const [activeButton, setActiveButton] = useState('');
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    experience: '0 years',
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
    img: 'https://dcassetcdn.com/design_img/2531172/542774/542774_13559578_2531172_d07764e6_image.png',
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [topCompaniesData, setTopCompaniesData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const navigate = useNavigate();
  const { state } = useLocation();
  const API_URL = import.meta.env.VITE_JOB_API_URL_SHY;

  useEffect(() => {
    if (state?.openForm) {
      if (state.jobType === 'fresher') {
        setShowFresherForm(true);
        setJobData((prev) => ({
          ...prev,
          company: state.company || '',
          level: 'Junior',
          experience: '0 years',
        }));
      } else if (state.jobType === 'workFromHome') {
        setShowWfhForm(true);
        setJobData((prev) => ({
          ...prev,
          company: state.company || '',
          type: 'Work from home',
        }));
      }
    }
  }, [state]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}`);
      const jobs = response.data.data;

      setRecentJobs(jobs.slice(0, 3));
      setTotalJobs(jobs.length);
      setTotalApplications(jobs.reduce((sum, job) => sum + (job.applicants || 0), 0));

      const topCompaniesResponse = await axios.get(`${API_URL}`);
      setTopCompaniesData(topCompaniesResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 600) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const maxSlide = Math.max(0, topCompaniesData.length - slidesToShow);
        return prev >= maxSlide ? 0 : prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [topCompaniesData.length, slidesToShow]);

  const nextSlide = () => {
    const maxSlide = Math.max(0, topCompaniesData.length - slidesToShow);
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxSlide = Math.max(0, topCompaniesData.length - slidesToShow);
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    setJobData((prev) => ({ ...prev, skills }));
  };

  const handleRequirementsChange = (e) => {
    const requirements = e.target.value
      .split(',')
      .map((req) => req.trim())
      .filter((req) => req);
    setJobData((prev) => ({ ...prev, requirements }));
  };

  const handleFormSubmit = async (e, formType) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...jobData,
        salary: parseFloat(jobData.salary),
        openings: parseInt(jobData.openings, 10),
      };

      if (formType === 'topCompanies') {
        const response = await axios.post(REACT_APP_TOP_COMPANIES_API_URL_FOUR, {
          title: submissionData.title,
          company: submissionData.company,
          location: submissionData.location,
          salary: submissionData.salary,
          experience: submissionData.experience,
          skills: submissionData.skills,
          postedAt: submissionData.postedAt,
          type: submissionData.type,
          workType: submissionData.workType,
          level: submissionData.level,
          role: submissionData.role,
          description: submissionData.description,
          responsibilities: submissionData.responsibilities,
          openings: submissionData.openings,
          requirements: submissionData.requirements,
          urgent: submissionData.urgent,
          logo: submissionData.img,
        });

        console.log('Top Company Data Submitted:', response.data);
        setTopCompaniesData((prev) => [...prev, response.data.data]);
      } else {
        const response = await axios.post(`${API_URL}`, submissionData);
        console.log('Job Data Submitted:', response.data);

        navigate('/', {
          state:
            submissionData.type === 'Work from office'
              ? { workFromOfficeJobData: response.data.data }
              : submissionData.type === 'Work from home'
                ? { workFromHomeJobData: response.data.data }
                : { homeJobData: response.data.data },
        });
      }

      await fetchDashboardData();

      setShowFresherForm(false);
      setShowWfhForm(false);
      setShowHomeForm(false);
      setShowTopCompaniesForm(false);
      setJobData({
        title: '',
        company: '',
        location: '',
        salary: '',
        experience: formType === 'fresher' ? '0 years' : '',
        skills: [],
        postedAt: new Date().toISOString().split('T')[0],
        type: formType === 'wfh' ? 'Work from home' : 'Work from office',
        workType: 'Full-Time',
        level: formType === 'fresher' ? 'Junior' : '',
        role: '',
        description: '',
        responsibilities: '',
        openings: 1,
        requirements: [],
        urgent: false,
        img: 'https://via.placeholder.com/64',
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          className="text-lg font-semibold text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading dashboard...
        </motion.div>
      </div>
    );
  }

  const maxSlide = Math.max(0, topCompaniesData.length - slidesToShow);
  const totalDots = maxSlide + 1;

  return (
    <>
      <Link to="/">
        <img src='/images/right-arrow.png' className='w-4 h-4 ml-6 mt-4 rotate-[90deg]' />
      </Link>

      <div className="flex min-h-screen bg-gray-50 font-sans">
        {/* Sidebar */}
        <motion.div
          className="w-64 h-screen bg-gradient-to-b from-blue-700 to-blue-500 text-white p-6 flex flex-col shadow-lg"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-2 bg-[#1f8268] rounded-xl shadow-inner">
            <p className="text-[13px] opacity-80">Welcome back,</p>
            <p className="font-semibold text-lg">Admin</p>
          </div>
          <div className="flex-1 mt-3">
            <button
              onClick={() => {
                setActiveButton('fresher');
                setShowFresherForm(true);
                setJobData((prev) => ({ ...prev, level: 'Junior', experience: '0 years' }));
              }}
              className={`w-full py-3 mb-4 ${activeButton === 'fresher' ? 'bg-[#1f8268] text-white' : 'bg-white text-[#1f8268]'
                } rounded-xl font-medium hover:bg-gray-400 active:bg-gray-300 transition-colors shadow-sm`}
            >
              Apply for job
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-500 mb-8 text-lg">Manage your jobs and applications seamlessly.</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                whileHover={{ scale: 1.03 }}
              >
                <h2 className="text-lg font-semibold text-gray-700">Total Jobs Posted</h2>
                <p className="text-4xl font-bold text-[#1f8268] mt-2">{totalJobs}</p>
              </motion.div>
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                whileHover={{ scale: 1.03 }}
              >
                <h2 className="text-lg font-semibold text-gray-700">Total Applications</h2>
                <p className="text-4xl font-bold text-green-600 mt-2">{totalApplications}</p>
              </motion.div>
            </div>

            {/* Recent Jobs */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Jobs</h2>
              {recentJobs.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-5 gap-4 font-semibold text-gray-600 border-b pb-2 mb-4">
                    <p>Job Title</p>
                    <p>Location</p>
                    <p>Level</p>
                    <p>Work Mode</p>
                    <p>Salary</p>
                  </div>
                  {recentJobs
                    .filter((job) => job.type === 'Work from office')
                    .map((job, index) => (
                      <motion.div
                        key={job._id}
                        className="grid grid-cols-5 gap-4 py-3 border-b last:border-b-0 hover:bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <p className="font-medium text-gray-800">{job.title}</p>
                        <p className="text-gray-600">{job.location}</p>
                        <p className="text-gray-600">{job.level}</p>
                        <p className="text-gray-600">{job.type}</p>
                        <p className="text-gray-600">₹{job.salary} Lakhs P.A.</p>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent jobs available.</p>
                  <button
                    onClick={() => setShowFresherForm(true)}
                    className="mt-4 px-6 py-2 bg-[#1f8268] text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Your First Job
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Job for Fresher Form Modal */}
        <AnimatePresence>
          {showFresherForm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply For Job</h2>
                <form onSubmit={(e) => handleFormSubmit(e, 'fresher')}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Job Title</label>
                    <input
                      type="text"
                      name="title"
                      value={jobData.title}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={jobData.company}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={jobData.location}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Salary (in Lakhs P.A.)</label>
                    <input
                      type="number"
                      name="salary"
                      value={jobData.salary}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={jobData.experience}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={jobData.skills.join(', ')}
                      onChange={handleSkillsChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., JavaScript, React"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Posted At</label>
                    <input
                      type="date"
                      name="postedAt"
                      value={jobData.postedAt}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Work Mode</label>
                    <select
                      name="type"
                      value={jobData.type}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Work from office">Work from office</option>
                      <option value="Work from home">Work from home</option>
                      <option value="Work from field">Work from field</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Work Type</label>
                    <select
                      name="workType"
                      value={jobData.workType}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Level</label>
                    <select
                      name="level"
                      value={jobData.level}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={jobData.role}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={jobData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Responsibilities</label>
                    <textarea
                      name="responsibilities"
                      value={jobData.responsibilities}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Openings</label>
                    <input
                      type="number"
                      name="openings"
                      value={jobData.openings}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Requirements (comma-separated)</label>
                    <input
                      type="text"
                      name="requirements"
                      value={jobData.requirements.join(', ')}
                      onChange={handleRequirementsChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Communication, Teamwork"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Urgent Hiring</label>
                    <input
                      type="checkbox"
                      name="urgent"
                      checked={jobData.urgent}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Mark as urgent</span>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Company Logo URL</label>
                    <input
                      type="text"
                      name="img"
                      value={jobData.img}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://dcassetcdn.com/design_img/2531172/542774/542774_13559578_2531172_d07764e6_image.png"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowFresherForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-200 hover:text-white hover:bg-green-700 active:text-white active:bg-green-800 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Work from Home Form Modal */}
        <AnimatePresence>
          {showWfhForm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Work from Home Job</h2>
                <form onSubmit={(e) => handleFormSubmit(e, 'wfh')}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Job Title</label>
                    <input
                      type="text"
                      name="title"
                      value={jobData.title}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={jobData.company}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={jobData.location}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Salary (in Lakhs P.A.)</label>
                    <input
                      type="number"
                      name="salary"
                      value={jobData.salary}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={jobData.experience}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={jobData.skills.join(', ')}
                      onChange={handleSkillsChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., JavaScript, React"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Posted At</label>
                    <input
                      type="date"
                      name="postedAt"
                      value={jobData.postedAt}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Work Mode</label>
                    <select
                      name="type"
                      value={jobData.type}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Work from home">Work from home</option>
                      <option value="Work from office">Work from office</option>
                      <option value="Work from field">Work from field</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Work Type</label>
                    <select
                      name="workType"
                      value={jobData.workType}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Level</label>
                    <select
                      name="level"
                      value={jobData.level}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={jobData.role}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={jobData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Responsibilities</label>
                    <textarea
                      name="responsibilities"
                      value={jobData.responsibilities}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Openings</label>
                    <input
                      type="number"
                      name="openings"
                      value={jobData.openings}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Requirements (comma-separated)</label>
                    <input
                      type="text"
                      name="requirements"
                      value={jobData.requirements.join(', ')}
                      onChange={handleRequirementsChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Communication, Teamwork"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Urgent Hiring</label>
                    <input
                      type="checkbox"
                      name="urgent"
                      checked={jobData.urgent}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Mark as urgent</span>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Company Logo URL</label>
                    <input
                      type="text"
                      name="img"
                      value={jobData.img}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://dcassetcdn.com/design_img/2531172/542774/542774_13559578_2531172_d07764e6_image.png"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowWfhForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-200 hover:text-white hover:bg-green-700 active:text-white active:bg-green-800 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home Form Modal */}
        <AnimatePresence>
          {showHomeForm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Home Job Posting</h2>
                <form onSubmit={(e) => handleFormSubmit(e, 'home')}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Job Title</label>
                    <input
                      type="text"
                      name="title"
                      value={jobData.title}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={jobData.company}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={jobData.location}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Salary (in Lakhs P.A.)</label>
                    <input
                      type="number"
                      name="salary"
                      value={jobData.salary}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={jobData.experience}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={jobData.skills.join(', ')}
                      onChange={handleSkillsChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., JavaScript, React"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Posted At</label>
                    <input
                      type="date"
                      name="postedAt"
                      value={jobData.postedAt}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Work Mode</label>
                    <select
                      name="type"
                      value={jobData.type}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Work from office">Work from office</option>
                      <option value="Work from home">Work from home</option>
                      <option value="Work from field">Work from field</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Work Type</label>
                    <select
                      name="workType"
                      value={jobData.workType}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Level</label>
                    <select
                      name="level"
                      value={jobData.level}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={jobData.role}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={jobData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Responsibilities</label>
                    <textarea
                      name="responsibilities"
                      value={jobData.responsibilities}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Openings</label>
                    <input
                      type="number"
                      name="openings"
                      value={jobData.openings}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Requirements (comma-separated)</label>
                    <input
                      type="text"
                      name="requirements"
                      value={jobData.requirements.join(', ')}
                      onChange={handleRequirementsChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Communication, Teamwork"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Urgent Hiring</label>
                    <input
                      type="checkbox"
                      name="urgent"
                      checked={jobData.urgent}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Mark as urgent</span>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Company Logo URL</label>
                    <input
                      type="text"
                      name="img"
                      value={jobData.img}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://dcassetcdn.com/design_img/2531172/542774/542774_13559578_2531172_d07764e6_image.png"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowHomeForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-200 hover:text-white hover:bg-green-700 active:text-white active:bg-green-800 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Companies Form Modal */}
        <AnimatePresence>
          {showTopCompaniesForm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Top Company</h2>
                <form onSubmit={(e) => handleFormSubmit(e, 'topCompanies')}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Job Title</label>
                    <input
                      type="text"
                      name="title"
                      value={jobData.title}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={jobData.company}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={jobData.location}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Salary</label>
                    <input
                      type="text"
                      name="salary"
                      value={jobData.salary}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={jobData.experience}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={jobData.skills.join(', ')}
                      onChange={handleSkillsChange}
                      className="w-full p-3 border rounded-lg"
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Posted Date</label>
                    <input
                      type="date"
                      name="postedAt"
                      value={jobData.postedAt}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Job Type</label>
                    <select
                      name="type"
                      value={jobData.type}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="Work from office">Work from office</option>
                      <option value="Work from home">Work from home</option>
                      <option value="Work from field">Work from field</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Work Type</label>
                    <select
                      name="workType"
                      value={jobData.workType}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Job Level</label>
                    <select
                      name="level"
                      value={jobData.level}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={jobData.role}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={jobData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Responsibilities</label>
                    <textarea
                      name="responsibilities"
                      value={jobData.responsibilities}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                      rows="3"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Number of Openings</label>
                    <input
                      type="number"
                      name="openings"
                      value={jobData.openings}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                      min="1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Requirements (comma-separated)</label>
                    <input
                      type="text"
                      name="requirements"
                      value={jobData.requirements.join(', ')}
                      onChange={handleRequirementsChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Is this an urgent role?</label>
                    <input
                      type="checkbox"
                      name="urgent"
                      checked={jobData.urgent}
                      onChange={handleInputChange}
                      className="ml-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Company Logo URL</label>
                    <input
                      type="text"
                      name="img"
                      value={jobData.img}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                      placeholder="e.g., https://via.placeholder.com/64"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowTopCompaniesForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Dashboard;