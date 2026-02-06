'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { businessInfo } from '../lib/data';

export default function Navigation() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { cart, setShowCart } = useCart();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-orange-600">
            {businessInfo.name}
          </Link>
          
          {/* Center Navigation - Desktop */}
         <div className="hidden md:flex space-x-8">
  <Link href="/" className="hover:text-orange-600 transition">Home</Link>
  <Link href="/products" className="hover:text-orange-600 transition">Products</Link>
  <Link href="/gallery" className="hover:text-orange-600 transition">Gallery</Link>
  <Link href="/orders" className="hover:text-orange-600 transition">Track Order</Link>
  <Link href="/contact" className="hover:text-orange-600 transition">Contact</Link>
  <Link href="/faq" className="hover:text-orange-600 transition">FAQ</Link>
  <Link href="/about" className="hover:text-orange-600 transition">About</Link>
  {/* Wishlist - Desktop */}
<Link href="/wishlist" className="hidden md:block relative p-2 hover:bg-gray-100 rounded-full transition touch-manipulation">
  <Heart className="w-6 h-6" />
  {wishlist.length > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
      {wishlist.length}
    </span>
  )}
</Link>
</div>
          
          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowCart(true)} 
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden">
              {mobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            <Link href="/" onClick={() => setMobileMenu(false)} className="block py-2 hover:text-orange-600">Home</Link>
            <Link href="/products" onClick={() => setMobileMenu(false)} className="block py-2 hover:text-orange-600">Products</Link>
            <Link href="/gallery" onClick={() => setMobileMenu(false)} className="block py-2 hover:text-orange-600">Gallery</Link>
            <Link href="/contact" onClick={() => setMobileMenu(false)} className="block py-2 hover:text-orange-600">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}