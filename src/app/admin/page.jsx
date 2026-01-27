'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts, getOrders } from '../lib/data';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  async function fetchData() {
    setLoading(true);
    const [fetchedProducts, fetchedOrders] = await Promise.all([
      getProducts(),
      getOrders()
    ]);
    setProducts(fetchedProducts);
    setOrders(fetchedOrders);
    setLoading(false);
  }

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 mb-2"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full text-gray-600 hover:text-gray-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">Admin Dashboard</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/admin/orders')}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Manage Orders
          </button>
          <button 
            onClick={() => router.push('/admin/reviews')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Manage Reviews
          </button>
          <button 
             onClick={() => router.push('/admin/customers')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
             >
                View Customers
                </button>
          <button 
            onClick={() => router.push('/admin/products')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Manage Products
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <AdminDashboard orders={orders} products={products} />
    </div>
  );
}