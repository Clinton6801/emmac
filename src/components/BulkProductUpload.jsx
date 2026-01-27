'use client';

import { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import { addProduct } from '../lib/data';
import toast from 'react-hot-toast';

export default function BulkProductUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);

  const downloadTemplate = () => {
    const csvContent = `name,category,price,image,description,customizable,min_lead_time,min_order
Custom Birthday Cake,cakes,15000,https://example.com/image.jpg,Delicious custom cakes,true,3,
Meat Pies (Dozen),pies,3000,https://example.com/image.jpg,Freshly baked,false,1,`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    a.click();
    toast.success('Template downloaded!');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setUploading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const csvData = event.target.result;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        let successCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(',').map(v => v.trim());
          const product = {};

          headers.forEach((header, index) => {
            product[header] = values[index];
          });

          // Convert types
          product.price = parseFloat(product.price);
          product.customizable = product.customizable === 'true';
          product.min_lead_time = parseInt(product.min_lead_time) || 1;
          product.min_order = product.min_order ? parseInt(product.min_order) : null;
          product.views = 0;

          const result = await addProduct(product);
          if (result) {
            successCount++;
          } else {
            errorCount++;
          }
        }

        toast.success(`Uploaded ${successCount} products successfully!`);
        if (errorCount > 0) {
          toast.error(`Failed to upload ${errorCount} products`);
        }

        if (onUploadComplete) onUploadComplete();
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast.error('Failed to parse CSV file');
      } finally {
        setUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Bulk Product Upload</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 mb-4">
            Upload multiple products at once using a CSV file. 
            Download the template to see the required format.
          </p>
          
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            <Download className="w-4 h-4" />
            Download CSV Template
          </button>
        </div>

        <div>
          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-orange-500 transition">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <span className="text-lg font-medium mb-2">
              {uploading ? 'Uploading...' : 'Click to upload CSV'}
            </span>
            <span className="text-sm text-gray-500">
              CSV file with product data
            </span>
          </label>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Make sure your CSV follows the template format exactly. 
            Categories should be: cakes, pies, catfish, or catering.
          </p>
        </div>
      </div>
    </div>
  );
}