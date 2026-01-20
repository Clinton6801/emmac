

export const businessInfo = {
  name: "Delish Catering",
  hours: "Mon-Sat: 8AM - 8PM, Sun: Closed",
  location: "Abuja, FCT, Nigeria",
  phone: "+234 XXX XXX XXXX",
  whatsapp: "2349037789995" // Replace with actual number
};

export const initialProducts = [
  {
    id: "1",
    name: "Custom Birthday Cake",
    category: "cakes",
    price: 15000,
    image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500",
    description: "Delicious custom cakes for your special day",
    customizable: true,
    minLeadTime: 3
  },
  {
    id: "2",
    name: "Meat Pies (Dozen)",
    category: "pies",
    price: 3000,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
    description: "Freshly baked meat pies",
    customizable: false,
    minLeadTime: 1
  },
  {
    id: "3",
    name: "Grilled Catfish",
    category: "catfish",
    price: 5000,
    image: "https://images.unsplash.com/photo-1580959375944-0b7b2f3f8c75?w=500",
    description: "Fresh grilled catfish with special seasoning",
    customizable: false,
    minLeadTime: 1
  },
  {
    id: "4",
    name: "Wedding Catering Package",
    category: "catering",
    price: 500000,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=500",
    description: "Complete catering service for weddings",
    customizable: true,
    minLeadTime: 14,
    minOrder: 50
  }
];

export const initialGallery = [
  { id: "1", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", title: "3-Tier Wedding Cake" },
  { id: "2", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500", title: "Chocolate Delight" },
  { id: "3", image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=500", title: "Corporate Event Spread" },
];

export const reviews = [
  { id: "1", name: "Adaobi M.", text: "Amazing cake for my daughter's birthday! Everyone loved it.", rating: 5 },
  { id: "2", name: "Chidi O.", text: "Best meat pies in town. Always fresh and tasty.", rating: 5 },
  { id: "3", name: "Funmi A.", text: "Professional catering service for our wedding. Highly recommend!", rating: 5 },
];

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'cakes', name: 'Cakes' },
  { id: 'pies', name: 'Meat Pies' },
  { id: 'catfish', name: 'Catfish' },
  { id: 'catering', name: 'Catering' }
];