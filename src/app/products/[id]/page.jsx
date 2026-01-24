'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Minus, Calendar } from 'lucide-react';
import { getProduct, incrementProductViews } from '../../../lib/data';
import { useCart } from '../../../context/CartContext';
import { formatPrice } from '../../../lib/utils';
import CustomizationForm from '../../../components/CustomizationForm';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
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
    async function fetchProduct() {
      setLoading(true);
      const fetchedProduct = await getProduct(params.id);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        await incrementProductViews(params.id);
      }
      setLoading(false);
    }
    fetchProduct();
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
    alert('Added to cart!');
    setQuantity(1);
    setCustomization({
      size: '', flavor: '', inscription: '', design: '', guests: '',
      deliveryDate: '', deliveryTime: '', notes: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => router.push('/products')} className="mb-6 text-orange-600 hover:underline">
        ← Back to Products
      </button>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg" />
        </div>
        
        <div>
          <h2 className="text-4xl font-bold mb-4">{product.name}</h2>
          <p className="text-3xl text-orange-600 font-bold mb-6">{formatPrice(product.price)}</p>
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
            className="w-full bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 text-lg font-semibold"
          >
            Add to Cart - {formatPrice(product.price * quantity)}
          </button>
        </div>
      </div>
    </div>
  );
}