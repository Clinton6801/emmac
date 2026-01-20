'use client';

import { Calendar } from 'lucide-react';
import { getMinDeliveryDate } from '../lib/utils';

export default function CustomizationForm({ product, customization, setCustomization }) {
  if (!product.customizable) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-4">Customize Your Order</h3>
      
      {product.category === 'cakes' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Size</label>
            <select 
              value={customization.size}
              onChange={(e) => setCustomization({...customization, size: e.target.value})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select size</option>
              <option value="6 inch">6 inch (serves 8-10)</option>
              <option value="8 inch">8 inch (serves 15-20)</option>
              <option value="10 inch">10 inch (serves 25-30)</option>
              <option value="12 inch">12 inch (serves 40-50)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Flavor</label>
            <select 
              value={customization.flavor}
              onChange={(e) => setCustomization({...customization, flavor: e.target.value})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select flavor</option>
              <option value="Vanilla">Vanilla</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Red Velvet">Red Velvet</option>
              <option value="Fruit Cake">Fruit Cake</option>
              <option value="Coconut">Coconut</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Inscription</label>
            <input 
              type="text"
              value={customization.inscription}
              onChange={(e) => setCustomization({...customization, inscription: e.target.value})}
              placeholder="e.g., Happy Birthday Sarah!"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Design Preference</label>
            <textarea 
              value={customization.design}
              onChange={(e) => setCustomization({...customization, design: e.target.value})}
              placeholder="Describe your preferred design, colors, theme..."
              className="w-full border rounded px-3 py-2 h-24"
            />
          </div>
        </>
      )}

      {product.category === 'catering' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Number of Guests</label>
          <input 
            type="number"
            value={customization.guests}
            onChange={(e) => setCustomization({...customization, guests: e.target.value})}
            placeholder="e.g., 100"
            min={product.minOrder || 1}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Delivery Date</label>
        <input 
          type="date"
          value={customization.deliveryDate}
          onChange={(e) => setCustomization({...customization, deliveryDate: e.target.value})}
          className="w-full border rounded px-3 py-2"
          min={getMinDeliveryDate(product.minLeadTime || 0)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Preferred Delivery Time</label>
        <input 
          type="time"
          value={customization.deliveryTime}
          onChange={(e) => setCustomization({...customization, deliveryTime: e.target.value})}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Special Notes</label>
        <textarea 
          value={customization.notes}
          onChange={(e) => setCustomization({...customization, notes: e.target.value})}
          placeholder="Any additional requests or dietary requirements..."
          className="w-full border rounded px-3 py-2 h-24"
        />
      </div>
    </div>
  );
}