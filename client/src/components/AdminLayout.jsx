import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Layers,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  UserCheck,
} from 'lucide-react';

/**
 * Enterprise Admin Layout
 * Standards:
 * - Collapsible sticky sidebar with responsive mobile off-canvas drawer
 * - Persistent navigation with active indicator and badges
 * - Topbar with page breadcrumbs, live marketplace link, and admin profile dropdown
 * - Clean containment: prevents layout shift or horizontal overflow
 */
const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/users')) return 'User Management';
    if (path.includes('/admin/items')) return 'Equipment & Listings';
    if (path.includes('/admin/rentals')) return 'Booking & Rental Orders';
    if (path.includes('/admin/categories')) return 'Category Taxonomies';
    if (path.includes('/admin/settings')) return 'System Settings';
    return 'SuperAdmin Dashboard';
  };

  return (
    <div className="admin-shell">
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="admin-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-brand-block">
            <div className="admin-brand-icon">
              <span>S</span>
            </div>
            {!collapsed && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="admin-brand-title">S-RENT</span>
                <span className="admin-brand-badge">ADMIN</span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-ghost btn-sm admin-desktop-collapse-btn"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            title="Dashboard Overview"
          >
            <LayoutDashboard size={18} className="nav-icon" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            title="User Management"
          >
            <Users size={18} className="nav-icon" />
            {!collapsed && <span>User Directory</span>}
          </NavLink>

          <NavLink
            to="/admin/items"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            title="Catalog Listings"
          >
            <Package size={18} className="nav-icon" />
            {!collapsed && <span>Marketplace Gear</span>}
          </NavLink>

          <NavLink
            to="/admin/rentals"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            title="Bookings & Orders"
          >
            <ShoppingBag size={18} className="nav-icon" />
            {!collapsed && <span>Rental Orders</span>}
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            title="Category Taxonomies"
          >
            <Layers size={18} className="nav-icon" />
            {!collapsed && <span>Categories</span>}
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            title="System Settings"
          >
            <Settings size={18} className="nav-icon" />
            {!collapsed && <span>System Settings</span>}
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <button
            type="button"
            onClick={handleLogout}
            className="admin-nav-item"
            style={{ width: '100%', color: '#F87171', background: 'transparent', border: 'none', cursor: 'pointer' }}
            title="Sign out of Admin"
          >
            <LogOut size={18} className="nav-icon" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            {/* Mobile Hamburger Menu */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn btn-secondary btn-sm admin-mobile-toggle-btn"
              aria-label="Toggle navigation drawer"
            >
              <Menu size={18} />
            </button>

            {/* Page Title & Breadcrumb */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#64748B' }}>
                <span>Admin Console</span>
                <span>/</span>
                <span style={{ color: '#E53935', fontWeight: 600 }}>{getPageTitle()}</span>
              </div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '2px 0 0', color: '#0F172A' }}>
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="admin-topbar-right">
            {/* Quick Live Site Link */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ gap: 6 }}
              title="Open public marketplace in new tab"
            >
              <span>Live Marketplace</span>
              <ExternalLink size={13} />
            </Link>

            {/* Admin Profile Dropdown */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="admin-profile-pill"
                style={{ border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <div className="admin-avatar-small">
                  <span>A</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    {user?.name || 'Super Admin'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>System Admin</span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: 220,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                      SuperAdmin Console
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      Root Authorization Active
                    </div>
                  </div>

                  <div style={{ padding: 6 }}>
                    <Link
                      to="/admin/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        fontSize: '0.84rem',
                        color: '#334155',
                        textDecoration: 'none',
                        borderRadius: 6,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Shield size={14} className="text-red" />
                      <span>Security & Profile</span>
                    </Link>

                    <Link
                      to="/admin/users"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        fontSize: '0.84rem',
                        color: '#334155',
                        textDecoration: 'none',
                        borderRadius: 6,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <UserCheck size={14} className="text-red" />
                      <span>User Directory</span>
                    </Link>

                    <div style={{ height: 1, background: '#F1F5F9', margin: '4px 0' }} />

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        fontSize: '0.84rem',
                        color: '#E53935',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FEE2E2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

