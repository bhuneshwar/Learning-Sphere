# AI Learning Assistant Setup Guide

## Overview
This guide will help you set up and test the AI Learning Assistant feature in your Learning Sphere application. The AI assistant provides contextual help to students, course-specific Q&A, and personalized learning guidance.

## Prerequisites
- OpenAI API account and API key
- Learning Sphere application with course creation and file upload features already working

## Setup Steps

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 2. Configure Environment Variables
Add your OpenAI API key to the backend environment file:

```bash
# In backend/.env file
OPENAI_API_KEY=your_openai_api_key_here
```

**Important**: Never commit your API key to version control!

### 3. Verify Installation
The AI feature has been automatically installed with these components:

#### Backend Components:
- ✅ OpenAI SDK installed
- ✅ AI configuration (`src/config/ai.js`)
- ✅ AI service layer (`src/services/aiService.js`)
- ✅ AI database models (`src/models/aiChatModel.js`)
- ✅ AI controller (`src/controllers/aiController.js`)
- ✅ AI routes (`src/routes/aiRoutes.js`)
- ✅ Rate limiting middleware
- ✅ Routes integrated into main app

#### Frontend Components:
- ✅ AI service API (`src/services/aiService.js`)
- ✅ AI Assistant component (`src/components/ai/AIAssistant.js`)
- ✅ AI Assistant styles (`src/components/ai/AIAssistant.css`)
- ✅ Integration with CourseDetailPage

## Testing the AI Assistant

### 1. Start Your Services
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### 2. Test AI Service Status
1. Open browser Developer Tools → Network tab
2. Navigate to any course detail page
3. Look for API call to `/api/ai/status`
4. Should return: `{ "success": true, "data": { "enabled": true, "message": "AI service is operational" } }`

### 3. Test AI Assistant UI
1. **Navigate to a course page** (e.g., `/courses/:courseId`)
2. **Login as any user** (AI assistant only shows for authenticated users)
3. **Look for the AI Assistant button** (🤖) in bottom-right corner
4. **Click to open** the chat interface

### 4. Test AI Chat Functionality

#### Basic Chat Test:
1. Open AI Assistant
2. Type: "Hello"
3. Should receive a welcome message from the AI
4. Try asking: "What is this course about?"

#### Course-Specific Test:
1. On a course page, ask: "What will I learn in this course?"
2. AI should provide context-specific answers based on course data
3. Try suggested questions if they appear

#### Expected Features:
- ✅ Chat interface opens/closes
- ✅ Messages are sent and received
- ✅ Typing indicators appear
- ✅ Suggested questions for courses
- ✅ Context-aware responses
- ✅ Chat history persistence
- ✅ Error handling for API issues

## API Endpoints Available

### Chat Management
- `POST /api/ai/sessions` - Create new chat session
- `GET /api/ai/sessions` - Get user's chat sessions
- `GET /api/ai/sessions/:sessionId` - Get specific chat session
- `POST /api/ai/sessions/:sessionId/messages` - Send message
- `DELETE /api/ai/sessions/:sessionId` - Delete chat session

### AI Features
- `GET /api/ai/courses/:courseId/summary` - Generate course summary
- `GET /api/ai/courses/:courseId/questions` - Generate suggested questions
- `GET /api/ai/analytics` - Get user analytics
- `GET /api/ai/status` - Check AI service status

### Admin Endpoints
- `GET /api/ai/admin/stats` - Get AI service statistics (Admin only)

## Troubleshooting

### Issue: AI Assistant Shows "Currently Unavailable"
**Solution**: 
1. Check if `OPENAI_API_KEY` is set in backend `.env`
2. Restart backend server after adding the key
3. Check backend logs for OpenAI connection errors

### Issue: "Failed to create chat session"
**Possible Causes**:
1. Invalid OpenAI API key
2. OpenAI API quota exceeded
3. Network connectivity issues
4. Database connection issues

**Solution**:
1. Verify API key is correct
2. Check OpenAI account billing/usage
3. Check backend logs for detailed error messages

### Issue: Messages not sending
**Check**:
1. Network tab for failed API requests
2. Rate limiting (50 messages per 15 minutes)
3. Message length (max 2000 characters)
4. Authentication token validity

### Issue: Poor AI responses
**Solutions**:
1. Ensure course has good descriptions and learning objectives
2. Check if course data is being fetched correctly
3. AI responses depend on course content quality

## Rate Limits
- **AI Messages**: 50 per 15 minutes per user
- **General AI APIs**: 100 per 15 minutes per user
- **These limits prevent abuse and control costs**

## Cost Management
- **Model**: GPT-3.5-turbo (cost-effective)
- **Estimated cost**: ~$0.01-0.02 per conversation
- **100 students, 50 questions each**: ~$30-50/month
- **Rate limits help control costs**

## Security Features
- ✅ Authentication required for all AI endpoints
- ✅ Rate limiting to prevent abuse
- ✅ Input validation and sanitization
- ✅ Session-based chat isolation
- ✅ User data privacy protection

## Advanced Configuration

### Customizing AI Behavior
Edit `backend/src/config/ai.js` to adjust:
- Model parameters (temperature, max tokens)
- System prompts for different contexts
- Rate limits and message history

### Adding AI to More Pages
To add AI Assistant to other pages:

```javascript
// In any React component
import AIAssistant from '../components/ai/AIAssistant';

// In JSX (at end of component)
{isAuthenticated && (
  <AIAssistant 
    courseId={courseId} // Optional: for course-specific context
    isOpen={false}      // Optional: initial state
  />
)}
```

## Monitoring and Analytics

### Database Collections
- `aichatsessions` - Stores chat conversations
- `aianalytics` - Tracks usage patterns and insights

### Usage Statistics
Access via admin account:
```
GET /api/ai/admin/stats
```

Returns:
- Total active chat sessions
- Total messages sent
- Daily active users
- Service status

## Future Enhancements

Potential improvements you can add:
1. **Voice Chat**: Add speech-to-text and text-to-speech
2. **File Analysis**: Let AI analyze uploaded course resources
3. **Progress Tracking**: AI-driven learning recommendations
4. **Multi-language**: Support for different languages
5. **Advanced Analytics**: Learning pattern analysis
6. **Integration**: Connect with other learning tools

## Support

If you encounter any issues:
1. Check backend logs for error details
2. Verify all environment variables are set
3. Test OpenAI API key separately
4. Check database connection
5. Ensure all dependencies are installed

The AI Learning Assistant is now ready to help your students learn more effectively!

## Cost Optimization Tips

1. **Monitor Usage**: Regularly check OpenAI usage dashboard
2. **Set Budgets**: Configure spending limits in OpenAI account  
3. **Optimize Prompts**: Shorter, focused prompts reduce costs
4. **Cache Responses**: Consider caching common questions (future enhancement)
5. **User Limits**: Adjust rate limits based on your budget

## Testing Checklist

Before going live, ensure:
- [ ] AI assistant appears on course pages
- [ ] Chat interface opens/closes properly
- [ ] Messages send and receive correctly  
- [ ] Course-specific context works
- [ ] Error handling works (test with invalid API key)
- [ ] Rate limiting functions properly
- [ ] Mobile responsive design works
- [ ] Analytics tracking functions
- [ ] User authentication is enforced
- [ ] Database stores chat sessions correctly

Your AI Learning Assistant is now fully integrated and ready to enhance your students' learning experience!
