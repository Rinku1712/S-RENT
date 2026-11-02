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
} from 'lucide-react';

/**
 * Account Profile Page
 * URL: /profile
 * Features:
 * - View verified identity details, phone, and address
 * - Email verification badge
 * - Account sign out
 * - Zero emojis, 100% Lucide React icons
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
    <div className="container" style={{ padding: '36px 20px', maxWidth: 640 }}>
      {/* Header */}
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
          My Account Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14 }}>
          Verified community member credentials and security status
        </p>
      </div>

      {loading ? (
        <div className="spinner"></div>
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
              gap: 18,
              borderBottom: '1px solid var(--border)',
              paddingBottom: 24,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                fontWeight: 700,
                border: '1px solid var(--primary-border)',
              }}
            >
              {profile.name ? profile.name[0].toUpperCase() : 'U'}
            </div>

            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>
                {profile.name}
              </h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span
                  className={`badge ${
                    profile.isEmailVerified ? 'badge-success' : 'badge-warning'
                  }`}
                >
                  <ShieldCheck size={13} />
                  <span>{profile.isEmailVerified ? 'Verified Member' : 'Email Unverified'}</span>
                </span>
                <span className="badge badge-secondary">
                  Account: {profile.accountStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Details list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
              <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={15} />
                <span>Full Name</span>
              </span>
              <strong>{profile.name}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
              <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={15} />
                <span>Email Address</span>
              </span>
              <strong>{profile.email}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
              <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={15} />
                <span>Phone Number</span>
              </span>
              <strong>{profile.phone}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
              <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={15} />
                <span>Primary Location</span>
              </span>
              <strong>
                {profile.address?.city
                  ? `${profile.address.city}, ${profile.address.state || ''}`
                  : 'India'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
              <span className="text-muted">Postal Code</span>
              <strong>{profile.address?.postalCode || 'Not provided'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={15} />
                <span>Member Since</span>
              </span>
              <strong>{new Date(profile.createdAt).toLocaleDateString()}</strong>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 32,
              paddingTop: 20,
              borderTop: '1px solid var(--border)',
            }}
          >
            <Link to="/dashboard" className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} />
              <span>Dashboard</span>
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
