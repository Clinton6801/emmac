'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '../components/Providers';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import ToastProvider from '../components/ToastProvider';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ToastProvider />
          <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Only show customer navigation if NOT on admin routes */}
            {!isAdminRoute && <Navigation />}
            
            <main className="flex-1">{children}</main>
            
            {/* Only show cart and footer if NOT on admin routes */}
            {!isAdminRoute && (
              <>
                <CartSidebar />
                <Footer />
              </>
            )}
          </div>
        </Providers>
      </body>
    </html>
  );
}