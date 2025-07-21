import React from 'react';
import Container from '../ui/Container';

export default function BrandLogos() {
  return (
    <section className="py-10 bg-gray-50">
      <Container>
        <div className="text-center mb-6">
          <h3 className="text-gray-500 text-sm font-medium">Featuring designer collections from</h3>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <div className="flex justify-center opacity-80 hover:opacity-100 transform hover:scale-110 duration-300">
            <div className="h-12 sm:h-14 bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent font-serif text-3xl sm:text-4xl font-bold">Vera Wang</div>
          </div>
          
          <div className="flex justify-center opacity-80 hover:opacity-100 transform hover:scale-110 duration-300">
            <div className="h-12 sm:h-14 bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent font-sans text-3xl sm:text-4xl font-bold">Elie Saab</div>
          </div>
          
          <div className="flex justify-center opacity-80 hover:opacity-100 transform hover:scale-110 duration-300">
            <div className="h-12 sm:h-14 bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent font-serif text-3xl sm:text-4xl italic font-bold">Marchesa</div>
          </div>
          
          <div className="flex justify-center opacity-80 hover:opacity-100 transform hover:scale-110 duration-300">
            <div className="h-12 sm:h-14 bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent font-serif text-3xl sm:text-4xl font-bold">Valentino</div>
          </div>
          
          <div className="flex justify-center opacity-80 hover:opacity-100 transform hover:scale-110 duration-300">
            <div className="h-12 sm:h-14 bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent font-sans text-3xl sm:text-4xl font-bold tracking-widest">DIOR</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
