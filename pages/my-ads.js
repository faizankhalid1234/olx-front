import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { getImageBaseUrl } from '@/lib/constants';
import AdCard from '@/components/AdCard';

export default function MyAds() {
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/login');
      return;
    }
    fetchMyAds();
  }, []);

  const fetchMyAds = async () => {
    try {
      const response = await api.get('/ads/user/my-ads');
      setAds(response.data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      await api.delete(`/ads/${id}`);
      setAds(ads.filter(ad => ad._id !== id));
    } catch (error) {
      alert('Failed to delete ad');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Ads</h1>
          <Link href="/post-ad" className="btn-primary">
            Post New Ad
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't posted any ads yet.</p>
            <Link href="/post-ad" className="btn-primary inline-block">
              Post Your First Ad
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ads.map((ad) => (
              <div key={ad._id} className="card relative">
                <Link href={`/ads/${ad._id}`}>
                  <div className="relative h-48 w-full bg-gray-200">
                    {ad.images && ad.images.length > 0 ? (
                      <img
                        src={`${getImageBaseUrl()}${ad.images[0]}`}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    {ad.status === 'sold' && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                        Sold
                      </div>
                    )}
                    {ad.status === 'deleted' && (
                      <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs">
                        Deleted
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {ad.title}
                    </h3>
                    <p className="text-xl font-bold text-primary mb-2">
                      Rs {ad.price?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      {ad.location?.city}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                <div className="p-4 pt-0 flex space-x-2">
                  <Link
                    href={`/ads/${ad._id}`}
                    className="flex-1 text-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                  >
                    View
                  </Link>
                  {ad.status === 'active' && (
                    <button
                      onClick={() => handleDelete(ad._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
