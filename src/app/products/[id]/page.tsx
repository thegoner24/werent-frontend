'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Reviews from '@/components/Reviews';

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

  reviewList: Array<{
    user: string;
    rating: number;
    comment: string;
    date: string;
  }>;
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

    },
    reviewList: [
      { user: "Sarah Johnson", rating: 5, comment: "Absolutely stunning! This gown was perfect for my wedding reception. The quality is exceptional and it fit like a dream.", date: "2024-01-15" },
      { user: "Emma Davis", rating: 4, comment: "Beautiful dress, great quality fabric. Shipping was a bit slow but worth the wait.", date: "2024-01-10" },
      { user: "Maria Rodriguez", rating: 5, comment: "Wore this to a charity gala and received so many compliments! The design is timeless.", date: "2024-01-08" },
      { user: "Jennifer Smith", rating: 4, comment: "Excellent rental experience. The dress was in perfect condition and the alterations were spot on.", date: "2024-01-05" },
      { user: "Amanda Wilson", rating: 5, comment: "This gown made me feel like a princess! The attention to detail is incredible.", date: "2024-01-02" },
      { user: "Lisa Thompson", rating: 4, comment: "Great value for a designer dress. The fit was perfect and the service was excellent.", date: "2023-12-28" },
      { user: "Rachel Green", rating: 5, comment: "Perfect for my engagement party! The dress exceeded my expectations.", date: "2023-12-25" },
      { user: "Michelle Brown", rating: 4, comment: "Lovely dress, very elegant. Would definitely rent again for special occasions.", date: "2023-12-20" },
      { user: "Nicole Taylor", rating: 5, comment: "Incredible quality and fit. This dress made my special day even more memorable.", date: "2023-12-18" },
      { user: "Stephanie White", rating: 4, comment: "Beautiful gown, perfect for formal events. The rental process was smooth and professional.", date: "2023-12-15" }
    ]
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

    },
    reviewList: [
      { user: "Jessica Parker", rating: 5, comment: "Perfect cocktail dress! Wore it to a corporate event and felt so confident.", date: "2024-01-14" },
      { user: "Ashley Miller", rating: 4, comment: "Great fit and comfortable to wear all evening. The fabric is high quality.", date: "2024-01-12" },
      { user: "Nicole Taylor", rating: 5, comment: "This dress is so versatile! Perfect for both business and social events.", date: "2024-01-09" },
      { user: "Stephanie White", rating: 4, comment: "Excellent rental service. The dress arrived on time and in perfect condition.", date: "2024-01-06" },
      { user: "Katherine Lee", rating: 5, comment: "Absolutely love this dress! The design is sophisticated and the fit was perfect.", date: "2024-01-03" },
      { user: "Victoria Clark", rating: 4, comment: "Great quality for the price. The dress looked expensive and felt comfortable.", date: "2023-12-30" },
      { user: "Danielle Hall", rating: 5, comment: "Wore this to my sister's wedding and got so many compliments! Highly recommend.", date: "2023-12-27" },
      { user: "Christine Adams", rating: 4, comment: "Perfect for a cocktail party. The dress is elegant and the service was great.", date: "2023-12-24" },
      { user: "Tiffany Scott", rating: 5, comment: "This dress made me feel beautiful! The rental process was smooth and easy.", date: "2023-12-21" },
      { user: "Melissa Johnson", rating: 4, comment: "Classic design that never goes out of style. Perfect for any formal occasion.", date: "2023-12-18" }
    ]
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

    },
    reviewList: [
      { user: "Olivia Martin", rating: 5, comment: "Gorgeous handbag! Perfect size and the quality is outstanding.", date: "2024-01-13" },
      { user: "Sophia Anderson", rating: 4, comment: "Beautiful bag, great for special occasions. The leather feels luxurious.", date: "2024-01-11" },
      { user: "Isabella Garcia", rating: 5, comment: "This bag completed my outfit perfectly! The design is classic and elegant.", date: "2024-01-08" },
      { user: "Ava Martinez", rating: 4, comment: "Excellent quality for a rental. The bag looked brand new and was perfect for my event.", date: "2024-01-05" },
      { user: "Mia Robinson", rating: 5, comment: "Love this handbag! It's the perfect accessory for any formal occasion.", date: "2024-01-02" },
      { user: "Charlotte Lewis", rating: 4, comment: "Great value for a designer bag. The rental process was seamless.", date: "2023-12-29" },
      { user: "Amelia Walker", rating: 5, comment: "This bag is stunning! Received many compliments and the quality is exceptional.", date: "2023-12-26" },
      { user: "Harper Young", rating: 4, comment: "Perfect size and style. The bag complemented my dress beautifully.", date: "2023-12-23" },
      { user: "Evelyn King", rating: 5, comment: "Absolutely love this handbag! The design is timeless and the quality is superb.", date: "2023-12-20" },
      { user: "Abigail Wright", rating: 4, comment: "Great rental experience. The bag was in perfect condition and arrived on time.", date: "2023-12-17" }
    ]
  },
  {
    id: 4,
    name: "Luxury Ball Gown",
    designer: "Versace",
    designerPhoto: "/team-4.jpg",
    category: "Evening Wear",
    price: 200,
    rating: 4.9,
    reviews: 15,
    availability: "Available",
    images: [
      "/team-4.jpg",
      "/team-1.jpg",
      "/team-2.jpg"
    ],
    description: "An opulent ball gown designed for the most prestigious events. Features luxurious fabrics and exquisite craftsmanship.",
    features: [
      "Luxury designer piece",
      "Hand-embroidered details",
      "Premium materials",
      "Perfect for galas",
      "Exclusive design"
    ],
    specifications: {
      "Material": "Silk taffeta",
      "Length": "Floor-length",
      "Closure": "Corset back",
      "Care": "Professional cleaning only",
      "Season": "All seasons",
      "Occasion": "Black-tie events"
    },
    reviewList: [
      { user: "Emma Thompson", rating: 5, comment: "Absolutely stunning! This gown was perfect for my wedding.", date: "2023-10-20" },
      { user: "Michael Brown", rating: 4, comment: "Beautiful design and quality. Highly recommend.", date: "2023-10-18" },
    ]

  },
  {
    id: 5,
    name: "Modern Cocktail Dress",
    designer: "Diane von Furstenberg",
    designerPhoto: "/team-1.jpg",
    category: "Cocktail",
    price: 95,
    rating: 4.5,
    reviews: 28,
    availability: "Available",
    images: [
      "/team-1.jpg",
      "/team-2.jpg",
      "/team-3.jpg"
    ],
    description: "A contemporary cocktail dress with a modern twist. Perfect for cocktail hours and evening parties.",
    features: [
      "Modern silhouette",
      "Versatile styling",
      "Comfortable fit",
      "Quality construction",
      "Timeless appeal"
    ],
    specifications: {
      "Material": "Crepe",
      "Length": "Above knee",
      "Closure": "Side zipper",
      "Care": "Dry clean recommended",
      "Season": "All seasons",
      "Occasion": "Cocktail parties"

    },
    reviewList: [
      { user: "Sophia Lee", rating: 5, comment: "Absolutely loved this dress! It fit like a glove.", date: "2023-10-21" },
      { user: "David Wilson", rating: 4, comment: "Very elegant and comfortable. Perfect for a cocktail event.", date: "2023-10-22" },
    ]

  },
  {
    id: 6,
    name: "Summer Casual Dress",
    designer: "Anthropologie",
    designerPhoto: "/team-2.jpg",
    category: "Casual",
    price: 65,
    rating: 4.3,
    reviews: 41,
    availability: "Available",
    images: [
      "/team-2.jpg",
      "/team-3.jpg",
      "/team-1.jpg"
    ],
    description: "A light and airy summer dress perfect for casual outings and weekend activities.",
    features: [
      "Lightweight fabric",
      "Breathable material",
      "Casual comfort",
      "Easy care",
      "Versatile styling"
    ],
    specifications: {
      "Material": "Linen blend",
      "Length": "Midi length",
      "Closure": "Button front",
      "Care": "Machine washable",
      "Season": "Spring/Summer",
      "Occasion": "Casual outings"

    },
    reviewList: [
      { user: "Emily Turner", rating: 4, comment: "Perfect summer dress! Light and comfortable, perfect for outdoor events.", date: "2024-01-12" },
      { user: "Madison Phillips", rating: 5, comment: "Love this dress! The fabric is breathable and the fit is flattering.", date: "2024-01-10" },
      { user: "Chloe Campbell", rating: 4, comment: "Great for summer parties. The dress is stylish and comfortable to wear.", date: "2024-01-07" },
      { user: "Zoe Parker", rating: 5, comment: "This dress is so pretty! Perfect for garden parties and summer weddings.", date: "2024-01-04" },
      { user: "Lily Evans", rating: 4, comment: "Excellent quality for the price. The dress looked expensive and felt comfortable.", date: "2024-01-01" },
      { user: "Hannah Edwards", rating: 5, comment: "Wore this to a beach wedding and it was perfect! Light and elegant.", date: "2023-12-28" },
      { user: "Layla Collins", rating: 4, comment: "Great summer dress. The fabric is high quality and the design is timeless.", date: "2023-12-25" },
      { user: "Scarlett Stewart", rating: 5, comment: "This dress made me feel beautiful! Perfect for summer occasions.", date: "2023-12-22" },
      { user: "Aria Sanchez", rating: 4, comment: "Lovely dress, very comfortable. Would definitely rent again for summer events.", date: "2023-12-19" },
      { user: "Ellie Morris", rating: 5, comment: "Perfect for outdoor events! The dress is elegant and the rental service was excellent.", date: "2023-12-16" }
    ]

  }
];

function ProductDetail({ params }: { params: Promise<{ id: string }> }) {

  const { id } = use(params);
  const product = mockProducts.find(p => p.id === parseInt(id));
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [rentalDays, setRentalDays] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  



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


        {/* Reviews Section */}
        {product.reviewList && (
          <Reviews 
            reviews={product.reviewList} 
            showSubmitForm={true}
            reviewsPerPage={3}
            onSubmitReview={async (reviewData) => {
              // In a real app, you would send this to your API
              console.log('Review submitted:', reviewData);
              alert('Review submitted successfully! (Check console for details)');
            }}
            onVoteHelpful={async (reviewId, isHelpful) => {
              // In a real app, you would update the helpful count in your API
              console.log('Vote helpful:', { reviewId, isHelpful });
              alert(`Marked review as ${isHelpful ? 'helpful' : 'not helpful'}`);
            }}
            onReportReview={async (reviewId, reason) => {
              // In a real app, you would send this to your moderation system
              console.log('Report review:', { reviewId, reason });
              alert('Review reported successfully! Our team will review it.');
            }}
            onModerateReview={async (reviewId, action) => {
              // In a real app, you would update the review status in your API
              console.log('Moderate review:', { reviewId, action });
              alert(`Review ${action}ed successfully!`);
            }}
            isAdmin={false} // Set to true for admin users
          />
        )}

        
        {/* Related Products */}
        <div className="border-t border-gray-200 p-8">
          <Container>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProducts
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`} className="group cursor-pointer">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-pink-100 text-[#ff6b98] text-xs font-medium px-2 py-1 rounded">
                          {relatedProduct.category}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          relatedProduct.availability === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {relatedProduct.availability}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#ff6b98] transition-colors">
                        {relatedProduct.name}
                      </h4>
                      <p className="text-sm text-gray-600">{relatedProduct.designer}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(relatedProduct.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-xs text-gray-600">
                            {relatedProduct.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-[#ff6b98]">${relatedProduct.price}/day</p>
                    </div>
                  </Link>
                ))
              }
            </div>
            {mockProducts.filter(p => p.category === product.category && p.id !== product.id).length === 0 && (
              <p className="text-gray-500 text-center py-8">No related products found in this category.</p>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;