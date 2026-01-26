'use client';

import { X, Plus, Minus, Trash2, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, generateWhatsAppMessage } from '../lib/utils';
import { businessInfo } from '../lib/data';
import { createOrder } from '../lib/data';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function CartSidebar() {
  const { cart, showCart, setShowCart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const handleRemoveFromCart = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleProceedToOrder = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setShowCustomerForm(true);
  };

  const sendToWhatsApp = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please enter your name and phone number');
      return;
    }

    // Save order to database
    const orderData = {
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_email: customerInfo.email || null,
      delivery_address: customerInfo.address || null,
      items: cart,
      total: getCartTotal(),
      status: 'pending'
    };

    const savedOrder = await createOrder(orderData);
    
    if (savedOrder) {
      toast.success('Order saved! Redirecting to WhatsApp...');
      
      // Generate WhatsApp message
      const message = generateWhatsAppMessage(cart, customerInfo);
      
      // Open WhatsApp
      setTimeout(() => {
        window.open(`https://wa.me/${businessInfo.whatsapp}?text=${message}`, '_blank');
        
        // Clear cart and form
        clearCart();
        setCustomerInfo({ name: '', phone: '', email: '', address: '' });
        setShowCustomerForm(false);
        setShowCart(false);
      }, 1000);
    } else {
      toast.error('Failed to save order. Please try again.');
    }
  };

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Your Cart</h3>
            <button onClick={() => setShowCart(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center mt-12">
                <p className="text-gray-500">Your cart is empty</p>
                <button 
                  onClick={() => setShowCart(false)}
                  className="mt-4 text-orange-600 hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : !showCustomerForm ? (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="border-b pb-4 transition hover:bg-gray-50 p-2 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                        {item.customization?.size && (
                          <p className="text-xs text-gray-500 mt-1">Size: {item.customization.size}</p>
                        )}
                        {item.customization?.flavor && (
                          <p className="text-xs text-gray-500">Flavor: {item.customization.flavor}</p>
                        )}
                        {item.customization?.deliveryDate && (
                          <p className="text-xs text-gray-500">Delivery: {item.customization.deliveryDate}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id, item.name)}
                        className="text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-100 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-100 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg mb-4">Your Information</h4>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  placeholder="Delivery Address (optional)"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  className="w-full border rounded px-3 py-2 h-20"
                />
                <button
                  onClick={() => setShowCustomerForm(false)}
                  className="text-orange-600 text-sm hover:underline"
                >
                  ← Back to cart
                </button>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-2xl font-bold text-orange-600">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
              {!showCustomerForm ? (
                <button
                  onClick={handleProceedToOrder}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
                >
                  Proceed to Order
                </button>
              ) : (
                <button
                  onClick={sendToWhatsApp}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition font-semibold"
                >
                  <Phone className="w-5 h-5" />
                  <span>Send Order via WhatsApp</span>
                </button>
              )}
              <p className="text-xs text-gray-500 text-center mt-2">
                {showCustomerForm ? 'Your order will be saved and sent to WhatsApp' : 'Secure checkout via WhatsApp'}
              </p>
            </div>
          )}
        </div>
      </div>

      {showCart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setShowCart(false)}
        />
      )}
    </>
  );
}