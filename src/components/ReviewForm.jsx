'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { submitReview } from '../lib/data';
import toast from 'react-hot-toast';

export default function ReviewForm({ productId, productName, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!formData.name || !formData.review) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    const reviewData = {
      product_id: productId,
      customer_name: formData.name,
      customer_email: formData.email || null,
      rating: rating,
      review_text: formData.review,
      approved: false
    };

    const result = await submitReview(reviewData);

    if (result) {
      toast.success('Review submitted! It will appear after approval.');
      setRating(0);
      setFormData({ name: '', email: '', review: '' });
      if (onReviewSubmitted) onReviewSubmitted();
    } else {
      toast.error('Failed to submit review. Please try again.');
    }

    setSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Rating *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating === 5 && '⭐ Excellent!'}
              {rating === 4 && '⭐ Very Good'}
              {rating === 3 && '⭐ Good'}
              {rating === 2 && '⭐ Fair'}
              {rating === 1 && '⭐ Poor'}
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email (optional)</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Review *</label>
          <textarea
            value={formData.review}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
            className="w-full border rounded px-3 py-2 h-32"
            placeholder={`Share your experience with ${productName}...`}
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}