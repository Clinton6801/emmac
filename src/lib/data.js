import { supabase } from './supabase';

export const businessInfo = {
  name: "Delish Catering",
  hours: "Mon-Sat: 8AM - 8PM, Sun: Closed",
  location: "Abuja, FCT, Nigeria",
  phone: "+234 XXX XXX XXXX",
  whatsapp: "2348012345678" // Replace with actual number
};

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'cakes', name: 'Cakes' },
  { id: 'pies', name: 'Meat Pies' },
  { id: 'catfish', name: 'Catfish' },
  { id: 'catering', name: 'Catering' }
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

