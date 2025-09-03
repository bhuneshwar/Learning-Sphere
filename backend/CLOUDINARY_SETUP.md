# Cloudinary Integration Setup Guide

## 🎯 Overview
This guide will help you set up Cloudinary for managing all media files in your Learning Sphere application, including course videos, images, documents, and profile pictures.

## 📋 Prerequisites
- Cloudinary account (free tier available)
- Node.js and npm installed
- Learning Sphere backend running

## 🚀 Setup Steps

### 1. Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. After signup, go to your [Cloudinary Dashboard](https://cloudinary.com/console)
3. Note down your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Configure Environment Variables
Update your `.env` file with your Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### 3. API Endpoints Available

#### Video Upload
```http
POST /api/media/upload/video
Content-Type: multipart/form-data

Body:
- video: (file) Video file to upload
- courseId: (string) Course ID
- sectionId: (string) Section ID  
- lessonId: (string) Lesson ID
```

#### Image Upload (Course Cover Images)
```http
POST /api/media/upload/image
Content-Type: multipart/form-data

Body:
- image: (file) Image file to upload
- courseId: (string) Course ID
- imageType: (string) Type of image (default: 'cover')
```

#### Document Upload (PDFs, etc.)
```http
POST /api/media/upload/document
Content-Type: multipart/form-data

Body:
- document: (file) Document file to upload
- courseId: (string) Course ID
- sectionId: (string) Section ID
- lessonId: (string) Lesson ID
- documentType: (string) Type of document (default: 'resource')
```

#### Profile Picture Upload
```http
POST /api/media/upload/profile-picture
Content-Type: multipart/form-data

Body:
- profilePicture: (file) Image file to upload
```

#### Get Video Streaming URLs
```http
GET /api/media/video/streaming/:publicId
```

#### Delete Media File
```http
DELETE /api/media/delete
Content-Type: application/json

Body:
{
  "publicId": "cloudinary_public_id",
  "resourceType": "video" // or "image", "raw"
}
```

## 📁 Cloudinary Folder Structure
Your files will be organized in Cloudinary as:
```
learning-sphere/
├── course-videos/        # Course lesson videos
├── course-images/        # Course cover images and thumbnails
├── course-documents/     # PDFs, presentations, etc.
└── profile-pictures/     # User profile pictures
```

## 🎥 Video Features
- **Automatic transcoding** to MP4 format
- **Multiple quality streams** (HD, SD, Mobile)
- **Auto-generated thumbnails**
- **Adaptive bitrate streaming**
- **Video duration detection**
- **Optimization for web delivery**

## 🖼️ Image Features
- **Automatic optimization** (quality and format)
- **Responsive image delivery**
- **Auto-generated thumbnails**
- **Format conversion** (WebP, AVIF support)
- **Size limitations** and compression

## 📄 Document Features
- **Secure document storage**
- **Direct download links**
- **File size tracking**
- **Format preservation**

## 🔒 Security Features
- **Role-based access** (only Instructors and Admins can upload course content)
- **File type validation**
- **Size limitations** per file type
- **Secure URLs** with optional signed URLs for sensitive content

## 🧪 Testing the Integration

### 1. Start your backend server
```bash
npm run dev
```

### 2. Test video upload using curl or Postman
```bash
curl -X POST http://localhost:5000/api/media/upload/video \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "video=@path/to/your/video.mp4" \
  -F "courseId=COURSE_ID" \
  -F "sectionId=SECTION_ID" \
  -F "lessonId=LESSON_ID"
```

## 📊 Database Schema Updates
The course model now includes:

### For Videos:
- `videoUrl`: Direct Cloudinary URL
- `videoPublicId`: Cloudinary public ID for management
- `videoStreamingUrls`: Object with different quality URLs
- `videoDuration`: Duration in seconds
- `videoThumbnailUrl`: Auto-generated thumbnail

### For Images:
- `coverImage`: Cloudinary URL
- `coverImagePublicId`: Cloudinary public ID

### For Documents/Resources:
- `url`: Cloudinary URL
- `publicId`: Cloudinary public ID
- `fileSize`: File size in bytes
- `format`: File format

## 💡 Usage Tips

1. **Video Quality**: Cloudinary automatically optimizes videos for web delivery
2. **Thumbnails**: Video thumbnails are auto-generated at 5 seconds
3. **Streaming**: Use the `auto` quality URL for adaptive streaming
4. **Mobile**: Use `mobile` quality URLs for mobile apps
5. **Security**: Use signed URLs for premium content
6. **Analytics**: Cloudinary provides detailed analytics on media usage

## 🔄 Migration from Current Setup
1. Update your `.env` with real Cloudinary credentials
2. Run the database seeder to populate with new structure
3. Update your frontend to use Cloudinary URLs
4. Test video playback with Cloudinary URLs

## 🎯 Next Steps
1. Set up your Cloudinary account and get credentials
2. Update environment variables
3. Test media upload endpoints
4. Update frontend to handle Cloudinary URLs
5. Implement video player for Cloudinary videos in React

## 📚 Frontend Integration
For React frontend, you can use:
- `cloudinary-react` package for React components
- HTML5 video player for Cloudinary video URLs
- Image optimization with Cloudinary transformations
- PDF viewer for document resources

---

**Note**: The sample URLs in the seeder are placeholder Cloudinary URLs. Once you upload real content, these will be replaced with actual Cloudinary URLs containing your media files.
