import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '../ui/Container';

export default function OfferBanner() {
  return (
    <section className="w-full py-16">
      <Container>
        <div className="bg-gradient-to-r from-[#1b3cfe] to-[#1b3cfe]/90 rounded-2xl overflow-hidden shadow-xl border border-[#1b3cfe]/10">
          <div className="flex flex-col md:flex-row items-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)" />
              </svg>
            </div>
            <div className="md:w-2/3 p-8 md:p-12 z-10">
              <span className="inline-block px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-black text-xs font-semibold rounded-full mb-4">LIMITED TIME</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Don't Miss Out on <span className="text-[#d3fe41]">Special Offers!</span></h2>
              <p className="text-white text-opacity-90 mb-8 max-w-lg">
                Subscribe to our newsletter to receive exclusive deals, photography tips, and early access to new equipment.
                Get 10% off your first rental when you sign up today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/offers" 
                  className="group bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-[#d3fe41]/90 hover:text-black transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  View Offers
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 relative h-60 md:h-auto overflow-hidden">
              <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 z-10 animate-pulse">
                <div className="relative h-64 w-64">
                  <Image
                    src="/light.svg"
                    alt="Studio Light"
                    width={200}
                    height={200}
                    className="object-contain drop-shadow-lg filter brightness-125"
                  />
                </div>
              </div>
              <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 z-10">
                <div className="relative h-64 w-64">
                  <Image
                    src="/light.svg"
                    alt="Studio Light"
                    width={200}
                    height={200}
                    className="object-contain drop-shadow-lg filter brightness-125"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d3fe41] to-transparent opacity-70"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#d3fe41] rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d3fe41] rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
