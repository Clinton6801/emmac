'use client';

import { useState, useEffect } from 'react';
import { getProducts, incrementProductViews } from '../../lib/data';
import { categories } from '../../lib/data';
import ProductCard from '../../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleViewProduct = async (productId) => {
    await incrementProductViews(productId);
    // Update local state
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p
    ));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-8">Our Products</h2>
      
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2 rounded-full ${
              selectedCategory === cat.id 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onView={handleViewProduct}
          />
        ))}
      </div>
    </div>
  );
}