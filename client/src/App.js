import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreDashboard from './pages/StoreDashboard';

// Helper to protect routes based on role
const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) return <Navigate replace to="/login" />;
    if (allowedRole && role !== allowedRole) return <Navigate replace to="/" />;
    
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Role Based Routes */}
                <Route path="/admin-dashboard" element={
                    <ProtectedRoute allowedRole="Admin"><AdminDashboard /></ProtectedRoute>
                } />
                <Route path="/user-dashboard" element={
                    <ProtectedRoute allowedRole="User"><UserDashboard /></ProtectedRoute>
                } />
                <Route path="/store-dashboard" element={
                    <ProtectedRoute allowedRole="StoreOwner"><StoreDashboard /></ProtectedRoute>
                } />

                {/* Default Route */}
                <Route path="/" element={<Navigate replace to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;