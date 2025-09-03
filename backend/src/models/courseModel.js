const mongoose = require('mongoose');

// Schema for individual lessons within a section
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  contentType: { type: String, enum: ['video', 'text', 'quiz', 'assignment'], default: 'text' },
  videoUrl: { type: String },
  videoPublicId: { type: String }, // Cloudinary public ID for video management
  videoStreamingUrls: {
    auto: { type: String },
    hd: { type: String },
    sd: { type: String },
    mobile: { type: String }
  },
  videoDuration: { type: Number }, // Video duration in seconds from Cloudinary
  videoThumbnailUrl: { type: String }, // Auto-generated thumbnail from Cloudinary
  duration: { type: Number }, // in minutes
  order: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  quizQuestions: [{
    question: { type: String, required: true },
    options: [{ 
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false }
    }],
    explanation: { type: String },
    points: { type: Number, default: 1 }
  }],
  videoThumbnail: { type: String },
  transcript: { type: String },
  resources: [{
    title: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'link', 'file', 'video', 'audio'], required: true },
    url: { type: String, required: true },
    publicId: { type: String }, // Cloudinary public ID
    fileSize: { type: Number }, // File size in bytes
    format: { type: String }, // File format from Cloudinary
    description: { type: String, default: '' },
    tags: [{ type: String }], // Tags for categorizing and filtering resources
    isPublic: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
  }]
});

// Schema for sections within a course
const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  lessons: [lessonSchema]
});

// Main course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverImage: { type: String },
  coverImagePublicId: { type: String }, // Cloudinary public ID for cover image
  price: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  category: { type: String, required: true },
  tags: [{ type: String }],
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  prerequisites: [{ type: String }],
  learningOutcomes: [{ type: String }],
  sections: [sectionSchema],
  totalDuration: { type: Number, default: 0 }, // Calculated field
  totalLessons: { type: Number, default: 0 }, // Calculated field
  courseResources: [{
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['pdf', 'link', 'file', 'video', 'audio'], required: true },
    url: { type: String, required: true },
    publicId: { type: String }, // Cloudinary public ID
    fileSize: { type: Number }, // File size in bytes
    format: { type: String }, // File format from Cloudinary
    tags: [{ type: String }], // Tags for categorizing and filtering resources
    isPublic: { type: Boolean, default: false }, // Whether the resource is available before enrollment
    addedAt: { type: Date, default: Date.now }
  }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }],
  learners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total duration and lessons before saving
courseSchema.pre('save', function(next) {
  let totalDuration = 0;
  let totalLessons = 0;
  
  this.sections.forEach(section => {
    totalLessons += section.lessons.length;
    section.lessons.forEach(lesson => {
      if (lesson.duration) {
        totalDuration += lesson.duration;
      }
    });
  });
  
  this.totalDuration = totalDuration;
  this.totalLessons = totalLessons;
  next();
});

module.exports = mongoose.model('Course', courseSchema);