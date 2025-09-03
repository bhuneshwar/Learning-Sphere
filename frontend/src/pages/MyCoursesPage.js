import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast/ToastContainer';
import api from '../services/apiConfig';
import './MyCoursesPage.css';

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { showSuccess, showError, showWarning } = useToast();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('dateCreated');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0
  });

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses/instructor/my-courses');
      const coursesData = response.data.courses || response.data;
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      
      // Calculate stats
      const totalStudents = coursesData.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0);
      const totalRevenue = coursesData.reduce((sum, course) => sum + (course.price * (course.enrolledStudents?.length || 0)), 0);
      const avgRating = coursesData.reduce((sum, course) => sum + (course.ratings?.average || 0), 0) / coursesData.length;
      
      setStats({
        totalCourses: coursesData.length,
        totalStudents,
        totalRevenue,
        avgRating: avgRating || 0
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      showError('Failed to fetch your courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter(course => course._id !== courseId));
      setShowDeleteModal(false);
      setCourseToDelete(null);
      showSuccess('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      showError('Failed to delete course');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCourses.length === 0) {
      showWarning('Please select courses to delete');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedCourses.length} course(s)?`);
    if (confirmDelete) {
      try {
        await Promise.all(
          selectedCourses.map(courseId => api.delete(`/courses/${courseId}`))
        );
        setCourses(courses.filter(course => !selectedCourses.includes(course._id)));
        setSelectedCourses([]);
        showSuccess(`${selectedCourses.length} course(s) deleted successfully`);
      } catch (error) {
        console.error('Error deleting courses:', error);
        showError('Failed to delete some courses');
      }
    }
  };

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const selectAllCourses = () => {
    setSelectedCourses(
      selectedCourses.length === filteredCourses.length 
        ? [] 
        : filteredCourses.map(course => course._id)
    );
  };

  const updateCourseStatus = async (courseId, status) => {
    try {
      await api.patch(`/courses/${courseId}/status`, { status });
      setCourses(courses.map(course => 
        course._id === courseId ? { ...course, status } : course
      ));
      showSuccess(`Course ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating course status:', error);
      showError('Failed to update course status');
    }
  };

  const duplicateCourse = async (course) => {
    try {
      const duplicateData = {
        ...course,
        title: `${course.title} (Copy)`,
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        enrolledStudents: [],
        ratings: { average: 0, count: 0 }
      };
      
      const response = await api.post('/courses', duplicateData);
      const newCourse = response.data.course || response.data;
      setCourses([newCourse, ...courses]);
      showSuccess('Course duplicated successfully');
    } catch (error) {
      console.error('Error duplicating course:', error);
      showError('Failed to duplicate course');
    }
  };

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dateCreated':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'students':
          return (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0);
        case 'rating':
          return (b.ratings?.average || 0) - (a.ratings?.average || 0);
        case 'price':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="my-courses-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your courses...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-courses-page">
      <Header />
      
      <div className="my-courses-container">
        <div className="courses-header">
          <div className="header-content">
            <h1>My Courses</h1>
            <p>Manage and track your course content</p>
          </div>
          <div className="header-actions">
            <Link to="/create-course" className="btn btn-primary">
              <span className="btn-icon">➕</span>
              Create New Course
            </Link>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalCourses}</div>
              <div className="stat-label">Total Courses</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalStudents.toLocaleString()}</div>
              <div className="stat-label">Total Students</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">{stats.avgRating.toFixed(1)}</div>
              <div className="stat-label">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="courses-toolbar">
          <div className="toolbar-left">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="dateCreated">Date Created</option>
              <option value="title">Title</option>
              <option value="students">Students</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
            </select>
          </div>
          
          <div className="toolbar-right">
            <div className="view-toggles">
              <button
                className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
              <button
                className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
            </div>
            
            {selectedCourses.length > 0 && (
              <div className="bulk-actions">
                <span className="selected-count">{selectedCourses.length} selected</span>
                <button className="btn btn-outline btn-sm" onClick={handleBulkDelete}>
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Course Selection */}
        {filteredCourses.length > 0 && (
          <div className="select-all-container">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                onChange={selectAllCourses}
              />
              <span className="checkbox-label">
                Select All ({filteredCourses.length} courses)
              </span>
            </label>
          </div>
        )}

        {/* Courses Grid/List */}
        {filteredCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No courses found</h3>
            <p>
              {courses.length === 0 
                ? "You haven't created any courses yet. Start by creating your first course!"
                : "No courses match your current filters. Try adjusting your search criteria."
              }
            </p>
            {courses.length === 0 && (
              <Link to="/create-course" className="btn btn-primary">
                Create Your First Course
              </Link>
            )}
          </div>
        ) : (
          <div className={`courses-container ${viewMode}`}>
            {filteredCourses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-selection">
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course._id)}
                    onChange={() => toggleCourseSelection(course._id)}
                  />
                </div>
                
                <div className="course-image">
                  <img 
                    src={course.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                    alt={course.title}
                  />
                  <div className="course-status">
                    <span className={`status-badge ${course.status?.toLowerCase()}`}>
                      {course.status || 'Draft'}
                    </span>
                  </div>
                </div>
                
                <div className="course-content">
                  <div className="course-meta">
                    <span className="course-category">{course.category}</span>
                    <span className="course-level">{course.level}</span>
                  </div>
                  
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">
                    {course.description?.substring(0, 100)}...
                  </p>
                  
                  <div className="course-stats">
                    <div className="stat">
                      <span className="stat-icon">👥</span>
                      <span>{course.enrolledStudents?.length || 0} students</span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">⭐</span>
                      <span>{course.ratings?.average?.toFixed(1) || '0.0'} ({course.ratings?.count || 0})</span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">💰</span>
                      <span>{course.price > 0 ? formatCurrency(course.price) : 'Free'}</span>
                    </div>
                  </div>
                  
                  <div className="course-actions">
                    <Link 
                      to={`/courses/${course._id}/edit`} 
                      className="btn btn-outline btn-sm"
                    >
                      Edit
                    </Link>
                    <Link 
                      to={`/courses/${course._id}/analytics`} 
                      className="btn btn-ghost btn-sm"
                    >
                      Analytics
                    </Link>
                    
                    <div className="course-menu">
                      <button className="menu-trigger">⋮</button>
                      <div className="menu-dropdown">
                        {course.status === 'Draft' && (
                          <button onClick={() => updateCourseStatus(course._id, 'Published')}>
                            Publish
                          </button>
                        )}
                        {course.status === 'Published' && (
                          <button onClick={() => updateCourseStatus(course._id, 'Archived')}>
                            Archive
                          </button>
                        )}
                        <button onClick={() => duplicateCourse(course)}>
                          Duplicate
                        </button>
                        <Link to={`/courses/${course._id}`}>
                          Preview
                        </Link>
                        <button 
                          onClick={() => {
                            setCourseToDelete(course);
                            setShowDeleteModal(true);
                          }}
                          className="danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Course</h3>
            <p>
              Are you sure you want to delete "{courseToDelete.title}"? 
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleDeleteCourse(courseToDelete._id)}
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default MyCoursesPage;
