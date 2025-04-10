import React, { useState } from 'react';
import axios from 'axios';
import './ResourceManager.css';

const ResourceManager = ({ courseId, sectionId, lessonId, existingResources = [], onResourcesUpdated }) => {
  const [resources, setResources] = useState(existingResources);
  const [newResource, setNewResource] = useState({
    title: '',
    type: 'pdf',
    url: '',
    tags: []
  });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource({
      ...newResource,
      [name]: value
    });
  };

  const addResource = async () => {
    // Validate inputs
    if (!newResource.title || !newResource.url) {
      setError('Title and URL are required');
      return;
    }

    setIsAdding(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/resources/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/resources`,
        newResource,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update resources list
      setResources(response.data.resources);
      
      // Reset form
      setNewResource({
        title: '',
        type: 'pdf',
        url: '',
        tags: []
      });
      
      setSuccess('Resource added successfully');
      
      // Notify parent component
      if (onResourcesUpdated) {
        onResourcesUpdated(response.data.resources);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add resource');
    } finally {
      setIsAdding(false);
    }
  };

  const removeResource = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const resourceToDelete = resources[index];
      
      // Delete the resource using the proper endpoint
      await axios.delete(
        `/resources/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/resources/${resourceToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state after successful deletion
      const updatedResources = [...resources];
      updatedResources.splice(index, 1);
      
      // Update local state
      setResources(updatedResources);
      setSuccess('Resource removed successfully');
      
      // Notify parent component
      if (onResourcesUpdated) {
        onResourcesUpdated(updatedResources);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove resource');
    }
  };

  return (
    <div className="resource-manager">
      <h3>Lesson Resources</h3>
      
      {/* Resource List */}
      {resources.length > 0 ? (
        <div className="resource-list">
          {resources.map((resource, index) => (
            <div key={index} className="resource-item">
              <div className="resource-info">
                <div className="resource-icon">
                  {resource.type === 'pdf' && <i className="fas fa-file-pdf"></i>}
                  {resource.type === 'link' && <i className="fas fa-link"></i>}
                  {resource.type === 'file' && <i className="fas fa-file"></i>}
                </div>
                <div className="resource-details">
                  <h4>{resource.title}</h4>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.url.length > 40 ? `${resource.url.substring(0, 40)}...` : resource.url}
                  </a>
                </div>
              </div>
              <button 
                className="remove-resource-btn" 
                onClick={() => removeResource(index)}
                title="Remove resource"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-resources">No resources added yet</p>
      )}
      
      {/* Add New Resource Form */}
      <div className="add-resource-form">
        <h4>Add New Resource</h4>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={newResource.title}
            onChange={handleInputChange}
            placeholder="Resource title"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Type</label>
          <select
            name="type"
            value={newResource.type}
            onChange={handleInputChange}
            required
          >
            <option value="pdf">PDF</option>
            <option value="link">Link</option>
            <option value="file">File</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>URL</label>
          <input
            type="text"
            name="url"
            value={newResource.url}
            onChange={handleInputChange}
            placeholder="https://example.com/resource"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={Array.isArray(newResource.tags) ? newResource.tags.join(', ') : ''}
            onChange={(e) => {
              const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
              setNewResource({
                ...newResource,
                tags: tagsArray
              });
            }}
            placeholder="e.g. important, exam, reference"
          />
        </div>
        
        <button 
          className="add-resource-btn" 
          onClick={addResource}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add Resource'}
        </button>
      </div>
    </div>
  );
};

export default ResourceManager;