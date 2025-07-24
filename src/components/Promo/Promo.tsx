import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '../ui/Container';

interface PromoItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  available: number;
  discount?: number;
  occasion?: string;
}

const PromoItem: React.FC<PromoItemProps> = ({ id, name, price, image, available, discount, occasion }) => {
  return (
    <Link href={`/products/${id}`} className="block">
      <div className="relative bg-white rounded-xl shadow-lg border border-gray-100 p-5 flex flex-col hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
      {discount && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {discount}% OFF
        </div>
      )}
      <div className="h-36 w-full relative mb-3 group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b98] to-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-contain p-2 z-10 relative drop-shadow-md group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <h3 className="text-base font-medium text-gray-800">{name}</h3>
      {occasion && <p className="text-xs text-gray-500 mt-1">Perfect for: {occasion}</p>}
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{available} available</span>
        <span className="text-sm font-bold bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 bg-clip-text text-transparent">${price}/day</span>
      </div>
      </div>
    </Link>
  );
};

export default function Promo() {
  const promoItems: PromoItemProps[] = [
    {
      id: '1',
      name: 'Vera Wang Evening Gown',
      price: 85,
      image: '/team-1.jpg',
      available: 3,
      discount: 20,
      occasion: 'Galas & Black Tie Events'
    },
    {
      id: '3',
      name: 'Marchesa Cocktail Dress',
      price: 65,
      image: '/team-3.jpg',
      available: 5,
      discount: 15,
      occasion: 'Cocktail Parties'
    },
    {
      id: '2',
      name: 'Valentino Floral Maxi',
      price: 70,
      image: '/team-2.jpg',
      available: 2,
      discount: 10,
      occasion: 'Garden Weddings'
    },
    {
      id: '4',
      name: 'Dior Embellished Mini',
      price: 55,
      image: '/team-4.jpg',
      available: 4,
      discount: 25,
      occasion: 'Night Out'
    }
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-b from-[#ff6b98]/10 to-white">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 bg-clip-text text-transparent">Special Offers</h2>
              <span className="text-xs font-semibold bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 text-white px-3 py-1 rounded-full shadow-sm animate-pulse">LIMITED TIME</span>
            </div>
            <p className="text-gray-600">Exclusive discounts on our most sought-after designer dresses</p>
          </div>
          <div className="flex gap-2">
            <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-[#ff6b98] to-[#ff6b98]/90 text-white text-xs rounded-full shadow-sm">1</span>
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
            href="/special-offers" 
            className="group flex items-center gap-2 text-[#ff6b98] font-medium px-6 py-3 rounded-full border border-[#ff6b98] hover:bg-[#ff6b98]/10 hover:shadow-md transition-all duration-300"
          >
            View all special offers
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
