import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const Card = ({ imageSrc, title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-background rounded-2xl shadow-lg overflow-visible flex flex-col h-full">
        {/* Image */}
        <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />

        {/* Content */}
        <div className="p-4 flex-grow overflow-visible">
          <h3 className="text-xl font-semibold text-text">{title}</h3>
          <p className="text-contrast mt-2">{description}</p>

          {/* Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-contrast transition"
          >
            View
          </button>
        </div>
      </div>

      {/* Modal with Animation */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-[1000] pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white p-4 rounded-lg shadow-lg relative max-w-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 text-text font-bold text-lg"
                >
                  ✕
                </button>

                {/* Modal Image */}
                <img src={imageSrc} alt={title} className="max-w-full max-h-[80vh]" />
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
