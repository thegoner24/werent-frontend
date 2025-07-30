"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Container from './ui/Container';
import ProfileAvatar from './ui/ProfileAvatar';
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
  const { user, isAuthenticated, logout: logoutAuth, isLoading } = useAuth();
  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any parent handlers from executing
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    
    // Call the logout function from AuthContext
    // The actual navigation will be handled there
    logoutAuth();
  };

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
              <span className={scrolled ? 'text-gray-800' : 'text-gray-800'}>Boutique</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About Us' },
              { href: '/shop', label: 'Shop' },
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
                <div className="relative group inline-block text-left">
  <button
    type="button"
    className="flex items-center gap-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 px-4 py-2 rounded-full hover:bg-purple-50 transition-colors"
    aria-haspopup="true"
    aria-expanded="false"
    tabIndex={0}
  >
    <ProfileAvatar user={user} size="md" />
    <span className="hidden md:inline">Hello, {user.first_name}!</span>
    <svg className="w-4 h-4 ml-1 text-purple-600 group-hover:text-purple-700 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl ring-1 ring-black/10 z-50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-all duration-200 origin-top-right border border-purple-100" role="menu" tabIndex={-1}>
    <div className="px-6 py-4 border-b border-purple-50 flex items-center gap-3">
      <ProfileAvatar user={user} size="md" />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">{user.first_name} {user.last_name}</span>
        <span className="text-xs text-gray-500">{user.email}</span>
      </div>
    </div>
    <div className="py-2">
      <Link href="/dashboard" className="block px-6 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors font-medium" role="menuitem" tabIndex={0}>Dashboard</Link>
      <Link href="/dashboard/rentals" className="block px-6 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors font-medium" role="menuitem" tabIndex={0}>My Rentals</Link>
      <Link href="/dashboard/profile" className="block px-6 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors font-medium" role="menuitem" tabIndex={0}>Profile</Link>
      <button
        onClick={handleLogout}
        className="w-full text-left px-6 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
        role="menuitem"
        tabIndex={0}
      >
        Logout
      </button>
    </div>
  </div>
</div>
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
                    { href: '/shop', label: 'Shop', icon: '👗' },
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
  <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-xl shadow-sm">
    <ProfileAvatar user={user} size="lg" />
    <div className="flex flex-col">
      <span className="font-semibold text-gray-900">{user.first_name} {user.last_name}</span>
      <span className="text-xs text-gray-500">{user.email}</span>
    </div>
  </div>
  <div className="flex flex-col gap-2 mt-2">
    <Link href="/dashboard" className="block text-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm" onClick={() => setMobileMenuOpen(false)}>
      Dashboard
    </Link>
    <Link href="/dashboard/rentals" className="block text-center bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors font-medium shadow-sm" onClick={() => setMobileMenuOpen(false)}>
      My Rentals
    </Link>
    <Link href="/dashboard/profile" className="block text-center bg-purple-100 text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-200 transition-colors font-medium shadow-sm" onClick={() => setMobileMenuOpen(false)}>
      Profile
    </Link>
    <button
      onClick={handleLogout}
      className="w-full text-center text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium py-3 rounded-lg"
    >
      Logout
    </button>
  </div>
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
