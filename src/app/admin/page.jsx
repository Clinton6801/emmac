'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { getProducts, getGallery, addProduct, deleteProduct as removeProduct, addGalleryImage } from '../../lib/data';
import AdminAnalytics from '../../components/AdminAnalytics';
import AdminProductForm from '../../components/AdminProductform';
import ImageUpload from '../../components/imageUpload';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);  // Changed from initialProducts
  const [gallery, setGallery] = useState([]);    // Changed from initialGallery
  const [newGalleryItem, setNewGalleryItem] = useState({ image: '', title: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  async function fetchData() {
    setLoading(true);
    const fetchedProducts = await getProducts();
    const fetchedGallery = await getGallery();
    setProducts(fetchedProducts);
    setGallery(fetchedGallery);
    setLoading(false);
  }

  const handleLogin = () => {
    if (password === 'admin123') { // CHANGE THIS PASSWORD!
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleAddProduct = async (product) => {
    const newProduct = await addProduct(product);
    if (newProduct) {
      setProducts([newProduct, ...products]);
      alert('Product added successfully!');
    } else {
      alert('Error adding product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = await removeProduct(id);
      if (success) {
        setProducts(products.filter(p => p.id !== id));
        alert('Product deleted!');
      } else {
        alert('Error deleting product');
      }
    }
  };

  const handleAddGalleryImage = async () => {
    if (newGalleryItem.image && newGalleryItem.title) {
      const newImage = await addGalleryImage(newGalleryItem);
      if (newImage) {
        setGallery([newImage, ...gallery]);
        setNewGalleryItem({ image: '', title: '' });
        alert('Gallery image added!');
      } else {
        alert('Error adding image');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 mb-2"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full text-gray-600 hover:text-gray-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-8">Admin Dashboard</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <AdminAnalytics products={products} />
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              View Site
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdminProductForm onAddProduct={handleAddProduct} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold mb-4">Manage Products</h3>
        <div className="space-y-2">
          {products.map(product => (
            <div key={product.id} className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-600">₦{product.price.toLocaleString()} • {product.views || 0} views</p>
              </div>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
<div className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-2xl font-semibold mb-4">Add Gallery Image</h3>
  
  <ImageUpload 
    onUploadSuccess={(url) => setNewGalleryItem({...newGalleryItem, image: url})}
    buttonText="Upload gallery image"
  />
  
  <input
    type="text"
    placeholder="Image Title"
    value={newGalleryItem.title}
    onChange={(e) => setNewGalleryItem({...newGalleryItem, title: e.target.value})}
    className="border rounded px-3 py-2 w-full mt-4"
  />
  
  <button
    onClick={handleAddGalleryImage}
    className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
    disabled={!newGalleryItem.image || !newGalleryItem.title}
  >
    Add to Gallery
  </button>

  <div className="mt-6 grid md:grid-cols-3 gap-4">
    {gallery.map(item => (
      <div key={item.id} className="relative group">
        <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded" />
        <p className="text-sm mt-1">{item.title}</p>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}