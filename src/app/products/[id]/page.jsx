'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Minus, Calendar, Star } from 'lucide-react';
import { getProduct, incrementProductViews, getProductReviews } from '../../../lib/data';
import { useCart } from '../../../context/CartContext';
import { formatPrice } from '../../../lib/utils';
import CustomizationForm from '../../../components/CustomizationForm';
import ReviewForm from '../../../components/ReviewForm';
import ReviewList from '../../../components/ReviewList';
import ImageGallery from '../../../components/ImageGallery';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [customization, setCustomization] = useState({
    size: '',
    flavor: '',
    inscription: '',
    design: '',
    guests: '',
    deliveryDate: '',
    deliveryTime: '',
    notes: ''
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [fetchedProduct, fetchedReviews] = await Promise.all([
        getProduct(params.id),
        getProductReviews(params.id)
      ]);
      const fetchedImages = await getProductImages(params.id);
setProductImages(fetchedImages);
      
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        await incrementProductViews(params.id);
      }
      setReviews(fetchedReviews);
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p>Product not found</p>
        <button onClick={() => router.push('/products')} className="text-orange-600">
          ← Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, customization);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
    });
    setQuantity(1);
    setCustomization({
      size: '', flavor: '', inscription: '', design: '', guests: '',
      deliveryDate: '', deliveryTime: '', notes: ''
    });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => router.push('/products')} className="mb-6 text-orange-600 hover:underline">
        ← Back to Products
      </button>
      
      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <div>
  {productImages.length > 0 ? (
    <ImageGallery images={productImages} />
  ) : (
    <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg" />
  )}
</div>
        
        <div>
          <h2 className="text-4xl font-bold mb-4">{product.name}</h2>
          <p className="text-3xl text-orange-600 font-bold mb-4">{formatPrice(product.price)}</p>
          
          {/* Rating Summary */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {product.min_lead_time && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
              <p className="text-sm">
                <Calendar className="w-4 h-4 inline mr-2" />
                Minimum {product.min_lead_time} days advance notice required
              </p>
            </div>
          )}

          {product.min_order && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
              <p className="text-sm">Minimum order: {product.min_order} guests</p>
            </div>
          )}

          <CustomizationForm 
            product={product}
            customization={customization}
            setCustomization={setCustomization}
          />

          <div className="flex items-center space-x-4 mb-6">
            <label className="font-medium">Quantity:</label>
            <div className="flex items-center border rounded">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 text-lg font-semibold transition transform hover:scale-105"
          >
            Add to Cart - {formatPrice(product.price * quantity)}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold">Customer Reviews</h3>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            {showReviewForm ? 'Hide Form' : 'Write a Review'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {showReviewForm && (
              <ReviewForm
                productId={product.id}
                productName={product.name}
                onReviewSubmitted={() => setShowReviewForm(false)}
              />
            )}
          </div>
          <div>
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}