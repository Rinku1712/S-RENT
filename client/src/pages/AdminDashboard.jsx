import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../services/dashboardService';
import {
  Users,
  Package,
  Layers,
  ShoppingBag,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  Clock,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

/**
 * Enterprise SuperAdmin Dashboard
 * Features:
 * - Real live platform analytics from backend collections
 * - Revenue metrics, catalog state, rental order statuses
 * - Recent Bookings and Member Registrations
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
      setError(err.message || 'Unable to fetch admin statistics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  return (
    <div>
      {/* Top Banner / Welcome Card */}
      <div
        className="admin-card"
        style={{
          marginBottom: 24,
          borderLeft: '4px solid #E93636',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-primary">Platform Master Console</span>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Real-time Operations</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '2px 0 4px', color: '#0F172A' }}>
            System Analytics & Activity
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748B' }}>
            Live status of users, catalog inventory, rental contracts, and financial volumes
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={fetchAdminStats}
            className="btn btn-secondary btn-sm"
            title="Refresh statistics"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <Link to="/admin/categories" className="btn btn-primary btn-sm">
            <Layers size={14} />
            <span>Manage Categories</span>
          </Link>
        </div>
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
          <p style={{ marginTop: 14, color: '#64748B' }}>Loading platform metrics...</p>
        </div>
      ) : stats ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Key Metric Overview Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-box" style={{ background: '#FEE2E2', color: '#E93636' }}>
                <Users size={22} />
              </div>
              <div>
                <div className="metric-number">{stats.totalUsers || 0}</div>
                <div className="metric-label">Registered Members</div>
                <div style={{ fontSize: '0.74rem', color: '#16A34A', marginTop: 2 }}>
                  {stats.activeUsers || 0} active in good standing
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box" style={{ background: '#E0F2FE', color: '#0284C7' }}>
                <Package size={22} />
              </div>
              <div>
                <div className="metric-number">{stats.totalItems || 0}</div>
                <div className="metric-label">Equipment Listed</div>
                <div style={{ fontSize: '0.74rem', color: '#0284C7', marginTop: 2 }}>
                  {stats.availableItems || 0} available for rent
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <div className="metric-number">{stats.totalRentals || 0}</div>
                <div className="metric-label">Total Bookings</div>
                <div style={{ fontSize: '0.74rem', color: '#D97706', marginTop: 2 }}>
                  {stats.pendingRentals || 0} awaiting approval
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <div className="metric-number text-red">
                  ₹{(stats.totalRentalVolume || 0).toLocaleString('en-IN')}
                </div>
                <div className="metric-label">Gross Rental Volume</div>
                <div style={{ fontSize: '0.74rem', color: '#16A34A', marginTop: 2 }}>
                  ₹{(stats.totalSecurityHeld || 0).toLocaleString('en-IN')} deposits held
                </div>
              </div>
            </div>
          </div>

          {/* Operational Status Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {/* Catalog Breakdown */}
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Package size={17} className="text-red" />
                  <span>Catalog Inventory</span>
                </h3>
                <Link to="/admin/items" style={{ fontSize: '0.8rem', color: '#E93636', fontWeight: 600 }}>
                  Manage &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Total Gear Entries:</span>
                  <strong>{stats.totalItems || 0}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Live & Rentable:</span>
                  <span className="badge badge-success">● {stats.availableItems || 0} Available</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Paused / Inactive:</span>
                  <span className="badge badge-warning">● {stats.pausedItems || 0} Paused</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: '#64748B' }}>Taxonomy Categories:</span>
                  <strong>{stats.totalCategories || 0} active</strong>
                </div>
              </div>
            </div>

            {/* Rental Order Breakdown */}
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShoppingBag size={17} className="text-red" />
                  <span>Rental Fulfillment</span>
                </h3>
                <Link to="/admin/rentals" style={{ fontSize: '0.8rem', color: '#E93636', fontWeight: 600 }}>
                  Manage &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Pending Approvals:</span>
                  <span className="badge badge-warning">{stats.pendingRentals || 0} Pending</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Approved Bookings:</span>
                  <span className="badge badge-success">{stats.approvedRentals || 0} Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Completed Returns:</span>
                  <span className="badge badge-secondary">{stats.completedRentals || 0} Returned</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: '#64748B' }}>Declined / Cancelled:</span>
                  <span className="badge badge-danger">{stats.rejectedRentals || 0} Rejected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Rental Bookings Table */}
          {stats.recentRentals && stats.recentRentals.length > 0 && (
            <div className="admin-table-wrapper">
              <div
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    Recent Rental Bookings
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Latest marketplace peer transactions
                  </span>
                </div>
                <Link to="/admin/rentals" className="btn btn-secondary btn-sm">
                  <span>View All Bookings</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Equipment</th>
                      <th>Renter</th>
                      <th>Owner</th>
                      <th>Dates</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentRentals.map((r) => (
                      <tr key={r._id}>
                        <td>
                          <span className="badge badge-secondary" style={{ fontFamily: 'monospace' }}>
                            #{r._id.slice(-6)}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: '#0F172A' }}>{r.itemId?.name || 'Item'}</strong>
                        </td>
                        <td>{r.renterId?.name || 'Renter'}</td>
                        <td>{r.ownerId?.name || 'Owner'}</td>
                        <td style={{ fontSize: '0.8rem', color: '#64748B' }}>
                          {new Date(r.startDate).toLocaleDateString()} &rarr;{' '}
                          {new Date(r.endDate).toLocaleDateString()}
                        </td>
                        <td>
                          <strong className="text-red">₹{r.totalAmount}</strong>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              r.status === 'approved' || r.status === 'completed'
                                ? 'badge-success'
                                : r.status === 'rejected'
                                ? 'badge-danger'
                                : 'badge-warning'
                            }`}
                            style={{ textTransform: 'capitalize' }}
                          >
                            ● {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Member Registrations Table */}
          {stats.recentUsers && stats.recentUsers.length > 0 && (
            <div className="admin-table-wrapper">
              <div
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    Recent User Registrations
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Newly registered marketplace accounts
                  </span>
                </div>
                <Link to="/admin/users" className="btn btn-secondary btn-sm">
                  <span>View All Users</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Account Status</th>
                      <th>Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <strong style={{ color: '#0F172A' }}>{u.name}</strong>
                        </td>
                        <td style={{ color: '#64748B' }}>{u.email}</td>
                        <td style={{ color: '#64748B' }}>{u.phone || 'N/A'}</td>
                        <td>
                          <span
                            className={`badge ${
                              u.accountStatus === 'active' ? 'badge-success' : 'badge-danger'
                            }`}
                            style={{ textTransform: 'capitalize' }}
                          >
                            ● {u.accountStatus}
                          </span>
                        </td>
                        <td style={{ color: '#64748B', fontSize: '0.8rem' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;
