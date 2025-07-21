"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Container from './ui/Container';
import { useAuth } from '../contexts/AuthContext';

import { motion, AnimatePresence, Variants } from 'framer-motion';

const menuVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { 
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();

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

  const textColorClass = scrolled ? 'text-[#ff6b98]' : 'text-white';
  const hoverTextColorClass = scrolled ? 'hover:text-[#ff6b98]' : 'hover:text-white';
  const underlineColorClass = scrolled ? 'bg-[#ff6b98]' : 'bg-white';
  const buttonBgClass = scrolled ? 'bg-[#ff6b98]' : 'bg-white';
  const buttonHoverBgClass = scrolled ? 'hover:bg-[#ff6b98]/90' : 'hover:bg-white/90';
  const buttonShadowClass = scrolled ? 'hover:shadow-[#ff6b98]/30' : 'hover:shadow-white/30';

  return (
    <nav className={`w-full py-4 sticky top-0 z-[1000] transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-md backdrop-blur-sm' : 'bg-[#ff6b98]'}`}>
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className={scrolled ? 'text-[#ff6b98]' : 'text-white'}>Dress</span>
              <span className={scrolled ? 'text-gray-800' : 'text-white/90'}>Boutique</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About Us' },
              { href: '/collections', label: 'Collections' },
              { href: '/designers', label: 'Designers' },
              { href: '/occasions', label: 'Occasions' },
              { href: '/testimonials', label: 'Testimonials' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className={`${scrolled ? 'text-gray-800' : 'text-white'} ${hoverTextColorClass} transition-colors relative group`}>
                {label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${underlineColorClass} transition-all group-hover:w-full`}></span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-purple-600"></div>
            ) : isAuthenticated && user ? (
              <>
                <span className="text-gray-800 font-medium">Hello, {user.first_name}!</span>
                <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 transition-colors font-medium">Dashboard</Link>
                <button
                  onClick={logout}
                  className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-all hover:shadow-lg font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`${scrolled ? 'text-gray-800' : 'text-white'} ${hoverTextColorClass} transition-colors font-medium`}>Login</Link>
                <Link
                  href="/signup"
                  className={`${buttonBgClass} ${scrolled ? 'text-white' : 'text-black'} px-6 py-2 rounded-full ${buttonHoverBgClass} transition-all hover:shadow-lg ${buttonShadowClass} font-medium`}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className={`md:hidden ${scrolled ? 'text-gray-800' : 'text-white'} focus:outline-none`} onClick={toggleMobileMenu}>
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <motion.div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />
            
            {/* Menu Panel */}
            <motion.div 
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 overflow-y-auto"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                    <span className="text-2xl font-bold">
                      <span className="text-[#ff6b98]">Dress</span>
                      <span className="text-gray-800">Boutique</span>
                    </span>
                  </Link>
                  <button 
                    onClick={toggleMobileMenu}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <nav className="flex-1 space-y-2">
                  {[
                    { href: '/', label: 'Home', icon: '🏠' },
                    { href: '/about', label: 'About Us', icon: 'ℹ️' },
                    { href: '/collections', label: 'Collections', icon: '👗' },
                    { href: '/designers', label: 'Designers', icon: '✨' },
                    { href: '/occasions', label: 'Occasions', icon: '🎭' },
                    { href: '/testimonials', label: 'Testimonials', icon: '⭐' },
                    { href: '/contact', label: 'Contact', icon: '✉️' }
                  ].map(({ href, label, icon }) => (
                    <motion.div key={href} variants={itemVariants}>
                      <Link 
                        href={href} 
                        className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="mr-3 text-lg">{icon}</span>
                        <span className="font-medium">{label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                
                <div className="pt-6 mt-auto border-t border-gray-100">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-purple-600"></div>
                    </div>
                  ) : isAuthenticated && user ? (
                    <div className="space-y-4">
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Logged in as</p>
                        <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        className="block text-center bg-[#ff6b98] text-white px-6 py-3 rounded-lg hover:bg-[#ff6b98]/90 transition-colors font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Go to Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-center text-gray-700 hover:text-red-600 transition-colors font-medium py-2"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/login"
                        className="block text-center border border-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="block text-center bg-[#ff6b98] text-white px-6 py-3 rounded-lg hover:bg-[#ff6b98]/90 transition-colors font-medium shadow-sm hover:shadow-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
