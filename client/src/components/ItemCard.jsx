import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shield, ArrowRight, Package } from 'lucide-react';
import getItemImageUrl from '../utils/itemImageUrl';

/**
 * ItemCard Component
 * Displays a single rental marketplace item with:
 * - Product image (or clean fallback icon placeholder)
 * - Availability & Condition badges
 * - Name, Brand, Location (with MapPin)
 * - Prominent daily rental price in bold red
 * - Weekly price and security deposit if present
 * - "View Details" button linking to /items/:id
 * - 100% Lucide React icons, zero emojis
 */
const ItemCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  // Format condition label
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

  // Determine image URL
  const getImageUrl = () => {
    if (imageError || !item.images || item.images.length === 0) {
      return null;
    }
    return getItemImageUrl(item.images[0]);
  };

  const imageUrl = getImageUrl();
  const categoryName = item.categoryId?.name || 'General';
  const isAvailable = item.availabilityStatus === 'available';

  return (
    <div className="item-card">
      {/* 1. Media Area */}
      <div className="item-card-media">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="item-card-img"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="item-card-placeholder">
            <Package size={36} className="text-muted" />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{categoryName}</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="item-card-badge-top">
          <span className={`badge ${isAvailable ? 'badge-success' : 'badge-warning'}`}>
            ● {isAvailable ? 'Available' : 'Paused'}
          </span>
        </div>

        {/* Condition Badge */}
        <div className="item-card-badge-right">
          <span className="badge badge-secondary">
            {formatCondition(item.condition)}
          </span>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="item-card-body">
        {/* Brand & Location metadata */}
        <div className="item-meta-row">
          <span className="item-brand-tag">{item.brand || 'General'}</span>
          {item.location?.city && (
            <span className="item-location-label">
              <MapPin size={13} className="text-red" />
              {item.location.city}
            </span>
          )}
        </div>

        {/* Item Title */}
        <h3 className="item-title" title={item.name}>
          <Link to={`/items/${item._id}`}>{item.name}</Link>
        </h3>

        {/* Category tag & brief snippet */}
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.4 }}>
          {item.description ? item.description.slice(0, 75) + (item.description.length > 75 ? '...' : '') : ''}
        </p>

        {/* Security deposit highlight if configured */}
        {item.securityDeposit > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
            <Shield size={13} className="text-red" />
            <span>Deposit: ₹{item.securityDeposit}</span>
          </div>
        )}

        {/* 3. Pricing Row & Actions */}
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
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Daily Rate</span>
          )}
        </div>

        <Link to={`/items/${item._id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
