'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Check, X } from 'lucide-react';
import { getPendingReviews, approveReview, supabase } from '../../../lib/data';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    const fetchedReviews = await getPendingReviews();
    setReviews(fetchedReviews);
    setLoading(false);
  }

  const handleApprove = async (reviewId) => {
    const result = await approveReview(reviewId);
    if (result) {
      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success('Review approved!');
    } else {
      toast.error('Failed to approve review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Delete this review?')) return;

    const { error } = await supabase
      .from('customer_reviews')
      .delete()
      .eq('id', reviewId);

    if (!error) {
      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success('Review deleted');
    } else {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={() => router.push('/admin')}
        className="flex items-center text-orange-600 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <h2 className="text-4xl font-bold mb-8">Review Management</h2>

      {loading ? (
        <div className="text-center py-12">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <Check className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <p className="text-gray-500 text-lg">No pending reviews</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">
                        {review.customer_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{review.customer_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">for {review.products.name}</span>
                  </div>

                  <p className="text-gray-700 mb-4">{review.review_text}</p>

                  <div className="flex items-center gap-2">
                    <img 
                      src={review.products.image} 
                      alt={review.products.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <p className="text-sm text-gray-600">{review.products.name}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                    title="Approve"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                    title="Delete"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}