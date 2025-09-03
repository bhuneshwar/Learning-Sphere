import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast/ToastContainer';
import adminService from '../services/adminService';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (roleFilter) params.role = roleFilter;
            if (statusFilter) params.status = statusFilter;
            
            const response = await adminService.getAllUsers(params);
            setUsers(response.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Error loading users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminService.updateUserRole(userId, newRole);
            showToast('User role updated successfully', 'success');
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error updating user role:', error);
            showToast('Error updating user role', 'error');
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            await adminService.updateUserStatus(userId, !currentStatus);
            showToast(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`, 'success');
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error updating user status:', error);
            showToast('Error updating user status', 'error');
        }
    };

    const handleDelete = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            try {
                await adminService.deleteUser(userId);
                showToast('User deleted successfully', 'success');
                fetchUsers(); // Refresh the list
            } catch (error) {
                console.error('Error deleting user:', error);
                showToast('Error deleting user', 'error');
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = searchTerm === '' || 
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="manage-users-page">
            <Header />
            <div className="manage-users-container">
                <div className="page-header">
                    <h1>User Management</h1>
                    <p>Manage user accounts, roles, and permissions</p>
                </div>

                <div className="filters-section">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Search</button>
                    </form>
                    
                    <div className="filters">
                        <select 
                            value={roleFilter} 
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Instructor">Instructor</option>
                            <option value="Learner">Learner</option>
                        </select>
                        
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading users...</div>
                ) : (
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {user.profilePicture ? (
                                                        <img src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                                                    ) : (
                                                        `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="user-name">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className="user-id">ID: {user._id.slice(-8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className={`role-select role-${user.role.toLowerCase()}`}
                                                disabled={user.role === 'Admin'}
                                            >
                                                <option value="Learner">Learner</option>
                                                <option value="Instructor">Instructor</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleStatusToggle(user._id, user.isActive)}
                                                className={`status-toggle ${
                                                    user.isActive ? 'active' : 'inactive'
                                                }`}
                                                disabled={user.role === 'Admin'}
                                            >
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td>
                                            {new Date(user.dateJoined).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <button
                                                    className="btn btn-outline btn-sm"
                                                    onClick={() => {/* TODO: View user details */}}
                                                >
                                                    View
                                                </button>
                                                {user.role !== 'Admin' && (
                                                    <button
                                                        className="btn btn-outline btn-sm delete-btn"
                                                        onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="no-data">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ManageUsers;
