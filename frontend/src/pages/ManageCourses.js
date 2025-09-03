import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast/ToastContainer';
import adminService from '../services/adminService';
import './ManageCourses.css';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [pendingCourses, setPendingCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchCourses();
        fetchPendingCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (categoryFilter) params.category = categoryFilter;
            
            const response = await adminService.getAllCourses(params);
            setCourses(response.courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            showToast('Error loading courses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingCourses = async () => {
        try {
            const response = await adminService.getPendingCourses({ limit: 50 });
            setPendingCourses(response.courses || []);
        } catch (error) {
            console.error('Error fetching pending courses:', error);
            showToast('Error loading pending courses', 'error');
        }
    };

    const handleApproveCourse = async (courseId, courseTitle) => {
        try {
            await adminService.approveCourse(courseId);
            showToast(`Course "${courseTitle}" approved successfully`, 'success');
            fetchPendingCourses(); // Refresh pending courses
            fetchCourses(); // Refresh all courses
        } catch (error) {
            console.error('Error approving course:', error);
            showToast('Error approving course', 'error');
        }
    };

    const handleRejectCourse = async (courseId, courseTitle) => {
        const reason = prompt(`Please provide a reason for rejecting "${courseTitle}":`);
        if (!reason) return;
        
        try {
            await adminService.rejectCourse(courseId, reason);
            showToast(`Course "${courseTitle}" rejected`, 'info');
            fetchPendingCourses(); // Refresh pending courses
        } catch (error) {
            console.error('Error rejecting course:', error);
            showToast('Error rejecting course', 'error');
        }
    };

    const handleDeleteCourse = async (courseId, courseTitle) => {
        if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
            try {
                await adminService.deleteCourse(courseId);
                showToast(`Course "${courseTitle}" deleted successfully`, 'success');
                fetchCourses(); // Refresh the list
            } catch (error) {
                console.error('Error deleting course:', error);
                showToast('Error deleting course', 'error');
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses();
    };

    const displayCourses = activeTab === 'all' ? courses : pendingCourses;
    const filteredCourses = displayCourses.filter(course => {
        const matchesSearch = searchTerm === '' || 
            course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="manage-courses-page">
            <Header />
            <div className="manage-courses-container">
                <div className="page-header">
                    <h1>Course Management</h1>
                    <p>Manage and moderate all courses on the platform</p>
                </div>

                <div className="tabs-container">
                    <div className="tabs">
                        <button 
                            className={activeTab === 'all' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('all')}
                        >
                            All Courses ({courses.length})
                        </button>
                        <button 
                            className={activeTab === 'pending' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('pending')}
                        >
                            Pending Approval ({pendingCourses.length})
                        </button>
                    </div>
                </div>

                <div className="filters-section">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search courses by title or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Search</button>
                    </form>
                    
                    <div className="filters">
                        <select 
                            value={categoryFilter} 
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Categories</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Design">Design</option>
                            <option value="DevOps">DevOps</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading courses...</div>
                ) : (
                    <div className="courses-table-container">
                        <table className="courses-table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Instructor</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Students</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.length > 0 ? filteredCourses.map(course => (
                                    <tr key={course._id}>
                                        <td>
                                            <div className="course-info">
                                                <div className="course-image">
                                                    {course.coverImage ? (
                                                        <img src={course.coverImage} alt={course.title} />
                                                    ) : (
                                                        <div className="course-placeholder">📚</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="course-title">{course.title}</div>
                                                    <div className="course-id">ID: {course._id.slice(-8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="instructor-info">
                                                <div>{course.instructor?.firstName} {course.instructor?.lastName}</div>
                                                <div className="instructor-email">{course.instructor?.email}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="category-badge">{course.category}</span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${
                                                course.isPublished ? 'published' : 'draft'
                                            }`}>
                                                {course.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>{course.learners?.length || 0}</td>
                                        <td>
                                            {new Date(course.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="actions">
                                                {activeTab === 'pending' ? (
                                                    <>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleApproveCourse(course._id, course.title)}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-outline btn-sm"
                                                            onClick={() => handleRejectCourse(course._id, course.title)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn btn-outline btn-sm"
                                                            onClick={() => {/* TODO: View course details */}}
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            className="btn btn-outline btn-sm delete-btn"
                                                            onClick={() => handleDeleteCourse(course._id, course.title)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="no-data">
                                            {activeTab === 'pending' ? 'No pending courses' : 'No courses found'}
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

export default ManageCourses;
