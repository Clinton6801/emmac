'use client';

import { useState } from 'react';
import ImageUpload from './imageUpload';

export default function AdminProductForm({ onAddProduct }) {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'cakes',
    price: '',
    image: '',
    description: '',
    customizable: false,
    min_lead_time: 1,
    min_order: 0
  });

  const handleSubmit = () => {
    if (newProduct.name && newProduct.price && newProduct.image) {
      onAddProduct({ 
        ...newProduct, 
        price: parseFloat(newProduct.price),
        views: 0
      });
      setNewProduct({
        name: '',
        category: 'cakes',
        price: '',
        image: '',
        description: '',
        customizable: false,
        min_lead_time: 1,
        min_order: 0
      });
      alert('Product added!');
    } else {
      alert('Please fill all required fields including image');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Add New Product</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Product Name *"
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <select
          value={newProduct.category}
          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
          className="border rounded px-3 py-2"
        >
          <option value="cakes">Cakes</option>
          <option value="pies">Meat Pies</option>
          <option value="catfish">Catfish</option>
          <option value="catering">Catering</option>
        </select>
        <input
          type="number"
          placeholder="Price (₦) *"
          value={newProduct.price}
          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Min Lead Time (days)"
          value={newProduct.min_lead_time}
          onChange={(e) => setNewProduct({...newProduct, min_lead_time: parseInt(e.target.value)})}
          className="border rounded px-3 py-2"
        />
        
        {/* Image Upload - Replaces URL input */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Product Image *</label>
          <ImageUpload 
            onUploadSuccess={(url) => setNewProduct({...newProduct, image: url})}
            buttonText="Click to upload product image"
          />
          {newProduct.image && (
            <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
          )}
        </div>

        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          className="border rounded px-3 py-2 md:col-span-2 h-24"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={newProduct.customizable}
            onChange={(e) => setNewProduct({...newProduct, customizable: e.target.checked})}
            className="w-4 h-4"
          />
          <span>Customizable</span>
        </label>
        <input
          type="number"
          placeholder="Min Order (for catering)"
          value={newProduct.min_order}
          onChange={(e) => setNewProduct({...newProduct, min_order: parseInt(e.target.value)})}
          className="border rounded px-3 py-2"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        disabled={!newProduct.image}
      >
        Add Product
      </button>
    </div>
  );
}