

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PopularSearches() {
  const location = useLocation();
  const navigate = useNavigate();
  const { workFromOfficeJobData, workFromHomeJobData } = location.state || {};
  const [workFromOfficeJobsCount, setWorkFromOfficeJobsCount] = useState(0);
  const [workFromHomeJobsCount, setWorkFromHomeJobsCount] = useState(0);
  const VITE_JOB_API_URL = import.meta.env.VITE_JOB_API_URL;
  useEffect(() => {
    const fetchJobCounts = async () => {
      try {
        // Fetch work from office jobs count
        const wfoResponse = await axios.get(`${VITE_JOB_API_URL}`, {
          params: { type: 'Work from office' },
        });
        if (wfoResponse.data.success) {
          setWorkFromOfficeJobsCount(wfoResponse.data.data.length);
        }

        // Fetch work from home jobs count
        const wfhResponse = await axios.get(`${VITE_JOB_API_URL}`, {
          params: { type: 'Work from home' },
        });
        if (wfhResponse.data.success) {
          setWorkFromHomeJobsCount(wfhResponse.data.data.length);
        }
      } catch (error) {
        console.error('Error fetching job counts:', error);
      }
    };

    fetchJobCounts();
  }, []);

  const formattedWorkFromOfficeJobData = workFromOfficeJobData
    ? {
      title: 'Work from Office Jobs',
      category: 'Work from Office',
      jobs: [
        {
          designation: workFromOfficeJobData.title || 'N/A',
          company: workFromOfficeJobData.company || 'Apna',
          location: workFromOfficeJobData.location || 'N/A',
          salary: workFromOfficeJobData.salary ? `₹${workFromOfficeJobData.salary} Lakhs P.A.` : 'N/A',
          workMode: workFromOfficeJobData.type || 'Work from Office',
          workType: workFromOfficeJobData.workType || 'Full-time',
          experience: workFromOfficeJobData.experience || '0 years',
          description: workFromOfficeJobData.description || 'No description available',
          postedAt: workFromOfficeJobData.postedAt || '2025-06-03',
          skills: workFromOfficeJobData.skills || [],
          level: workFromOfficeJobData.level || 'Junior',
          role: workFromOfficeJobData.role || 'N/A',
          responsibilities: workFromOfficeJobData.responsibilities || 'N/A',
          openings: workFromOfficeJobData.openings || 1,
          requirements: workFromOfficeJobData.requirements || [],
          urgent: workFromOfficeJobData.urgent || false,
          img: workFromOfficeJobData.img,
        },
      ],
    }
    : {
      title: 'Work from Office Jobs',
      category: 'Work from Office',
      jobs: [],
    };

  const formattedWorkFromHomeJobData = workFromHomeJobData
    ? {
      title: 'Work from Home Jobs',
      category: 'Work from Home',
      jobs: [
        {
          designation: workFromHomeJobData.title || 'N/A',
          company: workFromHomeJobData.company || 'SupportNow',
          location: workFromHomeJobData.location || 'N/A',
          salary: workFromHomeJobData.salary ? `₹${workFromHomeJobData.salary} Lakhs P.A.` : 'N/A',
          workMode: workFromHomeJobData.type || 'Work from home',
          workType: workFromHomeJobData.workType || 'Full-time',
          experience: workFromHomeJobData.experience || 'N/A',
          description: workFromHomeJobData.description || 'No description available',
          postedAt: workFromHomeJobData.postedAt || '2025-06-03',
          skills: workFromHomeJobData.skills || [],
          level: workFromHomeJobData.level || 'N/A',
          role: workFromHomeJobData.role || 'N/A',
          responsibilities: workFromHomeJobData.responsibilities || 'N/A',
          openings: workFromHomeJobData.openings || 1,
          requirements: workFromHomeJobData.requirements || [],
          urgent: workFromHomeJobData.urgent || false,
          img: workFromHomeJobData.img,
        },
      ],
    }
    : {
      title: 'Work from Home Jobs',
      category: 'Work from Home',
      jobs: [],
    };

  const handleCardClick = (category) => {
    const jobType = category === 'Work from Office' ? 'workFromOffice' : 'workFromHome';
    navigate('/jobdetails', {
      state: {
        searchParams: {},
        jobType,
      },
    });
  };

  return (
    <div className="max-w-[1450px] mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-1">
          <h2 className="mb-0 text-[32px] font-semibold leading-[48px] text-black md:text-left md:text-[66px] md:leading-[67px] Inter">
            Popular Searches on NextHire
          </h2>
        </div>

        <div className="lg:col-span-1 hover:rounded-lg group border-2 hover:border-[#DE3700]">
          <div
            className="bg-white rounded-2xl pt-6 pr-6 pl-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative cursor-pointer"
            onClick={() => handleCardClick('Work from Office')}
          >
            <div className="inline-block tracking-wider text-[#8c8594] Inter text-gray-800 group-hover:text-[#DE3700] text-sm font-medium py-1 rounded-full mb-4">
              TRENDING AT #1
            </div>
            <h3 className="text-2xl Inter group-hover:text-[#DE3700] font-semibold text-gray-900 mb-4">
              Work from Office Jobs ({workFromOfficeJobsCount})
            </h3>

            <div className="flex justify-end relative">
              <div className="flex gap-10 items-center">
                <div className="hidden lg:flex group-hover:bg-[#DE3700] group-hover:rounded-xl px-3 py-2 text-gray-700 cursor-pointer transition-all duration-300">
                  <span className="font-medium group-hover:text-white">View all</span>
                  <ChevronRight className="w-4 h-4 ml-1 mt-1 group-hover:text-white" />
                </div>

                <div className="w-56 h-56 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <div className="bg-white/20 rounded-lg flex items-center justify-center">
                    <img
                      src="https://apna.co/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fmumbai_apnatime_prod%2Fapna-home%2Ffreshers-jobs.png&w=1920&q=50"
                      alt="Work from Office Jobs"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 hover:rounded-lg group border-2 hover:border-[#DE3700]">
          <div
            className="bg-white rounded-2xl pt-6 pr-6 pl-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative cursor-pointer"
            onClick={() => handleCardClick('Work from Home')}
          >
            <div className="inline-block tracking-wider text-[#8c8594] Inter text-gray-800 group-hover:text-[#DE3700] text-sm font-medium py-1 rounded-full mb-4">
              TRENDING AT #2
            </div>
            <h3 className="text-2xl Inter group-hover:text-[#DE3700] font-semibold text-gray-900 mb-4">
              Work from Home Jobs ({workFromHomeJobsCount})
            </h3>


            <div className="flex gap-10 justify-end items-center">
              <div className="hidden lg:flex group-hover:bg-[#DE3700] group-hover:rounded-xl px-3 py-2 text-gray-700 cursor-pointer transition-all duration-300">
                <span className="font-medium group-hover:text-white">View all</span>
                <ChevronRight className="w-4 h-4 ml-1 mt-1 group-hover:text-white" />
              </div>

              <div className="w-56 h-56 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <div className="bg-white/20 rounded-lg flex items-center justify-center">
                  <img
                    src="https://apna.co/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fmumbai_apnatime_prod%2Fapna-home%2Fwork-from-home-jobs.png&w=3840&q=50"
                    alt="Work from Home Jobs"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopularSearches;