import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCourseDownloadStats } from '../services/resourceDownloadService';
import './ResourceViewer.css'; // Reusing existing styles

const ResourceDownloadStats = ({ courseId }) => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (courseId && (user.role === 'Instructor' || user.role === 'Admin')) {
      fetchDownloadStats();
    }
  }, [courseId, user.role]);

  const fetchDownloadStats = async () => {
    try {
      setLoading(true);
      const data = await getCourseDownloadStats(courseId);
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load download statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="resource-viewer loading">Loading download statistics...</div>;
  }

  if (error) {
    return <div className="resource-viewer error">{error}</div>;
  }

  if (!stats) {
    return <div className="resource-viewer">No download data available</div>;
  }

  return (
    <div className="resource-viewer">
      <h2>Resource Download Statistics</h2>
      
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Downloads</h3>
          <p className="stat-number">{stats.totalDownloads}</p>
        </div>
        
        <div className="stat-card">
          <h3>Downloads by Type</h3>
          <ul className="stat-list">
            {stats.downloadsByType.map((item, index) => (
              <li key={index}>
                <span className="stat-label">{item._id === 'course' ? 'Course Resources' : 'Lesson Resources'}</span>: 
                <span className="stat-value">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="stats-detail">
        <h3>Most Downloaded Resources</h3>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Type</th>
              <th>Resource Level</th>
              <th>Downloads</th>
            </tr>
          </thead>
          <tbody>
            {stats.mostDownloadedResources.map((resource, index) => (
              <tr key={index}>
                <td>{resource.title}</td>
                <td>{resource.type}</td>
                <td>{resource.resourceType === 'course' ? 'Course' : 'Lesson'}</td>
                <td>{resource.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="stats-trends">
        <h3>Download Trends (Last 30 Days)</h3>
        <div className="trend-chart">
          {stats.downloadTrends.map((day, index) => (
            <div 
              key={index} 
              className="trend-bar" 
              style={{ 
                height: `${Math.max(20, (day.count / Math.max(...stats.downloadTrends.map(d => d.count))) * 100)}px` 
              }}
              title={`${day._id}: ${day.count} downloads`}
            >
              <span className="trend-label">{day._id.split('-')[2]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceDownloadStats;