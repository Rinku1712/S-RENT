import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCommonDashboard } from '../services/dashboardService';
import { getCategories } from '../services/categoryService';
import ItemCard from '../components/ItemCard';
import {
  Search,
  MapPin,
  Tag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  Smile,
  Wallet,
  Clock,
  Layers,
  TrendingUp,
  Percent,
  Laptop,
  Gamepad2,
  Car,
  Camera,
  Tv,
  Package,
} from 'lucide-react';
import heroImage from '../assets/hero.png';

/**
 * Public Homepage Component
 * Accessible to any visitor without login or authentication.
 * Fetches dynamic data from the backend:
 * - Live stats (Available items, active categories)
 * - Dynamic category taxonomies
 * - Recent popular marketplace listings
 */
const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search form fields
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cityKeyword, setCityKeyword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [dashRes, catRes] = await Promise.all([
          getCommonDashboard(),
          getCategories().catch(() => ({ data: [] })),
        ]);

        if (dashRes.success && dashRes.data) {
          setDashboardData(dashRes.data);
        }
        if (catRes.data) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Unable to load live marketplace data.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.append('search', searchKeyword.trim());
    if (selectedCategory) params.append('category', selectedCategory);
    if (cityKeyword.trim()) params.append('city', cityKeyword.trim());

    navigate(`/items?${params.toString()}`);
  };

  // Helper to select an appropriate Lucide icon for categories
  const getCategoryIcon = (categoryName = '') => {
    const name = categoryName.toLowerCase();
    if (name.includes('elect') || name.includes('laptop')) return <Laptop size={22} />;
    if (name.includes('toy') || name.includes('game')) return <Gamepad2 size={22} />;
    if (name.includes('vehic') || name.includes('car') || name.includes('bike')) return <Car size={22} />;
    if (name.includes('camera') || name.includes('photo')) return <Camera size={22} />;
    if (name.includes('appliance') || name.includes('tv')) return <Tv size={22} />;
    return <Package size={22} />;
  };

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content-col">
              <div className="hero-tagline-badge">
                <Sparkles size={14} />
                <span>Sab Rent Par, Saste Rent Par</span>
              </div>

              <h1 className="hero-title">
                Rent What You Need. <span className="highlight">Pay Less.</span>
              </h1>

              <p className="hero-description">
                Why buy when you can rent? Discover useful products at affordable rental prices. Save money, enjoy flexibility, and get what you need without unnecessary spending.
              </p>

              {/* Multi-Filter Search Bar */}
              <form onSubmit={handleSearchSubmit} className="hero-search-card">
                <div className="search-field-group">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="What do you need? (e.g. Laptop, Camera, Car)"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>

                <div className="search-field-group">
                  <Tag size={16} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="search-field-group">
                  <MapPin size={16} />
                  <input
                    type="text"
                    placeholder="City (e.g. Karnal, Sonipat)"
                    value={cityKeyword}
                    onChange={(e) => setCityKeyword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px' }}>
                  <Search size={16} />
                  <span>Search</span>
                </button>
              </form>

              {/* Action Buttons */}
              <div className="hero-cta-row">
                <Link to="/items" className="btn btn-primary btn-lg">
                  Explore Items
                </Link>
                <Link to="/create-item" className="btn btn-secondary btn-lg">
                  Start Renting & List Gear
                </Link>
              </div>

              {/* Live Backend Statistics */}
              {dashboardData && (
                <div className="hero-stats-row">
                  <div className="stat-item">
                    <span className="stat-number">{dashboardData.totalAvailableItems || 0}</span>
                    <span className="stat-label">Available for Rent</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <span className="stat-number">{dashboardData.totalCategories || 0}</span>
                    <span className="stat-label">Product Categories</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Verified Community</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Visual Image */}
            <div className="hero-visual-col">
              <div className="hero-visual-card">
                <img
                  src={heroImage}
                  alt="Rental Marketplace Gear"
                  className="hero-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="hero-overlay-pill">
                  <div className="hero-pill-icon">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 13, color: 'var(--text-primary)', display: 'block' }}>
                      Safe & Protected Rentals
                    </strong>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Refundable deposits and OTP verification on all items.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC CATEGORIES SECTION */}
      {categories.length > 0 && (
        <section id="categories" className="section section-alt">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Explore Categories</h2>
                <p className="section-subtitle">
                  Browse thousands of useful items organized by category
                </p>
              </div>
              <Link to="/items" className="btn btn-secondary btn-sm">
                <span>View Full Catalog</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="categories-grid">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => navigate(`/items?category=${encodeURIComponent(cat.name)}`)}
                  className="category-card"
                >
                  <div className="cat-icon-container">
                    {getCategoryIcon(cat.name)}
                  </div>
                  <div>
                    <h3>{cat.name}</h3>
                    <span className="cat-item-count">Browse items &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. POPULAR ITEMS FOR RENT */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Items for Rent</h2>
              <p className="section-subtitle">
                Quality gadgets, tools, and equipment freshly listed by verified owners
              </p>
            </div>
            <Link to="/items" className="btn btn-outline btn-sm">
              <span>Browse All Items</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : dashboardData?.recentItems && dashboardData.recentItems.length > 0 ? (
            <div className="grid-cards">
              {dashboardData.recentItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="card empty-state-box">
              <div className="empty-icon-circle">
                <Package size={28} />
              </div>
              <h3>No items listed yet</h3>
              <p>Be the first in your area to list an item and earn rental income!</p>
              <Link to="/create-item" className="btn btn-primary">
                List Your First Item
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. HOW SRENT WORKS */}
      <section id="how-it-works" className="section section-alt">
        <div className="container">
          <div className="section-header text-center" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <h2 className="section-title">How SRENT Works</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                A simple three-step process to rent anything you need or list your own idle equipment
              </p>
            </div>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number-badge">1</div>
              <div className="step-icon-box">
                <Search size={24} />
              </div>
              <h3 className="step-title">1. Explore Items</h3>
              <p className="step-desc">
                Browse our public catalog without an account. Search by category, city, condition, and daily budget.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number-badge">2</div>
              <div className="step-icon-box">
                <CalendarCheck size={24} />
              </div>
              <h3 className="step-title">2. Send Rental Request</h3>
              <p className="step-desc">
                Pick your preferred rental dates and security deposit estimate. The item owner confirms and coordinates handover.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number-badge">3</div>
              <div className="step-icon-box">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="step-title">3. Enjoy Your Rental</h3>
              <p className="step-desc">
                Use the item for the requested duration. Return it in good order to receive your full refundable security deposit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BENEFITS OF RENTING (WHY CHOOSE SRENT?) */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Why Choose SRENT?</h2>
              <p className="section-subtitle">
                The smart, affordable, and flexible alternative to purchasing products outright
              </p>
            </div>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon-box">
                <Wallet size={22} />
              </div>
              <h4>Save Money</h4>
              <p>
                Access top-tier cameras, power tools, and laptops for a fraction of their retail purchase price.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-box">
                <Percent size={22} />
              </div>
              <h4>Affordable Rental Prices</h4>
              <p>
                Transparent daily and weekly rates set directly by peer community members with no hidden fees.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-box">
                <Clock size={22} />
              </div>
              <h4>Flexible Rental Duration</h4>
              <p>
                Rent for just a single day, a full weekend project, or several weeks depending on your project needs.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-box">
                <Layers size={22} />
              </div>
              <h4>Multiple Categories</h4>
              <p>
                From electronics to camping gear, event equipment to vehicles—everything in one trusted marketplace.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-box">
                <TrendingUp size={22} />
              </div>
              <h4>Earn Money by Listing Items</h4>
              <p>
                Turn your idle household items, gaming consoles, and appliances into predictable monthly passive income.
              </p>
            </div>
          </div>

          {/* Bottom Call to Action Card */}
          <div className="cta-banner">
            <h2>Have Gear Sitting Idle Around Your House?</h2>
            <p>
              Join thousands of community members earning extra income every week by listing items safely on SRENT.
            </p>
            <div className="cta-btn-group">
              <Link to="/create-item" className="btn btn-primary btn-lg">
                List Your Item for Rent
              </Link>
              <Link to="/items" className="btn btn-secondary btn-lg">
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
