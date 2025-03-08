const express = require('express');
const { 
  getCourseResources, 
  addCourseResource, 
  addLessonResource,
  updateResource, 
  deleteResource,
  updateCourseResource,
  deleteCourseResource 
} = require('../controllers/resourceController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Resource management routes
router.get('/courses/:courseId/resources', authMiddleware, getCourseResources);

// Course-level resource routes
router.post('/courses/:courseId/resources', authMiddleware, addCourseResource);
router.put('/courses/:courseId/resources/:resourceId', authMiddleware, updateCourseResource);
router.delete('/courses/:courseId/resources/:resourceId', authMiddleware, deleteCourseResource);

// Lesson-level resource routes
router.post('/courses/:courseId/sections/:sectionId/lessons/:lessonId/resources', authMiddleware, addLessonResource);
router.put('/courses/:courseId/sections/:sectionId/lessons/:lessonId/resources/:resourceId', authMiddleware, updateResource);
router.delete('/courses/:courseId/sections/:sectionId/lessons/:lessonId/resources/:resourceId', authMiddleware, deleteResource);

module.exports = router;