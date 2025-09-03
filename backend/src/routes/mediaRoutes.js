const express = require('express');
const router = express.Router();
const { 
  videoUpload, 
  imageUpload, 
  documentUpload, 
  profilePictureUpload 
} = require('../config/cloudinary');
const {
  uploadCourseVideo,
  uploadCourseImage,
  uploadCourseDocument,
  uploadUserProfilePicture,
  deleteMediaFile,
  getVideoStreaming
} = require('../controllers/mediaController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Middleware for error handling in file uploads
const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err.message.includes('File too large')) {
      return res.status(400).json({
        success: false,
        message: 'File size too large'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// Video upload routes
router.post('/upload/video', 
  authMiddleware, 
  roleMiddleware(['Instructor', 'Admin']), 
  videoUpload.single('video'), 
  handleUploadError,
  uploadCourseVideo
);

// Image upload routes
router.post('/upload/image', 
  authMiddleware, 
  roleMiddleware(['Instructor', 'Admin']), 
  imageUpload.single('image'), 
  handleUploadError,
  uploadCourseImage
);

// Document upload routes
router.post('/upload/document', 
  authMiddleware, 
  roleMiddleware(['Instructor', 'Admin']), 
  documentUpload.single('document'), 
  handleUploadError,
  uploadCourseDocument
);

// Profile picture upload (all authenticated users)
router.post('/upload/profile-picture', 
  authMiddleware, 
  profilePictureUpload.single('profilePicture'), 
  handleUploadError,
  uploadUserProfilePicture
);

// Get video streaming URLs
router.get('/video/streaming/:publicId', 
  authMiddleware, 
  getVideoStreaming
);

// Delete media file
router.delete('/delete', 
  authMiddleware, 
  roleMiddleware(['Instructor', 'Admin']), 
  deleteMediaFile
);

module.exports = router;
