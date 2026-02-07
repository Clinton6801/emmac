'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LayoutDashboard, Package, ShoppingBag, Users, Star, Archive, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminNavigation() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/admin" className="text-2xl font-bold text-orange-500">
            Admin Panel
          </Link>
          
          {/* Center Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link href="/admin" className="flex items-center gap-2 hover:text-orange-500 transition">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/admin/products" className="flex items-center gap-2 hover:text-orange-500 transition">
              <Package className="w-4 h-4" />
              Products
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-2 hover:text-orange-500 transition">
              <ShoppingBag className="w-4 h-4" />
              Orders
            </Link>
            <Link href="/admin/inventory" className="flex items-center gap-2 hover:text-orange-500 transition">
              <Archive className="w-4 h-4" />
              Inventory
            </Link>
            <Link href="/admin/customers" className="flex items-center gap-2 hover:text-orange-500 transition">
              <Users className="w-4 h-4" />
              Customers
            </Link>
            <Link href="/admin/reviews" className="flex items-center gap-2 hover:text-orange-500 transition">
              <Star className="w-4 h-4" />
              Reviews
            </Link>
            <Link href="/admin/gallery" className="flex items-center gap-2 hover:text-orange-500 transition">
  <ImageIcon className="w-4 h-4" />
  Gallery
</Link>
          </div>
          
          {/* User & Logout */}
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">
              {session?.user?.name || 'Admin'}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}