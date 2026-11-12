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
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';

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

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does the security deposit work?',
      a: 'Security deposits are held in a secure escrow protocol. Once you return the rented item to the owner in its original agreed condition, your complete deposit is promptly released back to your original payment method.',
    },
    {
      q: 'What is OTP Handover verification?',
      a: 'When picking up or delivering the item, both the owner and renter verify each other using a secure one-time passcode (OTP) generated on the dashboard. This ensures only verified parties complete handovers.',
    },
    {
      q: 'Can I extend my rental duration?',
      a: 'Yes, you can request a rental duration extension directly through your User Dashboard before your current booking expires, subject to owner confirmation.',
    },
    {
      q: 'How do I earn money by listing my equipment?',
      a: 'Click "List Your Item", provide product details, photos, daily/weekly rates, and security deposit amount. Once approved, nearby community members can discover and book your gear.',
    },
    {
      q: 'Are owners and renters identity verified?',
      a: 'Yes. All active accounts on S-RENT must verify their email, contact number, and identity credentials before completing high-value gear bookings.',
    },
  ];

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
      {/* 1. HERO SECTION (Full-Width Centered Marketplace Hero) */}
      <section className="hero-section hero-section-centered">
        <div className="container">
          <div className="hero-centered-content">
            {/* Tagline Badge */}
            <div className="hero-tagline-badge">
              <Sparkles size={14} />
              <span>Sab Rent Par, Saste Rent Par</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              Rent Anything. <span className="highlight">Anytime. Anywhere.</span>
            </h1>

            {/* Supporting Description */}
            <p className="hero-description">
              India's smart peer-to-peer rental marketplace. Save money on high-end gadgets, cameras, appliances, power tools &amp; vehicles without paying full retail prices.
            </p>

            {/* Wide, Attractive Multi-Field Search Card */}
            <form onSubmit={handleSearchSubmit} className="hero-search-card">
              <div className="search-field-group">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="What are you looking for? (e.g. DSLR Camera, MacBook, Power Drill)"
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
              <Link to="/create-item" className="btn btn-secondary btn-lg" style={{ background: '#FFFFFF', color: '#E93636' }}>
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

      {/* 6. TRUST & SAFETY ASSURANCE STRIP */}
      <section className="trust-strip-section">
        <div className="container">
          <div className="trust-strip-grid">
            <div className="trust-strip-item">
              <div className="trust-strip-icon">
                <ShieldCheck size={24} />
              </div>
              <div className="trust-strip-info">
                <h4>100% Escrow Protection</h4>
                <p>Security deposit held safely until return</p>
              </div>
            </div>
            <div className="trust-strip-item">
              <div className="trust-strip-icon">
                <CheckCircle2 size={24} />
              </div>
              <div className="trust-strip-info">
                <h4>Verified Community</h4>
                <p>Phone and identity checks for active renters</p>
              </div>
            </div>
            <div className="trust-strip-item">
              <div className="trust-strip-icon">
                <Clock size={24} />
              </div>
              <div className="trust-strip-info">
                <h4>OTP Handover Protocol</h4>
                <p>Digital check-in codes at pickup &amp; return</p>
              </div>
            </div>
            <div className="trust-strip-item">
              <div className="trust-strip-icon">
                <Wallet size={24} />
              </div>
              <div className="trust-strip-info">
                <h4>Zero Hidden Charges</h4>
                <p>Transparent rates set directly by owners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (Rentit4me Standard) */}
      <section id="faqs" className="section section-alt">
        <div className="container">
          <div className="section-header text-center" style={{ textAlign: 'center', margin: '0 auto 40px', justifyContent: 'center' }}>
            <div>
              <div className="hero-tagline-badge" style={{ margin: '0 auto 12px' }}>
                <HelpCircle size={14} />
                <span>Got Questions?</span>
              </div>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                Everything you need to know about renting and listing equipment safely on S-RENT
              </p>
            </div>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} className="text-red" /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
