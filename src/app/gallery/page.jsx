'use client';

import { useState, useEffect } from 'react';
import { getGallery } from '../../lib/data';

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      setLoading(true);
      const fetchedGallery = await getGallery();
      setGallery(fetchedGallery);
      setLoading(false);
    }
    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-8">Our Portfolio</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {gallery.map(item => (
          <div key={item.id} className="relative group overflow-hidden rounded-lg shadow-lg">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-64 object-cover group-hover:scale-110 transition duration-300" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <p className="text-white font-semibold">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}