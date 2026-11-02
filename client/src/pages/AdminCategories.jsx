import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
} from 'lucide-react';

/**
 * SuperAdmin Category Management Page
 * URL: /admin/categories
 * Features:
 * - Full CRUD for rental marketplace categories
 * - Create & Edit Modal
 * - Delete category with confirmation
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
          image: formImage.trim() || null,
        });
        setSuccessMsg(`Category "${formName.trim()}" updated successfully!`);
      } else {
        await createCategory({
          name: formName.trim(),
          description: formDescription.trim(),
          image: formImage.trim() || null,
        });
        setSuccessMsg(`Category "${formName.trim()}" created successfully!`);
      }

      closeModal();
      fetchCats();
    } catch (err) {
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (catId, catName) => {
    if (!window.confirm(`Are you sure you want to remove category "${catName}"?`)) {
      return;
    }

    try {
      setError(null);
      await deleteCategory(catId);
      setSuccessMsg(`Category "${catName}" deleted successfully.`);
      fetchCats();
    } catch (err) {
      setError(err.message || 'Failed to remove category.');
    }
  };

  return (
    <div className="container" style={{ padding: '36px 20px', maxWidth: 1140 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <Link
            to="/admin/dashboard"
            style={{
              color: 'var(--text-secondary)',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              marginBottom: 4,
            }}
          >
            <ArrowLeft size={13} />
            <span>Back to Admin Dashboard</span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '2px 0' }}>
            Category Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 13 }}>
            Organize the marketplace taxonomy for renters and item owners
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={15} />
          <span>Add New Category</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Categories Table Card */}
      <div className="data-table-card">
        {loading ? (
          <div className="spinner"></div>
        ) : categories.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon-circle">
              <Layers size={28} />
            </div>
            <h3>No Categories Found</h3>
            <p>Create your first category so users can categorize their listings.</p>
            <button onClick={openCreateModal} className="btn btn-primary">
              Create First Category
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Package size={16} className="text-red" />
                      <strong style={{ fontSize: 14 }}>{cat.name}</strong>
                    </div>
                  </td>
                  <td>
                    <code style={{ fontSize: 12, backgroundColor: 'var(--bg-section)', padding: '2px 6px', borderRadius: 4 }}>
                      {cat.slug}
                    </code>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 320 }}>
                    {cat.description || 'No description provided'}
                  </td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={() => openEditModal(cat)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Category"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        className="btn btn-danger btn-sm"
                        title="Delete Category"
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
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
              <button onClick={closeModal} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Photography Gear"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of items included in this category..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/category-icon.png"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting
                    ? 'Saving...'
                    : editingCategory
                    ? 'Update Category'
                    : 'Create Category'}
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
