import Link from 'next/link';
import { getImageBaseUrl } from '@/lib/constants';

export default function AdCard({ ad }) {
  const imageBaseUrl = getImageBaseUrl();
  const imageUrl = ad.images?.length > 0 ? `${imageBaseUrl}${ad.images[0]}` : null;

  return (
    <Link href={`/ads/${ad._id}`}>
      <div className="card cursor-pointer group h-full flex flex-col">
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div
            className={`w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100 ${
              imageUrl ? 'hidden' : ''
            }`}
          >
            <span className="text-4xl mb-2">📷</span>
            <span className="text-sm">No Image</span>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {ad.title}
          </h3>
          <p className="text-lg font-bold text-primary mb-1">
            Rs {ad.price?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-auto">
            {ad.location?.city} • {new Date(ad.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
