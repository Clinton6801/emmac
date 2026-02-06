'use client';

import Link from 'next/link';
import { Eye, Calendar, AlertTriangle, Heart } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onView }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isFavorite, setIsFavorite] = useState(isInWishlist(product.id));

  const handleClick = () => {
    if (onView) {
      onView(product.id);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      removeFromWishlist(product.id);
      setIsFavorite(false);
    } else {
      addToWishlist(product);
      setIsFavorite(true);
    }
  };

  const isOutOfStock = product.track_inventory && product.stock_quantity === 0;
  const isLowStock = product.track_inventory && product.stock_quantity > 0 && product.stock_quantity <= (product.low_stock_threshold || 5);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition relative">
      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition touch-manipulation"
      >
        <Heart 
          className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Out of Stock
        </div>
      )}
      {isLowStock && (
        <div className="absolute top-3 left-3 z-10 bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Only {product.stock_quantity} left
        </div>
      )}

      <img 
        src={product.image} 
        alt={product.name} 
        className={`w-full h-48 object-cover ${isOutOfStock ? 'opacity-60' : ''}`}
      />
      
      <div className="p-4">
        <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-orange-600">{formatPrice(product.price)}</span>
          <span className="text-xs text-gray-500 flex items-center">
            <Eye className="w-4 h-4 mr-1" /> {product.views || 0}
          </span>
        </div>
        {product.min_lead_time && (
          <p className="text-xs text-gray-500 mb-3">
            <Calendar className="w-3 h-3 inline mr-1" />
            Min {product.min_lead_time} days notice
          </p>
        )}
        <Link 
          href={`/products/${product.id}`}
          onClick={handleClick}
          className={`block w-full text-white py-2 rounded text-center transition ${
            isOutOfStock 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'View Details'}
        </Link>
      </div>
    </div>
  );
}