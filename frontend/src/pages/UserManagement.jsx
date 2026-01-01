import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const API_URL = 'http://localhost:5000/api';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteUser, setDeleteUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users`);
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post(`${API_URL}/users`, formData);
            fetchUsers();
            setShowAddForm(false);
            setFormData({ name: '', email: '', password: '', role: 'user' });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add user');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`${API_URL}/users/${deleteUser._id}`);
            fetchUsers();
            setDeleteUser(null);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (currentUser?.role !== 'admin') {
        return (
            <div className="users-page">
                <div className="empty-state">
                    <h3>Access Denied</h3>
                    <p>You need admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="loading-screen"><div className="spinner"></div></div>;
    }

    return (
        <div className="users-page">
            <div className="users-header">
                <h1>User Management</h1>
                <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                    + Add User
                </button>
            </div>

            <div className="users-grid">
                {users.map(user => (
                    <div key={user._id} className="user-card">
                        <div className="user-card-avatar">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-card-info">
                            <div className="user-card-name">{user.name}</div>
                            <div className="user-card-email">{user.email}</div>
                            <span className="user-card-role">{user.role}</span>
                        </div>
                        {user._id !== currentUser.id && (
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => setDeleteUser(user)}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {showAddForm && (
                <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New User</h2>
                            <button className="modal-close" onClick={() => setShowAddForm(false)}>
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleAddUser}>
                            <div className="modal-body">
                                {error && <div className="error-message">{error}</div>}
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        className="form-control"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteUser && (
                <DeleteConfirmModal
                    taskTitle={deleteUser.name}
                    message="Are you sure you want to remove this user? This action cannot be undone."
                    onConfirm={handleDeleteUser}
                    onCancel={() => setDeleteUser(null)}
                />
            )}
        </div>
    );
}

export default UserManagement;
