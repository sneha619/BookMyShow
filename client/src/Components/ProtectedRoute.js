import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { localUser, isLoading, fetchUserData } = useAuth();

  useEffect(() => {
    console.log("ProtectedRoute mounted, checking user state");
    fetchUserData();
  }, [fetchUserData]);

  if (isLoading) {
    console.log("Loading user data, waiting...");
    return null;
  }

  if (!localUser) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("User found, rendering children");
  return children;
}

export default ProtectedRoute;