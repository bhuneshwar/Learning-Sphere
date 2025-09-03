import React, { useState, useRef } from 'react';
import './FileUpload.css';

const FileUpload = ({ 
  resources = [], 
  onResourcesChange, 
  acceptedTypes = '.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.zip,.mp4,.mp3,.jpg,.jpeg,.png',
  maxFileSize = 10, // MB
  title = "Course Resources",
  description = "Upload notes, PDFs, documents, and other course materials"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Convert files to resource objects
    const newResources = validFiles.map(file => ({
      id: Date.now() + Math.random(), // Temporary ID for frontend
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      type: getFileType(file),
      file: file, // Store actual file for upload
      url: null, // Will be set after upload
      description: '',
      tags: [],
      isPublic: false,
      fileSize: file.size,
      format: file.name.split('.').pop()
    }));

    onResourcesChange([...resources, ...newResources]);
  };

  const getFileType = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) return 'pdf';
    if (['mp4', 'avi', 'mov', 'mkv'].includes(extension)) return 'video';
    if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
    return 'file';
  };

  const removeResource = (resourceId) => {
    const updatedResources = resources.filter(resource => resource.id !== resourceId);
    onResourcesChange(updatedResources);
  };

  const updateResourceField = (resourceId, field, value) => {
    const updatedResources = resources.map(resource => 
      resource.id === resourceId 
        ? { ...resource, [field]: value }
        : resource
    );
    onResourcesChange(updatedResources);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'file': return '📁';
      default: return '📄';
    }
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload-header">
        <h4>{title}</h4>
        <p className="upload-description">{description}</p>
      </div>

      {/* Drag and Drop Zone */}
      <div 
        className={`file-drop-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        <div className="drop-zone-content">
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            <p><strong>Click to upload</strong> or drag and drop</p>
            <p className="upload-hint">PDF, DOC, PPT, images, videos, and more</p>
            <p className="size-limit">Maximum file size: {maxFileSize}MB</p>
          </div>
        </div>
      </div>

      {/* Uploaded Resources List */}
      {resources.length > 0 && (
        <div className="uploaded-resources">
          <h5>Uploaded Resources ({resources.length})</h5>
          <div className="resources-list">
            {resources.map((resource, index) => (
              <div key={resource.id} className="resource-item">
                <div className="resource-info">
                  <div className="resource-header">
                    <span className="file-icon">{getFileIcon(resource.type)}</span>
                    <div className="resource-details">
                      <input
                        type="text"
                        value={resource.title}
                        onChange={(e) => updateResourceField(resource.id, 'title', e.target.value)}
                        placeholder="Resource title"
                        className="resource-title-input"
                      />
                      <div className="resource-meta">
                        <span className="file-size">{formatFileSize(resource.fileSize)}</span>
                        <span className="file-type">{resource.format?.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="resource-options">
                    <input
                      type="text"
                      value={resource.description}
                      onChange={(e) => updateResourceField(resource.id, 'description', e.target.value)}
                      placeholder="Optional description"
                      className="resource-description-input"
                    />
                    
                    <div className="resource-settings">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={resource.isPublic}
                          onChange={(e) => updateResourceField(resource.id, 'isPublic', e.target.checked)}
                        />
                        <span>Public (accessible before enrollment)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  className="remove-resource-btn"
                  onClick={() => removeResource(resource.id)}
                  title="Remove resource"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
