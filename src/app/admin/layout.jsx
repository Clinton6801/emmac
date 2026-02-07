import AdminNavigation from '../../components/AdminNavigation';
import { SessionProvider } from 'next-auth/react';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavigation />
      <main>{children}</main>
    </div>
  );
}