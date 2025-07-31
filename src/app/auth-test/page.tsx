"use client";

import React from 'react';
import Container from '../../components/ui/Container';
import AuthenticatedApiExample from '../../components/examples/AuthenticatedApiExample';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

/**
 * Test page for demonstrating the authentication middleware functionality
 * This page is useful for testing and demonstrating the automatic token refresh features
 */
export default function AuthTestPage() {
  const { user, isAuthenticated, accessToken, refreshToken } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Authentication Middleware Test
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This page demonstrates the automatic token refresh middleware functionality.
              Use the examples below to test different authentication scenarios.
            </p>
          </div>

          {/* Authentication Status */}
          <div className="mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Authentication Status
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${
                    isAuthenticated 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">User:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {user ? `${user.first_name} ${user.last_name} (${user.email})` : 'None'}
                  </span>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Access Token:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {accessToken ? `${accessToken.substring(0, 20)}...` : 'None'}
                  </span>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Refresh Token:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {refreshToken ? `${refreshToken.substring(0, 20)}...` : 'None'}
                  </span>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800 text-sm">
                    You need to be logged in to test the authentication middleware.
                  </p>
                  <Link 
                    href="/login" 
                    className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Go to Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* API Examples */}
          <AuthenticatedApiExample />

          {/* Token Information */}
          {isAuthenticated && accessToken && (
            <div className="mt-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Token Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Access Token Payload:</h3>
                    <TokenInfo token={accessToken} />
                  </div>
                  
                  {refreshToken && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Refresh Token Payload:</h3>
                      <TokenInfo token={refreshToken} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Documentation Link */}
          <div className="mt-8 text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Documentation
              </h2>
              <p className="text-gray-600 mb-4">
                For detailed information about the authentication middleware implementation,
                please refer to the documentation.
              </p>
              <a 
                href="/docs/AUTHENTICATION_MIDDLEWARE.md" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

/**
 * Component to display JWT token information
 */
function TokenInfo({ token }: { token: string }) {
  const [payload, setPayload] = React.useState<any>(null);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setPayload(decoded);
      setError('');
    } catch (err) {
      setError('Invalid token format');
      setPayload(null);
    }
  }, [token]);

  if (error) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
        {error}
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
        Loading token information...
      </div>
    );
  }

  const isExpired = payload.exp && payload.exp < Math.floor(Date.now() / 1000);
  const expirationDate = payload.exp ? new Date(payload.exp * 1000) : null;
  const issuedDate = payload.iat ? new Date(payload.iat * 1000) : null;

  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="font-medium text-gray-700">Type:</span>
          <span className="ml-2 text-gray-900">{payload.type || 'Unknown'}</span>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Subject:</span>
          <span className="ml-2 text-gray-900">{payload.sub || 'Unknown'}</span>
        </div>
        
        {issuedDate && (
          <div>
            <span className="font-medium text-gray-700">Issued:</span>
            <span className="ml-2 text-gray-900">{issuedDate.toLocaleString()}</span>
          </div>
        )}
        
        {expirationDate && (
          <div>
            <span className="font-medium text-gray-700">Expires:</span>
            <span className={`ml-2 ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
              {expirationDate.toLocaleString()}
              {isExpired && ' (Expired)'}
            </span>
          </div>
        )}
        
        <div>
          <span className="font-medium text-gray-700">Status:</span>
          <span className={`ml-2 ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
            {isExpired ? 'Expired' : 'Valid'}
          </span>
        </div>
        
        {payload.jti && (
          <div>
            <span className="font-medium text-gray-700">JTI:</span>
            <span className="ml-2 text-gray-900 font-mono text-xs">
              {payload.jti.substring(0, 8)}...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}