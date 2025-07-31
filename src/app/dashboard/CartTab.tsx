import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCartItems, removeFromCart, clearCart, CartItem, getCartTotal, getCartItemCount } from '@/api/cart';
import { createBooking } from '@/api/bookings';

const CartTab: React.FC = () => {
  const { isAuthenticated, user, accessToken } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  const handleProceedToPayment = () => {
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
      
      // Create bookings for selected items
      const bookingPromises = selectedCartItems.map(item => 
        createBooking({
          item_id: parseInt(item.item_id),
          start_date: item.start_date,
          end_date: item.end_date
        }, accessToken!)
      );
      
      await Promise.all(bookingPromises);
      
      // Remove checked out items from cart
      const removePromises = selectedCartItems.map(item => removeFromCart(item.id));
      await Promise.all(removePromises);
      
      loadCartItems();
      setSelectedItems(new Set());
      setShowPayment(false);
      setSelectedPaymentMethod('');
      setMessage(`Payment successful! ${selectedCartItems.length} item(s) booked.`);
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Payment failed. Please try again.');
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
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-500">Please log in to view your cart.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading cart...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
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
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={selectedPaymentMethod === 'credit_card'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">Credit Card</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={selectedPaymentMethod === 'paypal'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">PayPal</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={selectedPaymentMethod === 'bank_transfer'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">Bank Transfer</span>
                  </label>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setShowPayment(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back to Cart
                  </button>
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
  );
};

export default CartTab;