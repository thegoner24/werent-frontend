import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '../ui/Container';

export default function Solution() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-[#ff6b98]/10">
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            <div className="relative h-[420px] w-full md:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 shadow-2xl">
  {/* Floating decorative element */}
  <div className="absolute z-30 left-1/2 top-1/3 -translate-x-1/2 animate-float pointer-events-none" style={{width:'180px', height:'80px'}}>
    <svg viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10,40 Q60,10 170,40 Q120,70 10,40 Z" fill="#ff6b98" fillOpacity="0.25" />
      <path d="M20,50 Q90,0 160,50 Q90,100 20,50 Z" fill="#ffb6d5" fillOpacity="0.18" />
    </svg>
  </div>
              {/* Animated decorative elements */}
              <div className="absolute top-4 left-4 w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#ff6b98]/90 opacity-40 animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#ff6b98]/90 opacity-30 animate-pulse delay-1000"></div>
              {/* Glassmorphism effect */}
              <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-0"></div>
              {/* Image with gradient overlay and inner glow */}
              <div className="absolute inset-0 z-10">
                <Image
                  src="https://images.unsplash.com/photo-1595155242986-634d2185ab55?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Designer Evening Dress"
                  fill
                  className="object-cover relative rounded-2xl shadow-2xl border-4 border-white/70"
                />
                {/* Gradient overlay for luxe effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#ff6b98]/20 to-transparent pointer-events-none"></div>
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{boxShadow:'inset 0 0 60px 10px #fff8fa'}}></div>
              </div>
              {/* Floating badges in front of the image */}
              <div className="absolute bottom-2 left-2 md:bottom-10 md:left-10 bg-white/90 backdrop-blur-sm p-3 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-2 border-gray-100 z-40 pointer-events-auto transform hover:scale-105 md:hover:scale-110 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b98] to-[#ff6b98]/90 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">Free Alterations</div>
                    <div className="text-sm font-bold text-gray-800">Included</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2 md:top-10 md:right-10 bg-white/90 backdrop-blur-sm p-3 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-2 border-gray-100 z-40 pointer-events-auto transform hover:scale-105 md:hover:scale-110 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b98] to-[#ff6b98]/90 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">Designer Quality</div>
                    <div className="text-sm font-bold text-gray-800">Guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Text content */}
          <div className="md:w-1/2">
            <div className="space-y-6">
              <div>
                <span className="inline-block px-4 py-1 bg-[#ff6b98]/90 text-white font-medium rounded-full text-sm mb-3">Why Choose Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  We are the <span className="relative inline-block">
                    <span className="relative z-10">perfect fit</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-[#ff6b98]/90 rounded-md -z-0"></span>
                  </span> for your special occasion
                </h2>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Welcome to DressRent! We're committed to providing high-quality designer dresses for all your special occasions. Our service is designed to be elegant, reliable, and affordable.
              </p>
              
              <ul className="space-y-5">
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">Designer dresses from renowned fashion houses</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">Complimentary alterations for the perfect fit</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">Convenient delivery and pickup options</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">Styling advice from fashion experts</span>
                </li>
              </ul>
              
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300"
              >
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
