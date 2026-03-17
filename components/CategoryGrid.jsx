import { OLX_CATEGORIES } from '@/lib/constants';

export default function CategoryGrid({ onCategoryClick, selectedCategory = '', compact = false }) {
  const categories = compact ? OLX_CATEGORIES.slice(0, 12) : OLX_CATEGORIES;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">All Categories</h2>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
          <button
            key={cat.id}
            type="button"
            onClick={(e) => onCategoryClick?.(e, cat.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors group text-left cursor-pointer ${
              isSelected ? 'bg-secondary/20 ring-2 ring-primary' : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center text-2xl bg-gray-100 rounded-full group-hover:bg-secondary/20 mb-2">
              {cat.icon}
            </div>
            <span className={`text-xs text-center font-medium leading-tight ${
              isSelected ? 'text-primary' : 'text-gray-700 group-hover:text-primary'
            }`}>
              {cat.name}
            </span>
          </button>
        );})}
      </div>
    </div>
  );
}
