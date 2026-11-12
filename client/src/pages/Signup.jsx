import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

/**
 * Premium S-RENT User Registration Page
 * URL: /signup
 */
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: {
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: 'India',
        },
      };

      await signup(payload);
      // Navigate to OTP verification page with user email
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email.trim())}`);
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        {/* Brand Header */}
        <div className="auth-header">
          <div className="brand-icon-box" style={{ margin: '0 auto 12px' }}>
            <span>S</span>
          </div>
          <h2>Join S-RENT</h2>
          <p>Create your verified peer-to-peer rental account</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 20 }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: 38 }}
                autoFocus
              />
              <User
                size={16}
                className="text-muted"
                style={{ position: 'absolute', left: 12, top: 13 }}
              />
            </div>
          </div>

          {/* Email & Phone Row */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                />
                <Mail
                  size={16}
                  className="text-muted"
                  style={{ position: 'absolute', left: 12, top: 13 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                />
                <Phone
                  size={16}
                  className="text-muted"
                  style={{ position: 'absolute', left: 12, top: 13 }}
                />
              </div>
            </div>
          </div>

          {/* City & State Row */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">City *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Karnal"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                />
                <MapPin
                  size={16}
                  className="text-muted"
                  style={{ position: 'absolute', left: 12, top: 13 }}
                />
              </div>
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
          </div>

          {/* Password & Confirm Password */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength="8"
                  placeholder="Min 8 chars"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                />
                <Lock
                  size={16}
                  className="text-muted"
                  style={{ position: 'absolute', left: 12, top: 13 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  minLength="8"
                  placeholder="Re-type password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                />
                <Lock
                  size={16}
                  className="text-muted"
                  style={{ position: 'absolute', left: 12, top: 13 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
          >
            <UserPlus size={16} />
            <span>{loading ? 'Creating Account...' : 'Create Account & Verify OTP'}</span>
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="auth-footer">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" className="text-red" style={{ fontWeight: 700 }}>
              Sign in
            </Link>
          </p>

          <div
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            <ShieldCheck size={14} className="text-success" />
            <span>Instant email verification for secure peer-to-peer trust</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
