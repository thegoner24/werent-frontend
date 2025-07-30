"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createItem, CreateItemPayload } from '../../api/items';

interface AdminTabProps {
  user: {
    is_admin?: boolean;
  };
}

const AdminTab: React.FC<AdminTabProps> = ({ user }) => {
  const { accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [images, setImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    product_code: '',
    price_per_day: '',
    quantity: '',
    color: '',
    size: 'M',
    gender: 'Unisex',
    type: 'Dress'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImages(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      setMessage({ type: 'error', text: 'Authentication required' });
      return;
    }

    if (images.length === 0) {
      setMessage({ type: 'error', text: 'At least one image is required' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const payload: CreateItemPayload = {
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        product_code: formData.product_code,
        price_per_day: parseFloat(formData.price_per_day),
        quantity: parseInt(formData.quantity),
        color: formData.color,
        size: formData.size,
        gender: formData.gender,
        type: formData.type,
        images: images
      };

      const response = await createItem(payload, accessToken);
      
      if (response.success) {
        setMessage({ type: 'success', text: response.message });
        // Reset form
        setFormData({
          name: '',
          brand: '',
          description: '',
          product_code: '',
          price_per_day: '',
          quantity: '',
          color: '',
          size: 'M',
          gender: 'Unisex',
          type: 'Dress'
        });
        setImages([]);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create item';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user.is_admin) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You need administrator privileges to access this section.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New Item</h2>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          Admin Only
        </span>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter item name"
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
              Brand *
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter brand name"
            />
          </div>

          <div>
            <label htmlFor="product_code" className="block text-sm font-medium text-gray-700 mb-2">
              Product Code *
            </label>
            <input
              type="text"
              id="product_code"
              name="product_code"
              value={formData.product_code}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter product code"
            />
          </div>

          <div>
            <label htmlFor="price_per_day" className="block text-sm font-medium text-gray-700 mb-2">
              Price per Day ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              id="price_per_day"
              name="price_per_day"
              value={formData.price_per_day}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity in Stock *
            </label>
            <input
              type="number"
              min="0"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter color"
            />
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
              Size *
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="XXXL">XXXL</option>
              <option value="One Size">One Size</option>
            </select>
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Men's">Men's</option>
              <option value="Women's">Women's</option>
              <option value="Unisex">Unisex</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Dress">Dress</option>
              <option value="Top">Top</option>
              <option value="Bottom">Bottom</option>
              <option value="Outerwear">Outerwear</option>
              <option value="Shoes">Shoes</option>
              <option value="Accessory">Accessory</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Bag">Bag</option>
              <option value="Formal Wear">Formal Wear</option>
              <option value="Costume">Costume</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter item description..."
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Images * (You can select multiple images)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Select multiple images to showcase the item. JPG, PNG, or GIF format.
          </p>
          
          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images ({images.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Item...
              </div>
            ) : (
              'Create Item'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTab;
