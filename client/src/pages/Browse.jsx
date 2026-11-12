import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getAllItems, searchItems } from '../services/itemService';
import { getCategories } from '../services/categoryService';
import ItemCard from '../components/ItemCard';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Package,
  MapPin,
  ArrowUpDown,
  X,
  LayoutGrid,
  List,
  Layers,
} from 'lucide-react';

/**
 * Explore / Browse Items Page (OLX Discovery Standard)
 * Features:
 * - Commercial marketplace layout: Left sticky filter sidebar + Right item grid
 * - Keyword search, Category filters with counts, Brand, City, Condition, Price range
 * - Quick price presets (Under ₹500, ₹500-₹1500, etc.)
 * - Instant sorting (Newest, Price: Low to High, Price: High to Low)
 * - Removable active filter chips
 * - Skeleton loaders for seamless UX
 * - Mobile responsive filter drawer
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

  // Sorting: 'recent' | 'price_asc' | 'price_desc'
  const [sortBy, setSortBy] = useState('recent');

  // Display mode: 'grid' | 'list'
  const [viewMode, setViewMode] = useState('grid');

  // Filter form states initialized from URL parameters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [stateName, setStateName] = useState(searchParams.get('state') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Keep local filter state synced if URL params change externally
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setBrand(searchParams.get('brand') || '');
    setCity(searchParams.get('city') || '');
    setStateName(searchParams.get('state') || '');
    setCondition(searchParams.get('condition') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  // Load available categories
  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data) setCategories(res.data);
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Fetch items based on URL search parameters
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
          const allItems = await getAllItems();
          setItems(allItems);
        } else {
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
        setError('Failed to load items. Please verify your connection.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchParams]);

  // Close mobile filter on filter change
  useEffect(() => {
    setMobileFilterOpen(false);
  }, [searchParams]);

  // Apply filters by pushing parameters into URL
  const applyFilters = (overrides = {}) => {
    const current = {
      search: searchQuery.trim(),
      category: selectedCategory,
      brand: brand.trim(),
      city: city.trim(),
      state: stateName.trim(),
      condition,
      minPrice,
      maxPrice,
      ...overrides,
    };

    const newParams = new URLSearchParams();
    Object.keys(current).forEach((key) => {
      if (current[key] !== '' && current[key] !== undefined && current[key] !== null) {
        newParams.set(key, current[key]);
      }
    });

    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters({ search: searchQuery.trim() });
  };

  const handleClearFilters = () => {
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

  const removeFilterParam = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  // Quick price preset selection
  const setPricePreset = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    applyFilters({ minPrice: min, maxPrice: max });
  };

  // Quick city chip selection
  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    applyFilters({ city: selectedCity });
  };

  // Sort items client-side
  const sortedItems = useMemo(() => {
    const list = [...items];
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
    }
    if (sortBy === 'price_desc') {
      return list.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
    }
    // Default newest
    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [items, sortBy]);

  // Determine active filter keys for pill display
  const activeFilterList = useMemo(() => {
    const list = [];
    if (searchParams.get('search')) list.push({ key: 'search', label: `Keyword: "${searchParams.get('search')}"` });
    if (searchParams.get('category')) list.push({ key: 'category', label: `Category: ${searchParams.get('category')}` });
    if (searchParams.get('city')) list.push({ key: 'city', label: `City: ${searchParams.get('city')}` });
    if (searchParams.get('brand')) list.push({ key: 'brand', label: `Brand: ${searchParams.get('brand')}` });
    if (searchParams.get('condition')) list.push({ key: 'condition', label: `Condition: ${searchParams.get('condition')}` });
    if (searchParams.get('minPrice')) list.push({ key: 'minPrice', label: `Min: ₹${searchParams.get('minPrice')}` });
    if (searchParams.get('maxPrice')) list.push({ key: 'maxPrice', label: `Max: ₹${searchParams.get('maxPrice')}` });
    return list;
  }, [searchParams]);

  return (
    <div className="browse-page">
      <div className="container">
        {/* Top Breadcrumb & Mobile Filter Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>
              Explore Rental Marketplace
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Browse verified cameras, tools, tech, appliances, and vehicles across India
            </p>
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="btn btn-secondary btn-sm mobile-filter-trigger"
          >
            <SlidersHorizontal size={14} />
            <span>Filters {activeFilterList.length > 0 ? `(${activeFilterList.length})` : ''}</span>
          </button>
        </div>

        {/* Top Horizontal Category Pills Strip (Rentit4me Discovery Standard) */}
        <div className="browse-category-strip">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('');
              applyFilters({ category: '' });
            }}
            className={`category-pill-btn ${selectedCategory === '' ? 'active' : ''}`}
          >
            <Layers size={14} />
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => {
                const next = selectedCategory === cat.name ? '' : cat.name;
                setSelectedCategory(next);
                applyFilters({ category: next });
              }}
              className={`category-pill-btn ${selectedCategory === cat.name ? 'active' : ''}`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Alternative item recommendation notice from backend search */}
        {alternativeNotice && (
          <div className="alert alert-warning" style={{ marginBottom: 20 }}>
            <span>{alternativeNotice}</span>
          </div>
        )}

        <div className="browse-layout">
          {/* ========================================================
              LEFT SIDEBAR: OLX-INSPIRED MULTI-FILTER PANEL
              ======================================================== */}
          <aside className={`filter-sidebar ${mobileFilterOpen ? 'open' : ''}`}>
            <div className="filter-header">
              <h3>
                <SlidersHorizontal size={18} className="text-red" />
                <span>Filter Items</span>
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {activeFilterList.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--primary)', padding: '2px 6px', fontSize: '0.78rem' }}
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="filter-close-btn"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSearchSubmit}>
              {/* Filter 1: Search Keyword */}
              <div className="filter-section">
                <label className="filter-title">Search Keyword</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search by name, model..."
                    className="form-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingRight: 32 }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); applyFilters({ search: '' }); }}
                      style={{ position: 'absolute', right: 8, top: 10, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter 2: Categories */}
              <div className="filter-section">
                <label className="filter-title">Category</label>
                <div className="filter-options-list">
                  <label className="filter-option-label">
                    <input
                      type="radio"
                      name="categoryFilter"
                      checked={selectedCategory === ''}
                      onChange={() => {
                        setSelectedCategory('');
                        applyFilters({ category: '' });
                      }}
                    />
                    <span>All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat._id} className="filter-option-label">
                      <input
                        type="radio"
                        name="categoryFilter"
                        checked={selectedCategory === cat.name}
                        onChange={() => {
                          setSelectedCategory(cat.name);
                          applyFilters({ category: cat.name });
                        }}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter 3: Location / City */}
              <div className="filter-section">
                <label className="filter-title">Location / City</label>
                <div style={{ position: 'relative', marginBottom: 10 }}>
                  <input
                    type="text"
                    placeholder="e.g. Sonipat, Delhi"
                    className="form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ paddingLeft: 32 }}
                  />
                  <MapPin
                    size={14}
                    className="text-muted"
                    style={{ position: 'absolute', left: 10, top: 12 }}
                  />
                </div>
                {/* Popular City Chips */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['Delhi', 'Sonipat', 'Panipat', 'Karnal', 'Mumbai'].map((cityName) => (
                    <button
                      key={cityName}
                      type="button"
                      onClick={() => handleCitySelect(cityName)}
                      className={`quick-tag-pill ${city.toLowerCase() === cityName.toLowerCase() ? 'active' : ''}`}
                      style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                    >
                      {cityName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 4: Price Range (Per Day) */}
              <div className="filter-section">
                <label className="filter-title">Price Per Day (₹)</label>
                <div className="price-inputs-row" style={{ marginBottom: 10 }}>
                  <input
                    type="number"
                    placeholder="Min ₹"
                    className="form-input"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    className="form-input"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>
                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setPricePreset('', '500')}
                    className="quick-tag-pill"
                    style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  >
                    Under ₹500
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricePreset('500', '1500')}
                    className="quick-tag-pill"
                    style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  >
                    ₹500 - ₹1.5k
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricePreset('1500', '5000')}
                    className="quick-tag-pill"
                    style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  >
                    ₹1.5k - ₹5k
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricePreset('5000', '')}
                    className="quick-tag-pill"
                    style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  >
                    ₹5000+
                  </button>
                </div>
              </div>

              {/* Filter 5: Condition */}
              <div className="filter-section">
                <label className="filter-title">Item Condition</label>
                <select
                  value={condition}
                  onChange={(e) => {
                    setCondition(e.target.value);
                    applyFilters({ condition: e.target.value });
                  }}
                  className="form-select"
                >
                  <option value="">Any Condition</option>
                  <option value="new">Brand New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good Condition</option>
                  <option value="fair">Fair Condition</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 8 }}
              >
                <Search size={15} />
                <span>Apply Filters</span>
              </button>
            </form>
          </aside>

          {/* Backdrop for Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div
              className="filter-backdrop"
              onClick={() => setMobileFilterOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* ========================================================
              RIGHT AREA: RESULTS TOOLBAR & PRODUCT GRID
              ======================================================== */}
          <main>
            {/* Toolbar */}
            <div className="browse-toolbar">
              <div className="browse-results-count">
                Showing <strong>{sortedItems.length}</strong> available rental items
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="browse-sort-group">
                  <ArrowUpDown size={15} className="text-muted" />
                  <span style={{ color: 'var(--text-secondary)' }}>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="browse-sort-select"
                  >
                    <option value="recent">Recently Listed</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>

                <div className="view-mode-toggle" aria-label="Layout View Toggle">
                  <button
                    type="button"
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterList.length > 0 && (
              <div className="active-filters-chips">
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Active Filters:
                </span>
                {activeFilterList.map((item) => (
                  <span key={item.key} className="filter-chip">
                    <span>{item.label}</span>
                    <span
                      onClick={() => removeFilterParam(item.key)}
                      className="filter-chip-remove"
                      title="Remove filter"
                    >
                      <X size={13} />
                    </span>
                  </span>
                ))}
                <button
                  onClick={handleClearFilters}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, marginLeft: 4 }}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Grid / Skeletons / Empty State */}
            {loading ? (
              <div className={`grid-cards ${viewMode === 'list' ? 'view-list' : ''}`}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="skeleton skeleton-card"></div>
                ))}
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : sortedItems.length > 0 ? (
              <div className={`grid-cards ${viewMode === 'list' ? 'view-list' : ''}`}>
                {sortedItems.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <div className="card empty-state-box">
                <div className="empty-icon-circle">
                  <Package size={34} />
                </div>
                <h3>No rental items match your criteria</h3>
                <p>
                  Try widening your price range, choosing another category, or clearing your keyword filter.
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={handleClearFilters} className="btn btn-primary">
                    <RotateCcw size={15} />
                    <span>Reset All Filters</span>
                  </button>
                  <Link to="/create-item" className="btn btn-secondary">
                    List This Item
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Floating Mobile Filter Pill */}
        <div className="floating-mobile-filter">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="btn btn-primary floating-filter-pill"
          >
            <SlidersHorizontal size={16} />
            <span>Filters {activeFilterList.length > 0 ? `(${activeFilterList.length})` : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Browse;
