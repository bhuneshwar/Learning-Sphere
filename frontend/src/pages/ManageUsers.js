import { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/protected/admin/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="manage-users">
            <h1>Manage Users</h1>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const handleDelete = async (id) => {
    try {
        await axios.delete(`/api/protected/admin/users/${id}`);
        window.location.reload();
    } catch (error) {
        console.error('Error deleting user', error);
    }
};

export default ManageUsers;
