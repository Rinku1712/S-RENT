import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createItem } from '../services/itemService';
import { getCategories } from '../services/categoryService';
import {
  isImageWithinSizeLimit,
  isSupportedImage,
  supportedImageFormats,
} from '../utils/imageValidation';
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Upload,
  X,
  Camera,
  ShieldCheck,
  TrendingUp,
  ImagePlus,
} from 'lucide-react';

/**
 * Premium S-RENT Listing Creation Page (OLX / Amazon Standard)
 * Features:
 * - Full responsive layout for mobile, tablet, and desktop
 * - Modern Drag-and-Drop file uploader + mobile camera/gallery picker via Multer
 * - Interactive multi-image previews with Primary Cover Photo indicator and remove button
 * - Security deposit guidelines & renter protection information
 * - Responsive Owner Earnings Estimator & photography checklist sidebar
 */
const CreateItem = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

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

  const processSelectedFiles = (selectedFiles) => {
    const files = Array.from(selectedFiles || []);
    if (!files.length) return;

    if (imageFiles.length + files.length > 10) {
      setError('You can upload a maximum of 10 images.');
      return;
    }

    for (const f of files) {
      if (!isSupportedImage(f)) {
        setError(`Supported image formats: ${supportedImageFormats}.`);
        return;
      }
      if (!isImageWithinSizeLimit(f)) {
        setError('Each image must be 5 MB or smaller.');
        return;
      }
    }

    setError(null);
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    // Generate local previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleImageFilesChange = (e) => {
    processSelectedFiles(e.target.files);
    // Reset file input value so selecting the same file again triggers change
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      processSelectedFiles(e.dataTransfer.files);
    }
  };

  const removeImageAt = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
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
      setError('Please provide a detailed description of your rental equipment.');
      return;
    }

    if (!formData.categoryId) {
      setError('Please select a valid equipment category.');
      return;
    }

    const priceDay = Number(formData.pricePerDay);
    if (isNaN(priceDay) || priceDay <= 0) {
      setError('Daily rental rate must be greater than 0.');
      return;
    }

    const deposit = Number(formData.securityDeposit);
    if (isNaN(deposit) || deposit < 0) {
      setError('Security deposit must be 0 or more.');
      return;
    }

    if (!formData.city.trim() || !formData.state.trim()) {
      setError('City and State are required for renters to locate your equipment.');
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('description', formData.description.trim());
      payload.append('brand', formData.brand.trim() || 'General');
      payload.append('categoryId', formData.categoryId);
      payload.append('condition', formData.condition);
      payload.append('pricePerDay', String(priceDay));
      if (formData.pricePerWeek) {
        payload.append('pricePerWeek', String(Number(formData.pricePerWeek)));
      }
      payload.append('securityDeposit', String(deposit));
      payload.append(
        'location',
        JSON.stringify({
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim() || 'India',
          postalCode: formData.postalCode.trim() || '',
        })
      );
      payload.append(
        'imageUrls',
        JSON.stringify(formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [])
      );
      imageFiles.forEach((file) => payload.append('images', file));

      const result = await createItem(payload);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setError(result.message || 'Failed to list item.');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while publishing listing.');
    } finally {
      setLoading(false);
    }
  };

  const dailyNum = Number(formData.pricePerDay) || 0;
  const monthlyEstimate = dailyNum * 8; // approx 8 days rented per month

  return (
    <div className="container create-item-page">
      {/* Top Header Breadcrumb & Title */}
      <div style={{ marginBottom: 28 }}>
        <Link
          to="/dashboard"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 8,
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '2px 0 6px' }}>
          List an Item for Rent
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.92rem' }}>
          Share your cameras, power tools, electronics, or outdoor gear with verified neighbors and earn consistent passive income
        </p>
      </div>

      <div className="create-item-layout">
        {/* LEFT COLUMN: Main Multi-Section Form */}
        <div>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 20 }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
              <CheckCircle2 size={16} />
              <span>Listing created successfully! Redirecting to your dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Card 1: General Details */}
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 18px', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                1. General Equipment Information
              </h3>

              <div className="form-group">
                <label className="form-label">
                  Item Title * <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Clear and specific)</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  minLength="3"
                  maxLength="120"
                  placeholder="e.g. Sony Alpha A7 III Full Frame Camera Body"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-row-2">
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
                    placeholder="e.g. Sony, Apple, DeWalt, Canon"
                    value={formData.brand}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Physical Condition *</label>
                <select
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="new">Brand New (Unopened / Never Used)</option>
                  <option value="like_new">Like New (Barely used, zero scratches or cosmetic marks)</option>
                  <option value="good">Good (Fully functional, normal minor wear)</option>
                  <option value="fair">Fair (Working properly, visible cosmetic scuffs)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Detailed Description *</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  placeholder="Describe what items & cables are included, lens mounts, working state, special handling instructions, and pickup guidelines..."
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Card 2: Photos & Media (Multer Drag & Drop Uploader) */}
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                    2. Photos & Media
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Upload clear photos from your camera or gallery
                  </span>
                </div>
                <span className="badge badge-neutral">
                  {imagePreviews.length} / 10 photos
                </span>
              </div>

              {/* Upload Dropzone */}
              <div
                className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  id="imageFileInput"
                  name="images"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  onChange={handleImageFilesChange}
                  style={{ display: 'none' }}
                />
                <div className="upload-icon-circle">
                  <Upload size={22} />
                </div>
                <strong className="upload-dropzone-title">
                  {isDragging ? 'Drop images here now' : 'Click or drag & drop photos here'}
                </strong>
                <span className="upload-dropzone-hint">
                  JPG, PNG, WEBP up to 5 MB each • First photo serves as primary listing cover
                </span>
              </div>

              {/* Image Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="image-preview-grid">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="image-preview-box">
                      <img src={src} alt={`Preview ${idx + 1}`} />
                      {idx === 0 && (
                        <div className="preview-cover-badge">
                          Cover Photo
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImageAt(idx);
                        }}
                        className="preview-remove-btn"
                        title="Remove photo"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Add more button chip inside the grid if under 10 */}
                  {imagePreviews.length < 10 && (
                    <div
                      className="upload-add-more-card"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <ImagePlus size={18} />
                      <span>+ Add More</span>
                    </div>
                  )}
                </div>
              )}

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Or Provide an Image URL (Optional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://images.unsplash.com/photo-example.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Card 3: Rental Rates & Security Deposit */}
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 18px', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                3. Rental Pricing & Security Deposit
              </h3>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Rent Per Day (₹) *</label>
                  <input
                    type="number"
                    name="pricePerDay"
                    required
                    min="1"
                    placeholder="e.g. 500"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Weekly Rent (₹, Optional)</label>
                  <input
                    type="number"
                    name="pricePerWeek"
                    min="1"
                    placeholder="e.g. 3000"
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
                    placeholder="e.g. 2000"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: 12,
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <ShieldCheck size={18} className="text-red" style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  The security deposit protects your equipment against potential damage or delay. It is retained until the gear is returned and verified in person.
                </span>
              </div>
            </div>

            {/* Card 4: Pickup Location */}
            <div className="card" style={{ padding: 24, marginBottom: 28 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 18px', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                4. Handover & Pickup Location
              </h3>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Karnal, Delhi, Mumbai"
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
            <div className="form-actions-bar">
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
                <PlusCircle size={18} />
                <span>{loading ? 'Publishing Listing...' : 'Publish Rental Listing'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Owner Tips & Potential Earnings Calculator */}
        <div className="create-item-sidebar">
          {/* Earnings Estimator */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <TrendingUp size={20} className="text-red" />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                Estimated Rental Income
              </h4>
            </div>

            <div
              style={{
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
                marginBottom: 14,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Projected Monthly Return
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '4px 0' }}>
                ₹{monthlyEstimate > 0 ? monthlyEstimate.toLocaleString('en-IN') : '0'}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Based on an average of 8 rental days per month
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Gear like cameras, drones, and professional power tools regularly achieve 60-70% utilization during weekends!
            </p>
          </div>

          {/* Listing Quality Checklist */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Camera size={20} className="text-red" />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                Tips for 3x More Bookings
              </h4>
            </div>

            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li><strong>Take real photos</strong> in bright daylight showing actual wear or accessories.</li>
              <li><strong>Mention accessories</strong> like batteries, chargers, bags, and cables included.</li>
              <li><strong>Set competitive rates:</strong> Compare with similar items in your city catalog.</li>
              <li><strong>Fast responses:</strong> Owners who approve within 1 hour receive 4x repeat bookings.</li>
            </ul>
          </div>

          {/* S-RENT Protection Shield */}
          <div
            style={{
              padding: 20,
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              gap: 12,
            }}
          >
            <ShieldCheck size={28} className="text-success" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)', display: 'block' }}>
                Protected by S-RENT
              </strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Every renter must verify their email and phone. You have 100% discretion to accept or reject any booking request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
