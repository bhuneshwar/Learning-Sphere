import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCourseResources } from '../services/resourceService';
import { recordResourceDownload } from '../services/resourceDownloadService';
import ResourcePreview from './ResourcePreview';
import './ResourceViewer.css';

const ResourceViewer = ({ courseId, sectionId, lessonId }) => {
  const { user } = useSelector(state => state.auth);
  const [resources, setResources] = useState([]);
  const [courseResources, setCourseResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('lesson');
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [filteredCourseResources, setFilteredCourseResources] = useState([]);
  const [previewResource, setPreviewResource] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchResources();
    }
  }, [courseId, sectionId, lessonId]);
  
  // Filter resources when selected tags change
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredResources(resources);
      setFilteredCourseResources(courseResources);
    } else {
      const filtered = resources.filter(resource => {
        if (!resource.tags || !Array.isArray(resource.tags)) return false;
        return selectedTags.some(tag => resource.tags.includes(tag));
      });
      
      const filteredCourse = courseResources.filter(resource => {
        if (!resource.tags || !Array.isArray(resource.tags)) return false;
        return selectedTags.some(tag => resource.tags.includes(tag));
      });
      
      setFilteredResources(filtered);
      setFilteredCourseResources(filteredCourse);
    }
  }, [selectedTags, resources, courseResources]);

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
      setFilteredCourseResources(filteredCourseResources || []);
      
      // If we have specific section and lesson IDs, filter resources for that lesson
      let resourcesList = [];
      if (sectionId && lessonId) {
        const lessonResource = data.lessonResources
          .find(item => item.sectionId === sectionId && item.lessonId === lessonId);
        resourcesList = lessonResource ? lessonResource.resources : [];
        setResources(resourcesList);
      } else {
        // Otherwise, flatten all lesson resources
        resourcesList = data.lessonResources.flatMap(item => {
          return item.resources.map(resource => ({
            ...resource,
            sectionId: item.sectionId,
            lessonId: item.lessonId,
            sectionTitle: item.sectionTitle,
            lessonTitle: item.lessonTitle
          }));
        });
        setResources(resourcesList);
      }
      setFilteredResources(resourcesList);
      
      // Extract all unique tags from resources
      const allTags = new Set();
      
      // Add tags from course resources
      filteredCourseResources.forEach(resource => {
        if (resource.tags && Array.isArray(resource.tags)) {
          resource.tags.forEach(tag => allTags.add(tag));
        }
      });
      
      // Add tags from lesson resources
      resourcesList.forEach(resource => {
        if (resource.tags && Array.isArray(resource.tags)) {
          resource.tags.forEach(tag => allTags.add(tag));
        }
      });
      
      setAvailableTags(Array.from(allTags));
      setError(null);
    } catch (err) {
      setError('Failed to load resources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Track resource download/view
  const handleResourceClick = async (resource, resourceType) => {
    try {
      // Check if the resource type is previewable
      const previewableTypes = ['pdf', 'video', 'audio', 'image'];
      
      if (previewableTypes.includes(resource.type)) {
        // Show preview instead of downloading
        setPreviewResource(resource);
      } else {
        // Prepare download data
        const downloadData = {
          courseId,
          resourceId: resource._id,
          resourceType
        };
        
        // Add section and lesson IDs for lesson resources
        if (resourceType === 'lesson') {
          downloadData.sectionId = resource.sectionId || sectionId;
          downloadData.lessonId = resource.lessonId || lessonId;
        }
        
        // Record the download
        await recordResourceDownload(downloadData);
        
        // Continue with opening the resource
        window.open(resource.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to record resource download:', error);
      // Still open the resource even if tracking fails
      window.open(resource.url, '_blank');
    }
  };
  
  // Handle resource download from preview
  const handleResourceDownload = async (resource) => {
    try {
      // Determine resource type (course or lesson)
      const resourceType = resource.sectionId ? 'lesson' : 'course';
      
      // Prepare download data
      const downloadData = {
        courseId,
        resourceId: resource._id,
        resourceType
      };
      
      // Add section and lesson IDs for lesson resources
      if (resourceType === 'lesson') {
        downloadData.sectionId = resource.sectionId || sectionId;
        downloadData.lessonId = resource.lessonId || lessonId;
      }
      
      // Record the download
      await recordResourceDownload(downloadData);
    } catch (error) {
      console.error('Failed to record resource download:', error);
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

  // Handle tag selection
  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Clear all selected tags
  const clearTagFilter = () => {
    setSelectedTags([]);
  };
  
  return (
    <div className="resource-viewer">
      {/* Resource Preview Modal */}
      {previewResource && (
        <ResourcePreview 
          resource={previewResource} 
          onClose={() => setPreviewResource(null)} 
        />
      )}
      
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
      
      {/* Tag filter section */}
      {availableTags.length > 0 && (
        <div className="resource-tags-filter">
          <div className="tags-header">
            <h4>Filter by Tags:</h4>
            {selectedTags.length > 0 && (
              <button className="clear-tags-btn" onClick={clearTagFilter}>
                Clear Filters
              </button>
            )}
          </div>
          <div className="tags-list">
            {availableTags.map(tag => (
              <span 
                key={tag} 
                className={`resource-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Course Resources Section */}
      {(activeTab === 'course' || (!resources.length && courseResources.length > 0)) && (
        <div className="resource-section">
          <h3>Course Resources</h3>
          <div className="resource-list">
            {filteredCourseResources.map((resource, index) => (
              <div key={resource._id || index} className="resource-item">
                <div className="resource-icon">
                  {getResourceTypeIcon(resource.type)}
                </div>
                <div className="resource-details">
                  <h4>{resource.title}</h4>
                  {resource.description && (
                    <p className="resource-description">{resource.description}</p>
                  )}
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="resource-tags">
                      {resource.tags.map(tag => (
                        <span key={tag} className="resource-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="resource-tags">
                      {resource.tags.map(tag => (
                        <span key={tag} className="resource-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleResourceClick(resource, 'course');
                    }}
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
            {filteredResources.map((resource, index) => (
              <div key={resource._id || index} className="resource-item">
                <div className="resource-icon">
                  {getResourceTypeIcon(resource.type)}
                </div>
                <div className="resource-details">
                  <h4>{resource.title}</h4>
                  {resource.description && (
                    <p className="resource-description">{resource.description}</p>
                  )}
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="resource-tags">
                      {resource.tags.map(tag => (
                        <span key={tag} className="resource-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="resource-tags">
                      {resource.tags.map(tag => (
                        <span key={tag} className="resource-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  {!sectionId && !lessonId && (
                    <p className="resource-location">
                      <small>
                        {resource.sectionTitle} &gt; {resource.lessonTitle}
                      </small>
                    </p>
                  )}
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleResourceClick(resource, 'lesson');
                    }}
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