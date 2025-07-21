import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '../ui/Container';

export default function OfferBanner() {
  return (
    <section className="w-full py-16">
      <Container>
        <div className="bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 rounded-2xl overflow-hidden shadow-xl border border-[#ff6b98]/10">
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
              <span className="inline-block px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-black text-xs font-semibold rounded-full mb-4">EXCLUSIVE OFFER</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Elevate Your Style with <span className="text-white">Designer Dresses!</span></h2>
              <p className="text-white text-opacity-90 mb-8 max-w-lg">
                Subscribe to our newsletter to receive exclusive fashion tips, early access to new designer collections, and special event invitations.
                Get 15% off your first dress rental when you sign up today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/special-offers" 
                  className="group bg-white text-[#ff6b98] px-8 py-3 rounded-full font-medium hover:bg-pink-50 transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  View Special Offers
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 relative h-60 md:h-auto overflow-hidden">
              <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 z-10">
                <div className="relative h-64 w-64">
                  <Image
                    src="/dress-sparkle.png"
                    alt="Elegant Dress"
                    width={200}
                    height={200}
                    className="object-contain drop-shadow-lg"
                  />
                </div>
              </div>
              <div className="absolute -left-20 bottom-0 z-10">
                <div className="relative h-40 w-40">
                  <Image
                    src="/jewelry-sparkle.png"
                    alt="Elegant Jewelry"
                    width={120}
                    height={120}
                    className="object-contain drop-shadow-lg"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-200 to-transparent opacity-30"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-200 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-200 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
