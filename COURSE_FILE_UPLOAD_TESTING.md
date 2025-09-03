# Course File Upload Testing Guide

## Overview
This guide provides comprehensive testing instructions for the newly implemented course creation with file upload functionality in the Learning Sphere project.

## Features Implemented

### Frontend Features
1. **Multi-step Course Creation Form** (5 steps):
   - Basic Information
   - Learning Objectives
   - Course Content
   - **Resources** (NEW)
   - Review

2. **FileUpload Component** with:
   - Drag & drop file upload
   - Multiple file support
   - File type validation
   - File size validation (10MB default)
   - Resource metadata editing (title, description, public/private)
   - File preview and management
   - Support for: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, images, videos, audio, ZIP

3. **Enhanced API Integration**:
   - Multipart form data support
   - File handling in createFormDataRequest
   - Proper headers and authentication

### Backend Features
1. **Enhanced Course Model** with:
   - courseResources array field
   - Resource metadata support
   - Cloudinary integration

2. **File Upload Infrastructure**:
   - Mixed file type upload support
   - File validation and size limits
   - Multiple files processing
   - Cloudinary storage with organized folders

3. **Course Controller Updates**:
   - FormData parsing
   - File upload processing
   - Resource metadata handling
   - Error handling and logging

## Testing Instructions

### Prerequisites
1. **Environment Variables**: Ensure these are set in your backend `.env` file:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

2. **Start Services**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend  
   cd frontend
   npm start
   ```

### Test Cases

#### Test 1: Basic Course Creation (No Files)
1. Navigate to `/create-course`
2. Fill in basic information
3. Add learning objectives
4. Add course content (sections and lessons)
5. Skip the resources step (leave empty)
6. Review and submit
7. **Expected**: Course should be created successfully without errors

#### Test 2: Course Creation with Files
1. Navigate to `/create-course`
2. Complete steps 1-3 normally
3. **Step 4 - Resources**:
   - Drag and drop multiple files (try different types: PDF, DOCX, images, videos)
   - Verify file previews appear
   - Edit resource titles and descriptions
   - Toggle public/private settings
   - Remove some files and add others
4. Complete review and submit
5. **Expected**: 
   - Files should upload to Cloudinary
   - Course should be created with resource URLs
   - Check browser network tab for successful API calls

#### Test 3: File Validation
1. Try uploading unsupported file types (e.g., `.exe`, `.bat`)
2. Try uploading files larger than 50MB
3. Try uploading more than 10 files at once
4. **Expected**: Appropriate error messages should appear

#### Test 4: Error Handling
1. **Network Issues**: Disconnect internet during upload
2. **Invalid File Data**: Try corrupted files
3. **Server Issues**: Stop backend during upload
4. **Expected**: Graceful error handling with user feedback

### Verification Steps

#### Database Verification
```javascript
// In MongoDB, check the created course document
db.courses.findOne({"title": "Your Test Course"})
// Verify courseResources array contains:
// - title, description, type, url, publicId, fileSize, format, tags, isPublic, addedAt
```

#### Cloudinary Verification
1. Log into your Cloudinary dashboard
2. Navigate to Media Library
3. Check folders:
   - `learning-sphere/course-resources/images/`
   - `learning-sphere/course-resources/videos/`
   - `learning-sphere/course-resources/documents/`
   - `learning-sphere/course-resources/audio/`
4. Verify uploaded files are present with correct metadata

#### API Response Verification
Check the course creation response includes:
```json
{
  "message": "Course created successfully",
  "course": {
    "courseResources": [
      {
        "title": "Resource Title",
        "description": "Resource Description",
        "type": "pdf|video|audio|file",
        "url": "https://res.cloudinary.com/...",
        "publicId": "learning-sphere/course-resources/...",
        "fileSize": 12345,
        "format": "pdf",
        "tags": [],
        "isPublic": false,
        "addedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## Common Issues & Troubleshooting

### Issue 1: Files Not Uploading
- Check Cloudinary credentials
- Verify file types are supported
- Check file size limits
- Monitor console for errors

### Issue 2: FormData Not Parsed Correctly
- Ensure Content-Type header is set to multipart/form-data
- Check that courseResourceUpload middleware is applied
- Verify JSON fields are properly stringified

### Issue 3: Resource Metadata Missing
- Check courseResourcesInfo is being sent from frontend
- Verify JSON.parse in backend controller
- Ensure array indices match between files and metadata

### Issue 4: Large File Upload Timeouts
- Increase timeout limits in axios configuration
- Consider implementing upload progress indicators
- Use chunked uploads for very large files

## Performance Considerations

1. **File Size Optimization**: Images and videos are automatically optimized by Cloudinary
2. **Upload Progress**: Consider implementing progress bars for better UX
3. **Parallel Uploads**: Current implementation uploads files sequentially; consider parallel uploads for better performance
4. **Caching**: Cloudinary provides automatic CDN caching

## Security Considerations

1. **File Type Validation**: Both frontend and backend validate file types
2. **File Size Limits**: Multiple layers of size validation
3. **Authentication**: All uploads require authenticated users
4. **Content Scanning**: Cloudinary provides automatic malware detection
5. **Access Control**: Resources can be marked as public or private

## Future Enhancements

1. **Progress Indicators**: Real-time upload progress
2. **Drag & Drop Reordering**: Allow users to reorder resources
3. **Bulk Operations**: Bulk delete, bulk edit metadata
4. **Resource Categories**: Categorize resources (assignments, readings, etc.)
5. **Version Control**: Track resource versions
6. **Download Statistics**: Track resource download/access statistics

## Support

If you encounter any issues during testing:
1. Check browser console for JavaScript errors
2. Check backend logs for server errors
3. Verify Cloudinary dashboard for upload status
4. Check database for data consistency
5. Review network tab for API call details

This implementation provides a robust, scalable solution for course resource management with proper file handling, validation, and cloud storage integration.
