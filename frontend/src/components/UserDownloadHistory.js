import React, { useState, useEffect } from 'react';
import { getUserDownloadHistory } from '../services/resourceDownloadService';
import './ResourceViewer.css'; // Reusing existing styles

const UserDownloadHistory = () => {
  const [downloads, setDownloads] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDownloadHistory(pagination.currentPage, pagination.limit);
  }, []);

  const fetchDownloadHistory = async (page, limit) => {
    try {
      setLoading(true);
      const data = await getUserDownloadHistory(page, limit);
      setDownloads(data.downloads);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to load download history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchDownloadHistory(newPage, pagination.limit);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="resource-viewer loading">Loading download history...</div>;
  }

  if (error) {
    return <div className="resource-viewer error">{error}</div>;
  }

  if (!downloads.length) {
    return <div className="resource-viewer">You haven't downloaded any resources yet.</div>;
  }

  return (
    <div className="resource-viewer">
      <h2>Your Download History</h2>
      
      <div className="download-history">
        <table className="stats-table">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Type</th>
              <th>Resource Level</th>
              <th>Downloaded On</th>
            </tr>
          </thead>
          <tbody>
            {downloads.map((download, index) => (
              <tr key={index}>
                <td>{download.resource.title}</td>
                <td>{download.resource.type}</td>
                <td>{download.resourceType === 'course' ? 'Course' : 'Lesson'}</td>
                <td>{formatDate(download.downloadedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDownloadHistory;