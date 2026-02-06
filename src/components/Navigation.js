'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Heart, Home, Package, Image as ImageIcon, Phone, HelpCircle, MapPin, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { businessInfo } from '@/lib/data';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { cart, setShowCart } = useCart();
  const { wishlist } = useWishlist();
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenu]);

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/about', label: 'About', icon: MapPin },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
    { href: '/orders', label: 'Track Order', icon: Search },
    { href: '/contact', label: 'Contact', icon: Phone },
    { href: '/wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length },
  ];

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
            <Link href="/about" className="hover:text-orange-600 transition">About</Link>
            <Link href="/faq" className="hover:text-orange-600 transition">FAQ</Link>
            <Link href="/orders" className="hover:text-orange-600 transition">Track Order</Link>
            <Link href="/contact" className="hover:text-orange-600 transition">Contact</Link>
          </div>
          
          {/* Icons */}
          <div className="flex items-center space-x-3">
            {/* Wishlist - Desktop */}
            <Link href="/wishlist" className="hidden md:block relative p-2 hover:bg-gray-100 rounded-full transition">
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button 
              onClick={() => setShowCart(true)} 
              className="relative p-2 hover:bg-gray-100 rounded-full transition touch-manipulation"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenu(!mobileMenu)} 
              className="md:hidden p-2 touch-manipulation"
              aria-label="Toggle menu"
            >
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Mobile Menu */}
      {mobileMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenu(false)}
          />
          
          {/* Menu Drawer */}
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white z-50 md:hidden overflow-y-auto">
            <div className="p-4 space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 p-4 rounded-lg transition touch-manipulation ${
                      isActive 
                        ? 'bg-orange-50 text-orange-600 font-semibold' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Footer */}
            <div className="border-t p-4 mt-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Need Help?</p>
                  <a
                    href={`https://wa.me/${businessInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 hover:underline"
                  >
                    <Phone className="w-5 h-5" />
                    Chat on WhatsApp
                  </a>
                </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}