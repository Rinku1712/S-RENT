import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Flame,
  Video,
  Headphones,
  Compass,
  Aperture,
  Plane,
  SunMedium,
  Tent,
  Wrench,
  Bike,
  Projector,
  ChevronRight,
  Layers,
  Cpu,
} from 'lucide-react';

/**
 * Category Explorer Component (s-rent Red & White Theme Standard)
 * Specifications:
 * - Title: "Or browse our most popular categories..." in deep red / slate
 * - Layout: Clean pill-button grid of popular rental categories
 * - Styling: Crisp red borders, white background, and red text that highlights on hover
 */
const CategoryExplorer = ({ onCategorySelect, activeCategory = '', categories: liveCategories }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(activeCategory);

  const sanitizeCategoryName = (name) => {
    if (!name) return '';
    if (/electroinces/i.test(name)) return 'Electronics';
    return name;
  };

  const defaultCategories = [
    { name: 'Electronics', icon: Cpu },
    { name: 'Cameras & Optics', icon: Camera },
    { name: 'Studio & Lighting', icon: SunMedium },
    { name: 'Audio & Sound Gear', icon: Headphones },
    { name: 'Drones & Aerial', icon: Plane },
    { name: 'Digital Cinema Rigs', icon: Video },
    { name: 'Power Tools & Equip', icon: Wrench },
    { name: 'Camping & Outdoors', icon: Tent },
    { name: 'Bicycles & Mobility', icon: Bike },
    { name: 'Projectors & Screens', icon: Projector },
    { name: 'Travel & Luggage', icon: Compass },
    { name: 'Home Appliances', icon: Flame },
  ];

  // Map categories safely without index-based overwrite
  const categories = defaultCategories.map((cat) => {
    const liveMatch = liveCategories?.find(
      (lc) => sanitizeCategoryName(lc.name).toLowerCase() === cat.name.toLowerCase()
    );
    return {
      ...cat,
      name: sanitizeCategoryName(liveMatch?.name || cat.name),
    };
  });

  const handleSelect = (categoryName) => {
    const next = selected === categoryName ? '' : categoryName;
    setSelected(next);

    if (onCategorySelect) {
      onCategorySelect(next);
    } else {
      if (next) {
        navigate(`/items?category=${encodeURIComponent(next)}`);
      } else {
        navigate('/items');
      }
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header: "Or browse our most popular categories..." */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-700 tracking-tight flex items-center gap-2">
            <Layers size={22} className="text-red-600 stroke-[2.2]" />
            <span>Or browse our most popular categories...</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Verified equipment curated by creative pros, adventurers, and local makers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/items')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:underline self-start sm:self-auto"
        >
          <span>View all categories</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Clean Pill-Button Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selected === cat.name;

          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => handleSelect(cat.name)}
              className={`group relative flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-500/25 scale-[1.02]'
                  : 'bg-white border-red-100/90 text-red-600 hover:bg-red-50/70 hover:border-red-300 hover:shadow-sm active:scale-95'
              }`}
            >
              {/* Category Icon Badge */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-red-50 text-red-600 group-hover:bg-red-100/80 group-hover:text-red-700'
                }`}
              >
                <Icon size={18} className="stroke-[2.2]" />
              </div>

              {/* Category Labels */}
              <div className="min-w-0 flex-1">
                <span
                  className={`block text-xs sm:text-sm font-bold truncate leading-snug ${
                    isActive ? 'text-white' : 'text-gray-900 group-hover:text-red-600'
                  }`}
                >
                  {cat.name}
                </span>
                <span
                  className={`block text-[11px] truncate mt-0.5 ${
                    isActive ? 'text-red-100' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                >
                  Browse items
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryExplorer;
