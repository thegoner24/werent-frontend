import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '../ui/Container';

interface PackageProps {
  title: string;
  description: string;
  image: string;
  price: number;
  buttonText: string;
  buttonLink: string;
  featured?: boolean;
}

const PackageCard: React.FC<PackageProps> = ({ 
  title, 
  description, 
  image, 
  price, 
  buttonText, 
  buttonLink,
  featured = false
}) => {
  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg border ${featured ? 'border-purple-200' : 'border-gray-100'} hover:shadow-xl transition-all duration-300`}>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8">
          {featured && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              FEATURED PACKAGE
            </div>
          )}
          <h3 className={`text-2xl font-bold mb-3 ${featured ? 'bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent' : 'text-gray-900'}`}>{title}</h3>
          <p className={`text-sm mb-6 ${featured ? 'text-gray-600' : 'text-gray-600'}`}>{description}</p>
          <div className="flex items-center gap-2 mb-6">
            <span className={`text-2xl font-bold ${featured ? 'bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent' : 'text-gray-900'}`}>${price}</span>
            <span className="text-gray-500 text-sm">/day</span>
          </div>
          <Link 
            href={buttonLink}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium ${
              featured 
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:shadow-lg' 
                : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:shadow-lg'
            } transition-all duration-300 hover:scale-105`}
          >
            {buttonText}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        <div className="md:w-1/2 h-64 md:h-auto relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default function Packages() {
  const packages: PackageProps[] = [
    {
      title: "Standard Camera Package",
      description: "Perfect for beginners. Includes camera body, standard lens, memory card, and basic accessories.",
      image: "/camera.svg",
      price: 45,
      buttonText: "Rent Now",
      buttonLink: "/packages/standard"
    },
    {
      title: "Premium Camera Package",
      description: "Professional-grade equipment with multiple lenses, lighting gear, and advanced accessories.",
      image: "/camera.svg",
      price: 95,
      buttonText: "Rent Now",
      buttonLink: "/packages/premium",
      featured: true
    }
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-b from-purple-50 to-white">
      <Container>
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent mb-3">Camera Packages</h2>
          <p className="text-gray-600 max-w-2xl">Choose from our carefully curated camera packages designed for every type of photography project</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 mt-8">
          {packages.map((pkg, index) => (
            <PackageCard key={index} {...pkg} />
          ))}
        </div>
      </Container>
    </section>
  );
}
