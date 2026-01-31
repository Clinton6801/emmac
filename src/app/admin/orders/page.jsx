'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../../lib/data';
import { formatPrice } from '../../../lib/utils';
import toast from 'react-hot-toast';
import AdminAuthGuard from '../../../components/AdminAuthGuard';

const statusOptions = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);
    setLoading(false);
  }

  const handleStatusChange = async (orderId, newStatus) => {
    const updated = await updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Order status updated!');
    } else {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

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

      <h2 className="text-4xl font-bold mb-8">Order Management</h2>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg ${filterStatus === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
        >
          All Orders ({orders.length})
        </button>
        {statusOptions.map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filterStatus === status ? statusColors[status] : 'bg-gray-200'
            }`}
          >
            {status.replace('_', ' ')} ({orders.filter(o => o.status === status).length})
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  <p className="mt-2"><strong>Customer:</strong> {order.customer_name}</p>
                  <p><strong>Phone:</strong> {order.customer_phone}</p>
                  {order.customer_email && <p><strong>Email:</strong> {order.customer_email}</p>}
                </div>
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-4 py-2 rounded-lg font-semibold ${statusColors[order.status]}`}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="text-sm flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600">{formatPrice(order.total)}</span>
                </div>
              </div>

              {order.delivery_address && (
                <div className="mt-3 bg-gray-50 p-3 rounded">
                  <strong>Delivery Address:</strong> {order.delivery_address}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </AdminAuthGuard>
    </div>
  );
}