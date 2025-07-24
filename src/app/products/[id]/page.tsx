'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/ui/Container';

interface Product {
  id: number;
  name: string;
  designer: string;
  designerPhoto: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  availability: string;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Elegant Evening Gown",
    designer: "Valentino",
    designerPhoto: "/team-1.jpg",
    category: "Evening Wear",
    price: 150,
    rating: 4.8,
    reviews: 24,
    availability: "Available",
    images: [
      "/team-1.jpg",
      "/team-2.jpg",
      "/team-3.jpg"
    ],
    description: "A stunning floor-length evening gown perfect for formal events. Features intricate beadwork and a flowing silhouette that flatters every figure.",
    features: [
      "Premium silk fabric",
      "Hand-sewn beadwork",
      "Professional dry cleaning included",
      "Available in multiple sizes",
      "Perfect for galas and formal events"
    ],
    specifications: {
      "Material": "100% Silk",
      "Length": "Floor-length",
      "Closure": "Hidden zipper",
      "Care": "Dry clean only",
      "Season": "All seasons",
      "Occasion": "Formal events"
    }
  },
  {
    id: 2,
    name: "Classic Cocktail Dress",
    designer: "Chanel",
    designerPhoto: "/team-2.jpg",
    category: "Cocktail",
    price: 120,
    rating: 4.6,
    reviews: 18,
    availability: "Available",
    images: [
      "/team-2.jpg",
      "/team-1.jpg",
      "/team-3.jpg"
    ],
    description: "A timeless cocktail dress that embodies elegance and sophistication. Perfect for cocktail parties and semi-formal events.",
    features: [
      "Classic Chanel design",
      "Comfortable fit",
      "Versatile styling",
      "Premium quality fabric",
      "Suitable for various occasions"
    ],
    specifications: {
      "Material": "Wool blend",
      "Length": "Knee-length",
      "Closure": "Button closure",
      "Care": "Dry clean only",
      "Season": "Fall/Winter",
      "Occasion": "Semi-formal events"
    }
  },
  {
    id: 3,
    name: "Bohemian Maxi Dress",
    designer: "Free People",
    designerPhoto: "/team-3.jpg",
    category: "Casual",
    price: 80,
    rating: 4.4,
    reviews: 32,
    availability: "Available",
    images: [
      "/team-3.jpg",
      "/team-1.jpg",
      "/team-2.jpg"
    ],
    description: "A flowing bohemian maxi dress perfect for casual outings and summer events. Features beautiful floral patterns and comfortable fabric.",
    features: [
      "Flowy bohemian style",
      "Comfortable cotton blend",
      "Beautiful floral print",
      "Perfect for summer",
      "Easy to style"
    ],
    specifications: {
      "Material": "Cotton blend",
      "Length": "Maxi length",
      "Closure": "Pullover style",
      "Care": "Machine washable",
      "Season": "Spring/Summer",
      "Occasion": "Casual wear"
    }
  }
];

function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [rentalDays, setRentalDays] = useState(1);

  // Unwrap params using React.use()
  const resolvedParams = use(params);
  
  // Simulate loading and find product
  const product = mockProducts.find(p => p.id === parseInt(resolvedParams.id));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            href="/shop" 
            className="bg-[#ff6b98] text-white px-6 py-3 rounded-md hover:bg-[#e55a87] transition-colors"
          >
            Back to Shop
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
      <div className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Gallery - Mobile: Full Width, Desktop: With Margin */}
          <div className="relative lg:p-8">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 overflow-hidden lg:rounded-lg">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images - Overlay */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex space-x-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 bg-white rounded-md overflow-hidden border-2 transition-colors shadow-lg ${
                      selectedImage === index ? 'border-[#ff6b98]' : 'border-white hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-8 space-y-6">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              {/* Designer Banner Style */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-lg mb-4 border-l-4 border-[#ff6b98]">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ff6b98] shadow-md">
                    <Image
                      src={product.designerPhoto}
                      alt={product.designer}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">DESIGNER</p>
                    <p className="text-lg font-semibold text-gray-900">{product.designer}</p>
                  </div>
                </div>
              </div>
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
          <Container>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;