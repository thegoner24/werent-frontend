'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookingsByUserId, BookingResponse, cancelBooking } from '@/api/bookings';
import { addToCart, removeFromCart, isItemInCart, getCartItemByDetails } from '@/api/cart';

interface RentalWithItem extends BookingResponse {
  itemName?: string;
  itemBrand?: string;
  steps: string[];
  currentStep: number;
  penaltyFee?: number;
}

const getStatusSteps = (status: string) => {
  const steps = ['Requested', 'Approved', 'Shipped', 'Returned'];
  let currentStep = 0;
  
  switch (status.toUpperCase()) {
    case 'PENDING':
      currentStep = 0;
      break;
    case 'APPROVED':
    case 'CONFIRMED':
      currentStep = 1;
      break;
    case 'SHIPPED':
    case 'ACTIVE':
      currentStep = 2;
      break;
    case 'RETURNED':
    case 'COMPLETED':
      currentStep = 3;
      break;
    default:
      currentStep = 0;
  }
  
  return { steps, currentStep };
};

function RentalStepsTracker({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <ol className="flex items-center w-full mb-4">
      {steps.map((step, idx) => (
        <li key={step} className={`flex-1 flex items-center ${idx < steps.length - 1 ? 'after:content-[" "] after:flex-1 after:border-t-2 after:border-gray-200 after:mx-2' : ''}`}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${idx <= currentStep ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>{idx + 1}</div>
          <span className={`ml-2 text-sm font-medium ${idx <= currentStep ? 'text-purple-700' : 'text-gray-400'}`}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

const RentalsTab: React.FC = () => {
  const { user, accessToken, isAuthenticated } = useAuth();
  const [rentals, setRentals] = useState<RentalWithItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!isAuthenticated || !user || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch user bookings
        const bookings = await getUserBookingsByUserId(user.id, accessToken);
        
        // Transform bookings to include status steps
        const rentalsWithItems = bookings.map((booking) => {
          const { steps, currentStep } = getStatusSteps(booking.status);
          
          return {
            ...booking,
            itemName: booking.item_name || `Item #${booking.item_id}`,
            itemBrand: '', // Brand info not available in booking response
            steps,
            currentStep,
            penaltyFee: undefined, // This would come from the booking if available
          } as RentalWithItem;
        });
        
        setRentals(rentalsWithItems);
      } catch (err) {
        console.error('Error fetching user bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [isAuthenticated, user, accessToken]);

  const handleCartAction = async (rental: RentalWithItem) => {
    if (!user) return;
    
    setAddingToCart(String(rental.id));
    setCartMessage(null);
    
    try {
      const itemId = String(rental.item_id);
      const isInCart = isItemInCart(itemId, rental.start_date, rental.end_date);
      
      if (isInCart) {
        // Remove from cart
        const cartItem = getCartItemByDetails(itemId, rental.start_date, rental.end_date);
        if (cartItem) {
          await removeFromCart(cartItem.id);
          setCartMessage('Item removed from cart successfully!');
        }
      } else {
        // Add to cart
        const startDate = new Date(rental.start_date);
        const endDate = new Date(rental.end_date);
        const rentalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const dailyPrice = rental.total_price / rentalDays;
        
        await addToCart({
          item_id: itemId,
          start_date: rental.start_date,
          end_date: rental.end_date,
          item_name: rental.itemName,
          item_brand: rental.itemBrand,
          daily_price: dailyPrice,
          booking_id: rental.id // Include the booking ID
        });
        setCartMessage('Item added to cart successfully!');
      }
      setTimeout(() => setCartMessage(null), 3000);
    } catch (error) {
      console.error('Error with cart action:', error);
      if (error instanceof Error && error.message.includes('already in cart')) {
        setCartMessage('Item with these dates is already in your cart.');
      } else {
        setCartMessage('Failed to update cart. Please try again.');
      }
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  const getCartButtonText = (rental: RentalWithItem) => {
    const itemId = String(rental.item_id);
    const isInCart = isItemInCart(itemId, rental.start_date, rental.end_date);
    
    if (addingToCart === String(rental.id)) {
      return isInCart ? 'Removing...' : 'Adding...';
    }
    
    return isInCart ? 'Remove from Cart' : 'Add to Cart';
  };

  const getCartButtonStyle = (rental: RentalWithItem) => {
    const itemId = String(rental.item_id);
    const isInCart = isItemInCart(itemId, rental.start_date, rental.end_date);
    
    return isInCart 
      ? 'px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      : 'px-3 py-1 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  };

  const handleCancelBooking = async (rental: RentalWithItem) => {
    if (!accessToken) {
      setError('Authentication required');
      return;
    }

    setCancellingBooking(String(rental.id));
    setError(null);

    try {
      const cancelledBooking = await cancelBooking(rental.id, accessToken);
      
      // Update the rental in the local state
      setRentals(prevRentals => 
        prevRentals.map(r => 
          r.id === rental.id 
            ? { ...r, status: cancelledBooking.status, refund_info: cancelledBooking.refund_info }
            : r
        )
      );
      
      setCartMessage('Booking cancelled successfully');
      setTimeout(() => setCartMessage(null), 3000);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setCancellingBooking(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Dress Rentals</h2>
        <p className="text-gray-600">Please log in to view your rentals.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Dress Rentals</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-600">Loading your rentals...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Dress Rentals</h2>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Dress Rentals</h2>
      
      {cartMessage && (
        <div className={`mb-6 p-3 rounded-lg ${
          cartMessage.includes('successfully') 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {cartMessage}
        </div>
      )}
      {rentals.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v3m0 0c-2 0-3 1.5-3 3s1 3 3 3 3-1.5 3-3-1-3-3-3zm0 6v5m-7 0h14" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg mb-4">You have no rentals yet.</p>
          <p className="text-gray-500 mb-6">Start browsing our collection to find your perfect dress!</p>
          <a 
            href="/shop" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg"
          >
            Browse Dresses
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dress</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Price</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {rentals.map((rental, idx) => (
                <tr key={rental.id} className={idx % 2 === 0 ? 'bg-white hover:bg-purple-50 transition' : 'bg-gray-50 hover:bg-purple-50 transition'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-semibold text-gray-800">{rental.itemName}</div>
                      {rental.itemBrand && (
                        <div className="text-sm text-gray-500">{rental.itemBrand}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      rental.status === 'COMPLETED' || rental.status === 'RETURNED' 
                        ? 'bg-green-100 text-green-700' 
                        : rental.status === 'ACTIVE' || rental.status === 'SHIPPED'
                        ? 'bg-blue-100 text-blue-700' 
                        : rental.status === 'CONFIRMED' || rental.status === 'APPROVED'
                        ? 'bg-yellow-100 text-yellow-700'
                        : rental.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-700'
                        : rental.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {rental.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(rental.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(rental.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-800">${rental.total_price.toFixed(2)}</span>
                    {!rental.is_paid && (
                      <div className="text-xs text-red-600 font-medium">Unpaid</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RentalStepsTracker steps={rental.steps} currentStep={rental.currentStep} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rental.status === 'PENDING' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCartAction(rental)}
                          disabled={addingToCart === String(rental.id)}
                          className={getCartButtonStyle(rental)}
                        >
                          {getCartButtonText(rental)}
                        </button>
                        <button
                          onClick={() => handleCancelBooking(rental)}
                          disabled={cancellingBooking === String(rental.id)}
                          className="px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 text-white hover:bg-red-700"
                        >
                          {cancellingBooking === String(rental.id) ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </div>
                    ) : (rental.status === 'PAID' || rental.status === 'CONFIRMED') ? (
                      <button
                        onClick={() => handleCancelBooking(rental)}
                        disabled={cancellingBooking === String(rental.id)}
                        className="px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 text-white hover:bg-red-700"
                      >
                        {cancellingBooking === String(rental.id) ? 'Cancelling...' : 'Cancel'}
                      </button>
                    ) : rental.status !== 'CANCELLED' ? (
                      <button
                        onClick={() => handleCartAction(rental)}
                        disabled={addingToCart === String(rental.id)}
                        className={getCartButtonStyle(rental)}
                      >
                        {getCartButtonText(rental)}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RentalsTab;

