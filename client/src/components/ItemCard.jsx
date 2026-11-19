import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, ArrowRight, Package, Heart, UserRound } from 'lucide-react';
import getItemImageUrl from '../utils/itemImageUrl';
import { useWishlist } from '../context/WishlistContext';

/**
 * ItemCard Component (Amazon + OLX Standard)
 * Displays a single rental marketplace product with:
 * - High quality product image with fallback
 * - Floating Wishlist Heart button with live local state
 * - Availability badge & Condition tag
 * - Listing owner information
 * - Category, Brand, City Location
 * - Structured pricing: Price/day, Price/week, Security deposit
 * - View Details button linking to /items/:id
 */
const ItemCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();

  if (!item) return null;

  const wishlisted = isWishlisted(item._id);

  const formatCondition = (cond) => {
    switch (cond) {
      case 'new':
        return 'Brand New';
      case 'like_new':
        return 'Like New';
      case 'good':
        return 'Good Condition';
      case 'fair':
        return 'Fair Condition';
      default:
        return cond || 'Good';
    }
  };

  const getImageUrl = () => {
    if (imageError || !item.images?.length) return '';

    const first = item.images[0];
    if (typeof first === 'string' && (first.includes('example.com') || first.trim() === '')) return '';

    return getItemImageUrl(first) || '';
  };

  const imageUrl = getImageUrl();
  const rawCat = item.categoryId?.name || 'Equipment';
  const categoryName = rawCat.replace(/electroinces/i, 'Electronics');
  const isAvailable = item.availabilityStatus === 'available';
  const isOwnerVerified = item.ownerId?.isEmailVerified === true;
  const ownerName = item.ownerId?.name || 'Community member';

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item);
  };

  return (
    <div className="item-card">
      {/* 1. Media Area with Image & Badges */}
      <div className="item-card-media">
        <Link to={`/items/${item._id}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.name}
              className="item-card-img"
              onError={() => setImageError(true)}
              onLoad={(event) => {
                if (event.currentTarget.naturalWidth <= 1) setImageError(true);
              }}
              loading="lazy"
            />
          ) : (
            <div className="item-card-placeholder">
              <Package size={38} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>{categoryName}</span>
            </div>
          )}
        </Link>

        {/* Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`card-wishlist-btn ${wishlisted ? 'active' : ''}`}
          title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={wishlisted}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Availability Badge */}
        <div className="item-card-badge-top">
          <span className={`badge ${isAvailable ? 'badge-success' : 'badge-warning'}`}>
            ● {isAvailable ? 'Available' : 'Paused'}
          </span>
        </div>

        {/* Condition Badge */}
        <div className="item-card-badge-bottom">
          <span className="badge badge-secondary" style={{ backdropFilter: 'blur(4px)', background: 'rgba(255,255,255,0.92)' }}>
            {formatCondition(item.condition)}
          </span>
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="item-card-body">
        {/* Brand & Location */}
        <div className="item-meta-row">
          <span className="item-brand-tag">{item.brand || categoryName}</span>
          {item.location?.city && (
            <span className="item-location-label" title={`${item.location.city}, ${item.location.state || ''}`}>
              <MapPin size={12} className="text-red" />
              <span>{item.location.city}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="item-title" title={item.name}>
          <Link to={`/items/${item._id}`}>{item.name}</Link>
        </h3>

        {/* Owner information */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12, color: isOwnerVerified ? 'var(--success)' : 'var(--text-muted)', minWidth: 0 }}>
          {isOwnerVerified ? <ShieldCheck size={14} /> : <UserRound size={14} />}
          <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isOwnerVerified ? 'Email-verified owner' : `Listed by ${ownerName}`}
          </span>
        </div>

        {/* Deposit Tag */}
        {item.securityDeposit > 0 ? (
          <div className="deposit-pill-row">
            <span>Security Deposit:</span>
            <strong style={{ color: 'var(--text-primary)' }}>₹{item.securityDeposit}</strong>
          </div>
        ) : (
          <div className="deposit-pill-row">
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Zero Security Deposit</span>
          </div>
        )}

        {/* Pricing Box */}
        <div className="item-pricing-box">
          <div className="price-main">
            <span className="amount">₹{item.pricePerDay}</span>
            <span className="period">/ day</span>
          </div>

          {item.pricePerWeek ? (
            <div className="price-weekly">
              <span>₹{item.pricePerWeek}</span> / wk
            </div>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Daily Rental</span>
          )}
        </div>

        {/* View Details CTA */}
        <Link to={`/items/${item._id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
          <span>Rent Now</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
