import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useLandingNavigation } from "../../hooks/useLandingNavigation";

const socialLinks = [
  { href: "https://facebook.com", icon: FaFacebook, label: "Facebook", bg: "#dbeafe", color: "#2563eb", hover: "#2563eb" },
  { href: "https://twitter.com", icon: FaTwitter, label: "Twitter", bg: "#e0f2fe", color: "#0284c7", hover: "#0ea5e9" },
  { href: "https://instagram.com", icon: FaInstagram, label: "Instagram", bg: "#fce7f3", color: "#db2777", hover: "#ec4899" },
  { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn", bg: "#dbeafe", color: "#1d4ed8", hover: "#2563eb" },
  { href: "https://github.com", icon: FaGithub, label: "GitHub", bg: "#f3f4f6", color: "#374151", hover: "#6366f1" },
];

const quickLinks = [
  { href: "#", label: "Home", hoverClass: "footer-link--home" },
  { href: "#features", label: "Features", hoverClass: "footer-link--features" },
  { href: "#testimonials", label: "Testimonials", hoverClass: "footer-link--testimonials" },
  { href: "#feedback", label: "Feedback", hoverClass: "footer-link--feedback" },
];

const contactItems = [
  {
    id: "email",
    icon: FaEnvelope,
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
    content: (
      <a href="mailto:support@budgetwowsmartai.com" className="footer-link footer-link--contact hover:text-violet-600">
        support@budgetwowsmartai.com
      </a>
    ),
  },
  {
    id: "phone",
    icon: FaPhone,
    iconBg: "#d1fae5",
    iconColor: "#059669",
    content: (
      <a href="tel:+1234567890" className="footer-link footer-link--contact hover:text-emerald-600">
        +1 (234) 567-890
      </a>
    ),
  },
  {
    id: "address",
    icon: FaMapMarkerAlt,
    iconBg: "#ffedd5",
    iconColor: "#ea580c",
    content: (
      <span className="footer-text">
        123 Finance Street
        <br />
        Budget City, BC 12345
      </span>
    ),
  },
];

const LandingFooter = React.memo(() => {
  const { isLoggedIn, goToApp } = useLandingNavigation();

  return (
    <footer className="landing-footer text-gray-800">
      <div className="landing-footer-blob landing-footer-blob-1" aria-hidden="true" />
      <div className="landing-footer-blob landing-footer-blob-2" aria-hidden="true" />
      <div className="landing-footer-blob landing-footer-blob-3" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="footer-grid mb-8 sm:mb-10">
          <div className="footer-col" style={{ animationDelay: "0s" }}>
            <h4 className="footer-col-title footer-col-title--brand">BudgetWow Smart AI</h4>
            <p className="footer-text mb-5">
              AI-powered expense tracking with receipt scanning, smart categories, and Groq-powered insights.
              Take control of your finances the intelligent way.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ href, icon: Icon, label, bg, color, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  style={{ backgroundColor: bg, color }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = bg;
                  }}
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col" style={{ animationDelay: "0.1s" }}>
            <h4 className="footer-col-title footer-col-title--links">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ href, label, hoverClass }) => (
                <li key={label}>
                  <a href={href} className={`footer-link ${hoverClass}`}>
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={goToApp}
                  className="footer-link footer-link--started"
                >
                  {isLoggedIn ? "Open Dashboard" : "Get Started"}
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col" style={{ animationDelay: "0.2s" }}>
            <h4 className="footer-col-title footer-col-title--contact">Contact Us</h4>
            <ul className="space-y-4">
              {contactItems.map(({ id, icon: Icon, iconBg, iconColor, content }) => (
                <li key={id} className="footer-contact-row flex items-start gap-3">
                  <span
                    className="footer-contact-icon"
                    style={{ backgroundColor: iconBg, color: iconColor }}
                  >
                    <Icon />
                  </span>
                  <div className="footer-contact-content">{content}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col" style={{ animationDelay: "0.3s" }}>
            <h4 className="footer-col-title footer-col-title--newsletter">Newsletter</h4>
            <p className="footer-text mb-4">
              Get AI finance tips, feature updates, and smart budgeting insights in your inbox.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="footer-newsletter-input w-full px-4 py-3 rounded-xl bg-white/90 border-2 border-violet-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 ai-shimmer-btn text-white font-semibold rounded-xl text-base hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom-bar pt-8 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-base sm:text-lg">
              &copy; {new Date().getFullYear()} BudgetWow Smart AI. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
              <a href="#" className="footer-policy-link text-gray-600 hover:text-indigo-600">
                Privacy Policy
              </a>
              <a href="#" className="footer-policy-link text-gray-600 hover:text-pink-600">
                Terms of Service
              </a>
              <a href="#" className="footer-policy-link text-gray-600 hover:text-sky-600">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

LandingFooter.displayName = "LandingFooter";

export default LandingFooter;
