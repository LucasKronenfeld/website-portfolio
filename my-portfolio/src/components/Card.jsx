import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const Card = ({ imageSrc, title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-surface rounded-2xl shadow-lg overflow-hidden flex flex-col h-full border border-white/10">
        {/* Image */}
        <div className="w-full h-48 overflow-hidden">
          <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="p-4 flex-grow">
          <h3 className="text-xl font-semibold text-text">{title}</h3>
          <p className="text-muted mt-2">{description}</p>
        </div>

        {/* Button */}
        <div className="p-4 pt-0">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-80 transition-all"
          >
            View
          </button>
        </div>
      </div>

      {/* Modal Portal */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-[1000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-surface p-4 rounded-lg shadow-2xl relative max-w-3xl w-full border border-white/10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-muted hover:text-text transition-colors z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Modal Image */}
                <div className="overflow-hidden rounded-lg">
                  <img src={imageSrc} alt={title} className="w-full h-auto max-h-[85vh] object-contain" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Card;
