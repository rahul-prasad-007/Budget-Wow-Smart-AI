import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/**
 * LandingTestimonials Component
 * 
 * Testimonials slider section with user reviews.
 * Memoized to prevent unnecessary re-renders.
 */
const LandingTestimonials = React.memo(() => {
  const navigate = useNavigate();

  const testimonials = [
    {
      id: 1,
      initials: "JD",
      name: "John Doe",
      role: "Financial Advisor",
      bgColor: "bg-expense-light",
      accent: "#e11d48",
      rating: 5,
      text: "The AI receipt scanner is a game-changer. I snap a photo and every expense is logged in seconds — no manual typing!"
    },
    {
      id: 2,
      initials: "SM",
      name: "Sarah Miller",
      role: "Entrepreneur",
      bgColor: "bg-expense",
      accent: "#2563eb",
      rating: 5,
      text: "Groq AI insights told me exactly where I was overspending. Saved ₹8,000 in the first month alone."
    },
    {
      id: 3,
      initials: "MR",
      name: "Mike Rodriguez",
      role: "Student",
      bgColor: "bg-expense-dark",
      accent: "#16a34a",
      rating: 5,
      text: "Perfect for students! Scan cafeteria receipts with AI and the app categorizes everything automatically."
    },
    {
      id: 4,
      initials: "EL",
      name: "Emily Lee",
      role: "Freelancer",
      bgColor: "bg-expense-light",
      accent: "#9333ea",
      rating: 5,
      text: "As a freelancer, AI insights help me separate business vs personal spending. The smart categories are spot-on."
    },
    {
      id: 5,
      initials: "DT",
      name: "David Thompson",
      role: "Family Man",
      bgColor: "bg-expense",
      accent: "#ea580c",
      rating: 5,
      text: "My wife and I use the receipt scanner daily. BudgetWow Smart AI keeps our family budget on track effortlessly."
    },
    {
      id: 6,
      initials: "AK",
      name: "Anna Kim",
      role: "Small Business Owner",
      bgColor: "bg-expense-dark",
      accent: "#0891b2",
      rating: 5,
      text: "Essential for my business! AI extracts vendor names and amounts from bills — tax season is so much easier now."
    }
  ];

  return (
    <section id="testimonials" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Loved by <span className="ai-gradient-text">AI-smart spenders</span>
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Real users saving time and money with AI-powered expense tracking
          </p>
        </div>

        <div className="relative px-2 sm:px-0">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            navigation={true}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                <div
                  className="accent-card accent-card--testimonial p-4 sm:p-5 md:p-6 h-full"
                  style={{
                    "--accent-color": testimonial.accent,
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${testimonial.bgColor} flex items-center justify-center text-white font-bold text-base sm:text-lg mr-3 sm:mr-4 flex-shrink-0`}>
                      {testimonial.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{testimonial.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-2 sm:mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="text-center mt-8 sm:mt-10">
            <button
              onClick={() => navigate("/feedbacks")}
              className="px-6 sm:px-8 py-2.5 sm:py-3 text-expense border-2 border-indigo-300/60 bg-white/80 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              View All Submitted Feedback
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

LandingTestimonials.displayName = "LandingTestimonials";

export default LandingTestimonials;

