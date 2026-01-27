'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Mail, Phone as PhoneIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    
    // Get unique customers from orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('customer_name, customer_phone, customer_email, total, created_at')
      .order('created_at', { ascending: false });

    if (!error && orders) {
      // Group by phone number
      const customerMap = new Map();
      
      orders.forEach(order => {
        if (customerMap.has(order.customer_phone)) {
          const existing = customerMap.get(order.customer_phone);
          existing.total_orders++;
          existing.total_spent += parseFloat(order.total);
          existing.last_order = new Date(order.created_at) > new Date(existing.last_order) 
            ? order.created_at 
            : existing.last_order;
        } else {
          customerMap.set(order.customer_phone, {
            name: order.customer_name,
            phone: order.customer_phone,
            email: order.customer_email,
            total_orders: 1,
            total_spent: parseFloat(order.total),
            last_order: order.created_at
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
    }
    
    setLoading(false);
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sendWhatsAppMessage = (phone, name) => {
    const message = encodeURIComponent(`Hello ${name}! We have special offers for you at Delish Catering. Check out our latest products!`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={() => router.push('/admin')}
        className="flex items-center text-orange-600 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <h2 className="text-4xl font-bold mb-8">Customer Database</h2>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-2">Total Customers</p>
          <p className="text-3xl font-bold text-orange-600">{customers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-blue-600">
            {customers.reduce((sum, c) => sum + c.total_orders, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">
            {formatPrice(customers.reduce((sum, c) => sum + c.total_spent, 0))}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-2">Avg Order Value</p>
          <p className="text-3xl font-bold text-purple-600">
            {formatPrice(
              customers.reduce((sum, c) => sum + c.total_spent, 0) /
              customers.reduce((sum, c) => sum + c.total_orders, 0) || 0
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customer List */}
      {loading ? (
        <div className="text-center py-12">Loading customers...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold">Contact</th>
                  <th className="text-left py-4 px-6 font-semibold">Orders</th>
                  <th className="text-left py-4 px-6 font-semibold">Total Spent</th>
                  <th className="text-left py-4 px-6 font-semibold">Last Order</th>
                  <th className="text-left py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{customer.name}</p>
                          <p className="text-xs text-gray-500">
                            {customer.total_orders === 1 ? 'New Customer' : 
                             customer.total_orders >= 5 ? 'VIP Customer' : 'Regular Customer'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          {customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold">{customer.total_orders}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-green-600">
                        {formatPrice(customer.total_spent)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(customer.last_order).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => sendWhatsAppMessage(customer.phone, customer.name)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                      >
                        Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}