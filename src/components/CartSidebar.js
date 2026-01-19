'use client';

import { X, Plus, Minus, Trash2, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, generateWhatsAppMessage } from '../lib/utils';
import { businessInfo } from '../lib/data';

export default function CartSidebar() {
  const { cart, showCart, setShowCart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const sendToWhatsApp = () => {
    const message = generateWhatsAppMessage(cart);
    window.open(`https://wa.me/${businessInfo.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform z-50 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Your Cart</h3>
            <button onClick={() => setShowCart(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center mt-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="border-b pb-4">
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
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
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
              <button
                onClick={sendToWhatsApp}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Order via WhatsApp</span>
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                You'll be redirected to WhatsApp to complete your order
              </p>
            </div>
          )}
        </div>
      </div>

      {showCart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowCart(false)}
        />
      )}
    </>
  );
}