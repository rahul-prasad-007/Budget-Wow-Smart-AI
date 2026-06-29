import React, { useState } from "react";
import toast from "react-hot-toast";
import { feedbackApi } from "../../api/client";
import feedbackImage from "../../assets/feedback-image.png";

const LandingFeedbackForm = React.memo(() => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    feedback: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating: rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!formData.feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    setIsSubmitting(true);

    try {
      await feedbackApi.submit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        rating: formData.rating,
        feedback: formData.feedback.trim(),
      });

      toast.success("Thank you for your feedback! Your response has been saved.");

      setFormData({
        name: "",
        email: "",
        rating: 0,
        feedback: "",
      });
      setHoveredRating(0);
    } catch (error) {
      toast.error(error.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-3 sm:mb-4 lg:mb-5">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ai-gradient-text mb-2 sm:mb-3 px-2">
            Share Your AI Experience
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl sm:max-w-3xl lg:max-w-none mx-auto px-4 lg:whitespace-nowrap">
            Help us improve BudgetWow Smart AI — tell us how receipt scanning and insights work for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="accent-card accent-card--form rounded-2xl p-4 sm:p-5 md:p-6 w-full order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="feedback-name" className="block text-base font-semibold text-gray-800 mb-1.5">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="feedback-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  autoComplete="name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-expense focus:border-transparent outline-none transition-all text-base"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="feedback-email" className="block text-base font-semibold text-gray-800 mb-1.5">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="feedback-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-expense focus:border-transparent outline-none transition-all text-base"
                  placeholder="Enter your email"
                />
              </div>

              <fieldset className="border-0 p-0 m-0">
                <legend className="block text-base font-semibold text-gray-800 mb-1.5">
                  Your Rating <span className="text-red-500">*</span>
                </legend>
                <input
                  type="hidden"
                  id="feedback-rating"
                  name="rating"
                  value={formData.rating}
                />
                <div className="flex items-center gap-2" role="radiogroup" aria-labelledby="rating-legend">
                  <span id="rating-legend" className="sr-only">Rate your experience from 1 to 5 stars</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      aria-label={`Rate ${star} ${star === 1 ? "star" : "stars"}`}
                      aria-pressed={formData.rating === star}
                      className="feedback-star-btn transition-transform duration-200 hover:scale-110"
                    >
                      <svg
                        className={`w-7 h-7 ${
                          star <= (hoveredRating || formData.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  {formData.rating > 0 && (
                    <span className="ml-2 text-sm text-gray-600" aria-live="polite">
                      {formData.rating} {formData.rating === 1 ? "star" : "stars"}
                    </span>
                  )}
                </div>
              </fieldset>

              <div>
                <label htmlFor="feedback-message" className="block text-base font-semibold text-gray-800 mb-1.5">
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback-message"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  rows="4"
                  autoComplete="off"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-expense focus:border-transparent outline-none transition-all resize-none text-base"
                  placeholder="Tell us about your experience..."
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-2.5 bg-expense text-white text-base font-semibold rounded-xl hover:bg-expense-dark transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>

              <p className="text-sm text-gray-500 text-center">
                * Required fields. Your feedback will be stored securely.
              </p>
            </form>
          </div>

          <div className="flex items-center justify-center order-1 lg:order-2 mb-4 lg:mb-0">
            <div className="feedback-image-wrap w-full max-w-md lg:max-w-lg group">
              <img
                src={feedbackImage}
                alt="Customer feedback — share your rating and experience"
                className="feedback-image-glow w-full h-auto rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

LandingFeedbackForm.displayName = "LandingFeedbackForm";

export default LandingFeedbackForm;
