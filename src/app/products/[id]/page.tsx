"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Container from '../../../components/ui/Container';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  specifications: {
    [key: string]: string;
  };
  features: string[];
  availability: string;
  rating: number;
  reviews: number;
  designer: string;
}

// Mock product data - in a real app, this would come from an API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Sequin Evening Gown',
    category: 'Evening Gowns',
    price: 75,
    description: 'A stunning sequin evening gown perfect for formal events and galas. This elegant piece features intricate beadwork and a flattering silhouette that will make you shine at any special occasion.',
    images: [
      '/team-1.jpg',
      '/team-2.jpg'
    ],
    specifications: {
      'Material': 'Sequined Tulle',
      'Size Range': 'XS - XL',
      'Length': 'Floor Length',
      'Neckline': 'V-Neck',
      'Closure': 'Back Zipper',
      'Care': 'Professional Cleaning Only'
    },
    features: [
      'Hand-sewn Sequins',
      'Flowing Tulle Skirt',
      'Adjustable Straps',
      'Built-in Bra Support',
      'Designer Quality'
    ],
    availability: 'Available',
    rating: 4.8,
    reviews: 156,
    designer: 'Vera Wang'
  },
  {
    id: '2',
    name: 'Strapless Ball Gown',
    category: 'Ball Gowns',
    price: 85,
    description: 'An exquisite strapless ball gown with a dramatic silhouette. Perfect for black-tie events, proms, and formal celebrations. Features a structured bodice and voluminous skirt.',
    images: [
      '/team-2.jpg',
      '/team-1.jpg'
    ],
    specifications: {
      'Material': 'Tulle and Satin',
      'Size Range': 'XS - XL',
      'Length': 'Floor Length',
      'Neckline': 'Strapless Sweetheart',
      'Closure': 'Corset Back Lacing',
      'Care': 'Professional Cleaning'
    },
    features: [
      'Structured Bodice',
      'Multi-layer Tulle Skirt',
      'Built-in Corset',
      'Hand-finished Seams',
      'Luxury Designer Piece'
    ],
    availability: 'Available',
    rating: 4.7,
    reviews: 203,
    designer: 'Elie Saab'
  },
  {
    id: '3',
    name: 'Beaded Cocktail Dress',
    category: 'Cocktail Dresses',
    price: 60,
    description: 'A sophisticated cocktail dress with intricate beadwork, perfect for semi-formal events and parties. Features a timeless design with modern elegant touches.',
    images: [
      '/team-3.jpg',
      '/team-4.jpg'
    ],
    specifications: {
      'Material': 'Beaded Chiffon',
      'Size Range': 'XS - XL',
      'Length': 'Knee Length',
      'Neckline': 'Round Neck',
      'Closure': 'Side Zipper',
      'Care': 'Gentle Hand Wash'
    },
    features: [
      'Hand-beaded Details',
      'Flowing Chiffon Fabric',
      'Comfortable Fit',
      'Versatile Styling',
      'Premium Quality'
    ],
    availability: 'Available',
    rating: 4.6,
    reviews: 89,
    designer: 'Marchesa'
  },
  {
    id: '4',
    name: 'Satin A-Line Dress',
    category: 'Cocktail Dresses',
    price: 55,
    description: 'An elegant satin A-line dress that flatters every figure. Perfect for cocktail parties, dinner events, and special celebrations. Classic design with contemporary appeal.',
    images: [
      '/team-4.jpg',
      '/team-3.jpg'
    ],
    specifications: {
      'Material': 'Luxury Satin',
      'Size Range': 'XS - XL',
      'Length': 'Midi Length',
      'Neckline': 'Boat Neck',
      'Closure': 'Hidden Back Zipper',
      'Care': 'Dry Clean Only'
    },
    features: [
      'Flattering A-Line Cut',
      'Luxurious Satin Fabric',
      'Timeless Design',
      'Comfortable Wear',
      'Versatile Styling'
    ],
    availability: 'Available',
    rating: 4.5,
    reviews: 124,
    designer: 'Valentino'
  }
];

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [rentalDays, setRentalDays] = useState(3);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchProduct = () => {
      const foundProduct = mockProducts.find(p => p.id === params.id);
      setProduct(foundProduct || null);
      setLoading(false);
    };

    // Simulate loading delay
    setTimeout(fetchProduct, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b98] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/" className="bg-[#ff6b98] text-white px-6 py-2 rounded-md hover:bg-[#e55a87] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * rentalDays;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <Container>
          <div className="py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#ff6b98] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-[#ff6b98] transition-colors">Products</Link>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </Container>
      </div>

      {/* Product Detail */}
      <Container>
        <div className="py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="flex space-x-2">
                    {product.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 bg-gray-100 rounded-md overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-[#ff6b98]' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Title and Price */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-pink-100 text-[#ff6b98] text-xs font-medium px-2.5 py-0.5 rounded">
                      {product.category}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      product.availability === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.availability}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <p className="text-sm text-gray-600 mb-4">By {product.designer}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-[#ff6b98]">${product.price}</p>
                    <p className="text-sm text-gray-500">per day</p>
                  </div>
                </div>

                {/* Rental Options */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <select 
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b98] focus:border-transparent"
                    >
                      <option value="">Select Size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rental Duration</label>
                    <select 
                      value={rentalDays}
                      onChange={(e) => setRentalDays(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b98] focus:border-transparent"
                    >
                      <option value={1}>1 day</option>
                      <option value={3}>3 days</option>
                      <option value={5}>5 days</option>
                      <option value={7}>7 days</option>
                    </select>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total ({rentalDays} days)</span>
                      <span className="text-xl font-bold text-[#ff6b98]">${totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-6">
                  <button 
                    disabled={!selectedSize}
                    className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
                      selectedSize 
                        ? 'bg-[#ff6b98] text-white hover:bg-[#e55a87]' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {selectedSize ? 'Rent Now' : 'Select Size to Continue'}
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-semibold hover:bg-gray-50 transition-colors">
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="border-t border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}