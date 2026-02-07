'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { getGallery, addGalleryImage, } from '../../../lib/data';
import ImageUpload from '../../../components/imageUpload';
import toast from 'react-hot-toast';
import AdminAuthGuard from '../../../components/AdminAuthGuard';
import { supabase } from '../../../lib/supabase'
export default function AdminGalleryPage() {
  const router = useRouter();
  const [gallery, setGallery] = useState([]);
  const [newGalleryItem, setNewGalleryItem] = useState({ image: '', title: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    setLoading(true);
    const fetchedGallery = await getGallery();
    setGallery(fetchedGallery);
    setLoading(false);
  }

  const handleAddGalleryImage = async () => {
    if (newGalleryItem.image && newGalleryItem.title) {
      const newImage = await addGalleryImage(newGalleryItem);
      if (newImage) {
        setGallery([newImage, ...gallery]);
        setNewGalleryItem({ image: '', title: '' });
        toast.success('Gallery image added!');
      } else {
        toast.error('Error adding image');
      }
    } else {
      toast.error('Please provide both image and title');
    }
  };

  const handleDeleteImage = async (id) => {
    if (!confirm('Delete this image?')) return;

    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (!error) {
      setGallery(gallery.filter(item => item.id !== id));
      toast.success('Image deleted!');
    } else {
      toast.error('Failed to delete image');
    }
  };

  return (
    <AdminAuthGuard>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => router.push('/admin')}
          className="flex items-center text-orange-600 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <h2 className="text-4xl font-bold mb-8">Gallery Management</h2>

        {/* Add Gallery Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold mb-4">Add Gallery Image</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Upload Image</label>
            <ImageUpload 
              onUploadSuccess={(url) => setNewGalleryItem({...newGalleryItem, image: url})}
              buttonText="Upload gallery image"
            />
            {newGalleryItem.image && (
              <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
            )}
          </div>
          
          <input
            type="text"
            placeholder="Image Title"
            value={newGalleryItem.title}
            onChange={(e) => setNewGalleryItem({...newGalleryItem, title: e.target.value})}
            className="w-full border rounded px-3 py-2 mb-4"
          />
          
          <button
            onClick={handleAddGalleryImage}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            disabled={!newGalleryItem.image || !newGalleryItem.title}
          >
            Add to Gallery
          </button>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">Loading gallery...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {gallery.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden relative group">
                <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <p className="font-semibold">{item.title}</p>
                </div>
                <button
                  onClick={() => handleDeleteImage(item.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminAuthGuard>
  );
}