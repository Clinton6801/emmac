'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getProducts, incrementProductViews } from '../../lib/data';
import { categories } from '../../lib/data';
import ProductCard from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/SkeletonLoader';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [maxLeadTime, setMaxLeadTime] = useState(30);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Apply all filters
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchesLeadTime = !product.min_lead_time || product.min_lead_time <= maxLeadTime;
      
      return matchesCategory && matchesSearch && matchesPrice && matchesLeadTime;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  const handleViewProduct = async (productId) => {
    await incrementProductViews(productId);
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p
    ));
  };

  const resetFilters = () => {
    setPriceRange({ min: 0, max: 1000000 });
    setMaxLeadTime(30);
    setSortBy('newest');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">Our Products</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:col-span-1`}>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-orange-600 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="space-y-2">
                {categories.map(cat => {
                  const IconComponent = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                        selectedCategory === cat.id
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Price Range: ₦{priceRange.min.toLocaleString()} - ₦{priceRange.max.toLocaleString()}
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="5000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                    className="w-1/2 border rounded px-2 py-1 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 1000000 })}
                    className="w-1/2 border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Lead Time */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Max Lead Time: {maxLeadTime} days
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={maxLeadTime}
                onChange={(e) => setMaxLeadTime(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg mb-4">No products found</p>
              <button
                onClick={resetFilters}
                className="text-orange-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}