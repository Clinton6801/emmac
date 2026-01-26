'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getProducts, incrementProductViews } from '../../lib/data';
import { categories } from '../../lib/data';
import ProductCard from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/SkeletonLoader';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Filter products by category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleViewProduct = async (productId) => {
    await incrementProductViews(productId);
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-8">Our Products</h2>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Filters */}
      {/* Category Filters with Icons */}
<div className="flex flex-wrap gap-4 mb-8">
  {categories.map(cat => {
    const IconComponent = cat.icon;
    return (
      <button
        key={cat.id}
        onClick={() => setSelectedCategory(cat.id)}
        className={`flex items-center gap-2 px-6 py-3 rounded-full transition ${
          selectedCategory === cat.id 
            ? 'bg-orange-600 text-white shadow-lg' 
            : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
        }`}
      >
        <IconComponent className="w-5 h-5" />
        {cat.name}
      </button>
    );
  })}
</div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onView={handleViewProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}