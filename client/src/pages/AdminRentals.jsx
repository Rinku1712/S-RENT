import { useState, useEffect } from 'react';
import { getAdminRentals } from '../services/adminService';
import {
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
  Calendar,
  Clock,
  ShieldCheck,
  User,
} from 'lucide-react';

/**
 * Enterprise SuperAdmin Rental Bookings & Orders Directory
 * Features:
 * - Table view of all rental requests & contracts
 * - Filter by status (All, Pending, Approved, Completed, Rejected)
 * - Booking details modal with customer, owner, and pricing breakdown
 * - Server-side pagination
 */
const AdminRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected Booking Modal
  const [selectedRental, setSelectedRental] = useState(null);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminRentals({ status, page, limit: 10 });
      if (res.success && res.data) {
        setRentals(res.data.rentals || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load admin rentals:', err);
      setError(err.message || 'Unable to fetch rental orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  return (
    <div>
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
            Rental Orders & Contracts
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748B' }}>
            Monitor peer rental bookings, fulfillment statuses, and security deposit escrow
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRentals}
          className="btn btn-secondary btn-sm"
          title="Refresh orders"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0F172A' }}>
              Filter by Status:
            </span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="form-select"
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="">All Orders ({totalCount})</option>
              <option value="pending">Pending Approvals</option>
              <option value="approved">Approved & Active</option>
              <option value="completed">Completed / Returned</option>
              <option value="rejected">Rejected / Cancelled</option>
            </select>
          </div>

          <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
            Total <strong>{totalCount}</strong> recorded rental contracts
          </span>
        </div>
      </div>

      {/* Rentals Table */}
      <div className="admin-table-wrapper">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: 14, color: '#64748B' }}>Loading rental records...</p>
          </div>
        ) : rentals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="empty-icon-circle" style={{ margin: '0 auto 14px' }}>
              <ShoppingBag size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>
              No Rental Bookings Found
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
              No rental orders match your filter criteria.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Equipment Item</th>
                  <th>Renter (Customer)</th>
                  <th>Owner</th>
                  <th>Rental Period</th>
                  <th>Financials</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <span className="badge badge-secondary" style={{ fontFamily: 'monospace' }}>
                        #{r._id.slice(-6)}
                      </span>
                    </td>

                    <td>
                      <strong style={{ color: '#0F172A', display: 'block', fontSize: '0.88rem' }}>
                        {r.itemId?.name || 'Rental Gear'}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        Rate: ₹{r.pricePerDay} / day
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                        {r.renterId?.name || 'Renter'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {r.renterId?.email || 'N/A'}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                        {r.ownerId?.name || 'Owner'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {r.ownerId?.email || 'N/A'}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.82rem', color: '#0F172A' }}>
                        {new Date(r.startDate).toLocaleDateString()} &rarr;{' '}
                        {new Date(r.endDate).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Duration: {r.totalDays} day(s)
                      </div>
                    </td>

                    <td>
                      <strong className="text-red">Rent: ₹{r.totalAmount}</strong>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Deposit: ₹{r.securityDeposit}
                      </div>
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

                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedRental(r)}
                        className="btn btn-secondary btn-sm"
                        title="View contract details"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
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
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total orders)
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

      {/* Rental Details Modal */}
      {selectedRental && (
        <div className="modal-backdrop" onClick={() => setSelectedRental(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Rental Order #{selectedRental._id.slice(-6)}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedRental(null)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 14,
                  background: '#F8FAFC',
                  borderRadius: 8,
                  marginBottom: 18,
                }}
              >
                <div>
                  <strong style={{ fontSize: '1rem', color: '#0F172A', display: 'block' }}>
                    {selectedRental.itemId?.name || 'Equipment Item'}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Pickup: {selectedRental.itemId?.location?.city || 'Location unspecified'}
                  </span>
                </div>

                <span
                  className={`badge ${
                    selectedRental.status === 'approved' || selectedRental.status === 'completed'
                      ? 'badge-success'
                      : selectedRental.status === 'rejected'
                      ? 'badge-danger'
                      : 'badge-warning'
                  }`}
                  style={{ textTransform: 'capitalize' }}
                >
                  ● {selectedRental.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Renter Name:</span>
                  <strong>{selectedRental.renterId?.name || 'Renter'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Renter Contact:</span>
                  <span>{selectedRental.renterId?.email} • {selectedRental.renterId?.phone || 'No phone'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Owner Name:</span>
                  <strong>{selectedRental.ownerId?.name || 'Owner'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Owner Contact:</span>
                  <span>{selectedRental.ownerId?.email} • {selectedRental.ownerId?.phone || 'No phone'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Rental Duration:</span>
                  <strong>
                    {new Date(selectedRental.startDate).toLocaleDateString()} to{' '}
                    {new Date(selectedRental.endDate).toLocaleDateString()} ({selectedRental.totalDays} days)
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Rental Charge:</span>
                  <strong className="text-red">₹{selectedRental.totalAmount}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Refundable Security Deposit:</span>
                  <strong>₹{selectedRental.securityDeposit || 0}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#64748B' }}>Booked Timestamp:</span>
                  <strong>{new Date(selectedRental.createdAt).toLocaleString()}</strong>
                </div>
              </div>

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedRental(null)}
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

export default AdminRentals;
