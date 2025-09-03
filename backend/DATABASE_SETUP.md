# Learning Sphere Database Setup Guide

This guide will help you set up your MongoDB database with sample data for the Learning Sphere platform.

## Prerequisites

1. **MongoDB Atlas Account**: Make sure you have a MongoDB Atlas account and cluster set up
2. **Node.js**: Ensure Node.js is installed on your system
3. **Environment Variables**: Configure your `.env` file with the correct database connection string

## Step 1: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Update your `.env` file with your actual MongoDB Atlas connection string:
   ```env
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/learning-sphere?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-random
   PORT=5000
   ```

   **Important**: Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and `YOUR_CLUSTER` with your actual MongoDB Atlas credentials.

## Step 2: Install Dependencies

Make sure all dependencies are installed:
```bash
npm install
```

## Step 3: Seed the Database

Run the database seeder to populate your MongoDB with sample data:
```bash
npm run seed
```

This will create:
- **9 Users** (5 Instructors, 3 Students, 1 Admin)
- **5 Courses** with complete content structure
- **Course enrollments** with realistic progress data
- **Reviews and ratings** for each course
- **Resource download records**

## Sample Data Overview

### User Accounts Created

#### Instructors:
- `sarah.johnson@learningsphere.com` (password: `instructor123`)
- `michael.chen@learningsphere.com` (password: `instructor123`)  
- `alex.rodriguez@learningsphere.com` (password: `instructor123`)
- `emily.davis@learningsphere.com` (password: `instructor123`)
- `david.wilson@learningsphere.com` (password: `instructor123`)

#### Students:
- `john.doe@email.com` (password: `student123`)
- `jane.smith@email.com` (password: `student123`)
- `robert.brown@email.com` (password: `student123`)

#### Admin:
- `admin@learningsphere.com` (password: `admin123`)

### Courses Created:

1. **Complete Web Development Bootcamp** - Beginner level
2. **Data Science & Machine Learning** - Intermediate level  
3. **Mobile App Development with React Native** - Intermediate level
4. **UI/UX Design Masterclass** - Beginner level
5. **DevOps and Cloud Computing with AWS** - Advanced level

Each course includes:
- Complete course information (title, description, pricing, etc.)
- Course sections with lessons
- Learning resources (PDFs, links, etc.)
- Student reviews and ratings
- Instructor assignments
- Student enrollments with progress tracking

## Step 4: Verify Setup

1. **Start your backend server**:
   ```bash
   npm run dev
   ```

2. **Test the API endpoints**:
   - Get all courses: `GET http://localhost:5000/api/courses`
   - Get course by ID: `GET http://localhost:5000/api/courses/{course_id}`
   - User login: `POST http://localhost:5000/api/auth/login`

3. **Test with sample credentials**:
   ```json
   {
     "email": "sarah.johnson@learningsphere.com",
     "password": "instructor123"
   }
   ```

## Database Collections Structure

### Users Collection
- Personal information (name, email, role)
- Profile data (bio, skills, interests)
- Enrolled courses with progress tracking
- Social links and achievements

### Courses Collection  
- Course metadata (title, description, pricing)
- Instructor information
- Course content (sections, lessons, resources)
- Reviews and ratings
- Enrolled students list
- Learning outcomes and prerequisites

### ResourceDownloads Collection
- Download tracking for course resources
- User and course association
- Timestamp and metadata

## API Endpoints Available

### Public Endpoints:
- `GET /api/courses` - Get all published courses
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Protected Endpoints:
- `POST /api/courses` - Create course (Instructors only)
- `PUT /api/courses/:id` - Update course (Instructor/Admin only)
- `DELETE /api/courses/:id` - Delete course (Instructor/Admin only)
- `POST /api/courses/:id/enroll` - Enroll in course (Students)
- `GET /api/courses/:id` - Get course details (Authenticated users)

## Troubleshooting

### Connection Issues:
1. Verify your MongoDB Atlas connection string is correct
2. Check that your IP address is whitelisted in MongoDB Atlas
3. Ensure your cluster is active and accessible

### Seeding Issues:
1. Make sure your `.env` file is properly configured
2. Check that all required npm packages are installed
3. Verify MongoDB Atlas permissions allow read/write operations

### Authentication Issues:
1. Ensure JWT_SECRET is set in your environment variables
2. Use the exact email and password combinations provided above
3. Check that the authentication middleware is properly configured

## Next Steps

After successful setup:

1. **Update Frontend Configuration**: Make sure your frontend API configuration points to `http://localhost:5000`

2. **Test Course Functionality**: Try enrolling in courses, viewing course content, and tracking progress

3. **Explore Admin Features**: Login as admin to access administrative functions

4. **Customize Data**: Modify the seeder script in `src/seeders/databaseSeeder.js` to add your own sample data

## Support

If you encounter any issues:
1. Check the console output for error messages
2. Verify all environment variables are correctly set
3. Ensure your MongoDB Atlas cluster is properly configured
4. Review the API endpoints and test with tools like Postman or Thunder Client

The database is now ready for development and testing!
