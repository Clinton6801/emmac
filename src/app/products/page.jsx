'use client';

import { useState } from 'react';
import { initialProducts, categories } from '../../lib/data';
import ProductCard from '../../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const incrementViews = (productId) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p
    ));
  };

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
            onView={incrementViews}
          />
        ))}
      </div>
    </div>
  );
}