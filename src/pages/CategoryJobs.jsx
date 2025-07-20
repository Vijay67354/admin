import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CategoryJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { category } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user._id) {
      navigate('/candidatelogin', { replace: true });
      return;
    }

    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/jobs`);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();

        const filteredJobs = data.filter((job) => {
          if (category === 'Jobs for Freshers') {
            return job.level.toLowerCase().includes('fresher') || job.level.toLowerCase().includes('junior');
          } else if (category === 'Work from home Jobs') {
            return job.location.toLowerCase().includes('remote') || job.location.toLowerCase().includes('home');
          }
          return false;
        });

        setJobs(filteredJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [navigate, user, category]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading jobs...</div>;
  }

  if (!user) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{category}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-4 gap-4 font-semibold text-gray-600 border-b pb-2">
              <p>Job Title</p>
              <p>Location</p>
              <p>Level</p>
              <p>Salary</p>
            </div>
            {jobs.map((job) => (
              <div key={job._id} className="grid grid-cols-4 gap-4 py-2 border-b">
                <p>{job.title}</p>
                <p>{job.location}</p>
                <p>{job.level}</p>
                <p>{job.salary}</p>
              </div>
            ))}
          </>
        ) : (
          <p className="text-center py-4 text-gray-500">No jobs available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryJobs;