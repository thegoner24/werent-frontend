import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '../ui/Container';

// Custom animation styles
const animationStyles = {
  '@keyframes float': {
    '0%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
    '100%': { transform: 'translateY(0px)' }
  },
  '@keyframes floatDelayed': {
    '0%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-8px)' },
    '100%': { transform: 'translateY(0px)' }
  },
  '@keyframes shimmer': {
    '0%': { backgroundPosition: '-200px 0' },
    '100%': { backgroundPosition: '200px 0' }
  }
};

export default function Hero() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-[#ff6b98] to-[#ffd9e3]">
      <Container>
        {/* Discount Banner */}
        <div className="mb-4">
          <span className="bg-[#ffeaf0] text-gray-700 text-sm font-medium px-4 py-1 rounded-full inline-block">✨ Discount 15% for First-Time Renters!</span>
        </div>
        
        {/* Main Hero Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Dress to Impress – <span className="text-[#fff] relative">
                Boutique Dresses
                <span className="absolute bottom-1 left-0 w-full h-2 bg-[#fff] -z-10"></span>
              </span> for Every Occasion!
            </h1>
            
            <p className="text-white">
              Rent stunning designer dresses and accessories for your special events, 
              with a wide selection of styles, sizes, and designers to choose from.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/rent" className="bg-white text-[#ff6b98] px-8 py-3 rounded-full font-medium hover:bg-[#ffeaf0] transition-all hover:shadow-lg hover:shadow-[#ff6b98]/30 flex items-center gap-2">
                Browse Collection
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/how-to-rent" className="text-white px-8 py-3 rounded-full font-medium hover:text-[#ffeaf0] transition-all border border-gray-200 hover:border-[#ffeaf0] flex items-center">
                How It Works
              </Link>
            </div>
            
            {/* Customer Reviews */}
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-gray-100 w-fit">
              <div className="flex -space-x-3">
                <img src="https://randomuser.me/api/portraits/women/12.jpg" alt="Customer" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Customer" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Customer" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                <div className="w-10 h-10 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-xs font-medium text-pink-600">+62</div>
              </div>
              <div>
                <p className="text-sm font-medium">Our happy clients</p>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 ml-1 font-medium">4.9 (78 Reviews)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Dress Image with Floating Elements */}
          <div className="relative">
            <div className="relative h-[400px] w-full">
              {/* Main Dress Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[320px] h-[320px]">
                  {/* Background circles - updated to match red dress */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff3a4c] to-[#ff8a97] rounded-full opacity-80 animate-pulse"></div>
                  <div className="absolute inset-8 bg-gradient-to-tr from-[#ff3a4c] to-[#ff6b7a] rounded-full opacity-70"></div>
                  <div className="absolute inset-16 bg-[#ffebee] rounded-full shadow-inner"></div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#ffd9e3] rounded-full opacity-40" style={{ animation: 'float 3s ease-in-out infinite' }}></div>
                  <div className="absolute bottom-8 left-0 w-10 h-10 bg-[#ffd9e3] rounded-full opacity-60" style={{ animation: 'floatDelayed 4s ease-in-out infinite' }}></div>
                  
                  {/* Dress image - perfectly circular and centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[260px] h-[260px] rounded-full overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500 bg-[#ffebee]">
                      <Image
                        src="https://images.unsplash.com/photo-1554033842-d4f5ad6b1863?q=80&w=766&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Elegant Evening Dress"
                        fill
                        className="object-cover rounded-full"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 left-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm bg-white/90 transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#ff6b98]"></div>
                  <div className="text-sm font-medium text-[#ff6b98]">Vera Wang Gown</div>
                </div>
                <div className="text-sm font-bold text-[#ff6b98]">$85<span className="text-xs font-normal text-gray-500">/day</span></div>
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-xs ml-1 text-gray-500">5.0</span>
                </div>
                <div className="text-xs mt-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full inline-block">Available: 3</div>
              </div>
              
              {/* +300 Dresses Badge */}
              <div className="absolute top-8 right-8 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 backdrop-blur-sm bg-white/90 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#ff6b98]">+300</span>
                  <span className="text-sm font-medium text-gray-500">Dresses</span>
                </div>
              </div>
              
              {/* +150 Accessories Badge */}
              <div className="absolute bottom-12 left-8 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 backdrop-blur-sm bg-white/90 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#ff6b98]">+150</span>
                  <span className="text-sm font-medium text-gray-500">Accessories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
