import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const StoreDashboard = () => {
    const [data, setData] = useState({ stats: { avg_rating: 0, total_ratings: 0 }, raters: [] });
    const navigate = useNavigate();

    useEffect(() => {
        fetchStoreData();
    }, []);

    const fetchStoreData = async () => {
        try {
            const res = await API.get('/stores/my-store/stats');
            setData(res.data);
        } catch (err) {
            console.error("Error fetching store data", err);
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Store Owner Dashboard</h1>
                <button onClick={logout} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}>Logout</button>
            </div>

            <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <div style={cardStyle}>
                    <h3>Average Rating</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                        {data.stats.avg_rating ? parseFloat(data.stats.avg_rating).toFixed(1) : "0.0"} / 5.0
                    </p>
                </div>
                <div style={cardStyle}>
                    <h3>Total Reviews</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{data.stats.total_ratings}</p>
                </div>
            </div>

            <h3>Users who rated your store</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={tdStyle}>User Name</th>
                        <th style={tdStyle}>Rating Given</th>
                        <th style={tdStyle}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.raters.length > 0 ? data.raters.map((r, i) => (
                        <tr key={i}>
                            <td style={tdStyle}>{r.name}</td>
                            <td style={tdStyle}>{r.rating_value} ⭐</td>
                            <td style={tdStyle}>{new Date(r.updated_at).toLocaleDateString()}</td>
                        </tr>
                    )) : (
                        <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No ratings yet.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const cardStyle = { flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '10px', textAlign: 'center', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const tdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };

export default StoreDashboard;