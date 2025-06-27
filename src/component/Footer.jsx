import React from 'react';
import { Facebook, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';
import WhatsAppQRCode from './WhatsAppQRCode';
import { NavLink } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          
          {/* Left Section - Logo and Social Media */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">

            </div>
            
            {/* Social Media Section */}
            <div className="flex flex-col gap-4">
  <h3 className="text-lg font-medium">Follow us on social media</h3>
  <div className="flex gap-4">
    <a 
      href="https://www.facebook.com" 
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
      aria-label="Facebook"
    >
      <Facebook size={20} />
    </a>
    <a 
      href="https://www.linkedin.com" 
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
      aria-label="LinkedIn"
    >
      <Linkedin size={20} />
    </a>
    <a 
      href="https://twitter.com" 
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
      aria-label="Twitter"
    >
      <Twitter size={20} />
    </a>
    <a 
      href="https://www.instagram.com" 
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
      aria-label="Instagram"
    >
      <Instagram size={20} />
    </a>
    <a 
      href="https://www.youtube.com" 
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
      aria-label="YouTube"
    >
      <Youtube size={20} />
    </a>
  </div>
</div>

          </div>

          {/* Right Section - App Download */}
          <div className="bg-white rounded-2xl p-6 text-gray-800 max-w-sm w-full lg:w-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Apply on the go</h3>
                <p className="text-gray-600 mb-4 text-sm">Get real time job updates on our App</p>
                
                {/* Google Play Button */}
                <div className="inline-flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6">
                      <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-xs leading-none">GET IT ON</div>
                      <div className="text-sm font-semibold leading-none mt-1">Google Play</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* QR Code */}
              <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-lg">
                <div className="w-16 h-16 bg-black rounded grid grid-cols-8 gap-px p-1">
                  {/* Simple QR code pattern */}
                  {/* {Array.from({ length: 64 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`${
                        [0,1,2,3,4,5,6,7,8,14,16,22,24,30,32,38,40,41,42,43,44,45,46,47,49,51,53,55,56,57,58,59,60,61,62,63].includes(i) 
                        ? 'bg-white' : 'bg-black'
                      } rounded-sm`}
                    />
                  ))} */}
                  <WhatsAppQRCode/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Links */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>© 2025 NextHire | All rights reserved</div>
            <div className="flex gap-6">
         <div className="flex gap-6">
  <NavLink
    to="/PrivacyPolicy"
    className="hover:text-white transition-colors duration-200"
  >
    Privacy Policy
  </NavLink>

 
</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;