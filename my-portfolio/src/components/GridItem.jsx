import { Link } from 'react-router-dom';

export default function GridItem({ item, size }) {
  const itemClass = size === 'large' 
    ? "md:col-span-2 md:row-span-2" 
    : "md:col-span-1 md:row-span-1";

  return (
    <div className={`${itemClass} bg-surface rounded-lg overflow-hidden group relative`}>
      <Link to={item.link} className="block w-full h-full">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/50 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div>
            <h3 className="text-xl font-bold text-text">{item.title}</h3>
            <p className="text-muted">{item.category}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
