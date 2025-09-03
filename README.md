# Learning Sphere - E-Learning Platform

## 📚 Overview

Learning Sphere is a comprehensive e-learning platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides a complete learning management system with features like course creation, video lessons, progress tracking, assessments, and much more.

## ✨ Key Features

### 🎓 Course Management
- **Course Creation**: Instructors can create comprehensive courses with sections and lessons
- **Video Lessons**: Support for video content with custom player controls
- **Course Resources**: PDF downloads, links, and supplementary materials
- **Progress Tracking**: Automatic progress saving and completion tracking

### 👨‍🏫 Advanced Course Player
- **Custom Video Player**: Professional video player with speed control, fullscreen, theatre mode
- **Auto-Progression**: Smart navigation to next lesson after completion
- **Interactive Features**: Timestamped notes, bookmarks, discussion panels
- **Keyboard Shortcuts**: Space (play/pause), arrows (seek), N (notes), B (bookmarks)
- **Mobile Responsive**: Optimized for all devices

### 🚀 User Experience
- **Role-Based Access**: Admin, Instructor, and Learner roles with appropriate permissions
- **Professional UI**: Modern design system with consistent styling
- **Real-time Features**: Toast notifications, loading states, error handling
- **Statistics Dashboard**: Live platform statistics and analytics

### 🛡️ Security & Performance  
- **JWT Authentication**: Secure user authentication and authorization
- **Protected Routes**: Role-based route protection
- **Error Boundaries**: Graceful error handling throughout the application
- **API Integration**: RESTful API with proper error handling

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Learning-Sphere
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/learning-sphere
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/learning-sphere

# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-random

# Environment
NODE_ENV=development
```

### 4. Seed the Database with Sample Data
```bash
npm run seed
```

This will create:
- **9 Users** (5 Instructors, 3 Students, 1 Admin)
- **5 Comprehensive Courses** with real content
- **Course Enrollments** and progress data
- **Reviews and Ratings** for courses
- **Resource Download** records

### 5. Start the Backend Server
```bash
npm run dev
```
Backend will run on http://localhost:5000

### 6. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm start
```
Frontend will run on http://localhost:3000

## 🔐 Test Accounts

After running the seeder, you can use these accounts:

### Admin Account
- **Email**: admin@learningsphere.com
- **Password**: admin123
- **Access**: Full platform management, user management, course approvals

### Instructor Accounts
- **Sarah Johnson**: sarah.johnson@learningsphere.com (password: instructor123)
- **Michael Chen**: michael.chen@learningsphere.com (password: instructor123)
- **Alex Rodriguez**: alex.rodriguez@learningsphere.com (password: instructor123)
- **Emily Davis**: emily.davis@learningsphere.com (password: instructor123)
- **David Wilson**: david.wilson@learningsphere.com (password: instructor123)

### Student Accounts
- **John Doe**: john.doe@email.com (password: student123)
- **Jane Smith**: jane.smith@email.com (password: student123)
- **Robert Brown**: robert.brown@email.com (password: student123)

## 📚 Sample Courses Available

After seeding, you'll have these courses with full content:

1. **Complete Web Development Bootcamp** - $89.99
   - HTML & CSS Fundamentals
   - JavaScript Programming
   - Full-stack development

2. **Data Science & Machine Learning** - $99.99
   - Python for Data Science
   - Machine Learning with scikit-learn
   - Real-world projects

3. **Mobile App Development with React Native** - $79.99
   - React Native Fundamentals
   - Cross-platform development
   - App store deployment

4. **UI/UX Design Masterclass** - $69.99
   - Design Principles
   - User Research
   - Prototyping with Figma

5. **DevOps and Cloud Computing with AWS** - $119.99
   - DevOps Fundamentals
   - Docker & Kubernetes
   - AWS Cloud Services

## 🛠️ Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run seed:dev     # Seed with nodemon (for development)
```

### Frontend Scripts
```bash
npm start           # Start development server
npm run build       # Build for production
npm test           # Run tests
```

## 📁 Project Structure

```
Learning-Sphere/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Authentication, validation
│   │   └── seeders/        # Database seeding
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   ├── store/         # Redux store
    └── └── styles/        # CSS and styling
        └── package.json       # Frontend dependencies
```

## 🎯 Key Features Walkthrough

### 1. Course Player Experience
- Navigate to any course and click "Start Learning"
- Experience the professional video player with:
  - Custom controls (play, pause, seek, speed, volume)
  - Auto-progression prompts between lessons
  - Note-taking with timestamps
  - Bookmark management
  - Discussion panels
  - Keyboard shortcuts

### 2. Admin Dashboard
- Login as admin to see:
  - Platform statistics (real-time data)
  - User management
  - Course approval system
  - Analytics and insights

### 3. Instructor Features
- Course creation and management
- Student progress tracking
- Revenue analytics
- Course approval status

### 4. Student Experience
- Course enrollment
- Progress tracking
- Certificate earning
- Interactive learning features

## 🔧 Customization

### Adding New Courses
1. Login as an instructor
2. Navigate to "Create Course"
3. Add course details, sections, and lessons
4. Publish when ready

### Modifying Seeder Data
Edit `backend/src/seeders/databaseSeeder.js` to customize sample data.

### Styling Changes
The design system is located in `frontend/src/styles/design-system.css` with CSS custom properties for easy theming.

## 🚀 Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use `NODE_ENV=production`
3. Configure MongoDB Atlas for production database
4. Deploy to platforms like Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Run `npm run build`
2. Deploy the `build` folder to platforms like Netlify, Vercel, or AWS S3

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Instructor only)
- `PUT /api/courses/:id` - Update course (Instructor only)

### Admin Endpoints
- `GET /api/admin/dashboard/stats` - Platform statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/courses` - Get all courses
- `PUT /api/admin/courses/:id/approve` - Approve course

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MongoDB is running locally or MongoDB Atlas URL is correct
   - Check network connectivity

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes using the port

3. **Missing Dependencies**
   - Run `npm install` in both backend and frontend directories
   - Clear npm cache if needed: `npm cache clean --force`

4. **CORS Errors**
   - Ensure frontend URL is correct in backend CORS configuration
   - Check that both servers are running

### Getting Help
- Check the console for error messages
- Verify all environment variables are set
- Ensure database is seeded with sample data
- Check that both backend and frontend servers are running

---

**🌟 Enjoy building your e-learning platform with Learning Sphere!** 

The application is now ready with realistic data and all features working end-to-end. You can immediately start testing the full user experience from course discovery to completion with auto-progression.

# LearningSphere

**LearningSphere** is a scalable full-stack platform designed to provide a robust learning management system (LMS). It includes user authentication, dynamic dashboards, and real-time interactions with secure APIs and responsive frontend design.

---

## Features

### 🚀 Core Features
- **User Authentication**: Secure login and registration with JWT-based token authentication.
- **Dynamic Dashboard**: Personalized user experience post-login.
- **Protected Routes**: Access control using authentication middleware.
- **Responsive Design**: Fully responsive UI with clean and modern styling.
- **Resource Download Tracking**: Analytics system that tracks resource downloads and provides statistics for instructors.

### 🛠️ Technology Stack
- **Frontend**: React.js with Redux Toolkit for state management.
- **Backend**: Node.js with Express.js and MongoDB for the database.
- **Authentication**: Secure JWT-based authentication.

---
