import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import AdCard from '@/components/AdCard';
import CategoryGrid from '@/components/CategoryGrid';

export default function Home() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    minPrice: '',
    maxPrice: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  // Sync category from URL query
  useEffect(() => {
    if (router.query.category) {
      setFilters((f) => ({ ...f, category: router.query.category }));
    }
  }, [router.query.category]);

  useEffect(() => {
    fetchAds();
  }, [page, filters]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const params = { page, ...filters };
      const response = await api.get('/ads', { params });
      setAds(response.data.ads);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    setPage(1);
    fetchAds();
  };

  const handleCategoryClick = (e, categoryId) => {
    e?.preventDefault?.();
    setFilters((f) => ({ ...f, category: categoryId }));
    setPage(1);
    router.push(`/?category=${encodeURIComponent(categoryId)}`, undefined, { shallow: true });
  };

  return (
    <div className="min-h-screen bg-[#f2f4f5]">
      {/* Hero Search - OLX Style */}
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Buy and Sell for free
          </h1>
          <p className="text-secondary/90 mb-6">
            Pakistan&apos;s largest marketplace
          </p>

          <form onSubmit={handleSearch} className="max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="text"
                name="search"
                placeholder="Find Mobiles, Cars, Bikes and more..."
                value={filters.search}
                onChange={handleFilterChange}
                className="flex-1 px-4 py-3 rounded-t-md sm:rounded-l-md sm:rounded-tr-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <div className="flex flex-wrap gap-2 sm:gap-0 sm:flex-nowrap">
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="flex-1 sm:flex-none px-4 py-3 sm:rounded-none text-gray-800 bg-white min-w-0 sm:min-w-[120px] focus:outline-none border-t sm:border-t-0 sm:border-l border-gray-200"
                >
                  <option value="">All Categories</option>
                  <option value="Mobiles">Mobiles</option>
                  <option value="Cars">Cars</option>
                  <option value="Motorcycles">Motorcycles</option>
                  <option value="Houses">Houses</option>
                  <option value="TV-Video-Audio">TV & Audio</option>
                  <option value="Tablets">Tablets</option>
                  <option value="Land-Plots">Land & Plots</option>
                  <option value="Bikes">Bikes</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Books">Books</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Kids">Kids</option>
                  <option value="Animals">Animals</option>
                  <option value="Business">Business</option>
                  <option value="Services">Services</option>
                  <option value="Jobs">Jobs</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="flex-1 sm:flex-none px-4 py-3 sm:rounded-none text-gray-800 min-w-0 sm:w-28 focus:outline-none border-t sm:border-t-0 sm:border-l border-gray-200"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-secondary text-primary font-semibold rounded-b-md sm:rounded-r-md sm:rounded-l-none hover:bg-secondary/90 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Categories Grid - OLX Style */}
        <div className="mb-8">
          <CategoryGrid 
            onCategoryClick={handleCategoryClick} 
            selectedCategory={filters.category}
          />
        </div>

        {/* Price Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm text-gray-600">Price:</span>
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded w-28 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded w-28 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="text-sm text-gray-500">Rs</span>
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading ads...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-600 text-lg">No ads found.</p>
            <p className="text-gray-500">Try changing your search or be the first to post!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {filters.category ? `${filters.category} - ` : ''}Fresh recommendations
                </h2>
                {filters.category && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilters((f) => ({ ...f, category: '' }));
                      setPage(1);
                      router.push('/', undefined, { shallow: true });
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear category
                  </button>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {ads.length} ads
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {ads.map((ad) => (
                <AdCard key={ad._id} ad={ad} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 flex items-center">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
