import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, LinearProgress, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, showProgress = false }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {course.coverImage && (
        <CardMedia
          component="img"
          height="140"
          image={course.coverImage}
          alt={course.title}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {course.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {course.shortDescription || course.description.substring(0, 100) + '...'}
        </Typography>
        
        {showProgress && course.progress && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Progress: {Math.round(course.progress)}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={course.progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}
      </CardContent>
      
      <Box sx={{ p: 2 }}>
        <Button 
          component={Link} 
          to={`/courses/${course._id}`} 
          variant="contained" 
          fullWidth
        >
          {course.progress > 0 ? 'Continue' : 'Start Learning'}
        </Button>
      </Box>
    </Card>
  );
};

export default CourseCard;