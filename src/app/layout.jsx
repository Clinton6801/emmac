import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '../components/Providers';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import ToastProvider from '../components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Delish Catering - Cakes, Catering & More',
  description: 'Premium catering services, custom cakes, meat pies, and catfish in Abuja',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ToastProvider />
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navigation />
            <main className="flex-1">{children}</main>
            <CartSidebar />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}