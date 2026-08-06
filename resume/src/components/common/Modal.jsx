import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative z-10 w-full rounded-2xl bg-[#16161a] border-3 border-black shadow-[8px_8px_0px_0px_#000] transition-all duration-300 flex flex-col max-h-[90svh] animate-fadeIn ${sizeClasses[size] || sizeClasses.md}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-black px-6 py-4 bg-[#1f1f26] rounded-t-2xl">
          <h3
            className="text-base font-black text-white uppercase tracking-wide"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg border-2 border-black p-1.5 text-slate-300 hover:bg-[#0ae448] hover:text-black shadow-[2px_2px_0px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 text-slate-300 text-sm">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t-3 border-black px-6 py-4 bg-[#1f1f26] rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
