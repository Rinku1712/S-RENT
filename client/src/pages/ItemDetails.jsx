import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getAllItems } from '../services/itemService';
import { createRental } from '../services/rentalService';
import { useAuth } from '../context/AuthContext';
import {
  ChevronRight,
  MapPin,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Package,
  UserCheck,
  ArrowLeft,
  X,
  CreditCard,
  Clock,
} from 'lucide-react';

/**
 * Product Details & Rental Booking Page
 * URL: /items/:id
 * Features:
 * - Product image & condition badges
 * - Equipment specifications table
 * - Daily & Weekly rental price hierarchy
 * - Refundable security deposit protection
 * - Live rental booking calculation (Duration, Rent, Deposit, Total)
 * - Protected booking action: Redirects unauthenticated users to /login
 *   preserving the return path
 * - Real API integration with createRental()
 * - Zero emojis, 100% Lucide React icons
 */
const ItemDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Modal & Form state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const allItems = await getAllItems();
        const found = allItems.find((it) => it._id === id);
        if (found) {
          setItem(found);
        } else {
          setError('The requested item could not be found or has been removed.');
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Failed to load item details. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Check if current logged-in user is the owner of this item
  const isOwner = Boolean(
    user &&
    item &&
    (user.id === item.ownerId?._id ||
      user._id === item.ownerId?._id ||
      user.id === item.ownerId)
  );

  const handleRentClick = () => {
    if (!isAuthenticated) {
      // Redirect to login preserving the return location
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (isOwner) {
      alert('You cannot rent your own item.');
      return;
    }

    setShowBookingModal(true);
    setBookingError(null);
    setBookingSuccess(null);
  };

  // Calculate rental duration in days
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = (e.getTime() - s.getTime()) / (1000 * 3600 * 24);
    return diff > 0 ? Math.ceil(diff) : 0;
  };

  const rentalDays = calculateDays();
  const estimatedRent = rentalDays * (item?.pricePerDay || 0);
  const totalPayableEstimate = estimatedRent + (item?.securityDeposit || 0);

  // Submit Rental Booking to backend POST /api/rentals
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(null);

    if (rentalDays <= 0) {
      setBookingError('Rental end date must be strictly after the start date.');
      return;
    }

    try {
      setBookingLoading(true);
      const res = await createRental({
        itemId: item._id,
        startDate,
        endDate,
      });

      if (res.success) {
        setBookingSuccess(
          res.message || 'Rental request submitted successfully! Awaiting owner confirmation.'
        );
      } else {
        setBookingError(res.message || 'Failed to submit rental request.');
      }
    } catch (err) {
      setBookingError(err.message || 'Failed to book item.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 500, margin: '0 auto', padding: 40 }}>
          <div className="empty-icon-circle" style={{ margin: '0 auto 16px' }}>
            <AlertCircle size={32} className="text-danger" />
          </div>
          <h2>Item Not Found</h2>
          <p style={{ margin: '12px 0 24px' }}>
            {error || 'This item is no longer available in the active catalog.'}
          </p>
          <Link to="/items" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Back to Browse Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
  const imageUrl = firstImage && firstImage.startsWith('http') ? firstImage : firstImage ? `/${firstImage}` : null;
  const isAvailable = item.availabilityStatus === 'available';

  return (
    <div className="item-details-page container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb-nav">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/items">Catalog</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.name}</span>
      </nav>

      <div className="details-grid">
        {/* Left Column: Media & Specs */}
        <div>
          {/* Main Photo Card */}
          <div className="details-image-card">
            {imageUrl ? (
              <img src={imageUrl} alt={item.name} className="details-main-img" />
            ) : (
              <div className="item-card-placeholder" style={{ height: 380 }}>
                <Package size={56} className="text-muted" />
                <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
              </div>
            )}
          </div>

          {/* Equipment Specifications Card */}
          <div className="card details-specs-card">
            <h3 style={{ fontSize: 17, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag size={17} className="text-red" />
              <span>Equipment Specifications</span>
            </h3>

            <table className="specs-table">
              <tbody>
                <tr>
                  <td>Category</td>
                  <td>{item.categoryId?.name || 'General'}</td>
                </tr>
                <tr>
                  <td>Brand</td>
                  <td>{item.brand || 'Unbranded'}</td>
                </tr>
                <tr>
                  <td>Condition</td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {item.condition ? item.condition.replace('_', ' ') : 'Good'}
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td className={isAvailable ? 'text-success' : 'text-danger'}>
                    ● {isAvailable ? 'Available for Rent' : 'Currently Paused'}
                  </td>
                </tr>
                <tr>
                  <td>Pickup Location</td>
                  <td>
                    {item.location?.city}, {item.location?.state}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Pricing, Overview & Booking Action */}
        <div>
          <div className="card booking-card">
            {/* Header / Brand & Title */}
            <div style={{ marginBottom: 16 }}>
              {item.brand && (
                <span className="badge badge-secondary" style={{ marginBottom: 8 }}>
                  {item.brand}
                </span>
              )}
              <h1 style={{ fontSize: 26, fontWeight: 800, margin: '4px 0 8px' }}>
                {item.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                <MapPin size={14} className="text-red" />
                <span>
                  {item.location?.city}, {item.location?.state}, {item.location?.country || 'India'}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="price-banner">
              <span className="price-large">₹{item.pricePerDay}</span>
              <span style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 600 }}>
                per day
              </span>
              {item.pricePerWeek && (
                <span className="badge badge-primary" style={{ marginLeft: 8 }}>
                  ₹{item.pricePerWeek} / week
                </span>
              )}
            </div>

            {/* Refundable Security Deposit Pill */}
            <div className="deposit-pill">
              <ShieldCheck size={22} className="text-red" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>
                  Refundable Security Deposit: ₹{item.securityDeposit || 0}
                </strong>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Held securely during your rental and refunded immediately upon safe return.
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div style={{ marginBottom: 24 }}>
              {isOwner ? (
                <div className="alert alert-warning" style={{ margin: 0 }}>
                  <AlertCircle size={16} />
                  <span>You are the owner of this listing. Manage requests in your dashboard.</span>
                </div>
              ) : (
                <button
                  onClick={handleRentClick}
                  disabled={!isAvailable}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Calendar size={18} />
                  <span>{isAuthenticated ? 'Rent This Item Now' : 'Login to Rent This Item'}</span>
                </button>
              )}
            </div>

            {/* Description */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>About this item</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {item.description || 'No detailed description provided by the owner.'}
              </p>
            </div>

            {/* Verified Owner Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-section)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {item.ownerId?.name ? item.ownerId.name[0].toUpperCase() : 'O'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <strong style={{ fontSize: 15, color: 'var(--text-primary)' }}>
                    {item.ownerId?.name || 'Community Member'}
                  </strong>
                  <UserCheck size={14} className="text-success" />
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Verified SRENT Owner • Phone & Identity Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-backdrop" onClick={() => setShowBookingModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book Rental: {item.name}</h3>
              <button onClick={() => setShowBookingModal(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="modal-body" style={{ textAlign: 'center', padding: '36px 20px' }}>
                <div className="empty-icon-circle" style={{ margin: '0 auto 16px', backgroundColor: 'var(--success-bg)', borderColor: '#BBF7D0' }}>
                  <CheckCircle2 size={32} className="text-success" />
                </div>
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>Rental Request Sent!</h3>
                <p style={{ margin: '0 0 24px', fontSize: 14 }}>
                  {bookingSuccess}
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <Link to="/dashboard" className="btn btn-primary">
                    View in Dashboard
                  </Link>
                  <button onClick={() => setShowBookingModal(false)} className="btn btn-secondary">
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="modal-body">
                {bookingError && (
                  <div className="alert alert-danger">
                    <AlertCircle size={16} />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Rental Start Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rental End Date</label>
                  <input
                    type="date"
                    required
                    min={startDate || new Date().toISOString().split('T')[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                {rentalDays > 0 && (
                  <div className="booking-summary">
                    <div className="summary-row">
                      <span className="text-muted">Rental Duration:</span>
                      <strong>{rentalDays} {rentalDays === 1 ? 'day' : 'days'}</strong>
                    </div>
                    <div className="summary-row">
                      <span className="text-muted">Daily Rate ({rentalDays} × ₹{item.pricePerDay}):</span>
                      <strong>₹{estimatedRent}</strong>
                    </div>
                    <div className="summary-row">
                      <span className="text-muted">Refundable Security Deposit:</span>
                      <strong>₹{item.securityDeposit || 0}</strong>
                    </div>
                    <div className="summary-row summary-total">
                      <span>Total Estimated Payable:</span>
                      <span>₹{totalPayableEstimate}</span>
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading || rentalDays <= 0}
                    className="btn btn-primary"
                  >
                    {bookingLoading ? 'Sending Request...' : 'Confirm Rental Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
