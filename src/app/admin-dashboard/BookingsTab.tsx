"use client";

import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { getAllBookings, confirmBooking, completeBooking, BookingResponse } from '@/api/bookings';

export interface BookingsTabRef {
  refreshBookings: () => void;
}

const BookingsTab = forwardRef<BookingsTabRef>((props, ref) => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useImperativeHandle(ref, () => ({
    refreshBookings: fetchBookings
  }));

  const handleConfirmBooking = async (bookingId: number) => {
    try {
      const updatedBooking = await confirmBooking(bookingId);
      
      // Update the booking in the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: updatedBooking.status }
            : booking
        )
      );
    } catch (err) {
      console.error('Error confirming booking:', err);
      setError('Failed to confirm booking');
    }
  };

  const handleCompleteBooking = async (bookingId: number) => {
    try {
      const updatedBooking = await completeBooking(bookingId);
      
      // Update the booking in the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: updatedBooking.status }
            : booking
        )
      );
    } catch (err) {
      console.error('Error completing booking:', err);
      setError('Failed to complete booking');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusBadge = (status: string, isPaid: boolean) => {
    let bgColor = 'bg-gray-100 text-gray-800';
    let displayStatus = status;

    switch (status.toLowerCase()) {
      case 'confirmed':
        bgColor = 'bg-blue-100 text-blue-800';
        displayStatus = 'CONFIRMED';
        break;
      case 'pending':
        bgColor = 'bg-yellow-100 text-yellow-800';
        displayStatus = 'PENDING';
        break;
      case 'cancelled':
        bgColor = 'bg-red-100 text-red-800';
        displayStatus = 'CANCELLED';
        break;
      default:
        bgColor = 'bg-gray-100 text-gray-800';
        displayStatus = status;
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {displayStatus}
      </span>
    );
  };

  const filteredAndSortedBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toString().includes(searchTerm) ||
        booking.user_id.toString().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'ALL' || 
        (statusFilter === 'PAID' && booking.is_paid) ||
        (statusFilter === 'PENDING' && !booking.is_paid && booking.status === 'PENDING') ||
        (statusFilter === 'CONFIRMED' && !booking.is_paid && booking.status === 'CONFIRMED');
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof BookingResponse];
      let bValue: any = b[sortBy as keyof BookingResponse];
      
      if (sortBy === 'start_date' || sortBy === 'end_date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={fetchBookings}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">All Bookings</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by booking ID, user ID, or item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="PAID">Paid</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
          </select>
          
          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="id-desc">Newest First</option>
            <option value="id-asc">Oldest First</option>
            <option value="total_price-desc">Highest Price</option>
            <option value="total_price-asc">Lowest Price</option>
            <option value="start_date-desc">Latest Start Date</option>
            <option value="start_date-asc">Earliest Start Date</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
          <div className="text-sm text-blue-600">Total Bookings</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {bookings.filter(b => b.is_paid).length}
          </div>
          <div className="text-sm text-green-600">Paid Bookings</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {bookings.filter(b => !b.is_paid && b.status === 'PENDING').length}
          </div>
          <div className="text-sm text-yellow-600">Pending Bookings</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(bookings.reduce((sum, b) => sum + b.total_price, 0))}
          </div>
          <div className="text-sm text-purple-600">Total Revenue</div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{booking.id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  User #{booking.user_id}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate" title={booking.item_name}>
                    {booking.item_name || `Item #${booking.item_id}`}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{formatDate(booking.start_date)}</div>
                  <div className="text-xs text-gray-400">to {formatDate(booking.end_date)}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.quantity}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(booking.total_price)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status, booking.is_paid)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {booking.is_paid && booking.status.toLowerCase() !== 'confirmed' && booking.status.toLowerCase() !== 'returned' && booking.status.toLowerCase() !== 'completed' && (
                    <button
                      onClick={() => handleConfirmBooking(booking.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {booking.status.toLowerCase() === 'returned' && booking.status.toLowerCase() !== 'completed' && (
                    <button
                      onClick={() => handleCompleteBooking(booking.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedBookings.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No bookings found</div>
          <div className="text-gray-400 text-sm mt-2">
            {searchTerm || statusFilter !== 'ALL' 
              ? 'Try adjusting your search or filter criteria'
              : 'No bookings have been made yet'
            }
          </div>
        </div>
      )}
    </div>
  );
});

BookingsTab.displayName = 'BookingsTab';

export default BookingsTab;