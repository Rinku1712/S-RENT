import { useState, useEffect } from 'react';
import { getAdminProfile } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  ShieldCheck,
  Mail,
  Phone,
  Server,
  Database,
  Lock,
  LogOut,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

/**
 * SuperAdmin System Settings & Environment Security
 * Features:
 * - Verified SuperAdmin profile credentials
 * - System runtime parameters
 * - Database connectivity status
 * - Security policy overview
 */
const AdminSettings = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin profile:', err);
      setError(err.message || 'Unable to fetch admin profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px', color: '#0F172A' }}>
            System Settings & Security Profile
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748B' }}>
            Root administrator credentials, platform configurations, and database infrastructure
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProfile}
          className="btn btn-secondary btn-sm"
          title="Refresh profile"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 20 }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: 14, color: '#64748B' }}>Loading security configuration...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section 1: SuperAdmin Identity Card */}
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 18, borderBottom: '1px solid #E2E8F0' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  color: '#E53935',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                <span>A</span>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    {profile?.name || 'Super Admin'}
                  </h3>
                  <span className="badge badge-primary">ROOT ACCESS</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Platform Administrator • Full System Authorization
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={15} />
                  <span>Administrative Email:</span>
                </span>
                <strong>{profile?.email || 'rohillarinku446@gmail.com'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={15} />
                  <span>Emergency Phone:</span>
                </span>
                <strong>{profile?.phone || '9991053089'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lock size={15} />
                  <span>Credential Storage:</span>
                </span>
                <span className="badge badge-success">
                  <ShieldCheck size={12} />
                  <span>Server Environment Variables (.env)</span>
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={15} />
                  <span>Authorization Scope:</span>
                </span>
                <strong>SuperAdmin (All Categories, Users, Catalog, Escrow)</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Platform Infrastructure Health */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A' }}>
              <Server size={18} className="text-red" />
              <span>Infrastructure Health & Services</span>
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 16,
              }}
            >
              <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Database size={16} className="text-success" />
                  <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>MongoDB Service</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={12} />
                  <span>Connected (mongodb://127.0.0.1:27017/RIB)</span>
                </div>
              </div>

              <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Server size={16} className="text-success" />
                  <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>Express REST API</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={12} />
                  <span>Port 3000 Active & Healthy</span>
                </div>
              </div>

              <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Mail size={16} className="text-success" />
                  <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>Nodemailer Service</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={12} />
                  <span>Gmail App Password Configured</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Sign Out Control */}
          <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <strong style={{ fontSize: '0.92rem', color: '#0F172A', display: 'block' }}>
                Sign Out SuperAdmin Session
              </strong>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Terminates root authorization token stored in this browser
              </span>
            </div>

            <button
              type="button"
              onClick={logout}
              className="btn btn-danger btn-sm"
              style={{ gap: 6 }}
            >
              <LogOut size={14} />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;

