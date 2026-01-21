import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const statsRes = await API.get('/admin/stats');
            const storesRes = await API.get('/admin/stores');
            setStats(statsRes.data);
            setStores(storesRes.data);
        } catch (err) {
            console.error("Error fetching admin data", err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Filter logic for the table
    const filteredStores = stores.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>System Administrator Dashboard</h2>
                <button onClick={handleLogout} style={logoutBtn}>Logout</button>
            </div>

            <hr />

            {/* Stats Section */}
            <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <div style={statCard}><h4>Total Users</h4><p>{stats.users}</p></div>
                <div style={statCard}><h4>Total Stores</h4><p>{stats.stores}</p></div>
                <div style={statCard}><h4>Total Ratings</h4><p>{stats.ratings}</p></div>
            </div>

            <h3>Store Management</h3>
            
            <input 
                type="text" 
                placeholder="Filter by Name, Email or Address..." 
                style={searchInput}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <table style={tableStyle}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th style={thStyle}>Store Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Address</th>
                        <th style={thStyle}>Avg Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStores.map((store) => (
                        <tr key={store.id}>
                            <td style={tdStyle}>{store.name}</td>
                            <td style={tdStyle}>{store.email}</td>
                            <td style={tdStyle}>{store.address}</td>
                            <td style={tdStyle}>
                                {store.avg_rating ? parseFloat(store.avg_rating).toFixed(1) : "No Ratings"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Simple Styles
const statCard = { flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f9f9f9' };
const logoutBtn = { padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const searchInput = { width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const thStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
const tdStyle = { border: '1px solid #ddd', padding: '12px' };

export default AdminDashboard;