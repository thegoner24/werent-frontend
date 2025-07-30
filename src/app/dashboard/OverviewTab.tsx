import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProfileAvatar from '../../components/ui/ProfileAvatar';
import { resendVerification } from '../../api/verification';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_admin?: boolean;
  is_verified?: boolean;
  uuid?: string;
}

interface OverviewTabProps {
  user: User;
  handleLogout: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ user, handleLogout }) => {
  const { accessToken, refreshProfile } = useAuth();
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleResendVerification = async () => {
    if (!accessToken) return;
    
    setIsResendingVerification(true);
    setVerificationMessage(null);
    
    try {
      const response = await resendVerification(accessToken);
      setVerificationMessage({ 
        type: 'success', 
        text: response.message || 'Verification email sent successfully!' 
      });
      
      // Clear the success message after 5 seconds
      setTimeout(() => {
        setVerificationMessage(null);
      }, 5000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email. Please try again.';
      setVerificationMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  // Refresh profile every 30 seconds if user is not verified (to check for verification status)
  useEffect(() => {
    if (!user?.is_verified && accessToken) {
      const interval = setInterval(() => {
        refreshProfile();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [user?.is_verified, accessToken, refreshProfile]);

  return (
    <>
    {/* Header */}
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.first_name}!
          </h1>
          <p className="text-gray-600">
            Manage your dress rentals and account settings
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
    {/* Profile Summary */}
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg shadow-xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
      <div className="flex-shrink-0 flex flex-col items-center">
        <ProfileAvatar 
          user={user} 
          size="lg"
          className="w-28 h-28 text-4xl"
        />
        <span className="text-xs text-gray-500 mt-2">Member since {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
            <p className="text-lg text-gray-900">{user.first_name} {user.last_name}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
            <p className="text-lg text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
            <p className="text-lg text-gray-900">{user.phone_number || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Account Status</label>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.is_verified ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {user.is_verified ? 'Verified' : 'Unverified'}
              </span>
              {user.is_admin && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Verification Notice */}
        {!user.is_verified && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Email Verification Required
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Please verify your email address to access all features and ensure account security. 
                  {!user.is_verified && " Your verification status will update automatically."}
                </p>
                {verificationMessage && (
                  <div className={`mt-2 p-2 rounded text-sm ${
                    verificationMessage.type === 'success' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {verificationMessage.text}
                  </div>
                )}
                <div className="mt-3">
                  <button
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResendingVerification ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      'Resend Verification'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <Link 
            href="/dashboard/profile"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-2 rounded-lg shadow hover:from-purple-700 hover:to-pink-600 transition-all font-semibold"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
    {/* Quick Actions */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-8 text-center border border-pink-100 hover:shadow-2xl transition-all">
        <div className="w-14 h-14 bg-gradient-to-tr from-pink-400 to-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4">
          {/* Dress icon */}
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2c.552 0 1 .448 1 1v1.382l2.447 3.67a1 1 0 01-.182 1.287l-1.265 1.012 2.682 8.046A2 2 0 0114.79 20H9.21a2 2 0 01-1.892-2.603l2.682-8.046-1.265-1.012a1 1 0 01-.182-1.287L11 4.382V3c0-.552.448-1 1-1zm0 3.618l-1.447 2.171.447.358a3 3 0 003.999 0l.447-.358L12 5.618z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">Browse Dresses</h3>
        <p className="text-gray-600 text-sm mb-4">Discover our collection of designer dresses for every occasion</p>
        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-400 text-white py-2 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-pink-500 transition-all">
          View Dress Catalog
        </button>
      </div>
      <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-8 text-center border border-purple-100 hover:shadow-2xl transition-all">
        <div className="w-14 h-14 bg-gradient-to-tr from-purple-400 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
          {/* Rental history icon */}
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 3a1 1 0 00-1 1v1H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a1 1 0 00-1-1H8zm0 2h8v1H8V5zm-3 3h14v10H5V8zm7 2a3 3 0 110 6 3 3 0 010-6z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">My Dress Rentals</h3>
        <p className="text-gray-600 text-sm mb-4">View your current and past dress rentals</p>
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-400 text-white py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-500 transition-all">
          View Rentals
        </button>
      </div>
      <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-8 text-center border border-green-100 hover:shadow-2xl transition-all">
        <div className="w-14 h-14 bg-gradient-to-tr from-green-400 to-teal-300 rounded-xl flex items-center justify-center mx-auto mb-4">
          {/* Payment card icon */}
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm2 0v2h14V6H5zm0 4v8h14v-8H5zm2 2h2v2H7v-2zm4 0h6v2h-6v-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">Payment Methods</h3>
        <p className="text-gray-600 text-sm mb-4">Manage your payment information</p>
        <button className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-teal-500 transition-all">
          Manage Cards
        </button>
      </div>
    </div>
    {/* Recent Activity Placeholder */}
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
          {/* Dress hanger icon */}
          <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v3m0 0c-2 0-3 1.5-3 3s1 3 3 3 3-1.5 3-3-1-3-3-3zm0 6v5m-7 0h14" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
        <p className="text-gray-600">Start by browsing our dress collection and making your first rental!</p>
        <button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-400 text-white px-8 py-2 rounded-lg shadow hover:from-purple-600 hover:to-pink-500 transition-all font-semibold">
          Browse Dresses
        </button>
      </div>
    </div>
    </>
  );
};

export default OverviewTab;
