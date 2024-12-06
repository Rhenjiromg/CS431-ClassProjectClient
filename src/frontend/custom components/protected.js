import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserProvider } from '../contexts/Context';

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = user !== null;

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;