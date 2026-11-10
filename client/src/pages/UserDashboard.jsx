import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserDashboard } from '../services/dashboardService';
import {
  getOwnerRentalRequests,
  approveRentalRequest,
  rejectRentalRequest,
  getMyRentalRecords,
} from '../services/rentalService';
import { getAllItems, updateItemImages, deleteItem } from '../services/itemService';
import { getUserProfile } from '../services/authService';
import getItemImageUrl from '../utils/itemImageUrl';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import {
  isImageWithinSizeLimit,
  isSupportedImage,
  supportedImageFormats,
} from '../utils/imageValidation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Inbox,
  ShoppingBag,
  User,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Mail,
  Phone,
  ShieldCheck,
  Image,
  Trash2,
  Heart,
  Calendar,
  MapPin,
  Tag,
  Check,
} from 'lucide-react';

/**
 * Premium S-RENT Unified User & Owner Dashboard
 * Tabs:
 * 1. Overview: Live metrics, active alerts, quick actions
 * 2. My Listings: Equipment inventory manager, upload photos, delete item
 * 3. Requests Received: Review incoming booking requests (Approve / Reject)
 * 4. My Rentals: Personal booking history and live status tracking
 * 5. Saved Wishlist: Saved gear for upcoming projects
 * 6. Account Profile: Verified credentials, contact details, security status
 */
const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();

  // Active view: 'overview' | 'listings' | 'requests' | 'rentals' | 'wishlist' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // Backend stats from /api/dashboard/user
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Owner rental requests
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // My listed items
  const [myListings, setMyListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  // My rental bookings (as renter)
  const [myRentals, setMyRentals] = useState([]);
  const [rentalsLoading, setRentalsLoading] = useState(false);

  // Profile data
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Action status messages
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionProcessingId, setActionProcessingId] = useState(null);
  const [imageUploadItemId, setImageUploadItemId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await getUserDashboard();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load user dashboard stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch owner rental requests
  const fetchOwnerRequests = async () => {
    try {
      setRequestsLoading(true);
      const res = await getOwnerRentalRequests();
      if (res.success && res.data) {
        setOwnerRequests(res.data);
      }
    } catch (err) {
      console.error('Failed to load owner rental requests:', err);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Fetch items listed by user
  const fetchMyListings = async () => {
    try {
      setListingsLoading(true);
      const allItems = await getAllItems();
      const currentUserId = user?.id || user?._id;
      const filtered = allItems.filter(
        (it) => it.ownerId?._id === currentUserId || it.ownerId === currentUserId
      );
      setMyListings(filtered);
    } catch (err) {
      console.error('Failed to load user listings:', err);
    } finally {
      setListingsLoading(false);
    }
  };

  // Fetch renter rental records
  const fetchMyRentals = async () => {
    try {
      setRentalsLoading(true);
      const res = await getMyRentalRecords();
      if (res.success && res.data) {
        setMyRentals(res.data);
      }
    } catch (err) {
      console.error('Failed to load personal rentals:', err);
    } finally {
      setRentalsLoading(false);
    }
  };

  // Fetch full user profile
  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await getUserProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch tab-specific data when tab changes
  useEffect(() => {
    setActionMessage(null);
    setActionError(null);

    if (activeTab === 'requests') {
      fetchOwnerRequests();
    } else if (activeTab === 'listings') {
      fetchMyListings();
    } else if (activeTab === 'rentals') {
      fetchMyRentals();
    } else if (activeTab === 'profile') {
      fetchProfile();
    }
  }, [activeTab]);

  // Handle Owner Approving a Rental Request
  const handleApprove = async (rentalId) => {
    try {
      setActionProcessingId(rentalId);
      setActionMessage(null);
      setActionError(null);

      const res = await approveRentalRequest(rentalId);
      if (res.success) {
        setActionMessage('Rental request approved successfully!');
        fetchOwnerRequests();
        fetchStats();
      } else {
        setActionError(res.message || 'Failed to approve request.');
      }
    } catch (err) {
      setActionError(err.message || 'Error occurred while approving.');
    } finally {
      setActionProcessingId(null);
    }
  };

  // Handle Owner Rejecting a Rental Request
  const handleReject = async (rentalId) => {
    if (!window.confirm('Are you sure you want to reject this rental request?')) return;

    try {
      setActionProcessingId(rentalId);
      setActionMessage(null);
      setActionError(null);

      const res = await rejectRentalRequest(rentalId);
      if (res.success) {
        setActionMessage('Rental request rejected.');
        fetchOwnerRequests();
        fetchStats();
      } else {
        setActionError(res.message || 'Failed to reject request.');
      }
    } catch (err) {
      setActionError(err.message || 'Error occurred while rejecting.');
    } finally {
      setActionProcessingId(null);
    }
  };

  // Handle Item Image Update
  const handleUpdateImages = async (itemId, files) => {
    if (files.length === 0) return;

    if (files.length > 10 || files.some((file) => !isSupportedImage(file))) {
      setActionError(`Choose up to 10 images in these formats: ${supportedImageFormats}.`);
      return;
    }

    if (files.some((file) => !isImageWithinSizeLimit(file))) {
      setActionError('Each image must be 5 MB or smaller.');
      return;
    }

    if (!window.confirm('Replace current listing photos with the selected images?')) return;

    try {
      setImageUploadItemId(itemId);
      setActionMessage(null);
      setActionError(null);
      const result = await updateItemImages(itemId, files);

      if (result.success) {
        setActionMessage('Listing images updated successfully.');
        await fetchMyListings();
      } else {
        setActionError(result.message || 'Failed to update item images.');
      }
    } catch (err) {
      setActionError(err.message || 'Failed to update item images.');
    } finally {
      setImageUploadItemId(null);
    }
  };

  // Handle Item Deletion
  const handleDeleteItem = async (itemId, itemName) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${itemName}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingItemId(itemId);
      setActionMessage(null);
      setActionError(null);

      const res = await deleteItem(itemId);
      if (res.success) {
        setActionMessage(`"${itemName}" deleted successfully.`);
        await fetchMyListings();
        fetchStats();
      } else {
        setActionError(res.message || 'Failed to delete listing.');
      }
    } catch (err) {
      setActionError(err.message || 'Error occurred while deleting item.');
    } finally {
      setDeletingItemId(null);
    }
  };

  return (
    <div className="dashboard-page container">
      {/* Top Welcome Card */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          marginBottom: 28,
          borderLeft: '4px solid var(--primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-primary">Member & Owner Dashboard</span>
            {user?.email && (
              <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                {user.email}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '2px 0 4px' }}>
            Welcome back, {user?.name || 'Member'}!
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Manage your peer-to-peer rental gear, incoming requests, and booked equipment
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/create-item" className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>+ List New Gear</span>
          </Link>
          <Link to="/items" className="btn btn-secondary btn-sm">
            <span>Browse Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="dashboard-layout">
        {/* Left Sticky Sidebar */}
        <aside className="dashboard-sidebar">
          {/* User Mini Profile Header */}
          <div className="dashboard-user-header">
            <div className="dashboard-user-avatar">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <strong
                style={{
                  display: 'block',
                  fontSize: '0.92rem',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name || 'Community Member'}
              </strong>
              <span
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.email || 'Verified Account'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="dashboard-nav-list">
            <button
              onClick={() => setActiveTab('overview')}
              className={`dashboard-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <span className="label-with-icon">
                <LayoutDashboard size={16} />
                <span>Overview</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('listings')}
              className={`dashboard-nav-btn ${activeTab === 'listings' ? 'active' : ''}`}
            >
              <span className="label-with-icon">
                <Package size={16} />
                <span>My Listings</span>
              </span>
              {stats?.totalListedItems ? (
                <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                  {stats.totalListedItems}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`dashboard-nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
            >
              <span className="label-with-icon">
                <Inbox size={16} />
                <span>Requests Received</span>
              </span>
              {stats?.pendingRentals > 0 && (
                <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
                  {stats.pendingRentals}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('rentals')}
              className={`dashboard-nav-btn ${activeTab === 'rentals' ? 'active' : ''}`}
            >
              <span className="label-with-icon">
                <ShoppingBag size={16} />
                <span>My Bookings</span>
              </span>
              {stats?.totalMyRentalRequests ? (
                <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                  {stats.totalMyRentalRequests}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`dashboard-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            >
              <span className="label-with-icon">
                <Heart size={16} />
                <span>Saved Wishlist</span>
              </span>
              {wishlistCount > 0 && (
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`dashboard-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <span className="label-with-icon">
                <User size={16} />
                <span>Account Profile</span>
              </span>
            </button>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
              <button
                onClick={logout}
                className="dashboard-nav-btn"
                style={{ color: 'var(--danger)' }}
              >
                <span className="label-with-icon">
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Right Dynamic Tab Content */}
        <main className="dashboard-content" style={{ minWidth: 0 }}>
          {actionMessage && (
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
              <CheckCircle2 size={16} />
              <span>{actionMessage}</span>
            </div>
          )}

          {actionError && (
            <div className="alert alert-danger" style={{ marginBottom: 20 }}>
              <AlertCircle size={16} />
              <span>{actionError}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {statsLoading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: 14, color: 'var(--text-secondary)' }}>
                    Loading dashboard metrics...
                  </p>
                </div>
              ) : stats ? (
                <div>
                  {/* Metric Cards Grid */}
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-icon-box">
                        <Package size={22} />
                      </div>
                      <div>
                        <div className="metric-number">{stats.totalListedItems || 0}</div>
                        <div className="metric-label">Total Listed Items</div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div
                        className="metric-icon-box"
                        style={{ background: 'var(--success-bg)', color: 'var(--success)' }}
                      >
                        <CheckCircle2 size={22} />
                      </div>
                      <div>
                        <div className="metric-number" style={{ color: 'var(--success)' }}>
                          {stats.activeListings || 0}
                        </div>
                        <div className="metric-label">Active For Rent</div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div
                        className="metric-icon-box"
                        style={{
                          background: stats.pendingRentals > 0 ? '#FEE2E2' : 'var(--bg-subtle)',
                          color: stats.pendingRentals > 0 ? 'var(--danger)' : 'var(--text-muted)',
                        }}
                      >
                        <Clock size={22} />
                      </div>
                      <div>
                        <div
                          className="metric-number"
                          style={{
                            color: stats.pendingRentals > 0 ? 'var(--danger)' : 'var(--text-primary)',
                          }}
                        >
                          {stats.pendingRentals || 0}
                        </div>
                        <div className="metric-label">Pending Requests</div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div
                        className="metric-icon-box"
                        style={{ background: '#EDE9FE', color: '#7C3AED' }}
                      >
                        <ShoppingBag size={22} />
                      </div>
                      <div>
                        <div className="metric-number">{stats.totalMyRentalRequests || 0}</div>
                        <div className="metric-label">My Bookings</div>
                      </div>
                    </div>
                  </div>

                  {/* Urgent Attention Alert Banner */}
                  {stats.pendingRentals > 0 && (
                    <div
                      className="card"
                      style={{
                        padding: '18px 24px',
                        marginBottom: 24,
                        backgroundColor: '#FFF1F2',
                        borderColor: '#FECDD3',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <AlertCircle size={22} className="text-red" />
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: '#9F1239' }}>
                            You have {stats.pendingRentals} pending rental request(s) awaiting your decision!
                          </strong>
                          <span style={{ display: 'block', fontSize: '0.82rem', color: '#BE123C' }}>
                            Prompt approval ensures renters can plan equipment pickup smoothly.
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('requests')}
                        className="btn btn-primary btn-sm"
                      >
                        <span>Review Requests</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}

                  {/* Quick Shortcut Actions */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: 20,
                    }}
                  >
                    <div className="card" style={{ padding: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PlusCircle size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
                            List More Equipment
                          </h3>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            Earn passive rental revenue
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
                        Have cameras, power tools, camping gear, or tech sitting idle? List them in under 2 minutes and start earning securely.
                      </p>
                      <Link to="/create-item" className="btn btn-primary btn-sm">
                        <span>Create Listing</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div className="card" style={{ padding: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: '#E0F2FE',
                            color: '#0284C7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ShoppingBag size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
                            Explore Rental Gear
                          </h3>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            Thousands of verified items
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
                        Why buy when you can rent for a fraction of the price? Discover cameras, drones, tools, and electronics nearby.
                      </p>
                      <Link to="/items" className="btn btn-secondary btn-sm">
                        <span>Browse Catalog</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">
                  <AlertCircle size={16} />
                  <span>Unable to fetch dashboard statistics at this time.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY LISTED ITEMS */}
          {activeTab === 'listings' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px' }}>
                    My Listed Equipment
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Manage products you have published for rent across the community
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={fetchMyListings} className="btn btn-secondary btn-sm" title="Refresh">
                    <RefreshCw size={14} />
                    <span>Refresh</span>
                  </button>
                  <Link to="/create-item" className="btn btn-primary btn-sm">
                    <PlusCircle size={15} />
                    <span>Add New Listing</span>
                  </Link>
                </div>
              </div>

              {listingsLoading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: 14, color: 'var(--text-secondary)' }}>
                    Loading your listings...
                  </p>
                </div>
              ) : myListings.length === 0 ? (
                <div className="card empty-state-box">
                  <div className="empty-icon-circle">
                    <Package size={32} />
                  </div>
                  <h3>No items listed yet</h3>
                  <p>
                    You haven't listed any equipment yet. Start earning monthly passive revenue by renting items you already own!
                  </p>
                  <Link to="/create-item" className="btn btn-primary">
                    <PlusCircle size={16} />
                    <span>List Your First Item</span>
                  </Link>
                </div>
              ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div className="table-responsive">
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Category</th>
                          <th>Location</th>
                          <th>Rate / Deposit</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myListings.map((item) => {
                          const firstImage =
                            item.images && item.images.length > 0 ? item.images[0] : null;
                          const thumbUrl = getItemImageUrl(firstImage);

                          return (
                            <tr key={item._id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <div
                                    style={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: 'var(--radius-md)',
                                      overflow: 'hidden',
                                      backgroundColor: 'var(--bg-subtle)',
                                      flexShrink: 0,
                                      border: '1px solid var(--border)',
                                    }}
                                  >
                                    {thumbUrl ? (
                                      <img
                                        src={thumbUrl}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      />
                                    ) : (
                                      <div
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: 'var(--text-muted)',
                                        }}
                                      >
                                        <Package size={20} />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>
                                      {item.name}
                                    </strong>
                                    {item.brand && (
                                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                        {item.brand}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                {item.categoryId?.name || 'General'}
                              </td>

                              <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                {item.location?.city || 'India'}
                              </td>

                              <td>
                                <strong className="text-red">₹{item.pricePerDay}</strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/day</span>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  Deposit: ₹{item.securityDeposit || 0}
                                </div>
                              </td>

                              <td>
                                <span
                                  className={`badge ${
                                    item.availabilityStatus === 'available'
                                      ? 'badge-success'
                                      : 'badge-warning'
                                  }`}
                                  style={{ textTransform: 'capitalize' }}
                                >
                                  ● {item.availabilityStatus}
                                </span>
                              </td>

                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                  <label
                                    className="btn btn-secondary btn-sm"
                                    title="Update item photos"
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <Image size={13} />
                                    <span>
                                      {imageUploadItemId === item._id ? 'Uploading...' : 'Photos'}
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      disabled={imageUploadItemId === item._id}
                                      onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        e.target.value = '';
                                        handleUpdateImages(item._id, files);
                                      }}
                                      style={{ display: 'none' }}
                                    />
                                  </label>

                                  <Link
                                    to={`/items/${item._id}`}
                                    className="btn btn-secondary btn-sm"
                                    title="View live listing"
                                  >
                                    <ExternalLink size={13} />
                                    <span>View</span>
                                  </Link>

                                  <button
                                    onClick={() => handleDeleteItem(item._id, item.name)}
                                    disabled={deletingItemId === item._id}
                                    className="btn btn-danger btn-sm"
                                    title="Delete this listing"
                                  >
                                    <Trash2 size={13} />
                                    <span>{deletingItemId === item._id ? '...' : 'Delete'}</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RENTAL REQUESTS RECEIVED (AS OWNER) */}
          {activeTab === 'requests' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px' }}>
                    Rental Requests Received
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Approve or decline booking requests from renters for your gear
                  </p>
                </div>

                <button onClick={fetchOwnerRequests} className="btn btn-secondary btn-sm">
                  <RefreshCw size={14} />
                  <span>Refresh</span>
                </button>
              </div>

              {requestsLoading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: 14, color: 'var(--text-secondary)' }}>
                    Loading rental requests...
                  </p>
                </div>
              ) : ownerRequests.length === 0 ? (
                <div className="card empty-state-box">
                  <div className="empty-icon-circle">
                    <Inbox size={32} />
                  </div>
                  <h3>No rental requests received yet</h3>
                  <p>
                    When renters book your items, their contact information and rental dates will appear here for your confirmation.
                  </p>
                  <Link to="/create-item" className="btn btn-primary">
                    <PlusCircle size={16} />
                    <span>List More Gear</span>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {ownerRequests.map((req) => (
                    <div key={req._id} className="card" style={{ padding: 22 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          paddingBottom: 14,
                          borderBottom: '1px solid var(--border)',
                          marginBottom: 14,
                          flexWrap: 'wrap',
                          gap: 10,
                        }}
                      >
                        <div>
                          <span className="badge badge-primary" style={{ marginBottom: 4 }}>
                            Booking Request #{req._id.slice(-6)}
                          </span>
                          <h3 style={{ fontSize: '1.15rem', margin: '4px 0 2px', fontWeight: 800 }}>
                            {req.itemId?.name || 'Rental Item'}
                          </h3>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {req.itemId?.brand} • {req.itemId?.location?.city || 'Location unspecified'}
                          </span>
                        </div>

                        <div>
                          <span
                            className={`badge ${
                              req.status === 'approved'
                                ? 'badge-success'
                                : req.status === 'rejected'
                                ? 'badge-danger'
                                : 'badge-warning'
                            }`}
                            style={{ textTransform: 'capitalize' }}
                          >
                            ● Status: {req.status}
                          </span>
                        </div>
                      </div>

                      {/* Request Details 3-Column Info */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: 16,
                          marginBottom: 16,
                          fontSize: '0.88rem',
                        }}
                      >
                        <div>
                          <span className="text-muted" style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>
                            Renter Information
                          </span>
                          <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            {req.renterId?.name || 'Community Member'}
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                            <Mail size={13} />
                            <span>{req.renterId?.email || 'N/A'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                            <Phone size={13} />
                            <span>{req.renterId?.phone || 'N/A'}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-muted" style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>
                            Rental Duration
                          </span>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            {new Date(req.startDate).toLocaleDateString()} &rarr;{' '}
                            {new Date(req.endDate).toLocaleDateString()}
                          </strong>
                          <div style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: '0.82rem' }}>
                            Total Period: {req.totalDays} day(s)
                          </div>
                        </div>

                        <div>
                          <span className="text-muted" style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>
                            Financial Breakdown
                          </span>
                          <strong className="text-red" style={{ fontSize: '1.15rem' }}>
                            Rent: ₹{req.totalAmount}
                          </strong>
                          <div style={{ color: 'var(--text-secondary)', marginTop: 2, fontSize: '0.82rem' }}>
                            Refundable Deposit: ₹{req.securityDeposit}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons if status is pending */}
                      {req.status === 'pending' ? (
                        <div
                          style={{
                            display: 'flex',
                            gap: 10,
                            justifyContent: 'flex-end',
                            paddingTop: 12,
                            borderTop: '1px solid var(--border-light)',
                          }}
                        >
                          <button
                            onClick={() => handleReject(req._id)}
                            disabled={actionProcessingId === req._id}
                            className="btn btn-danger btn-sm"
                          >
                            <XCircle size={14} />
                            <span>{actionProcessingId === req._id ? 'Rejecting...' : 'Decline Request'}</span>
                          </button>
                          <button
                            onClick={() => handleApprove(req._id)}
                            disabled={actionProcessingId === req._id}
                            className="btn btn-primary btn-sm"
                          >
                            <CheckCircle2 size={14} />
                            <span>{actionProcessingId === req._id ? 'Approving...' : 'Approve Request'}</span>
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            paddingTop: 10,
                            borderTop: '1px solid var(--border-light)',
                            textAlign: 'right',
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Booking marked as <strong style={{ textTransform: 'capitalize' }}>{req.status}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY RENTALS (AS RENTER) */}
          {activeTab === 'rentals' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px' }}>
                    My Bookings & Rentals
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Track gear you have requested to rent from other community owners
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={fetchMyRentals} className="btn btn-secondary btn-sm">
                    <RefreshCw size={14} />
                    <span>Refresh</span>
                  </button>
                  <Link to="/items" className="btn btn-primary btn-sm">
                    <span>Browse Catalog</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {rentalsLoading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: 14, color: 'var(--text-secondary)' }}>
                    Loading your rental bookings...
                  </p>
                </div>
              ) : myRentals.length === 0 ? (
                <div className="card empty-state-box">
                  <div className="empty-icon-circle">
                    <ShoppingBag size={32} />
                  </div>
                  <h3>No bookings yet</h3>
                  <p>
                    You haven't rented any equipment yet. Explore cameras, power tools, electronics, and camping gear available nearby!
                  </p>
                  <Link to="/items" className="btn btn-primary">
                    <ShoppingBag size={16} />
                    <span>Browse Available Items</span>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {myRentals.map((rental) => (
                    <div key={rental._id} className="card" style={{ padding: 22 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          paddingBottom: 14,
                          borderBottom: '1px solid var(--border)',
                          marginBottom: 14,
                          flexWrap: 'wrap',
                          gap: 10,
                        }}
                      >
                        <div>
                          <span className="badge badge-primary" style={{ marginBottom: 4 }}>
                            Booking #{rental._id.slice(-6)}
                          </span>
                          <h3 style={{ fontSize: '1.15rem', margin: '4px 0 2px', fontWeight: 800 }}>
                            {rental.itemId?.name || 'Rented Equipment'}
                          </h3>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {rental.itemId?.location?.city || 'Location unspecified'}
                          </span>
                        </div>

                        <div>
                          <span
                            className={`badge ${
                              rental.status === 'approved'
                                ? 'badge-success'
                                : rental.status === 'rejected'
                                ? 'badge-danger'
                                : 'badge-warning'
                            }`}
                            style={{ textTransform: 'capitalize' }}
                          >
                            ● {rental.status}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: 16,
                          fontSize: '0.88rem',
                        }}
                      >
                        <div>
                          <span className="text-muted" style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>
                            Rental Dates
                          </span>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            {new Date(rental.startDate).toLocaleDateString()} &rarr;{' '}
                            {new Date(rental.endDate).toLocaleDateString()}
                          </strong>
                          <div style={{ color: 'var(--text-secondary)', marginTop: 2, fontSize: '0.82rem' }}>
                            Period: {rental.totalDays} day(s)
                          </div>
                        </div>

                        <div>
                          <span className="text-muted" style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>
                            Payment Breakdown
                          </span>
                          <strong className="text-red" style={{ fontSize: '1.15rem' }}>
                            Rent: ₹{rental.totalAmount}
                          </strong>
                          <div style={{ color: 'var(--text-secondary)', marginTop: 2, fontSize: '0.82rem' }}>
                            Deposit: ₹{rental.securityDeposit} (Refundable)
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {rental.itemId?._id && (
                            <Link
                              to={`/items/${rental.itemId._id}`}
                              className="btn btn-secondary btn-sm"
                            >
                              <ExternalLink size={14} />
                              <span>View Listing Details</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px' }}>
                    Saved Wishlist ({wishlistCount})
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Gear you have bookmarked for upcoming photo shoots, projects, or trips
                  </p>
                </div>

                <Link to="/items" className="btn btn-secondary btn-sm">
                  <span>Browse Catalog</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {wishlist.length === 0 ? (
                <div className="card empty-state-box">
                  <div className="empty-icon-circle">
                    <Heart size={32} />
                  </div>
                  <h3>Your wishlist is empty</h3>
                  <p>
                    Click the heart icon on any product card or details page to bookmark equipment you want to rent later.
                  </p>
                  <Link to="/items" className="btn btn-primary">
                    <ShoppingBag size={16} />
                    <span>Explore Rental Catalog</span>
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: 18,
                  }}
                >
                  {wishlist.map((item) => {
                    const firstImg = item.images && item.images.length > 0 ? item.images[0] : null;
                    const thumbUrl = getItemImageUrl(firstImg);

                    return (
                      <div key={item._id} className="card" style={{ padding: 16 }}>
                        <div
                          style={{
                            width: '100%',
                            aspectRatio: '4 / 3',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--bg-subtle)',
                            marginBottom: 12,
                            position: 'relative',
                          }}
                        >
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-muted)',
                              }}
                            >
                              <Package size={36} />
                            </div>
                          )}
                          <button
                            onClick={() => removeFromWishlist(item._id)}
                            style={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              background: 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              borderRadius: '50%',
                              width: 32,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: 'var(--danger)',
                            }}
                            title="Remove from wishlist"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <strong
                          style={{
                            fontSize: '0.95rem',
                            display: 'block',
                            color: 'var(--text-primary)',
                            marginBottom: 4,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.name}
                        </strong>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                          <MapPin size={12} className="text-red" />
                          <span>{item.location?.city || 'India'}</span>
                          <span>•</span>
                          <span>{item.categoryId?.name || 'Equipment'}</span>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: 10,
                            borderTop: '1px solid var(--border)',
                          }}
                        >
                          <div>
                            <strong className="text-red" style={{ fontSize: '1.1rem' }}>
                              ₹{item.pricePerDay}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/day</span>
                          </div>

                          <Link to={`/items/${item._id}`} className="btn btn-primary btn-sm">
                            <span>Rent Now</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: 680 }}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px' }}>
                  Account Profile & Trust
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Verified identity details, contact info, and rental security standing
                </p>
              </div>

              {profileLoading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: 14, color: 'var(--text-secondary)' }}>
                    Loading profile details...
                  </p>
                </div>
              ) : profile ? (
                <div className="card" style={{ padding: 28 }}>
                  {/* User Profile Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      borderBottom: '1px solid var(--border)',
                      paddingBottom: 22,
                      marginBottom: 22,
                    }}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {profile.name ? profile.name[0].toUpperCase() : 'U'}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.25rem', margin: '0 0 6px', fontWeight: 800 }}>
                        {profile.name}
                      </h3>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span
                          className={`badge ${
                            profile.isEmailVerified ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          <ShieldCheck size={12} />
                          {profile.isEmailVerified ? 'Email Verified' : 'Unverified Email'}
                        </span>
                        <span className="badge badge-secondary">
                          Account: {profile.accountStatus || 'active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Credentials List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.9rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--border-light)',
                        paddingBottom: 12,
                      }}
                    >
                      <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Mail size={15} />
                        <span>Email Address</span>
                      </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{profile.email}</strong>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--border-light)',
                        paddingBottom: 12,
                      }}
                    >
                      <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Phone size={15} />
                        <span>Phone Number</span>
                      </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{profile.phone || 'Not provided'}</strong>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--border-light)',
                        paddingBottom: 12,
                      }}
                    >
                      <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MapPin size={15} />
                        <span>Registered Location</span>
                      </span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {profile.address?.city
                          ? `${profile.address.city}, ${profile.address.state || 'India'}`
                          : 'India'}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--border-light)',
                        paddingBottom: 12,
                      }}
                    >
                      <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Calendar size={15} />
                        <span>Member Since</span>
                      </span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>

                  <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={logout} className="btn btn-danger btn-sm">
                      <LogOut size={14} />
                      <span>Sign Out from S-RENT</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="alert alert-danger">
                  <AlertCircle size={16} />
                  <span>Failed to load profile details.</span>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
