'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '../lib/data';
import ProductCard from './ProductCard';

export default function RelatedProducts({ currentProductId, category, limit = 4 }) {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    async function fetchRelated() {
      const allProducts = await getProducts();
      const related = allProducts
        .filter(p => p.id !== currentProductId && p.category === category)
        .slice(0, limit);
      setRelatedProducts(related);
    }
    fetchRelated();
  }, [currentProductId, category, limit]);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-3xl font-bold mb-8">You Might Also Like</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}