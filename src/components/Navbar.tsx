"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Container from './ui/Container';

// Custom animation styles
const fadeInAnimation = {
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(-10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  },
  animation: 'fadeIn 0.3s ease-out forwards'
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Dynamic color classes based on scroll state
  const textColorClass = scrolled ? 'text-[#1b3cfe]' : 'text-[#d3fe41]';
  const hoverTextColorClass = scrolled ? 'hover:text-[#1b3cfe]' : 'hover:text-[#d3fe41]';
  const underlineColorClass = scrolled ? 'bg-[#1b3cfe]' : 'bg-[#d3fe41]';
  const buttonBgClass = scrolled ? 'bg-[#1b3cfe]' : 'bg-[#d3fe41]';
  const buttonHoverBgClass = scrolled ? 'hover:bg-[#1b3cfe]/90' : 'hover:bg-[#d3fe41]/90';
  const buttonShadowClass = scrolled ? 'hover:shadow-[#1b3cfe]/30' : 'hover:shadow-[#d3fe41]/30';

  return (
    <nav className={`w-full py-4 sticky top-0 z-[1000] transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-md backdrop-blur-sm' : 'bg-[#1b3cfe]'}`}>
      <Container>
        <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">
            <span className={scrolled ? 'text-[#1b3cfe]' : 'text-[#d3fe41]'}>Cam</span>
            <span className={scrolled ? 'text-gray-800' : 'text-white'}>Rent</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className={`${scrolled ? 'text-gray-800' : 'text-white'} ${hoverTextColorClass} transition-colors relative group`}>
            Home
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${underlineColorClass} transition-all group-hover:w-full`}></span>
          </Link>
          <Link href="/about" className={`${scrolled ? 'text-gray-800' : 'text-white'} ${hoverTextColorClass} transition-colors relative group`}>
            About Us
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${underlineColorClass} transition-all group-hover:w-full`}></span>
          </Link>
          <Link href="/promo" className={`${scrolled ? 'text-gray-800' : 'text-white'} ${hoverTextColorClass} transition-colors relative group`}>
            Promo
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${underlineColorClass} transition-all group-hover:w-full`}></span>
          </Link>
          <Link href="/categories" className={`${scrolled ? 'text-gray-800' : 'text-white'} ${hoverTextColorClass} transition-colors relative group`}>
            Categories
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${underlineColorClass} transition-all group-hover:w-full`}></span>
          </Link>
          <Link href="/testimony" className={`${scrolled ? 'text-gray-800' : 'text-white'} ${hoverTextColorClass} transition-colors relative group`}>
            Testimony
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${underlineColorClass} transition-all group-hover:w-full`}></span>
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className={`${scrolled ? 'text-gray-800' : 'text-white'} ${hoverTextColorClass} transition-colors font-medium`}>
            Login
          </Link>
          <Link 
            href="/signup" 
            className={`${buttonBgClass} ${scrolled ? 'text-white' : 'text-black'} px-6 py-2 rounded-full ${buttonHoverBgClass} transition-all hover:shadow-lg ${buttonShadowClass} font-medium`}
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden ${scrolled ? 'text-gray-800' : 'text-white'} focus:outline-none`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 py-4 shadow-lg" style={fadeInAnimation}>
          <Container>
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-800 hover:text-[#1b3cfe] transition-colors py-2 border-l-2 border-transparent hover:border-[#1b3cfe] pl-2">
                Home
              </Link>
              <Link href="/about" className="text-gray-800 hover:text-[#1b3cfe] transition-colors py-2 border-l-2 border-transparent hover:border-[#1b3cfe] pl-2">
                About Us
              </Link>
              <Link href="/promo" className="text-gray-800 hover:text-[#1b3cfe] transition-colors py-2 border-l-2 border-transparent hover:border-[#1b3cfe] pl-2">
                Promo
              </Link>
              <Link href="/categories" className="text-gray-800 hover:text-[#1b3cfe] transition-colors py-2 border-l-2 border-transparent hover:border-[#1b3cfe] pl-2">
                Categories
              </Link>
              <Link href="/testimony" className="text-gray-800 hover:text-[#1b3cfe] transition-colors py-2 border-l-2 border-transparent hover:border-[#1b3cfe] pl-2">
                Testimony
              </Link>
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                <Link href="/login" className="text-white hover:text-[#d3fe41] transition-colors font-medium">
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-all hover:shadow-lg hover:shadow-purple-500/30 w-full text-center font-medium"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
}