// API base URL for images (backend serves /uploads)
export const getImageBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://olx-back.vercel.app/api';
  return apiUrl.replace(/\/api\/?$/, '') || 'https://olx-back.vercel.app';
};

// OLX Pakistan style categories with icons
export const OLX_CATEGORIES = [
  { id: 'Mobiles', name: 'Mobile Phones', icon: '📱', slug: 'Mobiles' },
  { id: 'Cars', name: 'Cars', icon: '🚗', slug: 'Cars' },
  { id: 'Motorcycles', name: 'Motorcycles', icon: '🏍️', slug: 'Motorcycles' },
  { id: 'Houses', name: 'Houses', icon: '🏠', slug: 'Houses' },
  { id: 'TV-Video-Audio', name: 'TV, Video & Audio', icon: '📺', slug: 'TV-Video-Audio' },
  { id: 'Tablets', name: 'Tablets', icon: '📱', slug: 'Tablets' },
  { id: 'Land-Plots', name: 'Land & Plots', icon: '📄', slug: 'Land-Plots' },
  { id: 'Bikes', name: 'Bikes', icon: '🚴', slug: 'Bikes' },
  { id: 'Furniture', name: 'Furniture & Home', icon: '🛋️', slug: 'Furniture' },
  { id: 'Electronics', name: 'Electronics', icon: '💻', slug: 'Electronics' },
  { id: 'Books', name: 'Books & Hobbies', icon: '📚', slug: 'Books' },
  { id: 'Fashion', name: 'Fashion & Beauty', icon: '👗', slug: 'Fashion' },
  { id: 'Kids', name: 'Kids', icon: '👶', slug: 'Kids' },
  { id: 'Animals', name: 'Animals', icon: '🐾', slug: 'Animals' },
  { id: 'Business', name: 'Business & Industrial', icon: '💼', slug: 'Business' },
  { id: 'Services', name: 'Services', icon: '🔧', slug: 'Services' },
  { id: 'Jobs', name: 'Jobs', icon: '💼', slug: 'Jobs' },
  { id: 'Real Estate', name: 'Real Estate', icon: '🏢', slug: 'Real Estate' },
  { id: 'Sports', name: 'Sports', icon: '⚽', slug: 'Sports' },
  { id: 'Other', name: 'Other', icon: '📦', slug: 'Other' },
];

// Category IDs for backend (match Ad model enum)
export const CATEGORY_IDS = OLX_CATEGORIES.map((c) => c.id);
