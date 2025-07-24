"use client";
import React, { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

// Mockup filter data
const categories = [
  "Evening Dresses",
  "Casual Wear",
  "Formal Attire",
  "Accessories",
  "Designer Brands",
  "Wedding Collection",
];
const brands = ["Gucci", "Prada", "Versace", "Dior", "Chanel", "Louis Vuitton"];
const priceRange = [0, 300];

// Mockup product data
const products = [
  {
    id: 1,
    name: "Elegant Evening Gown",
    price: 85.0,
    image: "/shop/mock-sofa.jpg",
    category: "Evening Dresses",
    brand: "Gucci",
    rating: 4.8,
    reviews: [
      { user: "Sarah Johnson", rating: 5, comment: "Absolutely stunning! Perfect for my wedding reception. The quality is exceptional and it fit like a dream.", date: "2024-01-15" },
      { user: "Emma Davis", rating: 4, comment: "Beautiful dress, great quality fabric. Shipping was a bit slow but worth the wait.", date: "2024-01-10" },
      { user: "Maria Rodriguez", rating: 5, comment: "Wore this to a charity gala and received so many compliments! The design is timeless.", date: "2024-01-08" },
      { user: "Jennifer Smith", rating: 4, comment: "Excellent rental experience. The dress was in perfect condition and the alterations were spot on.", date: "2024-01-05" },
      { user: "Amanda Wilson", rating: 5, comment: "This gown made me feel like a princess! The attention to detail is incredible.", date: "2024-01-02" },
      { user: "Lisa Thompson", rating: 4, comment: "Great value for a designer dress. The fit was perfect and the service was excellent.", date: "2023-12-28" },
      { user: "Rachel Green", rating: 5, comment: "Perfect for my engagement party! The dress exceeded my expectations.", date: "2023-12-25" },
      { user: "Michelle Brown", rating: 4, comment: "Lovely dress, very elegant. Would definitely rent again for special occasions.", date: "2023-12-20" }
    ]
  },
  {
    id: 2,
    name: "Cocktail Dress",
    price: 53.0,
    image: "/shop/mock-dining.jpg",
    category: "Formal Attire",
    brand: "Prada",
    rating: 4.7,
    reviews: [
      { user: "Jessica Parker", rating: 5, comment: "Perfect cocktail dress! Wore it to a corporate event and felt so confident.", date: "2024-01-14" },
      { user: "Ashley Miller", rating: 4, comment: "Great fit and comfortable to wear all evening. The fabric is high quality.", date: "2024-01-12" },
      { user: "Nicole Taylor", rating: 5, comment: "This dress is so versatile! Perfect for both business and social events.", date: "2024-01-09" },
      { user: "Stephanie White", rating: 4, comment: "Excellent rental service. The dress arrived on time and in perfect condition.", date: "2024-01-06" },
      { user: "Katherine Lee", rating: 5, comment: "Absolutely love this dress! The design is sophisticated and the fit was perfect.", date: "2024-01-03" },
      { user: "Victoria Clark", rating: 4, comment: "Great quality for the price. The dress looked expensive and felt comfortable.", date: "2023-12-30" },
      { user: "Danielle Hall", rating: 5, comment: "Wore this to my sister's wedding and got so many compliments! Highly recommend.", date: "2023-12-27" },
      { user: "Christine Adams", rating: 4, comment: "Perfect for a cocktail party. The dress is elegant and the service was great.", date: "2023-12-24" },
      { user: "Tiffany Scott", rating: 5, comment: "This dress made me feel beautiful! The rental process was smooth and easy.", date: "2023-12-21" }
    ]
  },
  {
    id: 3,
    name: "Designer Handbag",
    price: 32.0,
    image: "/shop/mock-chair.jpg",
    category: "Accessories",
    brand: "Chanel",
    rating: 4.6,
    reviews: [
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
    name: "Summer Dress",
    price: 28.0,
    image: "/shop/mock-bookshelf.jpg",
    category: "Casual Wear",
    brand: "Dior",
    rating: 4.5,
    reviews: [
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
  },
  // ...add more mock products as needed
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Skeleton component for product cards
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full animate-pulse">
      <div className="h-64 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="flex items-center mt-1">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 bg-gray-200 rounded-full"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-8 ml-1"></div>
        </div>
        <div className="flex justify-between items-end mt-4 pt-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
        </div>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [price, setPrice] = useState<number[]>(priceRange);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate loading when filters change
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [selectedCategory, selectedBrand, price]);

  // Filter logic (mock)
  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchBrand = selectedBrand ? product.brand === selectedBrand : true;
    const matchPrice = product.price >= price[0] && product.price <= price[1];
    return matchCategory && matchBrand && matchPrice;
  });

  return (
    <div className="font-sans min-h-screen bg-[#ffeaf0]">
      {/* Header with background gradient */}
      <div className="relative h-48 md:h-64 flex items-center justify-center bg-gradient-to-b from-[#ff6b98] to-[#ffd9e3]">
        <div className="absolute inset-0 opacity-20">
          {/* Pattern overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }} />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">SHOP</h1>
          <div className="text-sm opacity-90">
            <Link href="/" className="hover:underline">Home</Link> / <span>Shop</span>
          </div>
        </div>
      </div>
      
      {/* Discount Banner */}
      <div className="bg-white py-3 shadow-sm">
        <Container>
          <div className="text-center">
            <span className="bg-[#ffeaf0] text-[#ff6b98] text-sm font-medium px-4 py-1 rounded-full inline-block">
              ✨ Discount 15% for First-Time Renters! Use code: FIRSTRENT15
            </span>
          </div>
        </Container>
      </div>
      
      <Container className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="col-span-1 bg-white rounded-xl shadow-md p-6 mb-6 md:mb-0 h-fit">
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-[#ff6b98]">Categories</h2>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${selectedCategory === cat ? "bg-[#ffeaf0] text-[#ff6b98] font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-[#ff6b98]">Price Range</h2>
              <div className="px-2">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">${price[0]}</span>
                  <span className="text-gray-600">${price[1]}</span>
                </div>
                <input
                  type="range"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={price[1]}
                  onChange={e => setPrice([price[0], Number(e.target.value)])}
                  className="w-full accent-[#ff6b98]"
                />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4 text-[#ff6b98]">Designers</h2>
              <ul className="space-y-2">
                {brands.map((brand) => (
                  <li key={brand}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${selectedBrand === brand ? "bg-[#ffeaf0] text-[#ff6b98] font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                      onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                    >
                      {brand}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          
          {/* Product Grid */}
          <div className="col-span-1 md:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {isLoading ? "Loading Products..." : `${filteredProducts.length} Products`}
              </h2>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b98] focus:border-[#ff6b98]"
                defaultValue="newest"
                disabled={isLoading}
              >
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>

            {isLoading ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Display skeleton cards while loading */}
                {[...Array(6)].map((_, index) => (
                  <motion.div key={`skeleton-${index}`} variants={itemVariants}>
                    <ProductCardSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                  >
                    <Link href={`/products/${product.id}`} className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <button 
                          className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-sm hover:bg-[#ff6b98] transition-colors z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle wishlist functionality here
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[#ff6b98]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-gray-500 text-sm ml-1">
                            ({product.rating})
                          </span>
                        </div>
                        <div className="mt-3 flex items-end justify-between">
                          <p className="text-lg font-semibold text-gray-900">
                            ${product.price.toFixed(2)}
                            <span className="text-sm text-gray-500">/day</span>
                          </p>
                          <button 
                            className="bg-gradient-to-r from-[#ff6b98] to-[#ffd9e3] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#ff5c8d] hover:to-[#ff7fa0] transition-colors duration-300"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Handle rent now functionality here
                            }}
                          >
                            Rent Now
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">😕</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedBrand(null);
                    setPrice(priceRange);
                  }}
                  className="bg-gradient-to-r from-[#ff6b98] to-[#ffd9e3] text-white px-6 py-2 rounded-lg font-medium hover:from-[#ff5c8d] hover:to-[#ff7fa0] transition-colors duration-300"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ShopPage;
