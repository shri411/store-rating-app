import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side Validation per requirements
        if (formData.name.length < 20 || formData.name.length > 60) {
            setError("Name must be between 20 and 60 characters.");
            return;
        }

        // Password Regex: 8-16 chars, 1 Uppercase, 1 Special Char
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
        if (!passwordRegex.test(formData.password)) {
            setError("Password must be 8-16 chars, with at least one uppercase letter and one special character.");
            return;
        }

        try {
            const res = await API.post('/auth/signup', formData);
            
            // Logic Fix: res.data.msg matches backend key
            alert(res.data.msg || "Registration successful!"); 
            navigate('/login');
        } catch (err) {
            // Error Fix: Access the custom 'msg' from the backend response
            const serverError = err.response?.data?.msg || "Signup failed. Please try again.";
            setError(serverError);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Create Account</h2>
                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                    Join the Store Rating platform
                </p>
                
                {error && <div style={errorStyle}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Full Name (20-60 chars)</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Full name for verification"
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            style={inputStyle}
                        />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Email Address</label>
                        <input 
                            type="email" 
                            required 
                            placeholder="email@example.com"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            style={inputStyle}
                        />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Address (Max 400 chars)</label>
                        <textarea 
                            required 
                            maxLength="400"
                            placeholder="Enter your full address"
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            style={{...inputStyle, height: '70px', resize: 'none'}}
                        />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Password (8-16 chars, 1 Upper, 1 Special)</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="********"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            style={inputStyle}
                        />
                    </div>

                    <button type="submit" style={buttonStyle}>Sign Up</button>
                </form>
                
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.95rem' }}>
                    Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

// Internal Styles
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '20px' };
const cardStyle = { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '480px' };
const inputGroup = { marginBottom: '18px' };
const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#444' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '1rem' };
const buttonStyle = { width: '100%', padding: '14px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px' };
const errorStyle = { backgroundColor: '#fff2f2', color: '#d93025', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid #ffcfcf', textAlign: 'center' };

export default Signup;