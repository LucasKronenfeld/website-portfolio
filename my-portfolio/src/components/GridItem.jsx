import { Link } from 'react-router-dom';
import { isExternalUrl, normalizeExternalUrl } from '../utils/normalizeExternalUrl';

export default function GridItem({ item, size }) {
  const itemClass = size === 'large' 
    ? "sm:col-span-2 sm:row-span-2" 
    : "sm:col-span-1 sm:row-span-1";
  const external = isExternalUrl(item.link);
  const safeLink = normalizeExternalUrl(item.link);

  return (
    <div className={`${itemClass} bg-surface rounded-lg overflow-hidden group relative shadow-lg hover:shadow-xl transition-shadow`}>
      {external ? (
        <a href={safeLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4 sm:p-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full">
              <h3 className="text-lg sm:text-xl font-bold text-text mb-1">{item.title}</h3>
              <p className="text-sm sm:text-base text-muted">{item.category}</p>
            </div>
          </div>
        </a>
      ) : (
        <Link to={item.link} className="block w-full h-full">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4 sm:p-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full">
              <h3 className="text-lg sm:text-xl font-bold text-text mb-1">{item.title}</h3>
              <p className="text-sm sm:text-base text-muted">{item.category}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
