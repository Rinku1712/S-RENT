import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  ArrowLeft,
  AlertCircle,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';

/**
 * Premium S-RENT Account Profile Page
 * URL: /profile
 */
const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const res = await getUserProfile();
        if (res.success && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError(err.message || 'Unable to fetch user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="container" style={{ padding: '36px 20px 72px', maxWidth: 680 }}>
      {/* Header Navigation */}
      <div style={{ marginBottom: 24 }}>
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
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '2px 0 4px' }}>
          My Account Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
          Verified community member credentials and security standing
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: 14, color: 'var(--text-secondary)' }}>Loading profile...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      ) : profile ? (
        <div className="card" style={{ padding: 32 }}>
          {/* Avatar and Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              borderBottom: '1px solid var(--border)',
              paddingBottom: 24,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {profile.name ? profile.name[0].toUpperCase() : 'U'}
            </div>

            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 6px' }}>
                {profile.name}
              </h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span
                  className={`badge ${
                    profile.isEmailVerified ? 'badge-success' : 'badge-warning'
                  }`}
                >
                  <ShieldCheck size={13} />
                  <span>{profile.isEmailVerified ? 'Email Verified' : 'Unverified Email'}</span>
                </span>
                <span className="badge badge-secondary">
                  Account Status: {profile.accountStatus || 'active'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.9rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: 12,
              }}
            >
              <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={16} />
                <span>Email Address</span>
              </span>
              <strong style={{ color: 'var(--text-primary)' }}>{profile.email}</strong>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: 12,
              }}
            >
              <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={16} />
                <span>Phone Number</span>
              </span>
              <strong style={{ color: 'var(--text-primary)' }}>{profile.phone || 'N/A'}</strong>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: 12,
              }}
            >
              <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} />
                <span>Registered Address</span>
              </span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {profile.address?.city
                  ? `${profile.address.city}, ${profile.address.state || ''} ${profile.address.postalCode || ''}`
                  : 'India'}
              </strong>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: 12,
              }}
            >
              <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} />
                <span>Community Member Since</span>
              </span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {new Date(profile.createdAt).toLocaleDateString()}
              </strong>
            </div>
          </div>

          {/* Bottom Actions */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <Link to="/dashboard" className="btn btn-secondary btn-sm">
              <LayoutDashboard size={14} />
              <span>Go to Dashboard</span>
            </Link>

            <button onClick={logout} className="btn btn-danger btn-sm">
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
