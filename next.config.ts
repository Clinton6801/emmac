import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'], // Add your image domains
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig

