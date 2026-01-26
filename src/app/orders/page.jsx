'use client';

import { useState } from 'react';
import { Search, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Confirmed' },
  in_progress: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-50', label: 'In Progress' },
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' }
};

export default function OrderTrackingPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchOrders = async () => {
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      setOrders([]);
    } else {
      setOrders(data);
      if (data.length === 0) {
        toast.error('No orders found for this phone number');
      } else {
        toast.success(`Found ${data.length} order(s)`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Track Your Order</h1>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <p className="text-gray-600 mb-4">Enter your phone number to track your orders</p>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchOrders()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={searchOrders}
            disabled={loading}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Orders List */}
      {searched && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">Check your phone number and try again</p>
            </div>
          ) : (
            orders.map(order => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Order #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig[order.status].bg}`}>
                      <StatusIcon className={`w-5 h-5 ${statusConfig[order.status].color}`} />
                      <span className={`font-semibold ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t mt-3 pt-3 flex justify-between items-center">
                      <span className="font-semibold text-lg">Total:</span>
                      <span className="font-bold text-2xl text-orange-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {order.delivery_date && (
                    <div className="mt-4 bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">
                        <strong>Delivery:</strong> {order.delivery_date}
                        {order.delivery_time && ` at ${order.delivery_time}`}
                      </p>
                    </div>
                  )}

                  {order.notes && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}