// Form validation utilities

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// Required field validation
export const isRequired = (value) => {
  return value && value.toString().trim() !== '';
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Number validation
export const isValidNumber = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

// Generic form validation function
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    // Check required validation
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = fieldRules.messages?.required || `${field} is required`;
      return; // Skip other validations if required fails
    }
    
    // Skip other validations if field is empty and not required
    if (!value) return;
    
    // Email validation
    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = fieldRules.messages?.email || 'Please enter a valid email address';
    }
    
    // Password validation
    if (fieldRules.password && !isValidPassword(value)) {
      errors[field] = fieldRules.messages?.password || 'Password must be at least 6 characters long';
    }
    
    // URL validation
    if (fieldRules.url && !isValidUrl(value)) {
      errors[field] = fieldRules.messages?.url || 'Please enter a valid URL';
    }
    
    // Number validation
    if (fieldRules.number) {
      if (!isValidNumber(value, fieldRules.min, fieldRules.max)) {
        errors[field] = fieldRules.messages?.number || 'Please enter a valid number';
      }
    }
    
    // Min length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = fieldRules.messages?.minLength || `Minimum ${fieldRules.minLength} characters required`;
    }
    
    // Max length validation
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = fieldRules.messages?.maxLength || `Maximum ${fieldRules.maxLength} characters allowed`;
    }
    
    // Custom validation function
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customResult = fieldRules.custom(value, formData);
      if (customResult !== true) {
        errors[field] = customResult || 'Invalid value';
      }
    }
  });
  
  return errors;
};

// Course creation validation rules
export const courseValidationRules = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    messages: {
      required: 'Course title is required',
      minLength: 'Title must be at least 3 characters long',
      maxLength: 'Title cannot exceed 100 characters'
    }
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    messages: {
      required: 'Course description is required',
      minLength: 'Description must be at least 10 characters long',
      maxLength: 'Description cannot exceed 1000 characters'
    }
  },
  category: {
    required: true,
    messages: {
      required: 'Please select a category'
    }
  },
  price: {
    required: true,
    number: true,
    min: 0,
    messages: {
      required: 'Price is required',
      number: 'Price must be a valid number',
      min: 'Price cannot be negative'
    }
  },
  level: {
    required: true,
    messages: {
      required: 'Please select a difficulty level'
    }
  }
};

// User registration validation rules
export const registrationValidationRules = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    messages: {
      required: 'First name is required',
      minLength: 'First name must be at least 2 characters long',
      maxLength: 'First name cannot exceed 50 characters'
    }
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    messages: {
      required: 'Last name is required',
      minLength: 'Last name must be at least 2 characters long',
      maxLength: 'Last name cannot exceed 50 characters'
    }
  },
  email: {
    required: true,
    email: true,
    messages: {
      required: 'Email address is required',
      email: 'Please enter a valid email address'
    }
  },
  password: {
    required: true,
    password: true,
    minLength: 6,
    messages: {
      required: 'Password is required',
      password: 'Password must be at least 6 characters long',
      minLength: 'Password must be at least 6 characters long'
    }
  },
  role: {
    required: true,
    messages: {
      required: 'Please select your role'
    }
  }
};

// Login validation rules
export const loginValidationRules = {
  email: {
    required: true,
    email: true,
    messages: {
      required: 'Email address is required',
      email: 'Please enter a valid email address'
    }
  },
  password: {
    required: true,
    messages: {
      required: 'Password is required'
    }
  }
};
