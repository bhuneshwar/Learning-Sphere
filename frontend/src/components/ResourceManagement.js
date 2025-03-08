import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getCourseResources,
  addCourseResource,
  updateCourseResource,
  deleteCourseResource,
  addLessonResource,
  updateResource,
  deleteResource
} from '../services/resourceService';
import '../styles/ResourceManagement.css';

const ResourceManagement = ({ courseId, sectionId, lessonId }) => {
  const { user } = useSelector(state => state.auth);
  const [resources, setResources] = useState([]);
  const [courseResources, setCourseResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceType, setResourceType] = useState('lesson'); // 'lesson' or 'course'
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'pdf',
    url: '',
    description: ''
  });

  // Fetch resources when component mounts
  useEffect(() => {
    fetchResources();
  }, [courseId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getCourseResources(courseId);
      
      // Set course-level resources
      setCourseResources(data.courseResources || []);
      
      // If we have specific section and lesson IDs, filter resources for that lesson
      if (sectionId && lessonId) {
        const lessonResource = data.lessonResources
          .find(item => item.sectionId === sectionId && item.lessonId === lessonId);
        setResources(lessonResource ? lessonResource.resources : []);
      } else {
        // Otherwise, flatten all lesson resources
        const allResources = data.lessonResources.flatMap(item => {
          return item.resources.map(resource => ({
            ...resource,
            sectionId: item.sectionId,
            lessonId: item.lessonId,
            sectionTitle: item.sectionTitle,
            lessonTitle: item.lessonTitle
          }));
        });
        setResources(allResources);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load resources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'pdf',
      url: '',
      description: ''
    });
    setEditingResource(null);
    setShowAddForm(false);
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (resourceType === 'course') {
        // Add course-level resource
        await addCourseResource(courseId, formData);
      } else if (sectionId && lessonId) {
        // Add lesson-level resource
        await addLessonResource(courseId, sectionId, lessonId, formData);
      } else {
        throw new Error('Cannot add lesson resource without section and lesson IDs');
      }
      
      resetForm();
      fetchResources();
    } catch (err) {
      setError('Failed to add resource');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResource = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (resourceType === 'course') {
        // Update course-level resource
        await updateCourseResource(
          courseId,
          editingResource._id,
          formData
        );
      } else {
        // Update lesson-level resource
        await updateResource(
          courseId,
          editingResource.sectionId,
          editingResource.lessonId,
          editingResource._id,
          formData
        );
      }
      
      resetForm();
      fetchResources();
    } catch (err) {
      setError('Failed to update resource');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (resource, isCourseResource = false) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      setLoading(true);
      
      if (isCourseResource) {
        // Delete course-level resource
        await deleteCourseResource(courseId, resource._id);
      } else {
        // Delete lesson-level resource
        await deleteResource(
          courseId,
          resource.sectionId,
          resource.lessonId,
          resource._id
        );
      }
      
      fetchResources();
    } catch (err) {
      setError('Failed to delete resource');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (resource, isCourseResource = false) => {
    setEditingResource(resource);
    setResourceType(isCourseResource ? 'course' : 'lesson');
    setFormData({
      title: resource.title,
      type: resource.type,
      url: resource.url,
      description: resource.description || '',
      isPublic: resource.isPublic || false
    });
    setShowAddForm(true);
  };

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'link':
        return '🔗';
      case 'file':
        return '📁';
      default:
        return '📄';
    }
  };

  if (loading && resources.length === 0) {
    return <div className="loading">Loading resources...</div>;
  }

  return (
    <div className="resource-management">
      <div className="resource-header">
        <h3>Course Resources</h3>
        {(user.role === 'Instructor' || user.role === 'Admin') && (
          <div className="resource-actions">
            <button 
              className={`resource-type-btn ${resourceType === 'course' ? 'active' : ''}`}
              onClick={() => setResourceType('course')}
            >
              Course Resources
            </button>
            <button 
              className={`resource-type-btn ${resourceType === 'lesson' ? 'active' : ''}`}
              onClick={() => setResourceType('lesson')}
              disabled={!sectionId || !lessonId}
            >
              Lesson Resources
            </button>
            <button 
              className="add-resource-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Add Resource'}
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (user.role === 'Instructor' || user.role === 'Admin') && (
        <form 
          className="resource-form"
          onSubmit={editingResource ? handleUpdateResource : handleAddResource}
        >
          <h4>{resourceType === 'course' ? 'Course Resource' : 'Lesson Resource'}</h4>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="pdf">PDF</option>
              <option value="link">Link</option>
              <option value="file">File</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="url">URL</label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
          
          {resourceType === 'course' && (
            <div className="form-group">
              <label htmlFor="isPublic">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                />
                Make publicly available to all students
              </label>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingResource ? 'Update Resource' : 'Add Resource'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Course Resources Section */}
      {resourceType === 'course' && (
        <div className="course-resources-section">
          <h4>Course-Level Resources</h4>
          {courseResources.length > 0 ? (
            <ul className="resource-list">
              {courseResources.map((resource) => (
                <li key={resource._id} className="resource-item">
                  <div className="resource-icon">{getResourceTypeIcon(resource.type)}</div>
                  <div className="resource-content">
                    <h4 className="resource-title">{resource.title}</h4>
                    {resource.description && <p className="resource-description">{resource.description}</p>}
                    {resource.isPublic && <span className="public-badge">Public</span>}
                  </div>
                  <div className="resource-actions">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-btn"
                    >
                      View
                    </a>
                    
                    {(user.role === 'Instructor' || user.role === 'Admin') && (
                      <>
                        <button 
                          className="edit-btn"
                          onClick={() => startEditing(resource, true)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteResource(resource, true)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-resources">No course-level resources available.</p>
          )}
        </div>
      )}

      {/* Lesson Resources Section */}
      {resourceType === 'lesson' && (
        <div className="lesson-resources-section">
          <h4>Lesson-Level Resources</h4>
          {resources.length > 0 ? (
            <ul className="resource-list">
              {resources.map((resource) => (
                <li key={resource._id} className="resource-item">
                  <div className="resource-icon">{getResourceTypeIcon(resource.type)}</div>
                  <div className="resource-content">
                    <h4 className="resource-title">{resource.title}</h4>
                    {resource.description && <p className="resource-description">{resource.description}</p>}
                    {!sectionId && !lessonId && (
                      <p className="resource-location">
                        <small>
                          {resource.sectionTitle} &gt; {resource.lessonTitle}
                        </small>
                      </p>
                    )}
                  </div>
                  <div className="resource-actions">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-btn"
                    >
                      View
                    </a>
                    
                    {(user.role === 'Instructor' || user.role === 'Admin') && (
                      <>
                        <button 
                          className="edit-btn"
                          onClick={() => startEditing(resource)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteResource(resource)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-resources">No lesson-level resources available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;