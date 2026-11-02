import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Package,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  HelpCircle,
  PlusCircle,
  Shield,
  Layers,
} from 'lucide-react';

/**
 * Navbar Component
 * Features:
 * - Minimalist SRENT logo with "Sab Rent Par, Saste Rent Par" tagline
 * - Navigation links to Home, Explore Items, Categories, and How It Works
 * - Context-aware auth actions (Guest vs. Member vs. SuperAdmin)
 * - Mobile responsive drawer with Lucide React icons (no emojis)
 */
const Navbar = () => {
  const { user, isSuperAdmin, isAuthenticated, isUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
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

        {/* Center: Desktop Navigation Links */}
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

          {/* User Links when logged in as regular member */}
          {isUser && (
            <>
              <Link
                to="/create-item"
                className={`nav-item ${isActive('/create-item') ? 'active' : ''}`}
              >
                <PlusCircle size={15} className="text-red" />
                List Item
              </Link>
              <Link
                to="/dashboard"
                className={`nav-item ${isActive('/dashboard') || isActive('/user/dashboard') ? 'active' : ''}`}
              >
                <LayoutDashboard size={15} />
                My Dashboard
              </Link>
            </>
          )}

          {/* SuperAdmin Links */}
          {isSuperAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
              >
                <Shield size={15} className="text-red" />
                Admin Console
              </Link>
              <Link
                to="/admin/categories"
                className={`nav-item ${isActive('/admin/categories') ? 'active' : ''}`}
              >
                <Layers size={15} />
                Categories
              </Link>
            </>
          )}
        </nav>

        {/* Right: Authentication Actions */}
        <div className="auth-actions">
          {isAuthenticated ? (
            <div className="user-nav-dropdown">
              <Link to={isSuperAdmin ? '/admin/dashboard' : '/profile'} className="user-pill">
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
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
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
          className={`mobile-drawer-link ${isActive('/items') || isActive('/browse') ? 'active' : ''}`}
        >
          Explore Items
        </Link>
        <a
          href="/#categories"
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-drawer-link"
        >
          Categories
        </a>
        <a
          href="/#how-it-works"
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-drawer-link"
        >
          How It Works
        </a>

        {isUser && (
          <>
            <Link
              to="/create-item"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-link"
            >
              <PlusCircle size={16} className="text-red" />
              List an Item for Rent
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-link"
            >
              <LayoutDashboard size={16} />
              My Dashboard
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-link"
            >
              <User size={16} />
              My Profile
            </Link>
          </>
        )}

        {isSuperAdmin && (
          <>
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-link"
            >
              <Shield size={16} className="text-red" />
              Admin Dashboard
            </Link>
            <Link
              to="/admin/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-link"
            >
              <Layers size={16} />
              Manage Categories
            </Link>
          </>
        )}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <LogOut size={16} />
              Logout ({user?.name || 'Account'})
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
