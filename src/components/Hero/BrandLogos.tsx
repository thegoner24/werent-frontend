import React from 'react';
import Container from '../ui/Container';

export default function BrandLogos() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-purple-50 to-white">
      <Container>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Trusted by</h3>
        <h2 className="text-2xl font-bold text-gray-900 mb-10">Premium Camera Brands</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Canon Logo */}
          <div className="flex justify-center grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 transform hover:scale-110 duration-300">
            <div className="h-12 sm:h-14 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent font-serif text-3xl sm:text-4xl font-bold">Canon</div>
          </div>
          
          {/* Fujifilm Logo */}
          <div className="flex justify-center grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 transform hover:scale-110 duration-300">
            <div className="h-12 sm:h-14 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent font-sans text-3xl sm:text-4xl font-bold">FUJIFILM</div>
          </div>
          
          {/* Nikon Logo */}
          <div className="flex justify-center grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 transform hover:scale-110 duration-300">
            <div className="h-12 sm:h-14 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent font-sans text-3xl sm:text-4xl italic font-bold">Nikon</div>
          </div>
          
          {/* Olympus Logo */}
          <div className="flex justify-center grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 transform hover:scale-110 duration-300">
            <div className="h-12 sm:h-14 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent font-serif text-3xl sm:text-4xl font-bold">OLYMPUS</div>
          </div>
          
          {/* Sony Logo */}
          <div className="flex justify-center grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 transform hover:scale-110 duration-300">
            <div className="h-12 sm:h-14 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent font-sans text-3xl sm:text-4xl font-bold tracking-widest">SONY</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
