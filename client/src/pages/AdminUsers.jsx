import { useState, useEffect } from 'react';
import { getAdminUsers, updateUserStatus } from '../services/adminService';
import {
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  X,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
} from 'lucide-react';

/**
 * Enterprise SuperAdmin User Directory & Governance
 * Features:
 * - Search by name or email
 * - Filter by status (All, Active, Blocked, Suspended)
 * - Block / Unblock / Suspend actions with confirmation
 * - View User Details modal
 * - Server-side pagination
 */
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // User details modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminUsers({ search, status, page, limit: 10 });
      if (res.success && res.data) {
        setUsers(res.data.users || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Unable to fetch user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleStatusChange = async (userId, newStatus, userName) => {
    const actionWord = newStatus === 'blocked' ? 'block' : newStatus === 'suspended' ? 'suspend' : 'activate';
    if (!window.confirm(`Are you sure you want to ${actionWord} "${userName}"?`)) {
      return;
    }

    try {
      setProcessingId(userId);
      setActionSuccess(null);
      setError(null);

      const res = await updateUserStatus(userId, newStatus);
      if (res.success) {
        setActionSuccess(`User "${userName}" has been marked as ${newStatus}.`);
        fetchUsers();
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser((prev) => ({ ...prev, accountStatus: newStatus }));
        }
      }
    } catch (err) {
      setError(err.message || `Failed to update status to ${newStatus}.`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      {/* Header Bar */}
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
            User Accounts & Security
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748B' }}>
            Inspect registered accounts, email verification standings, and governance statuses
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="btn btn-secondary btn-sm"
          title="Refresh list"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 36, fontSize: '0.88rem' }}
              />
              <Search
                size={16}
                className="text-muted"
                style={{ position: 'absolute', left: 12, top: 12 }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Status:</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="form-select"
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="">All Statuses ({totalCount})</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="admin-table-wrapper">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: 14, color: '#64748B' }}>Loading user directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="empty-icon-circle" style={{ margin: '0 auto 14px' }}>
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>
              No Users Found
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
              No user records match your search criteria.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Contact Info</th>
                  <th>Location</th>
                  <th>Email Verification</th>
                  <th>Account Status</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            background: '#FEE2E2',
                            color: '#E53935',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            flexShrink: 0,
                          }}
                        >
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <strong style={{ color: '#0F172A', display: 'block', fontSize: '0.9rem' }}>
                            {u.name}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            ID: {u._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.84rem', color: '#334155' }}>{u.email}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{u.phone || 'No phone'}</div>
                    </td>

                    <td style={{ fontSize: '0.84rem', color: '#64748B' }}>
                      {u.address?.city
                        ? `${u.address.city}, ${u.address.state || ''}`
                        : 'India'}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          u.isEmailVerified ? 'badge-success' : 'badge-warning'
                        }`}
                      >
                        <ShieldCheck size={12} />
                        <span>{u.isEmailVerified ? 'Verified' : 'Unverified'}</span>
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          u.accountStatus === 'active'
                            ? 'badge-success'
                            : u.accountStatus === 'suspended'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                        style={{ textTransform: 'capitalize' }}
                      >
                        ● {u.accountStatus}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          className="btn btn-secondary btn-sm"
                          title="View user details"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>

                        {u.accountStatus === 'active' ? (
                          <button
                            type="button"
                            disabled={processingId === u._id}
                            onClick={() => handleStatusChange(u._id, 'blocked', u.name)}
                            className="btn btn-danger btn-sm"
                            title="Block this user"
                          >
                            <ShieldAlert size={13} />
                            <span>Block</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={processingId === u._id}
                            onClick={() => handleStatusChange(u._id, 'active', u.name)}
                            className="btn btn-primary btn-sm"
                            title="Activate this user"
                          >
                            <ShieldCheck size={13} />
                            <span>Unblock</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <span>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total users)
            </span>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                User Profile Information
              </h3>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  paddingBottom: 16,
                  borderBottom: '1px solid #E2E8F0',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: '#FEE2E2',
                    color: '#E53935',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                  }}
                >
                  {selectedUser.name ? selectedUser.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px', color: '#0F172A' }}>
                    {selectedUser.name}
                  </h4>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span
                      className={`badge ${
                        selectedUser.accountStatus === 'active' ? 'badge-success' : 'badge-danger'
                      }`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      ● {selectedUser.accountStatus}
                    </span>
                    <span className="badge badge-secondary">
                      Role: {selectedUser.role || 'user'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={14} />
                    <span>Email:</span>
                  </span>
                  <strong>{selectedUser.email}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={14} />
                    <span>Phone:</span>
                  </span>
                  <strong>{selectedUser.phone || 'N/A'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} />
                    <span>Registered Address:</span>
                  </span>
                  <strong>
                    {selectedUser.address?.city
                      ? `${selectedUser.address.city}, ${selectedUser.address.state || ''} ${selectedUser.address.postalCode || ''}`
                      : 'India'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={14} />
                    <span>Email Verification:</span>
                  </span>
                  <span className={selectedUser.isEmailVerified ? 'text-success' : 'text-danger'}>
                    {selectedUser.isEmailVerified ? 'Verified' : 'Pending OTP Verification'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} />
                    <span>Registration Date:</span>
                  </span>
                  <strong>{new Date(selectedUser.createdAt).toLocaleString()}</strong>
                </div>
              </div>

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {selectedUser.accountStatus === 'active' ? (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedUser._id, 'blocked', selectedUser.name)}
                    className="btn btn-danger btn-sm"
                  >
                    Block User Account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedUser._id, 'active', selectedUser.name)}
                    className="btn btn-primary btn-sm"
                  >
                    Unblock User Account
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
