import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">Last updated: June 14, 2025</p>

      <p className="mb-4">
        At <strong>Nexthire</strong>, we value your privacy. This Privacy Policy describes how we collect, use, and protect your information when you use our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Personal details like name, email, phone number, and resume.</li>
        <li>Job preferences and browsing activity on our platform.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside mb-4">
        <li>To match you with relevant job listings.</li>
        <li>To contact you with job alerts and updates.</li>
        <li>To improve our platform's functionality and user experience.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
      <p className="mb-4">We do not sell your data. Your information may be shared only with verified employers or service providers assisting us in running the platform.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Rights</h2>
      <ul className="list-disc list-inside mb-4">
        <li>You can update or delete your information anytime.</li>
        <li>You can request a copy of the data we store about you.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Security</h2>
      <p className="mb-4">We use standard security measures to protect your personal data from unauthorized access.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
      <p>If you have questions about this policy, you can contact us at <a href="mailto:support@nexthire.com" className="text-blue-600">support@nexthire.com</a>.</p>
    </div>
  );
};

export default PrivacyPolicy;
