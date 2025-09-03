import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast/ToastContainer';
import { signOut } from '../utils/authUtils';
import adminService from '../services/adminService';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const user = useSelector((state) => state.auth?.user) || JSON.parse(localStorage.getItem('user'));
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    
    // State for real data
    const [dashboardStats, setDashboardStats] = useState(null);
    const [recentActivities, setRecentActivities] = useState({ recentUsers: [], recentCourses: [] });
    const [pendingCourses, setPendingCourses] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    
    // Fetch dashboard data
    useEffect(() => {
        fetchDashboardData();
    }, []);
    
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsData, activitiesData, pendingData] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getRecentActivities(),
                adminService.getPendingCourses({ limit: 5 })
            ]);
            
            setDashboardStats(statsData.stats);
            setRecentActivities(activitiesData);
            setPendingCourses(pendingData.courses || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            showToast('Error loading dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const fetchUsersData = async () => {
        try {
            const userData = await adminService.getAllUsers({ limit: 50 });
            setAllUsers(userData.users || []);
        } catch (error) {
            showToast('Error loading users', 'error');
        }
    };
    
    const fetchCoursesData = async () => {
        try {
            const courseData = await adminService.getAllCourses({ limit: 50 });
            setAllCourses(courseData.courses || []);
        } catch (error) {
            showToast('Error loading courses', 'error');
        }
    };
    
    const fetchAnalytics = async () => {
        try {
            const analyticsData = await adminService.getPlatformAnalytics();
            setAnalytics(analyticsData);
        } catch (error) {
            showToast('Error loading analytics', 'error');
        }
    };
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        
        // Fetch data for specific tabs when needed
        if (tab === 'users' && allUsers.length === 0) {
            fetchUsersData();
        } else if (tab === 'courses' && allCourses.length === 0) {
            fetchCoursesData();
        } else if (tab === 'analytics' && !analytics) {
            fetchAnalytics();
        }
    };
    
    const handleApproveCourse = async (courseId) => {
        try {
            await adminService.approveCourse(courseId);
            showToast('Course approved successfully', 'success');
            // Refresh pending courses
            const pendingData = await adminService.getPendingCourses({ limit: 5 });
            setPendingCourses(pendingData.courses || []);
            // Update stats
            fetchDashboardData();
        } catch (error) {
            showToast('Error approving course', 'error');
        }
    };
    
    const handleRejectCourse = async (courseId) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;
        
        try {
            await adminService.rejectCourse(courseId, reason);
            showToast('Course rejected', 'info');
            // Refresh pending courses
            const pendingData = await adminService.getPendingCourses({ limit: 5 });
            setPendingCourses(pendingData.courses || []);
        } catch (error) {
            showToast('Error rejecting course', 'error');
        }
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'overview':
                return (
                    <div className="admin-overview">
                        <div className="admin-welcome">
                            <h1>Welcome, {user?.firstName || 'Admin'}!</h1>
                            <p>Manage your learning platform from this central dashboard</p>
                        </div>
                        
                        {loading ? (
                            <div className="loading-spinner">Loading dashboard data...</div>
                        ) : dashboardStats ? (
                            <div className="admin-stats">
                                <div className="stat-card">
                                    <div className="stat-icon users-icon">👥</div>
                                    <div className="stat-content">
                                        <h3>Total Users</h3>
                                        <p className="stat-value">{dashboardStats.totalUsers || 0}</p>
                                        <span className="stat-trend">+{dashboardStats.recentRegistrations || 0} this week</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon courses-icon">📚</div>
                                    <div className="stat-content">
                                        <h3>Total Courses</h3>
                                        <p className="stat-value">{dashboardStats.totalCourses || 0}</p>
                                        <span className="stat-trend">{dashboardStats.pendingApprovals || 0} pending</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon revenue-icon">💰</div>
                                    <div className="stat-content">
                                        <h3>Platform Revenue</h3>
                                        <p className="stat-value">${dashboardStats.totalRevenue || 0}</p>
                                        <span className="stat-trend">Total earnings</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon instructors-icon">👨‍🏫</div>
                                    <div className="stat-content">
                                        <h3>Instructors</h3>
                                        <p className="stat-value">{dashboardStats.totalInstructors || 0}</p>
                                        <span className="stat-trend">Active on platform</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="error-message">Failed to load dashboard stats</div>
                        )}

                        <div className="admin-grid">
                            <div className="admin-section">
                                <div className="section-header">
                                    <h2>Recent Users</h2>
                                    <button className="view-all-btn" onClick={() => setActiveTab('users')}>View All</button>
                                </div>
                                <div className="users-list">
                                    {recentActivities.recentUsers?.length > 0 ? (
                                        recentActivities.recentUsers.slice(0, 4).map(user => (
                                            <div key={user._id} className="user-item">
                                                <div className="user-avatar">
                                                    {user.profilePicture ? (
                                                        <img src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                                                    ) : (
                                                        `${user.firstName?.charAt(0) || 'U'}${user.lastName?.charAt(0) || ''}`
                                                    )}
                                                </div>
                                                <div className="user-info">
                                                    <h4>{user.firstName} {user.lastName}</h4>
                                                    <p>{user.email}</p>
                                                    <span className={`user-role ${user.role.toLowerCase()}`}>{user.role}</span>
                                                </div>
                                                <div className={`user-status ${user.isActive ? 'active' : 'inactive'}`}>
                                                    {user.isActive ? 'active' : 'inactive'}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-data">No recent users</div>
                                    )}
                                </div>
                            </div>

                            <div className="admin-section">
                                <div className="section-header">
                                    <h2>Pending Approvals</h2>
                                    <button className="view-all-btn" onClick={() => setActiveTab('approvals')}>View All</button>
                                </div>
                                <div className="pending-courses">
                                    {pendingCourses?.length > 0 ? (
                                        pendingCourses.map(course => (
                                            <div key={course._id} className="pending-item">
                                                <div className="pending-info">
                                                    <h4>{course.title}</h4>
                                                    <p>by {course.instructor?.firstName} {course.instructor?.lastName}</p>
                                                    <span className="category">{course.category}</span>
                                                </div>
                                                <div className="pending-actions">
                                                    <button 
                                                        className="approve-btn"
                                                        onClick={() => handleApproveCourse(course._id)}
                                                        title="Approve Course"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button 
                                                        className="reject-btn"
                                                        onClick={() => handleRejectCourse(course._id)}
                                                        title="Reject Course"
                                                    >
                                                        ✗
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-data">No pending course approvals</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="admin-quick-actions">
                            <Link to="/admin/users" className="quick-action-card">
                                <div className="action-icon">👥</div>
                                <div className="action-content">
                                    <h3>User Management</h3>
                                    <p>Manage user accounts, roles, and permissions</p>
                                </div>
                            </Link>
                            <Link to="/admin/courses" className="quick-action-card">
                                <div className="action-icon">📚</div>
                                <div className="action-content">
                                    <h3>Course Management</h3>
                                    <p>Review, approve, and manage course content</p>
                                </div>
                            </Link>
                            <Link to="/admin/analytics" className="quick-action-card">
                                <div className="action-icon">📊</div>
                                <div className="action-content">
                                    <h3>Platform Analytics</h3>
                                    <p>View detailed platform usage and revenue analytics</p>
                                </div>
                            </Link>
                            <Link to="/admin/settings" className="quick-action-card">
                                <div className="action-icon">⚙️</div>
                                <div className="action-content">
                                    <h3>System Settings</h3>
                                    <p>Configure platform settings and preferences</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div className="admin-users">
                        <h2>User Management</h2>
                        <div className="users-management">
                            <div className="users-filters">
                                <input type="text" placeholder="Search users..." className="search-input" />
                                <select className="filter-select">
                                    <option value="">All Roles</option>
                                    <option value="learner">Learners</option>
                                    <option value="instructor">Instructors</option>
                                    <option value="admin">Admins</option>
                                </select>
                            </div>
                            <div className="users-table">
                                {allUsers?.length > 0 ? (
                                    allUsers.map(user => (
                                        <div key={user._id} className="user-row">
                                            <div className="user-avatar">
                                                {user.profilePicture ? (
                                                    <img src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                                                ) : (
                                                    `${user.firstName?.charAt(0) || 'U'}${user.lastName?.charAt(0) || ''}`
                                                )}
                                            </div>
                                            <div className="user-details">
                                                <h4>{user.firstName} {user.lastName}</h4>
                                                <p>{user.email}</p>
                                            </div>
                                            <div className={`role-badge ${user.role.toLowerCase()}`}>
                                                {user.role}
                                            </div>
                                            <div className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                                {user.isActive ? 'active' : 'inactive'}
                                            </div>
                                            <div className="user-actions">
                                                <button className="edit-btn">Edit</button>
                                                <button className="delete-btn">Delete</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-data">
                                        {allUsers?.length === 0 ? 'No users found' : 'Loading users...'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'courses':
                return (
                    <div className="admin-courses">
                        <h2>Course Management</h2>
                        <p>Manage and moderate all courses on the platform</p>
                    </div>
                );
            case 'analytics':
                return (
                    <div className="admin-analytics">
                        <h2>Platform Analytics</h2>
                        <p>View comprehensive platform analytics and insights</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="admin-settings">
                        <h2>System Settings</h2>
                        <p>Configure platform-wide settings and preferences</p>
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="dashboard-container">
            <Header />
            <main className="dashboard-main">
                <div className="dashboard-sidebar">
                    <div className="user-welcome">
                        <div className="user-avatar admin-avatar">
                            {user?.firstName?.charAt(0) || 'A'}
                        </div>
                        <h3>{user?.firstName} {user?.lastName || ''}</h3>
                        <p>{user?.role || 'Administrator'}</p>
                    </div>
                    <nav className="dashboard-nav">
                        <ul>
                            <li className={activeTab === 'overview' ? 'active' : ''}>
                                <button onClick={() => setActiveTab('overview')}>
                                    <i className="fas fa-tachometer-alt"></i> Overview
                                </button>
                            </li>
                            <li className={activeTab === 'users' ? 'active' : ''}>
                                <button onClick={() => handleTabChange('users')}>
                                    <i className="fas fa-users"></i> Users
                                </button>
                            </li>
                            <li className={activeTab === 'courses' ? 'active' : ''}>
                                <button onClick={() => handleTabChange('courses')}>
                                    <i className="fas fa-book"></i> Courses
                                </button>
                            </li>
                            <li className={activeTab === 'analytics' ? 'active' : ''}>
                                <button onClick={() => handleTabChange('analytics')}>
                                    <i className="fas fa-chart-line"></i> Analytics
                                </button>
                            </li>
                            <li className={activeTab === 'settings' ? 'active' : ''}>
                                <button onClick={() => handleTabChange('settings')}>
                                    <i className="fas fa-cog"></i> Settings
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <button className="logout-btn" onClick={() => signOut(navigate)}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
                <div className="dashboard-content">
                    {renderTabContent()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
