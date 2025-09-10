const axios = require('axios');

// OpenRouter configuration
const OPENROUTER_CONFIG = {
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'deepseek/deepseek-chat'
};

// AI Configuration
const AI_CONFIG = {
  model: 'deepseek/deepseek-chat', // DeepSeek V3 model
  maxTokens: 2000,
  temperature: 0.7,
  maxChatHistory: 10, // Keep last 10 messages for context
  
  // System prompts for different contexts
  systemPrompts: {
    courseAssistant: (courseData) => `You are an AI learning assistant for the course "${courseData.title}".

Course Description: ${courseData.description || 'No description provided'}

Learning Objectives: ${courseData.learningOutcomes ? courseData.learningOutcomes.join(', ') : 'Not specified'}

Prerequisites: ${courseData.prerequisites ? courseData.prerequisites.join(', ') : 'None specified'}

Your role:
- Help students understand course concepts
- Answer questions about course content
- Provide study guidance and tips
- Clarify difficult topics
- Suggest additional resources when helpful
- Be encouraging and supportive

Guidelines:
- Keep responses concise but helpful
- If you don't know something specific about the course, be honest
- Ask clarifying questions when needed
- Provide practical examples when possible
- Stay focused on educational content`,

    generalAssistant: `You are an AI learning assistant for an online learning platform called "Learning Sphere".

Your role:
- Help students with general learning questions
- Provide study tips and learning strategies
- Assist with course selection guidance
- Answer questions about the platform
- Be supportive and encouraging

Guidelines:
- Keep responses helpful and educational
- Be concise but thorough
- Ask clarifying questions when needed
- Provide practical advice
- Stay professional and friendly`
  }
};

// Validate AI configuration
const validateAIConfig = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn('⚠️  OPENROUTER_API_KEY not found in environment variables. AI features will be disabled.');
    return false;
  }
  
  console.log('✅ AI configuration validated successfully');
  return true;
};

// Test OpenRouter connection
const testAIConnection = async () => {
  try {
    const response = await axios.post(
      `${OPENROUTER_CONFIG.baseURL}/chat/completions`,
      {
        model: OPENROUTER_CONFIG.model,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000', // Optional: for tracking
          'X-Title': 'Learning Sphere AI Assistant' // Optional: for tracking
        }
      }
    );
    
    console.log('✅ OpenRouter connection test successful');
    return true;
  } catch (error) {
    console.error('❌ OpenRouter connection test failed:', error.message);
    return false;
  }
};

module.exports = {
  OPENROUTER_CONFIG,
  AI_CONFIG,
  validateAIConfig,
  testAIConnection
};
