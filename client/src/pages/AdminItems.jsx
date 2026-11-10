import { useState, useEffect } from 'react';
import { getAdminItems, deleteAdminItem } from '../services/adminService';
import { getCategories } from '../services/categoryService';
import getItemImageUrl from '../utils/itemImageUrl';
import {
  Package,
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  RefreshCw,
  X,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Enterprise SuperAdmin Equipment & Listings Directory
 * Features:
 * - Table view with product thumbnails and owner contact
 * - Filter by category and availability status
 * - Search by item title or brand
 * - View detailed specifications modal
 * - Delete listing action with confirmation
 * - Server-side pagination
 */
const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Item details modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategoriesList = async () => {
    try {
      const res = await getCategories();
      if (res.data) setCategories(res.data);
    } catch {
      // non-critical
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminItems({ search, category, status, page, limit: 10 });
      if (res.success && res.data) {
        setItems(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load admin items:', err);
      setError(err.message || 'Unable to fetch equipment listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`Are you sure you want to delete listing "${itemName}"? This will pause availability.`)) {
      return;
    }

    try {
      setDeletingId(itemId);
      setActionSuccess(null);
      setError(null);

      const res = await deleteAdminItem(itemId);
      if (res.success) {
        setActionSuccess(`"${itemName}" was removed from the active catalog.`);
        fetchItems();
        if (selectedItem && selectedItem._id === itemId) {
          setSelectedItem(null);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to delete listing.');
    } finally {
      setDeletingId(null);
    }
  };

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
            Equipment & Listings Management
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748B' }}>
            Inspect all peer-to-peer equipment posted by community owners
          </p>
        </div>

        <button
          type="button"
          onClick={fetchItems}
          className="btn btn-secondary btn-sm"
          title="Refresh catalog"
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
                placeholder="Search gear by title or brand..."
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Category:</span>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="form-select"
                style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                <option value="available">Available Only</option>
                <option value="paused">Paused Only</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Items Table */}
      <div className="admin-table-wrapper">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: 14, color: '#64748B' }}>Loading equipment catalog...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="empty-icon-circle" style={{ margin: '0 auto 14px' }}>
              <Package size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>
              No Equipment Found
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
              No listings match your search criteria.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Equipment Item</th>
                  <th>Category</th>
                  <th>Owner</th>
                  <th>Rental Rate</th>
                  <th>Deposit</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => {
                  const firstImg = it.images && it.images.length > 0 ? it.images[0] : null;
                  const thumb = getItemImageUrl(firstImg);

                  return (
                    <tr key={it._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 8,
                              overflow: 'hidden',
                              background: '#F1F5F9',
                              border: '1px solid #E2E8F0',
                              flexShrink: 0,
                            }}
                          >
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={it.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#94A3B8',
                                }}
                              >
                                <Package size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <strong style={{ color: '#0F172A', display: 'block', fontSize: '0.9rem' }}>
                              {it.name}
                            </strong>
                            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                              {it.brand || 'Unbranded'} • {it.location?.city || 'India'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ fontSize: '0.84rem', color: '#334155' }}>
                        {it.categoryId?.name || 'General'}
                      </td>

                      <td>
                        <div style={{ fontSize: '0.84rem', color: '#0F172A', fontWeight: 600 }}>
                          {it.ownerId?.name || 'Owner'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          {it.ownerId?.email || 'N/A'}
                        </div>
                      </td>

                      <td>
                        <strong className="text-red">₹{it.pricePerDay}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>/day</span>
                      </td>

                      <td style={{ fontSize: '0.84rem', color: '#334155' }}>
                        ₹{it.securityDeposit || 0}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            it.availabilityStatus === 'available' ? 'badge-success' : 'badge-warning'
                          }`}
                          style={{ textTransform: 'capitalize' }}
                        >
                          ● {it.availabilityStatus}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => setSelectedItem(it)}
                            className="btn btn-secondary btn-sm"
                            title="Inspect details"
                          >
                            <Eye size={13} />
                            <span>Details</span>
                          </button>

                          <Link
                            to={`/items/${it._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            title="View live product page"
                          >
                            <ExternalLink size={13} />
                          </Link>

                          <button
                            type="button"
                            disabled={deletingId === it._id}
                            onClick={() => handleDeleteItem(it._id, it.name)}
                            className="btn btn-danger btn-sm"
                            title="Delete this listing"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <span>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total listings)
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

      {/* Details Modal */}
      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Listing Specifications: {selectedItem.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                {selectedItem.images && selectedItem.images.length > 0 ? (
                  <img
                    src={getItemImageUrl(selectedItem.images[0])}
                    alt={selectedItem.name}
                    style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid #E2E8F0' }}
                  />
                ) : null}

                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px', color: '#0F172A' }}>
                    {selectedItem.name}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} className="text-red" />
                    <span>
                      {selectedItem.location?.city}, {selectedItem.location?.state}
                    </span>
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                    <span className="badge badge-secondary">
                      Condition: {selectedItem.condition}
                    </span>
                    <span
                      className={`badge ${
                        selectedItem.availabilityStatus === 'available'
                          ? 'badge-success'
                          : 'badge-warning'
                      }`}
                    >
                      ● {selectedItem.availabilityStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Category:</span>
                  <strong>{selectedItem.categoryId?.name || 'General'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Brand:</span>
                  <strong>{selectedItem.brand || 'Unbranded'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Daily Rent Rate:</span>
                  <strong className="text-red">₹{selectedItem.pricePerDay} / day</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Security Deposit:</span>
                  <strong>₹{selectedItem.securityDeposit || 0}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Owner Name:</span>
                  <strong>{selectedItem.ownerId?.name || 'N/A'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Owner Email:</span>
                  <strong>{selectedItem.ownerId?.email || 'N/A'}</strong>
                </div>

                <div style={{ padding: '6px 0' }}>
                  <span style={{ color: '#64748B', display: 'block', marginBottom: 4 }}>Description:</span>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155', background: '#F8FAFC', padding: 10, borderRadius: 6 }}>
                    {selectedItem.description || 'No description provided.'}
                  </p>
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
                <button
                  type="button"
                  onClick={() => handleDeleteItem(selectedItem._id, selectedItem.name)}
                  className="btn btn-danger btn-sm"
                >
                  Delete Listing
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
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

export default AdminItems;

