'use client';

import Link from 'next/link';
import { Eye, Calendar } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function ProductCard({ product, onView }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-orange-600">{formatPrice(product.price)}</span>
          <span className="text-xs text-gray-500 flex items-center">
            <Eye className="w-4 h-4 mr-1" /> {product.views || 0}
          </span>
        </div>
        {product.minLeadTime && (
          <p className="text-xs text-gray-500 mb-3">
            <Calendar className="w-3 h-3 inline mr-1" />
            Min {product.minLeadTime} days notice
          </p>
        )}
        <Link 
          href={`/products/${product.id}`}
          onClick={() => onView && onView(product.id)}
          className="block w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}