import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '../ui/Container';

interface PromoItemProps {
  name: string;
  price: number;
  image: string;
  available: number;
  discount?: number;
}

const PromoItem: React.FC<PromoItemProps> = ({ name, price, image, available, discount }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-lg border border-gray-100 p-5 flex flex-col hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      {discount && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {discount}% OFF
        </div>
      )}
      <div className="h-36 w-full relative mb-3 group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-contain p-2 z-10 relative drop-shadow-md group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <h3 className="text-base font-medium text-gray-800">{name}</h3>
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{available} available</span>
        <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">${price}/day</span>
      </div>
    </div>
  );
};

export default function Promo() {
  const promoItems: PromoItemProps[] = [
    {
      name: 'Canon EOS 77D',
      price: 30,
      image: '/camera.svg',
      available: 5,
      discount: 20
    },
    {
      name: 'Benro Tripod',
      price: 15,
      image: '/tripod.svg',
      available: 8,
      discount: 15
    },
    {
      name: 'Nikon D3300',
      price: 25,
      image: '/camera.svg',
      available: 3,
      discount: 10
    },
    {
      name: 'Lume Cube Pro',
      price: 10,
      image: '/light.svg',
      available: 12,
      discount: 25
    }
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-b from-purple-50 to-white">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">Hot Deals</h2>
              <span className="text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full shadow-sm animate-pulse">SALE ENDS IN 2 DAYS</span>
            </div>
            <p className="text-gray-600">Exclusive discounts on our most popular camera equipment</p>
          </div>
          <div className="flex gap-2">
            <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs rounded-full shadow-sm">1</span>
            <span className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 text-xs rounded-full hover:bg-gray-300 transition-colors cursor-pointer">2</span>
            <span className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 text-xs rounded-full hover:bg-gray-300 transition-colors cursor-pointer">3</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {promoItems.map((item, index) => (
            <PromoItem key={index} {...item} />
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Link 
            href="/promo" 
            className="group flex items-center gap-2 text-purple-600 font-medium px-6 py-3 rounded-full border border-purple-200 hover:bg-purple-50 hover:shadow-md transition-all duration-300"
          >
            View all deals
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
