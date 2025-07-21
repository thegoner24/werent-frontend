import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../../components/Footer/Footer';
import Container from '../../components/ui/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us | Dress Boutique - Designer Dress Rentals",
  description: "Learn about Dress Boutique's story, mission, and the team behind the premier designer dress rental service.",
};

export default function AboutUs() {
  return (
    <div className="font-sans min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="w-full py-16 bg-gradient-to-b from-[#ff6b98] to-[#ffd1dc]">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
                About <span className="text-white relative">
                  Dress Boutique
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-white/50 -z-10"></span>
                </span>
              </h1>
              <p className="text-white text-lg mb-8">
                The premier destination for designer dress rentals.
                Elegant attire for every special occasion.
              </p>
            </div>
          </Container>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Founded in 2020, Dress Boutique was born from a simple idea: make high-quality designer 
                    dresses accessible to everyone. Our founder, a fashion enthusiast with a background in luxury retail, 
                    was frustrated by the high costs of designer dresses that were often worn just once.
                  </p>
                  <p>
                    What started as a small collection of curated dresses shared among friends has grown 
                    into the premier dress rental service with over 500 designer pieces and 200 accessories 
                    available nationwide.
                  </p>
                  <p>
                    Today, Dress Boutique serves thousands of fashion-forward clients, from those attending their 
                    first gala to celebrities needing statement pieces for red carpet events.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ff6b98] rounded-full opacity-30"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#ffd1dc] rounded-full opacity-20"></div>
                <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="/about-story.jpg"
                    alt="Dress Boutique Story"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Our Mission Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg">
                We believe that everyone deserves to feel extraordinary in designer fashion without 
                the burden of ownership. Our mission is to democratize luxury fashion by providing affordable, 
                flexible, and hassle-free dress rentals for every special occasion.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission Card 1 */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-[#ff6b98]/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ff6b98]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Designer Collection</h3>
                <p className="text-gray-600">
                  We curate a diverse inventory of high-quality designer dresses and accessories from top fashion houses, 
                  ensuring you always look stunning for your special occasion.
                </p>
              </div>
              
              {/* Mission Card 2 */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-[#ff6b98]/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ff6b98]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Affordable Luxury</h3>
                <p className="text-gray-600">
                  Our flexible rental options and competitive pricing make designer fashion 
                  accessible to everyone, from first-time gala attendees to red carpet regulars.
                </p>
              </div>
              
              {/* Mission Card 3 */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-[#ff6b98]/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ff6b98]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Personalized Service</h3>
                <p className="text-gray-600">
                  From browsing to styling advice, delivery and return, we've crafted every step of the rental process 
                  to provide a luxurious, personalized experience for our clients.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Meet Our Team</h2>
              <p className="text-gray-600">
                Our passionate team of fashion enthusiasts and stylists is dedicated to providing you with the best 
                designer dresses and personalized service for your special occasions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-[#1b3cfe]/20">
                  <Image
                    src="/team-1.jpg"
                    alt="Team Member"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Sophia Chen</h3>
                <p className="text-[#ff6b98] font-medium mb-2">Founder & CEO</p>
                <p className="text-gray-600 text-sm">
                  Former luxury fashion buyer with over 15 years of experience and a passion for making 
                  designer fashion accessible to everyone.
                </p>
              </div>
              
              {/* Team Member 2 */}
              <div className="text-center">
                <div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-[#1b3cfe]/20">
                  <Image
                    src="/team-2.jpg"
                    alt="Team Member"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Olivia Taylor</h3>
                <p className="text-[#ff6b98] font-medium mb-2">Style Director</p>
                <p className="text-gray-600 text-sm">
                  Former celebrity stylist ensuring our collection is always on-trend and perfectly curated for every occasion.
                </p>
              </div>
              
              {/* Team Member 3 */}
              <div className="text-center">
                <div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-[#1b3cfe]/20">
                  <Image
                    src="/team-3.jpg"
                    alt="Team Member"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">James Rodriguez</h3>
                <p className="text-[#ff6b98] font-medium mb-2">Operations Director</p>
                <p className="text-gray-600 text-sm">
                  Logistics expert with deep knowledge of inventory management and a commitment to perfect service delivery.
                </p>
              </div>
              
              {/* Team Member 4 */}
              <div className="text-center">
                <div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-[#1b3cfe]/20">
                  <Image
                    src="/team-4.jpg"
                    alt="Team Member"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Emma Wilson</h3>
                <p className="text-[#ff6b98] font-medium mb-2">Client Experience</p>
                <p className="text-gray-600 text-sm">
                  Personal stylist dedicated to ensuring every client has an exceptional experience with Dress Boutique.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-[#ff6b98]">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {/* Stat 1 */}
              <div className="p-6">
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <p className="text-white font-medium">Designer Dresses</p>
              </div>
              
              {/* Stat 2 */}
              <div className="p-6">
                <div className="text-4xl font-bold text-white mb-2">10k+</div>
                <p className="text-white font-medium">Happy Clients</p>
              </div>
              
              {/* Stat 3 */}
              <div className="p-6">
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <p className="text-white font-medium">Designer Brands</p>
              </div>
              
              {/* Stat 4 */}
              <div className="p-6">
                <div className="text-4xl font-bold text-white mb-2">4.9</div>
                <p className="text-white font-medium">Client Rating</p>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd1dc] rounded-full opacity-10 -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff6b98] rounded-full opacity-10 -ml-32 -mb-32"></div>
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Find Your Perfect Dress?</h2>
                <p className="text-gray-600 mb-8">
                  Browse our extensive collection of designer dresses, gowns, and accessories. 
                  Find the perfect outfit for your next special occasion.
                </p>
                <Link href="/collections" className="bg-[#ff6b98] text-white px-8 py-3 rounded-full font-medium hover:bg-[#ff6b98]/80 transition-all hover:shadow-lg hover:shadow-[#ff6b98]/30 inline-flex items-center gap-2">
                  Explore Our Collection
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
