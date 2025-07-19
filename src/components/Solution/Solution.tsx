import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '../ui/Container';

export default function Solution() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-purple-50">
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            <div className="relative h-[320px] w-full md:h-[450px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-lg">
              {/* Background decorative elements */}
              <div className="absolute top-8 left-8 w-24 h-24 rounded-full bg-purple-100 opacity-40"></div>
              <div className="absolute bottom-12 right-12 w-32 h-32 rounded-full bg-purple-200 opacity-30"></div>
              
              <Image
                src="/camera.svg"
                alt="Professional Camera"
                fill
                className="object-contain p-8 z-10 relative drop-shadow-xl hover:scale-105 transition-transform duration-500"
              />
              
              {/* Delivery badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">Delivery Time</div>
                    <div className="text-sm font-bold text-gray-800">24 Hours</div>
                  </div>
                </div>
              </div>
              
              {/* Quality badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">Quality Check</div>
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
                <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 font-medium rounded-full text-sm mb-3">Why Choose Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  We are the <span className="relative inline-block">
                    <span className="relative z-10">solution</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-purple-100 rounded-md -z-0"></span>
                  </span> for your photography needs
                </h2>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Welcome to CamRent! We're committed to providing high-quality photography equipment for all your creative needs. Our service is designed to be simple, reliable, and affordable.
              </p>
              
              <ul className="space-y-5">
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">Professional-grade equipment for all skill levels</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">Flexible rental periods to suit your schedule</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">Fast delivery and hassle-free returns</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">Expert support to help you choose the right equipment</span>
                </li>
              </ul>
              
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300"
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
