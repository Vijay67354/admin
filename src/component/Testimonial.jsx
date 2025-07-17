import React from 'react';
import Slider from 'react-slick'; // Import react-slick

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Kaynat Mansuri",
      rating: 4.5,
      status: "PLACED",
      profileImage: "https://apna.co/_next/image?url=https%3A%2F%2Fcdn.apna.co%2Fcloudinary%2FHomepageRevampAssets%2Fjenil-ghevariya.png&w=3840&q=75",
      testimonial: "It is definitely a great app with correct and true information on the job details. I am happy to use it and I would also recommend my friends to use it for their career development."

    },
    {
      id: 2,
      name: "Rekha",
      rating: 4.5,
      status: "PLACED",
      profileImage: "https://apna.co/_next/image?url=https%3A%2F%2Fcdn.apna.co%2Fcloudinary%2FHomepageRevampAssets%2Fkaynat-mansuri.png&w=3840&q=75",
      testimonial: "Good and helpful app, even for freshers with good qualifications. There are jobs in IT, Finance, Househelp and many more. It's very helpful. Thank you, Apna app!!"
    }
  ];

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <svg key={index} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <div key={index} className="relative">
                <svg className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
                <svg className="w-4 h-4 text-yellow-400 fill-current absolute top-0 left-0" viewBox="0 0 20 20" style={{clipPath: 'inset(0 50% 0 0)'}}>
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              </div>
            );
          } else {
            return (
              <svg key={index} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            );
          }
        })}
      </div>
    );
  };

  // Slider settings with adjusted spacing
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // Show 2 slides at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    centerMode: true, // Enable center mode for better spacing
    centerPadding: '20px', // Add padding between slides
  };

  return (
<div>
      <div className=" mt-20 bg-[#EAF8F4]">
      <div className=" mx-auto px-4">
        <div className="grid grid-cols-12  gap-4 items-center bg-[#EAF8F4] rounded-2xl shadow-lg ">
          {/* Left Panel - Reduced Space */}
          <div className="col-span-5 flex items-center  ">
    <img src='/images/companyseeker.png' className='w-full h-[600px]'/>
          </div>

          {/* Right Panel with Slider */}
          <div className="col-span-7 py-6 ">
            <Slider {...sliderSettings}>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="px-2"> {/* Add padding to create gap between slides */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={testimonial.profileImage} 
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-emerald-600 font-medium text-sm">{testimonial.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-black">{testimonial.rating}</span>
                          <StarRating rating={testimonial.rating} />
                        </div>
                      </div>
                    </div>
                    <p className="text-black font-normal leading-relaxed line-clamp-5">
                      "{testimonial.testimonial}"
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

    </div>
 <div className='flex h-[590px] justify-center mx-auto mt-11 mb-1 pt-7 pb-7'>
      <img src='/images/apna.png'  className='w-full  object-cover'/>
    </div>
</div>
  );
};

export default Testimonial;