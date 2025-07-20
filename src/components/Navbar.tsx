"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import Container from './ui/Container';
import { useAuth } from '../contexts/AuthContext';

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
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="w-full bg-white py-4 shadow-md sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <Container>
        <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">
            <span className="text-purple-600">Cam</span>
            <span className="text-black">Rent</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-800 hover:text-purple-600 transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-purple-600 transition-colors relative group">
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/browse" className="text-gray-800 hover:text-purple-600 transition-colors relative group">
            Browse Gear
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/how-it-works" className="text-gray-800 hover:text-purple-600 transition-colors relative group">
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/pricing" className="text-gray-800 hover:text-purple-600 transition-colors relative group">
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="text-gray-800 hover:text-purple-600 transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoading ? (
            <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-purple-600"></div>
          ) : isAuthenticated && user ? (
            <>
              <span className="text-gray-800 font-medium">
                Hello, {user.first_name}!
              </span>
              <Link 
                href="/dashboard" 
                className="text-purple-600 hover:text-purple-700 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-all hover:shadow-lg font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-800 hover:text-purple-600 transition-colors font-medium">
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-all hover:shadow-lg hover:shadow-purple-500/30 font-medium"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-800 focus:outline-none" 
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
              <Link href="/" className="text-gray-800 hover:text-purple-600 transition-colors py-2 border-l-2 border-transparent hover:border-purple-600 pl-2">
                Home
              </Link>
              <Link href="/about" className="text-gray-800 hover:text-purple-600 transition-colors py-2 border-l-2 border-transparent hover:border-purple-600 pl-2">
                About Us
              </Link>
              <Link href="/browse" className="text-gray-800 hover:text-purple-600 transition-colors py-2 border-l-2 border-transparent hover:border-purple-600 pl-2">
                Browse Gear
              </Link>
              <Link href="/how-it-works" className="text-gray-800 hover:text-purple-600 transition-colors py-2 border-l-2 border-transparent hover:border-purple-600 pl-2">
                How It Works
              </Link>
              <Link href="/pricing" className="text-gray-800 hover:text-purple-600 transition-colors py-2 border-l-2 border-transparent hover:border-purple-600 pl-2">
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-800 hover:text-purple-600 transition-colors py-2 border-l-2 border-transparent hover:border-purple-600 pl-2">
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                {isLoading ? (
                  <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-purple-600"></div>
                ) : isAuthenticated && user ? (
                  <>
                    <span className="text-gray-800 font-medium py-2">
                      Hello, {user.first_name}!
                    </span>
                    <Link 
                      href="/dashboard" 
                      className="text-purple-600 hover:text-purple-700 transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-all hover:shadow-lg w-full text-center font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-800 hover:text-purple-600 transition-colors font-medium">
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-all hover:shadow-lg hover:shadow-purple-500/30 w-full text-center font-medium"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
}
