import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

/**
 * SuperAdmin Login Page
 * URL: /admin/login
 * Features:
 * - Dedicated SuperAdmin console access
 * - Connects to backend POST /api/admin/login
 * - Zero emojis, 100% Lucide React icons
 */
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await adminLogin({ email: email.trim(), password });

      if (res.token) {
        loginAdmin(res.token);
        navigate('/admin/dashboard');
      } else {
        setError('Admin authentication succeeded but session token was missing.');
      }
    } catch (err) {
      setError(err.message || 'Invalid SuperAdmin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ borderTop: '4px solid var(--primary)' }}>
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <BrandLogo size="lg" variant="compact" />
          </div>
          <span className="badge badge-warning" style={{ marginBottom: 8, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Shield size={13} />
            Restricted Admin Access
          </span>
          <h2>SuperAdmin Portal</h2>
          <p>System configuration & platform management console</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Admin Email */}
          <div className="form-group">
            <label className="form-label">SuperAdmin Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="admin@example.com"
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

          {/* Admin Password */}
          <div className="form-group">
            <label className="form-label">SuperAdmin Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter admin password"
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
            <Shield size={16} />
            <span>{loading ? 'Authenticating...' : 'Enter Admin Console'}</span>
          </button>
        </form>

        <div className="auth-footer">
          <p style={{ fontSize: 13 }}>
            Looking for regular marketplace login?{' '}
            <Link to="/login" className="text-red" style={{ fontWeight: 600 }}>
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
