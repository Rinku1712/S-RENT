import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import {
  Search,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  Shield,
  Layers,
  Heart,
  User,
} from 'lucide-react';

/**
 * Navbar Component (OLX / Amazon Hybrid)
 * Features:
 * - Brand logo & official tagline
 * - Quick keyword search bar that redirects to /items
 * - Direct Wishlist heart icon with live count badge
 * - Primary "+ List Item" button
 * - User Profile menu / Guest auth actions
 * - Mobile responsive drawer
 */
const Navbar = () => {
  const { user, isSuperAdmin, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    } else {
      navigate('/items');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-wrapper">
      <div className="container nav-container">
        {/* Left: Minimal SRENT Brand Wordmark */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-box">
            <span>S</span>
          </div>
          <div className="brand-text-block">
            <span className="brand-title">
              S<span className="red-accent">RENT</span>
            </span>
            <span className="brand-tagline-pill">Sab Rent Par, Saste Rent Par</span>
          </div>
        </Link>

        {/* Center-Left: Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="navbar-search-bar">
          <input
            type="text"
            placeholder="Search items, cameras, tools, laptops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <Search size={15} />
          </button>
        </form>

        {/* Center-Right: Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link
            to="/items"
            className={`nav-item ${isActive('/items') || isActive('/browse') ? 'active' : ''}`}
          >
            Explore Items
          </Link>
          <a href="/#categories" className="nav-item">
            Categories
          </a>
          <a href="/#how-it-works" className="nav-item">
            How It Works
          </a>

          {/* SuperAdmin Links */}
          {isSuperAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
              >
                <Shield size={14} className="text-red" />
                Admin Console
              </Link>
              <Link
                to="/admin/categories"
                className={`nav-item ${isActive('/admin/categories') ? 'active' : ''}`}
              >
                <Layers size={14} />
                Categories
              </Link>
            </>
          )}
        </nav>

        {/* Right: Actions (Wishlist + Auth/User + List Item) */}
        <div className="auth-actions">
          {/* Wishlist Link */}
          <Link
            to={isAuthenticated ? "/dashboard?tab=wishlist" : "/login"}
            className="nav-wishlist-btn"
            title="My Saved Wishlist"
          >
            <Heart size={18} />
            {wishlistCount > 0 && <span className="nav-badge-count">{wishlistCount}</span>}
          </Link>

          {/* "+ List Item" CTA (Desktop) */}
          <Link to="/create-item" className="btn btn-primary btn-sm desktop-only">
            <PlusCircle size={15} />
            <span>List Item</span>
          </Link>

          {/* Auth State (Desktop) */}
          <div className="desktop-only">
            {isAuthenticated ? (
              <div className="user-nav-dropdown">
                <Link
                  to={isSuperAdmin ? '/admin/dashboard' : '/dashboard'}
                  className="user-pill"
                  title="Open Dashboard"
                >
                  <div className="user-avatar-circle">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span>{user?.name?.split(' ')[0] || (isSuperAdmin ? 'Admin' : 'Member')}</span>
                  {isSuperAdmin && <span className="badge badge-primary">Admin</span>}
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  <LogIn size={14} />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="btn btn-outline btn-sm">
                  <UserPlus size={14} />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Search equipment, tools, tech..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            <Search size={16} />
          </button>
        </form>

        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className={`mobile-drawer-link ${isActive('/') ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/items"
          onClick={() => setMobileMenuOpen(false)}
          className={`mobile-drawer-link ${isActive('/items') ? 'active' : ''}`}
        >
          Explore All Items
        </Link>
        <Link
          to="/create-item"
          onClick={() => setMobileMenuOpen(false)}
          className={`mobile-drawer-link ${isActive('/create-item') ? 'active' : ''}`}
        >
          <PlusCircle size={16} className="text-red" />
          List Your Item for Rent
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-link"
            >
              <LayoutDashboard size={16} />
              Member Dashboard
            </Link>
            <Link
              to="/dashboard?tab=wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-link"
            >
              <Heart size={16} />
              Saved Wishlist ({wishlistCount})
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-link"
            >
              <User size={16} />
              Profile Settings
            </Link>
            {isSuperAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-link"
              >
                <Shield size={16} className="text-red" />
                SuperAdmin Portal
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: 8 }}
            >
              <LogOut size={16} />
              <span>Log Out ({user?.name || 'Account'})</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center' }}
            >
              <LogIn size={15} />
              <span>Login</span>
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary btn-sm"
              style={{ justifyContent: 'center' }}
            >
              <UserPlus size={15} />
              <span>Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
