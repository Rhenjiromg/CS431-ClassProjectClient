import React from 'react';
import { Navigate } from 'react-router-dom';

const ReversedProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = user === null;

    return isAuthenticated ? children : <Navigate to="/dashboard" />;
};

export default ReversedProtectedRoute;