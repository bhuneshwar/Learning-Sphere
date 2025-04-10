import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { searchResources } from '../services/resourceService';
import { recordResourceDownload } from '../services/resourceDownloadService';
import ResourcePreview from './ResourcePreview';
import './ResourceSearch.css'; // Use dedicated styling for search

const ResourceSearch = () => {
  const { user } = useSelector(state => state.auth);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [previewResource, setPreviewResource] = useState(null);
  
  // Resource type options
  const resourceTypes = [
    { value: '', label: 'All Types' },
    { value: 'pdf', label: 'PDF', icon: 'fa-file-pdf' },
    { value: 'link', label: 'Link', icon: 'fa-link' },
    { value: 'file', label: 'File', icon: 'fa-file' },
    { value: 'video', label: 'Video', icon: 'fa-video' },
    { value: 'audio', label: 'Audio', icon: 'fa-music' }
  ];

  // Handle search form submission
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare search parameters
      const searchParams = {
        query: searchQuery,
        type: selectedType
      };
      
      // Add tags if selected
      if (selectedTags.length > 0) {
        searchParams.tags = selectedTags.join(',');
      }
      
      // Call the search API
      const result = await searchResources(searchParams);
      
      setResources(result.resources || []);
      setTotalResults(result.count || 0);
      
      // Extract all unique tags from the search results
      if (result.resources && result.resources.length > 0) {
        const allTags = new Set();
        
        result.resources.forEach(resource => {
          if (resource.tags && Array.isArray(resource.tags)) {
            resource.tags.forEach(tag => allTags.add(tag));
          }
        });
        
        setAvailableTags(Array.from(allTags));
      }
    } catch (err) {
      setError('Failed to search resources: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Track resource download/view
  const handleResourceClick = async (resource) => {
    setPreviewResource(resource);
  };

  // Close resource preview
  const closePreview = () => {
    setPreviewResource(null);
  };

  // Handle tag selection
  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedType('');
  };

  // Get appropriate icon for resource type
  const getResourceTypeIcon = (type) => {
    const resourceType = resourceTypes.find(rt => rt.value === type);
    return <i className={`fas ${resourceType?.icon || 'fa-file'}`}></i>;
  };

  return (
    <div className="resource-search-container">
      <h2>Search Resources</h2>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="resource-search-form">
        <div className="search-input-group">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-select"
          >
            {resourceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
          
          {(searchQuery || selectedTags.length > 0 || selectedType) && (
            <button 
              type="button" 
              className="clear-button"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>
        
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="selected-tags">
            <span>Selected Tags: </span>
            {selectedTags.map(tag => (
              <span 
                key={tag} 
                className="selected-tag"
                onClick={() => handleTagSelect(tag)}
              >
                {tag} <i className="fas fa-times"></i>
              </span>
            ))}
          </div>
        )}
      </form>
      
      {/* Available Tags */}
      {availableTags.length > 0 && (
        <div className="resource-tags-filter">
          <div className="tags-header">
            <h4>Filter by Tags:</h4>
          </div>
          <div className="tags-list">
            {availableTags.map(tag => (
              <span 
                key={tag} 
                className={`resource-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Search Results */}
      {!loading && resources.length > 0 && (
        <div className="search-results">
          <h3>Search Results ({totalResults})</h3>
          <div className="resource-list">
            {resources.map((resource, index) => (
              <div key={`${resource.resourceType}-${resource._id || index}`} className="resource-item">
                <div className="resource-icon">
                  {getResourceTypeIcon(resource.type)}
                </div>
                <div className="resource-details">
                  <h4>{resource.title}</h4>
                  {resource.description && (
                    <p className="resource-description">{resource.description}</p>
                  )}
                  <div className="resource-metadata">
                    <span className="resource-course">
                      <i className="fas fa-book"></i> {resource.courseTitle}
                    </span>
                    {resource.resourceType === 'lesson' && (
                      <span className="resource-lesson">
                        <i className="fas fa-file-alt"></i> {resource.lessonTitle}
                      </span>
                    )}
                    <span className="resource-type">
                      <i className="fas fa-tag"></i> {resource.type.toUpperCase()}
                    </span>
                  </div>
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="resource-tags">
                      {resource.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="resource-tag"
                          onClick={() => handleTagSelect(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button 
                    onClick={() => handleResourceClick(resource)}
                    className="resource-link"
                  >
                    <span>View Resource</span>
                    <i className="fas fa-external-link-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* No Results Message */}
      {!loading && resources.length === 0 && searchQuery && (
        <div className="no-results">
          <p>No resources found matching your search criteria.</p>
        </div>
      )}
      
      {/* Initial State Message */}
      {!loading && resources.length === 0 && !searchQuery && (
        <div className="initial-state">
          <p>Enter search terms above to find resources across all your courses.</p>
        </div>
      )}
      
      {/* Loading Indicator */}
      {loading && (
        <div className="loading-indicator">
          <p>Searching for resources...</p>
        </div>
      )}

      {/* Resource Preview Modal */}
      {previewResource && (
        <ResourcePreview 
          resource={previewResource} 
          onClose={closePreview} 
        />
      )}
    </div>
  );
};

export default ResourceSearch;