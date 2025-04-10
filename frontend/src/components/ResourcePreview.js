import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ReactPlayer from 'react-player';
import { recordResourceDownload } from '../services/resourceDownloadService';
import './ResourcePreview.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResourcePreview = ({ resource, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadTracked, setDownloadTracked] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPageNumber(1);
    setNumPages(null);
    setDownloadTracked(false);
  }, [resource]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please try downloading the file instead.');
    setLoading(false);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const handleDownload = async () => {
    if (!downloadTracked && resource) {
      try {
        // Prepare download data
        const downloadData = {
          courseId: resource.courseId,
          resourceId: resource._id || resource.resourceId,
          resourceType: resource.resourceType || 'course'
        };
        
        // Add section and lesson IDs for lesson resources
        if (resource.resourceType === 'lesson') {
          downloadData.sectionId = resource.sectionId;
          downloadData.lessonId = resource.lessonId;
        }
        
        // Record the download
        await recordResourceDownload(downloadData);
        setDownloadTracked(true);
        
        // Open the resource in a new tab
        window.open(resource.url, '_blank');
      } catch (error) {
        console.error('Failed to record resource download:', error);
        // Still open the resource even if tracking fails
        window.open(resource.url, '_blank');
      }
    } else {
      // If already tracked or no resource, just open the URL
      window.open(resource?.url, '_blank');
    }
  };

  const renderPreview = () => {
    if (!resource) return null;

    switch (resource.type) {
      case 'pdf':
        return (
          <div className="pdf-container">
            {loading && <div className="loading-indicator">Loading PDF...</div>}
            {error && <div className="error-message">{error}</div>}
            <Document
              file={resource.url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="loading-indicator">Loading PDF...</div>}
            >
              <Page 
                pageNumber={pageNumber} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={Math.min(window.innerWidth * 0.8, 800)}
              />
            </Document>
            {numPages && (
              <div className="pdf-controls">
                <button 
                  onClick={previousPage} 
                  disabled={pageNumber <= 1}
                  className="page-button"
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                <span className="page-info">
                  Page {pageNumber} of {numPages}
                </span>
                <button 
                  onClick={nextPage} 
                  disabled={pageNumber >= numPages}
                  className="page-button"
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="video-container">
            <ReactPlayer
              url={resource.url}
              controls
              width="100%"
              height="auto"
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload'
                  }
                }
              }}
              onReady={() => setLoading(false)}
              onError={(e) => {
                console.error('Video error:', e);
                setError('Failed to load video. Please try downloading the file instead.');
                setLoading(false);
              }}
            />
            {loading && <div className="loading-indicator">Loading video...</div>}
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      case 'audio':
        return (
          <div className="audio-container">
            <ReactPlayer
              url={resource.url}
              controls
              width="100%"
              height={50}
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload'
                  }
                }
              }}
              onReady={() => setLoading(false)}
              onError={(e) => {
                console.error('Audio error:', e);
                setError('Failed to load audio. Please try downloading the file instead.');
                setLoading(false);
              }}
            />
            {loading && <div className="loading-indicator">Loading audio...</div>}
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      case 'image':
        return (
          <div className="image-container">
            <img 
              src={resource.url} 
              alt={resource.title} 
              className="preview-image"
              onLoad={() => setLoading(false)}
              onError={() => {
                setError('Failed to load image. Please try downloading the file instead.');
                setLoading(false);
              }}
            />
            {loading && <div className="loading-indicator">Loading image...</div>}
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      default:
        return (
          <div className="unsupported-format">
            <p>Preview not available for this file type.</p>
            <p>Please download the file to view its contents.</p>
          </div>
        );
    }
  };

  return (
    <div className="resource-preview-modal">
      <div className="resource-preview-content">
        <div className="resource-preview-header">
          <h3>{resource?.title}</h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="resource-preview-body">
          {renderPreview()}
        </div>
        <div className="resource-preview-footer">
          <div className="resource-metadata">
            {resource?.type && (
              <span className="resource-type">
                <i className="fas fa-file-alt"></i> {resource.type.toUpperCase()}
              </span>
            )}
            {resource?.courseTitle && (
              <span className="resource-course">
                <i className="fas fa-book"></i> {resource.courseTitle}
              </span>
            )}
          </div>
          <button 
            onClick={handleDownload}
            className="download-button"
          >
            <i className="fas fa-download"></i> Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcePreview;