const { 
  uploadVideo, 
  uploadImage, 
  uploadDocument, 
  uploadProfilePicture, 
  deleteFile,
  getVideoStreamingUrls 
} = require('../utils/cloudinaryUtils');

/**
 * Upload course video
 */
const uploadCourseVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file provided'
      });
    }

    const { courseId, sectionId, lessonId } = req.body;

    // Upload video to Cloudinary
    const uploadResult = await uploadVideo(req.file.path, {
      public_id: `course_${courseId}_lesson_${lessonId}_${Date.now()}`,
      context: {
        courseId,
        sectionId,
        lessonId,
        uploadedBy: req.user.id
      }
    });

    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload video',
        error: uploadResult.error
      });
    }

    // Generate streaming URLs
    const streamingUrls = getVideoStreamingUrls(uploadResult.publicId);

    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        duration: uploadResult.duration,
        format: uploadResult.format,
        size: uploadResult.bytes,
        dimensions: {
          width: uploadResult.width,
          height: uploadResult.height
        },
        streamingUrls
      }
    });

  } catch (error) {
    console.error('Upload course video error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Upload course cover image
 */
const uploadCourseImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { courseId, imageType = 'cover' } = req.body;

    const uploadResult = await uploadImage(req.file.path, {
      public_id: `course_${courseId}_${imageType}_${Date.now()}`,
      context: {
        courseId,
        imageType,
        uploadedBy: req.user.id
      }
    });

    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: uploadResult.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        format: uploadResult.format,
        size: uploadResult.bytes,
        dimensions: {
          width: uploadResult.width,
          height: uploadResult.height
        }
      }
    });

  } catch (error) {
    console.error('Upload course image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Upload course document/resource
 */
const uploadCourseDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No document file provided'
      });
    }

    const { courseId, sectionId, lessonId, documentType = 'resource' } = req.body;

    const uploadResult = await uploadDocument(req.file.path, {
      public_id: `course_${courseId}_${documentType}_${Date.now()}`,
      context: {
        courseId,
        sectionId,
        lessonId,
        documentType,
        uploadedBy: req.user.id
      }
    });

    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload document',
        error: uploadResult.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        format: uploadResult.format,
        size: uploadResult.bytes
      }
    });

  } catch (error) {
    console.error('Upload course document error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Upload user profile picture
 */
const uploadUserProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const uploadResult = await uploadProfilePicture(req.file.path, {
      public_id: `user_${req.user.id}_profile_${Date.now()}`,
      context: {
        userId: req.user.id,
        uploadedBy: req.user.id
      }
    });

    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload profile picture',
        error: uploadResult.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        format: uploadResult.format,
        size: uploadResult.bytes,
        dimensions: {
          width: uploadResult.width,
          height: uploadResult.height
        }
      }
    });

  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete media file from Cloudinary
 */
const deleteMediaFile = async (req, res) => {
  try {
    const { publicId, resourceType = 'image' } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const deleteResult = await deleteFile(publicId, resourceType);

    if (!deleteResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete file',
        error: deleteResult.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      data: deleteResult
    });

  } catch (error) {
    console.error('Delete media file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get video streaming URLs for different qualities
 */
const getVideoStreaming = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const streamingUrls = getVideoStreamingUrls(publicId);

    res.status(200).json({
      success: true,
      message: 'Video streaming URLs generated successfully',
      data: {
        publicId,
        streamingUrls
      }
    });

  } catch (error) {
    console.error('Get video streaming error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  uploadCourseVideo,
  uploadCourseImage,
  uploadCourseDocument,
  uploadUserProfilePicture,
  deleteMediaFile,
  getVideoStreaming
};
