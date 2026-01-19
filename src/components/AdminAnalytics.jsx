export default function AdminAnalytics({ products }) {
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
  const topProducts = [...products]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Analytics</h3>
      <div className="space-y-4">
        <div className="bg-orange-50 p-4 rounded">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-3xl font-bold text-orange-600">{products.length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-3xl font-bold text-blue-600">{totalViews}</p>
        </div>
        <h4 className="font-semibold mt-6 mb-2">Most Viewed Products</h4>
        {topProducts.map(p => (
          <div key={p.id} className="flex justify-between items-center border-b py-2">
            <span className="text-sm">{p.name}</span>
            <span className="text-sm font-semibold">{p.views || 0} views</span>
          </div>
        ))}
      </div>
    </div>
  );
}