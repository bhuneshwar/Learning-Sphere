const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const errorHandler = require('./middlewares/errorHandler');
const protectedRoutes = require('./routes/protectedRoutes');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies and credentials
}));

// Middleware to parse JSON
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
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
