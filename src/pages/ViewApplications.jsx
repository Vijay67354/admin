import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user._id) {
      navigate('/candidatelogin', { replace: true });
      return;
    }

    const fetchApplications = async () => {
      try {
        setIsLoading(true);
       const jobsResponse = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/jobs/${user._id}`);
        if (!jobsResponse.ok) throw new Error('Failed to fetch jobs');
        const jobs = await jobsResponse.json();

        const allApplications = [];
        for (const job of jobs) {
         const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/applications/${job._id}`);
          if (response.ok) {
            const data = await response.json();
            allApplications.push(...data);
          }
        }

        setApplications(allApplications);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [navigate, user]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading applications...</div>;
  }

  if (!user) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">View Applications</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {applications.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-4 font-semibold text-gray-600 border-b pb-2">
              <p>Candidate Name</p>
              <p>Email</p>
              <p>Applied At</p>
            </div>
            {applications.map((app) => (
              <div key={app._id} className="grid grid-cols-3 gap-4 py-2 border-b">
                <p>{app.candidateId?.name || 'Unknown'}</p>
                <p>{app.candidateId?.email || 'Unknown'}</p>
                <p>{new Date(app.appliedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </>
        ) : (
          <p className="text-center py-4 text-gray-500">No applications available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewApplications;