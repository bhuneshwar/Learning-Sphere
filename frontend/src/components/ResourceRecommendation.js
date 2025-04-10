import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ResourcePreview from './ResourcePreview';
import './ResourceRecommendation.css';

const ResourceRecommendation = ({ courseId }) => {
  const { user } = useSelector(state => state.auth);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewResource, setPreviewResource] = useState(null);

  useEffect(() => {
    if (courseId && user) {
      fetchRecommendations();
    }
  }, [courseId, user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      
      // This is a placeholder for the actual API call
      // In a real implementation, you would call an API endpoint to get personalized recommendations
      // For now, we'll simulate recommendations with a timeout
      
      setTimeout(() => {
        // Simulate recommendations based on resource types and tags
        const mockRecommendations = [
          {
            _id: 'rec1',
            title: 'Getting Started Guide',
            type: 'pdf',
            url: 'https://example.com/resource1.pdf',
            tags: ['beginner', 'guide'],
            reason: 'Based on your recent activity',
            courseId: courseId,
            courseTitle: 'Introduction to Learning Sphere',
            resourceType: 'course'
          },
          {
            _id: 'rec2',
            title: 'Advanced Concepts Video',
            type: 'video',
            url: 'https://example.com/video1.mp4',
            tags: ['advanced', 'tutorial'],
            reason: 'Popular in your current course',
            courseId: courseId,
            courseTitle: 'Introduction to Learning Sphere',
            resourceType: 'course'
          },
          {
            _id: 'rec3',
            title: 'Practice Exercises',
            type: 'pdf',
            url: 'https://example.com/exercises.pdf',
            tags: ['practice', 'exercises'],
            reason: 'Recommended for your skill level',
            courseId: courseId,
            courseTitle: 'Introduction to Learning Sphere',
            resourceType: 'course'
          }
        ];
        
        setRecommendations(mockRecommendations);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to load recommendations');
      console.error(err);
      setLoading(false);
    }
  };

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <i className="fas fa-file-pdf"></i>;
      case 'video':
        return <i className="fas fa-video"></i>;
      case 'audio':
        return <i className="fas fa-headphones"></i>;
      case 'link':
        return <i className="fas fa-link"></i>;
      case 'image':
        return <i className="fas fa-image"></i>;
      default:
        return <i className="fas fa-file"></i>;
    }
  };

  // Handle resource preview
  const handleResourceClick = (resource) => {
    setPreviewResource(resource);
  };

  // Close resource preview
  const closePreview = () => {
    setPreviewResource(null);
  };

  if (loading) {
    return <div className="resource-recommendation loading">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="resource-recommendation error">{error}</div>;
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <>
      <div className="resource-recommendation">
        <h3>Recommended Resources</h3>
        <div className="recommendation-list">
          {recommendations.map((resource) => (
            <div key={resource._id} className="recommendation-item">
              <div className="recommendation-icon">
                {getResourceTypeIcon(resource.type)}
              </div>
              <div className="recommendation-details">
                <h4>{resource.title}</h4>
                <p className="recommendation-reason">{resource.reason}</p>
                {resource.tags && resource.tags.length > 0 && (
                  <div className="recommendation-tags">
                    {resource.tags.map(tag => (
                      <span key={tag} className="recommendation-tag">{tag}</span>
                    ))}
                  </div>
                )}
                <button 
                  onClick={() => handleResourceClick(resource)}
                  className="recommendation-link"
                >
                  <span>View Resource</span>
                  <i className="fas fa-external-link-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Preview Modal */}
      {previewResource && (
        <ResourcePreview 
          resource={previewResource} 
          onClose={closePreview} 
        />
      )}
    </>
  );
};

export default ResourceRecommendation;