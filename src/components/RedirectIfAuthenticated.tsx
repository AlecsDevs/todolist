import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RedirectIfAuthenticated = ({ children }) => {
  const { user } = useAuth();
  
  // If user is logged in, redirect to dashboard
  return user ? <Navigate to="/" /> : children;
};