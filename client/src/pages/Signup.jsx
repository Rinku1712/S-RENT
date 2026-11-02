import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
// import { UserPlus, User, Mail, Phone, Lock, MapPin, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { UserPlus, User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * User Registration Page
 * URL: /signup
 * Features:
 * - Professional registration form matching backend User schema
 * - Full Name, Email, Phone, City, State, Password, Confirm Password
 * - Direct OTP verification redirection
 * - Zero emojis, 100% Lucide React icons
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
      <div className="auth-card" style={{ maxWidth: 480 }}>
        {/* Brand Header */}
        <div className="auth-header">
          <div className="brand-icon-box" style={{ margin: '0 auto 12px' }}>
            <span>S</span>
          </div>
          <h2>Create Your Account</h2>
          <p>Join the SRENT community to rent gear and earn passive income</p>
        </div>

        {error && (
          <div className="alert alert-danger">
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
                minLength="2"
                maxLength="80"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: 36 }}
                autoFocus
              />
              <User
                size={16}
                className="text-muted"
                style={{ position: 'absolute', left: 12, top: 13 }}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                required
                placeholder="e.g. rahul@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: 36 }}
              />
              <Mail
                size={16}
                className="text-muted"
                style={{ position: 'absolute', left: 12, top: 13 }}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                name="phone"
                required
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: 36 }}
              />
              <Phone
                size={16}
                className="text-muted"
                style={{ position: 'absolute', left: 12, top: 13 }}
              />
            </div>
          </div>

          {/* Location Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                placeholder="City (e.g. Sonipat)"
                value={formData.city}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                placeholder="State (e.g. Haryana)"
                value={formData.state}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password * (minimum 8 characters)</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength="8"
                placeholder="Create strong password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: 36 }}
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

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: 36 }}
              />
              <Lock
                size={16}
                className="text-muted"
                style={{ position: 'absolute', left: 12, top: 13 }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
          >
            <UserPlus size={16} />
            <span>{loading ? 'Sending OTP...' : 'Sign Up & Verify Email'}</span>
          </button>
        </form>

        <div className="auth-footer">
          <p style={{ fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" className="text-red" style={{ fontWeight: 600 }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
