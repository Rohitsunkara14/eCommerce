// Run with: npm run seed
// Wipes the products collection and inserts sample data so the storefront
// has something to show right away.
require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.',
    price: 79.99,
    category: 'Electronics',
    brand: 'SoundWave',
    image: 'https://via.placeholder.com/400x400?text=Headphones',
    stock: 50,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with breathable mesh upper and cushioned sole.',
    price: 59.99,
    category: 'Footwear',
    brand: 'StrideFit',
    image: 'https://via.placeholder.com/400x400?text=Running+Shoes',
    stock: 80,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated 750ml water bottle that keeps drinks cold for 24 hours or hot for 12.',
    price: 19.99,
    category: 'Home & Kitchen',
    brand: 'HydroPro',
    image: 'https://via.placeholder.com/400x400?text=Water+Bottle',
    stock: 150,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart-rate monitor, GPS, and 7-day battery life.',
    price: 129.99,
    category: 'Electronics',
    brand: 'PulseTech',
    image: 'https://via.placeholder.com/400x400?text=Smart+Watch',
    stock: 40,
  },
  {
    name: 'Backpack',
    description: 'Water-resistant 25L backpack with a padded laptop sleeve, perfect for work or travel.',
    price: 44.99,
    category: 'Accessories',
    brand: 'UrbanCarry',
    image: 'https://via.placeholder.com/400x400?text=Backpack',
    stock: 60,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs, microwave and dishwasher safe.',
    price: 24.99,
    category: 'Home & Kitchen',
    brand: 'BrewCraft',
    image: 'https://via.placeholder.com/400x400?text=Coffee+Mugs',
    stock: 100,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seed();
