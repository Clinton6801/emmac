'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Edit, Eye } from 'lucide-react';
import { getProducts, deleteProduct, addProduct, supabase } from '../../../lib/data';
import { formatPrice } from '../../../lib/utils';
import toast from 'react-hot-toast';
import AdminProductForm from '../../../components/AdminProductform';
import BulkProductUpload from '../../../components/BulkProductUpload';
import AdminAuthGuard from '../../../components/AdminAuthGuard';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
    setLoading(false);
  }

  const handleAddProduct = async (product) => {
    const newProduct = await addProduct(product);
    if (newProduct) {
      setProducts([newProduct, ...products]);
      setShowAddForm(false);
      toast.success('Product added successfully!');
    } else {
      toast.error('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Delete ${name}?`)) return;

    const success = await deleteProduct(id);
    if (success) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted!');
    } else {
      toast.error('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('No products selected');
      return;
    }

    if (!confirm(`Delete ${selectedProducts.length} selected products?`)) return;

    let successCount = 0;
    for (const id of selectedProducts) {
      const success = await deleteProduct(id);
      if (success) successCount++;
    }

    setProducts(products.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
    toast.success(`Deleted ${successCount} products`);
  };

  const toggleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pid => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AdminAuthGuard>
      <button 
        onClick={() => router.push('/admin')}
        className="flex items-center text-orange-600 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">Product Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkUpload(!showBulkUpload)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showBulkUpload ? 'Hide Bulk Upload' : 'Bulk Upload'}
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showAddForm ? 'Cancel' : 'Add Product'}
          </button>
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Selected ({selectedProducts.length})
            </button>
          )}
        </div>
      </div>

      {/* Bulk Upload Section */}
      {showBulkUpload && (
        <div className="mb-8">
          <BulkProductUpload onUploadComplete={fetchProducts} />
        </div>
      )}

      {/* Add Product Form */}
      {showAddForm && (
        <div className="mb-8">
          <AdminProductForm onAddProduct={handleAddProduct} />
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="text-left py-4 px-6 font-semibold">Product</th>
                  <th className="text-left py-4 px-6 font-semibold">Category</th>
                  <th className="text-left py-4 px-6 font-semibold">Price</th>
                  <th className="text-left py-4 px-6 font-semibold">Views</th>
                  <th className="text-left py-4 px-6 font-semibold">Lead Time</th>
                  <th className="text-left py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        {product.views || 0}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {product.min_lead_time} days
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/products/${product.id}`)}
                          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </AdminAuthGuard>
    </div>
  );
}