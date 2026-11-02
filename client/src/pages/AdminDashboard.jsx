import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../services/dashboardService';
import {
  Shield,
  Users,
  Package,
  Layers,
  ShoppingBag,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  PauseCircle,
} from 'lucide-react';

/**
 * SuperAdmin Dashboard Page
 * URL: /admin/dashboard
 * Features:
 * - Real system-level platform analytics from /api/dashboard/admin
 * - User Ecosystem metrics, Catalog metrics, and Rental Transaction metrics
 * - Direct navigation to Category Management
 * - Zero emojis, 100% Lucide React icons
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminDashboard();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError(err.message || 'Unable to fetch admin statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  return (
    <div className="container" style={{ padding: '36px 20px', maxWidth: 1140 }}>
      {/* Top Banner */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          marginBottom: 28,
          borderLeft: '4px solid var(--primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <span className="badge badge-warning" style={{ marginBottom: 6 }}>
            SuperAdmin Control Console
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '2px 0' }}>
            Platform Overview & Analytics
          </h1>
          <p style={{ margin: 0, fontSize: 14 }}>
            System-wide statistics from real-time database collections
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchAdminStats} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} />
            <span>Refresh Data</span>
          </button>
          <Link to="/admin/categories" className="btn btn-primary btn-sm">
            <Layers size={14} />
            <span>Manage Categories</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="spinner"></div>
      ) : stats ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Section 1: User Ecosystem */}
          <div>
            <h3 style={{ fontSize: 17, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={18} className="text-red" />
              <span>User Ecosystem</span>
            </h3>

            <div className="stats-grid">
              <div className="stat-metric-card">
                <span className="stat-title">Registered Members</span>
                <span className="stat-val text-red">{stats.totalUsers || 0}</span>
                <span className="stat-sub">Normal community accounts</span>
              </div>

              <div className="stat-metric-card">
                <span className="stat-title">Active Accounts</span>
                <span className="stat-val text-success">{stats.activeUsers || 0}</span>
                <span className="stat-sub">In good standing</span>
              </div>

              <div className="stat-metric-card">
                <span className="stat-title">Deactivated Users</span>
                <span className="stat-val text-danger">{stats.deletedUsers || 0}</span>
                <span className="stat-sub">Deleted accounts</span>
              </div>
            </div>
          </div>

          {/* Section 2: Items & Categories */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 17, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Package size={18} className="text-red" />
                <span>Marketplace Listings & Taxonomies</span>
              </h3>
              <Link
                to="/admin/categories"
                style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>Configure Categories</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="stats-grid">
              <div className="stat-metric-card">
                <span className="stat-title">Total Catalog Items</span>
                <span className="stat-val">{stats.totalItems || 0}</span>
                <span className="stat-sub">Equipment entries</span>
              </div>

              <div className="stat-metric-card">
                <span className="stat-title">Available for Rent</span>
                <span className="stat-val text-success">{stats.availableItems || 0}</span>
                <span className="stat-sub">Publicly listed</span>
              </div>

              <div className="stat-metric-card">
                <span className="stat-title">Paused Items</span>
                <span className="stat-val" style={{ color: 'var(--warning)' }}>
                  {stats.pausedItems || 0}
                </span>
                <span className="stat-sub">Temporarily hidden</span>
              </div>

              <div className="stat-metric-card">
                <span className="stat-title">Active Categories</span>
                <span className="stat-val text-red">{stats.totalCategories || 0}</span>
                <span className="stat-sub">Taxonomy categories</span>
              </div>
            </div>
          </div>

          {/* Section 3: Rental Operations */}
          <div>
            <h3 style={{ fontSize: 17, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShoppingBag size={18} className="text-red" />
              <span>Rental Transactions</span>
            </h3>

            <div className="stats-grid">
              <div className="stat-metric-card">
                <span className="stat-title">Total Rental Requests</span>
                <span className="stat-val">{stats.totalRentals || 0}</span>
                <span className="stat-sub">Lifetime requests</span>
              </div>

              <div className="stat-metric-card">
                <span className="stat-title">Pending Approvals</span>
                <span className="stat-val" style={{ color: 'var(--warning)' }}>
                  {stats.pendingRentals || 0}
                </span>
                <span className="stat-sub">Awaiting confirmation</span>
              </div>

              <div className="stat-metric-card">
                <span className="stat-title">Approved Rentals</span>
                <span className="stat-val text-success">{stats.approvedRentals || 0}</span>
                <span className="stat-sub">Active bookings</span>
              </div>

              <div className="stat-metric-card">
                <span className="stat-title">Completed Rentals</span>
                <span className="stat-val text-red">{stats.completedRentals || 0}</span>
                <span className="stat-sub">Safely returned</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;
