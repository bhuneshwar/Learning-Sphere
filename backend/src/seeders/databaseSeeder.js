const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const Course = require('../models/courseModel');
const ResourceDownload = require('../models/ResourceDownload');

// Load environment variables
dotenv.config();

// Sample data
const sampleUsers = [
  // Instructors
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@learningsphere.com',
    password: 'instructor123',
    role: 'Instructor',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Full-stack developer with 8+ years of experience building scalable web applications. Expert in JavaScript, React, Node.js, and modern web technologies.',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML/CSS', 'Express.js', 'Git'],
    interests: ['Web Development', 'Teaching', 'Open Source'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      github: 'https://github.com/sarahjohnson',
      website: 'https://sarahjohnson.dev'
    },
    isVerified: true,
    profileCompleteness: 95
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@learningsphere.com',
    password: 'instructor123',
    role: 'Instructor',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Data Scientist and ML Engineer with PhD in Computer Science. Specialized in machine learning, deep learning, and AI applications in business.',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Statistics'],
    interests: ['Machine Learning', 'AI Research', 'Data Science'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/michaelchen',
      github: 'https://github.com/michaelchen'
    },
    isVerified: true,
    profileCompleteness: 90
  },
  {
    firstName: 'Alex',
    lastName: 'Rodriguez',
    email: 'alex.rodriguez@learningsphere.com',
    password: 'instructor123',
    role: 'Instructor',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Mobile app developer with expertise in React Native, Flutter, and native iOS/Android development. Published 20+ apps on app stores.',
    skills: ['React Native', 'Flutter', 'iOS Development', 'Android Development', 'JavaScript', 'Dart', 'Swift'],
    interests: ['Mobile Development', 'User Experience', 'Startup Culture'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexrodriguez',
      github: 'https://github.com/alexrodriguez'
    },
    isVerified: true,
    profileCompleteness: 88
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@learningsphere.com',
    password: 'instructor123',
    role: 'Instructor',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'UX/UI Designer and Design Systems expert with 6+ years of experience creating beautiful, user-centered digital experiences.',
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Design Systems', 'Prototyping', 'User Research'],
    interests: ['User Experience', 'Design Thinking', 'Digital Art'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emilydavis',
      website: 'https://emilydavis.design'
    },
    isVerified: true,
    profileCompleteness: 92
  },
  {
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@learningsphere.com',
    password: 'instructor123',
    role: 'Instructor',
    profilePicture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'DevOps Engineer and Cloud Architect specializing in AWS, Docker, Kubernetes, and CI/CD pipelines.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux', 'Python'],
    interests: ['Cloud Computing', 'DevOps', 'Infrastructure'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidwilson',
      github: 'https://github.com/davidwilson'
    },
    isVerified: true,
    profileCompleteness: 87
  },

  // Students
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    password: 'student123',
    role: 'Learner',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Aspiring web developer looking to transition into tech from finance background.',
    skills: ['HTML', 'CSS', 'Basic JavaScript'],
    interests: ['Web Development', 'Finance Technology', 'Entrepreneurship'],
    isVerified: true,
    profileCompleteness: 65
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    password: 'student123',
    role: 'Learner',
    profilePicture: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Marketing professional interested in data science and analytics.',
    skills: ['Excel', 'Basic Python', 'Digital Marketing'],
    interests: ['Data Science', 'Machine Learning', 'Marketing Analytics'],
    isVerified: true,
    profileCompleteness: 70
  },
  {
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@email.com',
    password: 'student123',
    role: 'Learner',
    profilePicture: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Computer science student looking to enhance practical skills.',
    skills: ['Java', 'C++', 'Data Structures', 'Algorithms'],
    interests: ['Software Engineering', 'Mobile Development', 'Gaming'],
    isVerified: true,
    profileCompleteness: 60
  },

  // Admin
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@learningsphere.com',
    password: 'admin123',
    role: 'Admin',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Platform administrator managing Learning Sphere operations.',
    skills: ['Platform Management', 'User Support', 'Analytics'],
    interests: ['Education Technology', 'Platform Operations'],
    isVerified: true,
    profileCompleteness: 100
  }
];

const sampleCourses = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive bootcamp. Build real-world projects and deploy them to production. Learn modern development practices, responsive design, and full-stack development.',
    shortDescription: 'Master HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive bootcamp.',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    price: 2499,
    isPublished: true,
    category: 'Web Development',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Full Stack'],
    level: 'Beginner',
    prerequisites: ['Basic computer skills', 'Interest in web development'],
    learningOutcomes: [
      'Build responsive websites with HTML, CSS, and JavaScript',
      'Create interactive web applications with React',
      'Develop backend APIs with Node.js and Express',
      'Work with databases using MongoDB',
      'Deploy applications to production',
      'Understand modern development workflows'
    ],
    sections: [
      {
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of web development',
        order: 1,
        lessons: [
          {
            title: 'Introduction to HTML',
            description: 'Learn HTML basics and semantic markup',
            content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages...',
            contentType: 'video',
            videoUrl: 'https://res.cloudinary.com/learning-sphere/video/upload/v1640995200/learning-sphere/course-videos/html_intro_sample.mp4',
            videoPublicId: 'learning-sphere/course-videos/html_intro_sample',
            videoStreamingUrls: {
              auto: 'https://res.cloudinary.com/learning-sphere/video/upload/q_auto/learning-sphere/course-videos/html_intro_sample.mp4',
              hd: 'https://res.cloudinary.com/learning-sphere/video/upload/q_80,w_1920,h_1080,c_limit/learning-sphere/course-videos/html_intro_sample.mp4',
              sd: 'https://res.cloudinary.com/learning-sphere/video/upload/q_60,w_1280,h_720,c_limit/learning-sphere/course-videos/html_intro_sample.mp4',
              mobile: 'https://res.cloudinary.com/learning-sphere/video/upload/q_40,w_640,h_360,c_limit/learning-sphere/course-videos/html_intro_sample.mp4'
            },
            videoDuration: 2700, // 45 minutes in seconds
            videoThumbnailUrl: 'https://res.cloudinary.com/learning-sphere/video/upload/so_5.0/learning-sphere/course-videos/html_intro_sample.jpg',
            duration: 45,
            order: 1,
            isPublished: true,
            resources: [
              {
                title: 'HTML Cheat Sheet',
                type: 'pdf',
                url: 'https://htmlcheatsheet.com/css/', // CSS Reference Guide
                description: 'Quick reference for HTML tags',
                tags: ['reference', 'html'],
                isPublic: true
              }
            ]
          },
          {
            title: 'CSS Styling and Layout',
            description: 'Master CSS for beautiful and responsive designs',
            content: 'CSS (Cascading Style Sheets) is used to describe the presentation of HTML documents...',
            contentType: 'video',
            videoUrl: 'https://res.cloudinary.com/learning-sphere/video/upload/v1640995200/learning-sphere/course-videos/css_styling_sample.mp4',
            videoPublicId: 'learning-sphere/course-videos/css_styling_sample',
            videoStreamingUrls: {
              auto: 'https://res.cloudinary.com/learning-sphere/video/upload/q_auto/learning-sphere/course-videos/css_styling_sample.mp4',
              hd: 'https://res.cloudinary.com/learning-sphere/video/upload/q_80,w_1920,h_1080,c_limit/learning-sphere/course-videos/css_styling_sample.mp4',
              sd: 'https://res.cloudinary.com/learning-sphere/video/upload/q_60,w_1280,h_720,c_limit/learning-sphere/course-videos/css_styling_sample.mp4',
              mobile: 'https://res.cloudinary.com/learning-sphere/video/upload/q_40,w_640,h_360,c_limit/learning-sphere/course-videos/css_styling_sample.mp4'
            },
            videoDuration: 3600, // 60 minutes in seconds
            videoThumbnailUrl: 'https://res.cloudinary.com/learning-sphere/video/upload/so_5.0/learning-sphere/course-videos/css_styling_sample.jpg',
            duration: 60,
            order: 2,
            isPublished: true
          }
        ]
      },
      {
        title: 'JavaScript Programming',
        description: 'Learn JavaScript from basics to advanced concepts',
        order: 2,
        lessons: [
          {
            title: 'JavaScript Basics',
            description: 'Variables, data types, and basic operations',
            content: 'JavaScript is a programming language that enables interactive web pages...',
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg', // JavaScript Tutorial for Beginners
            duration: 75,
            order: 1,
            isPublished: true
          }
        ]
      }
    ],
    courseResources: [
      {
        title: 'Course Syllabus',
        description: 'Complete course outline and schedule',
        type: 'pdf',
        url: 'https://www.w3schools.com/html/html_intro.asp', // HTML Introduction Guide
        tags: ['syllabus', 'schedule'],
        isPublic: true
      }
    ],
    ratings: {
      average: 4.9,
      count: 1542
    }
  },
  {
    title: 'Data Science & Machine Learning',
    description: 'Learn Python, pandas, scikit-learn, and build real-world ML projects from scratch. Master data analysis, visualization, and machine learning algorithms. Work with real datasets and deploy ML models.',
    shortDescription: 'Learn Python, pandas, scikit-learn, and build real-world ML projects from scratch.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: 7999,
    isPublished: true,
    category: 'Data Science',
    tags: ['Python', 'Machine Learning', 'Data Analysis', 'Pandas', 'Scikit-learn'],
    level: 'Intermediate',
    prerequisites: ['Basic programming knowledge', 'High school mathematics'],
    learningOutcomes: [
      'Analyze data using Python and pandas',
      'Create data visualizations with matplotlib and seaborn',
      'Build machine learning models with scikit-learn',
      'Understand supervised and unsupervised learning',
      'Deploy ML models to production',
      'Work with real-world datasets'
    ],
    sections: [
      {
        title: 'Python for Data Science',
        description: 'Learn Python libraries essential for data science',
        order: 1,
        lessons: [
          {
            title: 'Introduction to NumPy',
            description: 'Working with arrays and numerical computations',
            content: 'NumPy is the fundamental package for scientific computing with Python...',
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/embed/_UBogxHjL5c', // NumPy Tutorial for Beginners
            duration: 50,
            order: 1,
            isPublished: true
          }
        ]
      }
    ],
    ratings: {
      average: 4.8,
      count: 1235
    }
  },
  {
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile apps for iOS and Android using React Native and Expo. Learn navigation, state management, API integration, and app store deployment.',
    shortDescription: 'Build cross-platform mobile apps for iOS and Android using React Native and Expo.',
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: 5999,
    isPublished: true,
    category: 'Mobile Development',
    tags: ['React Native', 'Mobile Development', 'iOS', 'Android', 'Expo'],
    level: 'Intermediate',
    prerequisites: ['Basic JavaScript knowledge', 'React fundamentals'],
    learningOutcomes: [
      'Build native mobile apps with React Native',
      'Handle navigation and routing in mobile apps',
      'Integrate with APIs and manage state',
      'Use native device features like camera and GPS',
      'Deploy apps to iOS and Android app stores',
      'Optimize app performance and user experience'
    ],
    sections: [
      {
        title: 'React Native Fundamentals',
        description: 'Get started with React Native development',
        order: 1,
        lessons: [
          {
            title: 'Setting up React Native Environment',
            description: 'Install and configure development environment',
            content: 'React Native allows you to build mobile apps using JavaScript and React...',
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/embed/0-S5a0eXPoc', // React Native Tutorial
            duration: 40,
            order: 1,
            isPublished: true
          }
        ]
      }
    ],
    ratings: {
      average: 4.7,
      count: 892
    }
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'Learn user experience design principles, user research methods, wireframing, prototyping, and design systems. Master industry-standard tools like Figma and Adobe XD.',
    shortDescription: 'Learn user experience design principles, user research, wireframing, and prototyping.',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    price: 4999,
    isPublished: true,
    category: 'Design',
    tags: ['UI Design', 'UX Design', 'Figma', 'Prototyping', 'User Research'],
    level: 'Beginner',
    prerequisites: ['Basic computer skills', 'Interest in design'],
    learningOutcomes: [
      'Understand UX design principles and methodologies',
      'Conduct user research and create user personas',
      'Create wireframes and prototypes',
      'Design beautiful and functional user interfaces',
      'Build design systems and style guides',
      'Use professional design tools effectively'
    ],
    sections: [
      {
        title: 'UX Design Fundamentals',
        description: 'Learn the principles of user experience design',
        order: 1,
        lessons: [
          {
            title: 'Introduction to UX Design',
            description: 'Understanding user-centered design principles',
            content: 'User Experience (UX) design is the process of creating products that provide meaningful experiences...',
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/embed/Ovj4hFxko7c', // UX Design Tutorial
            duration: 55,
            order: 1,
            isPublished: true
          }
        ]
      }
    ],
    ratings: {
      average: 4.6,
      count: 756
    }
  },
  {
    title: 'DevOps and Cloud Computing with AWS',
    description: 'Master DevOps practices and AWS cloud services. Learn Docker, Kubernetes, CI/CD pipelines, infrastructure as code, and cloud deployment strategies.',
    shortDescription: 'Master DevOps practices and AWS cloud services including Docker, Kubernetes, and CI/CD.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    price: 9999,
    isPublished: true,
    category: 'DevOps',
    tags: ['AWS', 'Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'Cloud Computing'],
    level: 'Advanced',
    prerequisites: ['Linux command line knowledge', 'Basic networking concepts', 'Programming experience'],
    learningOutcomes: [
      'Deploy applications using Docker and Kubernetes',
      'Set up CI/CD pipelines with Jenkins and GitLab',
      'Manage AWS cloud infrastructure',
      'Implement infrastructure as code with Terraform',
      'Monitor and optimize system performance',
      'Ensure security and compliance in DevOps workflows'
    ],
    sections: [
      {
        title: 'Introduction to DevOps',
        description: 'Understanding DevOps culture and practices',
        order: 1,
        lessons: [
          {
            title: 'DevOps Fundamentals',
            description: 'Learn the core principles of DevOps',
            content: 'DevOps is a set of practices that combines software development and IT operations...',
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/embed/kBp6InwlFKE', // DevOps Tutorial
            duration: 45,
            order: 1,
            isPublished: true
          }
        ]
      }
    ],
    ratings: {
      average: 4.8,
      count: 634
    }
  }
];

// Database seeding function
const seedDatabase = async () => {
  try {
    console.log('🔄 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await ResourceDownload.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      const user = new User(userData);
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`✅ Created user: ${userData.firstName} ${userData.lastName} (${userData.role})`);
    }

    // Find instructors for course assignment
    const instructors = createdUsers.filter(user => user.role === 'Instructor');
    const students = createdUsers.filter(user => user.role === 'Learner');

    // Create courses with instructor assignments
    console.log('📚 Creating courses...');
    const createdCourses = [];
    
    for (let i = 0; i < sampleCourses.length; i++) {
      const courseData = sampleCourses[i];
      courseData.instructor = instructors[i % instructors.length]._id;
      
      // Add some reviews to courses
      const numReviews = Math.floor(Math.random() * 5) + 3; // 3-7 reviews per course
      courseData.reviews = [];
      
      for (let j = 0; j < numReviews; j++) {
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        const rating = Math.floor(Math.random() * 2) + 4; // 4-5 star ratings
        courseData.reviews.push({
          user: randomStudent._id,
          rating: rating,
          comment: getRandomReviewComment(rating),
          date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Random date within last 90 days
        });
      }
      
      // Recalculate average rating
      const totalRating = courseData.reviews.reduce((sum, review) => sum + review.rating, 0);
      courseData.ratings.average = Math.round((totalRating / courseData.reviews.length) * 10) / 10;
      courseData.ratings.count = courseData.reviews.length;
      
      // Add some students as learners
      const numLearners = Math.floor(Math.random() * 200) + 50; // 50-250 learners per course
      const selectedStudents = [];
      for (let k = 0; k < Math.min(numLearners, students.length); k++) {
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        if (!selectedStudents.includes(randomStudent._id)) {
          selectedStudents.push(randomStudent._id);
        }
      }
      courseData.learners = selectedStudents;
      
      const course = new Course(courseData);
      const savedCourse = await course.save();
      createdCourses.push(savedCourse);
      
      console.log(`✅ Created course: ${courseData.title}`);
    }

    // Enroll students in courses (update user enrollments)
    console.log('🎓 Creating course enrollments...');
    for (const student of students) {
      const numEnrollments = Math.floor(Math.random() * 3) + 1; // 1-3 courses per student
      const enrolledCourses = [];
      
      for (let i = 0; i < numEnrollments; i++) {
        const randomCourse = createdCourses[Math.floor(Math.random() * createdCourses.length)];
        
        if (!enrolledCourses.find(e => e.course.toString() === randomCourse._id.toString())) {
          enrolledCourses.push({
            course: randomCourse._id,
            enrollmentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
            progress: Math.floor(Math.random() * 100), // Random progress 0-99%
            completed: Math.random() > 0.7, // 30% chance of completion
            lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last 7 days
          });
        }
      }
      
      student.enrolledCourses = enrolledCourses;
      await student.save();
    }

    // Create some sample resource downloads
    console.log('📥 Creating resource download records...');
    for (let i = 0; i < 50; i++) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const randomCourse = createdCourses[Math.floor(Math.random() * createdCourses.length)];
      
      if (randomCourse.sections && randomCourse.sections.length > 0) {
        const randomSection = randomCourse.sections[Math.floor(Math.random() * randomCourse.sections.length)];
        if (randomSection.lessons && randomSection.lessons.length > 0) {
          const randomLesson = randomSection.lessons[Math.floor(Math.random() * randomSection.lessons.length)];
          
          if (randomLesson.resources && randomLesson.resources.length > 0) {
            const randomResource = randomLesson.resources[Math.floor(Math.random() * randomLesson.resources.length)];
            
            const resourceDownload = new ResourceDownload({
              user: randomStudent._id,
              resource: {
                resourceId: randomResource._id,
                title: randomResource.title,
                type: randomResource.type
              },
              course: randomCourse._id,
              section: randomSection._id,
              lesson: randomLesson._id,
              resourceType: 'lesson',
              downloadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
              ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            });
            
            await resourceDownload.save();
          }
        }
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${createdUsers.length} users`);
    console.log(`📚 Created ${createdCourses.length} courses`);
    console.log(`🎓 Set up course enrollments for students`);
    console.log(`📥 Created sample resource download records`);
    
    console.log('\n👥 User Accounts Created:');
    console.log('📧 Instructors:');
    instructors.forEach(instructor => {
      console.log(`   - ${instructor.email} (password: instructor123)`);
    });
    console.log('📧 Students:');
    students.forEach(student => {
      console.log(`   - ${student.email} (password: student123)`);
    });
    console.log('📧 Admin:');
    console.log(`   - admin@learningsphere.com (password: admin123)`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Helper function to generate random review comments
function getRandomReviewComment(rating) {
  const comments = {
    5: [
      "Excellent course! The instructor explained everything clearly and the projects were very practical.",
      "One of the best courses I've taken. Highly recommended!",
      "Amazing content and great teaching style. I learned so much!",
      "Perfect for beginners and intermediate learners. Worth every penny!",
      "Outstanding course with real-world examples and hands-on projects."
    ],
    4: [
      "Great course overall. Could use a few more advanced examples.",
      "Good content and well-structured. Enjoyed the learning experience.",
      "Solid course with practical knowledge. Instructor is knowledgeable.",
      "Very informative and well-paced. Recommended for those starting out.",
      "Good value for money. Covers all the essential topics."
    ]
  };
  
  const ratingComments = comments[rating] || comments[4];
  return ratingComments[Math.floor(Math.random() * ratingComments.length)];
}

// Export the seeder function
module.exports = { seedDatabase };

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}
