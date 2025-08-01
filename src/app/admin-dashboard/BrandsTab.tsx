"use client";

import React, { useState, useEffect } from 'react';

// Initial brands data
const initialBrands = ["Gucci", "Prada", "Versace", "Dior", "Chanel", "Louis Vuitton"];

export default function BrandsTab() {
  const [brands, setBrands] = useState(initialBrands);
  const [newBrand, setNewBrand] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle mounting and initial loading
  useEffect(() => {
    setIsMounted(true);
    setIsInitialLoading(true);
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle notification display and auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Add new brand
  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBrand.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        setBrands([...brands, newBrand.trim()]);
        setNewBrand("");
        setNotification({ message: 'Brand added successfully!', type: 'success' });
      } catch (error) {
        setNotification({ message: 'An error occurred. Please try again.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };
  
  // Start editing a brand
  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(brands[index]);
  };
  
  // Save edited brand
  const handleSaveEdit = (index: number) => {
    if (!editValue.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        const updatedBrands = [...brands];
        updatedBrands[index] = editValue.trim();
        setBrands(updatedBrands);
        setEditingIndex(null);
        setNotification({ message: 'Brand updated successfully!', type: 'success' });
      } catch (error) {
        setNotification({ message: 'An error occurred. Please try again.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingIndex(null);
  };
  
  // Delete brand
  const handleDeleteBrand = (index: number) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        const updatedBrands = brands.filter((_, i) => i !== index);
        setBrands(updatedBrands);
        setNotification({ message: 'Brand deleted successfully!', type: 'success' });
      } catch (error) {
        setNotification({ message: 'An error occurred. Please try again.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <>
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all transform animate-fade-in-down ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-6">Manage Brands</h2>
        
        {isInitialLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-500">Loading brands...</p>
          </div>
        ) : (
          <>
            {/* Add new brand form */}
            <form onSubmit={handleAddBrand} className="mb-4 sm:mb-8">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="New brand name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isLoading}
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2 sm:mt-0"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {!isLoading && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {isLoading ? 'Adding...' : 'Add Brand'}
                </button>
              </div>
            </form>
            
            {/* Brands list */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">Current Brands</h3>
              
              {brands.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-gray-300 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-500">No brands available.</p>
                  <p className="text-sm text-gray-400 mt-1">Add your first brand above.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 border border-gray-100 rounded-lg overflow-hidden">
                  {brands.map((brand, index) => (
                    <li key={index} className="py-3 px-4 hover:bg-gray-50 transition-colors">
                      {editingIndex === index ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(index)}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                            disabled={isLoading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                          <span className="text-gray-800">{brand}</span>
                          <div className="flex gap-3 mt-1 sm:mt-0">
                            <button
                              onClick={() => handleStartEdit(index)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                              disabled={isLoading}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(index)}
                              className="text-red-600 hover:text-red-900 flex items-center gap-1"
                              disabled={isLoading}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
