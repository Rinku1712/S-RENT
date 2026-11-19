import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import {
  Menu,
  X,
  PlusCircle,
  LogIn,
  LogOut,
  Heart,
  LayoutDashboard,
  ShieldCheck,
  Search,
} from 'lucide-react';

/**
 * Navbar Component (s-rent Red & White Theme Standard)
 * Specifications:
 * - Logo: Left-aligned bold brand text "s-rent" in deep crimson (#DC2626) with sleek red asset icon
 * - Nav Links: "How s-rent works", "Guarantee", "FAQ's", "Contact", "Explore Items"
 * - Action Buttons: Solid crimson button "Create Item", White outlined button "Log in"
 * - Mobile responsive drawer with smooth transitions
 */
const Navbar = () => {
  const { user, isSuperAdmin, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/items?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white border-b ${
        scrolled ? 'border-red-100 shadow-sm' : 'border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 1. Left-aligned Logo: Bold "S-RENT" in deep crimson with sleek red asset icon */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
            aria-label="S-RENT Home"
          >
            {/* Sleek Red Geometric Asset Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-700 via-red-600 to-red-500 flex items-center justify-center shadow-md shadow-red-500/25 group-hover:scale-105 transition-transform duration-200">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Modern circular rent loop with stylized S curve */}
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" opacity="0.4" />
                <path d="M16 8h-4a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-5" />
              </svg>
            </div>

            {/* Brand Wordmark */}
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-red-600 group-hover:text-red-700 transition-colors">
                S-RENT
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500 -mt-1 hidden sm:block">
                Rent Smart. Live More.
              </span>
            </div>
          </Link>

          {/* 2. Center/Right Navigation Items */}
          <nav className="hidden xl:flex items-center gap-5 lg:gap-7">
            <Link
              to="/items"
              className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors"
            >
              Explore Items
            </Link>
            <a
              href="/#how-it-works"
              className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors"
            >
              How S-RENT Works
            </a>
            <a
              href="/#guarantee"
              className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors"
            >
              Rental Essentials
            </a>
            <a
              href="/#faqs"
              className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors"
            >
              FAQ's
            </a>
            <a
              href="/#contact"
              className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors"
            >
              Contact
            </a>

            {isSuperAdmin && (
              <Link
                to="/admin/dashboard"
                className="text-sm font-bold text-red-600 flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full border border-red-200 hover:bg-red-100 transition-colors"
              >
                <ShieldCheck size={14} />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* 3. Action Buttons & User Menu */}
          <div className="hidden xl:flex items-center gap-3">
            {/* Wishlist Link */}
            <Link
              to={isAuthenticated ? '/dashboard?tab=wishlist' : '/login'}
              className="relative p-2.5 rounded-full text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
              title="Saved items"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Solid crimson primary button labeled "Create Item" */}
            <Link
              to="/create-item"
              style={{ color: '#FFFFFF' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 !text-white font-bold text-sm shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200"
            >
              <PlusCircle size={16} className="text-white" />
              <span className="text-white">Create Item</span>
            </Link>

            {/* Auth State Handling: If not logged in -> White outlined button with red text labeled "Log in" */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100 font-bold text-sm transition-all duration-200 shadow-sm"
              >
                <LogIn size={16} />
                <span>Log in</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 pl-1 border-l border-gray-200">
                <Link
                  to={isSuperAdmin ? '/admin/dashboard' : '/dashboard'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-gray-800">
                    {user?.name?.split(' ')[0] || (isSuperAdmin ? 'Admin' : 'Account')}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              to={isAuthenticated ? '/dashboard?tab=wishlist' : '/login'}
              className="relative p-2 text-gray-600 hover:text-red-600"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="xl:hidden bg-white border-b border-red-100 shadow-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200"
        >
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Search gear, cameras, tools..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
            />
            <Search size={16} className="absolute left-3.5 top-3.5 text-red-500" />
          </form>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-3 pb-4 border-b border-gray-100 font-semibold text-gray-800 text-sm">
            <Link
              to="/items"
              className="hover:text-red-600 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Items
            </Link>
            <a
              href="/#how-it-works"
              className="hover:text-red-600 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              How s-rent works
            </a>
            <a
              href="/#guarantee"
              className="hover:text-red-600 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rental Essentials
            </a>
            <a
              href="/#faqs"
              className="hover:text-red-600 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ's
            </a>
            <a
              href="/#contact"
              className="hover:text-red-600 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="hover:text-red-600 py-1 flex items-center gap-2 text-red-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={16} />
                <span>My Dashboard</span>
              </Link>
            )}
            {isSuperAdmin && (
              <Link
                to="/admin/dashboard"
                className="hover:text-red-600 py-1 flex items-center gap-2 text-red-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShieldCheck size={16} />
                <span>Admin Console</span>
              </Link>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col gap-2.5">
            <Link
              to="/create-item"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#FFFFFF' }}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-red-600 !text-white font-bold text-sm shadow-md shadow-red-500/20 hover:bg-red-700"
            >
              <PlusCircle size={16} className="text-white" />
              <span className="text-white">Create Item</span>
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-white border-2 border-red-600 text-red-600 font-bold text-sm hover:bg-red-50 shadow-sm"
              >
                <LogIn size={16} />
                <span>Log in</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200"
              >
                <LogOut size={16} />
                <span>Sign Out ({user?.name || 'Account'})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
