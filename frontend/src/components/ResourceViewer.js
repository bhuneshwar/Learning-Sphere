import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCourseResources } from '../services/resourceService';
import './ResourceViewer.css';

const ResourceViewer = ({ courseId, sectionId, lessonId }) => {
  const { user } = useSelector(state => state.auth);
  const [resources, setResources] = useState([]);
  const [courseResources, setCourseResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('lesson');

  useEffect(() => {
    if (courseId) {
      fetchResources();
    }
  }, [courseId, sectionId, lessonId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getCourseResources(courseId);
      
      // Filter course resources based on user role and public status
      const filteredCourseResources = data.courseResources.filter(resource => {
        // Instructors and admins can see all resources
        if (user.role === 'Instructor' || user.role === 'Admin') {
          return true;
        }
        // Students can only see public resources
        return resource.isPublic === true;
      });
      
      setCourseResources(filteredCourseResources || []);
      
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

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <i className="fas fa-file-pdf"></i>;
      case 'link':
        return <i className="fas fa-link"></i>;
      case 'file':
        return <i className="fas fa-file"></i>;
      default:
        return <i className="fas fa-file"></i>;
    }
  };

  if (loading) {
    return <div className="resource-viewer loading">Loading resources...</div>;
  }

  if (error) {
    return <div className="resource-viewer error">{error}</div>;
  }

  // If no resources are available at all
  if (!courseResources.length && !resources.length) {
    return null;
  }

  return (
    <div className="resource-viewer">
      {/* Show tabs only if both course and lesson resources exist */}
      {courseResources.length > 0 && resources.length > 0 && (
        <div className="resource-tabs">
          <button 
            className={`tab-btn ${activeTab === 'lesson' ? 'active' : ''}`}
            onClick={() => setActiveTab('lesson')}
          >
            Lesson Resources
          </button>
          <button 
            className={`tab-btn ${activeTab === 'course' ? 'active' : ''}`}
            onClick={() => setActiveTab('course')}
          >
            Course Resources
          </button>
        </div>
      )}

      {/* Course Resources Section */}
      {(activeTab === 'course' || (!resources.length && courseResources.length > 0)) && (
        <div className="resource-section">
          <h3>Course Resources</h3>
          <div className="resource-list">
            {courseResources.map((resource, index) => (
              <div key={resource._id || index} className="resource-item">
                <div className="resource-icon">
                  {getResourceTypeIcon(resource.type)}
                </div>
                <div className="resource-details">
                  <h4>{resource.title}</h4>
                  {resource.description && (
                    <p className="resource-description">{resource.description}</p>
                  )}
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <span>View Resource</span>
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Resources Section */}
      {(activeTab === 'lesson' || (!courseResources.length && resources.length > 0)) && (
        <div className="resource-section">
          <h3>Lesson Resources</h3>
          <div className="resource-list">
            {resources.map((resource, index) => (
              <div key={resource._id || index} className="resource-item">
                <div className="resource-icon">
                  {getResourceTypeIcon(resource.type)}
                </div>
                <div className="resource-details">
                  <h4>{resource.title}</h4>
                  {resource.description && (
                    <p className="resource-description">{resource.description}</p>
                  )}
                  {!sectionId && !lessonId && (
                    <p className="resource-location">
                      <small>
                        {resource.sectionTitle} &gt; {resource.lessonTitle}
                      </small>
                    </p>
                  )}
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <span>View Resource</span>
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceViewer;