import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getUserCertificates,
  addCertificate,
  updateCertificate,
  deleteCertificate
} from '../services/profileService';
import '../styles/ProfileComponents.css';

const ProfileCertificates = () => {
  const { token } = useSelector(state => state.auth);
  const [certificateList, setCertificateList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialID: '',
    credentialURL: '',
    description: ''
  });

  // Fetch certificates when component mounts
  useEffect(() => {
    fetchCertificates();
  }, [token]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await getUserCertificates();
      setCertificateList(data);
      setError(null);
    } catch (err) {
      setError('Failed to load certificates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialID: '',
      credentialURL: '',
      description: ''
    });
    setEditingCertificate(null);
    setShowAddForm(false);
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addCertificate(formData);
      resetForm();
      fetchCertificates();
    } catch (err) {
      setError('Failed to add certificate');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCertificate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateCertificate(editingCertificate._id, formData);
      resetForm();
      fetchCertificates();
    } catch (err) {
      setError('Failed to update certificate');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertificate = async (certificateId) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      setLoading(true);
      await deleteCertificate(certificateId);
      fetchCertificates();
    } catch (err) {
      setError('Failed to delete certificate');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      name: certificate.name,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate ? certificate.issueDate.substring(0, 10) : '',
      expiryDate: certificate.expiryDate ? certificate.expiryDate.substring(0, 10) : '',
      credentialID: certificate.credentialID || '',
      credentialURL: certificate.credentialURL || '',
      description: certificate.description || ''
    });
    setShowAddForm(true);
  };

  if (loading && certificateList.length === 0) {
    return <div className="loading">Loading certificates...</div>;
  }

  return (
    <div className="profile-section certificate-section">
      <div className="section-header">
        <h2>Certificates</h2>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Certificate'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <form 
          className="certificate-form"
          onSubmit={editingCertificate ? handleUpdateCertificate : handleAddCertificate}
        >
          <div className="form-group">
            <label htmlFor="name">Certificate Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="issuer">Issuing Organization</label>
            <input
              type="text"
              id="issuer"
              name="issuer"
              value={formData.issuer}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="issueDate">Issue Date</label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date (if applicable)</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="credentialID">Credential ID</label>
            <input
              type="text"
              id="credentialID"
              name="credentialID"
              value={formData.credentialID}
              onChange={handleInputChange}
              placeholder="Certificate ID or reference number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="credentialURL">Credential URL</label>
            <input
              type="url"
              id="credentialURL"
              name="credentialURL"
              value={formData.credentialURL}
              onChange={handleInputChange}
              placeholder="https://example.com/verify/certificate"
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
              placeholder="Briefly describe what you learned or achieved"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingCertificate ? 'Update Certificate' : 'Add Certificate'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {certificateList.length > 0 ? (
        <div className="certificate-list">
          {certificateList.map((certificate) => (
            <div key={certificate._id} className="certificate-item">
              <div className="certificate-content">
                <h3 className="name">{certificate.name}</h3>
                <p className="issuer">{certificate.issuer}</p>
                <p className="date">
                  Issued: {new Date(certificate.issueDate).toLocaleDateString()}
                  {certificate.expiryDate && ` • Expires: ${new Date(certificate.expiryDate).toLocaleDateString()}`}
                </p>
                {certificate.credentialID && (
                  <p className="credential-id">ID: {certificate.credentialID}</p>
                )}
                {certificate.description && (
                  <p className="description">{certificate.description}</p>
                )}
                {certificate.credentialURL && (
                  <a 
                    href={certificate.credentialURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="credential-link"
                  >
                    View Certificate
                  </a>
                )}
              </div>
              <div className="certificate-actions">
                <button 
                  className="edit-btn"
                  onClick={() => startEditing(certificate)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteCertificate(certificate._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No certificates available. Add your certificates to showcase your qualifications.</p>
      )}
    </div>
  );
};

export default ProfileCertificates;