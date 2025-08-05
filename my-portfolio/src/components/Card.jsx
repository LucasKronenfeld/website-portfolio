import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from '@heroicons/react/24/outline';

const Card = ({ imageSrc, title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-surface rounded-2xl shadow-lg overflow-hidden flex flex-col h-full border border-white/10">
        <div className="w-full h-48 overflow-hidden">
          <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="text-xl font-semibold text-text">{title}</h3>
          <p className="text-muted mt-2">{description}</p>
        </div>
        <div className="p-4 pt-0">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-80 transition-all"
          >
            View
          </button>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-[1000] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                className="bg-surface p-4 rounded-lg shadow-2xl relative max-w-3xl w-full border border-white/10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-muted hover:text-text transition-colors z-10 p-1 bg-surface/50 rounded-full"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="overflow-hidden rounded-lg mt-8">
                  <img src={imageSrc} alt={title} className="w-full h-auto max-h-[80vh] object-contain" />
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
