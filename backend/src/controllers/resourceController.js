const Course = require('../models/Course');

// Search resources across courses
const searchResources = async (req, res) => {
  try {
    const { query, tags, type } = req.query;
    
    // Find all courses the user has access to
    let courseQuery = {};
    
    // If user is not admin or instructor, only show courses they're enrolled in
    if (req.user.role !== 'Admin' && req.user.role !== 'Instructor') {
      courseQuery = { learners: req.user.id };
    }
    
    const courses = await Course.find(courseQuery);
    
    if (!courses || courses.length === 0) {
      return res.status(200).json({ resources: [] });
    }
    
    // Collect all resources that match the search criteria
    let allResources = [];
    
    // Process each course
    courses.forEach(course => {
      // Process course-level resources
      if (course.courseResources && course.courseResources.length > 0) {
        const filteredResources = course.courseResources.filter(resource => {
          // Filter by public status for non-instructors
          if (req.user.role !== 'Admin' && req.user.role !== 'Instructor' && 
              course.instructor.toString() !== req.user.id && 
              !resource.isPublic) {
            return false;
          }
          
          // Filter by search query
          const matchesQuery = !query || 
            resource.title.toLowerCase().includes(query.toLowerCase()) || 
            (resource.description && resource.description.toLowerCase().includes(query.toLowerCase()));
          
          // Filter by tags
          const matchesTags = !tags || 
            (resource.tags && resource.tags.some(tag => 
              tags.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase())
            ));
          
          // Filter by type
          const matchesType = !type || resource.type === type;
          
          return matchesQuery && matchesTags && matchesType;
        });
        
        // Add course info to each resource
        const courseResources = filteredResources.map(resource => ({
          ...resource.toObject(),
          courseId: course._id,
          courseTitle: course.title,
          resourceType: 'course'
        }));
        
        allResources = [...allResources, ...courseResources];
      }
      
      // Process lesson-level resources
      course.sections.forEach(section => {
        section.lessons.forEach(lesson => {
          if (lesson.resources && lesson.resources.length > 0) {
            const filteredResources = lesson.resources.filter(resource => {
              // Filter by search query
              const matchesQuery = !query || 
                resource.title.toLowerCase().includes(query.toLowerCase()) || 
                (resource.description && resource.description.toLowerCase().includes(query.toLowerCase()));
              
              // Filter by tags
              const matchesTags = !tags || 
                (resource.tags && resource.tags.some(tag => 
                  tags.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase())
                ));
              
              // Filter by type
              const matchesType = !type || resource.type === type;
              
              return matchesQuery && matchesTags && matchesType;
            });
            
            // Add course, section, and lesson info to each resource
            const lessonResources = filteredResources.map(resource => ({
              ...resource.toObject(),
              courseId: course._id,
              courseTitle: course.title,
              sectionId: section._id,
              sectionTitle: section.title,
              lessonId: lesson._id,
              lessonTitle: lesson.title,
              resourceType: 'lesson'
            }));
            
            allResources = [...allResources, ...lessonResources];
          }
        });
      });
    });
    
    // Sort resources by title
    allResources.sort((a, b) => a.title.localeCompare(b.title));
    
    res.status(200).json({
      count: allResources.length,
      resources: allResources
    });
  } catch (err) {
    res.status(500).json({ message: 'Error searching resources', error: err.message });
  }
};

// Get all resources for a specific course
const getCourseResources = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Collect all resources from all lessons in all sections
    const lessonResources = [];
    
    course.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        if (lesson.resources && lesson.resources.length > 0) {
          lessonResources.push({
            sectionId: section._id,
            sectionTitle: section.title,
            lessonId: lesson._id,
            lessonTitle: lesson.title,
            resources: lesson.resources
          });
        }
      });
    });
    
    // Get course-level resources
    const courseResources = course.courseResources || [];
    
    res.status(200).json({
      courseId,
      courseTitle: course.title,
      courseResources,
      lessonResources
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching resources', error: err.message });
  }
};

// Add a resource to a course (not tied to a specific lesson)
const addCourseResource = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, type, url, description, isPublic, tags } = req.body;
    
    if (!title || !type || !url) {
      return res.status(400).json({ message: 'Title, type, and URL are required' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Initialize courseResources array if it doesn't exist
    if (!course.courseResources) {
      course.courseResources = [];
    }
    
    // Add the resource directly to the course resources
    const newResource = {
      title,
      type,
      url,
      description: description || '',
      tags: tags || [],
      isPublic: isPublic || false,
      addedAt: new Date()
    };
    
    course.courseResources.push(newResource);
    
    await course.save();
    
    res.status(201).json({
      message: 'Course resource added successfully',
      resource: course.courseResources[course.courseResources.length - 1]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error adding resource', error: err.message });
  }
};

// Update a resource
const updateResource = async (req, res) => {
  try {
    const { courseId, sectionId, lessonId, resourceId } = req.params;
    const { title, type, url, description, tags } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Find the section, lesson, and resource
    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    const lesson = section.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    const resource = lesson.resources.id(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Update resource fields
    if (title) resource.title = title;
    if (type) resource.type = type;
    if (url) resource.url = url;
    if (description !== undefined) resource.description = description;
    if (tags !== undefined) resource.tags = tags;
    
    await course.save();
    
    res.status(200).json({
      message: 'Resource updated successfully',
      resource
    });
  } catch (err) {
    res.status(400).json({ message: 'Error updating resource', error: err.message });
  }
};

// Delete a resource
const deleteResource = async (req, res) => {
  try {
    const { courseId, sectionId, lessonId, resourceId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Find the section, lesson, and remove the resource
    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    const lesson = section.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    const resourceIndex = lesson.resources.findIndex(r => r._id.toString() === resourceId);
    if (resourceIndex === -1) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Remove the resource
    lesson.resources.splice(resourceIndex, 1);
    
    await course.save();
    
    res.status(200).json({
      message: 'Resource deleted successfully'
    });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting resource', error: err.message });
  }
};

// Update a course-level resource
const updateCourseResource = async (req, res) => {
  try {
    const { courseId, resourceId } = req.params;
    const { title, type, url, description, isPublic, tags } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Find the resource in courseResources array
    if (!course.courseResources || !Array.isArray(course.courseResources)) {
      return res.status(404).json({ message: 'No course resources found' });
    }
    
    const resourceIndex = course.courseResources.findIndex(r => r._id.toString() === resourceId);
    if (resourceIndex === -1) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Update resource fields
    const resource = course.courseResources[resourceIndex];
    if (title) resource.title = title;
    if (type) resource.type = type;
    if (url) resource.url = url;
    if (description !== undefined) resource.description = description;
    if (tags !== undefined) resource.tags = tags;
    if (isPublic !== undefined) resource.isPublic = isPublic;
    
    await course.save();
    
    res.status(200).json({
      message: 'Course resource updated successfully',
      resource
    });
  } catch (err) {
    res.status(400).json({ message: 'Error updating resource', error: err.message });
  }
};

// Delete a course-level resource
const deleteCourseResource = async (req, res) => {
  try {
    const { courseId, resourceId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Find the resource in courseResources array
    if (!course.courseResources || !Array.isArray(course.courseResources)) {
      return res.status(404).json({ message: 'No course resources found' });
    }
    
    const resourceIndex = course.courseResources.findIndex(r => r._id.toString() === resourceId);
    if (resourceIndex === -1) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Remove the resource
    course.courseResources.splice(resourceIndex, 1);
    
    await course.save();
    
    res.status(200).json({
      message: 'Course resource deleted successfully'
    });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting resource', error: err.message });
  }
};

// Add a resource to a specific lesson
const addLessonResource = async (req, res) => {
  try {
    const { courseId, sectionId, lessonId } = req.params;
    const { title, type, url, description, isPublic, tags } = req.body;
    
    if (!title || !type || !url) {
      return res.status(400).json({ message: 'Title, type, and URL are required' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Find the section and lesson
    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    const lesson = section.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Initialize resources array if it doesn't exist
    if (!lesson.resources) {
      lesson.resources = [];
    }
    
    // Add the resource to the lesson
    const newResource = {
      title,
      type,
      url,
      description: description || '',
      tags: tags || [],
      isPublic: isPublic || false,
      addedAt: new Date()
    };
    
    lesson.resources.push(newResource);
    
    await course.save();
    
    res.status(201).json({
      message: 'Lesson resource added successfully',
      resource: lesson.resources[lesson.resources.length - 1]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error adding resource', error: err.message });
  }
};

module.exports = {
  getCourseResources,
  addCourseResource,
  addLessonResource,
  updateResource,
  deleteResource,
  updateCourseResource,
  deleteCourseResource,
  searchResources
};