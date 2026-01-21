import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            
            // Redirect based on role
            if (res.data.user.role === 'Admin') navigate('/admin-dashboard');
            else if (res.data.user.role === 'StoreOwner') navigate('/store-dashboard');
            else navigate('/user-dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Store Rating App - Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" required 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input type="password" placeholder="Password" required 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none' }}>
                    Login
                </button>
            </form>
            <p>Don't have an account? <a href="/signup">Signup here</a></p>
        </div>
    );
};

export default Login;