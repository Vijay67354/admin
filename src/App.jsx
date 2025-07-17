import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext.jsx'; // Updated extension
import Home from './pages/Home';
import Signup from './pages/Signup';
import Sports from './pages/Sports';
import Technology from './pages/Technology';
import Sidebar from './pages/Sidebar';
import Signin from './pages/Signin';
import JobListing from './pages/JobListening';
import ImageSlider from './pages/ImgSlider';
import SearchResults from './pages/SearchResults';
import HomeSlider from './component/HomeSlider';
import PopularSearches from './pages/PopularSearches';
import JobOpening from './pages/JobOpening';
import Testimonial from './component/Testimonial';
import Resume from './component/Resume';
import Profile from './component/Profile';
import BotUIChat from './component/BotUIChat';
import WhatsAppQRCode from './component/WhatsAppQRCode';
import ForgotPassword from './pages/ForgetPassword';
import OtpVerification from './pages/OtpVerification';
import ResetPassword from './pages/ResetPassword';
import CandidateLogin from './pages/CandidateLogin';
import AddJob from './pages/AddJob.jsx';
import ManageJobs from './pages/ManageJobs';
import ViewApplications from './pages/ViewApplications';
import Dashboard from './pages/Dashboard';
import CategoryJobs from './pages/CategoryJobs';
import JobDetails from './pages/JobDetails.jsx';
import JobOpeningDetail from './pages/JobOpeningDetail.jsx';
import PrivacyPolicy from './component/PrivacyPolicy.jsx';

const App = () => {
  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/candidatelogin" element={<CandidateLogin onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/whatsappqrcode" element={<WhatsAppQRCode />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/addjob" element={<AddJob />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/managejobs" element={<ManageJobs />} />
           <Route path="/jobopeningdetail" element={<JobOpeningDetail />} />
      <Route path="/jobdetails" element={<JobDetails />} /> 

          <Route path="/viewapplications" element={<ViewApplications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/signin" element={<Signin onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          <Route path="/botuichat" element={<BotUIChat />} />
          <Route path="/homeslider" element={<HomeSlider />} />
          <Route path="/searchresults" element={<SearchResults />} />
          <Route path="/jobopening" element={<JobOpening />} />
          <Route path="/testimonial" element={<Testimonial />} />
             <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      
          <Route path="/popularsearches" element={<PopularSearches />} />
          <Route path="/otpverification" element={<OtpVerification />} />
          <Route path="/jobs/:category" element={<CategoryJobs />} />
          <Route path="/" element={<Sidebar />}>
            <Route path="sports" element={<Sports />} />
            <Route path="joblistening/:id" element={<JobListing />} />
            <Route path="technology" element={<Technology />} />
            <Route path="imageslider" element={<ImageSlider />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;