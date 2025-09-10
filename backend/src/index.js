const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const resourceDownloadRoutes = require('./routes/resourceDownloadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const instructorApplicationRoutes = require('./routes/instructorApplicationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('./middlewares/errorHandler');
const protectedRoutes = require('./routes/protectedRoutes');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Enable CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // Allow cookies and credentials
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/resource-downloads', resourceDownloadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/instructor-applications', instructorApplicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/protected', protectedRoutes);
app.use(errorHandler);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1); // Exit process if DB connection fails
    });

// Example Route
app.get('/', (req, res) => {
    res.send('LearningSphere Backend is running!');
});

// Error handling for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
