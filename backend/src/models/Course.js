const mongoose = require('mongoose');
const courseModel = require('./courseModel');

// Export the Course model directly from courseModel.js
module.exports = mongoose.model('Course', courseModel.schema);