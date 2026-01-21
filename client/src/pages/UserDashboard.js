import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [newPass, setNewPass] = useState('');
    const navigate = useNavigate();

    useEffect(() => { 
        fetchStores(); 
    }, []);

   const fetchStores = async () => {
    try {
        // CHANGE THIS LINE from /admin/stores to /stores/all
        const res = await API.get('/stores/all'); 
        console.log("Stores fetched successfully:", res.data);
        setStores(res.data);
    } catch (err) { 
        console.error("Error fetching stores:", err); 
    }
};

    const handleRate = async (storeId, val) => {
        if (!val) return; // Don't trigger if "Rate..." is selected
        try {
            await API.post('/stores/rate', { store_id: storeId, rating_value: val });
            alert("Rating submitted successfully!");
            fetchStores(); // Refresh data to show new average
        } catch (err) { 
            alert("Error submitting rating. Please try again."); 
        }
    };

    const handleChangePassword = async () => {
        if (!newPass) return alert("Please enter a new password");
        try {
            await API.post('/auth/change-password', { newPassword: newPass });
            alert("Password updated successfully!");
            setNewPass('');
        } catch (err) { 
            alert(err.response?.data?.msg || "Update failed"); 
        }
    };

    // CASE-INSENSITIVE FILTERING LOGIC
    const filteredStores = stores.filter(store => {
        const searchTerm = search.toLowerCase();
        return (
            store.name.toLowerCase().includes(searchTerm) ||
            store.address.toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div style={{ padding: '30px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Store Finder</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        value={newPass} 
                        onChange={(e) => setNewPass(e.target.value)} 
                        style={inputStyle}
                    />
                    <button onClick={handleChangePassword} style={actionBtn}>Update Pass</button>
                    <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={logoutBtn}>Logout</button>
                </div>
            </div>

            <input 
                type="text" 
                placeholder="Search by store name or address..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)} 
                style={searchBar} 
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredStores.length > 0 ? (
                    filteredStores.map(store => (
                        <div key={store.id} style={cardStyle}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{store.name}</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>📍 {store.address}</p>
                            <p style={{ fontWeight: 'bold', color: '#007bff' }}>
                                ⭐ Rating: {store.avg_rating ? parseFloat(store.avg_rating).toFixed(1) : 'No ratings'}
                            </p>
                            <div style={{ marginTop: '15px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>Submit your rating:</label>
                                <select 
                                    onChange={(e) => handleRate(store.id, e.target.value)}
                                    style={selectStyle}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select Stars...</option>
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <option key={n} value={n}>{n} {n === 1 ? 'Star' : 'Stars'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#999' }}>
                        <h3>No stores found matching "{search}"</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

// Styles
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const actionBtn = { padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const logoutBtn = { padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const searchBar = { width: '100%', padding: '15px', marginBottom: '30px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' };
const cardStyle = { backgroundColor: 'white', border: '1px solid #eee', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const selectStyle = { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' };

export default UserDashboard;