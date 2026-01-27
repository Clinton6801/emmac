'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

const COLORS = ['#ea580c', '#fb923c', '#fdba74', '#fed7aa'];

export default function AdminDashboard({ orders, products }) {
  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Revenue by day (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const revenueByDay = last7Days.map(date => {
    const dayOrders = orders.filter(o => o.created_at.split('T')[0] === date);
    const revenue = dayOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue,
      orders: dayOrders.length
    };
  });

  // Orders by status
  const statusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length },
    { name: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length },
    { name: 'In Progress', value: orders.filter(o => o.status === 'in_progress').length },
    { name: 'Completed', value: orders.filter(o => o.status === 'completed').length }
  ].filter(item => item.value > 0);

  // Top products by views
  const topProducts = [...products]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
      views: p.views || 0
    }));

  // Products by category
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.category === product.category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ category: product.category, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">₦{totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">All time</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Total Orders</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-sm text-gray-600 mt-1">
            {pendingOrders} pending
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">Avg Order Value</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">₦{avgOrderValue.toLocaleString(0)}</p>
          <p className="text-sm text-gray-600 mt-1">Per order</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">Products</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          <p className="text-sm text-gray-600 mt-1">
            {products.reduce((sum, p) => sum + (p.views || 0), 0)} total views
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `₦${value.toLocaleString()}`}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#ea580c" 
                strokeWidth={2}
                name="Revenue (₦)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Status Pie */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Most Viewed Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#ea580c" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Products by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#fb923c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">#{order.id.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-sm">{order.customer_name}</td>
                  <td className="py-3 px-4 text-sm font-semibold">₦{parseFloat(order.total).toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}