const Course = require('../models/courseModel');

// Submit quiz answers
const submitQuiz = async (req, res) => {
  try {
    const { courseId, sectionId, lessonId, answers } = req.body;
    const userId = req.user.id;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the section and lesson
    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const lesson = section.lessons.id(lessonId);
    if (!lesson || lesson.contentType !== 'quiz') {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    const quizResults = lesson.quizQuestions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = question.options[userAnswer]?.isCorrect;
      if (isCorrect) score += question.points;
      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.options.findIndex(opt => opt.isCorrect),
        isCorrect,
        explanation: question.explanation
      };
    });

    // Update user progress
    const totalPoints = lesson.quizQuestions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);

    // Save quiz results to user's progress
    // Implementation depends on your progress tracking system

    res.status(200).json({
      message: 'Quiz submitted successfully',
      score,
      totalPoints,
      percentage,
      results: quizResults
    });
  } catch (err) {
    res.status(400).json({ message: 'Error submitting quiz', error: err.message });
  }
};

// Create a course
const createCourse = async (req, res) => {
  try {
    // Extract data from request body
    // Handle both JSON and FormData formats
    let { 
      title, 
      description, 
      shortDescription,
      category,
      tags,
      level,
      prerequisites,
      learningOutcomes,
      price,
      coverImage,
      sections
    } = req.body;
    
    // Log the raw request body for debugging
    console.log('Raw request body:', req.body);
    
    // Ensure required fields are properly extracted from FormData
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      console.log('Processing multipart/form-data request');
      // Convert empty strings to null/undefined to avoid validation issues
      title = title || null;
      description = description || null;
      category = category || null;
      
      // Handle learningObjectives field which might be named differently in the frontend
      if (req.body.learningObjectives && !learningOutcomes) {
        learningOutcomes = req.body.learningObjectives;
      }
    }
    
    // Parse JSON strings if they were sent as FormData
    if (typeof tags === 'string') {
      try { 
        tags = tags.startsWith('[') ? JSON.parse(tags) : tags.split(',').map(tag => tag.trim());
      } catch (e) { 
        console.log('Error parsing tags:', e);
        tags = []; 
      }
    }
    
    if (typeof prerequisites === 'string') {
      try { 
        prerequisites = prerequisites.startsWith('[') ? JSON.parse(prerequisites) : prerequisites.split(',').map(p => p.trim());
      } catch (e) { 
        console.log('Error parsing prerequisites:', e);
        prerequisites = []; 
      }
    }
    
    if (typeof learningOutcomes === 'string') {
      try { 
        learningOutcomes = learningOutcomes.startsWith('[') ? JSON.parse(learningOutcomes) : learningOutcomes.split(',').map(o => o.trim());
      } catch (e) { 
        console.log('Error parsing learningOutcomes:', e);
        learningOutcomes = []; 
      }
    }
    
    if (typeof sections === 'string') {
      try { 
        sections = sections.startsWith('[') ? JSON.parse(sections) : [];
      } catch (e) { 
        console.log('Error parsing sections:', e);
        sections = []; 
      }
    }

    // Handle price conversion
    if (typeof price === 'string') {
      price = parseFloat(price) || 0;
    }
    
    // Handle duration field which might be present in the request but not used in the model
    // We don't need to do anything with it as it's not part of our course model

    // Log the processed data for debugging
    console.log('Processed course data:', { title, description, category });

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({ 
        message: 'Title, description, and category are required',
        receivedData: { title: !!title, description: !!description, category: !!category }
      });
    }
    
    // Validate sections structure if provided
    if (sections && !Array.isArray(sections)) {
      return res.status(400).json({ message: 'Sections must be an array' });
    }

    // Use the instructor's ID from the authenticated request
    const instructor = req.user.id;

    const course = await Course.create({ 
      title, 
      description, 
      shortDescription,
      instructor,
      category,
      tags: tags || [],
      level: level || 'Beginner',
      prerequisites: prerequisites || [],
      learningOutcomes: learningOutcomes || [],
      price: price || 0,
      coverImage,
      isPublished: false, // Default to unpublished
      sections: sections || []
    });

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(400).json({ message: 'Error creating course', error: err.message });
  }
};
// Enroll in a course
const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if course is published
    if (!course.isPublished) {
      return res.status(400).json({ message: 'This course is not available for enrollment yet' });
    }

    // Check if already enrolled in course
    if (course.learners.includes(userId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add user to course learners
    course.learners.push(userId);
    await course.save();

    // Add course to user's enrolled courses
    const User = require('../models/userModel');
    const user = await User.findById(userId);
    
    user.enrolledCourses.push({
      course: courseId,
      enrollmentDate: Date.now(),
      progress: 0,
      completed: false,
      lastAccessed: Date.now()
    });
    
    await user.save();

    res.status(200).json({ 
      message: 'Enrolled successfully', 
      courseId: course._id,
      title: course.title
    });
  } catch (err) {
    res.status(400).json({
      message: 'Error enrolling in course', 
      error: err.message
    });
  }
};
// Get all courses with filtering and sorting options
const getCourses = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      category,
      level,
      search,
      sort = 'createdAt',
      order = 'desc',
      instructor,
      published = true
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Only show published courses by default (unless explicitly requested otherwise)
    if (published === 'true' || published === true) {
      filter.isPublished = true;
    }
    
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (instructor) filter.instructor = instructor;
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    // Determine sort order
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const courses = await Course.find(filter)
      .populate('instructor', 'firstName lastName profilePicture')
      .sort(sortOptions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select('title shortDescription description coverImage category level ratings totalDuration totalLessons price createdAt');

    // Get total count for pagination
    const totalCourses = await Course.countDocuments(filter);

    res.json({
      courses,
      totalPages: Math.ceil(totalCourses / parseInt(limit)),
      currentPage: parseInt(page),
      totalCourses
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        message: 'Not authorized to delete this course'
      });
    }
    
    // Remove course from enrolled users
    const User = require('../models/userModel');
    await User.updateMany(
      { 'enrolledCourses.course': course._id },
      { $pull: { enrolledCourses: { course: course._id } } }
    );
    
    // Delete the course
    await Course.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course', error: err.message });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName profilePicture bio')
      .populate('reviews.user', 'firstName lastName profilePicture');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // If course is not published, only instructor or admin can view it
    if (!course.isPublished && 
        course.instructor._id.toString() !== req.user.id && 
        req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'This course is not available' });
    }
    
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course', error: err.message });
  }
};

// Update course details
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Fields that can be updated
    const updatableFields = [
      'title', 'description', 'shortDescription', 'coverImage', 'price',
      'category', 'tags', 'level', 'prerequisites', 'learningOutcomes', 'isPublished'
    ];
    
    // Update only the fields that are provided
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });
    
    await course.save();
    
    res.json({ 
      message: 'Course updated successfully',
      course: {
        _id: course._id,
        title: course.title,
        description: course.description,
        isPublished: course.isPublished
      }
    });
  } catch (err) {
    res.status(400).json({ message: 'Error updating course', error: err.message });
  }
};

// Add a section to a course
const addSection = async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const courseId = req.params.id;
    
    if (!title || order === undefined) {
      return res.status(400).json({ message: 'Title and order are required' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Add new section
    course.sections.push({
      title,
      description: description || '',
      order,
      lessons: []
    });
    
    // Sort sections by order
    course.sections.sort((a, b) => a.order - b.order);
    
    await course.save();
    
    res.status(201).json({
      message: 'Section added successfully',
      section: course.sections[course.sections.length - 1]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error adding section', error: err.message });
  }
};

// Add a lesson to a section
const addLesson = async (req, res) => {
  try {
    const { 
      title, description, content, contentType, videoUrl, 
      duration, order, resources 
    } = req.body;
    
    const { courseId, sectionId } = req.params;
    
    if (!title || !content || order === undefined) {
      return res.status(400).json({ message: 'Title, content, and order are required' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Find the section
    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    // Add new lesson
    section.lessons.push({
      title,
      description: description || '',
      content,
      contentType: contentType || 'text',
      videoUrl,
      duration: duration || 0,
      order,
      isPublished: false,
      resources: resources || []
    });
    
    // Sort lessons by order
    section.lessons.sort((a, b) => a.order - b.order);
    
    await course.save();
    
    res.status(201).json({
      message: 'Lesson added successfully',
      lesson: section.lessons[section.lessons.length - 1]
    });
  } catch (err) {
    res.status(400).json({ message: 'Error adding lesson', error: err.message });
  }
};

// Update lesson content
const updateLesson = async (req, res) => {
  try {
    const { courseId, sectionId, lessonId } = req.params;
    const { 
      title, description, content, contentType, 
      videoUrl, duration, isPublished, resources 
    } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id) {
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
    
    // Update lesson fields if provided
    if (title) lesson.title = title;
    if (description !== undefined) lesson.description = description;
    if (content) lesson.content = content;
    if (contentType) lesson.contentType = contentType;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (duration !== undefined) lesson.duration = duration;
    if (isPublished !== undefined) lesson.isPublished = isPublished;
    
    // Handle resources update - ensure we maintain the existing structure
    if (resources) {
      // Validate resources format
      if (Array.isArray(resources)) {
        // Validate each resource has required fields
        const validResources = resources.every(resource => 
          resource.title && 
          resource.type && 
          resource.url && 
          ['pdf', 'link', 'file'].includes(resource.type)
        );
        
        if (validResources) {
          lesson.resources = resources;
        } else {
          return res.status(400).json({ 
            message: 'Invalid resource format. Each resource must have title, type, and url fields' 
          });
        }
      } else {
        return res.status(400).json({ message: 'Resources must be an array' });
      }
    }
    
    await course.save();
    
    res.status(200).json({
      message: 'Lesson updated successfully',
      lesson
    });
  } catch (err) {
    res.status(400).json({ message: 'Error updating lesson', error: err.message });
  }
};

// Track user progress in a course
const trackProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = req.user.id;
    const { progress, completed } = req.body;
    
    // Find user and update course progress
    const User = require('../models/userModel');
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the enrolled course
    const enrolledCourse = user.enrolledCourses.find(
      course => course.course.toString() === courseId
    );
    
    if (!enrolledCourse) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }
    
    // Update progress and completion status
    if (progress !== undefined) {
      enrolledCourse.progress = progress;
    }
    
    if (completed !== undefined) {
      enrolledCourse.completed = completed;
    }
    
    // Update last accessed timestamp
    enrolledCourse.lastAccessed = Date.now();
    
    await user.save();
    
    res.status(200).json({
      message: 'Progress updated successfully',
      progress: enrolledCourse.progress,
      completed: enrolledCourse.completed
    });
  } catch (err) {
    res.status(400).json({ message: 'Error tracking progress', error: err.message });
  }
};

// Add resources to a lesson
const addResourcesToLesson = async (req, res) => {
  try {
    const { courseId, sectionId, lessonId } = req.params;
    const { resources } = req.body;
    
    if (!resources || !Array.isArray(resources)) {
      return res.status(400).json({ message: 'Resources must be provided as an array' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course
    if (course.instructor.toString() !== req.user.id) {
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
    
    // Add resources to the lesson
    lesson.resources = [...lesson.resources, ...resources];
    
    await course.save();
    
    res.status(200).json({
      message: 'Resources added successfully',
      resources: lesson.resources
    });
  } catch (err) {
    res.status(400).json({ message: 'Error adding resources', error: err.message });
  }
};

module.exports = {
  submitQuiz, 
  createCourse, 
  enrollInCourse, 
  getCourses, 
  getCourseById,
  updateCourse,
  deleteCourse, 
  addSection, 
  addLesson,
  updateLesson,
  trackProgress,
  addResourcesToLesson
};