'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle, Package } from 'lucide-react';
import { getProducts, getLowStockProducts, updateProductStock } from '../../../lib/data';
import { supabase } from '../../../lib/supabase'; 
import { formatPrice } from '../../../lib/utils';
import toast from 'react-hot-toast';
import AdminAuthGuard from '../../../components/AdminAuthGuard';

export default function AdminInventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [allProducts, lowStock] = await Promise.all([
      getProducts(),
      getLowStockProducts()
    ]);
    setProducts(allProducts);
    setLowStockProducts(lowStock);
    setLoading(false);
  }

  const handleStockUpdate = async (productId, newQuantity) => {
    const result = await updateProductStock(productId, newQuantity);
    if (result) {
      setProducts(products.map(p => 
        p.id === productId ? { ...p, stock_quantity: newQuantity } : p
      ));
      toast.success('Stock updated!');
      fetchData(); // Refresh low stock list
    } else {
      toast.error('Failed to update stock');
    }
  };

  const handleToggleTracking = async (productId, currentValue) => {
    const { error } = await supabase
      .from('products')
      .update({ track_inventory: !currentValue })
      .eq('id', productId);

    if (!error) {
      setProducts(products.map(p => 
        p.id === productId ? { ...p, track_inventory: !currentValue } : p
      ));
      toast.success('Tracking updated!');
      fetchData();
    }
  };

  return (
    <AdminAuthGuard>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => router.push('/admin')}
          className="flex items-center text-orange-600 hover:underline mb-6 touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <h2 className="text-4xl font-bold mb-8">Inventory Management</h2>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">
                  Low Stock Alert
                </h3>
                <p className="text-yellow-700">
                  {lowStockProducts.length} product(s) running low on stock
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-sm">{product.name}</span>
                  <span className="text-sm font-semibold text-red-600">
                    Only {product.stock_quantity} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Table */}
        {loading ? (
          <div className="text-center py-12">Loading inventory...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Product</th>
                    <th className="text-left py-4 px-6 font-semibold">Price</th>
                    <th className="text-left py-4 px-6 font-semibold">Track Inventory</th>
                    <th className="text-left py-4 px-6 font-semibold">Stock</th>
                    <th className="text-left py-4 px-6 font-semibold">Low Stock Threshold</th>
                    <th className="text-left py-4 px-6 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => {
                    const isLowStock = product.track_inventory && 
                                     product.stock_quantity <= (product.low_stock_threshold || 5);
                    const isOutOfStock = product.track_inventory && product.stock_quantity === 0;

                    return (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="font-semibold">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-4 px-6">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={product.track_inventory || false}
                              onChange={() => handleToggleTracking(product.id, product.track_inventory)}
                              className="w-5 h-5 touch-manipulation"
                            />
                          </label>
                        </td>
                        <td className="py-4 px-6">
                          {product.track_inventory ? (
                            <input
                              type="number"
                              value={product.stock_quantity || 0}
                              onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                              className="w-24 border rounded px-2 py-1 touch-manipulation"
                              min="0"
                            />
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {product.track_inventory ? (product.low_stock_threshold || 5) : 'N/A'}
                        </td>
                        <td className="py-4 px-6">
                          {!product.track_inventory ? (
                            <span className="text-gray-500 text-sm">Not tracked</span>
                          ) : isOutOfStock ? (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-4 h-4" />
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminAuthGuard>
  );
}