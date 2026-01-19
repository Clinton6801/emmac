import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="mb-2">© 2026 Delish Catering. All rights reserved.</p>
        <p className="text-sm text-gray-400">
          <Link href="/admin" className="hover:text-white">Admin</Link>
        </p>
      </div>
    </footer>
  );
}