import { useState, useEffect } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
  RefreshCw,
} from 'lucide-react';

/**
 * SuperAdmin Category Management
 * Features:
 * - Create, update, and delete rental categories
 * - Modal form with validation
 * - Synchronous image preview
 * - Zero emojis, 100% Lucide React icons
 */
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCategories();
      if (res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Unable to load categories from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDescription('');
    setFormImage('');
    setModalOpen(true);
    setError(null);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormName(cat.name || '');
    setFormDescription(cat.description || '');
    setFormImage(cat.image || '');
    setModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (editingCategory) {
        await updateCategory(editingCategory._id, {
          name: formName.trim(),
          description: formDescription.trim(),
          image: formImage.trim() || undefined,
        });
        setSuccessMsg(`Category "${formName}" updated successfully.`);
      } else {
        await createCategory({
          name: formName.trim(),
          description: formDescription.trim(),
          image: formImage.trim() || undefined,
        });
        setSuccessMsg(`Category "${formName}" created successfully.`);
      }

      closeModal();
      fetchCats();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setError(null);
      await deleteCategory(id);
      setSuccessMsg(`Category "${name}" deleted.`);
      fetchCats();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
    }
  };

  return (
    <div>
      {/* Top Header */}
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
            Category Taxonomies
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748B' }}>
            Configure marketplace rental categories, icons, and discovery metadata
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={fetchCats}
            className="btn btn-secondary btn-sm"
            title="Refresh categories"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button type="button" onClick={openCreateModal} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>+ Add New Category</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Categories Table */}
      <div className="admin-table-wrapper">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: 14, color: '#64748B' }}>Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="empty-icon-circle" style={{ margin: '0 auto 14px' }}>
              <Layers size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>
              No Categories Found
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#64748B' }}>
              Create categories so community owners can classify their gear.
            </p>
            <button type="button" onClick={openCreateModal} className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Create First Category</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Image / Icon</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: '#FEE2E2',
                            color: '#E93636',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Layers size={18} />
                        </div>
                        <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>
                          {cat.name}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-secondary" style={{ fontFamily: 'monospace' }}>
                        {cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.84rem', color: '#64748B', maxWidth: 300 }}>
                      {cat.description || 'No description provided.'}
                    </td>

                    <td>
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, border: '1px solid #E2E8F0' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>None</span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          cat.isActive !== false ? 'badge-success' : 'badge-warning'
                        }`}
                      >
                        ● {cat.isActive !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="btn btn-secondary btn-sm"
                          title="Edit category"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="btn btn-danger btn-sm"
                          title="Delete category"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                {editingCategory ? `Edit: ${editingCategory.name}` : 'Add New Category'}
              </h3>
              <button type="button" onClick={closeModal} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Photography & Cameras"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  placeholder="Short description of items categorized under this taxonomy..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image or Icon URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="modal-actions" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
