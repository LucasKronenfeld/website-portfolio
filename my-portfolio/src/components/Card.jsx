import { useState } from "react";

const Card = ({ imageSrc, title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-background rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
      {/* Image */}
      <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />
      
      {/* Content */}
      <div className="p-4 flex-grow">
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

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative max-w-lg">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-text font-bold text-lg"
            >
              ✕
            </button>
            <img src={imageSrc} alt={title} className="max-w-full max-h-[80vh]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
