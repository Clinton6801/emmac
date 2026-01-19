import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Delish Catering - Cakes, Catering & More',
  description: 'Premium catering services, custom cakes, meat pies, and catfish in Abuja',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>{children}</main>
            <CartSidebar />
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}