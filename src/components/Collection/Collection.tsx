"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '../ui/Container';

interface CollectionItemProps {
  name: string;
  price: number;
  image: string;
  available: number;
  category: string;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ name, price, image, available }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 flex flex-col hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
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

export default function Collection() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'dslr', name: 'DSLR' },
    { id: 'mirrorless', name: 'Mirrorless' },
    { id: 'lighting', name: 'Lighting' },
    { id: 'video', name: 'Video Gear' }
  ];
  
  const collectionItems: CollectionItemProps[] = [
    {
      name: 'Canon EOS 77D',
      price: 30,
      image: '/camera.svg',
      available: 5,
      category: 'dslr'
    },
    {
      name: 'FujiFilm X-T4',
      price: 35,
      image: '/camera.svg',
      available: 3,
      category: 'mirrorless'
    },
    {
      name: 'Nikon D750',
      price: 40,
      image: '/camera.svg',
      available: 2,
      category: 'dslr'
    },
    {
      name: 'Canon D750',
      price: 45,
      image: '/camera.svg',
      available: 4,
      category: 'dslr'
    },
    {
      name: 'Nikon D850',
      price: 50,
      image: '/camera.svg',
      available: 1,
      category: 'dslr'
    },
    {
      name: 'OLYMPUS OM-D',
      price: 35,
      image: '/camera.svg',
      available: 3,
      category: 'mirrorless'
    },
    {
      name: 'Olympus PEN-F',
      price: 30,
      image: '/camera.svg',
      available: 6,
      category: 'mirrorless'
    },
    {
      name: 'Sony RX-100 VII',
      price: 25,
      image: '/camera.svg',
      available: 8,
      category: 'mirrorless'
    }
  ];
  
  const filteredItems = activeCategory === 'all' 
    ? collectionItems 
    : collectionItems.filter(item => item.category === activeCategory);

  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-purple-50">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">Explore Our Collection</h2>
            <p className="text-gray-600">Find the perfect camera equipment for your next project</p>
          </div>
          <Link 
            href="/collection" 
            className="group flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors"
          >
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-full">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                    : 'bg-transparent text-gray-700 hover:bg-white hover:shadow-sm'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="ml-auto">
            <button className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-100 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 group-hover:text-purple-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <CollectionItem key={index} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
