

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import HomeSlider from '../component/HomeSlider';
import PopularSearches from './PopularSearches';
import JobOpening from './JobOpening';
import Testimonial from '../component/Testimonial';
import Footer from '../component/Footer';
import BotUIChat from '../component/BotUIChat';

const Home = () => {
  const [designation, setDesignation] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { state } = useLocation(); // Access state from Dashboard

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!designation || !experience || !location) {
      setError('Please fill all the fields.');
      setMessage('');
      setTimeout(() => setError(''), 2000);
      return;
    }

    setError('');
    setMessage(`Searching for: ${designation}, ${experience} years, ${location}`);

    try {
      const response = await axios.get(REACT_APP_JOBS_SEARCH_API_FIVE, {
        params: { designation, experience, location },
      });

      const filteredJobs = response.data;
      console.log('Fetched Jobs in Home:', filteredJobs);

      // Pass both the filtered jobs, search params, and homeJobData (if available) to SearchResults
      navigate('/searchresults', {
        state: {
          filteredJobs,
          searchParams: { designation, experience, location },
          homeJobData: state?.homeJobData || null, // Pass homeJobData from Dashboard
        },
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again.');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(to bottom right, #f5f3ff, #fdf2f8, #eff6ff)' }}>
        <Navbar />
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-segoe mb-6 mt-6 text-[23px] font-bold md:mt-14 text-[#1F8268]">
            INDIA’S #1 JOB PLATFORM
          </h1>
          <h2 className="mb-[32px] mt-3 max-w-[300px] text-[32px] text-[#19082a] font-bold leading-[40px] md:mt-6 md:max-w-none md:text-[60px] md:leading-[67px] Inter">
            Your job search ends here
          </h2>
          <h2 className="m-0 mb-[20px] mt-1 w-[180px] text-md font-[400] md:mb-[55px] md:mt-4 md:w-full md:text-[24px] Inter text-[#190a28]">
            Discover 50 lakh+ career opportunities
          </h2>
          <div className="grid grid-cols-12">
            <div className="lg:col-span-7 col-span-12">
              <form
                onSubmit={handleSearch}
                className="md:max-w-5xl w-full mt-16 bg-white shadow-lg rounded-2xl p-3 flex flex-col md:flex-row items-center gap-1"
                aria-label="Job search form"
              >
                <div className="flex-1 px-1 w-full md:w-auto relative">
                  <label htmlFor="designation" className="sr-only placeholder:text-gray-800 tracking-wider">
                    Search job by title
                  </label>
                  <span className="absolute left-3 top-[70%] transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    id="designation"
                    type="text"
                    placeholder="Search job by title"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-gray-700 placeholder:text-gray-800 tracking-wider placeholder:text-[16px] focus:outline-none border-r border-gray-300"
                  />
                </div>

                <div className="flex-1 w-full md:w-auto">
                  <label htmlFor="experience" className="sr-only tracking-wider placeholder:text-gray-800">
                    Select experience level
                  </label>
                  <select
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-transparent placeholder:text-gray-600 placeholder:text-[16px] outline-0 border-r border-gray-300"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>

                <div className="flex-1 w-full md:w-auto">
                  <label htmlFor="location" className="sr-only">Search for an area of location</label>
                  <input
                    id="location"
                    type="text"
                    placeholder="Search for an area of location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 placeholder:text-gray-600 placeholder:text-[16px] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-10 py-[10px] text-lg rounded font-semibold text-xl leading-6 min-w-[156px] bg-[#1f8268] hover:bg-teal-700 text-white"
                >
                  Search jobs
                </button>
              </form>
              <div>
                <h1 className="mt-16 mb-1 text-[20px] font-[600] leading-[20px] text-[#172B4D] md:text-start md:text-[24px] md:leading-[28px] font-semibold md:text-[#190A28]">
                  Proud to Support
                </h1>
                <div className="flex mt-4 justify-start items-center gap-8 mb-6">
                  <div className="flex items-center">
                    <img
                      src="https://cdn.apna.co/apna-learn/Support%20Icons/ministry-of-labour-and-employment-logo.png"
                      alt="Ministry of Labour & Employment Logo"
                      className="w-36 h-30 mr-2"
                    />
                  </div>
                  <div className="flex items-center">
                    <img
                      src="https://cdn.apna.co/apna-learn/Support%20Icons/aicte-seeklogo.png"
                      alt="ACTE Logo"
                      className="w-24 h-20 mr-2"
                    />
                  </div>
                  <div className="flex items-center">
                    <img
                      src="https://cdn.apna.co/apna-learn/Support%20Icons/DPIIT-header-new.png"
                      alt="DPIIT Logo"
                      className="w-36 h-30 mr-2"
                    />
                  </div>
                </div>
                <h1 className="text-[14px] mt-10 mb-10 font-[600] leading-[20px] text-[#172B4D] md:text-start md:text-[27px] md:leading-[28px] md:text-[#190A28]">
                  Trusted by 1000+ enterprises and 7 lakh+ MSMEs for hiring
                </h1>
                <HomeSlider />
              </div>
            </div>
            <div className="lg:col-span-5 col-span-7">
              <img
                src="https://apna.co/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fmumbai_apnatime_prod%2Fapna-home%2FHomePageCreative.png&w=3840&q=75"
                alt="Job search promotional graphic"
                className="lg:h-[80vh] h-[50vh] w-full"
              />
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-center text-xl mt-2">{error}</p>}
        {message && <p className="text-green-600 text-xl mt-2">{message}</p>}
      </div>
      <PopularSearches />
      <JobOpening />
      <Testimonial />
      <Footer />
      <BotUIChat />
    </div>
  );
};

export default Home;