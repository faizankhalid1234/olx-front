import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/auth';

export default function PostAd() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'Used',
    city: '',
    address: '',
    sellerPhone: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/login');
    }
  }, []);

  const categories = ['Mobiles', 'Cars', 'Motorcycles', 'Houses', 'TV-Video-Audio', 'Tablets', 'Land-Plots', 'Bikes', 'Furniture', 'Electronics', 'Books', 'Fashion', 'Kids', 'Animals', 'Business', 'Services', 'Jobs', 'Real Estate', 'Sports', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await api.post('/ads', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push('/my-ads');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post ad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>Post Ad - OLX Frontend</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Post Your Ad</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                required
                className="input-field"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter ad title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows="5"
                className="input-field"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  className="input-field"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="input-field"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                name="condition"
                className="input-field"
                value={formData.condition}
                onChange={handleChange}
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Used">Used</option>
                <option value="For Parts">For Parts</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  className="input-field"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="sellerPhone"
                  className="input-field"
                  value={formData.sellerPhone}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                className="input-field"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images (Max 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="input-field"
              />
              {images.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Posting...' : 'Post Ad'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
