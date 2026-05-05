import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { getImageBaseUrl } from '@/lib/constants';
import Link from 'next/link';

export default function AdDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAds, setUserAds] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAd();
    }
  }, [id]);

  const fetchAd = async () => {
    try {
      const response = await api.get(`/ads/${id}`);
      setAd(response.data);
      
      // Check if user is owner
      const token = getAuthToken();
      if (token) {
        const userResponse = await api.get('/auth/me');
        setIsOwner(userResponse.data._id === response.data.seller._id);
      }

      // Fetch seller's other ads
      if (response.data.seller._id) {
        const sellerAdsResponse = await api.get(`/users/${response.data.seller._id}/ads`);
        setUserAds(sellerAdsResponse.data.filter(a => a._id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      await api.delete(`/ads/${id}`);
      router.push('/my-ads');
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

  if (!ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Head>
          <title>Ad Not Found - OLX Frontend</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="text-center">
          <p className="text-gray-600 text-lg">Ad not found</p>
          <Link href="/" className="text-primary mt-4 inline-block">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>{`${ad.title} - OLX Frontend`}</title>
        <meta
          name="description"
          content={ad.description?.slice(0, 160) || 'View ad details on OLX Frontend.'}
        />
        <meta property="og:title" content={`${ad.title} - OLX Frontend`} />
        <meta
          property="og:description"
          content={ad.description?.slice(0, 160) || 'View ad details on OLX Frontend.'}
        />
        <meta
          property="og:image"
          content={
            ad.images?.[0] ? `${getImageBaseUrl()}${ad.images[0]}` : 'http://localhost:3000/icons/icon-512.svg'
          }
        />
        <link rel="canonical" href={`http://localhost:3000/ads/${ad._id}`} />
      </Head>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{ad.title}</h1>
              
              {/* Images */}
              {ad.images && ad.images.length > 0 ? (
                <div className="mb-6">
                  <div className="relative h-96 w-full bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <img
                      src={`${getImageBaseUrl()}${ad.images[0]}`}
                      alt={ad.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {ad.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {ad.images.slice(1).map((image, index) => (
                        <img
                          key={index}
                          src={`${getImageBaseUrl()}${image}`}
                          alt={`${ad.title} ${index + 2}`}
                          className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                  <p className="text-gray-400">No images</p>
                </div>
              )}

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{ad.description}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 font-medium">{ad.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Condition:</span>
                  <span className="ml-2 font-medium">{ad.condition}</span>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2 font-medium">{ad.location?.city}</span>
                </div>
                <div>
                  <span className="text-gray-500">Views:</span>
                  <span className="ml-2 font-medium">{ad.views}</span>
                </div>
              </div>

              {isOwner && (
                <div className="mt-6 flex space-x-4">
                  <Link
                    href={`/edit-ad/${ad._id}`}
                    className="btn-secondary"
                  >
                    Edit Ad
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete Ad
                  </button>
                </div>
              )}
            </div>

            {/* Seller's Other Ads */}
            {userAds.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">More from this seller</h2>
                <div className="grid grid-cols-2 gap-4">
                  {userAds.map((sellerAd) => (
                    <Link key={sellerAd._id} href={`/ads/${sellerAd._id}`}>
                      <div className="card cursor-pointer">
                        {sellerAd.images && sellerAd.images.length > 0 && (
                          <img
                            src={`${getImageBaseUrl()}${sellerAd.images[0]}`}
                            alt={sellerAd.title}
                            className="w-full h-32 object-cover"
                          />
                        )}
                        <div className="p-3">
                          <h3 className="font-semibold text-sm line-clamp-2">{sellerAd.title}</h3>
                          <p className="text-primary font-bold">₹{sellerAd.price?.toLocaleString()}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary mb-2">
                  Rs {ad.price?.toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm">Posted {new Date(ad.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Seller Information</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Name:</span> {ad.sellerName || ad.seller?.name}
                </p>
                {ad.sellerPhone && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Phone:</span> {ad.sellerPhone}
                  </p>
                )}
                {ad.seller?.city && (
                  <p className="text-gray-700">
                    <span className="font-medium">City:</span> {ad.seller.city}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <a
                  href={`tel:${ad.sellerPhone || ad.seller?.phone}`}
                  className="btn-primary w-full text-center block"
                >
                  Call Seller
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
