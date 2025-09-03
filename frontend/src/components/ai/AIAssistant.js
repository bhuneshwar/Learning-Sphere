import React, { useState, useEffect, useRef } from 'react';
import aiService from '../../services/aiService';
import './AIAssistant.css';

const AIAssistant = ({ courseId = null, isOpen = false, onToggle }) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [aiServiceStatus, setAiServiceStatus] = useState({ enabled: false });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  // Check AI service status on component mount
  useEffect(() => {
    checkAIServiceStatus();
  }, []);

  // Initialize chat session when component becomes visible
  useEffect(() => {
    if (isVisible && !currentSession) {
      initializeChat();
    }
  }, [isVisible, courseId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load suggested questions for course
  useEffect(() => {
    if (courseId && aiServiceStatus.enabled) {
      loadSuggestedQuestions();
    }
  }, [courseId, aiServiceStatus.enabled]);

  const checkAIServiceStatus = async () => {
    try {
      const response = await aiService.getAIServiceStatus();
      setAiServiceStatus(response.data);
    } catch (error) {
      console.error('Failed to check AI service status:', error);
      setAiServiceStatus({ enabled: false, message: 'AI service unavailable' });
    }
  };

  const initializeChat = async () => {
    if (!aiServiceStatus.enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await aiService.createChatSession(courseId);
      setCurrentSession(response.data);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setError(error.message || 'Failed to start AI assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestedQuestions = async () => {
    try {
      const response = await aiService.generateSuggestedQuestions(courseId, 3);
      setSuggestedQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Failed to load suggested questions:', error);
      setSuggestedQuestions([]);
    }
  };

  const sendMessage = async (messageText = inputMessage.trim()) => {
    if (!messageText || !currentSession || isTyping) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await aiService.sendMessage(currentSession.sessionId, messageText);
      
      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError(error.message || 'Failed to send message');
      
      // Add error message
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    if (onToggle) onToggle(newVisibility);
    
    if (newVisibility && !currentSession && aiServiceStatus.enabled) {
      initializeChat();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const retryConnection = () => {
    setError(null);
    initializeChat();
  };

  // If AI service is not enabled, show toggle button with disabled state
  if (!aiServiceStatus.enabled) {
    return (
      <div className="ai-assistant-toggle" title="AI Assistant (Currently Unavailable)">
        <span>🤖</span>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '0',
          background: '#f8d7da',
          color: '#721c24',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          display: isVisible ? 'block' : 'none'
        }}>
          AI Assistant Unavailable
        </div>
      </div>
    );
  }

  // Show toggle button when assistant is hidden
  if (!isVisible) {
    return (
      <button 
        className="ai-assistant-toggle"
        onClick={toggleVisibility}
        title="Open AI Assistant"
        aria-label="Open AI Learning Assistant"
      >
        <span>🤖</span>
      </button>
    );
  }

  return (
    <div className={`ai-assistant ${isMinimized ? 'minimized' : ''}`}>
      {/* Chat Header */}
      <div className="chat-header" onClick={isMinimized ? toggleMinimize : undefined}>
        <h3>
          🤖 AI Learning Assistant
          {courseId && <small> - Course Help</small>}
        </h3>
        <div className="chat-header-actions">
          <button 
            className="header-btn"
            onClick={toggleMinimize}
            title={isMinimized ? "Expand" : "Minimize"}
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
          >
            <i className={`fas ${isMinimized ? 'fa-window-maximize' : 'fa-window-minimize'}`}></i>
          </button>
          <button 
            className="header-btn"
            onClick={toggleVisibility}
            title="Close"
            aria-label="Close AI assistant"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Suggested Questions */}
      {!isMinimized && suggestedQuestions.length > 0 && messages.length <= 1 && (
        <div className="suggested-questions">
          <h4>Suggested questions:</h4>
          <div className="question-chips">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                className="question-chip"
                onClick={() => handleSuggestedQuestion(question)}
                title={question}
              >
                {question.length > 30 ? `${question.substring(0, 30)}...` : question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Content */}
      <div className="chat-content">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span style={{ marginLeft: '10px' }}>Initializing AI assistant...</span>
          </div>
        ) : error ? (
          <div className="error-message">
            <strong>Connection Error</strong>
            <p>{error}</p>
            <button className="retry-button" onClick={retryConnection}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message-bubble ${message.role}`}>
                <div className={`message-avatar ${message.role}`}>
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <p className="message-text">{message.content}</p>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="message-bubble assistant">
                <div className="message-avatar assistant">🤖</div>
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      {!isMinimized && currentSession && (
        <div className="chat-input">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              className="message-input"
              placeholder="Ask me anything about the course..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping || isLoading}
              rows={1}
              style={{
                resize: 'none',
                height: 'auto',
                minHeight: '20px',
                maxHeight: '100px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
              }}
            />
            <button
              className="send-button"
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isTyping || isLoading}
              title="Send message"
              aria-label="Send message"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
