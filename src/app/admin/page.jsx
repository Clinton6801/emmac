'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
    <AdminAuthGuard>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Welcome back, {session?.user?.name}!</p>
        </div>

        <AdminDashboard orders={orders} products={products} />
      </div>
    </AdminAuthGuard>
  );
}