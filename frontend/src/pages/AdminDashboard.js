import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="admin-links">
                <Link to="/admin/users" className="admin-button">Manage Users</Link>
                <Link to="/admin/courses" className="admin-button">Manage Courses</Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
