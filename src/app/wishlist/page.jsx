'use client';

import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    if (product.track_inventory && product.stock_quantity === 0) {
      toast.error('This product is out of stock');
      return;
    }
    addToCart(product, 1, {});
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all items from wishlist?')) {
                clearWishlist();
              }
            }}
            className="text-red-600 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <Heart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">
            Start adding your favorite products!
          </p>
          <Link
            href="/products"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(product => {
            const isOutOfStock = product.track_inventory && product.stock_quantity === 0;
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link href={`/products/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`w-full h-48 object-cover ${isOutOfStock ? 'opacity-60' : ''}`}
                  />
                </Link>
                
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-orange-600 transition">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-2xl font-bold text-orange-600 mb-4">
                    {formatPrice(product.price)}
                  </p>

                  {isOutOfStock && (
                    <p className="text-red-600 text-sm font-semibold mb-3">
                      Out of Stock
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded transition touch-manipulation ${
                        isOutOfStock
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition touch-manipulation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}