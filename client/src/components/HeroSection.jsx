import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Clock,
  Sparkles,
  ChevronDown,
  X,
  Check,
  Compass,
} from 'lucide-react';

/**
 * HeroSection Component (s-rent Red & White Theme Standard)
 * Specifications:
 * - Banner Container: Large rounded banner with light rose/white gradient and clean red-monotone vector illustrations (nature, gear, bicycle, landscape)
 * - Main title: "Rent instead of buying" in large, bold deep red font
 * - Subtitle: "Nearby and at times that suit you"
 * - Search Bar: Prominent wide pill-shaped search input box with search icon and filled crimson "Search" button
 * - Quick Filter Pills: "📍 Near London (change)" and "⏱ Select rental period"
 */
const HeroSection = () => {
  const navigate = useNavigate();

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Location selector state
  const [selectedLocation, setSelectedLocation] = useState('All locations');
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Rental duration selector state
  const [selectedPeriod, setSelectedPeriod] = useState('Select rental period');
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  const popularLocations = [
    'London',
    'St James’s, Westminster',
    'Camden, London',
    'Soho, Central London',
    'Kensington & Chelsea',
    'Manchester',
    'Birmingham',
    'Edinburgh',
    'Delhi NCR',
    'Mumbai',
  ];

  const rentalPeriods = [
    { label: 'Weekend special (2-3 days)', value: 'weekend' },
    { label: '1 Week (7 days)', value: '1_week' },
    { label: '2 Weeks (14 days)', value: '2_weeks' },
    { label: '1 Month+ (30 days)', value: '1_month' },
    { label: 'Single Day Rental', value: '1_day' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedLocation !== 'All locations') params.append('city', selectedLocation);
    navigate(`/items?${params.toString()}`);
  };

  const handleQuickTagClick = (tag) => {
    navigate(`/items?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Large, Elegant Rounded Banner Container without container overflow clip */}
      <div className="relative rounded-3xl bg-gradient-to-br from-rose-50/90 via-white to-red-50/60 border border-red-100 shadow-xl shadow-red-500/5 px-6 py-14 sm:px-12 sm:py-18 lg:py-22 text-center">
        {/* Clean Red-Monotone Vector SVG Illustrations in their own isolated overflow-hidden layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl" aria-hidden="true">
          {/* Subtle Red Monotone Landscape Vector on Bottom */}
          <svg
            className="absolute -bottom-2 left-0 right-0 w-full h-28 md:h-36 text-red-600/[0.04] preserve-3d"
            viewBox="0 0 1440 240"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Mountain / Hill Silhouette */}
            <path d="M0,192L60,181.3C120,171,240,149,360,154.7C480,160,600,192,720,186.7C840,181,960,139,1080,128C1200,117,1320,139,1380,149.3L1440,160L1440,240L1380,240C1320,240,1200,240,1080,240C960,240,840,240,720,240C600,240,480,240,360,240C240,240,120,240,60,240L0,240Z" />
          </svg>

          {/* Left Red-Monotone Illustration: Outdoor Tent, Trees & Nature (corner watermark) */}
          <svg
            className="absolute bottom-4 left-4 md:left-8 w-24 h-24 md:w-32 md:h-32 text-red-500/[0.07] hidden sm:block"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Pine Trees */}
            <path d="M20 70 L35 45 L25 45 L38 25 L32 25 L45 8 L58 25 L52 25 L65 45 L55 45 L70 70 Z" />
            <path d="M45 70 L45 82" strokeWidth="3" />
            {/* Small Tent */}
            <path d="M65 80 L85 55 L95 80 Z" />
            <path d="M85 55 L85 80" />
            <path d="M72 80 L80 68 L88 80" />
          </svg>

          {/* Right Red-Monotone Illustration: Bicycle & Camera Gear (corner watermark) */}
          <svg
            className="absolute bottom-4 right-4 md:right-8 w-28 h-28 md:w-36 md:h-36 text-red-500/[0.07] hidden sm:block"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Bicycle Wheels */}
            <circle cx="30" cy="85" r="20" />
            <circle cx="90" cy="85" r="20" />
            {/* Frame */}
            <path d="M30 85 L50 55 L75 55 L90 85" />
            <path d="M50 55 L65 85 L75 55" />
            {/* Handlebars & Seat */}
            <path d="M75 55 L80 45 L70 45" />
            <path d="M48 55 L45 48 L55 48" />
            {/* Floating Camera Icon */}
            <rect x="75" y="10" width="30" height="20" rx="3" />
            <circle cx="90" cy="20" r="5" />
            <path d="M82 10 L85 6 L95 6 L98 10" />
          </svg>

          {/* Subtle Ambient Red Glow Circles */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Subtle pill tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider shadow-sm mb-5 backdrop-blur-sm">
            <Sparkles size={14} className="text-red-500" />
            <span>Sustainable Peer-to-Peer Rental Network</span>
          </div>

          {/* Main Title: Bold deep red font */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-4">
            Rent instead of buying.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Find cameras, audio gear, tools, and outdoor equipment nearby, ready when you need them.
          </p>

          {/* Search Bar Component: Prominent, wide pill-shaped search input box with red Search button */}
          <form
            onSubmit={handleSearch}
            className="relative flex items-center w-full max-w-2xl mx-auto p-1.5 sm:p-2 bg-white rounded-full border-2 border-red-200/90 shadow-lg shadow-red-500/10 hover:border-red-400 focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-500/15 transition-all duration-200"
          >
            <div className="flex items-center pl-4 sm:pl-5 text-red-500 flex-shrink-0">
              <Search size={22} className="stroke-[2.5]" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cameras, audio gear, lenses, tools, laptops..."
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
            />

            <button
              type="submit"
              style={{ color: '#FFFFFF' }}
              className="flex-shrink-0 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 !text-white font-bold text-sm sm:text-base shadow-md shadow-red-600/30 hover:shadow-lg hover:shadow-red-600/40 transition-all duration-200"
            >
              Search
            </button>
          </form>

          {/* Quick Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
            {/* Pill 1: 📍 Near Location (change) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowLocationModal(!showLocationModal);
                  setShowPeriodModal(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 hover:bg-white border border-red-200 text-gray-700 font-medium shadow-sm hover:border-red-400 hover:text-red-700 transition-all"
              >
                <MapPin size={15} className="text-red-600" />
                <span>
                  {selectedLocation === 'All locations' ? (
                    <strong className="font-semibold text-gray-900">Any location</strong>
                  ) : (
                    <>Near <strong className="font-semibold text-gray-900">{selectedLocation}</strong></>
                  )}
                </span>
                <span className="text-red-600 font-semibold ml-0.5">(change)</span>
                <ChevronDown size={14} className="text-gray-400 ml-0.5" />
              </button>

              {/* Location Picker Popup */}
              {showLocationModal && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-2xl border border-red-200 p-2 text-left z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 flex justify-between items-center">
                    <span>Select City / Area</span>
                    <button
                      type="button"
                      onClick={() => setShowLocationModal(false)}
                      className="p-1 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="max-h-52 overflow-y-auto space-y-0.5">
                    {popularLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationModal(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                          selectedLocation === loc
                            ? 'bg-red-50 text-red-700 font-bold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{loc}</span>
                        {selectedLocation === loc && <Check size={14} className="text-red-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pill 2: ⏱ Select rental period */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowPeriodModal(!showPeriodModal);
                  setShowLocationModal(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 hover:bg-white border border-red-200 text-gray-700 font-medium shadow-sm hover:border-red-400 hover:text-red-700 transition-all"
              >
                <Clock size={15} className="text-red-600" />
                <span>{selectedPeriod}</span>
                <ChevronDown size={14} className="text-gray-400 ml-0.5" />
              </button>

              {/* Period Picker Popup */}
              {showPeriodModal && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-white rounded-2xl shadow-2xl border border-red-200 p-2 text-left z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 flex justify-between items-center">
                    <span>Typical Rental Durations</span>
                    <button
                      type="button"
                      onClick={() => setShowPeriodModal(false)}
                      className="p-1 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {rentalPeriods.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => {
                          setSelectedPeriod(p.label);
                          setShowPeriodModal(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                          selectedPeriod === p.label
                            ? 'bg-red-50 text-red-700 font-bold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{p.label}</span>
                        {selectedPeriod === p.label && <Check size={14} className="text-red-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Keyword tags */}
            <div className="hidden lg:flex items-center gap-1.5 pl-2">
              <span className="text-xs text-gray-400 font-semibold uppercase">Popular:</span>
              {['Sony A7', 'Aputure Light', 'RED Komodo', 'DJI Drone'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleQuickTagClick(item)}
                  className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-gray-600 hover:text-red-600 border border-gray-200 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
