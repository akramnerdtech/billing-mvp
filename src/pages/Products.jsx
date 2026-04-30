import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Search, Image as ImageIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Table, Thead, Tr, Th, Td } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({ name: '', price: '', quantity: '', imageUrl: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);

    try {
      const { data } = await api.post('/upload', fd);
      setFormData({ ...formData, imageUrl: `http://localhost:5000${data.url}` });
      toast.success('Image processed securely');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failure during upload sequence');
    } finally {
      setUploading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ name: '', price: '', quantity: '', imageUrl: '' });
    setEditingId(null);
  };

  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      imageUrl: product.imageUrl || ''
    });
    setEditingId(product._id);
    setIsModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', formData);
        toast.success('Product added successfully!');
      }
      handleModalClose();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Error deleting product');
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const StockBadge = ({ quantity }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold border ${
      quantity > 5 ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
      : quantity > 0 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      : 'bg-red-500/10 text-red-400 border-red-500/20'
    }`}>
      {quantity > 0 ? `${quantity} in stock` : 'Out of stock'}
    </span>
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded w-1/4" />
        <div className="h-96 bg-white/5 rounded-xl border border-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Inventory Models</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your product listings and limits.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search products..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
            <Plus size={18} /> <span className="hidden sm:inline">New Product</span><span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* ── Desktop Table (hidden on mobile) ─────────────────── */}
      <Card className="hidden sm:block">
        <Table>
          <Thead>
            <Tr>
              <Th>Product Detail</Th>
              <Th>Price</Th>
              <Th>Availability</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <Tr>
                <Td colSpan={4} className="py-16 text-center text-gray-500">
                  {search ? 'No products match your search.' : 'Database is empty. Add a product to proceed.'}
                </Td>
              </Tr>
            ) : (
              filteredProducts.map(product => (
                <Tr key={product._id} className="group">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-white/5 bg-white/5 flex items-center justify-center font-bold text-gray-400 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors overflow-hidden shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          product.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="font-semibold text-gray-200">{product.name}</span>
                    </div>
                  </Td>
                  <Td className="text-gray-300 font-medium">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Td>
                  <Td><StockBadge quantity={product.quantity} /></Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(product)} className="hover:text-blue-400">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id)} className="hover:text-red-400 hover:bg-red-500/10">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* ── Mobile Card List (hidden on sm+) ─────────────────── */}
      <div className="sm:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-500 bg-white/[0.03] rounded-xl border border-white/5">
            {search ? 'No products match your search.' : 'Database is empty. Add a product to proceed.'}
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id} className="flex items-center gap-3 p-4 bg-[#111827] rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center font-bold text-gray-400 overflow-hidden shrink-0">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  product.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-200 truncate">{product.name}</p>
                <p className="text-sm text-gray-400 mt-0.5">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                <div className="mt-1.5"><StockBadge quantity={product.quantity} /></div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => openEditModal(product)}
                  className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingId ? 'Edit Product Configuration' : 'Register New Product'}
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 mt-2">

          <div className="flex flex-col items-center justify-center w-full mb-4">
            {formData.imageUrl ? (
              <div className="h-32 w-32 rounded-xl border border-white/10 overflow-hidden relative group">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => setFormData({ ...formData, imageUrl: '' })}>
                  <Trash2 className="text-white" size={20} />
                </div>
              </div>
            ) : (
              <label className={`h-32 w-full rounded-xl border-2 border-dashed ${uploading ? 'border-blue-500 animate-pulse' : 'border-white/20 hover:border-blue-500/50'} bg-white/5 flex flex-col items-center justify-center text-gray-500 cursor-pointer overflow-hidden transition-all duration-300`}>
                <input type="file" onChange={uploadFileHandler} className="hidden" accept="image/*" disabled={uploading} />
                {uploading ? (
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                ) : (
                  <>
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">Click to upload product image</span>
                  </>
                )}
              </label>
            )}
          </div>

          <Input
            label="Product Identifier"
            placeholder="e.g. Server Rack X1"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Standard Price (₹)"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <Input
              label="Available Stock"
              type="number"
              min="0"
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={handleModalClose}>Cancel</Button>
            <Button type="submit" isLoading={submitting}>
              {editingId ? 'Save Changes' : 'Commit to Database'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Products;
