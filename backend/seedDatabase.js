#!/usr/bin/env node

/**
 * Database Seeder Script for Learning Sphere
 * 
 * This script populates your MongoDB database with sample data including:
 * - Users (Instructors, Students, Admin)
 * - Courses with full content structure
 * - Course enrollments and progress
 * - Reviews and ratings
 * - Resource download records
 * 
 * Usage: npm run seed
 */

const { seedDatabase } = require('./src/seeders/databaseSeeder');

console.log('🌱 Learning Sphere Database Seeder');
console.log('==================================');
console.log('');

// Run the seeder
seedDatabase();
