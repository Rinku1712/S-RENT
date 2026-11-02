import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllItems, searchItems } from '../services/itemService';
import { getCategories } from '../services/categoryService';
import ItemCard from '../components/ItemCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Package,
  MapPin,
  Tag,
  ArrowUpDown,
  X,
} from 'lucide-react';

/**
 * Explore Items / Product Listing Page
 * URL: /items (and /browse)
 * Features:
 * - Commercial rental marketplace layout with left sidebar filters and product grid
 * - Keyword search, Category filter, Brand, City, State, Condition, Price range
 * - Instant sorting (Recently Added, Price: Low to High, Price: High to Low)
 * - Mobile responsive filter drawer
 * - Zero emojis, 100% Lucide React icons
 */
const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alternativeNotice, setAlternativeNotice] = useState(null);

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sorting state: 'recent' | 'price_asc' | 'price_desc'
  const [sortBy, setSortBy] = useState('recent');

  // Filter form states initialized from URL parameters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [stateName, setStateName] = useState(searchParams.get('state') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Load available categories from backend
  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data) setCategories(res.data);
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Fetch items whenever URL search parameters change
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        setAlternativeNotice(null);

        const params = {
          search: searchParams.get('search') || '',
          category: searchParams.get('category') || '',
          brand: searchParams.get('brand') || '',
          city: searchParams.get('city') || '',
          state: searchParams.get('state') || '',
          condition: searchParams.get('condition') || '',
          minPrice: searchParams.get('minPrice') || undefined,
          maxPrice: searchParams.get('maxPrice') || undefined,
        };

        const hasFilter = Object.values(params).some(
          (val) => val !== '' && val !== undefined
        );

        if (!hasFilter) {
          // No filters applied -> fetch all available items
          const allItems = await getAllItems();
          setItems(allItems);
        } else {
          // Backend filter search
          const result = await searchItems(params);
          if (result.success && result.items) {
            setItems(result.items);
            if (result.alternativeItemsAvailable) {
              setAlternativeNotice(result.message);
            }
          } else {
            setItems([]);
          }
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchParams]);

  // Handle Filter Submission
  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = new URLSearchParams();

    if (searchQuery.trim()) newParams.append('search', searchQuery.trim());
    if (selectedCategory) newParams.append('category', selectedCategory);
    if (brand.trim()) newParams.append('brand', brand.trim());
    if (city.trim()) newParams.append('city', city.trim());
    if (stateName.trim()) newParams.append('state', stateName.trim());
    if (condition) newParams.append('condition', condition);
    if (minPrice) newParams.append('minPrice', minPrice);
    if (maxPrice) newParams.append('maxPrice', maxPrice);

    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setBrand('');
    setCity('');
    setStateName('');
    setCondition('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams(new URLSearchParams());
    setMobileFilterOpen(false);
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedCategory ||
    brand ||
    city ||
    stateName ||
    condition ||
    minPrice ||
    maxPrice
  );

  // Client-side sorting on items
  const sortedItems = useMemo(() => {
    const list = [...items];
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
    }
    if (sortBy === 'price_desc') {
      return list.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
    }
    // Default: 'recent'
    return list.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [items, sortBy]);

  return (
    <div className="browse-page container">
      {/* Top Header Bar */}
      <div className="browse-header-row">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
            Explore Items for Rent
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Showing {sortedItems.length} {sortedItems.length === 1 ? 'product' : 'products'} ready for instant rental
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="btn btn-secondary btn-sm mobile-filter-btn"
            style={{ display: 'none' }}
          >
            <Filter size={15} />
            <span>Filters</span>
          </button>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowUpDown size={15} className="text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
            >
              <option value="recent">Sort: Recently Added</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button onClick={resetFilters} className="btn btn-outline btn-sm">
              <RotateCcw size={13} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      <div className="browse-layout">
        {/* Left Side: Filter Sidebar */}
        <aside className={`filter-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="filter-header">
            <h3>
              <SlidersHorizontal size={17} className="text-red" />
              <span>Refine Search</span>
            </h3>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="filter-reset-btn">
                Reset
              </button>
            )}
          </div>

          <form onSubmit={applyFilters}>
            {/* 1. Keyword Search */}
            <div className="filter-group">
              <label className="filter-label">Search Keyword</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Laptop, Camera, Car..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                />
                <Search
                  size={15}
                  className="text-muted"
                  style={{ position: 'absolute', left: 10, top: 12 }}
                />
              </div>
            </div>

            {/* 2. Category Select */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Brand Filter */}
            <div className="filter-group">
              <label className="filter-label">Brand</label>
              <input
                type="text"
                placeholder="e.g. Sony, HP, Canon..."
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="form-input"
              />
            </div>

            {/* 4. City Filter */}
            <div className="filter-group">
              <label className="filter-label">City</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Karnal, Sonipat..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                />
                <MapPin
                  size={15}
                  className="text-muted"
                  style={{ position: 'absolute', left: 10, top: 12 }}
                />
              </div>
            </div>

            {/* 5. State Filter */}
            <div className="filter-group">
              <label className="filter-label">State</label>
              <input
                type="text"
                placeholder="e.g. Haryana, Delhi..."
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="form-input"
              />
            </div>

            {/* 6. Condition Filter */}
            <div className="filter-group">
              <label className="filter-label">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="form-select"
              >
                <option value="">Any Condition</option>
                <option value="new">Brand New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good Condition</option>
                <option value="fair">Fair Condition</option>
              </select>
            </div>

            {/* 7. Price Range Filter */}
            <div className="filter-group">
              <label className="filter-label">Daily Price (₹)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="form-input"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-input"
                  min="0"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
            >
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Right Side: Product Listing Grid */}
        <main className="browse-content">
          {alternativeNotice && (
            <div className="alert alert-warning" style={{ marginBottom: 20 }}>
              <span>{alternativeNotice}</span>
            </div>
          )}

          {loading ? (
            <div className="spinner"></div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : sortedItems.length > 0 ? (
            <div className="grid-cards">
              {sortedItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="card empty-state-box">
              <div className="empty-icon-circle">
                <Package size={30} />
              </div>
              <h3>No matching gear found</h3>
              <p>
                We could not find items matching your current filters. Try relaxing your search terms or expanding your city.
              </p>
              <button onClick={resetFilters} className="btn btn-primary">
                View All Available Items
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Browse;
