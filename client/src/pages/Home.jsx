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
  Wrench,
  Armchair,
  Bike,
  Speaker,
} from 'lucide-react';
import srentLogo from '../assets/srent-logo.svg';

/**
 * Public Homepage Component (OLX + Amazon + Modern Rental Standard)
 * Features:
 * - High-impact Hero section with "Rent Anything. Anytime. Anywhere."
 * - Multi-field search card (Keyword, Category, Location)
 * - Quick trending search chips
 * - Live stats from /api/dashboard/common
 * - Category grid with icons
 * - Popular items grid with ItemCard
 * - How S-RENT Works 3-step visual guide
 * - Why Choose S-RENT value pillars
 * - Trust & Safety guarantees
 * - Owner CTA banner
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

  const handleQuickTagClick = (tag) => {
    navigate(`/items?search=${encodeURIComponent(tag)}`);
  };

  // Helper to select an appropriate Lucide icon for categories
  const getCategoryIcon = (categoryName = '') => {
    const name = categoryName.toLowerCase();
    if (name.includes('elect') || name.includes('laptop') || name.includes('comput')) return <Laptop size={24} />;
    if (name.includes('toy') || name.includes('game')) return <Gamepad2 size={24} />;
    if (name.includes('vehic') || name.includes('car')) return <Car size={24} />;
    if (name.includes('bike') || name.includes('cycle')) return <Bike size={24} />;
    if (name.includes('camera') || name.includes('photo')) return <Camera size={24} />;
    if (name.includes('appliance') || name.includes('tv')) return <Tv size={24} />;
    if (name.includes('tool')) return <Wrench size={24} />;
    if (name.includes('furnitur')) return <Armchair size={24} />;
    if (name.includes('audio') || name.includes('sound') || name.includes('music')) return <Speaker size={24} />;
    return <Package size={24} />;
  };

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Content Column */}
            <div className="hero-content-col">
              <div className="hero-tagline-badge">
                <Sparkles size={14} />
                <span>Sab Rent Par, Saste Rent Par</span>
              </div>

              <h1 className="hero-title">
                Rent Anything. <br />
                <span className="highlight">Anytime. Anywhere.</span>
              </h1>

              <p className="hero-description">
                India's smart peer-to-peer rental marketplace. Save money on high-end gadgets, cameras, appliances, power tools & vehicles without paying full retail prices.
              </p>

              {/* Multi-Field Search Card (Amazon/OLX Hybrid) */}
              <form onSubmit={handleSearchSubmit} className="hero-search-card">
                <div className="search-field-group">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="What are you looking for? (e.g. DSLR, Laptop, Drill)"
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
                    placeholder="City (e.g. Sonipat, Delhi)"
                    value={cityKeyword}
                    onChange={(e) => setCityKeyword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary hero-search-btn">
                  <Search size={16} />
                  <span>Search</span>
                </button>
              </form>

              {/* Popular Quick Search Tags */}
              <div className="hero-quick-tags">
                <span style={{ fontWeight: 600 }}>Trending:</span>
                {['Cameras', 'Laptops', 'Gaming Consoles', 'Power Tools', 'Vehicles', 'Tents'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className="quick-tag-pill"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Live Backend Statistics */}
              {dashboardData && (
                <div className="hero-stats-row">
                  <div className="stat-item">
                    <span className="stat-number">{dashboardData.totalAvailableItems || '50+'}</span>
                    <span className="stat-label">Available for Rent</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <span className="stat-number">{dashboardData.totalCategories || '10+'}</span>
                    <span className="stat-label">Product Categories</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Refundable Deposits</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <span className="stat-number">Verified</span>
                    <span className="stat-label">Peer Community</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Branded Hero Showcase with Official Named Logo */}
            <div className="hero-visual-col">
              <div className="hero-brand-card">
                {/* Official Named Logo Header */}
                <div className="hero-brand-header">
                  <img
                    src={srentLogo}
                    alt="S-RENT — Sab Rent Par, Saste Rent Par"
                    className="hero-named-logo"
                  />
                  <div className="hero-brand-verified-tag">
                    <ShieldCheck size={14} />
                    <span>Official Peer Network</span>
                  </div>
                </div>

                <div className="hero-brand-body">
                  <p className="hero-brand-mission">
                    India’s fastest-growing peer rental platform. Access professional gear, cameras, laptops, and tools near you without the burden of buying.
                  </p>

                  {/* 4 Feature Trust Pillars */}
                  <div className="hero-brand-pillars">
                    <div className="pillar-item">
                      <div className="pillar-icon">
                        <Wallet size={16} />
                      </div>
                      <div className="pillar-content">
                        <strong>100% Refundable</strong>
                        <span>Safe security deposit</span>
                      </div>
                    </div>

                    <div className="pillar-item">
                      <div className="pillar-icon">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="pillar-content">
                        <strong>OTP Handover</strong>
                        <span>Secure check-in code</span>
                      </div>
                    </div>

                    <div className="pillar-item">
                      <div className="pillar-icon">
                        <TrendingUp size={16} />
                      </div>
                      <div className="pillar-content">
                        <strong>Save Up To 90%</strong>
                        <span>Compared to buying</span>
                      </div>
                    </div>

                    <div className="pillar-item">
                      <div className="pillar-icon">
                        <Clock size={16} />
                      </div>
                      <div className="pillar-content">
                        <strong>Flexible Duration</strong>
                        <span>Daily & weekly rentals</span>
                      </div>
                    </div>
                  </div>

                  {/* Popular Rental Gear Chips */}
                  <div className="hero-brand-chips-row">
                    <span className="chips-title">Rent Top Gear:</span>
                    <div className="chips-list">
                      <Link to="/items?search=Camera" className="hero-gear-chip">
                        <Camera size={13} />
                        <span>Cameras</span>
                      </Link>
                      <Link to="/items?search=Laptop" className="hero-gear-chip">
                        <Laptop size={13} />
                        <span>Laptops</span>
                      </Link>
                      <Link to="/items?search=PS5" className="hero-gear-chip">
                        <Gamepad2 size={13} />
                        <span>Gaming</span>
                      </Link>
                      <Link to="/items?search=Bike" className="hero-gear-chip">
                        <Bike size={13} />
                        <span>Vehicles</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick-Action CTAs */}
                <div className="hero-brand-actions">
                  <Link to="/items" className="btn btn-primary btn-sm hero-brand-btn">
                    <span>Browse All Gear</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link to="/create-item" className="btn btn-secondary btn-sm hero-brand-btn">
                    <Sparkles size={14} />
                    <span>List Item & Earn</span>
                  </Link>
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
                <h2 className="section-title">Browse by Category</h2>
                <p className="section-subtitle">
                  Explore thousands of verified items organized into intuitive rental categories
                </p>
              </div>
              <Link to="/items" className="btn btn-secondary btn-sm">
                <span>View All Categories</span>
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
                  <h3>{cat.name}</h3>
                  <span className="cat-item-count">Explore rentals &rarr;</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. POPULAR / RECENT ITEMS FOR RENT */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Rental Items</h2>
              <p className="section-subtitle">
                Popular equipment and appliances freshly listed by verified owners in your city
              </p>
            </div>
            <Link to="/items" className="btn btn-outline btn-sm">
              <span>Explore Marketplace</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid-cards">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="skeleton skeleton-card"></div>
              ))}
            </div>
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
                <Package size={32} />
              </div>
              <h3>No items listed yet</h3>
              <p>Be the first member in your area to list an item and earn predictable passive income!</p>
              <Link to="/create-item" className="btn btn-primary">
                List Your First Item
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. HOW S-RENT WORKS (Interactive 3-Step Journey) */}
      <section id="how-it-works" className="section section-alt">
        <div className="container">
          <div className="section-header text-center" style={{ justifyContent: 'center', textAlign: 'center', margin: '0 auto 48px' }}>
            <div>
              <div className="hero-tagline-badge" style={{ margin: '0 auto 12px' }}>
                <span>Simple & Transparent</span>
              </div>
              <h2 className="section-title">How S-RENT Works</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                Renting high-value equipment is as simple as 1, 2, 3. No paperwork, no hidden charges.
              </p>
            </div>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number-badge">1</div>
              <div className="step-icon-box">
                <Search size={24} />
              </div>
              <h3 className="step-title">1. Search & Select</h3>
              <p className="step-desc">
                Browse our open marketplace catalog. Filter by category, location, and daily budget without any account.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number-badge">2</div>
              <div className="step-icon-box">
                <CalendarCheck size={24} />
              </div>
              <h3 className="step-title">2. Book with Deposit Protection</h3>
              <p className="step-desc">
                Choose your rental dates. Review your daily rate and 100% refundable security deposit with complete price transparency.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number-badge">3</div>
              <div className="step-icon-box">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="step-title">3. Rent, Enjoy & Return</h3>
              <p className="step-desc">
                Meet the owner for OTP handover, use the equipment for your project, and get your security deposit refunded upon return.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE S-RENT (Value Pillars) */}
      <section id="benefits" className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Why Choose S-RENT?</h2>
              <p className="section-subtitle">
                The smart, sustainable, and affordable alternative to purchasing gear outright
              </p>
            </div>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon-box">
                <Wallet size={22} />
              </div>
              <h4>Save Up to 80%</h4>
              <p>
                Access flagship cameras, gaming setups, and power tools for a fraction of their retail purchase price.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-box">
                <Percent size={22} />
              </div>
              <h4>Transparent Pricing</h4>
              <p>
                Clean daily and weekly rates set directly by peer community members with zero hidden commission fees.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-box">
                <Clock size={22} />
              </div>
              <h4>Flexible Rental Periods</h4>
              <p>
                Rent for just a single day, an entire weekend project, or months depending on your workflow.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-box">
                <Layers size={22} />
              </div>
              <h4>Diverse Categories</h4>
              <p>
                From consumer electronics to camping gear, event sound systems to bikes—all in one trusted hub.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-box">
                <TrendingUp size={22} />
              </div>
              <h4>Earn Passive Income</h4>
              <p>
                Turn your idle household items and electronics into predictable monthly passive income.
              </p>
            </div>
          </div>

          {/* Owner Call to Action Banner */}
          <div className="cta-banner">
            <h2>Have Gear Sitting Idle Around Your House?</h2>
            <p>
              Join thousands of community members earning ₹10,000–₹50,000 every month by safely listing gear on S-RENT.
            </p>
            <div className="cta-btn-group">
              <Link to="/create-item" className="btn btn-secondary btn-lg" style={{ background: '#FFFFFF', color: '#E53935' }}>
                <Package size={18} />
                <span>List Your Item for Rent</span>
              </Link>
              <Link to="/items" className="btn btn-outline btn-lg" style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}>
                <span>Explore Available Items</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
