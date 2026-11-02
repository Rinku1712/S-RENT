import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Shield,
} from 'lucide-react';

/**
 * User Login Page
 * URL: /login
 * Features:
 * - Red and Pure White startup authentication card
 * - Email and Password inputs with show/hide toggle
 * - Redirects to intended page (e.g. /items/:id) or /dashboard
 * - Zero emojis, 100% Lucide React icons
 */
const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState(location.state?.verifiedEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await login({ email: email.trim(), password });

      if (res.user && res.user.token) {
        loginUser(res.user.token, res.user);

        // Redirect back to intended page (e.g. from /items/:id) or to /dashboard
        const destination = location.state?.from || '/dashboard';
        navigate(destination, { replace: true });
      } else {
        setError('Login succeeded but session token was missing.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="brand-icon-box" style={{ margin: '0 auto 12px' }}>
            <span>S</span>
          </div>
          <h2>Welcome to SRENT</h2>
          <p>Login to manage your rentals and listings</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div>
              <span>{error}</span>
              {error.toLowerCase().includes('verif') && (
                <div style={{ marginTop: 8 }}>
                  <Link
                    to={`/verify-otp?email=${encodeURIComponent(email)}`}
                    className="btn btn-outline btn-sm"
                  >
                    Verify Email with OTP &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 36 }}
                autoFocus
              />
              <Mail
                size={16}
                className="text-muted"
                style={{ position: 'absolute', left: 12, top: 13 }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
          >
            <LogIn size={16} />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="auth-footer">
          <p style={{ fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/signup" className="text-red" style={{ fontWeight: 600 }}>
              Sign up for free
            </Link>
          </p>
          <div style={{ marginTop: 14 }}>
            <Link
              to="/admin/login"
              style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <Shield size={13} />
              <span>SuperAdmin Portal Login &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
