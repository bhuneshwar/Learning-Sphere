const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Configuration
const AI_CONFIG = {
  model: 'gpt-3.5-turbo',
  maxTokens: 1000,
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
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not found in environment variables. AI features will be disabled.');
    return false;
  }
  
  console.log('✅ AI configuration validated successfully');
  return true;
};

// Test OpenAI connection
const testAIConnection = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 10
    });
    
    console.log('✅ OpenAI connection test successful');
    return true;
  } catch (error) {
    console.error('❌ OpenAI connection test failed:', error.message);
    return false;
  }
};

module.exports = {
  openai,
  AI_CONFIG,
  validateAIConfig,
  testAIConnection
};
