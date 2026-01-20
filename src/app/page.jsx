import Link from 'next/link';
import { initialProducts, reviews } from '../lib/data';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const featuredProducts = initialProducts.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Delicious Moments, Delivered</h2>
          <p className="text-xl mb-8">Cakes, Catering & More for Your Special Occasions</p>
          <Link 
            href="/products"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Order Now
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Featured Products</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{review.text}"</p>
                <p className="font-semibold">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}