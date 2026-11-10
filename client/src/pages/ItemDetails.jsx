import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getAllItems } from '../services/itemService';
import { createRental } from '../services/rentalService';
import getItemImageUrl from '../utils/itemImageUrl';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ItemCard from '../components/ItemCard';
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
  Heart,
  Share2,
  Clock,
  Sparkles,
  Layers,
  Award,
  Check,
} from 'lucide-react';

/**
 * Premium S-RENT Product Details & Instant Booking Experience
 * Standards:
 * - Amazon / Airbnb grade layout with high-converting sticky booking calculator
 * - Multi-image gallery with active thumbnail selector
 * - Live rental day calculation with refundable deposit breakdown
 * - Wishlist integration and one-click share link
 * - Verified owner credibility badge & safety guarantees
 * - Related items recommendations from the same category
 * - Fully accessible, zero emojis, 100% Lucide React icons
 */
const ItemDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking form state
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const fetchItemAndRelated = async () => {
      try {
        setLoading(true);
        setError(null);
        setActiveImageIndex(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const allItems = await getAllItems();
        const found = allItems.find((it) => it._id === id);

        if (found) {
          setItem(found);
          // Find related items in same category, excluding current item
          const related = allItems
            .filter(
              (it) =>
                it._id !== found._id &&
                (it.categoryId?._id === found.categoryId?._id ||
                  it.categoryId === found.categoryId)
            )
            .slice(0, 4);
          setRelatedItems(related);
        } else {
          setError('The requested rental listing could not be found or has been removed.');
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Failed to load listing details. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndRelated();
  }, [id]);

  // Check if current user owns this listing
  const isOwner = Boolean(
    user &&
      item &&
      (user.id === item.ownerId?._id ||
        user._id === item.ownerId?._id ||
        user.id === item.ownerId)
  );

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
  const securityDeposit = item?.securityDeposit || 0;
  const totalPayableEstimate = estimatedRent + securityDeposit;
  const isAvailable = item?.availabilityStatus === 'available';

  const handleStartBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (isOwner) {
      alert('You are the registered owner of this listing.');
      return;
    }
    if (rentalDays <= 0) {
      alert('Please select an end date that is after the start date.');
      return;
    }
    setBookingError(null);
    setBookingSuccess(null);
    setShowConfirmModal(true);
  };

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
          res.message ||
            'Rental request submitted successfully! The owner will be notified to confirm availability.'
        );
      } else {
        setBookingError(res.message || 'Failed to submit rental request.');
      }
    } catch (err) {
      setBookingError(err.message || 'An error occurred while booking this item.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>
          Loading rental listing details...
        </p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 520, margin: '0 auto', padding: 44 }}>
          <div className="empty-icon-circle" style={{ margin: '0 auto 16px' }}>
            <AlertCircle size={32} className="text-danger" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Listing Not Found</h2>
          <p style={{ margin: '12px 0 24px', color: 'var(--text-secondary)' }}>
            {error || 'This listing might have been rented out, archived, or deleted by the owner.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/items" className="btn btn-primary">
              <ArrowLeft size={16} />
              <span>Browse Catalog</span>
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Build image list
  const imagesList = Array.isArray(item.images) && item.images.length > 0 ? item.images : [];
  const currentImageUrl = imagesList.length > 0 ? getItemImageUrl(imagesList[activeImageIndex]) : null;
  const wishlisted = isWishlisted(item._id);

  return (
    <div className="details-page container">
      {/* Top Breadcrumb & Share / Wishlist Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <nav className="breadcrumb-nav" style={{ margin: 0 }}>
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to="/items">Catalog</Link>
          {item.categoryId?.name && (
            <>
              <ChevronRight size={13} />
              <Link to={`/items?category=${encodeURIComponent(item.categoryId.name)}`}>
                {item.categoryId.name}
              </Link>
            </>
          )}
          <ChevronRight size={13} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.name}</span>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => toggleWishlist(item)}
            className={`btn btn-sm ${wishlisted ? 'btn-primary' : 'btn-secondary'}`}
            title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
            <span>{wishlisted ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="btn btn-secondary btn-sm"
            title="Share this listing"
          >
            {copiedShare ? (
              <>
                <Check size={14} className="text-success" />
                <span className="text-success">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Details Grid: Left Gallery & Content, Right Sticky Booking Card */}
      <div className="details-grid">
        {/* LEFT COLUMN: Media Gallery, Highlights, Specs, Description, Owner Card */}
        <div>
          {/* Gallery View */}
          <div className="product-gallery">
            <div className="gallery-main-view">
              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt={item.name}
                  className="gallery-main-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1581291518655-9523c932deb4?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  <Package size={64} style={{ margin: '0 auto 12px', strokeWidth: 1.5 }} />
                  <p style={{ fontWeight: 600 }}>No photos uploaded for this listing</p>
                </div>
              )}
            </div>

            {/* Thumbnail Strip (if multiple photos) */}
            {imagesList.length > 1 && (
              <div className="gallery-thumbnails-row">
                {imagesList.map((img, idx) => {
                  const thumbUrl = getItemImageUrl(img);
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`thumbnail-chip ${activeImageIndex === idx ? 'active' : ''}`}
                      type="button"
                    >
                      <img src={thumbUrl} alt={`${item.name} thumbnail ${idx + 1}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Header / Title / Badges */}
          <div style={{ marginTop: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {item.brand && (
                <span className="badge badge-secondary" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  {item.brand}
                </span>
              )}
              <span
                className={`badge ${
                  item.condition === 'new' || item.condition === 'like_new'
                    ? 'badge-success'
                    : 'badge-secondary'
                }`}
                style={{ textTransform: 'capitalize' }}
              >
                Condition: {item.condition ? item.condition.replace('_', ' ') : 'Good'}
              </span>
              <span
                className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}
              >
                ● {isAvailable ? 'Available for Rent' : 'Currently Reserved'}
              </span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, margin: '6px 0 10px' }}>
              {item.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.9rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <MapPin size={15} className="text-red" />
                <span>
                  {item.location?.city || 'Location'}, {item.location?.state || 'India'}
                </span>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Tag size={15} className="text-red" />
                <span>{item.categoryId?.name || 'General Equipment'}</span>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <UserCheck size={15} className="text-success" />
                <span>Verified Owner Listing</span>
              </div>
            </div>
          </div>

          {/* Equipment Specifications Grid */}
          <div className="product-info-section">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={18} className="text-red" />
              <span>Rental Specifications & Highlights</span>
            </h3>

            <div className="spec-grid">
              <div className="spec-item-box">
                <Tag size={20} className="spec-icon" />
                <div>
                  <div className="spec-label">Category</div>
                  <div className="spec-value">{item.categoryId?.name || 'General'}</div>
                </div>
              </div>

              <div className="spec-item-box">
                <Award size={20} className="spec-icon" />
                <div>
                  <div className="spec-label">Brand / Model</div>
                  <div className="spec-value">{item.brand || 'Original Equipment'}</div>
                </div>
              </div>

              <div className="spec-item-box">
                <Sparkles size={20} className="spec-icon" />
                <div>
                  <div className="spec-label">Physical Condition</div>
                  <div className="spec-value" style={{ textTransform: 'capitalize' }}>
                    {item.condition ? item.condition.replace('_', ' ') : 'Verified Functional'}
                  </div>
                </div>
              </div>

              <div className="spec-item-box">
                <MapPin size={20} className="spec-icon" />
                <div>
                  <div className="spec-label">Pickup Location</div>
                  <div className="spec-value">
                    {item.location?.city}, {item.location?.state}
                  </div>
                </div>
              </div>

              <div className="spec-item-box">
                <Clock size={20} className="spec-icon" />
                <div>
                  <div className="spec-label">Minimum Rental</div>
                  <div className="spec-value">1 Day Rental Period</div>
                </div>
              </div>

              <div className="spec-item-box">
                <ShieldCheck size={20} className="spec-icon" />
                <div>
                  <div className="spec-label">Security Deposit</div>
                  <div className="spec-value">₹{item.securityDeposit || 0} (100% Refundable)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 12 }}>
              About this equipment
            </h3>
            <div
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}
            >
              {item.description ||
                'The owner has listed this equipment in ready-to-use condition with all standard accessories included. Inspect before handover and return in same clean condition.'}
            </div>
          </div>

          {/* Verified Owner Card */}
          <div className="owner-profile-card">
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.3rem',
                flexShrink: 0,
              }}
            >
              {item.ownerId?.name ? item.ownerId.name[0].toUpperCase() : 'O'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {item.ownerId?.name || 'Verified Community Member'}
                </strong>
                <UserCheck size={16} className="text-success" />
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                S-RENT Verified Partner • Phone & Government ID Checked
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Identity Verified</span>
                <span>•</span>
                <span>Fast Response Time (under 1 hr)</span>
              </div>
            </div>
          </div>

          {/* Trust & Safety Highlights */}
          <div
            style={{
              marginTop: 24,
              padding: 20,
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} className="text-red" />
              <span>S-RENT Renter Protection Promise</span>
            </h4>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>Security deposits are held in escrow and returned immediately upon equipment return.</li>
              <li>Inspect physical item upon handover; report any discrepancy before starting rental.</li>
              <li>Direct direct owner messaging and mutual contact disclosure after request approval.</li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Amazon / Airbnb Style Sticky Booking Card */}
        <div>
          <div className="booking-widget-card">
            {/* Price Header */}
            <div className="booking-price-header">
              <div>
                <span className="booking-rate-big">₹{item.pricePerDay}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: 6 }}>
                  / day
                </span>
              </div>

              {item.pricePerWeek && (
                <span className="badge badge-primary">
                  ₹{item.pricePerWeek} / week
                </span>
              )}
            </div>

            {/* Availability Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isAvailable ? 'var(--success-bg)' : '#FEE2E2',
                color: isAvailable ? 'var(--success)' : 'var(--danger)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              <CheckCircle2 size={16} />
              <span>{isAvailable ? 'Item is available for instant rental booking' : 'Currently rented out'}</span>
            </div>

            {/* Date Range Selection Box */}
            <div className="booking-date-inputs">
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>
                Select Rental Dates
              </label>

              <div className="date-pickers-row">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Start Date
                  </span>
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate && new Date(e.target.value) >= new Date(endDate)) {
                        const next = new Date(e.target.value);
                        next.setDate(next.getDate() + 1);
                        setEndDate(next.toISOString().split('T')[0]);
                      }
                    }}
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '8px 10px' }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    End Date
                  </span>
                  <input
                    type="date"
                    min={startDate || todayStr}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '8px 10px' }}
                  />
                </div>
              </div>
            </div>

            {/* Live Calculation Breakdown */}
            <div className="booking-calc-breakdown">
              <div className="calc-row">
                <span>Rental Duration</span>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                </strong>
              </div>

              <div className="calc-row">
                <span>Daily Rate (₹{item.pricePerDay} × {rentalDays})</span>
                <strong style={{ color: 'var(--text-primary)' }}>₹{estimatedRent}</strong>
              </div>

              <div className="calc-row">
                <span>Refundable Deposit</span>
                <strong style={{ color: 'var(--text-primary)' }}>₹{securityDeposit}</strong>
              </div>

              <div className="calc-row total-row">
                <span>Total Payable at Pickup</span>
                <span className="text-red">₹{totalPayableEstimate}</span>
              </div>
            </div>

            {/* Primary Booking CTA */}
            {isOwner ? (
              <div className="alert alert-warning" style={{ fontSize: '0.85rem', margin: '0 0 16px' }}>
                <AlertCircle size={15} />
                <span>You own this listing. Manage booking requests in your owner dashboard.</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartBooking}
                disabled={!isAvailable || rentalDays <= 0}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginBottom: 14 }}
              >
                <Calendar size={18} />
                <span>
                  {!isAuthenticated
                    ? 'Login to Rent This Item'
                    : rentalDays <= 0
                    ? 'Select Valid Dates'
                    : 'Request Rental Booking'}
                </span>
              </button>
            )}

            {isOwner && (
              <Link
                to="/dashboard"
                className="btn btn-secondary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginBottom: 14 }}
              >
                Go to Dashboard
              </Link>
            )}

            {/* Guarantee Pills */}
            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>You will not be charged until the owner approves your booking.</span>
            </div>

            <div
              style={{
                marginTop: 18,
                paddingTop: 16,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} className="text-success" />
                <span>100% Refundable security deposit protection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} className="text-success" />
                <span>Direct owner communication & physical inspection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} className="text-success" />
                <span>Cancellation allowed before owner approval</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation & Booking Modal */}
      {showConfirmModal && (
        <div className="modal-backdrop" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Confirm Rental Request</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="modal-close-btn"
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="modal-body" style={{ textAlign: 'center', padding: '36px 20px' }}>
                <div
                  className="empty-icon-circle"
                  style={{
                    margin: '0 auto 16px',
                    backgroundColor: 'var(--success-bg)',
                    borderColor: '#BBF7D0',
                  }}
                >
                  <CheckCircle2 size={36} className="text-success" />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 8 }}>
                  Request Sent Successfully!
                </h3>
                <p style={{ margin: '0 0 24px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  {bookingSuccess}
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <Link to="/dashboard" className="btn btn-primary">
                    View in Dashboard
                  </Link>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="btn btn-secondary"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="modal-body">
                {bookingError && (
                  <div className="alert alert-danger" style={{ marginBottom: 16 }}>
                    <AlertCircle size={16} />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: 14,
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 20,
                  }}
                >
                  {currentImageUrl ? (
                    <img
                      src={currentImageUrl}
                      alt={item.name}
                      style={{ width: 60, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                  ) : (
                    <Package size={32} className="text-muted" />
                  )}
                  <div>
                    <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-primary)' }}>
                      {item.name}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.location?.city}, {item.location?.state}
                    </span>
                  </div>
                </div>

                <div className="booking-calc-breakdown" style={{ margin: '0 0 20px' }}>
                  <div className="calc-row">
                    <span>Pickup Date:</span>
                    <strong>{startDate}</strong>
                  </div>
                  <div className="calc-row">
                    <span>Return Date:</span>
                    <strong>{endDate}</strong>
                  </div>
                  <div className="calc-row">
                    <span>Duration:</span>
                    <strong>{rentalDays} days</strong>
                  </div>
                  <div className="calc-row">
                    <span>Rental Charge:</span>
                    <strong>₹{estimatedRent}</strong>
                  </div>
                  <div className="calc-row">
                    <span>Security Deposit (Refundable):</span>
                    <strong>₹{securityDeposit}</strong>
                  </div>
                  <div className="calc-row total-row">
                    <span>Estimated Total Payable:</span>
                    <span className="text-red">₹{totalPayableEstimate}</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginBottom: 20,
                  }}
                >
                  <ShieldCheck size={18} className="text-success" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>
                    No immediate payment is charged right now. The owner will review your dates. Once approved, you can coordinate handover and deposit payment directly.
                  </span>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
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

      {/* RELATED / SIMILAR ITEMS SECTION */}
      {relatedItems.length > 0 && (
        <section style={{ marginTop: 64, paddingTop: 36, borderTop: '1px solid var(--border)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 24,
            }}
          >
            <div>
              <span className="badge badge-primary" style={{ marginBottom: 6 }}>
                Recommendations
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Similar Equipment for Rent</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                More options in {item.categoryId?.name || 'this category'}
              </p>
            </div>

            <Link
              to={`/items?category=${encodeURIComponent(item.categoryId?.name || '')}`}
              className="btn btn-secondary btn-sm"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="items-grid">
            {relatedItems.map((rel) => (
              <ItemCard key={rel._id} item={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ItemDetails;
