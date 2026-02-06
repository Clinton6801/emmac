'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { getProducts, getOrders } from '../../lib/data';
import AdminDashboard from '../../components/AdminDashboard';
import AdminAuthGuard from '../../components/AdminAuthGuard';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

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

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
       <AdminAuthGuard>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Welcome back, {session?.user?.name}!</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/admin/orders')}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Manage Orders
          </button>
          <button 
            onClick={() => router.push('/admin/products')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Manage Products
          </button>
          <button 
            onClick={() => router.push('/admin/customers')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Customers
          </button>
          <button 
            onClick={() => router.push('/admin/reviews')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Reviews
          </button>
          <button 
  onClick={() => router.push('/admin/inventory')}
  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 touch-manipulation"
>
  Inventory
</button>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <AdminDashboard orders={orders} products={products} />
      </AdminAuthGuard>
    </div>
  );
}