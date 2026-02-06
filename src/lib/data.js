import { supabase } from './supabase';
import { Cake, UtensilsCrossed, Fish, Users } from 'lucide-react';


export const businessInfo = {
  name: "Delish Catering",
  hours: "Mon-Sat: 8AM - 8PM, Sun: Closed",
  location: "United Kingdom",
  phone: "+234 XXX XXX XXXX",
  whatsapp: "2349037789995" // Replace with actual number
};

export const categories = [
  { id: 'all', name: 'All Products', icon: UtensilsCrossed },
  { id: 'cakes', name: 'Cakes', icon: Cake },
  { id: 'pies', name: 'Meat Pies', icon: UtensilsCrossed },
  { id: 'catfish', name: 'Catfish', icon: Fish },
  { id: 'catering', name: 'Catering', icon: Users }
];


// Fetch functions
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}

export async function getProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  return data;
}

export async function getGallery() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
  return data;
}

export async function getReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  return data;
}

export async function addProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding product:', error);
    return null;
  }
  return data;
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating product:', error);
    return null;
  }
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  return true;
}

export async function addGalleryImage(image) {
  const { data, error } = await supabase
    .from('gallery')
    .insert([image])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding gallery image:', error);
    return null;
  }
  return data;
}

export async function incrementProductViews(id) {
  const { data, error } = await supabase.rpc('increment_views', { product_id: id });
  
  if (error) {
    console.error('Error incrementing views:', error);
  }
}

// Orders
export async function createOrder(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating order:', error);
    return null;
  }
  return data;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return data;
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date() })
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating order:', error);
    return null;
  }
  return data;
}

// Reviews
export async function getProductReviews(productId) {
  const { data, error } = await supabase
    .from('customer_reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('approved', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  return data;
}

export async function submitReview(reviewData) {
  const { data, error } = await supabase
    .from('customer_reviews')
    .insert([reviewData])
    .select()
    .single();
  
  if (error) {
    console.error('Error submitting review:', error);
    return null;
  }
  return data;
}

export async function getPendingReviews() {
  const { data, error } = await supabase
    .from('customer_reviews')
    .select('*, products(name, image)')
    .eq('approved', false)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching pending reviews:', error);
    return [];
  }
  return data;
}

export async function approveReview(reviewId) {
  const { data, error } = await supabase
    .from('customer_reviews')
    .update({ approved: true })
    .eq('id', reviewId)
    .select()
    .single();
  
  if (error) {
    console.error('Error approving review:', error);
    return null;
  }
  return data;
}

// Product Images
export async function getProductImages(productId) {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
  return data;
}

export async function addProductImage(imageData) {
  const { data, error } = await supabase
    .from('product_images')
    .insert([imageData])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding product image:', error);
    return null;
  }
  return data;
}

export async function deleteProductImage(imageId) {
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId);
  
  if (error) {
    console.error('Error deleting product image:', error);
    return false;
  }
  return true;
}

// Inventory Management Functions
export async function updateProductStock(productId, quantity) {
  const { data, error } = await supabase
    .from('products')
    .update({ stock_quantity: quantity })
    .eq('id', productId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating stock:', error);
    return null;
  }
  return data;
}

export async function decrementStock(productId, quantity) {
  // Get current stock
  const { data: product } = await supabase
    .from('products')
    .select('stock_quantity')
    .eq('id', productId)
    .single();

  if (product && product.stock_quantity >= quantity) {
    const { data, error } = await supabase
      .from('products')
      .update({ stock_quantity: product.stock_quantity - quantity })
      .eq('id', productId)
      .select()
      .single();
    
    return !error;
  }
  return false;
}

export async function getLowStockProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('track_inventory', true)
    .filter('stock_quantity', 'lte', 'low_stock_threshold')
    .order('stock_quantity', { ascending: true });
  
  if (error) {
    console.error('Error fetching low stock products:', error);
    return [];
  }
  return data;
}

