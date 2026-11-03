import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserDashboard } from '../services/dashboardService';
import {
  getOwnerRentalRequests,
  approveRentalRequest,
  rejectRentalRequest,
} from '../services/rentalService';
import { getAllItems, updateItemImages } from '../services/itemService';
import { getUserProfile } from '../services/authService';
import { useAuth } from '../context/AuthContext';
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
} from 'lucide-react';

/**
 * User Dashboard Page
 * URL: /user/dashboard (and /dashboard)
 * Business Rule:
 * Every registered user can BOTH rent products and list their own gear for rent.
 * Tabs / Navigation:
 * - 1. Overview: Live metrics from backend
 * - 2. My Listed Items: Products added by user
 * - 3. Rental Requests Received: Booking requests for user's items (Approve / Reject)
 * - 4. My Rentals: Gear user has requested from other owners
 * - 5. Profile: Verified account credentials
 * - Zero emojis, 100% Lucide React icons
 */
const UserDashboard = () => {
  const { user, logout } = useAuth();

  // Active view: 'overview' | 'listings' | 'requests' | 'rentals' | 'profile'
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

  // Profile data
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Action status message
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionProcessingId, setActionProcessingId] = useState(null);
  const [imageUploadItemId, setImageUploadItemId] = useState(null);

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
    if (activeTab === 'requests') {
      fetchOwnerRequests();
    } else if (activeTab === 'listings') {
      fetchMyListings();
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

  const handleUpdateImages = async (itemId, files) => {
    if (files.length === 0) return;

    if (
      files.length > 10 ||
      files.some((file) => !isSupportedImage(file))
    ) {
      setActionError(`Choose up to 10 images in these formats: ${supportedImageFormats}.`);
      return;
    }

    if (files.some((file) => !isImageWithinSizeLimit(file))) {
      setActionError('Each image must be 5 MB or smaller.');
      return;
    }

    if (!window.confirm('Replace all current images with the selected images?')) return;

    try {
      setImageUploadItemId(itemId);
      setActionMessage(null);
      setActionError(null);
      const result = await updateItemImages(itemId, files);

      if (result.success) {
        setActionMessage('Item images updated successfully.');
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

  return (
    <div className="dashboard-page container">
      {/* Top Banner */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          marginBottom: 24,
          borderLeft: '4px solid var(--primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <span className="badge badge-primary" style={{ marginBottom: 6 }}>
            Member Dashboard
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '2px 0' }}>
            Welcome, {user?.name || 'Member'}!
          </h1>
          <p style={{ margin: 0, fontSize: 14 }}>
            Manage your listed items, incoming rental requests, and outgoing bookings
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/create-item" className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>+ List New Item</span>
          </Link>
          <Link to="/items" className="btn btn-secondary btn-sm">
            <span>Browse Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Main Dashboard Layout with Sidebar */}
      <div className="dashboard-layout">
        {/* Left Dashboard Sidebar */}
        <aside className="dashboard-sidebar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`dashboard-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`dashboard-nav-item ${activeTab === 'listings' ? 'active' : ''}`}
          >
            <Package size={16} />
            <span>My Listed Items</span>
            {stats?.totalListedItems ? (
              <span className="badge badge-secondary" style={{ marginLeft: 'auto' }}>
                {stats.totalListedItems}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`dashboard-nav-item ${activeTab === 'requests' ? 'active' : ''}`}
          >
            <Inbox size={16} />
            <span>Requests Received</span>
            {stats?.pendingRentals > 0 && (
              <span className="badge badge-danger" style={{ marginLeft: 'auto' }}>
                {stats.pendingRentals}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('rentals')}
            className={`dashboard-nav-item ${activeTab === 'rentals' ? 'active' : ''}`}
          >
            <ShoppingBag size={16} />
            <span>My Rentals</span>
            {stats?.totalMyRentalRequests ? (
              <span className="badge badge-secondary" style={{ marginLeft: 'auto' }}>
                {stats.totalMyRentalRequests}
              </span>
            ) : null}
          </button>

          <Link
            to="/create-item"
            className="dashboard-nav-item"
            style={{ color: 'var(--primary)', fontWeight: 600 }}
          >
            <PlusCircle size={16} />
            <span>Add New Item</span>
          </Link>

          <button
            onClick={() => setActiveTab('profile')}
            className={`dashboard-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User size={16} />
            <span>Profile</span>
          </button>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
            <button
              onClick={logout}
              className="dashboard-nav-item"
              style={{ color: 'var(--danger)' }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Dashboard Content */}
        <main className="dashboard-content">
          {actionMessage && (
            <div className="alert alert-success">
              <CheckCircle2 size={16} />
              <span>{actionMessage}</span>
            </div>
          )}

          {actionError && (
            <div className="alert alert-danger">
              <AlertCircle size={16} />
              <span>{actionError}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {statsLoading ? (
                <div className="spinner"></div>
              ) : stats ? (
                <div>
                  {/* Row 1: Listings Stats (As Owner) */}
                  <h3 style={{ fontSize: 17, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Package size={17} className="text-red" />
                    <span>My Listed Equipment</span>
                  </h3>

                  <div className="stats-grid">
                    <div className="stat-metric-card">
                      <span className="stat-title">Total Listed Items</span>
                      <span className="stat-val text-red">{stats.totalListedItems || 0}</span>
                      <span className="stat-sub">Products in inventory</span>
                    </div>

                    <div className="stat-metric-card">
                      <span className="stat-title">Active for Rent</span>
                      <span className="stat-val text-success">{stats.activeListings || 0}</span>
                      <span className="stat-sub">Publicly available</span>
                    </div>

                    <div className="stat-metric-card">
                      <span className="stat-title">Requests Received</span>
                      <span className="stat-val">{stats.totalRentalRequests || 0}</span>
                      <span className="stat-sub">Lifetime requests</span>
                    </div>

                    <div className="stat-metric-card">
                      <span className="stat-title">Pending Approvals</span>
                      <span className="stat-val" style={{ color: 'var(--warning)' }}>
                        {stats.pendingRentals || 0}
                      </span>
                      <span className="stat-sub">Awaiting your response</span>
                    </div>
                  </div>

                  {/* Row 2: Renter Activity Stats */}
                  <h3 style={{ fontSize: 17, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShoppingBag size={17} className="text-red" />
                    <span>My Rented Gear (As Renter)</span>
                  </h3>

                  <div className="stats-grid">
                    <div className="stat-metric-card">
                      <span className="stat-title">Total Bookings Sent</span>
                      <span className="stat-val">{stats.totalMyRentalRequests || 0}</span>
                      <span className="stat-sub">Gear requested</span>
                    </div>

                    <div className="stat-metric-card">
                      <span className="stat-title">Approved Bookings</span>
                      <span className="stat-val text-success">{stats.myApprovedRentals || 0}</span>
                      <span className="stat-sub">Confirmed by owners</span>
                    </div>

                    <div className="stat-metric-card">
                      <span className="stat-title">Pending Confirmation</span>
                      <span className="stat-val" style={{ color: 'var(--warning)' }}>
                        {stats.myPendingRentals || 0}
                      </span>
                      <span className="stat-sub">Waiting on owners</span>
                    </div>
                  </div>

                  {/* Quick Action Alert */}
                  {stats.pendingRentals > 0 && (
                    <div
                      className="card"
                      style={{
                        padding: 20,
                        backgroundColor: 'var(--bg-section)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Clock size={20} className="text-red" />
                        <div>
                          <strong style={{ fontSize: 15, display: 'block' }}>
                            You have {stats.pendingRentals} pending rental request(s)
                          </strong>
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            Review dates and approve requests from community renters.
                          </span>
                        </div>
                      </div>

                      <button onClick={() => setActiveTab('requests')} className="btn btn-primary btn-sm">
                        <span>Review Requests</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="alert alert-warning">
                  <AlertCircle size={16} />
                  <span>Unable to load dashboard statistics.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY LISTED ITEMS */}
          {activeTab === 'listings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>My Listed Items</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                    Manage equipment you have published for rent
                  </p>
                </div>
                <Link to="/create-item" className="btn btn-primary btn-sm">
                  <PlusCircle size={15} />
                  <span>Add New Item</span>
                </Link>
              </div>

              {listingsLoading ? (
                <div className="spinner"></div>
              ) : myListings.length === 0 ? (
                <div className="card empty-state-box">
                  <div className="empty-icon-circle">
                    <Package size={30} />
                  </div>
                  <h3>No items listed yet</h3>
                  <p>You haven't listed any equipment yet. Start earning passive income by sharing gear you don't use every day!</p>
                  <Link to="/create-item" className="btn btn-primary">
                    List Your First Item
                  </Link>
                </div>
              ) : (
                <div className="data-table-card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Daily Price</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myListings.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <strong style={{ fontSize: 14 }}>{item.name}</strong>
                              {item.brand && (
                                <span className="badge badge-secondary" style={{ fontSize: 11 }}>
                                  {item.brand}
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>
                            {item.categoryId?.name || 'General'}
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                            {item.location?.city || 'India'}
                          </td>
                          <td>
                            <strong className="text-red">₹{item.pricePerDay}</strong>
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>/day</span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.availabilityStatus === 'available'
                                  ? 'badge-success'
                                  : 'badge-warning'
                              }`}
                            >
                              ● {item.availabilityStatus}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                              <label className="btn btn-secondary btn-sm">
                                <Image size={13} />
                                <span>
                                  {imageUploadItemId === item._id ? 'Uploading...' : 'Update Images'}
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
                              >
                                <ExternalLink size={13} />
                                <span>View Listing</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RENTAL REQUESTS RECEIVED (AS OWNER) */}
          {activeTab === 'requests' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>Rental Requests for Your Gear</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                    Confirm or reject incoming booking requests from community members
                  </p>
                </div>
                <button onClick={fetchOwnerRequests} className="btn btn-secondary btn-sm">
                  <RefreshCw size={14} />
                  <span>Refresh</span>
                </button>
              </div>

              {requestsLoading ? (
                <div className="spinner"></div>
              ) : ownerRequests.length === 0 ? (
                <div className="card empty-state-box">
                  <div className="empty-icon-circle">
                    <Inbox size={30} />
                  </div>
                  <h3>No incoming rental requests</h3>
                  <p>When someone requests to rent any of your listed items, their contact and booking details will appear here.</p>
                  <Link to="/create-item" className="btn btn-primary">
                    List More Items
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {ownerRequests.map((req) => (
                    <div key={req._id} className="card" style={{ padding: 20 }}>
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
                            Booking #{req._id.slice(-6)}
                          </span>
                          <h3 style={{ fontSize: 18, margin: '2px 0' }}>
                            {req.itemId?.name || 'Rental Item'}
                          </h3>
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
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

                      {/* Details row */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: 16,
                          marginBottom: 16,
                          fontSize: 13,
                        }}
                      >
                        <div>
                          <span className="text-muted" style={{ display: 'block', fontSize: 12 }}>
                            Renter Contact
                          </span>
                          <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                            {req.renterId?.name || 'Community Member'}
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, color: 'var(--text-secondary)' }}>
                            <Mail size={12} />
                            <span>{req.renterId?.email || 'N/A'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, color: 'var(--text-secondary)' }}>
                            <Phone size={12} />
                            <span>{req.renterId?.phone || 'N/A'}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-muted" style={{ display: 'block', fontSize: 12 }}>
                            Rental Duration
                          </span>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            {new Date(req.startDate).toLocaleDateString()} &rarr; {new Date(req.endDate).toLocaleDateString()}
                          </strong>
                          <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                            Duration: {req.totalDays} day(s)
                          </div>
                        </div>

                        <div>
                          <span className="text-muted" style={{ display: 'block', fontSize: 12 }}>
                            Financials
                          </span>
                          <strong className="text-red" style={{ fontSize: 16 }}>
                            Rent: ₹{req.totalAmount}
                          </strong>
                          <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                            Deposit: ₹{req.securityDeposit}
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
                            <span>{actionProcessingId === req._id ? 'Updating...' : 'Reject Request'}</span>
                          </button>
                          <button
                            onClick={() => handleApprove(req._id)}
                            disabled={actionProcessingId === req._id}
                            className="btn btn-primary btn-sm"
                          >
                            <CheckCircle2 size={14} />
                            <span>{actionProcessingId === req._id ? 'Updating...' : 'Approve Request'}</span>
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            paddingTop: 10,
                            borderTop: '1px solid var(--border-light)',
                            textAlign: 'right',
                            fontSize: 13,
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Request has been marked as <strong style={{ textTransform: 'capitalize' }}>{req.status}</strong>
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
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>My Rented Gear & Bookings</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                  Equipment you have requested from other community owners
                </p>
              </div>

              <div
                className="card"
                style={{
                  padding: 20,
                  marginBottom: 20,
                  backgroundColor: 'var(--bg-section)',
                }}
              >
                <h4 style={{ fontSize: 14, marginBottom: 12 }}>Booking Summary</h4>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Total Requests Sent</span>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.totalMyRentalRequests || 0}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Approved by Owners</span>
                    <div style={{ fontSize: 24, fontWeight: 800 }} className="text-success">
                      {stats?.myApprovedRentals || 0}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Pending Requests</span>
                    <div style={{ fontSize: 24, fontWeight: 800 }} style={{ color: 'var(--warning)' }}>
                      {stats?.myPendingRentals || 0}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card empty-state-box">
                <div className="empty-icon-circle">
                  <ShoppingBag size={28} />
                </div>
                <h3>Explore & Rent More Gear</h3>
                <p>Need power tools, cameras, laptops, or camping equipment? Rent instead of buying!</p>
                <Link to="/items" className="btn btn-primary">
                  Browse Available Items
                </Link>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: 640 }}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>My Account Profile</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                  Verified identity details and credentials
                </p>
              </div>

              {profileLoading ? (
                <div className="spinner"></div>
              ) : profile ? (
                <div className="card" style={{ padding: 24 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      borderBottom: '1px solid var(--border)',
                      paddingBottom: 20,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        fontWeight: 700,
                      }}
                    >
                      {profile.name ? profile.name[0].toUpperCase() : 'U'}
                    </div>

                    <div>
                      <h3 style={{ fontSize: 18, margin: '0 0 4px' }}>{profile.name}</h3>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span
                          className={`badge ${
                            profile.isEmailVerified ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          <ShieldCheck size={12} />
                          {profile.isEmailVerified ? 'Email Verified' : 'Unverified Email'}
                        </span>
                        <span className="badge badge-secondary">
                          Status: {profile.accountStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 10 }}>
                      <span className="text-muted">Email:</span>
                      <strong>{profile.email}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 10 }}>
                      <span className="text-muted">Phone:</span>
                      <strong>{profile.phone}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 10 }}>
                      <span className="text-muted">Location:</span>
                      <strong>
                        {profile.address?.city
                          ? `${profile.address.city}, ${profile.address.state || ''}`
                          : 'India'}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">Member Since:</span>
                      <strong>{new Date(profile.createdAt).toLocaleDateString()}</strong>
                    </div>
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
