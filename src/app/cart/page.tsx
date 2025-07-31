'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCartItems, removeFromCart, clearCart, CartItem, getCartTotal, getCartItemCount } from '@/api/cart';
import { createBooking } from '@/api/bookings';
import { createPayment, PaymentRequest } from '@/api/payments';
import Container from '@/components/ui/Container';

const CartPage: React.FC = () => {
  const { isAuthenticated, user, accessToken } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'CC' | 'QRIS' | 'TRANSFER' | 'CASH' | ''>('');


  useEffect(() => {
    if (isAuthenticated) {
      loadCartItems();
    }
  }, [isAuthenticated]);

  const loadCartItems = () => {
    try {
      setLoading(true);
      const items = getCartItems();
      setCartItems(items);
      setError(null);
    } catch (err) {
      console.error('Error loading cart items:', err);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId);
      loadCartItems();
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
      setMessage('Item removed from cart');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item from cart');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSelectItem = (cartItemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cartItemId)) {
        newSet.delete(cartItemId);
      } else {
        newSet.add(cartItemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  const handleProceedToPayment = async () => {
    if (selectedItems.size === 0) {
      setError('Please select items to checkout');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setShowPayment(true);
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsCheckingOut(true);
    try {
      const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
      
      // Collect booking IDs from selected cart items
      const bookingIds = selectedCartItems
        .map(item => item.booking_id)
        .filter(id => id !== undefined) as number[];
      
      const paymentData: PaymentRequest = {
        booking_id: bookingIds,
        payment_method: selectedPaymentMethod,
        payment_type: 'RENT',
        total_price: getSelectedTotal(),
        user_id: user!.id
      };
      
      const paymentResult = await createPayment(paymentData, accessToken!);
      
      // Remove checked out items from cart
      const removePromises = selectedCartItems.map(item => removeFromCart(item.id));
      await Promise.all(removePromises);
      
      loadCartItems();
      setSelectedItems(new Set());
      setShowPayment(false);
      setSelectedPaymentMethod('');
      setMessage(`Payment successful! ${selectedCartItems.length} item(s) processed. Payment ID: ${paymentResult.data.id}`);
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error('Error during payment:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    
    setIsClearing(true);
    try {
      await clearCart();
      loadCartItems();
      setSelectedItems(new Set());
      setMessage('Cart cleared successfully');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsClearing(false);
    }
  };

  const getSelectedTotal = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + item.total_price, 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-500 mb-4">Please log in to view your cart.</p>
            <a href="/login" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Sign In
            </a>
          </div>
        </Container>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Loading cart...</span>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <div className="text-sm text-gray-500">
                {getCartItemCount()} item(s) • Total: ${getCartTotal().toFixed(2)}
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 border border-green-200">
                {message}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-4">Add some items to your cart to get started!</p>
                <a href="/shop" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Browse Items
                </a>
              </div>
            ) : (
              <>
                {/* Cart Controls */}
                <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Select All ({selectedItems.size}/{cartItems.length})
                      </span>
                    </label>
                    {selectedItems.size > 0 && (
                      <span className="text-sm text-purple-600 font-medium">
                        Selected Total: ${getSelectedTotal().toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleClearCart}
                      disabled={isClearing || cartItems.length === 0}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isClearing ? 'Clearing...' : 'Clear Cart'}
                    </button>
                    <button
                      onClick={showPayment ? handleCheckout : handleProceedToPayment}
                      disabled={isCheckingOut || selectedItems.size === 0}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCheckingOut ? (
                        'Processing Payment...'
                      ) : showPayment ? (
                        `Pay Now - $${getSelectedTotal().toFixed(2)}`
                      ) : (
                        `Proceed to Payment (${selectedItems.size})`
                      )}
                    </button>
                  </div>
                </div>

                {/* Payment Interface */}
                {showPayment && (
                  <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Choose Payment Method</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* Credit Card */}
                      <label className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPaymentMethod === 'CC' 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="CC"
                          checked={selectedPaymentMethod === 'CC'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value as 'CC')}
                          className="sr-only"
                        />
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Credit Card</div>
                            <div className="text-sm text-gray-500">Visa, Mastercard, etc.</div>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'CC' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>

                      {/* QRIS */}
                      <label className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPaymentMethod === 'QRIS' 
                          ? 'border-green-500 bg-green-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="QRIS"
                          checked={selectedPaymentMethod === 'QRIS'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value as 'QRIS')}
                          className="sr-only"
                        />
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">QRIS</div>
                            <div className="text-sm text-gray-500">Scan QR code to pay</div>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'QRIS' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>

                      {/* Bank Transfer */}
                      <label className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPaymentMethod === 'TRANSFER' 
                          ? 'border-purple-500 bg-purple-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="TRANSFER"
                          checked={selectedPaymentMethod === 'TRANSFER'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value as 'TRANSFER')}
                          className="sr-only"
                        />
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Bank Transfer</div>
                            <div className="text-sm text-gray-500">Direct bank transfer</div>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'TRANSFER' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>

                      {/* Cash */}
                      <label className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPaymentMethod === 'CASH' 
                          ? 'border-orange-500 bg-orange-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="CASH"
                          checked={selectedPaymentMethod === 'CASH'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value as 'CASH')}
                          className="sr-only"
                        />
                        <div className="flex items-center w-full">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Cash</div>
                            <div className="text-sm text-gray-500">Pay on pickup/delivery</div>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'CASH' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setShowPayment(false)}
                        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Cart
                      </button>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total Amount</div>
                        <div className="text-2xl font-bold text-gray-900">${getSelectedTotal().toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        
                        {item.item_image && (
                          <img
                            src={item.item_image}
                            alt={item.item_name || 'Item'}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.item_name || `Item #${item.item_id}`}
                          </h3>
                          {item.item_brand && (
                            <p className="text-sm text-gray-500">{item.item_brand}</p>
                          )}
                          <div className="text-sm text-gray-600 mt-1">
                            <span>{new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{item.rental_days} day(s)</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">${item.total_price.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">${(item.total_price / item.rental_days).toFixed(2)}/day</div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from cart"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;