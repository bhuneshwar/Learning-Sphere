import React, { useEffect, useState } from 'react';
import axios from '../services/authService';
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('Learner');
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/auth/role/${role}`);
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [role]);
  return (
    <div>
      <h1>User Management</h1>
      <select onChange={(e) => setRole(e.target.value)} value={role}>
        <option value="Learner">Learner</option>
        <option value="Instructor">Instructor</option>
        <option value="Admin">Admin</option>
      </select>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.username} - {user.role}</li>
        ))}
      </ul>

    </div>
  );
};
export default UserManagement;