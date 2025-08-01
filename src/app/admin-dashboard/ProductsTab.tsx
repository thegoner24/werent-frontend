"use client";

import React, { useState, useEffect } from 'react';

// Mock product data
const initialProducts = [
  {
    id: 1,
    name: "Elegant Evening Gown",
    price: 85.0,
    image: "/shop/mock-sofa.jpg",
    category: "Evening Dresses",
    brand: "Gucci",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Cocktail Dress",
    price: 53.0,
    image: "/shop/mock-dining.jpg",
    category: "Formal Attire",
    brand: "Prada",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Designer Handbag",
    price: 32.0,
    image: "/shop/mock-chair.jpg",
    category: "Accessories",
    brand: "Chanel",
    rating: 4.6,
  },
  {
    id: 4,
    name: "Summer Dress",
    price: 28.0,
    image: "/shop/mock-bookshelf.jpg",
    category: "Casual Wear",
    brand: "Dior",
    rating: 4.5,
  },
];

// Available categories and brands for dropdown selection
const categories = [
  "Evening Dresses",
  "Casual Wear",
  "Formal Attire",
  "Accessories",
  "Designer Brands",
  "Wedding Collection",
];

const brands = ["Gucci", "Prada", "Versace", "Dior", "Chanel", "Louis Vuitton"];

export default function ProductsTab() {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // State for product form
  const [currentProduct, setCurrentProduct] = useState({
    id: 0,
    name: "",
    price: 0,
    image: "",
    category: "",
    brand: "",
    rating: 0,
  });
  
  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: name === 'price' ? parseFloat(value) : value,
    });
  };
  
  // Open modal for adding new product
  const handleAddNew = () => {
    setCurrentProduct({
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name: "",
      price: 0,
      image: "/shop/mock-sofa.jpg", // Default image
      category: categories[0],
      brand: brands[0],
      rating: 5.0,
    });
    setModalType('add');
    setShowModal(true);
  };
  
  // Open modal for editing product
  const handleEdit = (product: any) => {
    setCurrentProduct({ ...product });
    setModalType('edit');
    setShowModal(true);
  };
  
  // Open modal for deleting product
  const handleDelete = (product: any) => {
    setCurrentProduct({ ...product });
    setModalType('delete');
    setShowModal(true);
  };
  
  // Simulate initial data loading
  useEffect(() => {
    setTimeout(() => {
      setIsInitialLoading(false);
    }, 800);
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

  // Save product (add or edit)
  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        if (modalType === 'add') {
          setProducts([...products, currentProduct]);
          setNotification({ message: 'Product added successfully!', type: 'success' });
        } else if (modalType === 'edit') {
          setProducts(products.map(p => p.id === currentProduct.id ? currentProduct : p));
          setNotification({ message: 'Product updated successfully!', type: 'success' });
        } else if (modalType === 'delete') {
          setProducts(products.filter(p => p.id !== currentProduct.id));
          setNotification({ message: 'Product deleted successfully!', type: 'success' });
        }
        
        setShowModal(false);
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Manage Products</h2>
          <button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Product
          </button>
        </div>
        
        {/* Loading State */}
        {isInitialLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No Products Found</h3>
            <p className="text-gray-500">Start by adding your first product.</p>
          </div>
        ) : (
          /* Products Table */
          <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <div className="h-12 w-12 rounded-md overflow-hidden">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.brand}</div>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm ml-1">
                        ({product.rating})
                      </span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
      
      {/* Modal for Add/Edit/Delete Product */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {modalType === 'add' ? 'Add New Product' : 
                 modalType === 'edit' ? 'Edit Product' : 'Delete Product'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {modalType === 'delete' ? (
              <div>
                <p className="text-gray-600 mb-6">Are you sure you want to delete "{currentProduct.name}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={currentProduct.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($ per day)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={currentProduct.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={currentProduct.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <select
                      id="brand"
                      name="brand"
                      value={currentProduct.brand}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={currentProduct.image}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                      Rating (0-5)
                    </label>
                    <input
                      type="number"
                      id="rating"
                      name="rating"
                      value={currentProduct.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
