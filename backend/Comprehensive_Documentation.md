# Learning Sphere - Comprehensive Documentation

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Core Concepts & Features](#core-concepts--features)
4. [System Architecture](#system-architecture)
5. [Database Design](#database-design)
6. [API Architecture](#api-architecture)
7. [Frontend Architecture](#frontend-architecture)
8. [Backend Architecture](#backend-architecture)
9. [Authentication & Security](#authentication--security)
10. [User Management & Roles](#user-management--roles)
11. [Course Management System](#course-management-system)
12. [Learning Experience](#learning-experience)
13. [Resource Management](#resource-management)
14. [AI Integration](#ai-integration)
15. [Media Management](#media-management)
16. [Admin & Analytics](#admin--analytics)
17. [Development Workflow](#development-workflow)
18. [Deployment & DevOps](#deployment--devops)
19. [Testing & Quality Assurance](#testing--quality-assurance)
20. [Performance & Optimization](#performance--optimization)
21. [Security & Compliance](#security--compliance)
22. [Troubleshooting & Support](#troubleshooting--support)
23. [API Reference](#api-reference)
24. [Component Library](#component-library)
25. [Future Roadmap](#future-roadmap)

---

## 🎯 Project Overview

### What is Learning Sphere?

**Learning Sphere** is a comprehensive, enterprise-grade Learning Management System (LMS) built with modern web technologies. It's designed to provide a complete e-learning solution for educational institutions, corporate training, and individual learners.

### Key Value Propositions

- **Complete Learning Ecosystem**: From course creation to completion tracking
- **Professional Video Experience**: Advanced video player with interactive features
- **Role-Based Access Control**: Secure multi-tenant architecture
- **AI-Powered Learning**: Intelligent recommendations and assistance
- **Scalable Architecture**: Built for growth and high performance
- **Mobile-First Design**: Responsive across all devices

### Target Audience

- **Educational Institutions**: Schools, colleges, universities
- **Corporate Training**: Employee development, skill building
- **Individual Instructors**: Content creators, subject matter experts
- **Students & Learners**: Self-paced learning, skill development

---

## 🏗️ Architecture & Technology Stack

### Technology Stack Overview

#### Frontend Technologies
```
React 18.3.1          - Modern UI framework with hooks
Redux Toolkit 2.5.0   - State management with RTK Query
React Router 7.1.1    - Client-side routing
Axios 1.7.9          - HTTP client for API communication
React Player 2.16.0   - Video player integration
React PDF 9.2.1       - PDF document handling
FontAwesome 6.7.2     - Icon library
```

#### Backend Technologies
```
Node.js               - JavaScript runtime environment
Express.js 4.21.2     - Web application framework
MongoDB 8.9.4         - NoSQL database
Mongoose 8.9.4        - MongoDB object modeling
JWT 9.0.2             - Authentication tokens
bcryptjs 2.4.3        - Password hashing
Multer 2.0.2          - File upload handling
Cloudinary 1.41.3     - Cloud media management
OpenAI 5.17.0         - AI integration
Socket.io 4.8.1       - Real-time communication
Redis 4.7.0           - Caching and sessions
```

#### Development & DevOps
```
Nodemon 3.1.9         - Development server with auto-reload
ESLint                - Code quality and consistency
Git                   - Version control
npm                   - Package management
```

### System Requirements

#### Development Environment
- **Node.js**: v14.0.0 or higher
- **MongoDB**: v4.4 or higher (local or Atlas)
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 10GB free space
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

#### Production Environment
- **Node.js**: v16.0.0 or higher (LTS version)
- **MongoDB**: v5.0 or higher (Atlas recommended)
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: Minimum 50GB SSD
- **Load Balancer**: For high availability
- **CDN**: For static asset delivery

---

## 🎨 Core Concepts & Features

### 1. Learning Management System (LMS)

#### What is an LMS?
An LMS is a software application that provides the framework for managing all aspects of the learning process. It's the technology that enables the delivery, tracking, and management of educational content.

#### Core LMS Features in Learning Sphere
- **Course Creation & Management**: Build structured learning paths
- **Content Delivery**: Multimedia content support (video, PDF, links)
- **Progress Tracking**: Monitor learner advancement
- **Assessment Tools**: Quizzes, assignments, and evaluations
- **User Management**: Student, instructor, and admin roles
- **Reporting & Analytics**: Learning insights and metrics

### 2. Role-Based Access Control (RBAC)

#### Role Hierarchy
```
Admin (Super User)
├── Full platform access
├── User management
├── Course approval
├── System configuration
└── Analytics & reporting

Instructor (Content Creator)
├── Course creation & management
├── Student progress tracking
├── Resource management
├── Assessment creation
└── Revenue analytics

Learner (Student)
├── Course enrollment
├── Content consumption
├── Progress tracking
├── Resource downloads
└── Profile management
```

#### Permission Matrix
| Feature | Admin | Instructor | Learner |
|---------|-------|------------|---------|
| User Management | ✅ Full | ❌ None | ❌ None |
| Course Creation | ✅ Full | ✅ Full | ❌ None |
| Course Approval | ✅ Full | ❌ None | ❌ None |
| Content Access | ✅ Full | ✅ Own Courses | ✅ Enrolled |
| Analytics | ✅ Full | ✅ Own Data | ✅ Personal |

### 3. Course Structure & Organization

#### Hierarchical Course Model
```
Course
├── Basic Information
│   ├── Title & Description
│   ├── Category & Level
│   ├── Pricing & Duration
│   └── Learning Outcomes
├── Course Content
│   ├── Sections (Chapters)
│   │   ├── Section Title
│   │   ├── Section Description
│   │   └── Lessons
│   └── Lessons
│       ├── Lesson Title
│       ├── Video Content
│       ├── Duration
│       └── Resources
└── Metadata
    ├── Instructor Info
    ├── Creation Date
    ├── Last Updated
    ├── Enrollment Count
    └── Rating & Reviews
```

#### Content Types Supported
- **Video Lessons**: MP4, WebM, MOV formats
- **Document Resources**: PDF, DOC, PPT files
- **External Links**: Web resources, tools, references
- **Interactive Content**: Quizzes, assignments
- **Supplementary Materials**: Notes, guides, templates

---

## 🏛️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │   (Express)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │   External      │    │   File Storage  │
│   Assets        │    │   Services      │    │   (Cloudinary)  │
│                 │    │   (AI, Email)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture

#### Frontend Component Hierarchy
```
App
├── Router
│   ├── Public Routes
│   │   ├── HomePage
│   │   ├── LoginPage
│   │   ├── RegisterPage
│   │   └── CourseListPage
│   ├── Protected Routes
│   │   ├── Dashboard
│   │   ├── CoursePlayer
│   │   ├── UserProfile
│   │   └── AdminPanel
│   └── Error Boundaries
├── Global State (Redux)
│   ├── Auth Slice
│   ├── Course Slice
│   ├── User Slice
│   └── UI Slice
└── Shared Components
    ├── Header
    ├── Footer
    ├── Navigation
    └── Toast System
```

#### Backend Service Architecture
```
Express App
├── Middleware Stack
│   ├── CORS
│   ├── Body Parser
│   ├── Authentication
│   ├── Rate Limiting
│   └── Error Handling
├── Route Handlers
│   ├── Auth Routes
│   ├── Course Routes
│   ├── User Routes
│   ├── Admin Routes
│   └── AI Routes
├── Controllers
│   ├── Business Logic
│   ├── Data Validation
│   └── Response Formatting
├── Services
│   ├── AI Service
│   ├── Media Service
│   └── Notification Service
└── Models
    ├── User Model
    ├── Course Model
    └── Resource Model
```

### Data Flow Architecture

#### Frontend Data Flow
```
User Action → Component → Redux Action → API Call → Backend
     ↑                                                      ↓
UI Update ← Redux State ← Redux Reducer ← API Response ← Database
```

#### Backend Data Flow
```
HTTP Request → Middleware → Route → Controller → Service → Model → Database
     ↑                                                                  ↓
HTTP Response ← Middleware ← Route ← Controller ← Service ← Model ← Database
```

---

## 🗄️ Database Design

### Database Schema Overview

#### User Collection Schema
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'instructor', 'learner']),
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String,
    skills: [String],
    interests: [String],
    socialLinks: {
      linkedin: String,
      github: String,
      website: String
    }
  },
  preferences: {
    language: String,
    timezone: String,
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean
}
```

#### Course Collection Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  category: String (required),
  level: String (enum: ['beginner', 'intermediate', 'advanced']),
  price: Number (required),
  instructor: {
    _id: ObjectId (ref: 'User'),
    name: String,
    avatar: String
  },
  content: {
    sections: [{
      _id: ObjectId,
      title: String,
      description: String,
      order: Number,
      lessons: [{
        _id: ObjectId,
        title: String,
        description: String,
        videoUrl: String,
        duration: Number,
        order: Number,
        resources: [{
          title: String,
          type: String,
          url: String,
          size: Number
        }]
      }]
    }]
  },
  metadata: {
    thumbnail: String,
    tags: [String],
    prerequisites: [String],
    learningOutcomes: [String],
    totalDuration: Number,
    enrollmentCount: Number,
    rating: Number,
    reviewCount: Number
  },
  status: String (enum: ['draft', 'pending', 'published', 'archived']),
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date
}
```

#### Enrollment Collection Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  courseId: ObjectId (ref: 'Course'),
  enrolledAt: Date,
  progress: {
    completedLessons: [ObjectId],
    currentLesson: ObjectId,
    completionPercentage: Number,
    timeSpent: Number,
    lastAccessed: Date
  },
  certificate: {
    issued: Boolean,
    issuedAt: Date,
    certificateId: String
  },
  status: String (enum: ['active', 'completed', 'paused', 'cancelled'])
}
```

#### Resource Download Collection Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  courseId: ObjectId (ref: 'Course'),
  resourceId: ObjectId,
  downloadedAt: Date,
  ipAddress: String,
  userAgent: String,
  downloadCount: Number
}
```

### Database Relationships

#### One-to-Many Relationships
- **User → Courses**: One instructor can create many courses
- **Course → Sections**: One course contains many sections
- **Section → Lessons**: One section contains many lessons
- **User → Enrollments**: One user can enroll in many courses

#### Many-to-Many Relationships
- **Users ↔ Courses**: Through enrollments
- **Courses ↔ Categories**: Through tags and categories
- **Users ↔ Resources**: Through downloads

### Indexing Strategy

#### Primary Indexes
- `_id`: Default MongoDB ObjectId index
- `email`: Unique index for user authentication
- `courseId`: Index for course lookups

#### Secondary Indexes
- `role`: For role-based queries
- `category`: For course filtering
- `status`: For course status filtering
- `instructor._id`: For instructor course queries
- `createdAt`: For chronological sorting

---

## 🔌 API Architecture

### RESTful API Design Principles

#### HTTP Methods Usage
- **GET**: Retrieve data (courses, users, resources)
- **POST**: Create new resources (users, courses, enrollments)
- **PUT**: Update existing resources (course content, user profiles)
- **DELETE**: Remove resources (courses, users)
- **PATCH**: Partial updates (course status, user preferences)

#### API Response Format
```javascript
// Success Response
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### API Endpoint Structure

#### Authentication Endpoints
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User authentication
POST /api/auth/logout       - User logout
GET  /api/auth/profile      - Get user profile
PUT  /api/auth/profile      - Update user profile
POST /api/auth/refresh      - Refresh access token
```

#### Course Endpoints
```
GET    /api/courses                    - Get all courses
GET    /api/courses/:id                - Get course details
POST   /api/courses                    - Create new course
PUT    /api/courses/:id                - Update course
DELETE /api/courses/:id                - Delete course
POST   /api/courses/:id/enroll         - Enroll in course
GET    /api/courses/:id/progress       - Get course progress
PUT    /api/courses/:id/progress       - Update progress
GET    /api/courses/:id/resources      - Get course resources
```

#### User Management Endpoints
```
GET    /api/users                      - Get all users (Admin)
GET    /api/users/:id                  - Get user details
PUT    /api/users/:id                  - Update user
DELETE /api/users/:id                  - Delete user
PUT    /api/users/:id/role             - Change user role
GET    /api/users/:id/courses          - Get user courses
GET    /api/users/:id/enrollments      - Get user enrollments
```

#### Admin Endpoints
```
GET    /api/admin/dashboard/stats      - Platform statistics
GET    /api/admin/courses              - All courses for approval
PUT    /api/admin/courses/:id/approve  - Approve course
PUT    /api/admin/courses/:id/reject   - Reject course
GET    /api/admin/users                - All users
PUT    /api/admin/users/:id/status     - Change user status
GET    /api/admin/analytics            - Platform analytics
```

#### AI Integration Endpoints
```
POST   /api/ai/chat                    - AI chat interaction
POST   /api/ai/recommendations         - Course recommendations
POST   /api/ai/content-analysis        - Content analysis
GET    /api/ai/chat/history            - Chat history
```

### API Versioning Strategy

#### Version Control
- **Current Version**: v1 (default)
- **Version Prefix**: `/api/v1/` (optional)
- **Backward Compatibility**: Maintained for 2 major versions
- **Deprecation Policy**: 6-month notice before breaking changes

#### Response Headers
```
X-API-Version: 1.0
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 95
X-Rate-Limit-Reset: 1642233600
```

### Rate Limiting & Security

#### Rate Limiting Configuration
```javascript
// Rate limiting rules
{
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
}
```

#### Security Headers
```javascript
// Security middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## ⚛️ Frontend Architecture

### React Component Architecture

#### Component Types

##### 1. Presentational Components (Dumb Components)
```javascript
// CourseCard.js - Pure presentational component
const CourseCard = ({ course, onEnroll, onView }) => {
  return (
    <div className="course-card">
      <img src={course.thumbnail} alt={course.title} />
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <button onClick={() => onEnroll(course.id)}>Enroll</button>
      <button onClick={() => onView(course.id)}>View</button>
    </div>
  );
};
```

##### 2. Container Components (Smart Components)
```javascript
// CourseList.js - Container component with logic
const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchCourses();
  }, []);
  
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="course-list">
      {loading ? <LoadingSpinner /> : courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
```

##### 3. Higher-Order Components (HOCs)
```javascript
// withAuth.js - HOC for authentication
const withAuth = (WrappedComponent, requiredRole = null) => {
  return function AuthenticatedComponent(props) {
    const { user, isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/unauthorized" />;
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Usage
const ProtectedCourseCreator = withAuth(CourseCreator, 'instructor');
```

### State Management Architecture

#### Redux Toolkit Structure
```javascript
// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import courseSlice from './courseSlice';
import userSlice from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    courses: courseSlice,
    users: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
```

#### Slice Pattern
```javascript
// store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
```

### Routing Architecture

#### Route Configuration
```javascript
// App.js - Main routing configuration
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CourseListPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><RoleBasedDashboard /></ProtectedRoute>} />
        <Route path="/course/:id" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
        <Route path="/learn/:courseId" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminRoutes /></ProtectedRoute>} />
        
        {/* Error Routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### Protected Route Component
```javascript
// components/ProtectedRoute.js
const ProtectedRoute = ({ children, role = null }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};
```

### Component Library Architecture

#### Design System Components
```javascript
// components/ui/Button.js
const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  ...props 
}) => {
  const buttonClass = `btn btn--${variant} btn--${size}`;
  
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

// components/ui/Modal.js
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
```

#### Styling Architecture
```css
/* styles/design-system.c

->

/* styles/design-system.css */
:root {
  /* Color Palette */
  --primary-color: #2563eb;
  --primary-dark: #1d4ed8;
  --primary-light: #3b82f6;
  --secondary-color: #64748b;
  --accent-color: #f59e0b;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  
  /* Typography */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

/* Component Variants */
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn--primary {
  background-color: var(--primary-color);
  color: white;
}

.btn--secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn--outline {
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.btn--outline {
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

->

.btn--outline {
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}
```

## 🔧 Backend Architecture

### Express.js Application Structure

#### Main Application Entry Point
```javascript
// src/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

// Middleware Stack
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Middleware Architecture
```javascript
// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access token required' }
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token' }
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: { message: 'Invalid or expired token' }
    });
  }
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions' }
      });
    }
    next();
  };
};
```

#### Controller Pattern
```javascript
// src/controllers/courseController.js
import Course from '../models/courseModel.js';
import { validateCourseData } from '../utils/validation.js';

export const createCourse = async (req, res) => {
  try {
    // Input validation
    const validationErrors = validateCourseData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid course data',
          details: validationErrors
        }
      });
    }
    
    // Business logic
    const courseData = {
      ...req.body,
      instructor: {
        _id: req.user._id,
        name: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
        avatar: req.user.profile.avatar
      },
      status: 'pending'
    };
    
    const course = new Course(courseData);
    await course.save();
    
    // Response formatting
    res.status(201).json({
      success: true,
      data: course,
      message: 'Course created successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

#### Service Layer Architecture
```javascript
// src/services/aiService.js
import OpenAI from 'openai';
import { redisClient } from '../config/redis.js';

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async generateResponse(prompt, context = '') {
    try {
      // Check cache first
      const cacheKey = `ai:${Buffer.from(prompt).toString('base64')}`;
      const cached = await redisClient.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }
      
      // Generate AI response
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      });
      
      const response = {
        content: completion.choices[0].message.content,
        model: completion.model,
        usage: completion.usage
      };
      
      // Cache response for 1 hour
      await redisClient.setex(cacheKey, 3600, JSON.stringify(response));
      
      return response;
    } catch (error) {
      throw new Error(`AI service error: ${error.message}`);
    }
  }
}

export default new AIService();
```


export default new AIService();
```

->

export default new AIService();
```

## 🔐 Authentication & Security

### JWT Authentication System

#### Token Structure
```javascript
// JWT Payload Structure
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "instructor",
  "iat": 1642233600,  // Issued at
  "exp": 1642237200   // Expires at (1 hour)
}
```

#### Authentication Flow
```javascript
// src/controllers/authController.js
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' }
      });
    }
    
    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }
    
    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile
        },
        accessToken
      },
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
};
```

#### Password Security
```javascript
// Password hashing with bcrypt
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Password validation
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
  if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
  if (!hasNumbers) errors.push('Password must contain at least one number');
  if (!hasSpecialChar) errors.push('Password must contain at least one special character');
  
  return errors;
};
```

### Security Middleware

#### CORS Configuration
```javascript
// CORS setup for production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://learningsphere.com',
      'https://www.learningsphere.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};

app.use(cors(corsOptions));
```

#### Rate Limiting
```javascript
// Different rate limits for different endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api/', apiLimiter);
```

#### Input Validation & Sanitization
```javascript
// src/middlewares/validateInput.js
import { body, validationResult } from 'express-validator';
import xss from 'xss';

export const sanitizeInput = (req, res, next) => {
  // Sanitize all string inputs
  Object.keys(req.body).forEach(key => {
    if (typeof req.body[key] === 'string') {
      req.body[key] = xss(req.body[key]);
    }
  });
  
  next();
};

export const validateCourseCreation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }
    next();
  }
];
```

];
```

->

];
```

## 👥 User Management & Roles

### Role-Based Access Control (RBAC) System

#### Role Definitions
```javascript
// src/models/userModel.js
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['admin', 'instructor', 'learner'],
    default: 'learner',
    required: true
  },
  permissions: {
    type: [String],
    default: function() {
      // Default permissions based on role
      switch (this.role) {
        case 'admin':
          return ['*']; // All permissions
        case 'instructor':
          return [
            'course:create',
            'course:read',
            'course:update',
            'course:delete',
            'student:read',
            'analytics:read'
          ];
        case 'learner':
          return [
            'course:enroll',
            'course:read',
            'resource:download',
            'profile:update'
          ];
        default:
          return [];
      }
    }
  }
});
```

#### Permission Checking Middleware
```javascript
// src/middlewares/roleMiddleware.js
export const checkPermission = (permission) => {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }
    
    // Admin has all permissions
    if (user.role === 'admin' || user.permissions.includes('*')) {
      return next();
    }
    
    // Check specific permission
    if (user.permissions.includes(permission)) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      error: { message: 'Insufficient permissions' }
    });
  };
};

// Usage examples
export const canCreateCourse = checkPermission('course:create');
export const canManageUsers = checkPermission('user:manage');
export const canViewAnalytics = checkPermission('analytics:read');
```

#### User Profile Management
```javascript
// src/controllers/userController.js
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, skills, interests, socialLinks } = req.body;
    const userId = req.user._id;
    
    // Validate input
    const validationErrors = validateProfileData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid profile data',
          details: validationErrors
        }
      });
    }
    
    // Update profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        'profile.firstName': firstName,
        'profile.lastName': lastName,
        'profile.bio': bio,
        'profile.skills': skills,
        'profile.interests': interests,
        'profile.socialLinks': socialLinks,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    
    // Only admins can change roles
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Only admins can change user roles' }
      });
    }
    
    // Validate role
    const validRoles = ['admin', 'instructor', 'learner'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid role specified' }
      });
    }
    
    // Update user role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        role: newRole,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: updatedUser,
      message: 'User role updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

### User Dashboard & Analytics

#### Role-Based Dashboard Data
```javascript
// src/services/dashboardService.js
export const getDashboardData = async (userId, userRole) => {
  try {
    switch (userRole) {
      case 'admin':
        return await getAdminDashboardData();
      case 'instructor':
        return await getInstructorDashboardData(userId);
      case 'learner':
        return await getLearnerDashboardData(userId);
      default:
        throw new Error('Invalid user role');
    }
  } catch (error) {
    throw new Error(`Dashboard data error: ${error.message}`);
  }
};

const getInstructorDashboardData = async (instructorId) => {
  const [
    totalCourses,
    totalStudents,
    totalRevenue,
    recentEnrollments,
    courseAnalytics
  ] = await Promise.all([
    Course.countDocuments({ 'instructor._id': instructorId }),
    Enrollment.aggregate([
      { $match: { courseId: { $in: await Course.find({ 'instructor._id': instructorId }).select('_id') } } },
      { $group: { _id: null, uniqueStudents: { $addToSet: '$userId' } } },
      { $project: { totalStudents: { $size: '$uniqueStudents' } } }
    ]),
    Enrollment.aggregate([
      { $match: { courseId: { $in: await Course.find({ 'instructor._id': instructorId }).select('_id') } } },
      { $lookup: { from: 'courses', localField: 'courseId', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $group: { _id: null, totalRevenue: { $sum: '$course.price' } } }
    ]),
    Enrollment.find({ courseId: { $in: await Course.find({ 'instructor._id': instructorId }).select('_id') } })
      .sort({ enrolledAt: -1 })
      .limit(5)
      .populate('userId', 'profile.firstName profile.lastName profile.avatar'),
    Course.aggregate([
      { $match: { 'instructor._id': instructorId } },
      { $project: {
        title: 1,
        enrollmentCount: '$metadata.enrollmentCount',
        rating: '$metadata.rating',
        revenue: { $multiply: ['$price', '$metadata.enrollmentCount'] }
      }}
    ])
  ]);
  
  return {
    totalCourses,
    totalStudents: totalStudents[0]?.totalStudents || 0,
    totalRevenue: totalRevenue[0]?.totalRevenue || 0,
    recentEnrollments,
    courseAnalytics
  };
};
```