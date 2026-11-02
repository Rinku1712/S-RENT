import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createItem } from '../services/itemService';
import { getCategories } from '../services/categoryService';
import {
  PlusCircle,
  Package,
  MapPin,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Info,
} from 'lucide-react';

/**
 * List Item / Create Listing Page
 * URL: /create-item
 * Features:
 * - Match backend Item schema and Joi validation
 * - Dynamic category selection
 * - Daily & Weekly rental rates + Refundable deposit
 * - Pickup location (City, State, Postal Code)
 * - Zero emojis, 100% Lucide React icons
 */
const CreateItem = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    categoryId: '',
    condition: 'good',
    pricePerDay: '',
    pricePerWeek: '',
    securityDeposit: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch active categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await getCategories();
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
          setFormData((prev) => ({ ...prev, categoryId: res.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Unable to load categories. Please check connection.');
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setError('Item title must be at least 3 characters.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide a descriptive explanation of your equipment.');
      return;
    }

    if (!formData.categoryId) {
      setError('Please select a valid category.');
      return;
    }

    const priceDay = Number(formData.pricePerDay);
    if (isNaN(priceDay) || priceDay <= 0) {
      setError('Daily rental price must be greater than 0.');
      return;
    }

    const deposit = Number(formData.securityDeposit);
    if (isNaN(deposit) || deposit < 0) {
      setError('Security deposit must be 0 or more.');
      return;
    }

    if (!formData.city.trim() || !formData.state.trim()) {
      setError('City and State are required for renters to locate your item.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        brand: formData.brand.trim() || 'General',
        categoryId: formData.categoryId,
        condition: formData.condition,
        pricePerDay: priceDay,
        pricePerWeek: formData.pricePerWeek ? Number(formData.pricePerWeek) : undefined,
        securityDeposit: deposit,
        location: {
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim() || 'India',
          postalCode: formData.postalCode.trim() || '',
        },
        images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [],
      };

      const result = await createItem(payload);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(result.message || 'Failed to list item.');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while saving listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '36px 20px', maxWidth: 760 }}>
      {/* Top Header */}
      <div style={{ marginBottom: 24 }}>
        <Link
          to="/dashboard"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 6,
          }}
        >
          <ArrowLeft size={13} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '2px 0' }}>
          List an Item for Rent
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14 }}>
          Share your tools, cameras, laptops, or gear with nearby verified renters and earn monthly passive income
        </p>
      </div>

      <div className="card" style={{ padding: 32 }}>
        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={16} />
            <span>Item listed successfully! Redirecting to your dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Item Details */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
              1. General Information
            </h3>

            <div className="form-group">
              <label className="form-label">Item Title *</label>
              <input
                type="text"
                name="name"
                required
                minLength="3"
                maxLength="120"
                placeholder="e.g. Sony A7 III Mirrorless Camera (Body Only)"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="form-select"
                  disabled={loadingCategories}
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Brand / Manufacturer</label>
                <input
                  type="text"
                  name="brand"
                  placeholder="e.g. Sony, Apple, Bosch"
                  value={formData.brand}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                name="description"
                required
                rows="4"
                placeholder="Describe what's included in the rental, accessories, working condition, and pickup guidelines..."
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Item Condition *</label>
                <select
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="new">Brand New (Unused / In Box)</option>
                  <option value="like_new">Like New (Barely used, pristine)</option>
                  <option value="good">Good (Fully functional, normal wear)</option>
                  <option value="fair">Fair (Usable with cosmetic marks)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://example.com/gear-photo.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Deposit */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
              2. Rental Pricing & Security Deposit
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Rent Per Day (₹) *</label>
                <input
                  type="number"
                  name="pricePerDay"
                  required
                  min="1"
                  placeholder="e.g. 250"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rent Per Week (₹, Optional)</label>
                <input
                  type="number"
                  name="pricePerWeek"
                  min="1"
                  placeholder="e.g. 1400"
                  value={formData.pricePerWeek}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Security Deposit (₹) *</label>
                <input
                  type="number"
                  name="securityDeposit"
                  required
                  min="0"
                  placeholder="e.g. 1000"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <Info size={14} className="text-red" />
              <span>Security deposits protect your equipment and are returned to renters after successful return inspection.</span>
            </div>
          </div>

          {/* Section 3: Location */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
              3. Pickup Location
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Karnal"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  placeholder="e.g. Haryana"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="e.g. 132001"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
            >
              <PlusCircle size={16} />
              <span>{loading ? 'Submitting...' : 'Publish Rental Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;
