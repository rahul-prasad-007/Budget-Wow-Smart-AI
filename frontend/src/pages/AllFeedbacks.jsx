import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { feedbackApi } from "../api/client";
import AnimatedBackground from "../components/ui/AnimatedBackground";

const COMMUNITY_ACCENTS = ["#e11d48", "#2563eb", "#16a34a", "#9333ea", "#ea580c", "#0891b2"];

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const formatDate = (timestamp, createdAt) => {
  const date = new Date(timestamp || createdAt);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const AllFeedbacks = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    feedbackApi
      .getAll()
      .then((data) => setFeedbacks(data.feedbacks || []))
      .catch((err) => setError(err.message || "Failed to load feedback."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground variant="landing" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-expense hover:text-expense-dark font-semibold mb-6 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Community <span className="ai-gradient-text">Feedback</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences shared by BudgetWow Smart AI users
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-expense" />
          </div>
        )}

        {!loading && error && (
          <div className="accent-card accent-card--panel p-8 text-center max-w-lg mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-expense text-white font-semibold rounded-xl hover:bg-expense-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && feedbacks.length === 0 && (
          <div className="accent-card accent-card--panel p-10 text-center max-w-lg mx-auto">
            <p className="text-gray-600 mb-4">No feedback submitted yet. Be the first to share your experience!</p>
            <button
              onClick={() => navigate("/#feedback")}
              className="px-6 py-2.5 ai-shimmer-btn text-white font-semibold rounded-xl"
            >
              Submit Feedback
            </button>
          </div>
        )}

        {!loading && !error && feedbacks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {feedbacks.map((item, index) => {
              const accent = COMMUNITY_ACCENTS[index % COMMUNITY_ACCENTS.length];
              return (
              <article
                key={item._id}
                className="accent-card accent-card--community p-5 sm:p-6 h-full flex flex-col"
                style={{
                  "--accent-color": accent,
                  animationDelay: `${index * 0.07}s`,
                }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 flex-shrink-0"
                    style={{ backgroundColor: accent }}
                  >
                    {getInitials(item.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-gray-900 text-base truncate">{item.name}</h2>
                    <p className="text-sm text-gray-500">{formatDate(item.timestamp, item.createdAt)}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-5 h-5 ${i < item.rating ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-1">
                  &ldquo;{item.feedback}&rdquo;
                </p>
              </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFeedbacks;
