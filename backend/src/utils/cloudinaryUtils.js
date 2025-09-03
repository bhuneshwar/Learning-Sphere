const { cloudinary } = require('../config/cloudinary');

/**
 * Upload video to Cloudinary
 * @param {string} filePath - Local file path or buffer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadVideo = async (filePath, options = {}) => {
  try {
    const uploadOptions = {
      resource_type: 'video',
      folder: 'learning-sphere/course-videos',
      quality: 'auto',
      format: 'mp4',
      transformation: [
        { quality: 'auto' },
        { width: 1920, height: 1080, crop: 'limit' }
      ],
      ...options
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      playbackUrl: result.playback_url,
    };
  } catch (error) {
    console.error('Cloudinary video upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path or buffer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadImage = async (filePath, options = {}) => {
  try {
    const uploadOptions = {
      resource_type: 'image',
      folder: 'learning-sphere/course-images',
      quality: 'auto',
      fetch_format: 'auto',
      transformation: [
        { quality: 'auto' },
        { width: 1200, height: 800, crop: 'limit' }
      ],
      ...options
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Cloudinary image upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload document/PDF to Cloudinary
 * @param {string} filePath - Local file path or buffer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadDocument = async (filePath, options = {}) => {
  try {
    const uploadOptions = {
      resource_type: 'raw',
      folder: 'learning-sphere/course-documents',
      ...options
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary document upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload profile picture to Cloudinary
 * @param {string} filePath - Local file path or buffer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadProfilePicture = async (filePath, options = {}) => {
  try {
    const uploadOptions = {
      resource_type: 'image',
      folder: 'learning-sphere/profile-pictures',
      quality: 'auto',
      fetch_format: 'auto',
      transformation: [
        { quality: 'auto' },
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { radius: 'max' } // Optional: make it circular
      ],
      ...options
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Cloudinary profile picture upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Type of resource (image, video, raw)
 * @returns {Promise<Object>} Deletion result
 */
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return {
      success: result.result === 'ok',
      result: result.result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate optimized URL for existing Cloudinary asset
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Transformation options
 * @returns {string} Optimized URL
 */
const getOptimizedUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations
  });
};

/**
 * Generate video streaming URLs for different qualities
 * @param {string} publicId - Cloudinary public ID
 * @returns {Object} Object with different quality URLs
 */
const getVideoStreamingUrls = (publicId) => {
  return {
    auto: cloudinary.url(publicId, {
      resource_type: 'video',
      quality: 'auto',
      format: 'mp4'
    }),
    hd: cloudinary.url(publicId, {
      resource_type: 'video',
      quality: '80',
      width: 1920,
      height: 1080,
      crop: 'limit',
      format: 'mp4'
    }),
    sd: cloudinary.url(publicId, {
      resource_type: 'video',
      quality: '60',
      width: 1280,
      height: 720,
      crop: 'limit',
      format: 'mp4'
    }),
    mobile: cloudinary.url(publicId, {
      resource_type: 'video',
      quality: '40',
      width: 640,
      height: 360,
      crop: 'limit',
      format: 'mp4'
    })
  };
};

/**
 * Upload multiple files of different types to Cloudinary
 * @param {Array} files - Array of file objects from multer
 * @param {string} baseFolder - Base folder name for uploads
 * @returns {Promise<Array>} Array of upload results
 */
const uploadMultipleFiles = async (files, baseFolder = 'course-resources') => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises = files.map(async (file) => {
    try {
      // Determine resource type and folder based on file type
      const { resourceType, folder } = getResourceTypeAndFolder(file.mimetype, baseFolder);
      
      // Create upload stream for file buffer
      const uploadOptions = {
        resource_type: resourceType,
        folder: `learning-sphere/${folder}`,
        public_id: `${Date.now()}_${file.originalname.split('.')[0]}`,
        ...(resourceType === 'image' && {
          quality: 'auto',
          fetch_format: 'auto',
          transformation: [{ quality: 'auto', width: 1200, height: 800, crop: 'limit' }]
        }),
        ...(resourceType === 'video' && {
          quality: 'auto',
          format: 'mp4',
          transformation: [{ quality: 'auto', width: 1920, height: 1080, crop: 'limit' }]
        })
      };

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      return {
        success: true,
        originalName: file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: resourceType,
        format: result.format,
        fileSize: result.bytes,
        ...(resourceType === 'video' && {
          duration: result.duration,
          width: result.width,
          height: result.height
        }),
        ...(resourceType === 'image' && {
          width: result.width,
          height: result.height
        })
      };
    } catch (error) {
      console.error(`Error uploading ${file.originalname}:`, error);
      return {
        success: false,
        originalName: file.originalname,
        error: error.message
      };
    }
  });

  return Promise.all(uploadPromises);
};

/**
 * Determine Cloudinary resource type and folder based on MIME type
 * @param {string} mimetype - File MIME type
 * @param {string} baseFolder - Base folder name
 * @returns {Object} Object with resourceType and folder
 */
const getResourceTypeAndFolder = (mimetype, baseFolder) => {
  if (mimetype.startsWith('image/')) {
    return {
      resourceType: 'image',
      folder: `${baseFolder}/images`
    };
  } else if (mimetype.startsWith('video/')) {
    return {
      resourceType: 'video',
      folder: `${baseFolder}/videos`
    };
  } else if (mimetype.startsWith('audio/')) {
    return {
      resourceType: 'video', // Cloudinary treats audio as video resource type
      folder: `${baseFolder}/audio`
    };
  } else {
    // Documents, PDFs, archives, etc.
    return {
      resourceType: 'raw',
      folder: `${baseFolder}/documents`
    };
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {Array} publicIds - Array of public IDs to delete
 * @returns {Promise<Array>} Array of deletion results
 */
const deleteMultipleFiles = async (publicIds) => {
  if (!publicIds || publicIds.length === 0) {
    return [];
  }

  const deletePromises = publicIds.map(async ({ publicId, resourceType = 'image' }) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });
      return {
        success: result.result === 'ok',
        publicId,
        result: result.result
      };
    } catch (error) {
      console.error(`Error deleting ${publicId}:`, error);
      return {
        success: false,
        publicId,
        error: error.message
      };
    }
  });

  return Promise.all(deletePromises);
};

module.exports = {
  uploadVideo,
  uploadImage,
  uploadDocument,
  uploadProfilePicture,
  deleteFile,
  getOptimizedUrl,
  getVideoStreamingUrls,
  uploadMultipleFiles,
  deleteMultipleFiles,
  getResourceTypeAndFolder,
  cloudinary
};
