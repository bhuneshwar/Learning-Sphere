const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for different file types
const createCloudinaryStorage = (folder, resourceType = 'auto') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `learning-sphere/${folder}`,
      resource_type: resourceType,
      allowed_formats: resourceType === 'video' 
        ? ['mp4', 'mov', 'avi', 'mkv', 'webm']
        : resourceType === 'image'
        ? ['jpg', 'jpeg', 'png', 'gif', 'webp']
        : ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'],
      transformation: resourceType === 'video' 
        ? [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1920, height: 1080, crop: 'limit' }
          ]
        : resourceType === 'image'
        ? [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1200, height: 800, crop: 'limit' }
          ]
        : undefined,
    },
  });
};

// Multer configurations for different file types
const videoUpload = multer({
  storage: createCloudinaryStorage('course-videos', 'video'),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  },
});

const imageUpload = multer({
  storage: createCloudinaryStorage('course-images', 'image'),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

const documentUpload = multer({
  storage: createCloudinaryStorage('course-documents', 'raw'),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for documents
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, PPT, PPTX, and TXT files are allowed!'), false);
    }
  },
});

// Profile picture upload (smaller size limit)
const profilePictureUpload = multer({
  storage: createCloudinaryStorage('profile-pictures', 'image'),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile pictures
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Mixed file upload for course resources (multiple files of different types)
const courseResourceUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
    files: 10 // Maximum 10 files per request
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      // Videos
      'video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm',
      // Audio
      'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a',
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      // Archives
      'application/zip',
      'application/x-zip-compressed'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not supported. Please upload images, videos, documents, or archives only.`), false);
    }
  },
});

module.exports = {
  cloudinary,
  videoUpload,
  imageUpload,
  documentUpload,
  profilePictureUpload,
  courseResourceUpload,
  createCloudinaryStorage,
};
