import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Full-screen modal rendered via portal to document.body.
 * Avoids layout overlap from parent transforms (e.g. hover-lift on glass-card).
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  maxWidth = "max-w-md",
  ariaLabelledBy,
  panelClassName = "",
  accentColor,
  bodyClassName = "p-5 sm:p-6",
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const titleId = ariaLabelledBy || "app-modal-title";

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 220);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`app-modal-backdrop fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/55 backdrop-blur-sm ${
        isClosing ? "app-modal-backdrop--exit" : "app-modal-backdrop--enter"
      }`}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className={`app-modal-panel w-full ${maxWidth} max-h-[min(90vh,720px)] overflow-y-auto rounded-2xl border-2 border-indigo-200/80 bg-white shadow-2xl shadow-indigo-900/10 ${
          isClosing ? "app-modal-panel--exit" : "app-modal-panel--enter"
        } ${panelClassName}`}
        style={accentColor ? { "--accent-color": accentColor } : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`sticky top-0 z-10 flex items-start justify-between gap-3 px-5 py-4 border-b border-indigo-100 bg-white/95 backdrop-blur-md rounded-t-2xl ${accentColor ? "app-modal-header" : ""}`}>
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className={accentColor ? "budget-modal-icon-wrap shrink-0" : "p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 shrink-0"}>
                <Icon className={`w-5 h-5 ${accentColor ? "" : "text-expense"}`} />
              </div>
            )}
            <div className="min-w-0">
              <h2 id={titleId} className={`text-lg sm:text-xl font-bold ${accentColor ? "text-slate-900" : "text-expense-dark"}`}>
                {title}
              </h2>
              {subtitle && (
                <p className={`text-xs sm:text-sm mt-0.5 ${accentColor ? "text-slate-500 font-medium" : "text-gray-500"}`}>{subtitle}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className={`app-modal-close p-2 rounded-xl text-gray-500 border border-transparent transition-all duration-200 shrink-0 ${
              accentColor
                ? "budget-modal-close hover:text-indigo-700 hover:bg-indigo-50 hover:border-indigo-200"
                : "hover:text-gray-800 hover:bg-indigo-50 hover:border-indigo-200"
            }`}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        <div className={bodyClassName}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
